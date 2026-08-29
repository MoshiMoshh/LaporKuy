'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, LogOut } from 'lucide-react';
import { AuthGuard } from "@/components/providers/auth-guard";
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* Admin Navbar */}
      <header className="bg-[#0F172A] text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded bg-rose-500 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold tracking-tight">LaporKuy</span>
              <span className="text-[10px] text-white/40 ml-1.5 font-mono uppercase tracking-widest">Admin</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </nav>

          {/* Right: Back to site + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="text-[11px] text-white/40 hover:text-white/70 transition-colors hidden sm:block"
            >
              ← Ke Situs Publik
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                // AuthGuard will handle redirect once session is null
              }}
              className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-rose-400 transition-colors border border-white/10 rounded-md px-2.5 py-1.5"
            >
              <LogOut className="w-3 h-3" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Admin footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-6 text-center text-[11px] text-slate-400">
        LaporKuy Admin Panel — Internal Use Only
      </footer>
    </div>
    </AuthGuard>
  );
}
