export type ReportStatus = 'Pending' | 'Terverifikasi' | 'Diproses' | 'Selesai' | 'Ditolak';

export type ReportCategory = 'Jalan Rusak' | 'Lampu Mati' | 'Sampah' | 'Banjir' | 'Trotoar Rusak' | 'Fasilitas Umum';

export type SeverityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Comment {
  id: string;
  author: string;
  role: 'warga' | 'dinas' | 'admin';
  avatar?: string;
  content: string;
  createdAt: string;
  isOfficial?: boolean;
}

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  severity: SeverityLevel;
  address: string;
  district: string; // Kecamatan
  lat: number;
  lng: number;
  photoUrl: string;
  afterPhotoUrl?: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  upvotes: number;
  isUrgent?: boolean;
  aiAuthenticityScore?: number; // 0 - 100%
  aiConfidence?: number; // 0 - 100%
  assignedDinas?: string;
  slaTargetDays?: number;
  slaDaysRemaining?: number;
  comments: Comment[];
  hasUpvoted?: boolean;
  hasFollowed?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  points: number;
  level: 'Pemula' | 'Warga Aktif' | 'Pahlawan Kota' | 'Legenda Kota';
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  trustScore: number; // 0 - 100%
  impactCount: number; // Jumlah warga yang terbantu
  totalReports: number;
  completedReports: number;
  totalUpvotesReceived: number;
  badges: BadgeItem[];
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: string;
  points: number;
  reportsCount: number;
  district: string;
  isCurrentUser?: boolean;
}

export interface DistrictRank {
  rank: number;
  districtName: string;
  totalReports: number;
  resolvedPercentage: number;
  activeCitizens: number;
  score: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  progress: number;
  target: number;
  type: 'daily' | 'weekly' | 'seasonal';
  isClaimed: boolean;
  expiresIn?: string;
}

export interface Reward {
  id: string;
  title: string;
  category: 'Voucher' | 'Pulsa/E-wallet' | 'Merchandise' | 'Layanan Prioritas';
  pointsCost: number;
  stock: number;
  imageUrl: string;
  partnerName: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'status' | 'community' | 'reward' | 'system';
  isRead: boolean;
  link?: string;
}

export interface DinasScorecard {
  id: string;
  dinasName: string;
  totalAssigned: number;
  totalResolved: number;
  avgResponseTimeHours: number;
  slaCompliancePercentage: number;
  rating: number;
}
