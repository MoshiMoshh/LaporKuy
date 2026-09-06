'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

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
      toast.error('Gagal mendaftar', {
        description: error.message,
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
      toast.error('Daftar dengan Google gagal', {
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#001F5B] via-[#003082] to-[#001040] p-5 relative overflow-hidden font-sans">
      
      {/* Decorative Cityscape Silhouette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        <img 
          src="/skyline-jakarta.png" 
          alt="Jakarta Skyline Mobile" 
          className="block md:hidden w-full h-[100vh] object-cover object-[15%_bottom] opacity-20 mix-blend-multiply brightness-150 contrast-[1000%] grayscale"
        />
        <img 
          src="/skyline-jakarta.png" 
          alt="Jakarta Skyline Desktop" 
          className="hidden md:block w-full h-[75vh] object-cover object-[center_bottom] opacity-20 mix-blend-multiply brightness-150 contrast-[1000%] grayscale"
        />
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-md z-10 flex flex-col items-center py-6"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-7">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-5 drop-shadow-2xl"
          >
             <Logo size={85} theme="dark" layout="vertical" />
          </motion.div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            Registrasi Warga Resmi & Aman
          </div>
        </div>

        {/* Register Card with Modern Curved Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full bg-[#08152B]/85 backdrop-blur-2xl rounded-[2.25rem] p-7 sm:p-9 shadow-float border border-white/10"
        >
          <div className="mb-7 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-300 text-sm font-medium">Bergabung dan berpartisipasi menjaga fasilitas kota</p>
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
                className="pl-11 h-13 bg-white/5 border-white/15 text-white placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all touch-manipulation text-base sm:text-sm"
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
                className="pl-11 h-13 bg-white/5 border-white/15 text-white placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all touch-manipulation text-base sm:text-sm"
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
                placeholder="Nomor WhatsApp (Opsional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-11 h-13 bg-white/5 border-white/15 text-white placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all touch-manipulation text-base sm:text-sm"
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
                className="pl-11 pr-12 h-13 bg-white/5 border-white/15 text-white placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all touch-manipulation text-base sm:text-sm"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none min-h-[44px] min-w-[44px] justify-center touch-manipulation"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              variant="liquid-primary"
              size="lg"
              className="w-full h-13 font-bold text-[15px] rounded-2xl shadow-md transition-all touch-manipulation mt-5"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-xs font-medium text-slate-400">atau</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading} 
            onClick={handleGoogleRegister}
            className="w-full h-13 font-semibold mt-5 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border-white/15 rounded-2xl text-white transition-all text-sm touch-manipulation active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Daftar dengan Google
          </Button>

          <p className="text-center mt-7 text-xs text-slate-400 font-medium">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline-offset-4 hover:underline py-1 touch-manipulation">
              Masuk Sekarang
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
