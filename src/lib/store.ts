'use client';

import { useState, useEffect, createContext, useContext, createElement, type ReactNode } from 'react';
import { Report, UserProfile, Quest, Reward, NotificationItem, Comment } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const supabase = createClient();

const defaultProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  points: 0,
  level: 'Pemula',
  xp: 0,
  nextLevelXp: 100,
  streakDays: 0,
  trustScore: 100,
  impactCount: 0,
  totalReports: 0,
  completedReports: 0,
  totalUpvotesReceived: 0,
  badges: [],
};

const freshQuestsTemplate: Quest[] = [
  { id: 'q-1', title: 'Pelapor Harian', description: 'Buat 1 laporan masalah kota hari ini', rewardPoints: 15, progress: 0, target: 1, type: 'daily', isClaimed: false, expiresIn: '8 jam lagi' },
  { id: 'q-2', title: 'Verifikator Komunitas', description: 'Berikan upvote pada 3 laporan warga lain', rewardPoints: 10, progress: 0, target: 3, type: 'daily', isClaimed: false, expiresIn: '8 jam lagi' },
  { id: 'q-3', title: 'Penjelajah Kecamatan', description: 'Laporkan masalah di 2 kecamatan berbeda', rewardPoints: 50, progress: 0, target: 2, type: 'weekly', isClaimed: false, expiresIn: '4 hari lagi' },
  { id: 'q-4', title: 'Bulan Bersih Sampah', description: 'Ikuti tantangan tematik pelaporan sampah liar', rewardPoints: 100, progress: 0, target: 5, type: 'seasonal', isClaimed: false, expiresIn: '12 hari lagi' },
];

const defaultRewardsTemplate: Reward[] = [
  {
    id: 'r-cert',
    title: 'E-Sertifikat Kontributor Fasilitas Publik',
    category: 'Apresiasi Digital',
    pointsCost: 100,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    partnerName: 'Pemerintah Kota & LaporKuy',
    description: 'Sertifikat digital resmi ber-QR verifikasi atas partisipasi aktif mengawal perbaikan fasilitas publik kota.'
  },
  {
    id: 'r-badge',
    title: 'Bingkai Emas Profil & Titel Warga Peduli',
    category: 'Titel & Badge',
    pointsCost: 120,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    partnerName: 'Komunitas Warga LaporKuy',
    description: 'Membuka lencana kehormatan dan bingkai emas di profil akun Anda sebagai pelapor aktif fasilitas kota.'
  },
  {
    id: 'r-tree',
    title: 'Adopsi 1 Bibit Pohon Penghijauan Kota',
    category: 'Dampak Sosial',
    pointsCost: 180,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
    partnerName: 'Dinas Lingkungan Hidup & Aksi Hijau',
    description: 'Satu bibit pohon produktif akan ditanam dan dirawat atas nama Anda dalam program penghijauan kota.'
  },
  {
    id: 'r-fasttrack',
    title: 'Voucher Jalur Prioritas Layanan Publik',
    category: 'Layanan Publik',
    pointsCost: 250,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    partnerName: 'Mall Pelayanan Publik & Pemda',
    description: 'Akses antrean prioritas jalur cepat pengurusan administrasi kependudukan di loket pelayanan terpadu.'
  },
  {
    id: 'r-rec',
    title: 'Surat Pengakuan Kontribusi Warga Aktif',
    category: 'Apresiasi Digital',
    pointsCost: 350,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=80',
    partnerName: 'Pusat Aspirasi & Partisipasi Publik',
    description: 'Dokumen pengesahan rekam jejak kepedulian sipil yang dapat dilampirkan untuk portofolio & beasiswa.'
  }
];

