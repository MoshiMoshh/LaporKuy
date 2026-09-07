import { motion } from 'framer-motion';
import { Camera, MapPin, CheckCircle2 } from 'lucide-react';

const stagger = {
  container: { transition: { staggerChildren: 0.09 } },
  item: { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export function HowItWorksSection() {
  return (
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
            { icon: Camera, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', step: '01', title: 'Foto kerusakan', desc: 'Jalan, lampu, drainase — apa aja fasilitas umum yang rusak.' },
            { icon: MapPin, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40', step: '02', title: 'Lokasi ke-detect', desc: 'Tanpa perlu ketik alamat manual. GPS HP lo yang kerja otomatis.' },
            { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40', step: '03', title: 'Diteruskan ke dinas', desc: 'Laporan diverifikasi dan diteruskan langsung. Tinggal pantau.' },
          ].map((item) => (
            <motion.div
              key={item.step}
              {...stagger.item}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl border border-border/40 p-4 md:p-6 shadow-sm transition-all"
            >
              {/* Mobile View: Compact Row Layout */}
              <div className="flex md:hidden items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground truncate">{item.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                      {item.step}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mt-1 line-clamp-2">{item.desc}</p>
                </div>
              </div>

              {/* Desktop View: Traditional Spacious Card Layout */}
              <div className="hidden md:block">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <span className="text-2xl font-medium text-border">{item.step}</span>
                </div>
                <h3 className="font-semibold text-base text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
