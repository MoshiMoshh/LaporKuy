'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Building2,
  Upload,
  AlertTriangle,
  Search,
  MapPin,
  FileText,
  ExternalLink,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient();

const dinasOptions = [
  'Dinas Bina Marga & Sumber Daya Air',
  'Dinas Lingkungan Hidup',
  'Dinas Perhubungan',
  'Dinas Sumber Daya Air',
  'Dinas Perumahan Rakyat & Kawasan Permukiman',
  'BPBD & Penanggulangan Bencana'
];

const getCategoryBadgeClass = (category: string) => {
  if (category.includes('Lampu')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  if (category.includes('Banjir')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  if (category.includes('Sampah')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (category.includes('Trotoar')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
  return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
};

const getStatusBadgeClass = (status: Report['status']) => {
  switch (status) {
    case 'Selesai':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    case 'Diproses':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
    case 'Terverifikasi':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    case 'Ditolak':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch Reports from Supabase
  const fetchReports = async () => {
    try {
      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (reportsData) {
        const mappedReports: Report[] = reportsData.map((r: any) => ({
          ...r,
          photoUrl: r.photo_url,
          afterPhotoUrl: r.after_photo_url,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          userId: r.user_id,
          userName: r.user_name,
          userAvatar: r.user_avatar,
          isUrgent: r.is_urgent,
          aiAuthenticityScore: r.ai_authenticity_score,
          aiConfidence: r.ai_confidence,
          assignedDinas: r.assigned_dinas,
          slaTargetDays: r.sla_target_days,
          slaDaysRemaining: r.sla_days_remaining,
          comments: (r.comments || []).map((c: any) => ({
            ...c,
            createdAt: c.created_at,
            isOfficial: c.is_official
          }))
        }));
        setReports(mappedReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Gagal mengambil data laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Real-time subscription
    const channelName = `public:reports-admin:${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Statistics calculation
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
      const now = new Date().toISOString();
      const slaDays = newStatus === 'Selesai' ? 0 : selectedReport.slaDaysRemaining;

      // Update Report in Supabase
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          assigned_dinas: assignedDinasInput,
          after_photo_url: afterPhotoInput || selectedReport.afterPhotoUrl || '',
          sla_days_remaining: slaDays,
          updated_at: now
        })
        .eq('id', selectedReport.id);

      if (updateError) throw updateError;

      // Add Admin Comment
      if (statusNotes) {
        await supabase.from('comments').insert({
          id: `c-admin-${Date.now()}`,
          report_id: selectedReport.id,
          author: 'Admin LaporKuy',
          role: 'admin',
          content: `Status diubah menjadi "${newStatus}". Catatan: ${statusNotes}`,
          created_at: now,
          is_official: true
        });
      }

      toast.success(`Laporan #${selectedReport.id} berhasil diperbarui!`, {
        description: `Status baru: ${newStatus} • ${assignedDinasInput}`
      });
      setSelectedReport(null);
      
      // We don't strictly need to call fetchReports here as the real-time subscription
      // will pick up the change and auto-refresh, but doing it manually guarantees 
      // immediate feedback.
      fetchReports();
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Manajemen Laporan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Kelola aduan warga kota, validasi bukti AI Vision, dan tugaskan armada dinas lapangan dengan pemantauan SLA ketat.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg flex gap-1 self-start sm:self-auto shrink-0 select-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Semua Aduan
          </button>
          <button
            onClick={() => setActiveTab('dinas')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'dinas'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Filter Dinas
          </button>
        </div>
      </div>

      {/* ── 2. STATS OVERVIEW CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Aduan</CardTitle>
            <FileText className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Diproses</CardTitle>
            <Building2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Selesai</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Alert Banner */}
      {slaBreaches.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold">
                Perhatian: {slaBreaches.length} Aduan Memasuki Batas Akhir SLA
              </h4>
              <p className="text-sm text-rose-600/90 dark:text-rose-400">
                Segera prioritaskan penanganan untuk menghindari keterlambatan.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setSelectedStatusFilter('Diproses')}
            className="shrink-0 font-medium cursor-pointer"
          >
            Lihat Laporan
          </Button>
        </div>
      )}

      {/* ── 3. SEARCH & CONTROLS BAR ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari ID, judul, lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full md:max-w-md rounded-md bg-white dark:bg-slate-950 border-input"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Dinas Filter (if in dinas tab) */}
          {activeTab === 'dinas' && (
            <select
              value={selectedDinasFilter}
              onChange={(e) => setSelectedDinasFilter(e.target.value)}
              className="h-10 px-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
            >
              <option value="Semua Dinas">Semua Dinas</option>
              {dinasOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['Semua', 'Pending', 'Terverifikasi', 'Diproses', 'Selesai'].map((st) => (
              <Badge
                key={st}
                variant={selectedStatusFilter === st ? 'default' : 'secondary'}
                className="cursor-pointer font-medium px-3 py-1.5 whitespace-nowrap rounded-md"
                onClick={() => setSelectedStatusFilter(st)}
              >
                {st}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. RESPONSIVE DISPATCH VIEW ── */}

      {/* ================= MOBILE VIEW: RESPONSIVE CARDS ================= */}
      <div className="block md:hidden space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Tidak ada laporan ditemukan.
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
              <Card key={report.id} className="overflow-hidden shadow-sm">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {report.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800 relative">
                      <img
                        src={report.photoUrl || fallbackImg}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {report.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {report.address}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryBadgeClass(report.category)}`}>
                            {report.category}
                         </span>
                         <span className="font-medium text-emerald-600 dark:text-emerald-500">AI: {report.aiAuthenticityScore || 98}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-md flex justify-between items-center">
                      <span className="font-medium truncate mr-2">{report.assignedDinas || 'Belum Ditugaskan'}</span>
                      <span className={`text-xs whitespace-nowrap ${(report.slaDaysRemaining ?? 3) <= 1 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>SLA: {report.slaDaysRemaining ?? 3}h</span>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleOpenModal(report)} className="flex-1 h-9 text-sm cursor-pointer">
                      Update
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 cursor-pointer" asChild>
                       <Link href={`/laporan/${report.id}`}><ExternalLink className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ================= DESKTOP VIEW: CLEAN DATA TABLE ================= */}
      <div className="hidden md:block">
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">ID</th>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Laporan</th>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Kategori & AI</th>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Dinas</th>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Tidak ada laporan yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    return (
                      <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 align-top">
                          <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{report.id}</span>
                        </td>
                        <td className="py-3 px-4 align-top max-w-[250px]">
                          <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{report.title}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                             <MapPin className="w-3 h-3 shrink-0" />
                             <span className="truncate">{report.address}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top">
                           <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryBadgeClass(report.category)}`}>
                                {report.category}
                              </span>
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">AI Validasi: {report.aiAuthenticityScore || 98}%</span>
                           </div>
                        </td>
                        <td className="py-3 px-4 align-top text-slate-600 dark:text-slate-300">
                           <div className="font-medium">{report.assignedDinas || '-'}</div>
                           <div className="text-xs text-slate-500 mt-1">SLA: {report.slaDaysRemaining ?? 3} hari</div>
                        </td>
                        <td className="py-3 px-4 align-top">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadgeClass(report.status)}`}>
                              {report.status}
                           </span>
                        </td>
                        <td className="py-3 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenModal(report)}
                              className="h-8 text-xs font-medium cursor-pointer"
                            >
                              Update Status
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 cursor-pointer" asChild>
                              <Link href={`/laporan/${report.id}`}><ExternalLink className="w-4 h-4" /></Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 5. UPDATE STATUS & UPLOAD AFTER PHOTO MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Update Status Laporan
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-500">ID Laporan</div>
                <div className="font-mono text-sm">{selectedReport.id}</div>
              </div>

              <form id="update-form" onSubmit={handleStatusSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Report['status'])}
                    className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Penugasan Dinas
                  </label>
                  <select
                    value={assignedDinasInput}
                    onChange={(e) => setAssignedDinasInput(e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
                  >
                    {dinasOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {newStatus === 'Selesai' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">
                      Foto Hasil Perbaikan
                    </label>
                    {afterPhotoInput ? (
                      <div className="relative w-full h-40 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img src={afterPhotoInput} className="w-full h-full object-cover" alt="After Photo" />
                        <button
                          type="button"
                          onClick={() => setAfterPhotoInput('')}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                         <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                           <Upload className="h-5 w-5 text-slate-400 mb-2" />
                           <span className="text-xs text-slate-500">Klik untuk upload foto</span>
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
                         {/* Presets for Demo */}
                         <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setAfterPhotoInput('https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80')}
                              className="text-xs text-blue-600 hover:underline cursor-pointer"
                            >
                              Gunakan Contoh Foto Lampu
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">
                    Catatan
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan tindakan..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full h-24 p-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 rounded-b-lg">
              <Button
                variant="outline"
                type="button"
                onClick={() => setSelectedReport(null)}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="update-form"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
