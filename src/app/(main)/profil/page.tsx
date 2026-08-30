'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings,
  FileText,
  CheckCircle2,
  ChevronRight,
  LogOut,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldAlert,
  Camera,
  Flame,
  Star,
  TrendingUp,
  User,
  Award,
  Medal,
  Trophy,
  Shield
} from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const { profile, reports, updateProfile, isInitialized, logout } = useLaporKuyStore();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'laporan' | 'pengaturan'>('ringkasan');
  const supabase = createClient();

  const handleTabChange = (tab: 'ringkasan' | 'laporan' | 'pengaturan') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const myReports = reports.filter((r) => r.userId === profile.id || r.userName === profile.name);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setAvatar(profile.avatar || '');
    }
  }, [profile.name, profile.email, profile.phone, profile.avatar]);

  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Selesai' | 'Diproses' | 'Pending'>('Semua');

  const filteredReports = myReports.filter((report) => {
    if (statusFilter === 'Semua') return true;
    return report.status === statusFilter;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone, avatar });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return 'Baru saja';
    }
  };

  const getAvatarFallback = (n: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(n || 'U')}&background=0057B8&color=fff&size=200&bold=true&format=png`;

  const getReportImgFallback = (title: string) =>
    `https://picsum.photos/seed/${encodeURIComponent(title.slice(0, 12))}/800/400`;

  // avatarSrc: prioritize local form state (supports blob: URLs from file picker),
  // then profile.avatar from store, then ui-avatars fallback.
  const avatarSrc = avatar || profile.avatar || getAvatarFallback(name || profile.name);

  const xpPercent = Math.min(100, Math.round(((profile.xp || 0) / (profile.nextLevelXp || 2000)) * 100));

  const statusClass = (status: string) => {
    if (status === 'Selesai') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Diproses') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (status === 'Terverifikasi') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const rarityClass = (rarity: string) => {
    if (rarity === 'Legendary') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (rarity === 'Epic') return 'bg-purple-50 text-purple-700 border border-purple-200';
    if (rarity === 'Rare') return 'bg-blue-50 text-blue-700 border border-blue-200';
    return 'bg-slate-50 text-slate-600 border border-slate-200';
  };

  const getBadgeIcon = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'Epic': return <Award className="w-5 h-5 text-purple-600" />;
      case 'Rare': return <Shield className="w-5 h-5 text-blue-600" />;
      default: return <Medal className="w-5 h-5 text-slate-600" />;
    }
  };

  const navItems = [
    { key: 'ringkasan' as const, label: 'Ringkasan Akun', icon: TrendingUp },
    { key: 'laporan' as const, label: 'Laporan Saya', icon: FileText },
    { key: 'pengaturan' as const, label: 'Ubah Data Pribadi', icon: Settings },
  ];

  // Show skeleton while localStorage data is loading to prevent mock data flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20 animate-pulse">
        <div className="bg-[#003B73] pt-10 pb-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
                <div className="h-4 w-40 bg-white/10 rounded" />
                <div className="h-2 w-64 bg-white/10 rounded-full mt-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 space-y-6">
          <div className="h-28 bg-white rounded-2xl border border-[#D9DEE5]" />
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <div className="h-64 bg-white rounded-2xl border border-[#D9DEE5]" />
            <div className="space-y-4">
              <div className="h-32 bg-white rounded-2xl border border-[#D9DEE5]" />
              <div className="h-64 bg-white rounded-2xl border border-[#D9DEE5]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">

      {/* ── HEADER ── */}
      <div className="bg-[#003B73] text-white pt-10 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20">
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">

            {/* Avatar */}
            <div className="relative shrink-0 flex justify-center w-full sm:w-auto">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt={name || profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-[3px] border-white/20 shadow-xl block bg-[#0057B8]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                  }}
                />
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0057B8] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md border border-white/20 whitespace-nowrap">
                  Level {profile.level || "Warga"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0 flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {name || profile.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-blue-200 text-sm mb-4">
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md text-xs font-medium border border-white/10">
                  <User className="w-3.5 h-3.5" />
                  Warga Terverifikasi
                </span>
                <span className="font-mono text-xs opacity-70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  ID: {profile.id}
                </span>
              </div>

              {/* XP Bar */}
              <div className="flex items-center gap-3 w-full max-w-[240px] sm:max-w-sm">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-blue-200 shrink-0 font-medium whitespace-nowrap">
                  {profile.xp} / {profile.nextLevelXp} XP
                </span>
              </div>
            </div>

            {/* Settings shortcut */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-0 shrink-0">
              <button
                onClick={() => handleTabChange('pengaturan')}
                className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl px-4 py-2 hover:bg-white/20 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4" />
                Edit Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20 space-y-6">

        {/* Floating Stat Card */}
        <Card className="rounded-2xl border border-[#D9DEE5] bg-white p-2 shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {[
              { value: profile.totalReports, label: 'Total Laporan', icon: FileText, color: 'text-[#0057B8]' },
              { value: profile.points, label: 'Poin Aktif', icon: Star, color: 'text-amber-500' },
              { value: `${profile.streakDays} Hari`, label: 'Streak', icon: Flame, color: 'text-orange-500' },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1.5 hover:bg-slate-50 transition-colors rounded-xl mx-1">
                <Icon className={`w-6 h-6 ${color} mb-1`} />
                <span className="text-2xl font-bold text-slate-800 leading-none">{value}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">

          {/* SIDEBAR */}
          <div className="space-y-4">
            <Card className="rounded-2xl border border-[#D9DEE5] bg-white overflow-hidden shadow-none p-2">
              <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Menu Utama
              </div>
              <div className="space-y-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${activeTab === key
                        ? 'bg-[#0057B8]/10 text-[#0057B8] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${activeTab === key ? 'text-[#0057B8]' : 'text-slate-400'}`} />
                      {label}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${activeTab === key ? 'text-[#0057B8]' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </Card>

            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="w-full justify-start text-red-600 border-[#D9DEE5] hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-2xl shadow-none text-sm gap-2 h-11"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sistem
            </Button>
          </div>

          {/* MAIN CONTENT */}
          <div id="main-content" className="min-w-0 scroll-mt-20">

            {/* ── TAB 1: RINGKASAN ── */}
            {activeTab === 'ringkasan' && (
              <div className="space-y-6">

                {/* Stat cards */}
                <section>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Status Pengaduan</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: myReports.length, label: 'Total', color: 'text-[#003B73]' },
                      { value: myReports.filter(r => r.status === 'Selesai').length, label: 'Selesai', color: 'text-green-600' },
                      { value: myReports.filter(r => r.status === 'Diproses').length, label: 'Diproses', color: 'text-amber-600' },
                    ].map(({ value, label, color }) => (
                      <Card key={label} className="p-5 rounded-2xl border border-[#D9DEE5] bg-white shadow-none text-center hover:border-slate-300 transition-colors">
                        <div className={`text-3xl font-bold ${color} mb-2 leading-none`}>{value}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Aktivitas terbaru */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktivitas Terbaru</h2>
                    <button
                      onClick={() => handleTabChange('laporan')}
                      className="text-xs font-semibold text-[#0057B8] hover:underline"
                    >
                      Lihat semua
                    </button>
                  </div>

                  {myReports.length > 0 ? (
                    <Card className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none divide-y divide-slate-100 overflow-hidden p-0">
                      {myReports.slice(0, 3).map((report) => (
                        <div key={report.id} className="flex gap-4 p-4 items-center hover:bg-slate-50/80 transition-colors">
                          <img
                            src={report.photoUrl}
                            alt={report.title}
                            className="w-16 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass(report.status)}`}>
                                {report.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{formatDate(report.createdAt)}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{report.title}</p>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
                              {report.address}
                            </p>
                          </div>
                          <Link href={`/laporan/${report.id}`} className="shrink-0 hidden sm:block">
                            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg border-slate-200 shadow-none hover:bg-[#0057B8] hover:text-white hover:border-[#0057B8] transition-all">
                              Detail
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </Card>
                  ) : (
                    <Card className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none p-12 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">Belum Ada Pengaduan</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Anda belum pernah mengirim laporan infrastruktur.</p>
                      </div>
                      <Link href="/buat-laporan" className="mt-2">
                        <Button size="sm" className="bg-[#0057B8] hover:bg-[#003B73] text-white rounded-xl font-semibold text-xs shadow-none px-5">
                          Buat Laporan Sekarang
                        </Button>
                      </Link>
                    </Card>
                  )}
                </section>

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <section>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pencapaian & Lencana</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {profile.badges.map((badge) => (
                        <Card key={badge.id} className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none p-4 flex flex-col items-center text-center gap-3 hover:border-[#0057B8]/30 transition-colors">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${rarityClass(badge.rarity)} bg-opacity-50`}>
                            {getBadgeIcon(badge.rarity)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{badge.name}</p>
                            <span className={`mt-1.5 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${rarityClass(badge.rarity)}`}>
                              {badge.rarity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{badge.description}</p>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ── TAB 2: LAPORAN ── */}
            {activeTab === 'laporan' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-2 rounded-2xl border border-[#D9DEE5]">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 hidden sm:block">Riwayat</h2>
                  <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                    {(['Semua', 'Selesai', 'Diproses', 'Pending'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === f
                            ? 'bg-[#0057B8] text-white'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredReports.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none overflow-hidden flex flex-col hover:border-[#0057B8]/30 hover:shadow-md transition-all duration-300 p-0">
                        <div className="h-36 bg-slate-100 relative shrink-0">
                          <img
                            src={report.photoUrl}
                            alt={report.title}
                            className="w-full h-full object-cover block"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-sm ${statusClass(report.status)}`}>
                            {report.status}
                          </span>
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-mono">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(report.createdAt)}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1 gap-2">
                          <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2">{report.title}</h3>
                          <p className="text-[11px] text-slate-500 flex items-start gap-1.5 line-clamp-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
                            {report.address}
                          </p>
                          <Link href={`/laporan/${report.id}`} className="mt-auto pt-2">
                            <Button variant="outline" size="sm" className="w-full h-9 text-xs font-semibold rounded-xl border-slate-200 shadow-none hover:bg-[#0057B8] hover:text-white hover:border-[#0057B8] transition-all">
                              Lihat Detail
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none p-12 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Tidak Ada Laporan</p>
                      <p className="text-xs text-slate-500 mt-1">Tidak ada laporan dengan filter &quot;{statusFilter}&quot;.</p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ── TAB 3: PENGATURAN ── */}
            {activeTab === 'pengaturan' && (
              <Card className="rounded-2xl border border-[#D9DEE5] bg-white shadow-none p-6 sm:p-8">
                <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#0057B8]" />
                  Ubah Data Pribadi
                </h2>

                {saveSuccess && (
                  <div className="mb-6 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    Perubahan profil berhasil disimpan!
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
                    <div className="relative group shrink-0 self-start sm:self-auto">
                      <img
                        src={avatarSrc}
                        alt="Preview avatar"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 block shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                        }}
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const img = new Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 256;
                                  const MAX_HEIGHT = 256;
                                  let width = img.width;
                                  let height = img.height;

                                  if (width > height) {
                                    if (width > MAX_WIDTH) {
                                      height *= MAX_WIDTH / width;
                                      width = MAX_WIDTH;
                                    }
                                  } else {
                                    if (height > MAX_HEIGHT) {
                                      width *= MAX_HEIGHT / height;
                                      height = MAX_HEIGHT;
                                    }
                                  }
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, width, height);
                                  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                  setAvatar(dataUrl);
                                };
                                img.src = event.target?.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Foto Profil</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">Pilih foto persegi dengan resolusi yang baik. Format JPG atau PNG, maksimal ukuran file 5MB.</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-bold text-slate-700 block">
                      Nama Lengkap
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 border border-[#D9DEE5] rounded-xl bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all shadow-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="emailAddress" className="text-xs font-bold text-slate-700 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="emailAddress"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 border border-[#D9DEE5] rounded-xl bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all shadow-sm cursor-not-allowed opacity-80"
                        readOnly
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Email tidak dapat diubah (terhubung dengan akun).</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-xs font-bold text-slate-700 block">
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 border border-[#D9DEE5] rounded-xl bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-4">
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                      * Pastikan nama lengkap sesuai dengan KTP untuk memudahkan validasi laporan ke instansi terkait dan pencairan reward.
                    </p>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#0057B8] hover:bg-[#003B73] text-white rounded-xl text-sm font-semibold px-8 h-11 shadow-none transition-all w-full sm:w-auto"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
