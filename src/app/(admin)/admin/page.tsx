'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLaporKuyStore } from '@/lib/store';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  Users,
  Search,
} from 'lucide-react';

export default function AdminPage() {
  const { reports, updateReportStatus } = useLaporKuyStore();

  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'dinas' | 'moderator'>('superadmin');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<Report['status']>('Diproses');
  const [statusNotes, setStatusNotes] = useState('');
  const [afterPhotoInput, setAfterPhotoInput] = useState('');
  const [search, setSearch] = useState('');

  // SLA Alert Breaches
  const slaBreaches = reports.filter((r) => r.status !== 'Selesai' && r.slaDaysRemaining === 0);

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    updateReportStatus(
      selectedReport.id,
      newStatus,
      statusNotes,
      afterPhotoInput || 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80'
    );

    setSelectedReport(null);
    setStatusNotes('');
    setAfterPhotoInput('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header & Role Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Admin & Dispatch Panel
            </h1>
            <Badge className="bg-rose-500 text-white font-bold text-xs">
              Role: {selectedRole.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola verifikasi aduan, penugasan dinas, dan pemantauan SLA perbaikan kota.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
          <Button
            size="sm"
            variant={selectedRole === 'superadmin' ? 'default' : 'ghost'}
            onClick={() => setSelectedRole('superadmin')}
            className="text-xs font-bold"
          >
            Super Admin
          </Button>
          <Button
            size="sm"
            variant={selectedRole === 'dinas' ? 'default' : 'ghost'}
            onClick={() => setSelectedRole('dinas')}
            className="text-xs font-bold"
          >
            Portal Dinas
          </Button>
        </div>
      </div>

      {/* SLA ALERT BANNER (Only for Super Admin) */}
      {selectedRole === 'superadmin' && slaBreaches.length > 0 && (
        <Card className="p-4 bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 animate-bounce" />
            <div>
              <h3 className="font-bold text-sm">⚠️ {slaBreaches.length} Laporan Melewati Target SLA!</h3>
              <p className="text-xs opacity-90">
                Peringatan eskalasi otomatis diteruskan ke Kepala Dinas terkait untuk tindakan langsung.
              </p>
            </div>
          </div>
          <Button size="sm" variant="destructive" className="text-xs shrink-0 font-bold">
            Eskalasi Massal Sekarang
          </Button>
        </Card>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari ID laporan, lokasi, atau kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <span className="text-xs text-muted-foreground font-semibold">
          Total: {selectedRole === 'dinas' ? filteredReports.filter(r => r.assignedDinas?.includes('Bina Marga')).length : filteredReports.length} Laporan
        </span>
      </div>

      {/* CONDITIONAL RENDER BASED ON ROLE */}
      {selectedRole === 'superadmin' ? (
        /* SUPER ADMIN VIEW: DESKTOP TABLE */
        <Card className="border-border/60 overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b">
                <tr>
                  <th className="p-3.5">ID & Foto</th>
                  <th className="p-3.5">Judul & Lokasi</th>
                  <th className="p-3.5">Skor AI & Trust Pelapor</th>
                  <th className="p-3.5">Dinas Ditugaskan</th>
                  <th className="p-3.5">Status & SLA</th>
                  <th className="p-3.5 text-right">Aksi Update</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/50 font-medium">
                {filteredReports.map((report) => {
                  const fallbackPhotoUrl = report.category.includes('Lampu') 
                    ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80'
                    : report.category.includes('Banjir')
                    ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80'
                    : report.category.includes('Sampah')
                    ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'
                    : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80';

                  return (
                  <tr key={report.id} className="hover:bg-muted/20">
                    <td className="p-3.5 flex items-center gap-2">
                      <img 
                        src={report.photoUrl || fallbackPhotoUrl} 
                        onError={(e) => { e.currentTarget.src = fallbackPhotoUrl }}
                        className="h-10 w-10 rounded object-cover border shrink-0 bg-muted" 
                      />
                      <span className="font-mono text-[11px] font-bold text-primary">{report.id}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <h4 className="font-bold text-foreground line-clamp-1">{report.title}</h4>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">📍 {report.address}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                        AI: {report.aiAuthenticityScore || 98}% Asli
                      </span>
                      <span className="text-[10px] text-muted-foreground">Trust Pelapor: 98%</span>
                    </td>
                    <td className="p-3.5 text-foreground font-semibold">
                      {report.assignedDinas || 'Dinas Bina Marga'}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        className={`text-[10px] ${
                          report.status === 'Selesai'
                            ? 'bg-emerald-500 text-white'
                            : report.status === 'Diproses'
                            ? 'bg-blue-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(report);
                          setNewStatus(report.status);
                        }}
                        className="text-xs h-8 font-semibold"
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        /* PORTAL DINAS VIEW: MOBILE-FRIENDLY TASK CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.filter(r => r.assignedDinas?.includes('Bina Marga')).map((report) => {
            const fallbackPhotoUrl = report.category.includes('Lampu') 
              ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80'
              : report.category.includes('Banjir')
              ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80'
              : report.category.includes('Sampah')
              ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'
              : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80';

            return (
              <Card key={report.id} className="p-4 flex flex-col gap-4 border-l-4 border-l-primary hover:border-l-primary/80 transition-all shadow-sm">
                <div className="flex gap-3">
                  <img 
                    src={report.photoUrl || fallbackPhotoUrl} 
                    onError={(e) => { e.currentTarget.src = fallbackPhotoUrl }}
                    className="h-16 w-16 rounded-md object-cover border shrink-0 bg-muted" 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[10px] font-bold text-primary">{report.id}</span>
                      <Badge
                        className={`text-[9px] px-1.5 py-0 ${
                          report.status === 'Selesai'
                            ? 'bg-emerald-500 text-white'
                            : report.status === 'Diproses'
                            ? 'bg-blue-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight mb-1">{report.title}</h4>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 block">📍 {report.address}</span>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2 rounded-md flex items-center justify-between text-[10px] font-bold">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> SLA Target: {report.slaTargetDays} Hari</span>
                  <span>Sisa: {report.slaDaysRemaining} Hari</span>
                </div>

                <Button
                  onClick={() => {
                    setSelectedReport(report);
                    setNewStatus(report.status);
                  }}
                  className="w-full font-bold shadow-sm"
                  variant={report.status === 'Selesai' ? 'outline' : 'default'}
                >
                  {report.status === 'Selesai' ? 'Edit Dokumen' : 'Eksekusi & Update Foto'}
                </Button>
              </Card>
            );
          })}
          {filteredReports.filter(r => r.assignedDinas?.includes('Bina Marga')).length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-sm font-bold">Yeay! Tidak ada tugas lapangan yang antre.</p>
            </div>
          )}
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">Update Status Laporan #{selectedReport.id}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Pilih Status Baru:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Diproses">Diproses (Sedang Dikerjakan)</option>
                  <option value="Selesai">Selesai (Sudah Diperbaiki)</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {newStatus === 'Selesai' && (
                <div>
                  <label className="font-bold text-foreground block mb-2">
                    Foto Sesudah Perbaikan (Bukti Selesai):
                  </label>
                  
                  {afterPhotoInput ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border group">
                      <img src={afterPhotoInput} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setAfterPhotoInput('')} 
                        className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary/40 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Upload className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-bold text-primary">Upload Foto Hasil Perbaikan</span>
                      <span className="text-[9px] text-primary/70">Buka Kamera atau Galeri</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setAfterPhotoInput(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              <div>
                <label className="font-bold text-foreground block mb-1">Catatan Resmi Dinas / Admin:</label>
                <textarea
                  placeholder="Masukkan catatan tindakan atau estimasi penanganan..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full h-20 p-2 rounded-md border border-input bg-background text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" type="button" size="sm" onClick={() => setSelectedReport(null)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" className="font-bold">
                  Simpan Pembaruan Status
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
