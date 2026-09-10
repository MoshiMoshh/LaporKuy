'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Reward } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  History,
  CheckCircle2,
  X,
  Coins,
  Copy,
  Check,
  ShieldCheck,
  Award,
  TreePine,
  FileText,
  Ticket,
  Printer,
  Sparkles,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  QrCode,
  Search
} from 'lucide-react';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';

export default function TukarPoinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Memuat katalog reward...</div>}>
      <TukarPoinContent />
    </Suspense>
  );
}

function TukarPoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  const { profile, rewards, redeemReward } = useLaporKuyStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'katalog' | 'voucher'>('katalog');

  // Verification code input state
  const [inputCode, setInputCode] = useState<string>('');
  const [activeCodeDetail, setActiveCodeDetail] = useState<{
    code: string;
    title: string;
    category: string;
    partnerName: string;
    description: string;
    instructions: string[];
    whereToUse: string;
    rewardType: 'cert' | 'badge' | 'tree' | 'fasttrack' | 'rec' | 'unknown';
  } | null>(null);

  // Interactive Modals
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showVipPassModal, setShowVipPassModal] = useState(false);
  const [showTreeCertificateModal, setShowTreeCertificateModal] = useState(false);
  const [badgeActivated, setBadgeActivated] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && profile.id) {
      const historyKey = `laporkuy_reward_history_${profile.id}`;
      try {
        const saved = JSON.parse(localStorage.getItem(historyKey) || '[]');
        setHistoryList(saved);
      } catch (e) {}

      const isGold = localStorage.getItem(`laporkuy_gold_frame_${profile.id}`) === 'true';
      setBadgeActivated(isGold);
    }
  }, [profile.id, showHistoryModal, redeemSuccess]);

  useEffect(() => {
    if (codeParam) {
      setInputCode(codeParam);
      resolveCodeInfo(codeParam);
      setActiveMainTab('voucher');
    }
  }, [codeParam]);

  // Helper to inspect and resolve any claim code
  const resolveCodeInfo = (codeToInspect: string) => {
    const cleanCode = codeToInspect.trim().toUpperCase();
    if (!cleanCode) return;

    // Check if matching code exists in history
    const matchedHistory = historyList.find(
      (h) => h.code?.toUpperCase() === cleanCode
    );

    let title = matchedHistory?.title || 'Penghargaan Resmi LaporKuy';
    let partnerName = matchedHistory?.partnerName || 'Pemerintah Kota & LaporKuy';
    let category = matchedHistory?.category || 'Apresiasi Digital';
    let rewardType: 'cert' | 'badge' | 'tree' | 'fasttrack' | 'rec' | 'unknown' = 'unknown';

    if (cleanCode.includes('CERT')) {
      rewardType = 'cert';
      title = 'E-Sertifikat Kontributor Fasilitas Publik';
      category = 'Apresiasi Digital';
      partnerName = 'Pemerintah Kota & LaporKuy';
    } else if (cleanCode.includes('BADGE')) {
      rewardType = 'badge';
      title = 'Bingkai Emas Profil & Titel Warga Peduli';
      category = 'Titel & Badge';
      partnerName = 'Komunitas Warga LaporKuy';
    } else if (cleanCode.includes('TREE')) {
      rewardType = 'tree';
      title = 'Adopsi 1 Bibit Pohon Penghijauan Kota';
      category = 'Dampak Sosial';
      partnerName = 'Dinas Lingkungan Hidup & Aksi Hijau';
    } else if (cleanCode.includes('FASTTRACK')) {
      rewardType = 'fasttrack';
      title = 'Voucher Jalur Prioritas Layanan Publik';
      category = 'Layanan Publik';
      partnerName = 'Mall Pelayanan Publik & Pemda';
    } else if (cleanCode.includes('REC')) {
      rewardType = 'rec';
      title = 'Surat Pengakuan Kontribusi Warga Aktif';
      category = 'Apresiasi Digital';
      partnerName = 'Pusat Aspirasi & Partisipasi Publik';
    }

    let whereToUse = '';
    let instructions: string[] = [];

    switch (rewardType) {
      case 'cert':
        whereToUse = 'Dapat langsung dibuka & diunduh di platform ini, atau dilampirkan sebagai portofolio/berkas resmi pengakuan dedikasi warga.';
        instructions = [
          'Kode verifikasi ini adalah Nomor Registrasi Resmi sertifikat Anda yang tercatat di basis data LaporKuy & Pemkot.',
          'Klik tombol "Buka & Cetak E-Sertifikat" di bawah ini untuk melihat dokumen sertifikat ber-barcode resmi.',
          'Sertifikat dapat diunduh (PDF) atau dicetak untuk bukti kepedulian masyarakat, portofolio kerja, atau beasiswa.'
        ];
        break;
      case 'badge':
        whereToUse = 'Digunakan langsung di akun LaporKuy Anda untuk mengaktifkan Bingkai Emas Avatar & Titel Kehormatan.';
        instructions = [
          'Klik tombol "Aktifkan ke Profil Sekarang" di bawah ini.',
          'Sistem akan langsung menerapkan ring emas berkilau dan titel "Warga Peduli" pada foto profil Anda.',
          'Lencana dan bingkai ini terlihat saat Anda membuat laporan, berkomentar, atau tampil di leaderboard.'
        ];
        break;
      case 'tree':
        whereToUse = 'Tercatat di program penghijauan kota oleh Dinas Lingkungan Hidup (DLH).';
        instructions = [
          'Kode ini adalah Nomor Inventaris Bibit Pohon adopsi Anda.',
          'Bibit pohon produktif akan ditanam di area Ruang Terbuka Hijau (RTH) kota dengan pelat nama Anda.',
          'Klik tombol "Lihat Akta Adopsi Pohon" di bawah untuk melihat rincian penanaman dan koordinat lokasi tanam.'
        ];
        break;
      case 'fasttrack':
        whereToUse = 'Ditunjukkan langsung di loket pendaftaran Mall Pelayanan Publik (MPP) atau Kantor Kecamatan.';
        instructions = [
          'Kunjungi Mall Pelayanan Publik (MPP) atau loket dinas mitra.',
          'Tunjukkan tiket akses / kode ini kepada petugas resepsionis antrean.',
          'Petugas akan memindai barcode / menginput kode untuk menerbitkan nomor antrean Jalur Cepat (Fast Track).'
        ];
        break;
      default:
        whereToUse = 'Gunakan kode ini saat diminta oleh petugas layanan atau lampirkan pada verifikasi berkas resmi.';
        instructions = [
          'Simpan kode ini sebagai bukti sah penukaran reward.',
          'Gunakan untuk verifikasi keabsahan dokumen kepedulian sipil Anda.'
        ];
    }

    setActiveCodeDetail({
      code: cleanCode,
      title,
      category,
      partnerName,
      description: matchedHistory?.description || 'Penghargaan resmi atas dedikasi dan kepedulian Anda terhadap fasilitas publik kota.',
      whereToUse,
      instructions,
      rewardType
    });
  };

  // Handle URL search parameter `?code=...`
  useEffect(() => {
    if (codeParam) {
      setInputCode(codeParam);
      resolveCodeInfo(codeParam);
    }
  }, [codeParam, historyList]);

  const categories = [
    { id: 'all', label: 'Semua Reward' },
    { id: 'Apresiasi Digital', label: 'Apresiasi Digital' },
    { id: 'Titel & Badge', label: 'Titel & Profil' },
    { id: 'Dampak Sosial', label: 'Dampak Sosial' },
    { id: 'Layanan Publik', label: 'Layanan Publik' },
  ];

  const filteredRewards = rewards.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    const success = await redeemReward(selectedReward.id);

    if (success) {
      setShowConfetti(true);
      setRedeemSuccess(`Berhasil menukar ${selectedReward.pointsCost} poin untuk ${selectedReward.title}. Kode verifikasi & petunjuk tersimpan di Riwayat & Notifikasi!`);
      setSelectedReward(null);
    } else {
      alert('Poin Anda tidak mencukupi atau stok reward telah habis.');
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleActivateGoldFrame = () => {
    if (typeof window !== 'undefined' && profile.id) {
      localStorage.setItem(`laporkuy_gold_frame_${profile.id}`, 'true');
      setBadgeActivated(true);
      window.dispatchEvent(new Event('laporkuy_store_update'));
      alert('🎉 Bingkai Emas & Titel Warga Peduli berhasil diaktifkan ke profil akun Anda!');
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Apresiasi Digital':
        return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60';
      case 'Titel & Badge':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60';
      case 'Dampak Sosial':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60';
      case 'Layanan Publik':
        return 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60';
      default:
        return 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-28 font-sans">
      <ConfettiOverlay show={showConfetti} />

      {/* 1. Civic Points Wallet Hero Card (Clean Fintech Style) */}
      <div className="mx-4 my-2 p-5 bg-gradient-to-br from-[#003B73] via-[#002B5E] to-[#001738] rounded-3xl text-white shadow-md relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-200 tracking-wider uppercase">
                Poin Keaktifan
              </span>
              <span className="text-[10px] font-bold bg-white/15 text-blue-100 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
                {profile.level}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {profile.points}
              </span>
              <span className="text-xs font-semibold text-blue-200">
                Pts Tersedia
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shadow-inner">
              <Coins className="w-6 h-6 fill-amber-400/20" />
            </div>
            <span className="text-[10px] text-blue-200 font-medium">
              {historyList.length} Voucher Aktif
            </span>
          </div>
        </div>
      </div>

      {redeemSuccess && (
        <div className="mx-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{redeemSuccess}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => {
                setActiveMainTab('voucher');
                setRedeemSuccess(null);
              }}
              className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
            >
              Lihat di Voucher Saya 👉
            </Button>
            <button
              onClick={() => setRedeemSuccess(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Apple / Linear Style Segmented Navigation */}
      <div className="mx-4 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl flex gap-1 select-none">
        <button
          onClick={() => setActiveMainTab('katalog')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeMainTab === 'katalog'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Katalog Hadiah
        </button>

        <button
          onClick={() => setActiveMainTab('voucher')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMainTab === 'voucher'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Voucher Saya</span>
          {historyList.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
              {historyList.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= VIEW 1: KATALOG HADIAH ================= */}
      {activeMainTab === 'katalog' && (
        <div className="space-y-4">
          {/* Horizontal Category Filters */}
          <div className="px-4 overflow-x-auto scrollbar-none pt-1">
            <div className="flex items-center gap-1.5 pb-1 shrink-0 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reward Card List */}
          <div className="flex flex-col gap-3 px-4 pb-28">
            {filteredRewards.map((item) => {
              const canAfford = profile.points >= item.pointsCost;
              const pointsNeeded = item.pointsCost - profile.points;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-2xs hover:shadow-xs p-3.5 flex items-center gap-3.5 transition-all"
                >
                  {/* Thumbnail Container */}
                  <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative border border-slate-200/50 dark:border-slate-700/50">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                      {item.stock > 0 ? `Sisa ${item.stock}` : 'Habis'}
                    </span>
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0 pr-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className={`font-semibold px-2 py-0.5 rounded-md ${getCategoryBadgeColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 truncate">
                        • {item.partnerName}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 leading-snug text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 pt-0.5">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 pt-0.5">
                      <Coins className="w-3.5 h-3.5 fill-amber-500/20" />
                      <span>{item.pointsCost} Poin</span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="shrink-0">
                    {item.stock <= 0 ? (
                      <span className="px-3 py-1.5 text-center text-[11px] font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 block">
                        Habis
                      </span>
                    ) : !canAfford ? (
                      <span className="px-3 py-1.5 text-center text-[11px] font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 block">
                        Kurang {pointsNeeded} Pts
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedReward(item)}
                        className="px-4 py-2 min-w-[76px] text-center text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-xs transition-all cursor-pointer"
                      >
                        Tukar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: VOUCHER SAYA (HANYA KODE YANG SUDAH DITUKAR) ================= */}
      {activeMainTab === 'voucher' && (
        <div className="space-y-4 pb-28">
          {/* Header Info */}
          <div className="px-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Voucher & Kode Reward Saya
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hanya menampilkan reward resmi yang berhasil kamu tukar dengan poin.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 shrink-0">
              {historyList.length} Tersimpan
            </span>
          </div>

          {/* Case 1: Belum Ada Kode yang Ditukar (Empty State) */}
          {historyList.length === 0 ? (
            <div className="mx-4 py-12 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Belum Ada Voucher Tersimpan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Poin dari laporan yang kamu buat dapat ditukarkan dengan E-Sertifikat resmi, bibit pohon, atau voucher prioritas.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => setActiveMainTab('katalog')}
                  className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Jelajahi Katalog Hadiah
                </Button>
              </div>
            </div>
          ) : (
            /* Case 2: Daftar Kode Sah Milik Pengguna */
            <div className="flex flex-col gap-3.5 px-4">
              {historyList.map((item, idx) => (
                <div
                  key={item.id || item.code || idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-3 transition-all hover:border-blue-300 dark:hover:border-blue-700"
                >
                  {/* Header Kartu Voucher */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className={`font-semibold px-2 py-0.5 rounded-md ${getCategoryBadgeColor(item.category || 'Reward')}`}>
                          {item.category || 'Reward'}
                        </span>
                        <span className="text-slate-400">
                          Ditukar {item.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 pt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Mitra: {item.partnerName || 'LaporKuy & Pemkot'}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0">
                      ✓ Aktif
                    </span>
                  </div>

                  {/* Kotak Kode Verifikasi */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
                        NOMOR KODE RESMI
                      </span>
                      <span className="font-mono text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-400 tracking-wider select-all truncate block">
                        {item.code}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(item.code)}
                      className="h-8 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xs gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedCode === item.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Tombol Aksi Nyata */}
                  <div className="pt-0.5">
                    {item.code?.includes('CERT') ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputCode(item.code);
                          resolveCodeInfo(item.code);
                          setShowCertificateModal(true);
                        }}
                        className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Buka & Cetak E-Sertifikat Resmi</span>
                      </Button>
                    ) : item.code?.includes('TREE') ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputCode(item.code);
                          resolveCodeInfo(item.code);
                          setShowTreeCertificateModal(true);
                        }}
                        className="w-full h-9 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <TreePine className="w-4 h-4" />
                        <span>Lihat Akta Adopsi Pohon Hijau</span>
                      </Button>
                    ) : item.code?.includes('FASTTRACK') ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputCode(item.code);
                          resolveCodeInfo(item.code);
                          setShowVipPassModal(true);
                        }}
                        className="w-full h-9 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Tampilkan Tiket VIP Loket Pelayanan</span>
                      </Button>
                    ) : item.code?.includes('BADGE') ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputCode(item.code);
                          resolveCodeInfo(item.code);
                          handleActivateGoldFrame();
                        }}
                        className="w-full h-9 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{badgeActivated ? '✓ Bingkai Emas Sudah Aktif di Profil' : 'Aktifkan ke Profil Akun'}</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputCode(item.code);
                          resolveCodeInfo(item.code);
                        }}
                        className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Buka Dokumen & Petunjuk Pemakaian</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Verifikasi / Input Kode Manual Tambahan */}
          <div className="mx-4 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Ticket className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Cek Kode Tambahan / Manual
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Masukkan nomor kode voucher fisik atau dari mitra instansi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Ketik kode voucher..."
                  className="w-full h-9 px-3 text-xs font-mono font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-slate-400"
                />
              </div>
              <Button
                size="sm"
                onClick={() => resolveCodeInfo(inputCode)}
                className="h-9 px-3.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 mr-1" />
                Cek Kode
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Detail & Panduan Penggunaan Kode (Triggered by code param or input) */}
      {activeCodeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <Card className="max-w-lg w-full p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Panduan Penggunaan Kode Reward
                </h3>
              </div>
              <button
                onClick={() => setActiveCodeDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Info Kartu Reward */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryBadgeColor(activeCodeDetail.category)}`}>
                  {activeCodeDetail.category}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi & Aktif
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {activeCodeDetail.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeCodeDetail.partnerName}
              </p>

              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-medium">Nomor Registrasi / Kode:</span>
                  <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                    {activeCodeDetail.code}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(activeCodeDetail.code)}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  {copiedCode === activeCodeDetail.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Kode
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 📌 Petunjuk: Ditaro di mana & Cara pakai */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-3.5 rounded-xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Petunjuk: Kode Ini Ditaruh & Digunakan di Mana?</span>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  📍 Lokasi Penggunaan:
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                  {activeCodeDetail.whereToUse}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  📋 Langkah-Langkah Pemakaian:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                  {activeCodeDetail.instructions.map((ins, i) => (
                    <li key={i} className="leading-relaxed">{ins}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tombol Aksi Nyata (Fungsi Langsung) */}
            <div className="space-y-2 pt-1">
              {activeCodeDetail.rewardType === 'cert' && (
                <Button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Buka & Cetak E-Sertifikat Resmi
                </Button>
              )}

              {activeCodeDetail.rewardType === 'badge' && (
                <div className="space-y-2">
                  <Button
                    onClick={handleActivateGoldFrame}
                    className="w-full h-10 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md rounded-xl flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {badgeActivated ? '✓ Bingkai Emas Sudah Aktif di Profil' : 'Aktifkan ke Profil Saya Sekarang'}
                  </Button>
                  <Link href="/profil" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs font-semibold rounded-xl gap-1.5"
                    >
                      Buka Halaman Profil Saya <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {activeCodeDetail.rewardType === 'fasttrack' && (
                <Button
                  onClick={() => setShowVipPassModal(true)}
                  className="w-full h-10 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Tampilkan Tiket VIP Loket Pelayanan
                </Button>
              )}

              {activeCodeDetail.rewardType === 'tree' && (
                <Button
                  onClick={() => setShowTreeCertificateModal(true)}
                  className="w-full h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl flex items-center justify-center gap-2"
                >
                  <TreePine className="w-4 h-4" />
                  Lihat Akta Adopsi Pohon Hijau
                </Button>
              )}

              {activeCodeDetail.rewardType === 'rec' && (
                <Button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Buka Dokumen Rekomendasi Resmi
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCodeDetail(null)}
                className="w-full h-8 text-xs text-slate-500 rounded-xl"
              >
                Tutup
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 2: E-Sertifikat Resmi (Printable & Downloadable) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in font-sans">
          <div className="max-w-2xl w-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-300/60 p-6 sm:p-8 space-y-6 relative my-auto">
            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 border-b-2 border-amber-500/30 pb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                    Pemerintah Kota & Platform LaporKuy
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Sistem Manajemen Partisipasi Warga & Fasilitas Publik
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide pt-2">
                SERTIFIKAT PENGHARGAAN
              </h2>
              <p className="text-xs font-mono font-bold text-amber-700">
                Nomor Seri: {activeCodeDetail?.code || 'LK-CERT-WLTRK'}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-slate-600 italic">
                Dengan penuh hormat dan apresiasi, sertifikat ini secara resmi dianugerahkan kepada:
              </p>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-blue-950 underline decoration-amber-400 decoration-2 underline-offset-8">
                {profile.name || 'Warga Teladan LaporKuy'}
              </h3>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
                Atas partisipasi aktif, integritas, dan dedikasi dalam mengawal perbaikan fasilitas publik kota secara transparan dan berkeadilan melalui sistem LaporKuy.
              </p>
            </div>

            {/* Certificate Signatures & QR */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-600">
              <div className="text-left space-y-1">
                <span className="block text-[10px] text-slate-400">Tanggal Pengesahan:</span>
                <span className="font-semibold text-slate-800">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <div className="pt-3">
                  <div className="w-28 border-b border-slate-400 pb-0.5">
                    <span className="font-serif italic font-bold text-blue-900 text-xs">A. Rahman, S.T.</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block">Kadis Kominfo & Layanan Warga</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                <QrCode className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-500 mt-1">VERIFIED CERT</span>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowCertificateModal(false)}
                className="flex-1 text-xs font-semibold h-10 rounded-xl"
              >
                Tutup
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white h-10 rounded-xl gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIP Pass Loket MPP (Fast Track) */}
      {showVipPassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="max-w-md w-full bg-slate-900 text-white rounded-3xl shadow-2xl p-6 border border-indigo-500/40 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Ticket className="w-5 h-5" />
                <span>MALL PELAYANAN PUBLIK (MPP)</span>
              </div>
              <button onClick={() => setShowVipPassModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center space-y-1 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 p-4 rounded-2xl border border-indigo-500/30">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">VIP FAST-TRACK PASS</span>
              <h3 className="text-xl font-extrabold text-white">JALUR CEPAT LOKET</h3>
              <p className="text-xs text-slate-300 pt-1">Atas Nama: <strong className="text-white">{profile.name || 'Warga Terdaftar'}</strong></p>
            </div>

            <div className="bg-white text-slate-900 p-4 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">PINDAI DI MEJA RESEPSIONIS</span>
              <div className="flex justify-center py-1">
                <QrCode className="w-24 h-24 text-slate-950" />
              </div>
              <span className="font-mono text-sm font-black text-indigo-700 tracking-widest block">
                {activeCodeDetail?.code || 'LK-FASTTRACK-VIP'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Tunjukkan layar kartu ini ke petugas pendaftaran antrean di lokasi untuk mendapatkan prioritas pelayanan tanpa antre reguler.
            </p>

            <Button
              onClick={() => setShowVipPassModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Tutup Kartu
            </Button>
          </div>
        </div>
      )}

      {/* MODAL 4: Akta Adopsi Pohon Hijau */}
      {showTreeCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl shadow-2xl p-6 border border-emerald-500/40 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <TreePine className="w-5 h-5" />
                <span>AKTA ADOPSI POHON KOTA</span>
              </div>
              <button onClick={() => setShowTreeCertificateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center space-y-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">DINAS LINGKUNGAN HIDUP KOTA</span>
              <h3 className="text-base font-bold text-emerald-950">1 Bibit Pohon Tabebuya Emas</h3>
              <p className="text-xs text-emerald-800">
                Didedikasikan & Dirawat Atas Nama:
              </p>
              <p className="text-sm font-bold text-emerald-900">{profile.name || 'Warga LaporKuy'}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Kode Tanam:</span>
                <span className="font-mono font-bold text-slate-800">{activeCodeDetail?.code}</span>
              </div>
              <div className="flex justify-between">
                <span>Zona Penanaman:</span>
                <span className="font-semibold text-slate-800">Taman Kota & Jalur Hijau RTH</span>
              </div>
              <div className="flex justify-between">
                <span>Status Pemeliharaan:</span>
                <span className="font-semibold text-emerald-600">Terjadwal & Terawat</span>
              </div>
            </div>

            <Button
              onClick={() => setShowTreeCertificateModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 rounded-xl"
            >
              Tutup Akta
            </Button>
          </div>
        </div>
      )}

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
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80';
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
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                  {selectedReward.pointsCost} Poin
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
              {selectedReward.description}
            </p>

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

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
              {historyList.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <History className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Belum ada penukaran reward</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Kumpulkan poin dari pelaporan fasilitas publik dan penyelesaian misi untuk menukarkannya di sini.
                  </p>
                </div>
              ) : (
                historyList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                          {item.category || 'Digital Reward'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </h4>
                      {item.code && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              setShowHistoryModal(false);
                              resolveCodeInfo(item.code);
                            }}
                            className="font-mono text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-semibold hover:underline"
                            title="Klik untuk panduan pemakaian"
                          >
                            Kode: {item.code} ↗
                          </button>
                          <button
                            onClick={() => handleCopyCode(item.code)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Salin Kode"
                          >
                            {copiedCode === item.code ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0 text-xs">
                      -{item.pointsCost} Pts
                    </span>
                  </div>
                ))
              )}
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
