'use client';

import { useState } from 'react';
import { mockLeaderboard, mockDistrictRanks } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Flame, MapPin, Crown, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('monthly');
  const [activeTab, setActiveTab] = useState<'users' | 'districts'>('users');

  const top3 = mockLeaderboard.slice(0, 3);
  const restRank = mockLeaderboard.slice(3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          🏆 Papan Peringkat Pelapor & Kecamatan
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Pahlawan Kota LaporKuy
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Apresiasi untuk warga dan kecamatan paling aktif yang konsisten menjaga kualitas fasilitas umum kota.
        </p>
      </div>

      {/* Main Tabs & Period Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <Button
            size="sm"
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="text-xs font-bold"
          >
            Pelapor Perorangan
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'districts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('districts')}
            className="text-xs font-bold"
          >
            Kompetisi Kecamatan
          </Button>
        </div>

        {activeTab === 'users' && (
          <div className="flex items-center gap-1 text-xs bg-muted/60 p-1 rounded-lg">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${period === 'weekly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${period === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setPeriod('alltime')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${period === 'alltime' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Sepanjang Waktu
            </button>
          </div>
        )}
      </div>

      {activeTab === 'users' ? (
        <>
          {/* PODIUM TOP 3 */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-4 pb-2">
            {/* RANK 2 - SILVER */}
            {top3[1] && (
              <Card className="p-4 text-center border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50 shadow-md">
                <div className="relative inline-block mb-2">
                  <img src={top3[1].avatar} className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border-2 border-slate-300" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white font-extrabold text-xs px-2 py-0.5 rounded-full shadow">
                    🥈 #2
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1 mt-2">{top3[1].name}</h3>
                <span className="text-[10px] text-muted-foreground block">{top3[1].district}</span>
                <Badge className="mt-2 bg-slate-600 text-white text-[10px]">
                  ⭐ {top3[1].points} Poin
                </Badge>
              </Card>
            )}

            {/* RANK 1 - GOLD */}
            {top3[0] && (
              <Card className="p-5 text-center border-amber-400 bg-gradient-to-b from-amber-500/10 to-transparent shadow-xl relative -translate-y-3">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                  <Crown className="h-7 w-7" />
                </div>
                <div className="relative inline-block mb-2 mt-2">
                  <img src={top3[0].avatar} className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-lg" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow">
                    🥇 #1
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1 mt-2">{top3[0].name}</h3>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block">{top3[0].level}</span>
                <Badge className="mt-2 bg-amber-500 text-white font-bold text-xs">
                  ⭐ {top3[0].points} Poin
                </Badge>
              </Card>
            )}

            {/* RANK 3 - BRONZE */}
            {top3[2] && (
              <Card className="p-4 text-center border-amber-700/40 bg-amber-950/10 shadow-md">
                <div className="relative inline-block mb-2">
                  <img src={top3[2].avatar} className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border-2 border-amber-700" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-extrabold text-xs px-2 py-0.5 rounded-full shadow">
                    🥉 #3
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1 mt-2">{top3[2].name}</h3>
                <span className="text-[10px] text-muted-foreground block">{top3[2].district}</span>
                <Badge className="mt-2 bg-amber-700 text-white text-[10px]">
                  ⭐ {top3[2].points} Poin
                </Badge>
              </Card>
            )}
          </div>

          {/* LIST RANKS 4-100 */}
          <Card className="divide-y border-border/60">
            {restRank.map((user) => (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  user.isCurrentUser ? 'bg-primary/10 font-bold border-l-4 border-l-primary' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6 text-center">#{user.rank}</span>
                  <img src={user.avatar} className="h-10 w-10 rounded-full object-cover border" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {user.name} {user.isCurrentUser && '(Kamu)'}
                    </h4>
                    <span className="text-[10px] text-muted-foreground block">{user.level} • {user.district}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 block">
                    ⭐ {user.points} Poin
                  </span>
                  <span className="text-[10px] text-muted-foreground">{user.reportsCount} Laporan</span>
                </div>
              </div>
            ))}
          </Card>
        </>
      ) : (
        /* DISTRICT RANKING TAB */
        <Card className="divide-y border-border/60">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Peringkat Kinerja & Partisipasi Warga per Kecamatan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {mockDistrictRanks.map((dist) => (
              <div key={dist.rank} className="p-4 flex items-center justify-between hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    dist.rank === 1 ? 'bg-amber-500 text-white' : dist.rank === 2 ? 'bg-slate-400 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    #{dist.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{dist.districtName}</h4>
                    <span className="text-[11px] text-muted-foreground">
                      {dist.totalReports} Laporan • {dist.activeCitizens} Warga Aktif
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                    {dist.resolvedPercentage}% Ter-selesaikan
                  </Badge>
                  <span className="text-xs font-bold text-primary block mt-1">Skor: {dist.score} Pts</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
