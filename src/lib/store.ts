'use client';

import { useState, useEffect } from 'react';
import { Report, UserProfile, Quest, Reward, NotificationItem, Comment } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { mockUserProfile, initialReports, mockQuests, mockRewards, mockNotifications } from './mock-data';
import { useAuthStore } from './auth-store';
import { toast } from 'sonner';

const supabase = createClient();

// No mock user anymore, using Supabase Auth

export function useLaporKuyStore() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('laporkuy_notifs_read') === 'true') {
      return mockNotifications.map(n => ({ ...n, isRead: true }));
    }
    return mockNotifications;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Check auth session first
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      setIsLoggedIn(!!session);

      try {
        // Fetch public data
        const [
          { data: reportsData },
          { data: questsData },
          { data: rewardsData }
        ] = await Promise.all([
          supabase.from('reports').select('*, comments(*)').order('created_at', { ascending: false }),
          supabase.from('quests').select('*'),
          supabase.from('rewards').select('*')
        ]);

        if (reportsData && reportsData.length > 0) {
          setReports(reportsData.map((r: any) => ({
            ...r,
            photoUrl: r.photo_url,
            afterPhotoUrl: r.after_photo_url,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            userId: r.user_id,
            userName: r.user_name,
            userAvatar: r.user_avatar,
            isUrgent: r.is_urgent,
            aiAuthenticityScore: r.ai_authenticity_score,
            aiConfidence: r.ai_confidence,
            assignedDinas: r.assigned_dinas,
            slaTargetDays: r.sla_target_days,
            slaDaysRemaining: r.sla_days_remaining,
            comments: (r.comments || []).map((c: any) => ({
               ...c,
               createdAt: c.created_at,
               isOfficial: c.is_official
            }))
          })));
        }

        if (questsData && questsData.length > 0) {
          let mergedQuests = questsData.map((q: any) => ({
            ...q,
            rewardPoints: q.reward_points,
            isClaimed: q.is_claimed,
            expiresIn: q.expires_in
          }));

          if (typeof window !== 'undefined') {
            const savedQuests = localStorage.getItem('laporkuy_quests_v1');
            if (savedQuests) {
              try {
                const parsed = JSON.parse(savedQuests);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  mergedQuests = mergedQuests.map(mq => {
                    const localMatch = parsed.find((p: any) => p.id === mq.id);
                    return localMatch ? { ...mq, ...localMatch } : mq;
                  });
                }
              } catch (e) {}
            }
          }
          setQuests(mergedQuests);
        } else if (typeof window !== 'undefined') {
          const savedQuests = localStorage.getItem('laporkuy_quests_v1');
          if (savedQuests) {
            try {
              const parsed = JSON.parse(savedQuests);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setQuests(parsed);
              }
            } catch (e) {}
          }
        }

        if (rewardsData && rewardsData.length > 0) {
          setRewards(rewardsData.map((r: any) => ({
            ...r,
            pointsCost: r.points_cost,
            imageUrl: r.image_url,
            partnerName: r.partner_name
          })));
        }

        // Fetch user-specific data if logged in
        if (userId) {
          const [{ data: fetchedProfile }, { data: notifsData }] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('notifications').select('*').eq('user_id', userId).order('timestamp', { ascending: false })
          ]);

          let profileData = fetchedProfile;
          const meta = session?.user?.user_metadata || {};
          const googleAvatar = meta.avatar_url || meta.picture || '';
          const googleName = meta.full_name || meta.name || '';

          // If no profile row in profiles table yet (common for Google OAuth sign-in)
          if (!profileData && session?.user) {
            profileData = {
              id: userId,
              name: googleName || session.user.email?.split('@')[0] || 'Pengguna LaporKuy',
              email: session.user.email || '',
              phone: meta.phone || session.user.phone || '',
              avatar: googleAvatar,
              points: 50,
              xp: 150,
              level: 'Pemula',
            };

            // Auto insert row into Supabase profiles table
            try {
              await supabase.from('profiles').upsert({
                id: userId,
                name: profileData.name,
                email: profileData.email,
                avatar: profileData.avatar,
                phone: profileData.phone,
              });
            } catch (e) {
              console.warn("Profiles auto-insert warning:", e);
            }
          } else if (profileData && session?.user) {
            // Update profileData with Google avatar/name if present and missing in DB
            if (!profileData.avatar && googleAvatar) {
              profileData.avatar = googleAvatar;
            }
            if ((!profileData.name || profileData.name === 'Pengguna LaporKuy') && googleName) {
              profileData.name = googleName;
            }
          }

          // Check if there is a local profile override in localStorage for this user
          if (profileData && typeof window !== 'undefined') {
            const localOverride = localStorage.getItem(`laporkuy_profile_override_${userId}`);
            if (localOverride) {
              try {
                const parsed = JSON.parse(localOverride);
                profileData = { ...profileData, ...parsed };
              } catch (e) {}
            }
          }

          if (profileData) {
            let savedPoints = profileData.points || 0;
            let savedXp = profileData.xp || 0;

            if (typeof window !== 'undefined') {
              const localSaved = localStorage.getItem(`laporkuy_points_v3_${profileData.id}`);
              if (localSaved) {
                try {
                  const parsed = JSON.parse(localSaved);
                  if (parsed.points > savedPoints) savedPoints = parsed.points;
                  if (parsed.xp > savedXp) savedXp = parsed.xp;
                } catch (e) {}
              }
            }

            // Sum points from any claimed quests
            const currentQuests = questsData && questsData.length > 0 
              ? questsData.map((q: any) => ({ ...q, rewardPoints: q.reward_points, isClaimed: q.is_claimed })) 
              : quests;

            const claimedPointsSum = currentQuests
              .filter((q: any) => q.isClaimed)
              .reduce((sum: number, q: any) => sum + (q.rewardPoints || 15), 0);

            if (claimedPointsSum > savedPoints) {
              savedPoints = claimedPointsSum;
            }

            let currentLevel = profileData.level || 'Pemula';
            if (savedXp >= 2000) currentLevel = 'Legenda Kota';
            else if (savedXp >= 1000) currentLevel = 'Pahlawan Kota';
            else if (savedXp >= 300) currentLevel = 'Warga Aktif';

            setProfile({
              ...profileData,
              points: savedPoints,
              xp: savedXp,
              level: currentLevel,
              nextLevelXp: profileData.next_level_xp || 2000,
              streakDays: profileData.streak_days || 0,
              trustScore: profileData.trust_score || 100,
              impactCount: profileData.impact_count || 0,
              totalReports: profileData.total_reports || 0,
              completedReports: profileData.completed_reports || 0,
              totalUpvotesReceived: profileData.total_upvotes_received || 0
            } as UserProfile);
          }

          if (notifsData && notifsData.length > 0) {
            setNotifications(notifsData.map((n: any) => ({
              ...n,
              isRead: n.is_read
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load from Supabase, using mock data fallback", err);
      }

      setIsInitialized(true);
    }
    
    loadData();

    // Listen to auth state changes to reload data automatically (e.g. after login)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadData();
      }
    });

    // Setup realtime listener for reports (optional but cool)
    // Using a unique channel name prevents errors during React StrictMode double-mounts
    const channelName = `public:reports:${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
         loadData(); // Re-fetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const addReport = async (newReportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newReport: Report = {
      ...newReportData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      upvotes: 1, 
      comments: [],
      hasUpvoted: true,
      slaTargetDays: 3,
      slaDaysRemaining: 3,
      assignedDinas: newReportData.assignedDinas || 'Dinas Bina Marga & Sumber Daya Air'
    };

    setReports(prev => [newReport, ...prev]);

    const authUser = useAuthStore.getState().user;
    const actualUserId = authUser?.id || profile.id;

    await supabase.from('reports').insert({
      id: newReport.id,
      title: newReport.title,
      category: newReport.category,
      severity: newReport.severity,
      address: newReport.address,
      district: newReport.district,
      lat: newReport.lat,
      lng: newReport.lng,
      photo_url: newReport.photoUrl,
      description: newReport.description,
      status: newReport.status,
      user_id: actualUserId,
      user_name: authUser?.user_metadata?.full_name || profile.name,
      user_avatar: authUser?.user_metadata?.avatar_url || profile.avatar,
      upvotes: 1,
      is_urgent: newReport.isUrgent || false,
      assigned_dinas: newReport.assignedDinas,
      sla_target_days: newReport.slaTargetDays,
      sla_days_remaining: newReport.slaDaysRemaining,
      created_at: now,
      updated_at: now
    });

    const newPoints = (profile.points || 0) + 15;
    const newXp = (profile.xp || 0) + 25;
    const newTotal = (profile.totalReports || 0) + 1;
    const newCompleted = (profile.completedReports || 0) + 1;

    setProfile(prev => ({
      ...prev,
      points: newPoints,
      xp: newXp,
      totalReports: newTotal,
      completedReports: newCompleted
    }));

    // Update quest progress dynamically & persist to localStorage
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === 'q-1') {
          const newProgress = 1;
          const wasCompleted = q.progress >= q.target;
          if (!wasCompleted && newProgress >= q.target) {
            toast.success('Misi Selesai', {
              description: 'Pelapor Harian • Klaim +15 Poin di menu Misi',
              id: 'quest-completed-q-1'
            });
          }
          return { ...q, progress: newProgress };
        }
        if (q.id === 'q-3') {
          const newProgress = Math.min(q.target, q.progress + 1);
          const wasCompleted = q.progress >= q.target;
          if (!wasCompleted && newProgress >= q.target) {
            toast.success('Misi Selesai', {
              description: 'Penjelajah Kecamatan • Klaim +50 Poin di menu Misi',
              id: 'quest-completed-q-3'
            });
          }
          return { ...q, progress: newProgress };
        }
        if (q.id === 'q-4' && newReportData.category === 'Sampah') {
          const newProgress = Math.min(q.target, q.progress + 1);
          const wasCompleted = q.progress >= q.target;
          if (!wasCompleted && newProgress >= q.target) {
            toast.success('Misi Selesai', {
              description: 'Bulan Bersih Sampah • Klaim +100 Poin di menu Misi',
              id: 'quest-completed-q-4'
            });
          }
          return { ...q, progress: newProgress };
        }
        return q;
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('laporkuy_quests_v1', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await supabase.from('profiles').update({
        points: newPoints,
        xp: newXp,
        total_reports: newTotal,
        completed_reports: newCompleted
      }).eq('id', profile.id);
    } catch (e) {
      console.error("Error updating profile in supabase", e);
    }
    
    return newReport;
  };

  const toggleUpvote = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const isUpvoted = !report.hasUpvoted;
    const newUpvotes = isUpvoted ? report.upvotes + 1 : Math.max(0, report.upvotes - 1);

    setReports(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: newUpvotes, hasUpvoted: isUpvoted } : r));

    if (isUpvoted) {
      setQuests(prev => {
        const updated = prev.map(q => {
          if (q.id === 'q-2') {
            const newProgress = Math.min(q.target, q.progress + 1);
            const wasCompleted = q.progress >= q.target;
            if (!wasCompleted && newProgress >= q.target) {
              toast.success('Misi Selesai', {
                description: 'Verifikator Komunitas • Klaim +10 Poin di menu Misi',
                id: 'quest-completed-q-2'
              });
            }
            return { ...q, progress: newProgress };
          }
          return q;
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('laporkuy_quests_v1', JSON.stringify(updated));
        }
        return updated;
      });
    }

    await supabase.from('reports').update({ upvotes: newUpvotes }).eq('id', reportId);
  };

  const addComment = async (reportId: string, content: string) => {
    const newId = `c-${Date.now()}`;
    const now = new Date().toISOString();

    const newComment: Comment = {
      id: newId,
      author: profile.name,
      role: 'warga',
      avatar: profile.avatar,
      content,
      createdAt: now
    };

    setReports(prev => prev.map(r => r.id === reportId ? { ...r, comments: [...r.comments, newComment] } : r));

    await supabase.from('comments').insert({
      id: newId,
      report_id: reportId,
      author: newComment.author,
      role: newComment.role,
      avatar: newComment.avatar,
      content: newComment.content,
      created_at: now,
      is_official: false
    });
  };

  const updateReportStatus = async (reportId: string, newStatus: Report['status'], notes?: string, afterPhotoUrl?: string) => {
    const now = new Date().toISOString();
    
    // Update local state directly for fast UI updates
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const newComments = notes ? [...r.comments, {
          id: `c-admin-${Date.now()}`,
          author: 'Admin LaporKuy',
          role: 'admin' as const,
          content: `Status diubah menjadi "${newStatus}". Catatan: ${notes}`,
          createdAt: now,
          isOfficial: true
        }] : r.comments;

        return { ...r, status: newStatus, updatedAt: now, afterPhotoUrl: afterPhotoUrl || r.afterPhotoUrl, comments: newComments };
      }
      return r;
    }));
    
    await supabase.from('reports').update({
       status: newStatus,
       updated_at: now,
       after_photo_url: afterPhotoUrl || null
    }).eq('id', reportId);

    if (notes) {
      await supabase.from('comments').insert({
        id: `c-admin-${Date.now()}`,
        report_id: reportId,
        author: 'Admin LaporKuy',
        role: 'admin',
        content: `Status diubah menjadi "${newStatus}". Catatan: ${notes}`,
        created_at: now,
        is_official: true
      });
    }
  };

  const claimQuest = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isClaimed) return;

    const reward = quest.rewardPoints || 15;
    const bonusXp = reward * 2;

    const updatedQuests = quests.map(q => q.id === questId ? { ...q, isClaimed: true, progress: q.target } : q);
    setQuests(updatedQuests);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('laporkuy_quests_v1', JSON.stringify(updatedQuests));
    }

    const newPoints = (profile.points || 0) + reward;
    const newXp = (profile.xp || 0) + bonusXp;

    let currentLevel = profile.level;
    if (newXp >= 2000) currentLevel = 'Legenda Kota';
    else if (newXp >= 1000) currentLevel = 'Pahlawan Kota';
    else if (newXp >= 300) currentLevel = 'Warga Aktif';

    setProfile(prev => ({
      ...prev,
      points: newPoints,
      xp: newXp,
      level: currentLevel
    }));

    toast.success('Poin Berhasil Diklaim', {
      description: `+${reward} Poin telah ditambahkan ke akun Anda (Total: ${newPoints} Pts)`,
      id: `quest-claimed-${questId}`
    });

    if (typeof window !== 'undefined' && profile.id) {
      localStorage.setItem(`laporkuy_points_v3_${profile.id}`, JSON.stringify({
        points: newPoints,
        xp: newXp,
        level: currentLevel
      }));
    }

    try {
      await supabase.from('quests').update({ is_claimed: true, progress: quest.target }).eq('id', questId);
      await supabase.from('profiles').update({ points: newPoints, xp: newXp }).eq('id', profile.id);
    } catch (e) {
      console.error("Error updating claimQuest in supabase", e);
    }
  };

  const redeemReward = async (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.stock <= 0 || profile.points < reward.pointsCost) return false;

    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: r.stock - 1 } : r));
    const newPoints = profile.points - reward.pointsCost;
    setProfile(prev => ({ ...prev, points: newPoints }));

    await supabase.from('rewards').update({ stock: reward.stock - 1 }).eq('id', rewardId);
    await supabase.from('profiles').update({ points: newPoints }).eq('id', profile.id);
    
    return true;
  };

  const markNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (typeof window !== 'undefined') {
      localStorage.setItem('laporkuy_notifs_read', 'true');
    }
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updatedData };
      if (typeof window !== 'undefined' && newProfile.id) {
        localStorage.setItem(`laporkuy_profile_override_${newProfile.id}`, JSON.stringify({
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          avatar: newProfile.avatar,
        }));
      }
      return newProfile;
    });

    // 1. Sync update with Supabase Auth User Metadata (crucial for Google/OAuth logins)
    try {
      await supabase.auth.updateUser({
        data: {
          name: updatedData.name,
          full_name: updatedData.name,
          avatar_url: updatedData.avatar,
          phone: updatedData.phone,
        }
      });
    } catch (e) {
      console.warn("Supabase auth updateUser metadata warning:", e);
    }

    // 2. Upsert into Supabase DB profiles table (works even if row did not exist prior)
    if (profile.id) {
      const dbUpdate: any = { id: profile.id };
      if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
      if (updatedData.email !== undefined) dbUpdate.email = updatedData.email;
      if (updatedData.avatar !== undefined) dbUpdate.avatar = updatedData.avatar;
      if (updatedData.phone !== undefined) dbUpdate.phone = updatedData.phone;
      
      try {
        await supabase.from('profiles').upsert(dbUpdate);
      } catch (e) {
        console.warn("Supabase profiles upsert warning:", e);
      }
    }
  };

  const login = () => { /* Now handled by login page OAuth flow */ };
  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProfile(mockUserProfile); // reset
  };

  return {
    reports,
    profile,
    quests,
    rewards,
    notifications,
    isInitialized,
    isLoggedIn,
    addReport,
    toggleUpvote,
    addComment,
    updateReportStatus,
    claimQuest,
    redeemReward,
    markNotificationsRead,
    updateProfile,
    login,
    logout,
  };
}
