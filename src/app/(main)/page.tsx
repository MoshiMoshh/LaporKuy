'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLaporKuyStore } from '@/lib/store';
import { Footer } from "@/components/layout/footer";
import {
  FileText,
  MapPin,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Building,
  Heart,
  Clock,
  ArrowRight
} from 'lucide-react';

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Baru saja';
  }
};

export default function HomePage() {
  const { reports } = useLaporKuyStore();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* ═══════════════════════════════════════════════
          HERO SECTION 
      ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            Portal Resmi Pengaduan Publik
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-4xl">
            Layanan Pengaduan Infrastruktur Publik
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl">
            Laporkan kerusakan fasilitas umum, jalan berlubang, dan gangguan layanan kota secara cepat, transparan, dan terintegrasi langsung ke dinas terkait.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/buat-laporan" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-sm shadow-sm h-12 px-8 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Buat Pengaduan Baru
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 h-12 px-8 flex items-center justify-center gap-2 rounded-sm">
                <MapPin className="w-5 h-5 text-blue-700" />
                Lihat Peta Laporan
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 py-2 px-4 rounded-sm border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-green-700" />
            <span>Laporan Anda ditangani secara transparan oleh instansi berwenang.</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION MANFAAT
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Kenapa Menggunakan LaporKuy?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col items-start shadow-sm focus-within:ring-2 focus-within:ring-blue-700">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-sm mb-4 border border-blue-100">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cepat & Mudah</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Buat laporan dalam beberapa langkah sederhana kapan saja dan di mana saja.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col items-start shadow-sm focus-within:ring-2 focus-within:ring-blue-700">
              <div className="p-3 bg-green-50 text-green-700 rounded-sm mb-4 border border-green-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pantau status laporan Anda secara real-time hingga selesai ditindaklanjuti.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col items-start shadow-sm focus-within:ring-2 focus-within:ring-blue-700">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-sm mb-4 border border-purple-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Partisipatif</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Setiap laporan Anda membantu mewujudkan lingkungan kota yang lebih baik.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col items-start shadow-sm focus-within:ring-2 focus-within:ring-blue-700">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-sm mb-4 border border-amber-100">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Terintegrasi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Terhubung langsung dengan instansi terkait untuk penanganan lebih efektif.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION STATISTIK
      ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x md:divide-slate-200 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">1.248</span>
              <span className="text-sm font-semibold text-slate-700">Total Laporan</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">892</span>
              <span className="text-sm font-semibold text-slate-700">Dalam Proses</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">2.156</span>
              <span className="text-sm font-semibold text-slate-700">Selesai</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">1.034</span>
              <span className="text-sm font-semibold text-slate-700">Pengguna Aktif</span>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DAFTAR LAPORAN TERBARU
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16 flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Laporan Terbaru
            </h2>
            <Link href="/dashboard" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-sm flex items-center gap-1">
              Lihat Semua Laporan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.slice(0, 6).map((report) => {
              const fallbackPhotoUrl = report.category.includes('Lampu') 
                ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80'
                : report.category.includes('Banjir')
                ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80'
                : report.category.includes('Sampah')
                ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'
                : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80';

              let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
              if (report.status === 'Selesai') statusColor = "bg-green-50 text-green-800 border-green-200";
              if (report.status === 'Diproses') statusColor = "bg-amber-50 text-amber-800 border-amber-200";

              return (
                <Card key={report.id} className="rounded-sm border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-700 transition-shadow hover:shadow-md">
                  
                  <div className="h-48 w-full relative bg-slate-100 border-b border-slate-200">
                    <img
                      src={report.photoUrl || fallbackPhotoUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = fallbackPhotoUrl }}
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border ${statusColor}`}>
                        {report.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> 
                      {formatDate(report.createdAt)}
                    </span>
                    
                    <h3 className="font-bold text-base text-slate-900 line-clamp-2 mb-4 leading-snug">
                      <Link href={`/laporan/${report.id}`} className="hover:text-blue-700 hover:underline focus:outline-none">
                        {report.title}
                      </Link>
                    </h3>
                    
                    <div className="mt-auto flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                      <span className="line-clamp-2">{report.address}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOTTOM BANNER
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-100 py-8 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 flex justify-center items-center gap-2">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            Bersama kita wujudkan kota yang lebih baik
            <Heart className="w-4 h-4 text-slate-900 fill-current" />
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
