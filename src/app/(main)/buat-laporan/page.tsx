'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { ReportCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  MapPin,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  X,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { motion } from 'framer-motion';

const sampleAIResults: Record<string, { category: ReportCategory; severity: number; confidence: number; authenticity: number; recommendation: string }> = {
  pothole: { category: 'Jalan Rusak', severity: 9, confidence: 97, authenticity: 99, recommendation: 'Rekomendasi URC: Penambalan aspal dingin / hotmix darurat.' },
  lamp: { category: 'Lampu Mati', severity: 6, confidence: 94, authenticity: 98, recommendation: 'Rekomendasi URC: Penggantian bohlam LED PJU 150W.' },
  trash: { category: 'Sampah', severity: 8, confidence: 98, authenticity: 96, recommendation: 'Rekomendasi URC: Pengangkutan armada truk DLH.' },
  flood: { category: 'Banjir', severity: 7, confidence: 92, authenticity: 97, recommendation: 'Rekomendasi URC: Pengerukan pompa penyedot air.' },
};

function BuatLaporanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addReport, reports } = useLaporKuyStore();

  const questParam = searchParams.get('quest');
  const questTitleParam = searchParams.get('title');
  const categoryParam = searchParams.get('category');
  const addressParam = searchParams.get('address');
  const districtParam = searchParams.get('district');

  const [location, setLocation] = useState({
    address: addressParam || 'Jl. Raya Darmo No. 42, Wonokromo, Surabaya',
    district: districtParam || 'Kec. Wonokromo',
    lat: -7.2891,
    lng: 112.7385,
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<typeof reports[0] | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<typeof sampleAIResults['pothole'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (addressParam && districtParam) {
      setLocation((prev) => ({
        ...prev,
        address: addressParam,
        district: districtParam,
      }));
    }

    if (navigator.geolocation && !addressParam) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const sampleLocations = [
            { address: 'Jl. Pemuda No. 18, Genteng, Surabaya (Terdeteksi GPS)', district: 'Kec. Genteng' },
            { address: 'Jl. Gubeng Kertajaya No. 88, Gubeng, Surabaya (Terdeteksi GPS)', district: 'Kec. Gubeng' },
            { address: 'Jl. Mayjen Sungkono No. 102, Dukuh Pakis, Surabaya (Terdeteksi GPS)', district: 'Kec. Dukuh Pakis' },
            { address: 'Jl. Keputih Timur No. 15, Sukolilo, Surabaya (Terdeteksi GPS)', district: 'Kec. Sukolilo' },
            { address: 'Jl. Raya Darmo No. 42, Wonokromo, Surabaya (Terdeteksi GPS)', district: 'Kec. Wonokromo' },
          ];
          const chosen = sampleLocations[Math.abs(Math.floor((lat + lng) * 1000)) % sampleLocations.length];

          setLocation({
            address: chosen.address,
            district: chosen.district,
            lat: lat,
            lng: lng,
          });
          setIsLocating(false);
        },
        () => setIsLocating(false),
        { timeout: 5000 }
      );
    }
  }, [searchParams, addressParam, districtParam]);

  const handlePhotoSelected = (imgUrl: string) => {
    setPhotoUrl(imgUrl);
    setDuplicateMatch(null);
    setAiResult(null);

    setIsCheckingDuplicates(true);
    setTimeout(() => {
      setIsCheckingDuplicates(false);
      if (reports.length > 0 && Math.random() > 0.5) {
        setDuplicateMatch(reports[0]);
      } else {
        runAIClassification(imgUrl);
      }
    }, 1200);
  };

  const runAIClassification = (imgUrl: string) => {
    setIsClassifying(true);
    setTimeout(() => {
      setIsClassifying(false);
      if (categoryParam === 'Sampah') {
        setAiResult(sampleAIResults.trash);
      } else if (imgUrl.startsWith('blob:')) {
        const keys = Object.keys(sampleAIResults);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setAiResult(sampleAIResults[randomKey as keyof typeof sampleAIResults]);
      } else if (imgUrl.includes('trash')) setAiResult(sampleAIResults.trash);
      else if (imgUrl.includes('flood')) setAiResult(sampleAIResults.flood);
      else if (imgUrl.includes('lamp')) setAiResult(sampleAIResults.lamp);
      else setAiResult(sampleAIResults.pothole);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !aiResult) return;

    setIsSubmitting(true);

    try {
      const created = await addReport({
        title: `${aiResult.category} di ${location.district}`,
        category: aiResult.category,
        severity: aiResult.severity as any,
        address: location.address,
        district: location.district,
        lat: location.lat,
        lng: location.lng,
        photoUrl: photoUrl,
        description: description || 'Laporan dibuat pengguna melalui form web.',
        status: 'Terverifikasi',
        userId: 'usr-001',
        userName: 'Budi Santoso',
        isUrgent,
        aiAuthenticityScore: aiResult.authenticity,
        aiConfidence: aiResult.confidence,
      });

      setIsSubmitting(false);
      router.push(`/laporan/${created.id}`);
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className="mx-auto max-w-3xl px-4 py-8 sm:px-6 font-sans pb-28 md:pb-12"
    >
      {/* Active Mission Context Card */}
      {questParam && (
        <div className="mb-6 p-5 bg-card/90 backdrop-blur-xl border border-border rounded-3xl shadow-card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                <Target className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    Misi Aktif
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight leading-snug">
                  {questTitleParam || 'Misi Pengaduan Warga'}
                </h3>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900 text-xs font-bold shrink-0 px-3 py-1 rounded-full">
              +15 Pts Reward
            </Badge>
          </div>

          <div className="pt-3 border-t border-border/60 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Panduan Pengerjaan
            </span>

            <div className="space-y-2 pl-0.5">
              {[
                { num: '1', text: 'Ambil atau unggah foto kerusakan di lokasi.' },
                { num: '2', text: 'Pastikan GPS aktif untuk verifikasi lokasi otomatis.' },
                { num: '3', text: 'Kirim laporan dan klaim reward poin.' },
              ].map((step) => (
                <div key={step.num} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-foreground text-[11px] font-bold shrink-0 border border-border">
                    {step.num}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="mb-7 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI Vision Multi-Sensor
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Formulir Pengaduan Publik
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto font-medium">
          Unggah foto bukti lapangan, AI akan mengklasifikasikan kategori kerusakan dan meneruskannya ke dinas terkait secara instan.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-8 space-y-7">
        
        {/* LOCATION SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider block mb-0.5">
                Lokasi Terdeteksi (GPS Presisi)
              </span>
              <span className="text-sm font-semibold text-foreground truncate block">
                {isLocating ? 'Mendeteksi koordinat lokasi...' : location.address}
              </span>
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-full shrink-0 flex items-center gap-1.5 self-start sm:self-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Terverifikasi Presisi</span>
          </div>
        </div>

        {/* PHOTO UPLOAD SECTION */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Bukti Foto Kerusakan <span className="text-urgent">*</span>
          </label>

          {!photoUrl ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center p-7 border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-primary/5 active:scale-[0.97] transition-all touch-manipulation select-none cursor-pointer bg-card group min-h-[140px]">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="sr-only" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handlePhotoSelected(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Gunakan Kamera</span>
                <span className="text-xs text-muted-foreground mt-1 text-center font-medium">
                  Ambil gambar langsung dari perangkat
                </span>
              </label>

              <label className="flex flex-col items-center justify-center p-7 border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-primary/5 active:scale-[0.97] transition-all touch-manipulation select-none cursor-pointer bg-card group min-h-[140px]">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handlePhotoSelected(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-3 group-hover:text-primary group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Unggah File</span>
                <span className="text-xs text-muted-foreground mt-1 text-center font-medium">
                  Pilih gambar dari galeri Anda
                </span>
              </label>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
              <img src={photoUrl} alt="Preview Bukti Foto" className="h-64 sm:h-72 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl(null);
                  setAiResult(null);
                  setDuplicateMatch(null);
                }}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 text-white hover:bg-slate-900 active:scale-95 transition-all backdrop-blur-md touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Hapus Foto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* DUPLICATE CHECK & AI ANALYSIS */}
        {isCheckingDuplicates && (
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              Memverifikasi duplikasi laporan di lokasi sekitar...
            </span>
          </div>
        )}

        {isClassifying && (
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/60 dark:bg-blue-950/60 dark:border-blue-900 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              AI Vision sedang membedah foto dan mengklasifikasi tingkat keparahan...
            </span>
          </div>
        )}

        {/* AI RESULT PREVIEW */}
        {photoUrl && aiResult && !isClassifying && (
          <div className="p-5 rounded-2xl border border-border bg-muted/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Hasil Analisis AI Vision
              </span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs font-bold rounded-full">
                Autentisitas {aiResult.authenticity}%
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div className="bg-card p-3 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[11px] font-medium">Kategori Terdeteksi:</span>
                <span className="font-extrabold text-foreground text-sm mt-0.5 block">{aiResult.category}</span>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border">
                <span className="text-muted-foreground block text-[11px] font-medium">Tingkat Keparahan:</span>
                <span className="font-extrabold text-urgent text-sm mt-0.5 block">{aiResult.severity} / 10 (Tinggi)</span>
              </div>
            </div>
            <p className="text-xs text-foreground/80 border-t border-border/80 pt-2.5 font-medium leading-relaxed">
              💡 {aiResult.recommendation}
            </p>
          </div>
        )}

        {/* DESCRIPTION FIELD */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-foreground">
            Deskripsi Detail Masalah
          </label>
          <div className="relative">
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail patokan lokasi atau kondisi kerusakan di lapangan..."
              className="w-full rounded-2xl border-border focus:ring-primary pr-12 text-sm p-4"
            />
            <div className="absolute bottom-3 right-3">
              <VoiceInputButton onTranscript={(text: string) => setDescription((prev) => (prev ? `${prev} ${text}` : text))} />
            </div>
          </div>
        </div>

        {/* URGENT FLAG */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
          <input
            type="checkbox"
            id="urgent"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-5 w-5 rounded-md border-rose-300 text-urgent focus:ring-urgent touch-manipulation cursor-pointer"
          />
          <label htmlFor="urgent" className="text-xs font-bold text-rose-900 dark:text-rose-200 cursor-pointer flex items-center gap-2 select-none touch-manipulation active:opacity-75">
            <AlertTriangle className="h-4 w-4 text-urgent shrink-0" />
            Tandai sebagai Laporan Darurat / Butuh Penanganan Tim Tanggap Kilat Segera
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={!photoUrl || isSubmitting || isCheckingDuplicates || isClassifying}
          variant="liquid-primary"
          size="xl"
          className="w-full h-14 font-extrabold text-base rounded-2xl shadow-lg transition-all touch-manipulation"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2.5">
              <Loader2 className="h-5 w-5 animate-spin" /> Mengirimkan Laporan ke Dinas...
            </span>
          ) : (
            'Kirim Laporan Pengaduan'
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function BuatLaporanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <BuatLaporanForm />
    </Suspense>
  );
}
