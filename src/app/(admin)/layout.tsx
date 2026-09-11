'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, LogOut, Loader2, BarChart3, Map } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string; name?: string } | null>(null);

  useEffect(() => {
    // If on login page, skip authentication check
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    try {
      const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('laporkuy_admin_auth') : null;
      const hasCookie = typeof document !== 'undefined' && document.cookie.includes('laporkuy_admin_session=authenticated');

      if (storedAuth || hasCookie) {
        const parsed = storedAuth
          ? JSON.parse(storedAuth)
          : { username: 'AryaKuy', name: 'Arya (Administrator)', role: 'Super Admin Dispatch' };
        setAdminUser(parsed);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
    } catch {
      setIsAuthenticated(false);
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  // If on /admin/login, render clean login view without admin navbar/footer
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state while checking admin session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
          <p className="text-xs font-bold tracking-wider uppercase text-slate-400">
            Memverifikasi Otoritas Admin...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, prevent layout render (redirect will trigger)
  if (!isAuthenticated) {
    return null;
  }

  const handleAdminLogout = () => {
    document.cookie = 'laporkuy_admin_session=; path=/; max-age=0';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('laporkuy_admin_auth');
    }
    toast.success('Sesi admin berakhir. Anda telah keluar.');
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Admin Dedicated Navbar */}
      <header className="bg-gradient-to-r from-[#002244] via-[#003366] to-[#004080] text-white sticky top-0 z-50 border-b border-blue-900/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-blue-200 group-hover:bg-white/25 transition-all shadow-inner">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-white">LaporKuy</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-sm">
                    Portal Admin
                  </span>
                </div>
                <span className="text-[10px] text-blue-200/70 hidden sm:block">Sistem Dispatch & Verifikasi Kota</span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                pathname === '/admin'
                  ? 'text-white bg-white/20 border-white/20 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dispatch Dashboard
            </Link>
            <Link
              href="/transparansi"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Pantau SLA Kota
            </Link>
            <Link
              href="/embed/map"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent"
            >
              <Map className="w-3.5 h-3.5" />
              Peta Persebaran
            </Link>
          </nav>

          {/* Right: Admin User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/15 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                A
              </div>
              <div className="hidden sm:block text-left leading-none">
                <span className="text-xs font-bold text-white block">
                  {adminUser?.username || 'AryaKuy'}
                </span>
                <span className="text-[9px] text-blue-200/80 font-medium">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-200 hover:text-white bg-rose-500/20 hover:bg-rose-600/40 transition-colors border border-rose-400/30 rounded-lg px-2.5 py-1.5 cursor-pointer shadow-sm"
              title="Keluar dari Portal Admin"
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
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-6 text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        LaporKuy Dispatch & Command Hub — Sistem Tertutup Otoritas Pemerintah Kota
      </footer>
    </div>
  );
}
