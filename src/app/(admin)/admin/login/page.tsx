'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';
import { sendTelegramLog } from '@/app/actions/telegram';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validasi kredensial khusus admin
      const validUsername = 'aryakuy';
      const validPassword = 'arya7777';

      if (username.trim().toLowerCase() === validUsername && password === validPassword) {
        document.cookie = 'laporkuy_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';
        localStorage.setItem(
          'laporkuy_admin_auth',
          JSON.stringify({
            username: 'AryaKuy',
            name: 'Arya (Administrator)',
            role: 'Super Admin Dispatch',
            authenticatedAt: new Date().toISOString(),
          })
        );

        sendTelegramLog(`<b>🛡️ Admin Login Berhasil</b>\n\n<b>Username:</b> ${username.trim()}\n<b>Role:</b> Super Admin Dispatch\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`);
        toast.success('Autentikasi berhasil. Mengalihkan ke dashboard...');
        router.replace('/admin');
      } else {
        setIsLoading(false);
        setErrorMessage('Username atau password tidak sesuai.');
        toast.error('Kredensial admin tidak valid.');
        sendTelegramLog(`<b>⛔ Admin Login Gagal</b>\n\n<b>Username dicoba:</b> <code>${username.trim()}</code>\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 font-sans px-4 py-8 sm:py-12 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top bar back link */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded-md hover:bg-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-500">v2.4</span>
      </div>

      {/* Main card container */}
      <div className="w-full max-w-sm mx-auto my-auto py-6">
        {/* Brand header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <Logo variant="full" size={32} theme="dark" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Portal Administrator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Masuk untuk verifikasi dan penanganan laporan kota.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="admin-username" className="text-xs font-medium text-slate-300 block">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="Masukkan username admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-medium text-slate-300 block">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Panel Admin</span>
              )}
            </button>
          </form>
        </div>

        {/* Security disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mt-4">
          Halaman ini dikhususkan bagi petugas dinas dan verifikator internal.
        </p>
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-sm mx-auto text-center">
        <p className="text-[11px] text-slate-600">
          © {new Date().getFullYear()} LaporKuy. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
}