// ── Store return type ──
interface LaporKuyStoreValue {
  reports: Report[];
  profile: UserProfile;
  quests: Quest[];
  rewards: Reward[];
  notifications: NotificationItem[];
  isInitialized: boolean;
  isLoggedIn: boolean;
  addReport: (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => Promise<Report>;
  toggleUpvote: (reportId: string) => Promise<void>;
  addComment: (reportId: string, content: string) => Promise<void>;
  updateReportStatus: (reportId: string, newStatus: Report['status'], notes?: string, afterPhotoUrl?: string) => Promise<void>;
  claimQuest: (questId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  markNotificationsRead: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
}

// ── React Context ──
const LaporKuyContext = createContext<LaporKuyStoreValue | null>(null);

/**
 * Provider component — wrap your app/layout with this ONCE.
 * All children share the same store state.
 */
export function LaporKuyStoreProvider({ children }: { children: ReactNode }) {
  const store = useLaporKuyStoreInternal();
  return createElement(LaporKuyContext.Provider, { value: store }, children);
}

/**
 * Public hook — every component calls this to read/write store.
 * Reads from context so every caller sees the SAME state.
 */
export function useLaporKuyStore(): LaporKuyStoreValue {
  const ctx = useContext(LaporKuyContext);
  if (!ctx) {
    throw new Error('useLaporKuyStore must be used within <LaporKuyStoreProvider>');
  }
  return ctx;
}

// ── Internal implementation (called only once inside the Provider) ──
function useLaporKuyStoreInternal(): LaporKuyStoreValue {
  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('laporkuy_local_reports');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return [];
  });

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(defaultRewardsTemplate);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Safety fallback: ensure loading screen ('MEMVERIFIKASI SESI...') never hangs indefinitely
    const initTimer = setTimeout(() => {
      if (isMounted) setIsInitialized(true);
    }, 1200);

    async function loadData() {
      // Check auth session first
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      if (isMounted) setIsLoggedIn(!!session);

      try {
        // Fetch public data
        const [
          { data: reportsData },
          { data: rewardsData }
        ] = await Promise.all([
          supabase.from('reports').select('*, comments(*)').order('created_at', { ascending: false }),
          supabase.from('rewards').select('*')
        ]);

        if (reportsData && reportsData.length > 0) {
          const mappedRemote = reportsData.map((r: any) => ({
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
          }));

          setReports(prev => {
            const remoteIds = new Set(mappedRemote.map((r: any) => r.id));
            const localOnly = prev.filter(r => !remoteIds.has(r.id));
            const merged = [...localOnly, ...mappedRemote];
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('laporkuy_local_reports', JSON.stringify(merged.slice(0, 50)));
              } catch (e) {}
            }
            return merged;
          });
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
          const googleAvatar = meta.avatar_url || meta.picture || meta.avatar || '';
          const googleName = meta.full_name || meta.name || '';

          const getInitialsAvatar = (nameStr: string) =>
            `https://ui-avatars.com/api/?name=${encodeURIComponent(nameStr || 'User')}&background=003B73&color=fff&bold=true`;

          // If no profile row in profiles table yet (brand new registration / Google OAuth sign-in)
          if (!profileData && session?.user) {
            const userName = googleName || session.user.email?.split('@')[0] || 'Pengguna LaporKuy';
            profileData = {
              id: userId,
              name: userName,
              email: session.user.email || '',
              phone: meta.phone || session.user.phone || '',
              avatar: googleAvatar || getInitialsAvatar(userName),
              points: 0,
              xp: 0,
              level: 'Pemula',
              streak_days: 0,
              trust_score: 100,
              total_reports: 0,
              completed_reports: 0,
              total_upvotes_received: 0,
            };

            // Auto insert fresh row into Supabase profiles table for brand new user
            try {
              await supabase.from('profiles').upsert({
                id: userId,
                name: profileData.name,
                email: profileData.email,
                avatar: profileData.avatar,
                phone: profileData.phone,
                points: 0,
                xp: 0,
                level: 'Pemula',
              });
            } catch (e) {
              console.warn("Profiles auto-insert warning:", e);
            }
          } else if (profileData && session?.user) {
            if (googleAvatar && (!profileData.avatar || profileData.avatar.includes('/images/avatars/'))) {
              profileData.avatar = googleAvatar;
            } else if (!profileData.avatar || profileData.avatar.includes('/images/avatars/')) {
              profileData.avatar = getInitialsAvatar(profileData.name || googleName || 'User');
            }

            if ((!profileData.name || profileData.name === 'Pengguna LaporKuy') && googleName) {
              profileData.name = googleName;
            }
          }

          // Check user-scoped profile override in localStorage
          if (profileData && typeof window !== 'undefined') {
            const localOverride = localStorage.getItem(`laporkuy_profile_override_${userId}`);
            if (localOverride) {
              try {
                const parsed = JSON.parse(localOverride);
                profileData = { ...profileData, ...parsed };
              } catch (e) {}
            }
          }

          // User-scoped quest progress loading
          let userQuests = freshQuestsTemplate;
          if (typeof window !== 'undefined') {
            const savedQuests = localStorage.getItem(`laporkuy_quests_${userId}`);
            if (savedQuests) {
              try {
                const parsed = JSON.parse(savedQuests);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  userQuests = freshQuestsTemplate.map(fq => {
                    const match = parsed.find((p: any) => p.id === fq.id);
                    return match ? { ...fq, ...match } : fq;
                  });
                }
              } catch (e) {}
            }
          }
          setQuests(userQuests);

