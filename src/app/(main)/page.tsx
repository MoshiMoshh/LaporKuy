'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLaporKuyStore } from '@/lib/store';
import { Footer } from "@/components/layout/footer";

// ==========================================
// CUSTOM PREMIUM INLINE SVG ICON COMPONENTS
// ==========================================

const DocumentIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const LightningIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const CircleCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const BuildingIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
  </svg>
);

const MegaphoneIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// Format date helper for localized experience
const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Baru saja';
  }
};

export default function HomePage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA]">
      
      {/* ═══════════════════════════════════════════════
          HERO SECTION 
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white border-b border-[#EAEAEA] py-6 sm:py-12 lg:py-20">
        {/* Soft Ambient Light Backdrop */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-b from-[#0057B8]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Texts */}
            <div className="lg:col-span-7 flex flex-col text-left items-start">
              
              {/* Welcome Badge (Subtle, Pill, No Emoji) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E1F3FE] text-[#1F6C9F] text-[10px] font-bold tracking-wide uppercase mb-3.5 border border-[#1F6C9F]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8] shrink-0" />
                <span>Portal Resmi Pengaduan</span>
              </div>
              
              {/* Main Headline (Larger & Stronger) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#003B73] tracking-tight leading-[1.1] mb-3 text-pretty">
                Layanan Pengaduan Infrastruktur Publik
              </h1>
              
              {/* Sub-description (Concise, max 3-4 lines on mobile) */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 max-w-xl text-pretty">
                Laporkan kerusakan fasilitas umum, jalan berlubang, dan gangguan layanan kota secara cepat, transparan, dan terintegrasi langsung ke dinas terkait.
              </p>
              
              {/* Action Buttons (Primary CTA vs Secondary CTA) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6">
                <Link href="/buat-laporan" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-11 px-5 font-bold rounded-lg shadow-none bg-[#0057B8] hover:bg-[#003b73] active:scale-[0.98] transition-all text-white flex items-center justify-center gap-2 text-xs">
                    <DocumentIcon className="w-4 h-4 shrink-0" />
                    Buat Pengaduan Baru
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-11 px-5 font-bold rounded-lg shadow-none border-[#EAEAEA] bg-white text-slate-700 hover:bg-[#F7F6F3] hover:text-[#0057B8] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs">
                    <MapPinIcon className="w-4 h-4 text-[#0057B8] shrink-0" />
                    Lihat Peta Laporan
                  </Button>
                </Link>
              </div>

              {/* Trust Badge Card (Compact) */}
              <div className="w-full max-w-md bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-3 flex items-center gap-3 text-left">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EDF3EC] text-[#346538] shrink-0 border border-[#346538]/10">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">Aman & Terlindungi</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Laporan Anda ditangani secara transparan oleh instansi berwenang.
                  </p>
                </div>
              </div>

            </div>
            
            {/* Right Visual - Compact Phone Mockup (Hidden on Mobile/Tablet, Displayed compactly on Desktop) */}
            <div className="hidden lg:col-span-5 lg:flex items-center justify-center relative w-full px-4 select-none">
              
              <div className="absolute inset-0 bg-grid-pattern-subtle opacity-40 rounded-3xl -z-10 pointer-events-none" />
              
              <div className="relative w-full max-w-[260px] aspect-[9/18] bg-slate-900 rounded-[32px] p-2.5 shadow-xl border-4 border-slate-800/90">
                
                {/* Screen Reflection overlay */}
                <div className="absolute inset-2 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-[22px] pointer-events-none z-20" />
                
                {/* Speaker Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-5 h-0.5 bg-slate-800 rounded-full" />
                </div>

                {/* Screen content */}
                <div className="w-full h-full bg-[#F5F7FA] rounded-[22px] overflow-hidden flex flex-col pt-7 pb-2 px-2.5 relative border border-slate-950/20 text-[#172033]">
                  
                  {/* Status Bar */}
                  <div className="absolute top-1.5 left-0 right-0 px-4 flex justify-between items-center text-[8px] font-bold text-slate-600">
                    <span>9:41</span>
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-1.2 0-2.4.4-3.4 1.1L2.1 11.2c-.8.8-.8 2 0 2.8l1.4 1.4c.8.8 2 .8 2.8 0L12 9.7l5.7 5.7c.8.8 2 .8 2.8 0l1.4-1.4c.8-.8.8-2 0-2.8l-6.5-7.1C14.4 3.4 13.2 3 12 3z"/></svg>
                      <div className="w-3.5 h-2 border border-slate-600 rounded-2xs p-0.5 flex items-center"><div className="h-full w-2 bg-slate-600 rounded-3xs"></div></div>
                    </div>
                  </div>

                  {/* Inside App Header */}
                  <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-1.5 mb-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#0057B8] rounded flex items-center justify-center text-white">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>
                      </div>
                      <span className="text-[9px] font-extrabold text-[#003B73] tracking-tight">LaporKuy</span>
                    </div>
                    <div className="w-3 h-3 text-slate-500">
                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                    </div>
                  </div>

                  {/* Inside App Form fields */}
                  <div className="flex-1 flex flex-col gap-1.5 text-left">
                    <h4 className="text-[9px] font-extrabold text-[#003B73] uppercase tracking-wider mb-0.5">Buat Laporan</h4>
                    
                    <div className="bg-white border border-[#D9DEE5] rounded p-1.5 flex items-center justify-between">
                      <span className="text-[8px] font-semibold text-slate-500">Kategori Kerusakan</span>
                      <svg className="w-2 h-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
                    </div>

                    <div className="bg-white border border-[#D9DEE5] rounded p-1.5 flex items-center justify-between">
                      <span className="text-[8px] font-semibold text-slate-500">Lokasi</span>
                      <svg className="w-2 h-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
                    </div>

                    <div className="bg-white border border-[#D9DEE5] rounded p-1.5 flex flex-col flex-1 min-h-[36px]">
                      <span className="text-[8px] text-slate-400">Deskripsi laporan...</span>
                    </div>

                    <div className="bg-white border border-[#D9DEE5] rounded p-1.5 flex items-center justify-between">
                      <span className="text-[8px] font-semibold text-slate-500">Foto Pendukung</span>
                      <div className="w-3.5 h-3.5 bg-slate-100 rounded flex items-center justify-center text-slate-500 border border-[#D9DEE5]">
                        <span className="text-[9px] font-bold">+</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="w-full h-7 bg-[#0057B8] text-white rounded text-[8px] font-bold uppercase tracking-wider flex items-center justify-center">
                      Kirim Laporan
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION MANFAAT (Kenapa LaporKuy?)
      ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#EAEAEA] py-8 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-left mb-8 max-w-xl">
            <span className="text-[10px] font-bold text-[#0057B8] uppercase tracking-wider">
              Kenapa LaporKuy?
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
              Pengaduan Anda, <span className="text-[#0057B8]">Perubahan Nyata</span>
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Cepat & Mudah */}
            <div className="bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-5 flex flex-col items-start hover:border-[#0057B8]/20 transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E1F3FE] text-[#1F6C9F] mb-3.5 shrink-0 border border-[#1F6C9F]/10">
                <LightningIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] mb-1.5">Cepat & Mudah</h3>
              <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                Buat laporan dalam beberapa langkah sederhana kapan saja dan di mana saja.
              </p>
            </div>

            {/* Card 2: Transparan */}
            <div className="bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-5 flex flex-col items-start hover:border-[#0057B8]/20 transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDF3EC] text-[#346538] mb-3.5 shrink-0 border border-[#346538]/10">
                <CircleCheckIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] mb-1.5">Transparan</h3>
              <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                Pantau status laporan Anda secara real-time hingga selesai ditindaklanjuti.
              </p>
            </div>

            {/* Card 3: Partisipatif */}
            <div className="bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-5 flex flex-col items-start hover:border-[#0057B8]/20 transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDEBEC] text-[#9F2F2D] mb-3.5 shrink-0 border border-[#9F2F2D]/10">
                <UsersIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] mb-1.5">Partisipatif</h3>
              <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                Setiap laporan Anda membantu mewujudkan lingkungan kota yang lebih baik.
              </p>
            </div>

            {/* Card 4: Terintegrasi */}
            <div className="bg-[#FBFBFA] border border-[#EAEAEA] rounded-lg p-5 flex flex-col items-start hover:border-[#0057B8]/20 transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBF3DB] text-[#956400] mb-3.5 shrink-0 border border-[#956400]/10">
                <BuildingIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] mb-1.5">Terintegrasi</h3>
              <p className="text-xs text-slate-500 leading-relaxed text-pretty">
                Terhubung langsung dengan instansi terkait untuk penanganan lebih efektif.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION STATISTIK
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#FBFBFA] border-b border-[#EAEAEA] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 divide-y-0 divide-x-0 lg:divide-x divide-[#EAEAEA]">
              
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center p-1.5">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#E1F3FE] text-[#1F6C9F] mb-2 shrink-0">
                  <DocumentIcon className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#003B73] font-mono tracking-tight tabular-nums">
                  1.248
                </span>
                <span className="text-[11px] font-bold text-[#172033] mt-0.5">Total Laporan</span>
                <span className="text-[9px] text-slate-500">Sejak Jan 2024</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center p-1.5">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#FBF3DB] text-[#956400] mb-2 shrink-0">
                  <ClockIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#956400] font-mono tracking-tight tabular-nums">
                  892
                </span>
                <span className="text-[11px] font-bold text-[#172033] mt-0.5">Dalam Proses</span>
                <span className="text-[9px] text-slate-500">Sedang ditindaklanjuti</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center p-1.5">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#EDF3EC] text-[#346538] mb-2 shrink-0">
                  <CircleCheckIcon className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#346538] font-mono tracking-tight tabular-nums">
                  2.156
                </span>
                <span className="text-[11px] font-bold text-[#172033] mt-0.5">Selesai</span>
                <span className="text-[9px] text-slate-500">Berhasil ditangani</span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center p-1.5">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#E1F3FE] text-[#1F6C9F] mb-2 shrink-0">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0057B8] font-mono tracking-tight tabular-nums">
                  1.034
                </span>
                <span className="text-[11px] font-bold text-[#172033] mt-0.5">Pengguna Aktif</span>
                <span className="text-[9px] text-slate-500">Bergabung bersama kami</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DAFTAR LAPORAN TERBARU
      ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        
        {/* Section Title Bar */}
        <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-[#EAEAEA]">
          <h2 className="text-sm sm:text-base font-bold text-[#003B73] tracking-tight">
            Daftar Pengaduan Terbaru
          </h2>
          <Link href="/dashboard" className="text-xs font-bold text-[#0057B8] hover:text-[#003b73] transition-colors flex items-center gap-1">
            Lihat Semua
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </Link>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.slice(0, 6).map((report) => {
            // Pastel colors based on status
            const statusConfig = 
              report.status === 'Selesai'
                ? { bg: 'bg-[#EDF3EC]', text: 'text-[#346538]' }
                : report.status === 'Diproses'
                ? { bg: 'bg-[#FBF3DB]', text: 'text-[#956400]' }
                : { bg: 'bg-[#EAEAEA]', text: 'text-slate-700' };

            const fallbackPhotoUrl = report.category.includes('Lampu') 
              ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80'
              : report.category.includes('Banjir')
              ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80'
              : report.category.includes('Sampah')
              ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'
              : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80';

            return (
              <Card key={report.id} className="rounded-lg border border-[#EAEAEA] shadow-none bg-white overflow-hidden flex flex-col hover:border-[#0057B8]/20 transition-all duration-200">
                
                {/* Photo Header */}
                <div className="h-40 w-full relative border-b border-[#EAEAEA] bg-slate-50">
                  <img
                    src={report.photoUrl || fallbackPhotoUrl}
                    alt={report.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = fallbackPhotoUrl }}
                  />
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} border border-current/10`}>
                      {report.status}
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex flex-col flex-1">
                  
                  {/* Date Metadata */}
                  <span className="text-[8px] text-slate-500 font-semibold flex items-center gap-1 mb-2 uppercase tracking-wider">
                    <ClockIcon className="w-3 h-3" /> 
                    {formatDate(report.createdAt)}
                  </span>
                  
                  {/* Report Title */}
                  <h3 className="font-bold text-xs sm:text-sm text-[#172033] line-clamp-2 mb-3.5 leading-snug hover:text-[#0057B8] transition-colors">
                    <Link href={`/laporan/${report.id}`}>
                      {report.title}
                    </Link>
                  </h3>
                  
                  {/* Location Address */}
                  <div className="mt-auto pt-2.5 border-t border-[#FBFBFA] flex items-start gap-1 text-[11px] text-slate-600">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-[#0057B8] mt-0.5" />
                    <span className="line-clamp-1">{report.address}</span>
                  </div>

                </div>

              </Card>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOTTOM BANNER & LAYOUT SAFE AREA
          Using padding bottom pb-24 to ensure content doesn't get hidden behind BottomNav
      ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 sm:pb-12 w-full">
        <div className="bg-[#E1F3FE]/50 border border-[#E1F3FE] rounded-lg py-3.5 px-5 flex items-center justify-center gap-2.5 shadow-2xs">
          <div className="text-[#1F6C9F]">
            <MegaphoneIcon className="w-4.5 h-4.5 shrink-0" />
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-[#1F6C9F] flex items-center gap-1.5 text-center">
            Bersama kita wujudkan kota yang lebih baik
            <HeartIcon className="w-3.5 h-3.5 text-red-500 inline-block" />
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
