'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  X,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient();

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

export default function PortalDinasPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update Status Modal State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<Report['status']>('Diproses');
  const [statusNotes, setStatusNotes] = useState('');
  const [afterPhotoInput, setAfterPhotoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawDinas = decodeURIComponent(resolvedParams.id || 'bina-marga');
  const dinasDisplayName = rawDinas
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
    const channelName = `public:reports-dinas-${rawDinas}-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rawDinas]);

  // Filter reports assigned to this specific Dinas
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

  const diprosesCount = assignedReports.filter((r) => r.status === 'Diproses').length;
  const selesaiCount = assignedReports.filter((r) => r.status === 'Selesai').length;

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
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
          after_photo_url: afterPhotoInput || selectedReport.afterPhotoUrl || '',
          sla_days_remaining: slaDays,
          updated_at: now
        })
        .eq('id', selectedReport.id);

      if (updateError) throw updateError;

      // Add Official Comment
      if (statusNotes) {
        await supabase.from('comments').insert({
          id: `c-dinas-${Date.now()}`,
          report_id: selectedReport.id,
          author: `Dinas ${dinasDisplayName}`,
          role: 'dinas',
          content: `Status diubah menjadi "${newStatus}". Catatan: ${statusNotes}`,
          created_at: now,
          is_official: true
        });
      }

      toast.success(`Laporan #${selectedReport.id} berhasil diperbarui!`, {
        description: `Status baru: ${newStatus}`
      });
      setSelectedReport(null);
      
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
              {assignedReports[0]?.assignedDinas || `Dinas ${dinasDisplayName}`}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Ditugaskan</CardTitle>
            <Building2 className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedReports.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Sedang Dikerjakan</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{diprosesCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Selesai Beres</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{selesaiCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Daftar Tugas Perbaikan
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {assignedReports.length} Aduan
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
                  src={r.photoUrl || (
                    r.category.includes('Lampu') ? '/images/reports/streetlight.jpg' :
                    r.category.includes('Banjir') ? '/images/reports/flood.jpg' :
                    r.category.includes('Sampah') ? '/images/reports/trash.jpg' :
                    r.category.includes('Trotoar') ? '/images/reports/trotoar.jpg' :
                    '/images/reports/pothole.jpg'
                  )}
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
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. UPDATE STATUS MODAL (DINAS ONLY) ── */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0">
              <div>
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                   Update Status Laporan
                 </h3>
                 <p className="text-xs text-slate-500 mt-0.5">ID: <span className="font-mono">{selectedReport.id}</span></p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <form id="update-form" onSubmit={handleStatusSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Ubah Status Penanganan
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Report['status'])}
                    className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
                  >
                    <option value="Terverifikasi">Terverifikasi (Persiapan)</option>
                    <option value="Diproses">Diproses (Sedang Dikerjakan)</option>
                    <option value="Selesai">Selesai (Sudah Diperbaiki)</option>
                    <option value="Ditolak">Ditolak (Tidak Valid)</option>
                  </select>
                </div>

                {newStatus === 'Selesai' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">
                      Unggah Foto Hasil Perbaikan
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
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block">
                    Catatan Pelaksanaan (Opsional)
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan tindakan lapangan..."
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Update'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
