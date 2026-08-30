'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, User, Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useLaporKuyStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      alert('Gagal mendaftar: ' + error.message);
      setIsLoading(false);
    } else {
      // Supabase secara otomatis me-login-kan user setelah register jika konfirmasi email mati.
      // Kita harus sign out paksa agar AuthGuard tidak otomatis melempar user ke '/'
      await supabase.auth.signOut();
      
      alert('Akun Anda berhasil dibuat. Silakan masuk (login) menggunakan email dan password Anda.');
      router.push('/login');
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
      alert('Error saat login dengan Google: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full bg-background flex-row-reverse">
      {/* BRANDING SIDE - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern-subtle opacity-50 pointer-events-none" />
        
        {/* Decorative Effects */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3 text-white">
            <span className="text-xl font-semibold tracking-tight">LaporKuy</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative z-10 text-right mt-24">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-[1.1] ml-auto max-w-[15ch]">
            Jadilah Bagian Dari Perubahan.
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed ml-auto max-w-[35ch]">
            Bergabunglah dengan lebih dari 12.000 warga aktif yang berpartisipasi mewujudkan kota yang lebih baik setiap harinya.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-end gap-4 text-slate-300 text-sm font-medium mt-auto">
          <span>Komunitas yang peduli & proaktif</span>
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      {/* FORM SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
          
          <div className="mb-8 lg:hidden flex flex-col items-center text-center">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg mb-4">
               <MapPin className="h-7 w-7" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Daftar LaporKuy</h1>
          </div>

          <div className="hidden lg:block mb-10">
             <h2 className="text-3xl font-bold tracking-tight text-foreground">Buat Akun Baru</h2>
             <p className="text-muted-foreground mt-2">Daftarkan diri Anda untuk mulai melaporkan.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground tracking-wide">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  name="name-laporkuy"
                  placeholder="Sesuai KTP/ID"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 bg-background border-border hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                  required
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground tracking-wide">Email</label>
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
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground tracking-wide flex justify-between">
                <span>Nomor WhatsApp</span>
                <span className="text-muted-foreground font-normal">Opsional</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="tel"
                  name="phone-laporkuy"
                  placeholder="0812..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-12 bg-background border-border hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                  disabled={isLoading}
                  autoComplete="tel"
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
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-background border-border hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'} 
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading} 
            onClick={handleGoogleRegister}
            className="w-full h-12 font-semibold mt-8 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform bg-background hover:bg-slate-50 dark:hover:bg-slate-900 border-border"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Daftar dengan Google
          </Button>

          <p className="text-center mt-12 text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
