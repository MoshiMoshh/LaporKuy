'use client';

import { useState } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Target,
  CheckCircle2,
  Gift,
  Clock,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  FileText,
  ThumbsUp,
  Compass,
  ArrowUpRight,
  Info,
  X,
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuestGuide {
  purpose: string;
  steps: string[];
}

const questGuides: Record<string, QuestGuide> = {
  'q-1': {
    purpose: 'Mendorong peran aktif warga dalam mendeteksi dan melaporkan 1 masalah infrastruktur fisik di sekitarnya setiap hari.',
    steps: [
      'Klik tombol "Mulai Kerjakan Misi Sekarang" di bawah ini untuk membuka Formulir Pengaduan.',
      'Ambil atau unggah 1 foto bukti fisik kerusakan (misal: jalan berlubang, trotoar rusak, atau lampu mati).',
      'Sistem AI Vision & GPS akan mengidentifikasi kategori serta mengonfirmasi presisi lokasi secara otomatis.',
      'Tekan "Kirim Laporan Pengaduan" untuk menyelesaikan misi dan mengklaim +15 Poin.'
    ]
  },
  'q-2': {
    purpose: 'Membantu memvalidasi prioritas laporan warga lain dengan memberikan upvote pada aduan yang benar-benar membutuhkan penanganan darurat.',
    steps: [
      'Klik tombol "Mulai Kerjakan Misi Sekarang" untuk membuka Peta Persebaran Aduan Warga.',
      'Pilih dan baca laporan aduan milik warga lain yang sesuai dengan kondisi lapangan.',
      'Berikan Dukungan (Upvote) pada minimal 3 laporan terdaftar.',
      'Setelah kuota 3 upvote terpenuhi, klaim bonus +10 Poin Anda di halaman Misi.'
    ]
  },
  'q-3': {
    purpose: 'Memperluas cakupan pemantauan infrastruktur kota hingga ke area kecamatan lain di wilayah Surabaya.',
    steps: [
      'Klik tombol "Mulai Kerjakan Misi Sekarang" untuk membuka formulir dengan target wilayah khusus (Kec. Gubeng).',
      'Unggah foto kerusakan infrastruktur yang Anda temukan saat melintasi kecamatan tersebut.',
      'Lengkapi deskripsi detail dan kirimkan laporan Anda.',
      'Dapatkan bonus poin besar +50 Poin untuk kontribusi pemantauan lintas wilayah.'
    ]
  },
  'q-4': {
    purpose: 'Program akselerasi pembersihan titik tumpukan sampah liar dan saluran drainase tersumbat di Surabaya.',
    steps: [
      'Klik tombol "Mulai Kerjakan Misi Sekarang" untuk membuka formulir khusus penanganan sampah.',
      'Potret lokasi tumpukan sampah liar atau selokan tersumbat di area sekitar Anda.',
      'Pastikan AI Vision mengidentifikasi kategori Sampah dengan akurasi tinggi.',
      'Kirimkan laporan untuk membantu armada Dinas Lingkungan Hidup (DLH) bergerak & dapatkan +100 Poin.'
    ]
  }
};

