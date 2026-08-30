import { Report, UserProfile, LeaderboardUser, DistrictRank, Quest, Reward, NotificationItem, DinasScorecard } from '@/types';

export const initialReports: Report[] = [
  {
    id: 'REP-1001',
    title: 'Lubang Jalan Besar Berbahaya di Jl. Raya Darmo',
    category: 'Jalan Rusak',
    severity: 9,
    address: 'Jl. Raya Darmo No. 42, Wonokromo, Surabaya',
    district: 'Kec. Wonokromo',
    lat: -7.2891,
    lng: 112.7385,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    description: 'Lubang sedalam 15cm di lajur kiri. Sangat membahayakan pengendara motor saat malam hari atau ketika tergenang air hujan.',
    status: 'Diproses',
    createdAt: '2026-08-27T09:30:00Z',
    updatedAt: '2026-08-27T14:20:00Z',
    userId: 'usr-001',
    userName: 'Budi Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    upvotes: 42,
    isUrgent: true,
    aiAuthenticityScore: 98,
    aiConfidence: 96,
    assignedDinas: 'Dinas Bina Marga & Sumber Daya Air',
    slaTargetDays: 3,
    slaDaysRemaining: 1,
    comments: [
      {
        id: 'c-1',
        author: 'Siti Rahma',
        role: 'warga',
        content: 'Kemarin sepupu saya hampir jatuh di sini. Harap segera ditambal!',
        createdAt: '2026-08-27T10:15:00Z',
      },
      {
        id: 'c-2',
        author: 'Dinas Bina Marga Kota',
        role: 'dinas',
        isOfficial: true,
        content: 'Tim Unit Reaksi Cepat (URC) sudah dijadwalkan meluncur sore ini untuk penambalan darurat.',
        createdAt: '2026-08-27T14:20:00Z',
      }
    ]
  },
  {
    id: 'REP-1002',
    title: 'Lampu Penerangan Jalan Umum (PJU) Mati',
    category: 'Lampu Mati',
    severity: 6,
    address: 'Jl. Ir. H. Soekarno (MERR), Rungkut, Surabaya',
    district: 'Kec. Rungkut',
    lat: -7.3195,
    lng: 112.7820,
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80',
    description: '3 tiang lampu PJU padam berturut-turut. Gelap gulita di persimpangan jalan.',
    status: 'Selesai',
    createdAt: '2026-08-25T19:00:00Z',
    updatedAt: '2026-08-26T11:00:00Z',
    userId: 'usr-002',
    userName: 'Ahmad Fauzi',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    upvotes: 28,
    isUrgent: false,
    aiAuthenticityScore: 99,
    aiConfidence: 94,
    assignedDinas: 'Dinas Perhubungan',
    slaTargetDays: 2,
    slaDaysRemaining: 0,
    comments: [
      {
        id: 'c-3',
        author: 'Dinas Perhubungan',
        role: 'dinas',
        isOfficial: true,
        content: 'Perbaikan bohlam LED dan jaringan kabel selesai dilaksanakan tgl 26 Aug.',
        createdAt: '2026-08-26T11:00:00Z',
      }
    ]
  },
  {
    id: 'REP-1003',
    title: 'Tumpukan Sampah Liar Menyumbat Selokan',
    category: 'Sampah',
    severity: 8,
    address: 'Jl. Keputih Timur No. 12, Sukolilo, Surabaya',
    district: 'Kec. Sukolilo',
    lat: -7.2945,
    lng: 112.7981,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    description: 'Sampah plastik dan sisa bangunan dibuang sembarangan hingga saluran air tersumbat total.',
    status: 'Terverifikasi',
    createdAt: '2026-08-28T07:15:00Z',
    updatedAt: '2026-08-28T08:00:00Z',
    userId: 'usr-003',
    userName: 'Dewi Lestari',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    upvotes: 19,
    isUrgent: true,
    aiAuthenticityScore: 97,
    aiConfidence: 98,
    assignedDinas: 'Dinas Lingkungan Hidup',
    slaTargetDays: 2,
    slaDaysRemaining: 2,
    comments: []
  },
  {
    id: 'REP-1004',
    title: 'Genangan Air Akibat Drainase Tersumbat',
    category: 'Banjir',
    severity: 7,
    address: 'Jl. Mayjen Sungkono, Dukuh Pakis, Surabaya',
    district: 'Kec. Dukuh Pakis',
    lat: -7.2912,
    lng: 112.7150,
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    description: 'Air menggenang setinggi 30cm pasca hujan deras. Lalu lintas tersendat parah.',
    status: 'Pending',
    createdAt: '2026-08-28T12:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
    userId: 'usr-004',
    userName: 'Rian Hidayat',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    upvotes: 12,
    isUrgent: true,
    aiAuthenticityScore: 95,
    aiConfidence: 92,
    assignedDinas: 'Dinas Sumber Daya Air',
    slaTargetDays: 1,
    slaDaysRemaining: 1,
    comments: []
  },
  {
    id: 'REP-1005',
    title: 'Ubin Trotoar Pemandu Difabel Rusak Parah',
    category: 'Trotoar Rusak',
    severity: 5,
    address: 'Jl. Pemuda No. 15, Genteng, Surabaya',
    district: 'Kec. Genteng',
    lat: -7.2654,
    lng: 112.7482,
    photoUrl: 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=800&auto=format&fit=crop&q=80',
    description: 'Guiding block untuk tunanetra terlepas dan berlubang di dekat halte bus.',
    status: 'Diproses',
    createdAt: '2026-08-26T14:30:00Z',
    updatedAt: '2026-08-27T08:00:00Z',
    userId: 'usr-001',
    userName: 'Budi Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    upvotes: 35,
    isUrgent: false,
    aiAuthenticityScore: 99,
    aiConfidence: 97,
    assignedDinas: 'Dinas Perumahan Rakyat & Kawasan Permukiman',
    slaTargetDays: 4,
    slaDaysRemaining: 2,
    comments: []
  }
];

