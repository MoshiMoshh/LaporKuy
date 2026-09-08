'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, UserCheck, Star, Trophy, Award } from 'lucide-react';
import { LeaderboardUser, DistrictRank } from '@/types';
import { createClient } from '@/lib/supabase/client';
// Diverse, high-quality avatar photos for distinct users
const weeklyLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'usr-001', name: 'Budi Santoso (Kamu)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 280, reportsCount: 7, district: 'Kec. Wonokromo', isCurrentUser: true },
  { rank: 2, id: 'usr-006', name: 'Maya Putri', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 210, reportsCount: 5, district: 'Kec. Tegalsari' },
  { rank: 3, id: 'usr-005', name: 'Dr. Hendra Wijaya', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', level: 'Legenda Kota', points: 195, reportsCount: 4, district: 'Kec. Gubeng' },
  { rank: 4, id: 'usr-007', name: 'Rahmat Hidayat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 160, reportsCount: 4, district: 'Kec. Sukolilo' },
  { rank: 5, id: 'usr-008', name: 'Nadia Salsabila', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 140, reportsCount: 3, district: 'Kec. Rungkut' },
  { rank: 6, id: 'usr-009', name: 'Irwan Setiawan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 110, reportsCount: 2, district: 'Kec. Wonokromo' },
];

const monthlyLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'usr-005', name: 'Dr. Hendra Wijaya', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', level: 'Legenda Kota', points: 1450, reportsCount: 42, district: 'Kec. Gubeng' },
  { rank: 2, id: 'usr-001', name: 'Budi Santoso (Kamu)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 485, reportsCount: 18, district: 'Kec. Wonokromo', isCurrentUser: true },
  { rank: 3, id: 'usr-006', name: 'Maya Putri', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 440, reportsCount: 16, district: 'Kec. Tegalsari' },
  { rank: 4, id: 'usr-007', name: 'Rahmat Hidayat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 390, reportsCount: 14, district: 'Kec. Sukolilo' },
  { rank: 5, id: 'usr-008', name: 'Nadia Salsabila', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 350, reportsCount: 12, district: 'Kec. Rungkut' },
  { rank: 6, id: 'usr-009', name: 'Irwan Setiawan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 310, reportsCount: 11, district: 'Kec. Wonokromo' },
];

const alltimeLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'usr-005', name: 'Dr. Hendra Wijaya', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', level: 'Legenda Kota', points: 4850, reportsCount: 142, district: 'Kec. Gubeng' },
  { rank: 2, id: 'usr-006', name: 'Maya Putri', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 3920, reportsCount: 98, district: 'Kec. Tegalsari' },
  { rank: 3, id: 'usr-001', name: 'Budi Santoso (Kamu)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', level: 'Pahlawan Kota', points: 2485, reportsCount: 78, district: 'Kec. Wonokromo', isCurrentUser: true },
  { rank: 4, id: 'usr-007', name: 'Rahmat Hidayat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 2100, reportsCount: 64, district: 'Kec. Sukolilo' },
  { rank: 5, id: 'usr-008', name: 'Nadia Salsabila', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 1850, reportsCount: 52, district: 'Kec. Rungkut' },
  { rank: 6, id: 'usr-009', name: 'Irwan Setiawan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', level: 'Warga Aktif', points: 1420, reportsCount: 41, district: 'Kec. Wonokromo' },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('monthly');
  const [activeTab, setActiveTab] = useState<'users' | 'districts'>('users');
  const [districtRanks, setDistrictRanks] = useState<DistrictRank[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('district_ranks').select('*').order('rank', { ascending: true }).then(({ data }) => {
      if (data && data.length > 0) {
        setDistrictRanks(data.map((d: any) => ({
          ...d,
          districtName: d.district_name,
          totalReports: d.total_reports,
          resolvedPercentage: d.resolved_percentage,
          activeCitizens: d.active_citizens,
          imageUrl: d.image_url,
        })));
      }
    });
  }, []);

  const currentLeaderboardData = period === 'weekly' 
    ? weeklyLeaderboard 
    : period === 'alltime' 
    ? alltimeLeaderboard 
    : monthlyLeaderboard;

  const top3 = currentLeaderboardData.slice(0, 3);
  const restRank = currentLeaderboardData.slice(3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold text-primary border-primary/30 bg-primary/5 rounded-full">
          Papan Peringkat & Kontribusi Warga
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Peringkat Partisipasi Kota
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Apresiasi resmi untuk warga dan kecamatan paling aktif dalam melaporkan serta mengawal perbaikan fasilitas publik.
        </p>
      </div>

      {/* Main Tabs & Period Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          <Button
            size="sm"
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="text-xs font-bold flex-1 sm:flex-initial rounded-lg"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-primary-foreground" />
            Pelapor Perorangan
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'districts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('districts')}
            className="text-xs font-bold flex-1 sm:flex-initial rounded-lg"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Kinerja Kecamatan
          </Button>
        </div>

        {activeTab === 'users' && (
          <div className="flex items-center gap-1 text-xs bg-muted/50 p-1 rounded-xl border border-border/50 max-w-full overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              type="button"
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${period === 'weekly' ? 'bg-background text-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Mingguan
            </button>
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${period === 'monthly' ? 'bg-background text-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setPeriod('alltime')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${period === 'alltime' ? 'bg-background text-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sepanjang Waktu
            </button>
          </div>
        )}
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          {/* TOP 3 PODIUM - MATCHED UI LIGHT/DARK ADAPTIVE CARDS */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 items-end pt-2 pb-2">
            {/* RANK 2 */}
            {top3[1] && (
              <Card className="p-3 sm:p-5 text-center border-border bg-card text-card-foreground rounded-2xl shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-center mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs font-semibold">
                      <Award className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>Juara 2</span>
                    </span>
                  </div>
                  <div className="relative inline-block mb-2">
                    <img src={top3[1].avatar} alt={top3[1].name} className="h-14 w-14 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border-2 border-slate-300 dark:border-slate-600 shadow-sm" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-foreground truncate px-1" title={top3[1].name}>{top3[1].name}</h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium block truncate mt-0.5">{top3[1].district}</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-border/60">
                  <span className="text-xs sm:text-sm font-extrabold text-foreground block">
                    {top3[1].points.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">Poin</span>
                  </span>
                </div>
              </Card>
            )}

            {/* RANK 1 (CENTER - ELEVATED) */}
            {top3[0] && (
              <Card className="p-3.5 sm:p-6 text-center border-amber-400/70 bg-gradient-to-b from-amber-500/10 via-card to-card text-card-foreground rounded-2xl shadow-md relative -translate-y-1.5 flex flex-col justify-between hover:shadow-lg transition-all ring-1 ring-amber-400/20">
                <div>
                  <div className="flex items-center justify-center mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-extrabold shadow-sm border border-amber-300">
                      <Trophy className="w-3 h-3 text-slate-950 shrink-0" />
                      <span>Juara 1</span>
                    </span>
                  </div>
                  <div className="relative inline-block mb-2">
                    <img src={top3[0].avatar} alt={top3[0].name} className="h-16 w-16 sm:h-24 sm:w-24 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-md ring-4 ring-amber-500/20" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-base text-foreground truncate px-1" title={top3[0].name}>{top3[0].name}</h3>
                  <span className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-semibold block truncate mt-0.5">{top3[0].level}</span>
                  <span className="text-[10px] text-muted-foreground block truncate">{top3[0].district}</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-amber-500/20">
                  <span className="text-xs sm:text-base font-black text-amber-600 dark:text-amber-400 block">
                    {top3[0].points.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">Poin</span>
                  </span>
                </div>
              </Card>
            )}

            {/* RANK 3 */}
            {top3[2] && (
              <Card className="p-3 sm:p-5 text-center border-border bg-card text-card-foreground rounded-2xl shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-center mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[10px] sm:text-xs font-semibold">
                      <Star className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>Juara 3</span>
                    </span>
                  </div>
                  <div className="relative inline-block mb-2">
                    <img src={top3[2].avatar} alt={top3[2].name} className="h-14 w-14 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border-2 border-amber-700/40 dark:border-amber-500/40 shadow-sm" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-foreground truncate px-1" title={top3[2].name}>{top3[2].name}</h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium block truncate mt-0.5">{top3[2].district}</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-border/60">
                  <span className="text-xs sm:text-sm font-extrabold text-foreground block">
                    {top3[2].points.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">Poin</span>
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* LIST RANKS #4+ MATCHING THEME */}
          <Card className="border-border/60 overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/20 border-b px-5 py-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Peringkat Kontributor</span>
                <span>Poin & Aktivitas</span>
              </div>
            </CardHeader>
            <div className="divide-y border-border/40">
              {restRank.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    user.isCurrentUser ? 'bg-primary/10 font-bold border-l-4 border-l-primary' : 'hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Clean numeric circle adapted to theme */}
                    <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {user.rank}
                    </div>
                    <img src={user.avatar} className="h-10 w-10 rounded-full object-cover border border-border shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                        {user.name}
                        {user.isCurrentUser && (
                          <Badge className="bg-primary text-white text-[9px] px-1.5 py-0 font-semibold">Kamu</Badge>
                        )}
                      </h4>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {user.level} • {user.district}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-foreground block">
                      {user.points.toLocaleString()} Poin
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {user.reportsCount} Laporan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* DISTRICT RANKING TAB */
        <Card className="border-border/60 overflow-hidden shadow-sm">
          <CardHeader className="bg-muted/20 border-b px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Peringkat Kinerja & Partisipasi Kecamatan
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statistik tingkat penyelesaian aduan publik dan keaktifan warga di wilayah kecamatan.
            </p>
          </CardHeader>

          <div className="divide-y border-border/40">
            {districtRanks.length > 0 ? districtRanks.map((dist) => (
              <div key={dist.rank} className="p-3.5 sm:p-5 flex items-center justify-between gap-2 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                  {/* Clean Rank Number Circle */}
                  <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {dist.rank}
                  </div>

                  {/* Clean District Photo Thumbnail */}
                  <img
                    src={dist.imageUrl || 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=500&auto=format&fit=crop&q=80'}
                    alt={dist.districtName}
                    className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl object-cover border border-border/80 shadow-sm shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {dist.districtName}
                      </h4>
                      {dist.rank === 1 && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0 shrink-0">
                          Terbaik
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 block truncate">
                      {dist.totalReports} Laporan • {dist.activeCitizens} Warga
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      {dist.resolvedPercentage}% Selesai
                    </span>
                    <span className="text-[10px] text-muted-foreground">Tingkat Penanganan</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 sm:px-3 py-1 font-bold shrink-0">
                    {dist.score} Pts
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">
                <MapPin className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">Belum ada data kecamatan.</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
