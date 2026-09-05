'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Gagal masuk', {
        description: error.message,
      });
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      toast.error('Login Google gagal', {
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* BRANDING SIDE */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 text-white">

        <div className="relative z-10">
          <div className="mb-12">
            <Logo size={36} theme="dark" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-lg">
            Jalan berlubang? Lampu mati? Laporkan.
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-md">
            Foto, tandai lokasi, kirim. Laporan Anda langsung masuk ke sistem dan bisa dipantau kapan saja.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-slate-300 text-sm font-semibold bg-slate-800/50 p-4 rounded-sm border border-slate-700 w-max">
          <ShieldCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
          <span>Sistem aman &amp; terverifikasi</span>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          
          <div className="mb-8 lg:hidden flex flex-col items-center text-center">
             <Logo size={44} className="mb-4" />
             <h1 className="text-2xl font-bold tracking-tight text-slate-900">Masuk ke Akun</h1>
          </div>

          <div className="hidden lg:block mb-8 border-b border-slate-200 pb-6">
             <h2 className="text-2xl font-bold tracking-tight text-slate-900">Selamat Datang Kembali</h2>
             <p className="text-slate-600 mt-2 text-sm">Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900" htmlFor="login-email">
                Alamat Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                <Input
                  id="login-email"
                  type="email"
                  name="email-laporkuy"
                  placeholder="anda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-slate-300 focus-visible:ring-blue-700 focus-visible:border-blue-700 rounded-sm"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900" htmlFor="login-password">
                Kata Sandi <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password-laporkuy"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-11 h-12 bg-white border-slate-300 focus-visible:ring-blue-700 focus-visible:border-blue-700 rounded-sm"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:text-blue-700"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-sm mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700 transition-colors"
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'} 
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atau</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading} 
            onClick={handleGoogleLogin}
            className="w-full h-12 font-semibold mt-8 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-slate-300 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </Button>

          <p className="text-center mt-8 text-sm text-slate-600 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-blue-700 hover:underline hover:text-blue-800 transition-colors focus-visible:outline-none focus-visible:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}