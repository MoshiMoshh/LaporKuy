'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Upload,
  AlertTriangle,
  Search,
  MapPin,
  FileText,
  Filter,
  Check,
  ExternalLink,
  ChevronRight,
  Camera,
  X,
  Sparkles,
  RefreshCw,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';

const dinasOptions = [
  'Dinas Bina Marga & Sumber Daya Air',
  'Dinas Lingkungan Hidup',
  'Dinas Perhubungan',
  'Dinas Sumber Daya Air',
  'Dinas Perumahan Rakyat & Kawasan Permukiman',
  'BPBD & Penanggulangan Bencana'
];

const getCategoryBadgeClass = (category: string) => {
  if (category.includes('Lampu')) return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60';
  if (category.includes('Banjir')) return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60';
  if (category.includes('Sampah')) return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60';
  if (category.includes('Trotoar')) return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60';
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700';
};

const getStatusBadgeClass = (status: Report['status']) => {
  switch (status) {
    case 'Selesai':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    case 'Diproses':
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
    case 'Terverifikasi':
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    case 'Pending':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'Ditolak':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
  }
};

export default function AdminPage() {
  const { reports, updateReportStatus } = useLaporKuyStore();

  const [activeTab, setActiveTab] = useState<'all' | 'dinas'>('all');
  const [selectedDinasFilter, setSelectedDinasFilter] = useState<string>('Semua Dinas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Semua');
  const [search, setSearch] = useState('');

  // Update Status Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<Report['status']>('Diproses');
  const [assignedDinasInput, setAssignedDinasInput] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [afterPhotoInput, setAfterPhotoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Statistics calculation
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'Diproses').length;
  const completedCount = reports.filter((r) => r.status === 'Selesai').length;
  const slaBreaches = reports.filter((r) => r.status !== 'Selesai' && r.slaDaysRemaining != null && r.slaDaysRemaining <= 1);

  // Filter logic
  const filteredReports = reports.filter((r) => {
    // Tab filter
    if (activeTab === 'dinas' && selectedDinasFilter !== 'Semua Dinas') {
      if (!r.assignedDinas?.toLowerCase().includes(selectedDinasFilter.toLowerCase())) {
        return false;
      }
    }

    // Status filter
    if (selectedStatusFilter !== 'Semua' && r.status !== selectedStatusFilter) {
      return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchAddress = r.address.toLowerCase().includes(q);
      const matchDinas = (r.assignedDinas || '').toLowerCase().includes(q);
      const matchUser = (r.userName || '').toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchAddress && !matchDinas && !matchUser) {
        return false;
      }
    }

    return true;
  });

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAssignedDinasInput(report.assignedDinas || dinasOptions[0]);
    setStatusNotes('');
    setAfterPhotoInput(report.afterPhotoUrl || '');
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsSubmitting(true);
    try {
      await updateReportStatus(
        selectedReport.id,
        newStatus,
        statusNotes,
        afterPhotoInput || selectedReport.afterPhotoUrl || '',
        assignedDinasInput || selectedReport.assignedDinas
      );

      toast.success(`Laporan #${selectedReport.id} berhasil diperbarui!`, {
        description: `Status baru: ${newStatus} • ${assignedDinasInput}`
      });
      setSelectedReport(null);
    } catch (err) {
      toast.error('Gagal memperbarui status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPresetPhoto = (url: string) => {
    setAfterPhotoInput(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6 font-sans">
      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              LaporKuy Command Hub
            </span>
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              SUPERADMIN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Pusat Verifikasi & Dispatch Kota
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Kelola aduan warga kota, validasi bukti AI Vision, dan tugaskan armada dinas lapangan dengan pemantauan SLA ketat.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl flex gap-1 self-start sm:self-auto shrink-0 select-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semua Aduan Kota
          </button>
          <button
            onClick={() => setActiveTab('dinas')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'dinas'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Antrean Dinas Lapangan
          </button>
        </div>
      </div>

      {/* ── 2. STATS OVERVIEW CARDS (BENTO STYLE) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Aduan Masuk</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Laporan</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-semibold">Perlu Verifikasi</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Status Pending</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-xs font-semibold">Sedang Dikerjakan</span>
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{inProgressCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Tim URC Lapangan</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold">Selesai Diperbaiki</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Ada Bukti After</span>
          </div>
        </div>
      </div>

      {/* SLA Alert Banner if any */}
      {slaBreaches.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                Perhatian: {slaBreaches.length} Aduan Memasuki Batas Akhir SLA (≤ 1 Hari Tersisa)
              </h4>
              <p className="text-[11px] text-rose-600/90 dark:text-rose-400">
                Segera prioritaskan delegasi armada dan update progres penanganan dinas terkait.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedStatusFilter('Diproses');
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            Lihat Laporan Kritis
          </button>
        </div>
      )}

      {/* ── 3. SEARCH & CONTROLS BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari nomor #REP, judul kerusakan, lokasi, pelapor, atau dinas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dinas Filter (if in dinas tab) */}
        {activeTab === 'dinas' && (
          <select
            value={selectedDinasFilter}
            onChange={(e) => setSelectedDinasFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0"
          >
            <option value="Semua Dinas">Semua Dinas Lapangan</option>
            {dinasOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0 shrink-0">
          {['Semua', 'Pending', 'Terverifikasi', 'Diproses', 'Selesai'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-slate-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Menampilkan <strong>{filteredReports.length}</strong> laporan aduan</span>
        {selectedStatusFilter !== 'Semua' && (
          <button
            onClick={() => setSelectedStatusFilter('Semua')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* ── 4. RESPONSIVE DISPATCH VIEW ── */}

      {/* ================= MOBILE VIEW: RESPONSIVE CARDS ================= */}
      <div className="block md:hidden space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tidak ada laporan ditemukan</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau status filter Anda.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const fallbackImg = report.category.includes('Lampu')
              ? '/images/reports/streetlight.jpg'
              : report.category.includes('Banjir')
              ? '/images/reports/flood.jpg'
              : report.category.includes('Sampah')
              ? '/images/reports/trash.jpg'
              : '/images/reports/pothole.jpg';

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs p-4 space-y-3 transition-all"
              >
                {/* Header: ID + Category + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {report.id}
                    </span>
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap ${getCategoryBadgeClass(report.category)}`}>
                      {report.category}
                    </span>
                  </div>

                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${getStatusBadgeClass(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                {/* Body: Thumbnail + Info */}
                <div className="flex items-start gap-3">
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 relative">
                    <img
                      src={report.photoUrl || fallbackImg}
                      alt={report.title}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                      className="w-full h-full object-cover"
                    />
                    {report.afterPhotoUrl && (
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-600 text-white">
                        ✓ Bukti Ada
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                      {report.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{report.address}</span>
                    </p>

                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400">
                      <span>Oleh: <strong>{report.userName || 'Warga'}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        AI: {report.aiAuthenticityScore || 98}% Asli
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dinas & SLA Banner */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-semibold">
                    <span className="flex items-center gap-1 truncate max-w-[65%]">
                      <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{report.assignedDinas || 'Dinas Bina Marga'}</span>
                    </span>
                    <span className={`font-bold ${(report.slaDaysRemaining ?? 3) <= 1 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      Sisa SLA: {report.slaDaysRemaining ?? 3} Hari
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={() => handleOpenModal(report)}
                    className="flex-1 h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                  >
                    Eksekusi & Update Status
                  </Button>
                  <Link href={`/laporan/${report.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-800"
                      title="Lihat Halaman Publik"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= DESKTOP VIEW: CLEAN DATA TABLE ================= */}
      <div className="hidden md:block">
        <Card className="border-slate-200/80 dark:border-slate-800 overflow-hidden rounded-2xl shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">Laporan & ID</th>
                  <th className="py-3 px-4 font-bold">Judul & Lokasi</th>
                  <th className="py-3 px-4 font-bold">Validasi AI & Pelapor</th>
                  <th className="py-3 px-4 font-bold">Dinas Ditugaskan</th>
                  <th className="py-3 px-4 font-bold">Status & Target SLA</th>
                  <th className="py-3 px-4 font-bold text-right">Aksi Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada laporan yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const fallbackImg = report.category.includes('Lampu')
                      ? '/images/reports/streetlight.jpg'
                      : report.category.includes('Banjir')
                      ? '/images/reports/flood.jpg'
                      : report.category.includes('Sampah')
                      ? '/images/reports/trash.jpg'
                      : '/images/reports/pothole.jpg';

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* ID & Photo */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 relative">
                              <img
                                src={report.photoUrl || fallbackImg}
                                alt={report.title}
                                onError={(e) => {
                                  e.currentTarget.src = fallbackImg;
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
                                {report.id}
                              </span>
                              <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border mt-0.5 ${getCategoryBadgeClass(report.category)}`}>
                                {report.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Title & Location */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                            {report.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {report.address}
                          </span>
                        </td>

                        {/* AI & Reporter */}
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-xs">
                            AI: {report.aiAuthenticityScore || 98}% Valid
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            Pelapor: {report.userName || 'Budi S.'}
                          </span>
                        </td>

                        {/* Assigned Dinas */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          {report.assignedDinas || 'Dinas Bina Marga'}
                        </td>

                        {/* Status & SLA */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadgeClass(report.status)}`}>
                              {report.status}
                            </span>
                            <span className={`text-[10px] block font-semibold ${(report.slaDaysRemaining ?? 3) <= 1 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                              SLA: {report.slaDaysRemaining ?? 3} Hari Tersisa
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleOpenModal(report)}
                              className="h-8 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs cursor-pointer"
                            >
                              Update Status
                            </Button>
                            <Link href={`/laporan/${report.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800"
                                title="Lihat Tampilan Publik"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── 5. UPDATE STATUS & UPLOAD AFTER PHOTO MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Pembaruan Tindak Lanjut
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Laporan #{selectedReport.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Report Preview Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
              <img
                src={selectedReport.photoUrl || '/images/reports/pothole.jpg'}
                alt={selectedReport.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {selectedReport.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  📍 {selectedReport.address}
                </p>
              </div>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              {/* Status Selector */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  Pilih Status Pengerjaan Baru:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Pending', 'Terverifikasi', 'Diproses', 'Selesai', 'Ditolak'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        newStatus === st
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dinas Assignment */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Dinas yang Bertanggung Jawab:
                </label>
                <select
                  value={assignedDinasInput}
                  onChange={(e) => setAssignedDinasInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  {dinasOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* After Photo (Only required / shown if Selesai) */}
              {newStatus === 'Selesai' && (
                <div className="space-y-2 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-emerald-800 dark:text-emerald-300 block">
                      Foto Bukti Sesudah Perbaikan (*After Photo*):
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Tampil di Slider Warga
                    </span>
                  </div>

                  {afterPhotoInput ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 group">
                      <img src={afterPhotoInput} className="w-full h-full object-cover" alt="After Photo" />
                      <button
                        type="button"
                        onClick={() => setAfterPhotoInput('')}
                        className="absolute top-2 right-2 bg-rose-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 rounded-xl cursor-pointer bg-white dark:bg-slate-900 hover:bg-emerald-50/50 transition-colors">
                        <Upload className="h-5 w-5 text-emerald-600 mb-1" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Pilih Foto Kamera / Galeri
                        </span>
                        <span className="text-[10px] text-slate-400">Format JPG, PNG (Maks 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setAfterPhotoInput(ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* Quick Presets for Demo / Instant Fix */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">Contoh Cepat:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetPhoto('https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80')}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-400 cursor-pointer"
                        >
                          Lampu Menyala
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetPhoto('https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=800&auto=format&fit=crop&q=80')}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-400 cursor-pointer"
                        >
                          Aspal Rata
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Official Notes */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Catatan Tindak Lanjut Dinas / Eksekusi:
                </label>
                <textarea
                  placeholder="Contoh: Tim Unit Reaksi Cepat (URC) telah menyelesaikan penambalan aspal hotmix dan pengecatan ulang..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-9 px-5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pembaruan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
