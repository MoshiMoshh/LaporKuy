'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  FileText,
  Clock,
  Coins,
  Camera,
  ArrowUpRight
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'semua' | 'laporan' | 'status' | 'poin';
}

const faqs: FaqItem[] = [
  {
    category: 'laporan',
    q: 'Bagaimana cara membuat laporan kerusakan fasilitas kota?',
    a: 'Buka menu "Buat Laporan", foto bukti kerusakan yang Anda temui, lalu periksa lokasi GPS otomatis atau tandai di peta. AI Vision LaporKuy akan menganalisis foto dan merekomendasikan kategori serta dinas yang berwenang. Anda bisa melengkapi deskripsi sebelum menekan tombol kirim.',
  },
  {
    category: 'laporan',
    q: 'Bagaimana jika hasil deteksi foto oleh AI kurang sesuai?',
    a: 'Rekomendasi AI bersifat membantu dan mempermudah. Jika kategori (misalnya Jalan Berlubang, Sampah, Lampu PJU, atau Banjir) atau tingkat keparahan yang terdeteksi dirasa kurang tepat, Anda bisa mengubahnya secara manual di pilihan kategori sebelum laporan dikirimkan.',
  },
  {
    category: 'status',
    q: 'Apa arti status aduan: Pending, Terverifikasi, Diproses, dan Selesai?',
    a: '• Pending: Laporan baru terkirim dan sedang menunggu verifikasi awal serta dukungan (upvote) warga sekitar.\n• Terverifikasi: Laporan dinyatakan valid dan diteruskan ke dinas teknis pemerintah kota.\n• Diproses: Petugas teknis sedang menangani pekerjaan perbaikan di lokasi dengan target waktu (SLA).\n• Selesai: Pekerjaan tuntas dan dilengkapi foto sesudah perbaikan (Before/After) yang dapat Anda lihat langsung di detail laporan.',
  },
  {
    category: 'status',
    q: 'Berapa lama rata-rata aduan ditangani oleh dinas (SLA)?',
    a: 'Setiap dinas memiliki target Service Level Agreement (SLA) rata-rata 2 hingga 7 hari kerja tergantung tingkat keparahan masalah. Anda bisa memantau hitung mundur sisa hari penanganan dan riwayat dinas terkait di halaman detail masing-masing laporan.',
  },
  {
    category: 'poin',
    q: 'Bagaimana cara mendapatkan poin keaktifan dan naik level?',
    a: 'Setiap laporan Anda yang berhasil diverifikasi akan memberikan +15 Poin. Anda juga bisa mengerjakan Misi Harian (+15 Pts), memberikan Upvote verifikasi aduan warga lain (+10 Pts), serta Misi Mingguan tematik. Poin dan XP ini otomatis menaikkan level akun Anda dari Pemula hingga Pahlawan Kota.',
  },
  {
    category: 'poin',
    q: 'Bagaimana cara menukarkan poin dengan reward dan voucher?',
    a: 'Kunjungi menu "Tukar Poin". Pilih reward yang diinginkan seperti E-Sertifikat Kontributor, Bingkai Emas Profil, bibit pohon penghijauan, atau voucher jalur prioritas. Setelah menukar, kode voucher unik akan tersimpan di tab "Voucher Saya" dan siap diaktifkan atau digunakan.',
  },
  {
    category: 'laporan',
    q: 'Apakah bisa melapor atau bertanya langsung lewat WhatsApp?',
    a: 'Bisa. Jika Anda sedang terburu-buru atau mengalami kendala di website, Anda bisa langsung menghubungi WhatsApp Support di nomor 0895-2923-1361. Kirimkan foto bukti masalah beserta share location titik lokasi Anda, tim kami siap membantu.',
  },
];

const categoryTabs = [
  { id: 'semua', label: 'Semua Pertanyaan' },
  { id: 'laporan', label: 'Alur Pelaporan & Foto' },
  { id: 'status', label: 'Status Laporan & SLA' },
  { id: 'poin', label: 'Poin, Misi & Hadiah' },
] as const;

export default function BantuanPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'semua' || faq.category === selectedCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-7 font-sans pb-28">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="px-3 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 rounded-full">
          Pusat Bantuan Warga
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Panduan & Pertanyaan Umum
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Pelajari cara kerja pelaporan fasilitas kota, sistem verifikasi dinas, hingga penukaran poin keaktifan warga.
        </p>
      </div>

      {/* Quick Nav Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Link
          href="/buat-laporan"
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
              Buat Laporan
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Kirim aduan fasilitas</span>
          </div>
        </Link>


        <Link
          href="/misi"
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center justify-between">
              Misi Harian
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Klaim bonus poin</span>
          </div>
        </Link>

        <Link
          href="/tukar-poin"
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center justify-between">
              Tukar Hadiah
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Katalog voucher & titel</span>
          </div>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari topik bantuan (misal: cara melapor, SLA, tukar poin)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 text-xs sm:text-sm rounded-xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs focus-visible:ring-blue-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-2.5">
        {filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tidak ada jawaban yang sesuai dengan pencarian Anda. Silakan hubungi kami langsung melalui WhatsApp di bawah.
            </p>
          </Card>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <Card
                key={idx}
                className="border-slate-200/80 dark:border-slate-800 overflow-hidden rounded-2xl shadow-2xs bg-white dark:bg-slate-900 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="leading-snug">{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-normal whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* WhatsApp Official Support Card */}
      <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0 mx-auto sm:mx-0">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Ada Kendala atau Pertanyaan Langsung?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hubungi pengelola LaporKuy via WhatsApp di{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-bold">
                0895-2923-1361
              </strong>
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6289529231361?text=Halo%20Admin%20LaporKuy,%20saya%20ingin%20bertanya%20terkait%20layanan%20dan%20laporan"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto shrink-0"
        >
          <Button className="w-full sm:w-auto h-10 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs gap-2 cursor-pointer transition-all">
            <MessageCircle className="h-4 w-4" />
            <span>Chat WhatsApp (0895-2923-1361)</span>
          </Button>
        </a>
      </Card>
    </div>
  );
}
