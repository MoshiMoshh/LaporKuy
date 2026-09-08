import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Gagal Autentikasi Google
        </h1>
        
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Terjadi kesalahan saat memproses otentikasi login Google (External Auth Code Exchange Error).
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 mb-6 text-xs text-amber-800 dark:text-amber-300 text-left">
          <p className="font-semibold mb-1">Penyebab Umum Supabase Google OAuth Error:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            <li>Client Secret Google Provider di Dashboard Supabase belum dikonfigurasi / tidak valid.</li>
            <li>Redirect URI di Google Cloud Console belum menyertakan URL Supabase Callback.</li>
            <li>Redirect URL di Supabase Authentication belum menyertakan URL Vercel ini.</li>
          </ul>
        </div>

        <div className="w-full space-y-3">
          <Link href="/login" className="w-full block">
            <Button className="w-full bg-[#003B73] hover:bg-[#002850] text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Login
            </Button>
          </Link>
          <Link href="/" className="w-full block">
            <Button variant="outline" className="w-full py-2.5 rounded-xl font-medium">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
