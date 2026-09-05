'use client';

import { useState } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { Reward } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, CheckCircle2, X, Coins, Zap } from 'lucide-react';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';

export default function TukarPoinPage() {
  const { profile, rewards, redeemReward } = useLaporKuyStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    const success = await redeemReward(selectedReward.id);

    if (success) {
      setShowConfetti(true);
      setRedeemSuccess(`Berhasil menukar ${selectedReward.pointsCost} poin untuk ${selectedReward.title}. Kode voucher dikirim ke notifikasi!`);
      setSelectedReward(null);
    } else {
      alert('Poin Anda tidak mencukupi atau stok reward telah habis.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-28 font-sans">
      <ConfettiOverlay show={showConfetti} />

      {/* 1. Compact Balance Header Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mx-4 my-3 flex items-center justify-between shadow-sm">
        {/* Sisi Kiri: Info Saldo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-600 shrink-0">
            <Coins className="w-5 h-5 fill-amber-500/20 text-amber-600" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Total Poin Kamu
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {profile.points} Pts
              </span>
              <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                {profile.level}
              </span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Tombol Riwayat */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
        >
          <History className="w-3.5 h-3.5" />
          <span>Riwayat</span>
        </button>
      </div>

      {redeemSuccess && (
        <div className="mx-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{redeemSuccess}</span>
          </div>
          <button
            onClick={() => setRedeemSuccess(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. Horizontal Tab Filter */}
      <div className="px-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 pb-1 shrink-0 min-w-max">
          {[
            { id: 'all', label: 'Semua Reward' },
            { id: 'Voucher', label: 'Voucher Belanja' },
            { id: 'Pulsa/E-wallet', label: 'E-Wallet / Pulsa' },
            { id: 'Merchandise', label: 'Merchandise' },
            { id: 'Layanan Prioritas', label: 'Layanan Prioritas' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1 & 2. Single Column Horizontal List Card (Sama Persis Card Misi) */}
      <div className="flex flex-col gap-3 px-4 pb-28">
        {filteredRewards.map((item) => {
          const canAfford = profile.points >= item.pointsCost;
          const pointsNeeded = item.pointsCost - profile.points;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-3.5 flex items-center gap-3 transition-shadow hover:shadow-md"
            >
              {/* 2 & 3. Sisi Kiri: Thumbnail Container (w-14 h-14 rounded-xl + Floating Chip Stock) */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative border border-slate-100 dark:border-slate-700/60">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-900/70 text-white backdrop-blur-xs">
                  {item.stock > 0 ? `Sisa ${item.stock}` : 'Habis'}
                </span>
              </div>

              {/* 1 & 2. Sisi Tengah: Text Info (line-clamp-2 flex-1 min-w-0 pr-2) */}
              <div className="flex-1 min-w-0 pr-2 space-y-0.5">
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  {item.category === 'Pulsa/E-wallet' ? 'E-WALLET' : item.category.toUpperCase()}
                </span>
                <h3 className="line-clamp-2 leading-tight text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h3>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono pt-0.5">
                  <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600 shrink-0" />
                  <span>{item.pointsCost} Pts</span>
                </div>
              </div>

              {/* 2. Sisi Kanan: Action CTA (shrink-0 min-w-[76px]) */}
              <div className="shrink-0">
                {item.stock <= 0 ? (
                  <button
                    disabled
                    className="px-2.5 py-1.5 min-w-[76px] text-center text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Stok Habis
                  </button>
                ) : !canAfford ? (
                  <button
                    disabled
                    className="px-2.5 py-1.5 min-w-[76px] text-center text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Kurang {pointsNeeded}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedReward(item)}
                    className="px-3.5 py-1.5 min-w-[76px] text-center text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-all"
                  >
                    Tukar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <Card className="max-w-sm w-full p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Konfirmasi Penukaran
              </h3>
              <button
                onClick={() => setSelectedReward(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
              <img
                src={selectedReward.imageUrl}
                alt={selectedReward.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80';
                }}
                className="h-14 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  {selectedReward.partnerName}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {selectedReward.title}
                </h4>
                <span className="text-xs font-bold text-amber-600 font-mono mt-0.5 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-600" /> {selectedReward.pointsCost} Pts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReward(null)}
                className="flex-1 h-9 text-xs font-semibold border-slate-200 dark:border-slate-800 rounded-xl"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRedeem}
                className="flex-1 h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl"
              >
                Tukar Sekarang
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <Card className="max-w-md w-full p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" /> Riwayat Penukaran Poin
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Voucher Belanja Tokopedia Rp 25.000</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">25 Agustus 2026 • Kode: LPR-TKP-8821</span>
                </div>
                <span className="font-bold text-amber-600 font-mono shrink-0">-200 Pts</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoryModal(false)}
              className="w-full h-9 text-xs font-semibold rounded-xl"
            >
              Tutup
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
