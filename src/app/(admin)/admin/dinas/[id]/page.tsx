'use client';

import { use } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle2, Clock, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function PortalDinasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { reports } = useLaporKuyStore();

  const dinasName = decodeURIComponent(resolvedParams.id || 'Dinas Bina Marga');
  const assignedReports = reports.filter((r) => r.assignedDinas?.toLowerCase().includes(dinasName.toLowerCase()) || true);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Admin Panel
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-foreground">{dinasName}</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Portal khusus penanganan aduan & dispatch armada dinas terkait.</p>
        </div>

        <Badge className="bg-emerald-500 text-white font-bold text-xs">
          Status SLA: 95.1% Tepat Waktu
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground block">Tugas Ditugaskan</span>
          <span className="text-2xl font-bold text-foreground mt-1 block">{assignedReports.length} Laporan</span>
        </Card>

        <Card className="p-4 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground block">Sedang Diproses URC</span>
          <span className="text-2xl font-bold text-blue-500 mt-1 block">
            {assignedReports.filter((r) => r.status === 'Diproses').length} Laporan
          </span>
        </Card>

        <Card className="p-4 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground block">Selesai Ditangani</span>
          <span className="text-2xl font-bold text-emerald-500 mt-1 block">
            {assignedReports.filter((r) => r.status === 'Selesai').length} Laporan
          </span>
        </Card>
      </div>

      <Card className="p-6 border-border/60 space-y-4">
        <h3 className="font-bold text-sm text-foreground">Daftar Laporan Khusus Dinas Ini</h3>
        <div className="space-y-3">
          {assignedReports.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card">
              <div className="flex items-center gap-3">
                <img src={r.photoUrl} className="h-12 w-12 rounded object-cover border" />
                <div>
                  <h4 className="font-bold text-xs text-foreground">{r.title}</h4>
                  <p className="text-[11px] text-muted-foreground">📍 {r.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="text-[10px]">{r.status}</Badge>
                <Link href={`/laporan/${r.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-8">Lihat Laporan</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
