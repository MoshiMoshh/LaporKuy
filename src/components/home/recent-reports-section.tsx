import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Camera } from 'lucide-react';
import { Report } from '@/types';
import { formatDate } from '@/lib/utils';

const getCategoryMeta = (category: string) => {
  if (category.includes('Lampu')) return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', emoji: '💡' };
  if (category.includes('Banjir')) return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', emoji: '🌊' };
  if (category.includes('Sampah')) return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', emoji: '🗑️' };
  if (category.includes('Trotoar')) return { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', emoji: '🚶' };
  return { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', emoji: '🛣️' };
};

const stagger = {
  container: { transition: { staggerChildren: 0.09 } },
  item: { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

interface RecentReportsSectionProps {
  reports: Report[];
}

export function RecentReportsSection({ reports }: RecentReportsSectionProps) {
  return (
    <section className="px-5 py-12 md:py-20 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Laporan terbaru</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Langsung dari warga sekitar</p>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors touch-manipulation active:opacity-75 shrink-0 group">
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
                className="group flex flex-col bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] touch-manipulation select-none"
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
  );
}
