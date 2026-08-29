'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Sparkles, ShieldCheck, Heart, Users, Code, Award } from 'lucide-react';

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="secondary" className="px-4 py-1 text-xs">
          🏙️ Platform Civic-Tech Indonesia
        </Badge>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
          Tentang LaporKuy v2.0
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          LaporKuy lahir dari semangat menghubungkan warga kota dengan pemerintah daerah menggunakan kecerdasan buatan (AI), transparansi SLA publik, dan gamifikasi civic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/60 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base text-foreground">AI Multi-Model Vision</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Klasifikasi otomatis jenis masalah, skor keparahan, deteksi keaslian foto, dan routing dinas dalam waktu kurang dari 3 detik.
          </p>
        </Card>

        <Card className="p-6 border-border/60 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base text-foreground">Transparansi SLA Publik</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Menampilkan performa penanganan aduan setiap dinas secara terbuka untuk menciptakan kompetisi positif & akuntabilitas pemerintah.
          </p>
        </Card>

        <Card className="p-6 border-border/60 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mx-auto">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base text-foreground">Gamifikasi & Reward</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apresiasi kontribusi warga melalui XP, level, streak harian, dan poin yang dapat ditukarkan dengan pulsa serta voucher.
          </p>
        </Card>
      </div>

      <Card className="p-8 border-border/60 bg-muted/20 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Teknologi & Fondasi Arsitektur</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-muted-foreground">
          <div className="p-3 bg-background rounded-xl border">⚡ Next.js 14 App Router</div>
          <div className="p-3 bg-background rounded-xl border">🎨 Tailwind CSS & shadcn/ui</div>
          <div className="p-3 bg-background rounded-xl border">🤖 OpenAI GPT-4o Vision</div>
          <div className="p-3 bg-background rounded-xl border">⚡ Supabase Realtime & Auth</div>
        </div>
      </Card>
    </div>
  );
}
