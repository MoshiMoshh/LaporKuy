'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, LogOut, ArrowLeft, BarChart3, Map } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { sendTelegramLog } from '@/app/actions/telegram';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
        {/* Admin Navbar */}
        <header className="bg-white dark:bg-slate-950 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">LaporKuy Admin</span>
                </div>
              </Link>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/transparansi"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Pantau SLA
              </Link>
              <Link
                href="/embed/map"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <Map className="w-4 h-4" />
                Peta Persebaran
              </Link>
            </nav>

            {/* Right: Back to site + logout */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Web Publik</span>
              </Link>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  const email = user?.email || 'Unknown Email';
                  await sendTelegramLog(`<b>👋 Logout Admin Berhasil</b>\n\n<b>Email:</b> ${email}\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
                  await supabase.auth.signOut();
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Admin footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          LaporKuy Admin Dashboard
        </footer>
      </div>
  );
}