export const mockUserProfile: UserProfile = {
  id: 'usr-001',
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  phone: '+62 812-3456-7890',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
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
  { rank: 1, id: 'usr-005', name: 'Dr. Hendra Wijaya', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', level: 'Legenda Kota', points: 1450, reportsCount: 42, district: 'Kec. Gubeng' },
  { rank: 2, id: 'usr-001', name: 'Budi Santoso (Kamu)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 485, reportsCount: 18, district: 'Kec. Wonokromo', isCurrentUser: true },
  { rank: 3, id: 'usr-006', name: 'Maya Putri', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 440, reportsCount: 16, district: 'Kec. Tegalsari' },
  { rank: 4, id: 'usr-007', name: 'Rahmat Hidayat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 390, reportsCount: 14, district: 'Kec. Sukolilo' },
  { rank: 5, id: 'usr-008', name: 'Nadia Salsabila', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 350, reportsCount: 12, district: 'Kec. Rungkut' },
  { rank: 6, id: 'usr-009', name: 'Irwan Setiawan', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 310, reportsCount: 11, district: 'Kec. Wonokromo' },
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
  { id: 'r-1', title: 'Voucher Tokopedia Rp 25.000', category: 'Voucher', pointsCost: 200, stock: 15, partnerName: 'Tokopedia', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop&q=80', description: 'Voucher belanja digital tanpa minimal transaksi.' },
  { id: 'r-2', title: 'Pulsa Seluler / E-Wallet Rp 50.000', category: 'Pulsa/E-wallet', pointsCost: 380, stock: 8, partnerName: 'GoPay / OVO / Telkomsel', imageUrl: 'https://images.unsplash.com/photo-1556742049-0a675440263f?w=400&auto=format&fit=crop&q=80', description: 'Bisa langsung ditransfer ke nomor GoPay, OVO, ShopeePay, atau isi pulsa.' },
  { id: 'r-3', title: 'Tumbler Eksklusif #LaporKuy', category: 'Merchandise', pointsCost: 500, stock: 5, partnerName: 'LaporKuy Official Store', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80', description: 'Tumbler stainless steel 500ml tahan panas & dingin dengan gravir namamu.' },
  { id: 'r-4', title: 'Fast-Track Layanan Pemkot', category: 'Layanan Prioritas', pointsCost: 650, stock: 10, partnerName: 'Pemkot Surabaya', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80', description: 'Jalur prioritas antrean pelayanan administratif di Mal Pelayanan Publik.' }
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
