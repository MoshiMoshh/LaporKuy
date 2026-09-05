'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { ReportCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Camera,
  Upload,
  MapPin,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ThumbsUp,
  X
} from 'lucide-react';
import { VoiceInputButton } from '@/components/ui/voice-input-button';

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

  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<typeof reports[0] | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<typeof sampleAIResults['pothole'] | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (imgUrl.startsWith('blob:')) {
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 font-sans">
      
      <div className="mb-8 text-center relative z-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
          Formulir Pengaduan Publik
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Unggah foto bukti lapangan, dan sistem akan mengidentifikasi jenis kerusakan serta lokasi secara otomatis.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white rounded-md">
        <CardContent className="p-6 sm:p-8 space-y-8 text-left">
          
          {/* LOCATION SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-100 text-blue-700 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Lokasi Terdeteksi (GPS)
                </span>
                <span className="text-sm font-semibold text-slate-900 line-clamp-1">
                  {isLocating ? 'Mendeteksi koordinat lokasi...' : location.address}
                </span>
              </div>
            </div>
            <div className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-sm shrink-0 text-center">
              Tingkat Akurasi Tinggi
            </div>
          </div>

          {/* PHOTO UPLOAD SECTION */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              Bukti Foto Kerusakan <span className="text-red-600">*</span>
            </label>

            {!photoUrl ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-sm hover:border-blue-700 hover:bg-slate-50 transition-colors cursor-pointer bg-white group focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2">
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
                  <Camera className="h-8 w-8 text-slate-400 group-hover:text-blue-700 mb-3 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Gunakan Kamera</span>
                  <span className="text-xs text-slate-500 mt-1 text-center">
                    Ambil gambar langsung dari perangkat
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-sm hover:border-blue-700 hover:bg-slate-50 transition-colors cursor-pointer bg-white group focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2">
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
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-700 mb-3 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Unggah File</span>
                  <span className="text-xs text-slate-500 mt-1 text-center">
                    Pilih gambar dari galeri Anda
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-sm overflow-hidden border border-slate-200">
                <img src={photoUrl} alt="Preview Bukti Foto" className="h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setAiResult(null);
                    setDuplicateMatch(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-sm bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Hapus Foto"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* DUPLICATE CHECK LOGIC */}
          {isCheckingDuplicates && (
            <div className="p-4 rounded-sm border border-blue-200 bg-blue-50 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-700 animate-spin shrink-0" />
              <span className="text-sm font-semibold text-blue-900">
                Memverifikasi data laporan di lokasi ini...
              </span>
            </div>
          )}

          {duplicateMatch && (
            <div className="p-5 rounded-sm border border-amber-200 bg-amber-50 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
                <span>Peringatan: Terdapat laporan serupa</span>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-sm border border-amber-100 shadow-sm">
                <img src={duplicateMatch.photoUrl} className="h-16 w-16 rounded-sm object-cover border border-slate-200" alt="Laporan serupa" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{duplicateMatch.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{duplicateMatch.address}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold gap-2 border-slate-300 rounded-sm hidden sm:flex"
                  onClick={() => router.push(`/laporan/${duplicateMatch.id}`)}
                >
                  <ThumbsUp className="h-4 w-4" /> Dukung
                </Button>
              </div>
              <div className="text-sm text-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <span>Laporan yang berulang akan digabungkan oleh sistem.</span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setDuplicateMatch(null);
                    runAIClassification(photoUrl!);
                  }}
                  className="p-0 h-auto font-bold text-blue-700 hover:text-blue-800"
                >
                  Tetap Lanjutkan Proses
                </Button>
              </div>
            </div>
          )}

          {/* AI PROCESSING & RESULT */}
          {isClassifying && (
            <div className="p-4 rounded-sm border border-slate-200 bg-slate-50 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-slate-600 animate-spin shrink-0" />
              <span className="text-sm font-semibold text-slate-700">
                Memproses identifikasi kerusakan...
              </span>
            </div>
          )}

          {aiResult && (
            <div className="p-5 rounded-sm bg-slate-50 border border-slate-200 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-green-100 text-green-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Verifikasi Sistem</span>
                </div>
                <div className="text-xs px-2.5 py-1 font-semibold border border-slate-200 bg-white rounded-sm text-slate-600">
                  Keyakinan Akurasi: {aiResult.confidence}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-sm border border-slate-200">
                  <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1">Kategori Masalah</span>
                  <span className="font-extrabold text-slate-900 text-base">{aiResult.category}</span>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200">
                  <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1">Skor Prioritas</span>
                  <span className="font-extrabold text-slate-900 text-base">{aiResult.severity} / 10</span>
                </div>
              </div>

              <div className="text-sm text-slate-800 bg-blue-50 p-4 rounded-sm border border-blue-200 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-blue-700 mt-0.5 shrink-0" />
                <span className="font-semibold leading-relaxed">{aiResult.recommendation}</span>
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          {aiResult && (
            <div className="space-y-4 pt-4 border-t border-slate-200 mt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-900" htmlFor="description">
                    Deskripsi Tambahan <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  <VoiceInputButton onTranscript={(txt) => setDescription((prev) => (prev ? `${prev} ${txt}` : txt))} />
                </div>
                <Textarea
                  id="description"
                  placeholder="Ceritakan detail spesifik yang dapat membantu petugas lapangan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] text-sm bg-white border-slate-300 focus-visible:ring-blue-700 focus-visible:border-blue-700 rounded-sm"
                />
              </div>

              {/* URGENCY TOGGLE */}
              <div className="flex items-start sm:items-center justify-between p-4 rounded-sm border border-slate-300 bg-white gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-slate-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <label htmlFor="urgency" className="text-sm font-bold text-slate-900 block cursor-pointer">
                      Tandai sebagai Kondisi Darurat
                    </label>
                    <span className="text-xs text-slate-600 block mt-1">
                      Hanya gunakan jika masalah ini berpotensi mengancam keselamatan secara langsung.
                    </span>
                  </div>
                </div>
                <input
                  id="urgency"
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-5 w-5 rounded-sm border-slate-300 text-blue-700 focus:ring-blue-700 cursor-pointer mt-1 sm:mt-0"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 mt-8">
                <p className="text-xs font-medium text-slate-500 w-full sm:w-auto text-center sm:text-left">
                  Dengan mengirim, Anda menjamin kebenaran informasi.
                </p>

                <Button
                  type="button"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 font-bold h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-sm focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses Data...
                    </>
                  ) : (
                    'Kirim Laporan Resmi'
                  )}
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
