'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLaporKuyStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GoogleLogin } from '@react-oauth/google';
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

        <div className="flex justify-center mt-4 w-full [&>div]:w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert('Login dengan Google gagal');
              setIsLoading(false);
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            text="signin_with"
          />
        </div>

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
