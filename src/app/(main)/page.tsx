'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLaporKuyStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Camera, CheckCircle2, Zap } from 'lucide-react';

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch { return 'Baru saja'; }
};

const getCategoryMeta = (category: string) => {
  if (category.includes('Lampu')) return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', emoji: '💡' };
  if (category.includes('Banjir')) return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', emoji: '🌊' };
  if (category.includes('Sampah')) return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', emoji: '🗑️' };
  return { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', emoji: '🛣️' };
};

const stagger = {
  container: { transition: { staggerChildren: 0.09 } },
  item: { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">

      {/* ── HERO ── */}
      <section className="relative w-full bg-gradient-to-b from-[#001F5B] via-[#003082] to-[#001040] pt-24 pb-36 overflow-hidden">
        {/* Decorative city silhouette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
          <img src="/skyline-jakarta.png" alt="Jakarta Skyline"
            className="block md:hidden w-full h-[60vh] object-cover object-[15%_bottom] opacity-20 mix-blend-multiply brightness-150 contrast-[1200%] grayscale" />
          <img src="/skyline-jakarta.png" alt="Jakarta Skyline"
            className="hidden md:block w-full h-[55vh] object-cover object-center opacity-20 mix-blend-multiply brightness-150 contrast-[1200%] grayscale" />
        </div>

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/25 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-5"
        >
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/85 text-xs font-semibold tracking-wide mb-7"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Diverifikasi AI dalam &lt;30 detik
          </motion.div>

          <h1 className="text-[2.6rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl text-white mb-5">
            Fasilitas rusak<br />
            <span className="text-blue-200">di sekitar lo?</span>
          </h1>
          <p className="text-[1.05rem] text-blue-100/85 leading-relaxed max-w-sm font-medium">
            Foto + lokasi otomatis. AI klasifikasi instan. Diteruskan ke dinas. Tinggal pantau.
          </p>

          <div className="flex flex-col sm:flex-row w-full justify-center gap-3 mt-9">
            <Link href="/buat-laporan" className="w-full sm:w-auto">
              <Button variant="liquid-primary" size="xl" className="w-full sm:w-auto gap-2.5">
                <Camera className="w-5 h-5" />
                Lapor Sekarang
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="liquid-glass" size="xl" className="w-full sm:w-auto gap-2.5">
                <MapPin className="w-5 h-5 text-blue-200" />
                Lihat Peta Laporan
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Wave divider */}
        <div className="absolute bottom-[-1px] w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[48px] md:h-[80px]" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.34,188.75,99.43,234.84,86.7,278.47,72.26,321.39,56.44Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="py-10 md:py-16">
        <div className="px-5 max-w-6xl mx-auto mb-5 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Cara pakai</h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1 font-medium">Tiga langkah cepat. Langsung dari HP lo.</p>
        </div>

        <div className="px-5 max-w-6xl mx-auto w-full">
          <motion.div
            className="flex flex-col md:grid md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-6"
            {...stagger.container}
          >
            {[
              { icon: Camera, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40', step: '01', title: 'Foto kerusakan', desc: 'Jalan, lampu, drainase — apa aja fasilitas umum yang rusak.' },
              { icon: MapPin, color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40', step: '02', title: 'Lokasi ke-detect', desc: 'Tanpa perlu ketik alamat manual. GPS HP lo yang kerja otomatis.' },
              { icon: CheckCircle2, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40', step: '03', title: 'Diteruskan ke dinas', desc: 'Laporan diverifikasi AI dan diteruskan langsung. Tinggal pantau.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                {...stagger.item}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-card rounded-2xl border border-border/80 p-3.5 sm:p-4 md:p-6 shadow-xs select-none touch-manipulation transition-all"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                {/* Mobile View: Compact Row Layout (No Swipe Needed, Low Height) */}
                <div className="flex md:hidden items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-foreground truncate">{item.title}</h3>
                      <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground/80 font-mono shrink-0">
                        {item.step}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2">{item.desc}</p>
                  </div>
                </div>

                {/* Desktop View: Traditional Spacious Card Layout */}
                <div className="hidden md:block">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5" strokeWidth={2.2} />
                    </div>
                    <span className="text-3xl font-black text-border/60 leading-none">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LAPORAN TERBARU ── */}
      <section className="px-5 py-12 md:py-20 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Laporan terbaru</h2>
            <p className="text-muted-foreground text-sm mt-1 font-medium">Langsung dari warga sekitar</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors touch-manipulation active:opacity-75 shrink-0 group">
            Lihat semua
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          {...stagger.container}
        >
          {reports.slice(0, 6).map((report) => {
            const cat = getCategoryMeta(report.category);
            const fallbackPhotoUrl = report.category.includes('Lampu') ? '/images/reports/streetlight.jpg'
              : report.category.includes('Banjir') ? '/images/reports/flood.jpg'
              : report.category.includes('Sampah') ? '/images/reports/trash.jpg'
              : '/images/reports/pothole.jpg';

            return (
              <motion.div key={report.id} {...stagger.item}>
                <Link
                  href={`/laporan/${report.id}`}
                  className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] touch-manipulation select-none"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={report.photoUrl || fallbackPhotoUrl}
                      alt={report.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = fallbackPhotoUrl; }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`${cat.bg} ${cat.text} inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border`}>
                        {cat.emoji} {report.category}
                      </span>
                    </div>
                    {/* Urgent badge */}
                    {report.isUrgent && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-urgent text-white border border-white/20">
                          ⚡ Urgen
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-[0.95rem] leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-3">
                      {report.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate pr-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{report.address}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 bg-muted px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {formatDate(report.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {reports.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-semibold">Belum ada laporan</p>
            <p className="text-sm mt-1">Jadilah yang pertama melaporkan!</p>
          </div>
        )}
      </section>
    </div>
  );
}