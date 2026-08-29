'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, MessageSquare, ChevronDown, Bot, PhoneCall } from 'lucide-react';

const faqs = [
  {
    q: 'Bagaimana cara AI mengklasifikasikan foto laporan saya?',
    a: 'LaporKuy menggunakan model vision AI (OpenAI GPT-4o Vision). Begitu kamu mengunggah atau mengambil foto, AI langsung membaca objek fisik (seperti retakan aspal, genangan air, atau tumpukan sampah), mengukur keparahan (skor 1-10), dan menentukan dinas terkait yang berwenang.',
  },
  {
    q: 'Berapa poin yang saya dapatkan dari setiap laporan?',
    a: 'Kamu akan mendapatkan +15 poin untuk setiap laporan yang berhasil diverifikasi oleh AI & komunitas. Selain itu, kamu bisa mendapat poin tambahan dari penyelesaian Quest Harian (+15 Pts) & Mingguan (+50 Pts).',
  },
  {
    q: 'Bagaimana jika laporan saya berstatus "Pending"?',
    a: 'Status "Pending" berarti laporanmu sedang menunggu verifikasi awal dari AI atau upvote dukungan warga di sekitar lokasi. Laporan akan otomatis berlanjut ke status "Terverifikasi" begitu mendapat dukungan komunitas.',
  },
  {
    q: 'Bagaimana cara melapor via WhatsApp tanpa aplikasi?',
    a: 'Cukup simpan nomor WhatsApp Resmi LaporKuy di 0812-LAPORKUY (0812-5276-7589). Kirimkan foto masalah beserta kirim lokasi (Share Location) melalui WA, bot AI kami akan langsung mencatat laporanmu.',
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          ❓ Pusat Bantuan & Support
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Ada Yang Bisa Kami Bantu?
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Temukan jawaban seputar alur pelaporan, AI klasifikasi, hingga penukaran poin reward.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pertanyaan (misal: 'poin', 'whatsapp', 'status')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 text-sm rounded-xl shadow-sm"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <Card key={idx} className="border-border/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-foreground flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t pt-3 bg-muted/10">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Live WhatsApp / Chatbot Banner */}
      <Card className="p-6 bg-primary/10 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shrink-0 mx-auto">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Butuh Bantuan Langsung?</h3>
            <p className="text-xs text-muted-foreground">
              Gunakan widget AI Chatbot di pojok kanan bawah atau hubungi WhatsApp Support 24/7.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md">
            <PhoneCall className="h-4 w-4" /> Chat WhatsApp Support
          </button>
        </a>
      </Card>
    </div>
  );
}
