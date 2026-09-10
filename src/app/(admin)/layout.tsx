'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';
import { AuthGuard } from "@/components/providers/auth-guard";
import { createClient } from '@/lib/supabase/client';
import { sendTelegramLog } from '@/app/actions/telegram';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
        {/* Admin Navbar */}
        <header className="bg-gradient-to-r from-[#002B5B] via-[#003B7A] to-[#004B9B] text-white sticky top-0 z-50 border-b border-blue-900/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-blue-200 group-hover:bg-white/25 transition-all">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold tracking-tight text-white">LaporKuy</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                      Admin
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-200/70 hidden sm:block">Sistem Dispatch & Verifikasi Kota</span>
                </div>
              </Link>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dispatch Dashboard
              </Link>
              <Link
                href="/transparansi"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Pantau SLA Kota
              </Link>
              <Link
                href="/embed/map"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Peta Persebaran
              </Link>
            </nav>

            {/* Right: Back to site + logout */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Web Publik</span>
              </Link>
              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  const email = user?.email || 'Unknown Email';
                  await sendTelegramLog(`<b>👋 Logout Admin Berhasil</b>\n\n<b>Email:</b> ${email}\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
                  await supabase.auth.signOut();
                }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-200 hover:text-white hover:bg-rose-600/30 transition-colors border border-rose-400/20 rounded-lg px-2.5 py-1.5 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
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
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-6 text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          LaporKuy Command & Dispatch Hub — Pemerintah Kota & Partisipasi Publik
        </footer>
      </div>
    </AuthGuard>
  );
}
