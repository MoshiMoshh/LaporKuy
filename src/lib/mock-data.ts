import { Report, UserProfile, LeaderboardUser, DistrictRank, Quest, Reward, NotificationItem, DinasScorecard } from '@/types';

export const initialReports: Report[] = [];

export const mockUserProfile: UserProfile = {
  id: 'usr-001',
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  phone: '+62 812-3456-7890',
  avatar: '/images/avatars/budi.jpg',
  points: 485,
  level: 'Pahlawan Kota',
  xp: 1480,
  nextLevelXp: 2000,
  streakDays: 7,
  trustScore: 98,
  impactCount: 1240,
  totalReports: 18,
  completedReports: 15,
  totalUpvotesReceived: 142,
  badges: [
    {
      id: 'b-1',
      name: 'Pelapor Pertama',
      description: 'Membuat laporan pertama yang terverifikasi',
      icon: '🎯',
      rarity: 'Common',
      unlockedAt: '2026-07-10'
    },
    {
      id: 'b-2',
      name: 'Mata Elang',
      description: 'Menemukan 10 masalah infrastruktur dengan AI akurasi >95%',
      icon: '🦅',
      rarity: 'Rare',
      unlockedAt: '2026-08-01'
    },
    {
      id: 'b-3',
      name: 'Penjaga Kota',
      description: 'Aktif melaporkan masalah 7 hari berturut-turut',
      icon: '🔥',
      rarity: 'Epic',
      unlockedAt: '2026-08-25'
    },
    {
      id: 'b-4',
      name: 'Legenda Civic',
      description: 'Laporanmu membantu lebih dari 1.000 warga',
      icon: '👑',
      rarity: 'Legendary',
      unlockedAt: '2026-08-27'
    }
  ]
};

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'usr-005', name: 'Dr. Hendra Wijaya', avatar: '/images/avatars/budi.jpg', level: 'Legenda Kota', points: 1450, reportsCount: 42, district: 'Kec. Gubeng' },
  { rank: 2, id: 'usr-001', name: 'Budi Santoso (Kamu)', avatar: '/images/avatars/budi.jpg', level: 'Pahlawan Kota', points: 485, reportsCount: 18, district: 'Kec. Wonokromo', isCurrentUser: true },
  { rank: 3, id: 'usr-006', name: 'Maya Putri', avatar: '/images/avatars/budi.jpg', level: 'Pahlawan Kota', points: 440, reportsCount: 16, district: 'Kec. Tegalsari' },
  { rank: 4, id: 'usr-007', name: 'Rahmat Hidayat', avatar: '/images/avatars/budi.jpg', level: 'Warga Aktif', points: 390, reportsCount: 14, district: 'Kec. Sukolilo' },
  { rank: 5, id: 'usr-008', name: 'Nadia Salsabila', avatar: '/images/avatars/budi.jpg', level: 'Warga Aktif', points: 350, reportsCount: 12, district: 'Kec. Rungkut' },
  { rank: 6, id: 'usr-009', name: 'Irwan Setiawan', avatar: '/images/avatars/budi.jpg', level: 'Warga Aktif', points: 310, reportsCount: 11, district: 'Kec. Wonokromo' },
];

export const mockDistrictRanks: DistrictRank[] = [
  { rank: 1, districtName: 'Kec. Wonokromo', totalReports: 245, resolvedPercentage: 94, activeCitizens: 128, score: 980 },
  { rank: 2, districtName: 'Kec. Gubeng', totalReports: 210, resolvedPercentage: 92, activeCitizens: 115, score: 920 },
  { rank: 3, districtName: 'Kec. Sukolilo', totalReports: 185, resolvedPercentage: 89, activeCitizens: 98, score: 860 },
  { rank: 4, districtName: 'Kec. Tegalsari', totalReports: 160, resolvedPercentage: 88, activeCitizens: 84, score: 810 },
  { rank: 5, districtName: 'Kec. Rungkut', totalReports: 140, resolvedPercentage: 85, activeCitizens: 72, score: 750 },
];

