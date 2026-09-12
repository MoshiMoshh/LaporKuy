'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';
import { sendTelegramLog } from '@/app/actions/telegram';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Prefetch home page for instant transition after login
    router.prefetch('/');
  }, [router]);

  const formatAuthError = (msg?: string) => {
    if (!msg) return 'Terjadi kesalahan saat masuk. Silakan coba lagi.';
    const lower = msg.toLowerCase();
    if (lower.includes('invalid login credentials')) {
      return 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Email Anda belum dikonfirmasi. Silakan periksa kotak masuk email Anda.';
    }
    if (lower.includes('user not found')) {
      return 'Akun dengan email ini tidak ditemukan.';
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat.';
    }
    return msg;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Gagal Masuk', {
        description: formatAuthError(error.message),
      });
      setIsLoading(false);
    } else {
      sendTelegramLog(`<b>🔐 Login Berhasil</b>\n\n<b>Email:</b> ${email}\n<b>Metode:</b> Email/Password\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`).catch(console.error);
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const origin = typeof window !== 'undefined' 
      ? window.location.origin.replace('0.0.0.0', 'localhost')
      : 'http://localhost:3000';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    
    if (error) {
      toast.error('Login Google Gagal', {
        description: formatAuthError(error.message),
      });
      setIsLoading(false);
    } else {
      sendTelegramLog(`<b>🔄 OAuth Login Dimulai</b>\n\n<b>Provider:</b> Google\n<b>Alur:</b> Login (dari halaman masuk)\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`).catch(console.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#003B73] to-[#00143A] p-5 relative overflow-hidden font-sans">
      
      {/* Decorative Cityscape Silhouette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        <Image 
          src="/city-bg.jpg" 
          alt="City Background" 
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_bottom] opacity-25 filter invert brightness-200 mix-blend-screen"
        />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 drop-shadow-2xl">
             <Logo size={100} theme="dark" layout="vertical" />
          </div>
          <p className="text-slate-300 mt-2 text-center text-[15px] font-medium tracking-wide leading-relaxed">
            Sampaikan Laporanmu.<br/>Kuy Action.
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#0A1629] rounded-[2rem] p-7 sm:p-9 shadow-2xl border border-white/5">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white mb-2 tracking-wide">Selamat Datang!</h1>
            <p className="text-slate-400 text-sm">Silakan masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            
            <div className="relative">
              <label htmlFor="email-input" className="sr-only">Email atau Username</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="email-input"
                type="text"
                placeholder="Email atau Username"
                aria-label="Email atau Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-400 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label htmlFor="password-input" className="sr-only">Kata Sandi</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi"
                aria-label="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-12 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-400 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex justify-end pt-1 pb-2 relative z-20">
              <Link 
                href="/forgot-password" 
                className="text-[13px] font-semibold text-[#0084FF] hover:text-blue-400 transition-colors p-1 -mr-1 cursor-pointer relative z-30"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-14 font-bold text-[15px] bg-blue-600 hover:bg-blue-500 border border-blue-400/30 text-white rounded-xl shadow-md transition-all"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-800" />
            <span className="text-[13px] font-medium text-slate-400">atau</span>
            <div className="h-[1px] flex-1 bg-slate-800" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading} 
            onClick={handleGoogleLogin}
            aria-label="Masuk dengan Google"
            className="w-full h-14 font-semibold mt-6 flex items-center justify-center gap-3 bg-transparent hover:bg-slate-800/50 border-slate-700 rounded-xl text-white transition-all text-[14px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </Button>

          <p className="text-center mt-8 text-[13px] text-slate-400 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-[#0084FF] hover:text-blue-400 transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}