          if (profileData) {
            let savedPoints = profileData.points !== undefined && profileData.points !== null ? profileData.points : 0;
            let savedXp = profileData.xp !== undefined && profileData.xp !== null ? profileData.xp : 0;

            if (typeof window !== 'undefined') {
              const localSaved = localStorage.getItem(`laporkuy_points_v3_${profileData.id}`);
              if (localSaved) {
                try {
                  const parsed = JSON.parse(localSaved);
                  if (parsed.points !== undefined && parsed.points > savedPoints) savedPoints = parsed.points;
                  if (parsed.xp !== undefined && parsed.xp > savedXp) savedXp = parsed.xp;
                } catch (e) {}
              }
            }

            let currentLevel = profileData.level || (savedXp >= 2000 ? 'Legenda Kota' : savedXp >= 1000 ? 'Pahlawan Kota' : savedXp >= 300 ? 'Warga Aktif' : 'Pemula');

            setProfile({
              ...profileData,
              points: savedPoints,
              xp: savedXp,
              level: currentLevel,
              nextLevelXp: profileData.next_level_xp || 300,
              streakDays: profileData.streak_days ?? profileData.streakDays ?? 0,
              trustScore: profileData.trust_score ?? profileData.trustScore ?? 100,
              impactCount: profileData.impact_count ?? profileData.impactCount ?? 0,
              totalReports: profileData.total_reports ?? profileData.totalReports ?? 0,
              completedReports: profileData.completed_reports ?? profileData.completedReports ?? 0,
              totalUpvotesReceived: profileData.total_upvotes_received ?? profileData.totalUpvotesReceived ?? 0,
              badges: profileData.badges || []
            } as UserProfile);
          }

