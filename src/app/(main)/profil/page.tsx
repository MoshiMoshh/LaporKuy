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
} from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const { profile, reports, updateProfile, isInitialized, logout } = useLaporKuyStore();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'laporan' | 'pengaturan'>('ringkasan');
  const supabase = createClient();

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

  const navItems = [
    { key: 'ringkasan' as const, label: 'Ringkasan Akun', icon: TrendingUp },
    { key: 'laporan' as const, label: 'Laporan Saya', icon: FileText },
    { key: 'pengaturan' as const, label: 'Ubah Data Pribadi', icon: Settings },
  ];

  // Show skeleton while localStorage data is loading to prevent mock data flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20 animate-pulse">
        {/* Header skeleton */}
        <div className="bg-[#003B73]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex gap-5 items-end">
              <div className="w-20 h-20 rounded-xl bg-white/10 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-6 w-40 bg-white/10 rounded-lg" />
                <div className="h-3 w-52 bg-white/10 rounded" />
                <div className="h-1.5 w-48 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-3 divide-x divide-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center py-3 gap-1.5">
                  <div className="h-5 w-8 bg-white/10 rounded" />
                  <div className="h-2.5 w-12 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body skeleton */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
          {/* Sidebar skeleton */}
          <div className="space-y-3">
            <div className="bg-white border border-[#D9DEE5] rounded-xl overflow-hidden">
              <div className="h-8 bg-slate-100 border-b border-slate-100" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-11 border-t border-slate-100 flex items-center px-4">
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
            <div className="h-10 bg-white border border-[#D9DEE5] rounded-xl" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-5">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#D9DEE5] rounded-xl p-4 flex flex-col items-center gap-2">
                  <div className="h-7 w-8 bg-slate-100 rounded" />
                  <div className="h-2.5 w-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="bg-white border border-[#D9DEE5] rounded-xl divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-3.5 items-center">
                  <div className="w-14 h-12 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-3.5 w-48 bg-slate-100 rounded" />
                    <div className="h-2.5 w-32 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">

      {/* ── HEADER ── */}
      <div className="bg-[#003B73] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-end">

            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={avatarSrc}
                alt={name || 'Profil'}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/25 block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                }}
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-white text-[#003B73] text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shadow-sm leading-none">
                {profile.level}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight mb-0.5">
                {name || profile.name}
              </h1>
              <p className="text-blue-200 text-xs mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Warga Terverifikasi
                <span className="w-1 h-1 rounded-full bg-blue-400 inline-block" />
                <span className="font-mono opacity-60">{profile.id}</span>
              </p>

              {/* XP Bar */}
              <div className="flex items-center gap-2 max-w-xs">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-blue-300 shrink-0">
                  {profile.xp} / {profile.nextLevelXp} XP
                </span>
              </div>
            </div>

            {/* Settings shortcut */}
            <button
              onClick={() => setActiveTab('pengaturan')}
              className="shrink-0 self-start sm:self-end flex items-center gap-1.5 text-xs text-blue-200 border border-white/20 rounded-md px-3 py-1.5 hover:bg-white/10 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Pengaturan
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: profile.totalReports, label: 'Laporan', icon: FileText },
              { value: profile.points, label: 'Poin', icon: Star },
              { value: `${profile.streakDays}h`, label: 'Streak', icon: Flame },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                <span className="text-lg sm:text-xl font-bold font-mono leading-none">{value}</span>
                <span className="text-[10px] text-blue-300 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Icon className="w-2.5 h-2.5" />{label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">

        {/* SIDEBAR */}
        <div className="space-y-3">
          <Card className="rounded-xl border border-[#D9DEE5] bg-white overflow-hidden shadow-none p-0">
            <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              Menu
            </div>
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm border-l-[3px] text-left transition-all duration-100 border-t border-slate-100 first:border-t-0 ${
                  activeTab === key
                    ? 'bg-blue-50 text-[#0057B8] border-l-[#0057B8] font-semibold'
                    : 'text-slate-600 border-l-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${activeTab === key ? 'text-[#0057B8]' : 'text-slate-400'}`} />
                  {label}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${activeTab === key ? 'text-[#0057B8]' : 'text-slate-300'}`} />
              </button>
            ))}
          </Card>

          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="w-full justify-start text-red-600 border-[#D9DEE5] hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl shadow-none text-sm gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sistem
          </Button>
        </div>

        {/* MAIN CONTENT */}
        <div className="min-w-0">

          {/* ── TAB 1: RINGKASAN ── */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-5">

              {/* Stat cards */}
              <section>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Statistik Pengaduan</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: myReports.length, label: 'Total', color: 'text-[#003B73]' },
                    { value: myReports.filter(r => r.status === 'Selesai').length, label: 'Selesai', color: 'text-green-600' },
                    { value: myReports.filter(r => r.status === 'Diproses').length, label: 'Diproses', color: 'text-amber-600' },
                  ].map(({ value, label, color }) => (
                    <Card key={label} className="p-4 rounded-xl border border-[#D9DEE5] bg-white shadow-none text-center">
                      <div className={`text-2xl sm:text-3xl font-bold font-mono ${color} mb-1 leading-none`}>{value}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Aktivitas terbaru */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aktivitas Terbaru</h2>
                  <button
                    onClick={() => setActiveTab('laporan')}
                    className="text-xs font-semibold text-[#0057B8] hover:underline"
                  >
                    Lihat semua
                  </button>
                </div>

                {myReports.length > 0 ? (
                  <Card className="rounded-xl border border-[#D9DEE5] bg-white shadow-none divide-y divide-slate-100 overflow-hidden p-0">
                    {myReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex gap-3 p-3.5 items-center hover:bg-slate-50 transition-colors">
                        <img
                          src={report.photoUrl}
                          alt={report.title}
                          className="w-14 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass(report.status)}`}>
                              {report.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{formatDate(report.createdAt)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{report.title}</p>
                          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0057B8] shrink-0" />
                            {report.address}
                          </p>
                        </div>
                        <Link href={`/laporan/${report.id}`} className="shrink-0">
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-slate-200 shadow-none hover:bg-[#0057B8] hover:text-white hover:border-[#0057B8] transition-all">
                            Detail
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <Card className="rounded-xl border border-[#D9DEE5] bg-white shadow-none p-10 flex flex-col items-center text-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">Belum Ada Pengaduan</p>
                    <p className="text-xs text-slate-400 max-w-xs">Anda belum pernah mengirim laporan infrastruktur.</p>
                    <Link href="/buat-laporan" className="mt-2">
                      <Button size="sm" className="bg-[#0057B8] hover:bg-[#003B73] text-white rounded-lg text-xs shadow-none">
                        Buat Laporan Sekarang
                      </Button>
                    </Link>
                  </Card>
                )}
              </section>

              {/* Badges */}
              {profile.badges && profile.badges.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Pencapaian & Lencana</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {profile.badges.map((badge) => (
                      <Card key={badge.id} className="rounded-xl border border-[#D9DEE5] bg-white shadow-none p-4 flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">
                          {badge.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{badge.name}</p>
                          <span className={`mt-1 inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${rarityClass(badge.rarity)}`}>
                            {badge.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{badge.description}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── TAB 2: LAPORAN ── */}
          {activeTab === 'laporan' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Riwayat Laporan</h2>
                <div className="flex gap-1.5 flex-wrap">
                  {(['Semua', 'Selesai', 'Diproses', 'Pending'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        statusFilter === f
                          ? 'bg-[#0057B8] text-white border-[#0057B8]'
                          : 'bg-white border-[#D9DEE5] text-slate-500 hover:border-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="rounded-xl border border-[#D9DEE5] bg-white shadow-none overflow-hidden flex flex-col hover:border-[#0057B8]/30 hover:shadow-sm transition-all duration-200 p-0">
                      <div className="h-32 bg-slate-100 relative shrink-0">
                        <img
                          src={report.photoUrl}
                          alt={report.title}
                          className="w-full h-full object-cover block"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                          }}
                        />
                        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="p-3.5 flex flex-col flex-1 gap-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3" /> {formatDate(report.createdAt)}
                        </div>
                        <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2">{report.title}</h3>
                        <p className="text-[11px] text-slate-400 flex items-start gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-[#0057B8] shrink-0 mt-0.5" />
                          {report.address}
                        </p>
                        <Link href={`/laporan/${report.id}`} className="mt-auto pt-2">
                          <Button variant="outline" size="sm" className="w-full h-8 text-xs rounded-lg border-slate-200 shadow-none hover:bg-[#0057B8] hover:text-white hover:border-[#0057B8] transition-all">
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="rounded-xl border border-[#D9DEE5] bg-white shadow-none p-10 flex flex-col items-center text-center gap-2">
                  <ShieldAlert className="w-8 h-8 text-slate-300" />
                  <p className="font-bold text-sm text-slate-700">Tidak Ada Laporan</p>
                  <p className="text-xs text-slate-400">Tidak ada laporan dengan filter &quot;{statusFilter}&quot;.</p>
                </Card>
              )}
            </div>
          )}

          {/* ── TAB 3: PENGATURAN ── */}
          {activeTab === 'pengaturan' && (
            <Card className="rounded-xl border border-[#D9DEE5] bg-white shadow-none p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Ubah Data Pribadi</h2>

              {saveSuccess && (
                <div className="mb-5 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Perubahan profil berhasil disimpan!
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="relative group shrink-0">
                    <img
                      src={avatarSrc}
                      alt="Preview avatar"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 block"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                      }}
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-5 h-5" />
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
                    <p className="text-sm font-semibold text-slate-700">Foto Profil</p>
                    <p className="text-xs text-slate-400 mt-0.5">Klik foto untuk mengganti. JPG / PNG maks 5MB.</p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-bold text-slate-600 block">
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 border border-[#D9DEE5] rounded-lg bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="emailAddress" className="text-xs font-bold text-slate-600 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="emailAddress"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 border border-[#D9DEE5] rounded-lg bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-xs font-bold text-slate-600 block">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 border border-[#D9DEE5] rounded-lg bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/10 transition-all"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  * Nama lengkap harus sesuai KTP untuk validitas laporan ke instansi terkait.
                </p>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#0057B8] hover:bg-[#003B73] text-white rounded-lg text-sm font-semibold px-6 shadow-none transition-all"
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
  );
}
