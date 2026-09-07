'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle, Search, MessageSquare, ChevronDown, Bot, PhoneCall } from 'lucide-react';

const faqs = [
  {
    q: 'Bagaimana cara AI mengklasifikasikan foto laporan saya?',
    a: 'LaporKuy menggunakan sistem AI Vision terintegrasi. Saat Anda mengunggah atau mengambil foto kerusakan, sistem akan mendeteksi objek fisik, menganalisis tingkat keparahan, serta merekomendasikan dinas teknis yang berwenang.',
  },
  {
    q: 'Berapa poin yang saya dapatkan dari setiap laporan?',
    a: 'Anda mendapatkan +15 poin untuk setiap laporan yang berhasil diverifikasi. Selain itu, Anda bisa memperoleh poin bonus tambahan dengan menyelesaikan Misi Harian (+15 Poin) & Mingguan (+50 Poin).',
  },
  {
    q: 'Bagaimana jika laporan saya berstatus "Pending"?',
    a: 'Status "Pending" menandakan laporan sedang dalam tahap verifikasi awal atau menunggu dukungan (upvote) dari warga sekitar. Laporan akan otomatis naik ke status "Terverifikasi" setelah mendapat dukungan komunitas.',
  },
  {
    q: 'Bagaimana cara melapor via WhatsApp tanpa aplikasi?',
    a: 'Anda cukup menghubungi WhatsApp Resmi LaporKuy di 0812-5276-7589. Kirimkan foto bukti kerusakan beserta titik lokasi (Share Location), dan bot AI kami akan mencatat laporan Anda secara otomatis.',
  },
];

export default function BantuanPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold text-primary border-primary/30 bg-primary/5 rounded-full">
          Pusat Bantuan & Support
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Ada Yang Bisa Kami Bantu?
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Temukan panduan lengkap alur pelaporan, sistem verifikasi AI, hingga penukaran poin reward.
        </p>
      </div>

      {/* Search Bar - Clean Placeholder */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari topik bantuan atau pertanyaan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12 text-sm rounded-xl border-border bg-card shadow-xs focus-visible:ring-primary"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center border-border/60">
            <p className="text-xs text-muted-foreground">Tidak ada topik bantuan yang cocok dengan pencarian Anda.</p>
          </Card>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <Card key={idx} className="border-border/70 overflow-hidden rounded-2xl shadow-2xs transition-all">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-foreground flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3.5 bg-muted/15 font-medium">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* WhatsApp Support Banner */}
      <Card className="p-5 sm:p-6 bg-card border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mx-auto sm:mx-0">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Butuh Bantuan Langsung?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hubungi Layanan WhatsApp Support resmi LaporKuy 24 Jam.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6281252767589"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto h-10 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Chat WhatsApp Support</span>
          </Button>
        </a>
      </Card>
    </div>
  );
}
