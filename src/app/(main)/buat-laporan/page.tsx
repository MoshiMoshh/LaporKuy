'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { ReportCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  MapPin,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ThumbsUp,
  X,
  CheckCircle2,
  Target,
  Award
} from 'lucide-react';
import { VoiceInputButton } from '@/components/ui/voice-input-button';

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

    // Dynamic Geolocation Detection with location variations
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 font-sans">
      
      {/* Active Mission Context Card */}
      {questParam && (
        <Card className="mb-6 p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0057B8] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0 mt-0.5">
                <Target className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-100 dark:border-blue-900 text-[11px] font-medium px-2 py-0.5 rounded-md">
                    Misi Aktif
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                  {questTitleParam || 'Misi Pengaduan Warga'}
                </h3>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900 text-xs font-semibold shrink-0 px-2.5 py-1 rounded-md">
              +15 Pts Reward
            </Badge>
          </div>

          {/* Stepper Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Panduan Pengerjaan
            </span>

            <div className="space-y-2.5 pl-0.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                  1
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                  Ambil atau unggah foto kerusakan di lokasi.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                  2
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                  Pastikan GPS aktif untuk verifikasi lokasi otomatis.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold shrink-0 border border-slate-200 dark:border-slate-700">
                  3
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                  Kirim laporan dan klaim reward poin.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-8 text-center relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          Formulir Pengaduan Publik
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Unggah foto bukti lapangan, dan sistem akan mengidentifikasi jenis kerusakan serta lokasi secara otomatis.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
        <CardContent className="p-6 sm:p-8 space-y-8 text-left">
          
          {/* LOCATION SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                  Lokasi Terdeteksi (GPS)
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate block">
                  {isLocating ? 'Mendeteksi koordinat lokasi...' : location.address}
                </span>
              </div>
            </div>
            <div className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md shrink-0 flex items-center gap-1.5 self-start sm:self-center font-sans">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Terverifikasi Presisi</span>
            </div>
          </div>

          {/* PHOTO UPLOAD SECTION */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              Bukti Foto Kerusakan <span className="text-red-600">*</span>
            </label>

            {!photoUrl ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-[#0057B8] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-white dark:bg-slate-900 group">
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
                  <Camera className="h-8 w-8 text-slate-400 group-hover:text-[#0057B8] mb-3 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#0057B8]">Gunakan Kamera</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                    Ambil gambar langsung dari perangkat
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-[#0057B8] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-white dark:bg-slate-900 group">
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
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-[#0057B8] mb-3 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#0057B8]">Unggah File</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                    Pilih gambar dari galeri Anda
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={photoUrl} alt="Preview Bukti Foto" className="h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setAiResult(null);
                    setDuplicateMatch(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-md"
                  aria-label="Hapus Foto"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* DUPLICATE CHECK & AI ANALYSIS */}
          {isCheckingDuplicates && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 dark:bg-blue-950/60 dark:border-blue-900 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-[#0057B8] dark:text-blue-400 animate-spin shrink-0" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Memverifikasi data laporan di lokasi ini...
              </span>
            </div>
          )}

          {isClassifying && (
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/60 dark:bg-cyan-950/60 dark:border-cyan-900 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-cyan-700 dark:text-cyan-400 animate-spin shrink-0" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                AI Vision sedang menganalisis foto dan mengklasifikasi kategori...
              </span>
            </div>
          )}

          {/* AI RESULT PREVIEW (ONLY DISPLAYED AFTER USER HAS UPLOADED A PHOTO) */}
          {photoUrl && aiResult && !isClassifying && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Hasil Analisis AI Vision
                </span>
                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-xs font-medium">
                  Autentisitas {aiResult.authenticity}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Kategori Terdeteksi:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{aiResult.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Tingkat Keparahan:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{aiResult.severity} / 10</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-700/80 pt-2 font-medium">
                💡 {aiResult.recommendation}
              </p>
            </div>
          )}

          {/* DESCRIPTION FIELD */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              Deskripsi Detail Masalah
            </label>
            <div className="relative">
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail patokan lokasi atau kondisi kerusakan di lapangan..."
                className="w-full rounded-xl border-slate-300 dark:border-slate-700 focus:ring-[#0057B8] pr-12 text-sm"
              />
              <div className="absolute bottom-3 right-3">
                <VoiceInputButton onTranscript={(text: string) => setDescription((prev) => (prev ? `${prev} ${text}` : text))} />
              </div>
            </div>
          </div>

          {/* URGENT FLAG */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="urgent" className="text-xs font-semibold text-rose-900 dark:text-rose-200 cursor-pointer flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              Tandai sebagai Laporan Darurat / Butuh Penanganan URC Segera
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={!photoUrl || isSubmitting || isCheckingDuplicates || isClassifying}
            className="w-full h-12 text-base font-bold bg-[#0057B8] hover:bg-[#004494] text-white shadow-md rounded-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Mengirimkan Laporan...
              </span>
            ) : (
              'Kirim Laporan Pengaduan'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BuatLaporanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#0057B8] animate-spin" />
      </div>
    }>
      <BuatLaporanForm />
    </Suspense>
  );
}
