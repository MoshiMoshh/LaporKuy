'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Copy,
  Check,
  Edit3
} from 'lucide-react';

import { useUserLocation } from '@/lib/location-store';
import { sendTelegramLog } from '@/app/actions/telegram';
import { toast } from 'sonner';

export default function ProfilPage() {
  const router = useRouter();
  const { profile, reports, updateProfile, isInitialized } = useLaporKuyStore();
  const { location: userLoc } = useUserLocation();
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'laporan' | 'pengaturan'>('ringkasan');
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const handleTabChange = (tab: 'ringkasan' | 'laporan' | 'pengaturan') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const myReports = reports.filter((r) => 
    r.userId === profile.id || 
    (profile.name && r.userName === profile.name && r.userId === 'usr-me')
  );

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      const meta = session?.user?.user_metadata;
      const gAvatar = meta?.avatar_url || meta?.picture || meta?.avatar;
      if (gAvatar && (!profile?.avatar || profile?.avatar.includes('/images/avatars/'))) {
        setAvatar(gAvatar);
        if (profile && profile.avatar !== gAvatar) {
          updateProfile({ avatar: gAvatar });
        }
      }
    });
  }, [profile]);

  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Terverifikasi' | 'Diproses' | 'Selesai' | 'Pending'>('Semua');

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

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran foto terlalu besar', {
          description: 'Maksimal ukuran foto adalah 5MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatar = event.target?.result as string;
        if (newAvatar) {
          setAvatar(newAvatar);
          updateProfile({ avatar: newAvatar });
          toast.success('Foto profil berhasil diperbarui!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarFallback = (n: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(n || 'U')}&background=003B73&color=fff&size=200&bold=true&format=png`;

  const getReportImgFallback = (title: string) =>
    `https://picsum.photos/seed/${encodeURIComponent(title.slice(0, 12))}/800/400`;

  const avatarSrc = avatar || profile.avatar || getAvatarFallback(name || profile.name);

  const xpPercent = Math.min(100, Math.round(((profile.xp || 0) / (profile.nextLevelXp || 100)) * 100));

  const humanReadableId = `#LAPOR-${(profile.id || 'C9C4').slice(0, 4).toUpperCase()}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(humanReadableId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusClass = (status: string) => {
    if (status === 'Selesai') return 'bg-[#EDF3EC] text-[#346538] border-[#CFE4CE]';
    if (status === 'Diproses') return 'bg-[#FBF3DB] text-[#956400] border-[#F4E4B6]';
    if (status === 'Terverifikasi') return 'bg-[#E1F3FE] text-[#1F6C9F] border-[#BDE3FD]';
    return 'bg-[#F7F6F3] text-[#787774] border-[#EAEAEA]';
  };

  const navItems = [
    { key: 'ringkasan' as const, label: 'Ringkasan Akun', icon: TrendingUp, iconBg: 'bg-blue-50 text-blue-600' },
    { key: 'laporan' as const, label: 'Laporan Saya', icon: FileText, iconBg: 'bg-emerald-50 text-emerald-600' },
    { key: 'pengaturan' as const, label: 'Ubah Data Pribadi', icon: Settings, iconBg: 'bg-purple-50 text-purple-600' },
  ];

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
        <div className="bg-[#003B73] pt-14 pb-20">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-4" />
            <div className="h-6 w-40 bg-white/10 rounded-lg mx-auto mb-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 md:pb-12">
      
      {/* ── 1. USER HERO HEADER SECTION (MATCHED LIGHT/DARK ADAPTIVE THEME) ── */}
      <section className="relative w-full bg-gradient-to-b from-primary/15 via-primary/5 to-background border-b border-border/60 pt-8 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
          
          {/* Avatar with Ring & Status Indicator & Instant Upload */}
          <div className="relative mb-3 group cursor-pointer">
            <label htmlFor="header-avatar-upload" className="cursor-pointer block relative">
              <img
                src={avatarSrc}
                alt={name || profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-background shadow-md ring-4 ring-primary/20 bg-card group-hover:brightness-90 transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <input
                id="header-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileSelect}
              />
            </label>
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-background shadow-sm pointer-events-none">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Name & Level Badge */}
          <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {name || profile.name || "Pengguna LaporKuy"}
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              <Trophy className="w-3 h-3 mr-1 text-primary shrink-0" />
              {profile.level || "Pemula"}
            </Badge>
          </div>

          {/* Location & Human Readable ID */}
          <div className="flex items-center justify-center gap-3 mb-4 text-xs text-muted-foreground font-medium flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{userLoc.isLoading ? 'Mendeteksi lokasi...' : (userLoc.fullLocation || 'Lokasi tidak diketahui')}</span>
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{humanReadableId}</span>
              <button 
                onClick={copyToClipboard}
                className="hover:text-foreground transition-colors p-0.5"
                title="Salin ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
              </button>
            </div>
          </div>

          {/* XP Progress Bar Card */}
          <Card className="w-full max-w-sm p-3.5 border-border/80 bg-card text-card-foreground rounded-2xl shadow-xs space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground">Kemajuan XP</span>
              <span className="font-bold text-primary">{profile.xp || 0} / {profile.nextLevelXp || 100} XP</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </Card>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTabChange('pengaturan')}
              className="text-xs font-bold rounded-xl gap-1.5 h-9 px-4 border-border"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Profil</span>
            </Button>
            <Link href="/tukar-poin">
              <Button
                size="sm"
                className="text-xs font-bold rounded-xl gap-1.5 h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Tukar Poin ({profile.points || 0})</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 2. AREA KONTEN & FLOATING KARTU STATISTIK ── */}
      <main className="max-w-2xl mx-auto px-4 -mt-6 relative z-30 space-y-6">
        
        {/* Stat Highlights Card */}
        <Card className="p-5 border border-border/80 bg-card text-card-foreground rounded-2xl shadow-xs">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {myReports.length}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Total Laporan
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                {profile.points || 0}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Poin Aktif
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {profile.streakDays || 0} <span className="text-sm font-semibold text-muted-foreground">Hari</span>
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Streak Lapor
              </span>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs Bar */}
        <div className="bg-card rounded-2xl border border-border/80 p-1.5 flex items-center gap-1 shadow-2xs">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === 'ringkasan' ? 'Ringkasan' : key === 'laporan' ? 'Laporan' : 'Ubah Data'}</span>
            </button>
          ))}
        </div>

        {/* MAIN TAB CONTENT DISPLAY AREA */}
        <section id="main-content" className="pt-1">

            {/* TAB 1: RINGKASAN */}
            {activeTab === 'ringkasan' && (
              <div className="space-y-4">
                
                {/* Status Ringkasan */}
                <Card className="p-4 sm:p-5 border-border/80 bg-card text-card-foreground rounded-2xl shadow-xs">
                  <h3 className="text-xs font-bold text-muted-foreground tracking-wide mb-3">
                    Status Laporan Anda
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: myReports.length, label: 'Total Laporan', color: 'text-foreground' },
                      { value: myReports.filter(r => r.status === 'Selesai').length, label: 'Selesai', color: 'text-emerald-600 dark:text-emerald-400' },
                      { value: myReports.filter(r => r.status === 'Diproses').length, label: 'Diproses', color: 'text-amber-600 dark:text-amber-400' },
                    ].map(({ value, label, color }) => (
                      <div key={label} className="p-3 rounded-xl bg-muted/20 border border-border/40 text-center">
                        <div className={`text-xl font-extrabold ${color} leading-none mb-1`}>{value}</div>
                        <div className="text-xs font-medium text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Aktivitas Terbaru List */}
                <Card className="p-4 sm:p-5 border-border/80 bg-card text-card-foreground rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Laporan Terbaru
                    </h3>
                    <button
                      onClick={() => handleTabChange('laporan')}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Lihat semua
                    </button>
                  </div>

                  {myReports.length > 0 ? (
                    <div className="divide-y border-border/40">
                      {myReports.slice(0, 3).map((report) => (
                        <div key={report.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={report.photoUrl}
                              alt={report.title}
                              className="w-11 h-11 rounded-xl object-cover border border-border shrink-0 bg-muted"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">{report.title}</p>
                              <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5 font-medium">
                                <MapPin className="w-3 h-3 text-primary shrink-0" />
                                {report.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusClass(report.status)}`}>
                              {report.status}
                            </span>
                            <Link href={`/laporan/${report.id}`}>
                              <Button size="sm" variant="outline" className="h-7 text-xs font-bold rounded-lg border-border">
                                Detail
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-xs font-semibold">Belum ada pengaduan dikirim.</p>
                      <Link href="/buat-laporan" className="inline-block mt-3">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl px-4 shadow-xs">
                          Buat Laporan Baru
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>

              </div>
            )}

            {/* TAB 2: LAPORAN SAYA */}
            {activeTab === 'laporan' && (
              <div className="space-y-3">
                <div className="bg-card rounded-2xl border border-border/80 p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
                  {(['Semua', 'Terverifikasi', 'Diproses', 'Selesai', 'Pending'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        statusFilter === f
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {filteredReports.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="p-3.5 border-border/80 bg-card text-card-foreground rounded-2xl flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={report.photoUrl}
                            alt={report.title}
                            className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getReportImgFallback(report.title);
                            }}
                          />
                          <div className="min-w-0">
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mb-1 ${statusClass(report.status)}`}>
                              {report.status}
                            </span>
                            <h4 className="text-xs font-bold text-foreground truncate">{report.title}</h4>
                            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5 font-medium">
                              <MapPin className="w-3 h-3 text-primary shrink-0" />
                              {report.address}
                            </p>
                          </div>
                        </div>

                        <Link href={`/laporan/${report.id}`} className="shrink-0 ml-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-xl border-border">
                            Detail
                          </Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground border-border/80 rounded-2xl">
                    <ShieldAlert className="w-6 h-6 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="text-xs font-bold text-foreground">Tidak Ada Laporan</p>
                  </Card>
                )}
              </div>
            )}

            {/* TAB 3: UBAH DATA PRIBADI */}
            {activeTab === 'pengaturan' && (
              <Card className="p-5 sm:p-6 border-border/80 bg-card text-card-foreground rounded-2xl shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  Ubah Data Pribadi
                </h3>

                {saveSuccess && (
                  <div className="mb-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Perubahan data berhasil disimpan!
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-border/60">
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-xs block"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarFallback(name || profile.name);
                      }}
                    />
                    <div>
                      <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground bg-muted hover:bg-muted/80 border border-border rounded-xl px-3.5 py-2 cursor-pointer transition-colors shadow-2xs">
                        <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Ganti Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarFileSelect}
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">Format JPG/PNG, maks 5MB.</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-foreground mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="emailAddress" className="block text-xs font-bold text-foreground mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      id="emailAddress"
                      type="email"
                      readOnly
                      value={email}
                      className="w-full h-11 px-3.5 bg-muted/60 border border-border rounded-xl text-xs font-medium text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-bold text-foreground mb-1.5">
                      Nomor Telepon
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold h-11 px-6 rounded-xl shadow-xs"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </Card>
            )}

          </section>

          {/* Tombol Keluar Sistem */}
          <Button
            variant="outline"
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              const email = user?.email || profile?.email || 'Unknown Email';
              await sendTelegramLog(`<b>👋 Logout Berhasil</b>\n\n<b>Email:</b> ${email}\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30 rounded-xl transition-colors shadow-2xs mt-4"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar Sistem</span>
          </Button>

      </main>

    </div>
  );
}

