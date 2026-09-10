'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function PortalDinasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { reports } = useLaporKuyStore();

  const rawDinas = decodeURIComponent(resolvedParams.id || 'bina-marga');
  const dinasDisplayName = rawDinas
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const assignedReports = reports.filter((r) => {
    const dinasStr = (r.assignedDinas || '').toLowerCase();
    const query = rawDinas.toLowerCase();
    if (query.includes('bina')) return dinasStr.includes('bina') || dinasStr.includes('marga');
    if (query.includes('lingkungan') || query.includes('dlh')) return dinasStr.includes('lingkungan');
    if (query.includes('hubung') || query.includes('dishub')) return dinasStr.includes('hubung');
    if (query.includes('air') || query.includes('sda')) return dinasStr.includes('air');
    if (query.includes('perumahan') || query.includes('dprkp')) return dinasStr.includes('perumahan');
    return dinasStr.includes(query);
  });

  const fallbackReports = assignedReports.length > 0 ? assignedReports : reports;

  const diprosesCount = fallbackReports.filter((r) => r.status === 'Diproses').length;
  const selesaiCount = fallbackReports.filter((r) => r.status === 'Selesai').length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6 font-sans">
      {/* Breadcrumb Back Link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Dispatch Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {fallbackReports[0]?.assignedDinas || `Dinas ${dinasDisplayName}`}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Antrean eksekusi penanganan lapangan, pengawalan batas SLA, dan verifikasi fisik dinas.
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SLA Terjaga: 96.4%</span>
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Ditugaskan</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {fallbackReports.length}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-0.5">
          <span className="text-[11px] font-semibold text-blue-500 block">Sedang Dikerjakan</span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {diprosesCount}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-center space-y-0.5">
          <span className="text-[11px] font-semibold text-emerald-500 block">Selesai Beres</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {selesaiCount}
          </span>
        </div>
      </div>

      {/* Report List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Daftar Tugas Perbaikan Dinas
          </h3>
          <span className="text-xs text-slate-400">
            {fallbackReports.length} Aduan
          </span>
        </div>

        <div className="space-y-3">
          {fallbackReports.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <img
                  src={r.photoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'}
                  alt={r.title || 'Foto Laporan'}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {r.id}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {r.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${r.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{r.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                  Sisa SLA: {r.slaDaysRemaining} Hari
                </span>
                <Link href={`/laporan/${r.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-8 rounded-xl cursor-pointer">
                    Buka Laporan
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