export default function MisiPage() {
  const router = useRouter();
  const { quests, claimQuest, profile } = useLaporKuyStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'seasonal'>('all');
  const [selectedQuestForModal, setSelectedQuestForModal] = useState<any | null>(null);

  const handleClaim = (questId: string) => {
    claimQuest(questId);
    setShowConfetti(true);
  };

  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'all') return true;
    return q.type === activeTab;
  });

  const xpProgressPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));

  const getQuestIcon = (questId: string) => {
    if (questId.includes('1')) return <FileText className="h-5 w-5 text-[#0057B8]" />;
    if (questId.includes('2')) return <ThumbsUp className="h-5 w-5 text-emerald-600" />;
    if (questId.includes('3')) return <Compass className="h-5 w-5 text-amber-600" />;
    if (questId.includes('4')) return <Sparkles className="h-5 w-5 text-purple-600" />;
    return <Target className="h-5 w-5 text-slate-700" />;
  };

  const getIconBg = (questId: string) => {
    if (questId.includes('1')) return 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40';
    if (questId.includes('2')) return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40';
    if (questId.includes('3')) return 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40';
    return 'bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/40';
  };

  const getQuestHref = (quest: any) => {
    if (quest.id === 'q-2') {
      return `/dashboard?quest=q-2&title=${encodeURIComponent(quest.title)}`;
    }
    if (quest.id === 'q-3') {
      return `/buat-laporan?quest=q-3&title=${encodeURIComponent(quest.title)}&district=${encodeURIComponent('Kec. Gubeng')}&address=${encodeURIComponent('Jl. Gubeng Kertajaya No. 88, Kec. Gubeng, Surabaya')}`;
    }
    if (quest.id === 'q-4') {
      return `/buat-laporan?quest=q-4&title=${encodeURIComponent(quest.title)}&category=Sampah&address=${encodeURIComponent('Jl. Keputih Timur No. 12, Kec. Sukolilo, Surabaya')}`;
    }
    return `/buat-laporan?quest=${quest.id}&title=${encodeURIComponent(quest.title)}`;
  };

  const startQuest = (quest: any) => {
    setSelectedQuestForModal(null);
    router.push(getQuestHref(quest));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 space-y-5 pb-44 sm:pb-32 font-sans">
      <ConfettiOverlay show={showConfetti} />

      {/* Compact Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase block mb-0.5">
            Program Partisipasi Warga
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-normal">
            Misi & Kontribusi
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 py-1 px-2.5 flex items-center gap-1.5 text-[11px] font-medium">
            <Clock className="h-3 w-3 text-slate-400" />
            Reset: <span className="font-semibold text-slate-900 dark:text-slate-100">00:00 WIB</span>
          </Badge>
          <Link href="/tukar-poin">
            <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 border-slate-200 dark:border-slate-800 h-7 px-3">
              <Award className="h-3.5 w-3.5 text-amber-500" /> Tukar Poin
            </Button>
          </Link>
        </div>
      </div>

      {/* Compact Gamification Dashboard */}
      <Card className="p-4 sm:p-5 bg-gradient-to-r from-[#002B5B] via-[#003B7A] to-[#0057B8] text-white rounded-xl border border-blue-900/60 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-cover border-2 border-white/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white tracking-tight truncate">{profile.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-blue-100 border border-white/20 shrink-0">
                    Lvl {profile.level === 'Pemula' ? '1' : profile.level === 'Warga Aktif' ? '2' : profile.level === 'Pahlawan Kota' ? '3' : '4'}
                  </span>
                </div>
                <p className="text-[11px] text-blue-100/80 truncate">
                  {profile.level} • Surabaya Civic Index
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shrink-0">
              <Award className="h-4 w-4 text-amber-300" />
              <div className="text-right">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-100/70 block leading-tight">Total Poin</span>
                <span className="text-sm font-extrabold text-amber-300 font-mono leading-tight">{profile.points} Pts</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-medium text-blue-100/90">
              <span>Progression XP ({xpProgressPercent}%)</span>
              <span className="font-mono text-blue-200">
                {profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-emerald-400 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10 gap-2 font-sans">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-white block leading-none">{profile.streakDays} Hari</span>
                <span className="text-[11px] font-medium text-slate-300 tracking-normal">Streak</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-white block leading-none">{profile.completedReports} Laporan</span>
                <span className="text-[11px] font-medium text-slate-300 tracking-normal">Selesai</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-white block leading-none">{profile.trustScore}%</span>
                <span className="text-[11px] font-medium text-slate-300 tracking-normal">Kepercayaan</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 pr-8 sm:pr-0 shrink-0 min-w-max">
          {[
            { id: 'all', label: 'Semua Misi' },
            { id: 'daily', label: 'Harian' },
            { id: 'weekly', label: 'Mingguan' },
            { id: 'seasonal', label: 'Event Musiman' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#0057B8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {filteredQuests.map((quest) => {
          const effectiveProgress = quest.isClaimed ? quest.target : quest.progress;
          const isCompleted = effectiveProgress >= quest.target;
          const progressPercent = Math.min(100, (effectiveProgress / quest.target) * 100);

          return (
            <Card
              key={quest.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  {quest.id === 'q-2' ? (
                    <ThumbsUp className="w-5 h-5" />
                  ) : quest.id === 'q-3' ? (
                    <Compass className="w-5 h-5" />
                  ) : quest.id === 'q-4' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 tracking-tight">
                      {quest.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold py-0 px-1.5 border-slate-200 dark:border-slate-800 text-slate-500 capitalize"
                    >
                      {quest.type === 'daily' ? 'Harian' : quest.type === 'weekly' ? 'Mingguan' : 'Event'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                    {quest.description}
                  </p>

                  <div className="flex items-center gap-2.5 pt-1 max-w-md">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 shrink-0">
                      {effectiveProgress}/{quest.target}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 px-2.5 py-1 rounded-lg block font-mono">
                    +{quest.rewardPoints} Pts
                  </span>
                </div>

                {quest.isClaimed ? (
                  <Button
                    disabled
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed px-3"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Selesai
                  </Button>
                ) : isCompleted ? (
                  <Button
                    size="sm"
                    onClick={() => handleClaim(quest.id)}
                    className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all animate-pulse px-3"
                  >
                    <Gift className="h-3.5 w-3.5" /> Klaim Bonus
                  </Button>
                ) : (
                  <button
                    onClick={() => setSelectedQuestForModal(quest)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                  >
                    <span>Kerjakan</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL PANDUAN PENGERJAAN MISI (Clean Civic / Enterprise Standard) */}
      {selectedQuestForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 relative">
            {/* 2. Header Modal & Ikon Civic Dynamic */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  {selectedQuestForModal.id === 'q-2' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : selectedQuestForModal.id === 'q-3' ? (
                    <Compass className="w-5 h-5" />
                  ) : selectedQuestForModal.id === 'q-4' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
                    MISI {selectedQuestForModal.type === 'daily' ? 'HARIAN' : selectedQuestForModal.type === 'weekly' ? 'MINGGUAN' : 'EVENT'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {selectedQuestForModal.title}
                    </h3>
                    {/* 3. Reward Pill Badge Sederhana */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                      ⚡ +{selectedQuestForModal.rewardPoints} Poin
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuestForModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 4. Deskripsi Langsung 1 Kalimat Lugas */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {selectedQuestForModal.id === 'q-2'
                ? 'Bantu validasi laporan warga sekitar dengan memberikan dukungan (upvote).'
                : selectedQuestForModal.id === 'q-1'
                ? 'Kirimkan 1 laporan pengaduan infrastruktur fisik di sekitarmu hari ini.'
                : selectedQuestForModal.id === 'q-3'
                ? 'Pantau dan laporkan masalah infrastruktur khusus di wilayah Kec. Gubeng.'
                : 'Laporkan titik tumpukan sampah liar untuk penanganan armada DLH.'}
            </p>

            {/* 4. Instruksi Ringkas dengan Compact Stepper */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              {(selectedQuestForModal.id === 'q-2'
                ? [
                    'Buka peta atau daftar aduan warga.',
                    'Beri upvote pada minimal 3 laporan yang valid.',
                    `Bonus +${selectedQuestForModal.rewardPoints} poin otomatis masuk setelah selesai.`
                  ]
                : [
                    'Buka formulir pengaduan infrastruktur.',
                    'Ambil foto lokasi & lengkapi deskripsi aduan.',
                    `Kirim laporan untuk mengklaim +${selectedQuestForModal.rewardPoints} poin.`
                  ]
              ).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold items-center justify-center shrink-0 mt-0.5 border border-slate-200/60 dark:border-slate-700">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-normal pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* 5. Button CTA Utama Full-Width */}
            <div className="pt-2">
              <button
                onClick={() => startQuest(selectedQuestForModal)}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm py-2.5 rounded-xl shadow-sm transition-all text-center"
              >
                Mulai Kerjakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
