'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // OTP State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Countdown effect
  useEffect(() => {
    if (isOtpSent && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, isOtpSent]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      // Tembak API Mock Email
      const res = await fetch('/api/auth/otp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsOtpSent(true);
        setCountdown(60);
      } else {
        alert(data.error || 'Gagal mengirim Email OTP');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 4) {
      router.push('/profil');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
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
            {isOtpSent ? 'Verifikasi Email' : 'Daftar Akun LaporKuy'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isOtpSent 
              ? `Masukkan kode OTP yang telah dikirim ke ${email}` 
              : 'Bergabunglah dengan 12.000+ warga aktif pelopor civic-tech kota.'}
          </p>
        </div>

        {isOtpSent ? (
          /* ═══════════════════════════════════════════════
              OTP VERIFICATION FORM
          ═══════════════════════════════════════════════ */
          <form onSubmit={handleVerifyOtp} className="space-y-6 text-sm">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button type="submit" className="w-full h-11 font-bold">
              Verifikasi & Selesai <ShieldCheck className="ml-1.5 h-4 w-4" />
            </Button>

            <div className="text-center pt-2 text-xs">
              <span className="text-muted-foreground block mb-3">
                {countdown > 0 ? (
                  `Kirim ulang kode dalam ${countdown} detik`
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setCountdown(60)} 
                    className="text-primary font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Kirim Ulang OTP
                  </button>
                )}
              </span>
              <button 
                type="button" 
                onClick={() => setIsOtpSent(false)} 
                className="text-slate-400 font-medium hover:text-primary hover:underline"
              >
                Ganti Alamat Email
              </button>
            </div>
          </form>
        ) : (
          /* ═══════════════════════════════════════════════
              REGULAR REGISTER FORM
          ═══════════════════════════════════════════════ */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block tracking-wide">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nama sesuai KTP/ID"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 text-sm h-11"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-sm h-11"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block tracking-wide">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 text-sm h-11"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-sm h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm font-semibold mt-4">
              {isLoading ? 'Mengirim Email...' : 'Daftar Akun Baru'} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        )}

        {!isOtpSent && (
          <div className="text-center pt-6 mt-6 border-t border-border text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline transition-colors">
              Masuk Sekarang
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
