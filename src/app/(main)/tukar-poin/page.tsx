'use client';

import { useState } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { Reward } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, ShoppingBag, CheckCircle2, AlertCircle, History } from 'lucide-react';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';

export default function TukarPoinPage() {
  const { profile, rewards, redeemReward } = useLaporKuyStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    const success = await redeemReward(selectedReward.id);

    if (success) {
      setShowConfetti(true);
      setRedeemSuccess(`Selamat! Kamu berhasil menukar ${selectedReward.pointsCost} poin untuk ${selectedReward.title}. Kode voucher telah dikirim ke notifikasimu!`);
      setSelectedReward(null);
    } else {
      alert('Poin kamu tidak mencukupi atau stok reward habis.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      <ConfettiOverlay show={showConfetti} />

      {/* Header & Balance Card */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-amber-500/20 to-transparent blur-3xl" />
        
        <div className="space-y-3 text-center md:text-left relative z-10">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 backdrop-blur-sm font-bold text-xs mb-2 px-3 py-1 animate-[fade-in_0.5s_ease-out]">
            🎁 Rewards Store Official
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Tukarkan Poin LaporKuy
          </h1>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            Apresiasi nyata atas kontribusimu menjaga kota. Poin bisa ditukar dengan pulsa, voucher belanja, atau merchandise eksklusif.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-center min-w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative z-10 hover:bg-white/10 transition-colors">
          <span className="text-xs text-slate-300 block font-medium uppercase tracking-wider">Saldo Poin Kamu</span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 block mt-2 drop-shadow-sm">
            {profile.points}
          </span>
          <span className="text-xs text-emerald-400 font-bold block mt-2 bg-emerald-400/10 py-1 rounded-full border border-emerald-400/20">
            ⭐ Level: {profile.level}
          </span>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setRedeemSuccess(null)}>
            Tutup
          </Button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
        {['all', 'Voucher', 'Pulsa/E-wallet', 'Merchandise', 'Layanan Prioritas'].map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className="text-xs shrink-0"
          >
            {cat === 'all' ? 'Semua Reward' : cat}
          </Button>
        ))}
      </div>

      {/* Reward Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRewards.map((item) => {
          const canAfford = profile.points >= item.pointsCost;

          return (
            <Card key={item.id} className="overflow-hidden glass-card flex flex-col justify-between hover-lift group border-border/40">
              <div>
                <div className="relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <Badge className="absolute top-3 left-3 bg-white/20 text-white border-white/30 backdrop-blur-md text-[10px] font-semibold">
                    {item.partnerName}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-base text-white line-clamp-1 drop-shadow-md">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-4">
                <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                  <span className="font-black text-base text-amber-600 dark:text-amber-400">
                    {item.pointsCost} Pts
                  </span>
                  <Badge variant="outline" className={`text-[10px] ${item.stock <= 5 ? 'text-destructive border-destructive/30 bg-destructive/5' : 'text-muted-foreground'}`}>
                    Sisa: {item.stock}
                  </Badge>
                </div>

                <Button
                  size="sm"
                  disabled={!canAfford || item.stock <= 0}
                  onClick={() => setSelectedReward(item)}
                  className={`w-full text-xs font-bold transition-all duration-300 ${
                    item.stock <= 0
                      ? 'bg-muted text-muted-foreground'
                      : canAfford
                      ? 'bg-gradient-to-r from-primary to-teal-500 text-white hover:shadow-[0_0_15px_rgba(13,148,136,0.5)] hover:-translate-y-0.5'
                      : 'bg-muted/50 text-muted-foreground border border-border/50'
                  }`}
                >
                  {item.stock <= 0
                    ? 'Stok Habis'
                    : canAfford
                    ? 'Tukarkan Poin'
                    : `Kurang ${item.pointsCost - profile.points} Poin`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-md w-full p-6 space-y-5 glass-panel border-border/40 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-foreground">Konfirmasi Penukaran</h3>
              <p className="text-sm text-muted-foreground">
                Apakah kamu yakin ingin menukarkan <strong className="text-amber-600 dark:text-amber-400">{selectedReward.pointsCost} poin</strong> untuk:
              </p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-xl flex items-center gap-4 border border-border/50">
              <img src={selectedReward.imageUrl} className="h-16 w-16 rounded-lg object-cover shadow-sm" />
              <div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">{selectedReward.title}</h4>
                <Badge variant="outline" className="mt-1 text-[10px] bg-muted/50">
                  {selectedReward.partnerName}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedReward(null)} className="font-bold">
                Batal
              </Button>
              <Button size="sm" onClick={handleConfirmRedeem} className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:shadow-[0_0_20px_rgba(13,148,136,0.5)] transition-all">
                Tukar Sekarang
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
