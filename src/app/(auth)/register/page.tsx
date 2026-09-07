'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const formatAuthError = (msg?: string) => {
    if (!msg) return 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.';
    const lower = msg.toLowerCase();
    if (lower.includes('user already registered') || lower.includes('already in use') || lower.includes('already registered')) {
      return 'Email ini sudah terdaftar. Silakan masuk menggunakan akun ini atau gunakan email lain.';
    }
    if (lower.includes('password should be at least')) {
      return 'Kata sandi minimal harus 6 karakter.';
    }
    if (lower.includes('invalid email')) {
      return 'Format alamat email tidak valid.';
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa saat.';
    }
    return msg;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    });

    if (error) {
      toast.error('Gagal Mendaftar', {
        description: formatAuthError(error.message),
      });
      setIsLoading(false);
    } else {
      toast.success('Akun berhasil dibuat!', {
        description: 'Anda akan diarahkan ke halaman utama.',
      });
      router.push('/');
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      toast.error('Daftar dengan Google Gagal', {
        description: formatAuthError(error.message),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#003B73] to-[#00143A] p-5 relative overflow-hidden font-sans">
      
      {/* Decorative Cityscape Silhouette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        {/* Mobile View (Focus on Monas on the left) */}
        <img 
          src="/skyline-jakarta.png" 
          alt="Jakarta Skyline Mobile" 
          className="block md:hidden w-full h-[100vh] object-cover object-[15%_bottom] opacity-25 mix-blend-multiply brightness-[150%] contrast-[1000%] grayscale"
        />
        {/* Desktop View (Centered Panorama) */}
        <img 
          src="/skyline-jakarta.png" 
          alt="Jakarta Skyline Desktop" 
          className="hidden md:block w-full h-[75vh] object-cover object-[center_bottom] opacity-25 mix-blend-multiply brightness-[150%] contrast-[1000%] grayscale"
        />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center py-8">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 drop-shadow-2xl">
             <Logo size={100} theme="dark" layout="vertical" />
          </div>
          <p className="text-slate-300 mt-2 text-center text-[15px] font-medium tracking-wide leading-relaxed">
            Sampaikan Laporanmu.<br/>Kuy Action.
          </p>
        </div>

        {/* Register Card */}
        <div className="w-full bg-[#0A1629] rounded-[2rem] p-7 sm:p-9 shadow-2xl border border-white/5">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white mb-2 tracking-wide">Buat Akun Baru</h1>
            <p className="text-slate-400 text-sm">Daftar sekarang buat mulai lapor.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="email"
                placeholder="Email Aktif"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="tel"
                placeholder="Nomor Telepon (Opsional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-11 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi (Min. 8 Karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-12 h-14 bg-transparent border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-14 font-bold text-[15px] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-sm transition-all mt-6"
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-800" />
            <span className="text-[13px] font-medium text-slate-500">atau</span>
            <div className="h-[1px] flex-1 bg-slate-800" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading} 
            onClick={handleGoogleRegister}
            className="w-full h-14 font-semibold mt-6 flex items-center justify-center gap-3 bg-transparent hover:bg-slate-800/50 border-slate-700 rounded-xl text-white transition-all text-[14px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Daftar dengan Google
          </Button>

          <p className="text-center mt-8 text-[13px] text-slate-400 font-medium">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-[#0084FF] hover:text-blue-400 transition-colors">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