          if (notifsData && notifsData.length > 0) {
            setNotifications(notifsData.map((n: any) => ({
              ...n,
              isRead: n.is_read
            })));
          }
        } else {
          // If not logged in, maintain local demo user state so existing local preview isn't reset
          setProfile(defaultProfile);
          setQuests(freshQuestsTemplate);
        }
      } catch (err) {
        console.error("Failed to load from Supabase, using fresh initial fallback", err);
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

    const channelName = `public:reports:${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
         loadData();
      })
      .subscribe();

    const handleSync = () => {
      loadData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('laporkuy_store_update', handleSync);
    }

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('laporkuy_store_update', handleSync);
      }
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

    setReports(prev => {
      const updated = [newReport, ...prev.filter(r => r.id !== newReport.id)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('laporkuy_local_reports', JSON.stringify(updated.slice(0, 50)));
        } catch (e) {}
      }
      return updated;
    });

    await supabase.from('reports').insert({
      id: newReport.id,
      title: newReport.title,
      category: newReport.category,
      severity: newReport.severity,
      address: newReport.address,
      district: newReport.district || 'Kec. Wonokromo',
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

    const newTotal = (profile.totalReports || 0) + 1;
    const newCompleted = (profile.completedReports || 0) + 1;

    setProfile(prev => ({
      ...prev,
      totalReports: newTotal,
      completedReports: newCompleted
    }));

    // Update quest progress dynamically & persist to user-scoped localStorage
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === 'q-1') {
          const newProgress = 1;
          const wasCompleted = q.progress >= q.target;
          if (!wasCompleted && newProgress >= q.target) {
            toast.success('Misi Selesai!', {
              description: 'Misi Pelapor Harian selesai. Buka menu Misi untuk mengklaim +15 Poin Anda!',
              id: 'quest-completed-q-1'
            });
          }
          return { ...q, progress: newProgress };
        }
        if (q.id === 'q-3') {
          const newProgress = Math.min(q.target, q.progress + 1);
          const wasCompleted = q.progress >= q.target;
          if (!wasCompleted && newProgress >= q.target) {
            toast.success('Misi Selesai!', {
              description: 'Misi Penjelajah Kecamatan selesai. Buka menu Misi untuk mengklaim +50 Poin Anda!',
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
        if (profile.id) {
          localStorage.setItem(`laporkuy_quests_${profile.id}`, JSON.stringify(updated));
        }
        window.dispatchEvent(new Event('laporkuy_store_update'));
      }
      return updated;
    });

    try {
      await supabase.from('profiles').update({
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
          if (profile.id) {
            localStorage.setItem(`laporkuy_quests_${profile.id}`, JSON.stringify(updated));
          }
          window.dispatchEvent(new Event('laporkuy_store_update'));
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
    
    if (typeof window !== 'undefined' && profile.id) {
      localStorage.setItem(`laporkuy_quests_${profile.id}`, JSON.stringify(updatedQuests));
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

    toast.dismiss(`quest-completed-${questId}`);

    toast.success('Poin Berhasil Diklaim', {
      description: `+${reward} Poin telah ditambahkan ke akun Anda (Total: ${newPoints} Pts)`,
      id: `quest-claimed-${questId}`
    });

    if (typeof window !== 'undefined') {
      if (profile.id) {
        localStorage.setItem(`laporkuy_points_v3_${profile.id}`, JSON.stringify({
          points: newPoints,
          xp: newXp,
          level: currentLevel
        }));
      }
      window.dispatchEvent(new Event('laporkuy_store_update'));
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

    const newStock = Math.max(0, reward.stock - 1);
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: newStock } : r));
    const newPoints = profile.points - reward.pointsCost;
    setProfile(prev => ({ ...prev, points: newPoints }));

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const claimCode = `LK-${rewardId.replace('r-', '').toUpperCase()}-${randomSuffix}`;

    if (typeof window !== 'undefined' && profile.id) {
      localStorage.setItem(`laporkuy_points_v3_${profile.id}`, JSON.stringify({
        points: newPoints,
        xp: profile.xp,
        level: profile.level
      }));

      try {
        const historyKey = `laporkuy_reward_history_${profile.id}`;
        const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newRecord = {
          id: `red-${Date.now()}`,
          rewardId: reward.id,
          title: reward.title,
          category: reward.category,
          pointsCost: reward.pointsCost,
          partnerName: reward.partnerName,
          code: claimCode,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
        localStorage.setItem(historyKey, JSON.stringify([newRecord, ...existing]));
      } catch (e) {}

      window.dispatchEvent(new Event('laporkuy_store_update'));
    }

    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Penukaran Berhasil: ${reward.title}`,
      message: `Selamat! Anda menukar ${reward.pointsCost} Pts. Kode verifikasi Anda: ${claimCode}. Klik notifikasi ini untuk membuka petunjuk cara pakai dan melihat sertifikat/manfaat resmi Anda.`,
      timestamp: new Date().toISOString(),
      type: 'reward',
      link: `/tukar-poin?code=${claimCode}`,
      isRead: false,
    };
    setNotifications(prev => [notifItem, ...prev]);

    try {
      await Promise.all([
        supabase.from('rewards').update({ stock: newStock }).eq('id', rewardId),
        supabase.from('profiles').update({ points: newPoints }).eq('id', profile.id),
        supabase.from('notifications').insert({
          user_id: profile.id,
          title: notifItem.title,
          message: notifItem.message,
          type: notifItem.type,
          link: notifItem.link,
          is_read: false
        })
      ]);
    } catch (e) {
      console.error("Error updating redemption in supabase:", e);
    }
    
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
    setProfile(defaultProfile);
    setQuests([]);
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
