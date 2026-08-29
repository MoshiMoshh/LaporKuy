'use client';

import { useState } from 'react';
import { mockDinasScorecard } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Clock, CheckCircle2, Download, Code, ShieldCheck, Zap } from 'lucide-react';

export default function TransparansiPage() {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="https://laporkuy.id/embed/map" width="100%" height="450" frameborder="0"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Dinas,TotalLaporan,Selesai,AvgWaktuJam,SLACompliance\n' +
      mockDinasScorecard.map(d => `"${d.dinasName}",${d.totalAssigned},${d.totalResolved},${d.avgResponseTimeHours},${d.slaCompliancePercentage}%`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'laporkuy_dinas_sla_performance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          📊 Transparansi & Akuntabilitas Publik
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Performa Dinas & Akuntabilitas SLA
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Data terbuka penanganan aduan masyarakat oleh setiap Dinas Pemerintah Kota secara real-time.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground block">Rata-rata Respon Kota</span>
          <span className="text-2xl font-extrabold text-primary mt-1 block">14.5 Jam</span>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">⚡ 2.4 jam lebih cepat dari SLA</span>
        </Card>

        <Card className="p-4 text-center border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground block">Kepatuhan SLA Total</span>
          <span className="text-2xl font-extrabold text-emerald-500 mt-1 block">94.2%</span>
          <span className="text-[10px] text-muted-foreground mt-1 block">Dari 1.240+ laporan</span>
        </Card>

        <Card className="p-4 text-center border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground block">Dinas Tercepat (Bulan Ini)</span>
          <span className="text-sm font-bold text-foreground mt-1 block line-clamp-1">DLH Kota Surabaya</span>
          <span className="text-[10px] text-amber-500 font-semibold mt-1 block">12.0 Jam Rata-rata</span>
        </Card>

        <Card className="p-4 text-center border-border/60 bg-muted/20 flex flex-col justify-center">
          <Button size="sm" onClick={handleDownloadCSV} className="w-full text-xs gap-1.5 font-bold shadow-sm">
            <Download className="h-4 w-4" /> Unduh Open Data (CSV)
          </Button>
        </Card>
      </div>

      {/* DINAS SCORECARD TABLE */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Scorecard Kinerja Dinas Pemkot
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            Diperbarui Setiap 1 Jam
          </Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b">
              <tr>
                <th className="p-3.5">Nama Dinas</th>
                <th className="p-3.5">Total Ditangani</th>
                <th className="p-3.5">Selesai</th>
                <th className="p-3.5">Rata-rata Waktu Respon</th>
                <th className="p-3.5">% SLA Tepat Waktu</th>
                <th className="p-3.5">Rating Warga</th>
              </tr>
            </thead>
            <tbody className="divide-y border-border/50 font-medium">
              {mockDinasScorecard.map((dinas, idx) => (
                <tr key={dinas.id} className="hover:bg-muted/20">
                  <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500 text-sm">🥇</span>}
                    {dinas.dinasName}
                  </td>
                  <td className="p-3.5">{dinas.totalAssigned} Laporan</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    {dinas.totalResolved}
                  </td>
                  <td className="p-3.5 font-semibold text-foreground">
                    {dinas.avgResponseTimeHours} Jam
                  </td>
                  <td className="p-3.5">
                    <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                      {dinas.slaCompliancePercentage}%
                    </Badge>
                  </td>
                  <td className="p-3.5 text-amber-500 font-bold">
                    {dinas.rating} / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* EMBED WIDGET GENERATOR */}
      <Card className="p-6 border-border/60 bg-slate-950 text-slate-100 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Code className="h-5 w-5" />
          <h3 className="text-base font-bold">Embeddable Widget Generator (Untuk Media & Website Pemda)</h3>
        </div>
        <p className="text-xs text-slate-300">
          Salin snippet kode di bawah ini untuk memasang Peta Transparansi LaporKuy langsung ke situs berita atau website pemerintah daerahmu.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            readOnly
            value={embedCode}
            className="font-mono text-xs bg-slate-900 border-slate-800 text-slate-200"
          />
          <Button size="sm" onClick={handleCopyEmbed} className="w-full sm:w-auto shrink-0 font-bold">
            {copied ? 'Tersalin!' : 'Salin Kode Embed'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
