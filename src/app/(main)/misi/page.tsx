'use client';

import { useState } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle2, Gift, Flame, Sparkles, Clock } from 'lucide-react';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';

export default function MisiPage() {
  const { quests, claimQuest, profile } = useLaporKuyStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClaim = (questId: string) => {
    claimQuest(questId);
    setShowConfetti(true);
  };

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');
  const seasonalQuests = quests.filter((q) => q.type === 'seasonal');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      <ConfettiOverlay show={showConfetti} />

      {/* Header */}
      <div className="text-center space-y-3 relative mb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[400px] rounded-full bg-amber-500/20 blur-[100px] -z-10 animate-[pulse-glow_4s_ease-in-out_infinite]" />
        <Badge className="px-4 py-1.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 backdrop-blur-sm">
          🎯 Quest & Tantangan Warga
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 tracking-tight">
          Misi Kamu Hari Ini
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          Selesaikan quest harian & mingguan untuk mendapatkan bonus poin reward dan percepat kenaikan level!
        </p>
      </div>

      {/* Daily Quests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" /> Quest Harian
          </h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Reset dalam 8 Jam
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {dailyQuests.map((quest) => {
            const isCompleted = quest.progress >= quest.target;
            const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

            return (
              <Card key={quest.id} className="p-6 glass-card hover-lift flex flex-col justify-between space-y-5 border-border/40 relative overflow-hidden group">
                {isCompleted && !quest.isClaimed && (
                  <div className="absolute inset-0 bg-amber-500/5 z-0 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                )}
                <div className="space-y-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-base text-foreground group-hover:text-amber-500 transition-colors">{quest.title}</h3>
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs shadow-sm font-bold ml-2 shrink-0">
                      +{quest.rewardPoints} Pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{quest.description}</p>

                  {/* Gamified Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>Progres</span>
                      <span className={isCompleted ? "text-amber-500" : ""}>{quest.progress} / {quest.target}</span>
                    </div>
                    <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden shadow-inner border border-border/50">
                      <div
                        className={`h-full transition-all duration-1000 ease-out relative overflow-hidden ${isCompleted ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-primary to-teal-400'}`}
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 -skew-x-12 translate-x-10 group-hover:-translate-x-32 transition-transform duration-1000" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  {quest.isClaimed ? (
                    <Button disabled size="sm" className="w-full text-xs font-bold gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4" /> Diklaim
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!isCompleted}
                      onClick={() => handleClaim(quest.id)}
                      className={`w-full text-xs font-bold gap-1.5 shadow-md transition-all ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:-translate-y-0.5' 
                          : 'bg-muted text-muted-foreground border border-border/50'
                      }`}
                    >
                      <Gift className="h-4 w-4" />
                      {isCompleted ? 'Klaim Bonus Poin' : 'Selesaikan Misi'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weekly & Seasonal Quests */}
      <div className="space-y-4 pt-4 border-t">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" /> Tantangan Mingguan & Musiman
        </h2>

        <div className="space-y-4">
          {[...weeklyQuests, ...seasonalQuests].map((quest) => {
            const isCompleted = quest.progress >= quest.target;

            return (
              <Card key={quest.id} className="p-5 glass border-border/40 hover:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-300 group">
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-base text-foreground group-hover:text-purple-500 transition-colors">{quest.title}</h3>
                    <Badge variant="outline" className={`text-xs font-semibold backdrop-blur-sm ${quest.type === 'seasonal' ? 'border-purple-500/30 text-purple-500 bg-purple-500/5' : 'border-blue-500/30 text-blue-500 bg-blue-500/5'}`}>
                      {quest.type === 'seasonal' ? '✨ Event Tematik' : '📅 Mingguan'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-border/50 sm:border-t-0 pt-4 sm:pt-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400 block mb-0.5">
                      +{quest.rewardPoints} Poin
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      <span className={isCompleted ? "text-emerald-500" : ""}>{quest.progress}</span>/{quest.target} Selesai
                    </span>
                  </div>

                  {quest.isClaimed ? (
                    <Button disabled size="sm" className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Terklaim
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!isCompleted}
                      onClick={() => handleClaim(quest.id)}
                      className={`text-xs font-bold shadow-md transition-all ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:-translate-y-0.5' 
                          : 'bg-muted text-muted-foreground border border-border/50'
                      }`}
                    >
                      Klaim Reward
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
