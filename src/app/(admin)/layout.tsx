'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, LogOut, Loader2, BarChart3, Map } from 'lucide-react';
import { toast } from 'sonner';
import { sendTelegramLog } from '@/app/actions/telegram';

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
    sendTelegramLog(`<b>🛡️ Admin Logout</b>\n\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`);
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
      <header className="bg-slate-950 text-white sticky top-0 z-50 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-slate-700 transition-colors">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white">LaporKuy</span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block">Panel Dispatch Kota</span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/admin'
                  ? 'text-white bg-slate-800 border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/embed/map"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              Peta Sebaran
            </Link>
          </nav>

          {/* Right: Admin User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                A
              </div>
              <div className="hidden sm:block text-left leading-none">
                <span className="text-xs font-medium text-slate-200 block">
                  {adminUser?.username || 'AryaKuy'}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/30 transition-colors border border-slate-800 hover:border-rose-900/50 rounded-md px-2.5 py-1.5 cursor-pointer"
              title="Keluar dari Portal Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Nav Row */}
        <div className="md:hidden border-t border-slate-800/80 px-4 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              pathname === '/admin'
                ? 'text-white bg-slate-800 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <Link
            href="/embed/map"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-400 hover:text-white whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5" />
            Peta Sebaran
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Admin footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-3.5 px-6 text-center text-xs text-slate-500 font-normal">
        © {new Date().getFullYear()} LaporKuy • Panel Administrasi & Dispatch Kota
      </footer>
    </div>
  );
}
