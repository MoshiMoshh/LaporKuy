'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLaporKuyStore } from '@/lib/store';
import {
  MapPin,
  Clock,
  ChevronRight,
  Camera,
  CheckCircle2,
} from 'lucide-react';

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return 'Baru saja';
  }
};

const getCategoryMeta = (category: string) => {
  if (category.includes('Lampu')) return { bg: 'bg-amber-100/90', text: 'text-amber-800', emoji: '💡' };
  if (category.includes('Banjir')) return { bg: 'bg-blue-100/90', text: 'text-blue-800', emoji: '🌊' };
  if (category.includes('Sampah')) return { bg: 'bg-emerald-100/90', text: 'text-emerald-800', emoji: '🗑️' };
  return { bg: 'bg-slate-100/90', text: 'text-slate-800', emoji: '🛣️' };
};

export default function HomePage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 md:pb-0">
      {/* HERO */}
      <section className="relative px-5 pt-12 pb-12 md:px-8 md:pt-24 md:pb-20 max-w-6xl mx-auto overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

          <h1 className="text-[2.5rem] leading-[1.05] font-extrabold tracking-tighter sm:text-6xl md:text-7xl text-slate-900">
            Fasilitas rusak<br/>di sekitar lo?
          </h1>
          <p className="text-[1.05rem] sm:text-lg text-slate-500 leading-relaxed mt-5 max-w-sm font-medium">
            Kirim foto, biar yang urus bagian yang nindaklanjuti. Laporan diverifikasi instan.
          </p>

          <div className="flex flex-col sm:flex-row w-full justify-center gap-3 mt-8">
            <Link href="/buat-laporan" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-2xl font-bold gap-2.5 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                <Camera className="w-5 h-5" />
                Lapor Sekarang
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-slate-700 h-14 px-8 rounded-2xl font-bold gap-2.5 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <MapPin className="w-5 h-5 text-blue-600" />
                Buka Peta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CARA KERJA - Horizontal scroll on mobile for premium app feel */}
      <section className="py-12 md:py-20 bg-slate-50/50 border-y border-slate-100/60">
        <div className="px-5 max-w-6xl mx-auto mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Cara pakai
          </h2>
        </div>

        <div className="w-full overflow-x-auto pb-6 pt-2 hide-scrollbar">
          <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 px-5 max-w-6xl mx-auto w-max md:w-auto">
            {/* Step 1 */}
            <div className="w-[260px] md:w-auto shrink-0 bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1.5">1. Foto kerusakan</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Jalan, lampu, drainase — apa aja yang ganggu fasilitas.</p>
            </div>
            
            {/* Step 2 */}
            <div className="w-[260px] md:w-auto shrink-0 bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1.5">2. Lokasi ke-detect</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Nggak perlu ketik alamat. HP lo yang kerja otomatis.</p>
            </div>

            {/* Step 3 */}
            <div className="w-[260px] md:w-auto shrink-0 bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1.5">3. Diteruskan ke dinas</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Laporan diverifikasi sistem dan diteruskan. Tinggal pantau.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LAPORAN TERBARU */}
      <section className="px-5 py-14 md:py-24 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Laporan terbaru
          </h2>
          <Link href="/dashboard" className="text-sm font-bold text-blue-600 flex items-center gap-1 group shrink-0 hover:text-blue-700">
            Lihat semua
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reports.slice(0, 6).map((report) => {
            const cat = getCategoryMeta(report.category);

            const fallbackPhotoUrl = report.category.includes('Lampu')
              ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80'
              : report.category.includes('Banjir')
              ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80'
              : report.category.includes('Sampah')
              ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'
              : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80';

            return (
              <Link
                href={`/laporan/${report.id}`}
                key={report.id}
                className="group flex flex-col"
              >
                {/* Borderless Canvas Card Pattern */}
                <div className="w-full relative bg-slate-100 rounded-3xl overflow-hidden aspect-[4/3] mb-4">
                  <img
                    src={report.photoUrl || fallbackPhotoUrl}
                    alt={report.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = fallbackPhotoUrl;
                    }}
                  />
                  {/* Subtle overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4">
                    <div className={`${cat.bg} ${cat.text} backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-white/20`}>
                      {cat.emoji} {report.category}
                    </div>
                  </div>
                </div>

                <div className="px-1 flex flex-col flex-1">
                  <h3 className="font-bold text-[1.1rem] leading-[1.3] text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5 truncate pr-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{report.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-100/80 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Enable horizontal scroll hiding */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}