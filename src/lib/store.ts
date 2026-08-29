'use client';

import { useState, useEffect } from 'react';
import { Report, UserProfile, Quest, Reward, NotificationItem, Comment } from '@/types';
import {
  initialReports,
  mockUserProfile,
  mockQuests,
  mockRewards,
  mockNotifications,
} from './mock-data';

const STORAGE_KEYS = {
  REPORTS: 'laporkuy_reports_v2',
  PROFILE: 'laporkuy_profile_v2',
  QUESTS: 'laporkuy_quests_v2',
  REWARDS: 'laporkuy_rewards_v2',
  NOTIFS: 'laporkuy_notifs_v2',
  AUTH: 'laporkuy_auth_v2',
};

// Helper for local storage
function getInitialData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new Event('laporkuy_store_updated'));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}

export function useLaporKuyStore() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data
  useEffect(() => {
    setReports(getInitialData(STORAGE_KEYS.REPORTS, initialReports));
    setProfile(getInitialData(STORAGE_KEYS.PROFILE, mockUserProfile));
    setQuests(getInitialData(STORAGE_KEYS.QUESTS, mockQuests));
    setRewards(getInitialData(STORAGE_KEYS.REWARDS, mockRewards));
    setNotifications(getInitialData(STORAGE_KEYS.NOTIFS, mockNotifications));
    setIsLoggedIn(getInitialData(STORAGE_KEYS.AUTH, false));
    setIsInitialized(true);

    const handleUpdate = () => {
      setReports(getInitialData(STORAGE_KEYS.REPORTS, initialReports));
      setProfile(getInitialData(STORAGE_KEYS.PROFILE, mockUserProfile));
      setQuests(getInitialData(STORAGE_KEYS.QUESTS, mockQuests));
      setRewards(getInitialData(STORAGE_KEYS.REWARDS, mockRewards));
      setNotifications(getInitialData(STORAGE_KEYS.NOTIFS, mockNotifications));
      setIsLoggedIn(getInitialData(STORAGE_KEYS.AUTH, false));
    };

    window.addEventListener('laporkuy_store_updated', handleUpdate);
    return () => window.removeEventListener('laporkuy_store_updated', handleUpdate);
  }, []);

  // Submit new report
  const addReport = (newReportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newReport: Report = {
      ...newReportData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      upvotes: 1, // Auto upvote by creator
      comments: [],
      hasUpvoted: true,
      slaTargetDays: 3,
      slaDaysRemaining: 3,
      assignedDinas: newReportData.assignedDinas || 'Dinas Bina Marga & Sumber Daya Air'
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    saveData(STORAGE_KEYS.REPORTS, updatedReports);

    // Update Profile Points & XP (+15 points for submitting)
    const updatedProfile: UserProfile = {
      ...profile,
      points: profile.points + 15,
      xp: profile.xp + 25,
      totalReports: profile.totalReports + 1,
    };
    setProfile(updatedProfile);
    saveData(STORAGE_KEYS.PROFILE, updatedProfile);

    // Update Daily Quest
    const updatedQuests = quests.map(q => {
      if (q.id === 'q-1') return { ...q, progress: Math.min(q.target, q.progress + 1) };
      return q;
    });
    setQuests(updatedQuests);
    saveData(STORAGE_KEYS.QUESTS, updatedQuests);

    // Add Notification
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: `Laporan #${newId} Terkirim!`,
      message: `Laporan "${newReport.title}" telah diterima & mendapat +15 poin!`,
      timestamp: 'Baru saja',
      type: 'status',
      isRead: false,
      link: `/laporan/${newId}`
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveData(STORAGE_KEYS.NOTIFS, updatedNotifs);

    return newReport;
  };

  // Upvote report
  const toggleUpvote = (reportId: string) => {
    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        const isUpvoted = !r.hasUpvoted;
        return {
          ...r,
          upvotes: isUpvoted ? r.upvotes + 1 : r.upvotes - 1,
          hasUpvoted: isUpvoted
        };
      }
      return r;
    });
    setReports(updatedReports);
    saveData(STORAGE_KEYS.REPORTS, updatedReports);

    // Update quest progress for upvoting
    const updatedQuests = quests.map(q => {
      if (q.id === 'q-2') return { ...q, progress: Math.min(q.target, q.progress + 1) };
      return q;
    });
    setQuests(updatedQuests);
    saveData(STORAGE_KEYS.QUESTS, updatedQuests);
  };

  // Add Comment
  const addComment = (reportId: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      role: 'warga',
      avatar: profile.avatar,
      content,
      createdAt: new Date().toISOString()
    };

    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return { ...r, comments: [...r.comments, newComment] };
      }
      return r;
    });
    setReports(updatedReports);
    saveData(STORAGE_KEYS.REPORTS, updatedReports);
  };

  // Update Admin Status
  const updateReportStatus = (reportId: string, newStatus: Report['status'], notes?: string, afterPhotoUrl?: string) => {
    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        const updatedComments = notes ? [
          ...r.comments,
          {
            id: `c-admin-${Date.now()}`,
            author: 'Admin LaporKuy',
            role: 'admin' as const,
            isOfficial: true,
            content: `Status diubah menjadi "${newStatus}". Catatan: ${notes}`,
            createdAt: new Date().toISOString()
          }
        ] : r.comments;

        return {
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          afterPhotoUrl: afterPhotoUrl || r.afterPhotoUrl,
          comments: updatedComments
        };
      }
      return r;
    });
    setReports(updatedReports);
    saveData(STORAGE_KEYS.REPORTS, updatedReports);
  };

  // Claim Quest
  const claimQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isClaimed) return;

    const updatedQuests = quests.map(q => q.id === questId ? { ...q, isClaimed: true } : q);
    setQuests(updatedQuests);
    saveData(STORAGE_KEYS.QUESTS, updatedQuests);

    const updatedProfile = { ...profile, points: profile.points + quest.rewardPoints };
    setProfile(updatedProfile);
    saveData(STORAGE_KEYS.PROFILE, updatedProfile);
  };

  // Redeem Reward
  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.stock <= 0 || profile.points < reward.pointsCost) return false;

    const updatedRewards = rewards.map(r => r.id === rewardId ? { ...r, stock: r.stock - 1 } : r);
    setRewards(updatedRewards);
    saveData(STORAGE_KEYS.REWARDS, updatedRewards);

    const updatedProfile = { ...profile, points: profile.points - reward.pointsCost };
    setProfile(updatedProfile);
    saveData(STORAGE_KEYS.PROFILE, updatedProfile);

    // Add Notification
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: `Reward Berhasil Ditukar!`,
      message: `Kamu telah menukar ${reward.pointsCost} poin untuk ${reward.title}. Cek email/WhatsApp untuk kode voucher.`,
      timestamp: 'Baru saja',
      type: 'reward',
      isRead: false,
      link: '/tukar-poin'
    };
    setNotifications([newNotif, ...notifications]);
    saveData(STORAGE_KEYS.NOTIFS, [newNotif, ...notifications]);

    return true;
  };

  // Mark all notifications read
  const markNotificationsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifs);
    saveData(STORAGE_KEYS.NOTIFS, updatedNotifs);
  };

  // Update user profile
  const updateProfile = (updatedData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updatedData };
    setProfile(updatedProfile);
    saveData(STORAGE_KEYS.PROFILE, updatedProfile);
  };

  // Auth actions
  const login = () => {
    setIsLoggedIn(true);
    saveData(STORAGE_KEYS.AUTH, true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    saveData(STORAGE_KEYS.AUTH, false);
    // Optionally reset profile to initial state if needed
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
