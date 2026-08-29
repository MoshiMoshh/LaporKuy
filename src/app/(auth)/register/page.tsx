'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

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
      // Pendaftaran berhasil (Supabase akan otomatis login atau mengirim email verifikasi jika diaktifkan)
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
      alert('Error saat login dengan Google: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <MapPin className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Daftar Akun LaporKuy
          </h1>
          <p className="text-sm text-muted-foreground">
            Bergabunglah dengan 12.000+ warga aktif pelopor civic-tech kota.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            REGULAR REGISTER FORM
        ═══════════════════════════════════════════════ */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block tracking-wide">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nama sesuai KTP/ID"
                name="name-laporkuy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 text-sm h-11"
                required
                disabled={isLoading}
                autoComplete="nope"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                name="email-laporkuy"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-sm h-11"
                required
                disabled={isLoading}
                autoComplete="nope"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block tracking-wide">Nomor Telepon (Opsional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                name="phone-laporkuy"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 text-sm h-11"
                disabled={isLoading}
                autoComplete="nope"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                name="password-laporkuy"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 text-sm h-11"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm font-semibold mt-4">
            {isLoading ? 'Memproses...' : 'Daftar Akun Baru'} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-slate-200 dark:border-slate-800" />
          <span className="p-2 text-xs text-muted-foreground bg-white dark:bg-slate-900">ATAU</span>
          <hr className="w-full border-slate-200 dark:border-slate-800" />
        </div>

        <Button 
          type="button" 
          variant="outline" 
          disabled={isLoading} 
          onClick={handleGoogleRegister}
          className="w-full h-11 text-sm font-semibold mt-4 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Daftar dengan Google
        </Button>

        <div className="text-center pt-6 mt-6 border-t border-border text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline transition-colors">
            Masuk Sekarang
          </Link>
        </div>
      </Card>
    </div>
  );
}
