'use client';

import { useState, useEffect } from 'react';
import { Report, UserProfile, Quest, Reward, NotificationItem, Comment } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { mockUserProfile, initialReports, mockQuests, mockRewards, mockNotifications } from './mock-data';

const supabase = createClient();

// mock user for demo if not logged in (to match initial mock data)
const MOCK_USER_ID = 'usr-001';

export function useLaporKuyStore() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      const userId = MOCK_USER_ID; 

      try {
        const [
          { data: reportsData },
          { data: profileData },
          { data: questsData },
          { data: rewardsData },
          { data: notifsData }
        ] = await Promise.all([
          supabase.from('reports').select('*, comments(*)').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('quests').select('*'),
          supabase.from('rewards').select('*'),
          supabase.from('notifications').select('*').eq('user_id', userId).order('timestamp', { ascending: false })
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

        if (profileData) {
          setProfile({
            ...profileData,
            nextLevelXp: profileData.next_level_xp,
            streakDays: profileData.streak_days,
            trustScore: profileData.trust_score,
            impactCount: profileData.impact_count,
            totalReports: profileData.total_reports,
            completedReports: profileData.completed_reports,
            totalUpvotesReceived: profileData.total_upvotes_received
          } as UserProfile);
        }

        if (questsData && questsData.length > 0) {
          setQuests(questsData.map((q: any) => ({
            ...q,
            rewardPoints: q.reward_points,
            isClaimed: q.is_claimed,
            expiresIn: q.expires_in
          })));
        }

        if (rewardsData && rewardsData.length > 0) {
          setRewards(rewardsData.map((r: any) => ({
            ...r,
            pointsCost: r.points_cost,
            imageUrl: r.image_url,
            partnerName: r.partner_name
          })));
        }

        if (notifsData && notifsData.length > 0) {
          setNotifications(notifsData.map((n: any) => ({
            ...n,
            isRead: n.is_read
          })));
        }
      } catch (err) {
        console.error("Failed to load from Supabase, using mock data fallback", err);
      }

      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsInitialized(true);
    }
    
    loadData();

    // Setup realtime listener for reports (optional but cool)
    const channel = supabase.channel('public:reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
         loadData(); // Re-fetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      user_id: profile.id,
      user_name: profile.name,
      user_avatar: profile.avatar,
      upvotes: 1,
      is_urgent: newReport.isUrgent || false,
      assigned_dinas: newReport.assignedDinas,
      sla_target_days: newReport.slaTargetDays,
      sla_days_remaining: newReport.slaDaysRemaining,
      created_at: now,
      updated_at: now
    });

    const newPoints = profile.points + 15;
    const newXp = profile.xp + 25;
    setProfile(prev => ({ ...prev, points: newPoints, xp: newXp, totalReports: prev.totalReports + 1 }));
    await supabase.from('profiles').update({
        points: newPoints,
        xp: newXp,
        total_reports: profile.totalReports + 1
    }).eq('id', profile.id);
    
    return newReport;
  };

  const toggleUpvote = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const isUpvoted = !report.hasUpvoted;
    const newUpvotes = isUpvoted ? report.upvotes + 1 : Math.max(0, report.upvotes - 1);

    setReports(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: newUpvotes, hasUpvoted: isUpvoted } : r));

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

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, isClaimed: true } : q));
    const newPoints = profile.points + quest.rewardPoints;
    setProfile(prev => ({ ...prev, points: newPoints }));

    await supabase.from('quests').update({ is_claimed: true }).eq('id', questId);
    await supabase.from('profiles').update({ points: newPoints }).eq('id', profile.id);
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
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
    
    const dbUpdate: any = {};
    if (updatedData.name) dbUpdate.name = updatedData.name;
    if (updatedData.avatar) dbUpdate.avatar = updatedData.avatar;
    if (updatedData.phone) dbUpdate.phone = updatedData.phone;
    
    if (Object.keys(dbUpdate).length > 0) {
      await supabase.from('profiles').update(dbUpdate).eq('id', profile.id);
    }
  };

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

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