export const mockQuests: Quest[] = [
  { id: 'q-1', title: 'Pelapor Harian', description: 'Buat 1 laporan masalah kota hari ini', rewardPoints: 15, progress: 1, target: 1, type: 'daily', isClaimed: false, expiresIn: '8 jam lagi' },
  { id: 'q-2', title: 'Verifikator Komunitas', description: 'Berikan upvote pada 3 laporan warga lain', rewardPoints: 10, progress: 2, target: 3, type: 'daily', isClaimed: false, expiresIn: '8 jam lagi' },
  { id: 'q-3', title: 'Penjelajah Kecamatan', description: 'Laporkan masalah di 2 kecamatan berbeda', rewardPoints: 50, progress: 1, target: 2, type: 'weekly', isClaimed: false, expiresIn: '4 hari lagi' },
  { id: 'q-4', title: 'Bulan Bersih Sampah', description: 'Ikuti tantangan tematik pelaporan sampah liar', rewardPoints: 100, progress: 3, target: 5, type: 'seasonal', isClaimed: false, expiresIn: '12 hari lagi' },
];

export const mockRewards: Reward[] = [
  { id: 'r-1', title: 'Voucher Tokopedia Rp 25.000', category: 'Voucher', pointsCost: 200, stock: 15, partnerName: 'Tokopedia', imageUrl: '/images/reports/pothole.jpg', description: 'Voucher belanja digital tanpa minimal transaksi.' },
  { id: 'r-2', title: 'Pulsa Seluler / E-Wallet Rp 50.000', category: 'Pulsa/E-wallet', pointsCost: 380, stock: 8, partnerName: 'GoPay / OVO / Telkomsel', imageUrl: '/images/reports/pothole.jpg', description: 'Bisa langsung ditransfer ke nomor GoPay, OVO, ShopeePay, atau isi pulsa.' },
  { id: 'r-3', title: 'Tumbler Eksklusif #LaporKuy', category: 'Merchandise', pointsCost: 500, stock: 5, partnerName: 'LaporKuy Official Store', imageUrl: '/images/reports/pothole.jpg', description: 'Tumbler stainless steel 500ml tahan panas & dingin dengan gravir namamu.' },
  { id: 'r-4', title: 'Fast-Track Layanan Pemkot', category: 'Layanan Prioritas', pointsCost: 650, stock: 10, partnerName: 'Pemkot Surabaya', imageUrl: '/images/reports/pothole.jpg', description: 'Jalur prioritas antrean pelayanan administratif di Mal Pelayanan Publik.' }
];

export const mockNotifications: NotificationItem[] = [
  { id: 'n-1', title: 'Selamat Datang di LaporKuy!', message: 'Ayo mulai laporkan masalah infrastruktur di sekitarmu dan bantu wujudkan kota yang lebih baik.', timestamp: '2026-08-20T08:30:00Z', type: 'system', isRead: false, link: '/buat-laporan' },
  { id: 'n-2', title: 'Lengkapi Profil Anda', message: 'Tambahkan foto profil dan lengkapi data diri Anda agar laporan lebih mudah divalidasi oleh dinas terkait.', timestamp: '2026-08-20T08:35:00Z', type: 'system', isRead: false, link: '/profil' }
];

export const mockDinasScorecard: DinasScorecard[] = [
  { id: 'd-1', dinasName: 'Dinas Bina Marga & Sumber Daya Air', totalAssigned: 450, totalResolved: 428, avgResponseTimeHours: 14.5, slaCompliancePercentage: 95.1, rating: 4.9 },
  { id: 'd-2', dinasName: 'Dinas Perhubungan (Dishub)', totalAssigned: 310, totalResolved: 295, avgResponseTimeHours: 18.2, slaCompliancePercentage: 94.0, rating: 4.8 },
  { id: 'd-3', dinasName: 'Dinas Lingkungan Hidup (DLH)', totalAssigned: 280, totalResolved: 260, avgResponseTimeHours: 12.0, slaCompliancePercentage: 92.8, rating: 4.7 },
  { id: 'd-4', dinasName: 'DPRKPCK (Perumahan & Pemukiman)', totalAssigned: 190, totalResolved: 172, avgResponseTimeHours: 28.4, slaCompliancePercentage: 88.5, rating: 4.5 },
];
