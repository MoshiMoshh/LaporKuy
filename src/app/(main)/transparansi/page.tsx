'use client';

import { useState } from 'react';
import { mockDinasScorecard } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Code, ShieldCheck, Clock, TrendingUp, Star, ExternalLink, Activity } from 'lucide-react';

export default function TransparansiPage() {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const embedCode = `<iframe src="${origin}/embed/map" width="100%" height="450" frameborder="0"></iframe>`;

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
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <Badge variant="outline" className="px-3 py-1 text-xs font-semibold text-primary border-primary/30 bg-primary/5 rounded-full">
          Transparansi & Akuntabilitas Publik
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Performa Dinas & Kepatuhan SLA
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Pemantauan real-time kecepatan penanganan laporan warga oleh setiap Dinas Pemerintah Kota sesuai standar SLA (Service Level Agreement).
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border/60 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Rata-rata Respon Kota</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground tracking-tight">14.5</span>
            <span className="text-xs font-semibold text-muted-foreground">Jam</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2.4 jam lebih cepat dari target SLA</span>
          </div>
        </Card>

        <Card className="p-5 border-border/60 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Kepatuhan SLA Total</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">94.2%</span>
          </div>
          <span className="mt-2 block text-[11px] text-muted-foreground">
            Berdasarkan 1.240+ laporan terverifikasi
          </span>
        </Card>

        <Card className="p-5 border-border/60 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Dinas Tercepat (Bulan Ini)</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-base font-bold text-foreground line-clamp-1">DLH Kota Surabaya</span>
          </div>
          <span className="mt-2 block text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            Rata-rata penanganan 12.0 Jam
          </span>
        </Card>

        <Card className="p-5 border-border/60 bg-gradient-to-br from-background to-muted/30 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Unduh Data Terbuka</span>
            <p className="text-[11px] text-muted-foreground mt-1">Format standar CSV untuk transparansi publik.</p>
          </div>
          <Button size="sm" onClick={handleDownloadCSV} className="w-full text-xs gap-2 font-semibold mt-3 shadow-sm">
            <Download className="h-3.5 w-3.5" /> Unduh CSV
          </Button>
        </Card>
      </div>

      {/* Dinas Scorecard Table */}
      <Card className="border-border/60 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/20 border-b px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Papan Skor Kinerja Dinas Pemkot
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Peringkat responsivitas dan tingkat kepatuhan penyelesaian aduan warga
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] bg-background text-muted-foreground">
            Pembaruan Otomatis
          </Badge>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b font-semibold">
              <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Nama Dinas</th>
                <th className="p-4">Total Laporan</th>
                <th className="p-4">Diselesaikan</th>
                <th className="p-4">Rata-rata Respon</th>
                <th className="p-4">Kepatuhan SLA</th>
                <th className="p-4">Rating Warga</th>
              </tr>
            </thead>
            <tbody className="divide-y border-border/40 font-medium text-foreground">
              {mockDinasScorecard.map((dinas, idx) => (
                <tr key={dinas.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-muted-foreground text-center">
                    {idx + 1}
                  </td>
                  <td className="p-4 font-bold text-foreground">
                    {dinas.dinasName}
                  </td>
                  <td className="p-4 text-muted-foreground">{dinas.totalAssigned} laporan</td>
                  <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {dinas.totalResolved}
                  </td>
                  <td className="p-4 text-foreground font-semibold">
                    {dinas.avgResponseTimeHours} jam
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {dinas.slaCompliancePercentage}%
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dinas.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Embed Widget Generator */}
      <Card className="p-6 border-border/60 bg-slate-950 text-slate-100 space-y-4 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 text-slate-100">
            <Code className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold">Integrasi Widget Peta</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sematkan peta laporan real-time LaporKuy langsung ke situs portal berita atau website resmi daerah.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Input
              readOnly
              value={embedCode}
              className="font-mono text-xs bg-slate-900/90 border-slate-800 text-blue-300 pr-10 h-11 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="sm" onClick={handleCopyEmbed} className="flex-1 sm:flex-initial h-11 px-5 font-bold text-xs bg-[#0084FF] hover:bg-blue-600 rounded-xl transition-all">
              {copied ? 'Tersalin!' : 'Salin Kode Embed'}
            </Button>
            <a href={`${origin}/embed/map`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
              <Button size="sm" type="button" className="w-full h-11 px-4 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl gap-1.5 shadow-sm">
                Pratinjau <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
