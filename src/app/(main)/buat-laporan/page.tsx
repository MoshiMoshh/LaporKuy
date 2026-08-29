'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { ReportCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ThumbsUp,
  Flame,
  X,
  Volume2,
} from 'lucide-react';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { ConfettiOverlay } from '@/components/ui/confetti-overlay';

const sampleAIResults: Record<string, { category: ReportCategory; severity: number; confidence: number; authenticity: number; recommendation: string }> = {
  pothole: { category: 'Jalan Rusak', severity: 9, confidence: 97, authenticity: 99, recommendation: 'Rekomendasi URC: Penambalan aspal dingin / hotmix darurat.' },
  lamp: { category: 'Lampu Mati', severity: 6, confidence: 94, authenticity: 98, recommendation: 'Rekomendasi URC: Penggantian bohlam LED PJU 150W.' },
  trash: { category: 'Sampah', severity: 8, confidence: 98, authenticity: 96, recommendation: 'Rekomendasi URC: Pengangkutan armada truk DLH.' },
  flood: { category: 'Banjir', severity: 7, confidence: 92, authenticity: 97, recommendation: 'Rekomendasi URC: Pengerukan pompa penyedot air.' },
};

export default function BuatLaporanPage() {
  const router = useRouter();
  const { addReport, reports } = useLaporKuyStore();

  const [location, setLocation] = useState({
    address: 'Jl. Raya Darmo No. 42, Wonokromo, Surabaya',
    district: 'Kec. Wonokromo',
    lat: -7.2891,
    lng: 112.7385,
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // States for step-by-step pipeline
  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<typeof reports[0] | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<typeof sampleAIResults['pothole'] | null>(null);
  
  // Submit modal & confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto request location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            address: 'Jl. Pemuda No. 18, Genteng, Surabaya (Terdeteksi GPS)',
            district: 'Kec. Genteng',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocating(false);
        },
        () => setIsLocating(false),
        { timeout: 5000 }
      );
    }
  }, []);

  // Handle Photo Upload
  const handlePhotoSelected = (imgUrl: string) => {
    setPhotoUrl(imgUrl);
    setDuplicateMatch(null);
    setAiResult(null);

    // Step 1: Simulate Duplicate Check
    setIsCheckingDuplicates(true);
    setTimeout(() => {
      setIsCheckingDuplicates(false);
      // If there's an existing report, show duplicate check prompt
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
      
      // Jika pengguna mengunggah file asli (blob URL), AI akan menganalisis dan memberikan hasil acak
      // untuk mensimulasikan pendeteksian masalah yang dinamis
      if (imgUrl.startsWith('blob:')) {
        const keys = Object.keys(sampleAIResults);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setAiResult(sampleAIResults[randomKey as keyof typeof sampleAIResults]);
      } 
      // Fallback untuk URL gambar statis (dummy)
      else if (imgUrl.includes('trash')) setAiResult(sampleAIResults.trash);
      else if (imgUrl.includes('flood')) setAiResult(sampleAIResults.flood);
      else if (imgUrl.includes('lamp')) setAiResult(sampleAIResults.lamp);
      else setAiResult(sampleAIResults.pothole);
      
    }, 2500); // Waktu jeda 2.5 detik agar memberikan efek dramatis "Scanning AI"
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !aiResult) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const created = addReport({
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
      setShowConfetti(true);

      setTimeout(() => {
        router.push(`/laporan/${created.id}`);
      }, 2500);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <ConfettiOverlay show={showConfetti} />

      <div className="mb-8 text-center relative z-10">
        <Badge variant="outline" className="mb-3 px-3 py-1 text-xs font-semibold">
          Kirim Laporan
        </Badge>
        <h1 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl">
          Buat Laporan Baru
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unggah foto bukti — sistem AI kami akan membantu mendeteksi lokasi dan jenis masalah untuk mempermudah.
        </p>
      </div>

      <Card className="shadow-md border-border relative z-10 bg-card">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* 1. LOCATION AUTOMATION */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium block">
                  Lokasi Terdeteksi (GPS):
                </span>
                <span className="text-sm font-bold text-foreground line-clamp-1">
                  {isLocating ? '🔍 Mendeteksi koordinat lokasi...' : location.address}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0">
              Akurat (Radius 5m)
            </Badge>
          </div>

          {/* 2. PHOTO CAPTURE / UPLOAD */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Foto Masalah Infrastruktur <span className="text-rose-500">*</span>
            </label>

            {!photoUrl ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary hover:bg-muted/50 transition-all cursor-pointer bg-card">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        handlePhotoSelected(fileUrl);
                      }
                    }}
                  />
                  <Camera className="h-8 w-8 text-primary mb-3" />
                  <span className="text-sm font-semibold text-foreground">Ambil Foto Langsung</span>
                  <span className="text-xs text-muted-foreground mt-1 text-center">
                    Gunakan kamera perangkat
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer bg-card">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        handlePhotoSelected(fileUrl);
                      }
                    }}
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <span className="text-sm font-semibold text-foreground">Unggah dari Galeri</span>
                  <span className="text-xs text-muted-foreground mt-1 text-center">
                    Pilih file gambar yang ada
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={photoUrl} alt="Preview Laporan" className="h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setAiResult(null);
                    setDuplicateMatch(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* 3. DUPLICATE CHECK MODAL / CARD */}
          {isCheckingDuplicates && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-center gap-3 dark:bg-blue-950/30 dark:border-blue-900">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Memeriksa laporan serupa di lokasi ini...
              </span>
            </div>
          )}

          {duplicateMatch && (
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50 space-y-4 shadow-sm dark:bg-amber-950/30 dark:border-amber-900">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="h-5 w-5" />
                <span>Ditemukan laporan serupa di sekitar Anda</span>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-amber-100 dark:bg-slate-900 dark:border-amber-900/50">
                <img src={duplicateMatch.photoUrl} className="h-14 w-14 rounded-md object-cover shadow-sm border border-border" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{duplicateMatch.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{duplicateMatch.address}</p>
                </div>
                <Button
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={() => router.push(`/laporan/${duplicateMatch.id}`)}
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> Dukung Laporan
                </Button>
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-400/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
                <span>Laporan Anda mungkin akan dianggap duplikat.</span>
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateMatch(null);
                    runAIClassification(photoUrl!);
                  }}
                  className="font-bold hover:underline"
                >
                  Tetap Lanjutkan →
                </button>
              </div>
            </div>
          )}

          {/* 4. AI CLASSIFICATION PIPELINE RESULT */}
          {isClassifying && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
              <Loader2 className="h-5 w-5 text-slate-600 animate-spin shrink-0 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Memproses informasi gambar...
              </span>
            </div>
          )}

          {aiResult && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Hasil Analisis Otomatis</span>
                </div>
                <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 font-medium">
                  Tingkat Keyakinan {aiResult.confidence}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-muted-foreground block text-xs font-semibold mb-1">Kategori</span>
                  <span className="font-bold text-foreground">{aiResult.category}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-muted-foreground block text-xs font-semibold mb-1">Skor Keparahan</span>
                  <span className="font-bold text-foreground">{aiResult.severity} / 10</span>
                </div>
              </div>

              <div className="text-sm text-foreground bg-blue-50 p-3 rounded-lg border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50 flex gap-2 items-start leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <span className="font-medium text-blue-900 dark:text-blue-100">{aiResult.recommendation}</span>
              </div>
            </div>
          )}

          {/* 5. DESCRIPTION & VOICE-TO-TEXT */}
          {aiResult && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-foreground">
                    Deskripsi Tambahan (Opsional)
                  </label>
                  <VoiceInputButton onTranscript={(txt) => setDescription((prev) => (prev ? `${prev} ${txt}` : txt))} />
                </div>
                <Textarea
                  placeholder="Ceritakan detail tambahan (misal: 'Sudah terjadi 3 hari', 'Bisa membahayakan anak-anak')..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 text-sm"
                />
              </div>

              {/* 6. URGENCY TOGGLE */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">Tandai Masalah Darurat</span>
                    <span className="text-[11px] text-muted-foreground">
                      Gunakan untuk kondisi mengancam keselamatan (kabel terbuka, tanggul jebol).
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-5 w-5 rounded border-rose-400 text-rose-600 focus:ring-rose-500"
                />
              </div>

              {/* 7. SUBMIT & REWARD PREVIEW */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border mt-6">
                <div className="text-sm font-medium text-muted-foreground w-full sm:w-auto">
                  Pastikan data laporan sudah akurat sebelum dikirim.
                </div>

                <Button
                  type="button"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 font-bold h-11"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Kirim Laporan'
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
