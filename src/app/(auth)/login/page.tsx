'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleLogin } from '@react-oauth/google';
import { MapPin, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLaporKuyStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Handling standard email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Gagal masuk: ' + error.message);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    const { credential } = credentialResponse;
    
    if (credential) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      });
      
      if (error) {
        alert('Error saat login dengan Google: ' + error.message);
        setIsLoading(false);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full bg-background">
      {/* BRANDING SIDE - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary-foreground mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg border border-white/10">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">LaporKuy</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-[1.1] max-w-[15ch]">
            Suara Anda, Masa Depan Kota Kita.
          </h1>
          <p className="mt-6 text-primary-foreground/80 text-lg leading-relaxed max-w-[40ch]">
            Platform pelaporan warga modern. Akses dashboard pelaporan, klaim poin reward, dan pantau dampak laporan Anda secara real-time.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-primary-foreground/80 text-sm font-medium">
          <ShieldCheck className="h-5 w-5 text-white" />
          <span>Sistem aman & terverifikasi</span>
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 lg:hidden flex flex-col items-center text-center">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg mb-4">
               <MapPin className="h-7 w-7" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Masuk ke LaporKuy</h1>
          </div>

          <div className="hidden lg:block mb-10">
             <h2 className="text-3xl font-bold tracking-tight text-foreground">Selamat Datang Kembali</h2>
             <p className="text-muted-foreground mt-2">Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5" autoComplete="off">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground tracking-wide">Alamat Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="email"
                  name="email-laporkuy"
                  placeholder="anda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-background border-border hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                  required
                  autoFocus
                  autoComplete="off"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground tracking-wide">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="password"
                  name="password-laporkuy"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-background border-border hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'} 
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Atau masuk dengan</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-8 flex justify-center w-full [&>div]:w-full transition-transform active:scale-[0.98]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                alert('Login dengan Google gagal');
                setIsLoading(false);
              }}
              shape="pill"
              theme="outline"
              size="large"
              text="signin_with"
            />
          </div>

          <p className="text-center mt-12 text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
