import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivasiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Kebijakan Privasi</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Komitmen perlindungan data pribadi & transparansi pengguna LaporKuy</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Pengumpulan Data Informasi</h2>
        <p className="text-slate-600 dark:text-slate-300">
          LaporKuy mengumpulkan data yang diperlukan untuk verifikasi validitas aduan pengaduan publik, termasuk:
          koordinat lokasi presisi (GPS Geolocation), foto bukti fisik masalah infrastruktur, dan informasi profil dasar pengguna.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Penggunaan & Perlindungan Data GPS</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Data lokasi presisi hanya digunakan untuk mencocokkan titik kerusakan dengan instansi/dinas teknis terkait (seperti Dinas Bina Marga atau DLH). Kami tidak membagikan koordinat pribadi Anda kepada pihak ketiga yang tidak berkepentingan.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Keamanan Akun & Autentikasi</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Autentikasi login dikelola menggunakan enkripsi tingkat tinggi melalui Supabase Provider Security dengan opsi verifikasi email dan Google OAuth resmi.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. Hak Pengguna</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Pengguna berhak memperbarui data diri, mengubah pengaturan privasi profil, dan mengajukan penghapusan akun serta data laporan kapan saja melalui pusat bantuan.
        </p>
      </div>
    </div>
  );
}
