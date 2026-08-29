'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Mail, Lock, ArrowRight } from 'lucide-react';

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

  const handleGoogleLogin = async () => {
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
    <div className="mx-auto max-w-md w-full px-4 py-16 sm:px-6">
      <Card className="p-6 border-border/60 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0057B8] text-white shadow-md mb-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#003B73]">
            Masuk ke LaporKuy
          </h1>
          <p className="text-xs text-slate-500">
            Akses dashboard pelaporan, klaim poin reward, dan pantau dampak kotamu.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            REGULAR LOGIN FORM
        ═══════════════════════════════════════════════ */}
        <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#172033] block mb-1">Email:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                name="email-laporkuy"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs h-10 border-[#D9DEE5]"
                required
                autoFocus
                autoComplete="nope"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-[#172033] block mb-1">Password:</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                name="password-laporkuy"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs h-10 border-[#D9DEE5]"
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-10 font-bold bg-[#0057B8] hover:bg-[#003B73] text-white shadow-sm">
            {isLoading ? 'Memproses...' : 'Masuk Sekarang'} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-slate-200" />
          <span className="p-2 text-xs text-slate-400">ATAU</span>
          <hr className="w-full border-slate-200" />
        </div>

        <Button 
          type="button" 
          variant="outline" 
          disabled={isLoading} 
          onClick={handleGoogleLogin}
          className="w-full h-10 text-xs font-semibold mt-4 flex items-center justify-center gap-2 border-[#D9DEE5]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Masuk dengan Google
        </Button>

        {/* Footer Link */}
        <div className="text-center pt-4 mt-6 border-t border-slate-100 text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#0057B8] font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </Card>
    </div>
  );
}
