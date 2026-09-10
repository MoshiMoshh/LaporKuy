import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Camera, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#001F5B] via-[#003082] to-[#001040] pt-24 pb-36 overflow-hidden">
      {/* Decorative city silhouette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        <Image 
          src="/skyline-jakarta.png" 
          alt="Jakarta Skyline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_bottom] opacity-20 filter invert brightness-200" 
        />
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
          <Link href="/buat-laporan" className="w-full">
            <Button variant="liquid-primary" size="xl" className="w-full">
              <Camera className="w-5 h-5 shrink-0 text-white drop-shadow-md" />
              <span className="truncate drop-shadow-md">Lapor Sekarang</span>
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full">
            <Button variant="liquid-glass" size="xl" className="w-full">
              <MapPin className="w-5 h-5 shrink-0 text-amber-400 drop-shadow-md" />
              <span className="truncate drop-shadow-md">Buka Peta</span>
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
  );
}
