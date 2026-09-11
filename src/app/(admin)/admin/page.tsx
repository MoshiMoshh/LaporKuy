'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Report } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Upload,
  AlertTriangle,
  Search,
  MapPin,
  ExternalLink,
  X,
  RefreshCw,
  Trash2,
  FileText,
  ArrowRight
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
  if (category.includes('Lampu')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  if (category.includes('Banjir')) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
  if (category.includes('Sampah')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  if (category.includes('Trotoar')) return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
  return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
};

const getStatusBadgeClass = (status: Report['status']) => {
  switch (status) {
    case 'Selesai':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
    case 'Diproses':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'Terverifikasi':
      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
    case 'Pending':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    case 'Ditolak':
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
  }
};

export default function AdminPage() {
  const { reports, updateReportStatus, deleteReport, deleteAllReports, refreshReports } = useLaporKuyStore();

  const [activeTab, setActiveTab] = useState<'all' | 'dinas'>('all');
  const [selectedDinasFilter, setSelectedDinasFilter] = useState<string>('Semua Dinas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delete modal state
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Clear all modal state
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Update Status Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<Report['status']>('Diproses');
  const [assignedDinasInput, setAssignedDinasInput] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [afterPhotoInput, setAfterPhotoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Statistics
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'Diproses').length;
  const completedCount = reports.filter((r) => r.status === 'Selesai').length;
  const slaBreaches = reports.filter((r) => r.status !== 'Selesai' && r.slaDaysRemaining != null && r.slaDaysRemaining <= 1);

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (activeTab === 'dinas' && selectedDinasFilter !== 'Semua Dinas') {
      if (!r.assignedDinas?.toLowerCase().includes(selectedDinasFilter.toLowerCase())) {
        return false;
      }
    }

    if (selectedStatusFilter !== 'Semua' && r.status !== selectedStatusFilter) {
      return false;
    }

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

      toast.success(`Laporan #${selectedReport.id} diperbarui`, {
        description: `Status: ${newStatus} • ${assignedDinasInput}`
      });
      setSelectedReport(null);
    } catch {
      toast.error('Gagal memperbarui status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPresetPhoto = (url: string) => {
    setAfterPhotoInput(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshReports();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Data laporan berhasil diperbarui.');
    }, 400);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await deleteReport(reportToDelete.id);
      if (ok) {
        toast.success(`Laporan #${reportToDelete.id} berhasil dihapus.`);
        setReportToDelete(null);
      } else {
        toast.error('Gagal menghapus laporan.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus laporan.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAllReports = async () => {
    setIsClearingAll(true);
    try {
      await deleteAllReports();
      toast.success('Semua laporan di Supabase dan lokal berhasil dihapus.');
      setShowClearAllModal(false);
    } catch {
      toast.error('Gagal mengosongkan data laporan.');
    } finally {
      setIsClearingAll(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 font-sans">
      {/* ── 1. HEADER & VIEW SWITCHER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
            Admin / Pengelolaan Aduan
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Daftar Aduan Warga
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau, verifikasi, dan perbarui status penanganan laporan dinas lapangan.
          </p>
        </div>

        {/* Segmented View Switcher */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Semua Aduan
          </button>
          <button
            onClick={() => setActiveTab('dinas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'dinas'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Per Dinas
          </button>
        </div>
      </div>

      {/* ── 2. STATS OVERVIEW CARDS (CLEAN ENTERPRISE METRICS) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Aduan</div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Semua kategori</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Perlu Verifikasi</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Status pending</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>Dalam Proses</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">Dinas lapangan</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Selesai</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Tuntas ditangani</div>
        </div>
      </div>

      {/* ── 3. SLA WARNING NOTIFICATION (COMPACT & NON-INTRUSIVE) ── */}
      {slaBreaches.length > 0 && (
        <div className="px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>{slaBreaches.length} laporan</strong> mendekati batas waktu SLA (≤ 1 hari tersisa).
            </span>
          </div>
          <button
            onClick={() => setSelectedStatusFilter('Diproses')}
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>Tampilkan Laporan Kritis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 4. SEARCH, DINAS & STATUS FILTER BAR ── */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari ID, judul kerusakan, lokasi, pelapor, atau dinas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-1"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Dinas dropdown & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'dinas' && (
              <select
                value={selectedDinasFilter}
                onChange={(e) => setSelectedDinasFilter(e.target.value)}
                className="h-9 px-2.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="Semua Dinas">Semua Dinas</option>
                {dinasOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            {reports.length > 0 && (
              <Button
                onClick={() => setShowClearAllModal(true)}
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium gap-1.5 cursor-pointer"
                title="Hapus semua laporan di database Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hapus Semua</span>
              </Button>
            )}

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
              title="Perbarui data dari Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Menyinkron...' : 'Segarkan'}</span>
            </Button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            {['Semua', 'Pending', 'Terverifikasi', 'Diproses', 'Selesai', 'Ditolak'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap pl-2">
            Menampilkan <strong>{filteredReports.length}</strong> laporan
          </div>
        </div>
      </div>

      {/* ── 5. RESPONSIVE DATA VIEW ── */}

      {/* ================= MOBILE VIEW (< 768px): TICKET CARDS ================= */}
      <div className="block md:hidden space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tidak ada laporan ditemukan</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau status filter Anda.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3 shadow-2xs"
              >
                {/* Header: ID + Category + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                      {report.id}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap ${getCategoryBadgeClass(report.category)}`}>
                      {report.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border whitespace-nowrap ${getStatusBadgeClass(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                {/* Content: Image + Details */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800 relative flex items-center justify-center">
                    {report.photoUrl ? (
                      <img
                        src={report.photoUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-6 h-6 text-slate-400" />
                    )}
                    {report.afterPhotoUrl && (
                      <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-600 text-white">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                      {report.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{report.address}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Pelapor: {report.userName || 'Warga'}</span>
                      <span>•</span>
                      <span className="font-mono">AI: {report.aiAuthenticityScore || 98}%</span>
                    </div>
                  </div>
                </div>

                {/* Dinas & SLA details */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="truncate max-w-[60%] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{report.assignedDinas || 'Dinas Bina Marga'}</span>
                  </span>
                  <span className={(report.slaDaysRemaining ?? 3) <= 1 ? 'text-rose-600 dark:text-rose-400 font-medium' : ''}>
                    SLA: {report.slaDaysRemaining ?? 3} hari
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={() => handleOpenModal(report)}
                    size="sm"
                    className="flex-1 h-8 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 cursor-pointer"
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportToDelete(report)}
                    className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Hapus laporan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Link href={`/laporan/${report.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Lihat halaman publik"
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

      {/* ================= TABLET & DESKTOP VIEW (>= 768px): DATA TABLE ================= */}
      <div className="hidden md:block">
        <Card className="border-slate-200/80 dark:border-slate-800 overflow-hidden rounded-xl shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[840px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-40">Laporan</th>
                  <th className="py-2.5 px-4 font-semibold">Judul & Lokasi</th>
                  <th className="py-2.5 px-4 font-semibold w-44">Dinas Lapangan</th>
                  <th className="py-2.5 px-4 font-semibold w-36">Status & SLA</th>
                  <th className="py-2.5 px-4 font-semibold w-36">Pelapor / AI</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada laporan yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* ID & Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 relative flex items-center justify-center">
                              {report.photoUrl ? (
                                <img
                                  src={report.photoUrl}
                                  alt={report.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileText className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                                {report.id}
                              </span>
                              <span className={`inline-flex items-center text-[9px] font-medium px-1.5 py-0.2 rounded border mt-0.5 ${getCategoryBadgeClass(report.category)}`}>
                                {report.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Title & Location */}
                        <td className="py-3 px-4 max-w-xs">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                            {report.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{report.address}</span>
                          </span>
                        </td>

                        {/* Assigned Dinas */}
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <span className="line-clamp-2 leading-relaxed">
                            {report.assignedDinas || 'Dinas Bina Marga'}
                          </span>
                        </td>

                        {/* Status & SLA */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${getStatusBadgeClass(report.status)}`}>
                              {report.status}
                            </span>
                            <span className={`text-[10px] block font-mono ${(report.slaDaysRemaining ?? 3) <= 1 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-400'}`}>
                              SLA: {report.slaDaysRemaining ?? 3} hari
                            </span>
                          </div>
                        </td>

                        {/* Reporter & AI Score */}
                        <td className="py-3 px-4">
                          <div className="text-slate-700 dark:text-slate-300 truncate block">
                            {report.userName || 'Warga'}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            AI: {report.aiAuthenticityScore || 98}%
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenModal(report)}
                              className="h-7 px-2.5 text-xs font-medium rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReportToDelete(report)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md cursor-pointer"
                              title="Hapus laporan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <Link href={`/laporan/${report.id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                                title="Lihat di web publik"
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

      {/* ── 6. UPDATE STATUS MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Update Status Laporan #{selectedReport.id}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Perbarui tahapan tindak lanjut dan delegasi dinas.
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Brief Report Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
              {selectedReport.photoUrl ? (
                <img
                  src={selectedReport.photoUrl}
                  alt={selectedReport.title}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
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
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Status Baru:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(['Pending', 'Terverifikasi', 'Diproses', 'Selesai', 'Ditolak'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`py-2 px-1.5 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer ${
                        newStatus === st
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dinas Assignment */}
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Dinas Penanggung Jawab:
                </label>
                <select
                  value={assignedDinasInput}
                  onChange={(e) => setAssignedDinasInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  {dinasOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* After Photo (If status = Selesai) */}
              {newStatus === 'Selesai' && (
                <div className="space-y-2 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-emerald-800 dark:text-emerald-300 block">
                      Foto Bukti Selesai (After Photo):
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Opsional
                    </span>
                  </div>

                  {afterPhotoInput ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-800">
                      <img src={afterPhotoInput} className="w-full h-full object-cover" alt="After Photo" />
                      <button
                        type="button"
                        onClick={() => setAfterPhotoInput('')}
                        className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg cursor-pointer bg-white dark:bg-slate-900 hover:bg-emerald-50/30 transition-colors">
                        <Upload className="h-4 w-4 text-emerald-600 mb-1" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          Unggah Foto Hasil Perbaikan
                        </span>
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

                      {/* Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Contoh Cepat:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetPhoto('https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80')}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 hover:border-emerald-400 cursor-pointer"
                        >
                          Lampu Nyala
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Official Notes */}
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Tindak Lanjut:
                </label>
                <textarea
                  placeholder="Catatan pengerjaan lapangan atau instruksi dinas..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full h-20 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="h-8 px-3 rounded-lg border-slate-200 dark:border-slate-800 cursor-pointer text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 px-4 font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer text-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 7. DELETE CONFIRMATION MODAL ── */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Hapus Laporan #{reportToDelete.id}?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Laporan akan dihapus secara permanen dari database.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              {reportToDelete.photoUrl ? (
                <img
                  src={reportToDelete.photoUrl}
                  alt={reportToDelete.title}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="min-w-0 text-xs">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {reportToDelete.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  📍 {reportToDelete.address}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={() => setReportToDelete(null)}
                className="h-8 px-3 rounded-lg border-slate-200 dark:border-slate-800 cursor-pointer text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isDeleting}
                onClick={handleDeleteReport}
                className="h-8 px-4 font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer text-xs"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. CLEAR ALL REPORTS MODAL ── */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Hapus Semua Data Laporan?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tindakan ini akan mengosongkan seluruh laporan di database Supabase dan penyimpanan lokal secara permanen.
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
              Perhatian: Sebanyak <strong>{reports.length} laporan</strong> akan dihapus permanen dan tidak dapat dipulihkan kembali.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={() => setShowClearAllModal(false)}
                className="h-8 px-3 rounded-lg border-slate-200 dark:border-slate-800 cursor-pointer text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isClearingAll}
                onClick={handleClearAllReports}
                className="h-8 px-4 font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer text-xs"
              >
                {isClearingAll ? 'Menghapus Semua...' : 'Ya, Kosongkan Semua'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
