import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Camera, Zap } from 'lucide-react';

export function HeroSection() {
  return (
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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5">
          Fasilitas rusak<br />
          <span className="text-blue-200">di sekitar lo?</span>
        </h1>
        <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-sm font-normal">
          Foto + lokasi otomatis. Diteruskan ke dinas terkait. Tinggal pantau progressnya.
        </p>

        {/* Side-by-Side Action Buttons — High-Affordance Civic-Tech */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg mx-auto mt-8 select-none">
          {/* Primary Action: Lapor Sekarang (Orange) */}
          <Link
            href="/buat-laporan"
            className="w-full h-14 rounded-2xl bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 hover:brightness-105 active:brightness-95 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 px-3 sm:px-4 transition-all touch-manipulation select-none"
          >
            <Camera className="w-5 h-5 shrink-0 text-white" />
            <span className="truncate">Lapor Sekarang</span>
          </Link>

          {/* Secondary Action: Buka Peta / Lihat Peta Laporan */}
          <Link
            href="/dashboard"
            className="w-full h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 px-3 sm:px-4 transition-all touch-manipulation select-none"
          >
            <MapPin className="w-5 h-5 shrink-0 text-[#0057B8] dark:text-blue-400" />
            <span className="truncate">Lihat Peta Laporan</span>
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
  );
}
