'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, MessageCircle, Mail, Lock, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'wa'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [waNumber, setWaNumber] = useState('');

  // OTP State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Handling standard email login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profil');
  };

  const [isLoading, setIsLoading] = useState(false);

  // Handling sending the WA OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: waNumber })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsOtpSent(true);
        setCountdown(60);
      } else {
        alert(data.error || 'Gagal mengirim OTP');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (isOtpSent && countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, isOtpSent]);

  // Handling OTP Verification Submit
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 4) {
      router.push('/profil');
    }
  };

  // Handling individual OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last char in case they paste multiple or something weird
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handling backspace for OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Card className="p-6 border-border/60 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0057B8] text-white shadow-md mb-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#003B73]">
            {isOtpSent ? 'Verifikasi OTP' : 'Masuk ke LaporKuy'}
          </h1>
          <p className="text-xs text-slate-500">
            {isOtpSent 
              ? `Masukkan kode 4 digit yang dikirimkan ke WhatsApp ${waNumber}` 
              : 'Akses dashboard pelaporan, klaim poin reward, dan pantau dampak kotamu.'}
          </p>
        </div>

        {/* Show Method Toggle ONLY if OTP is not yet sent */}
        {!isOtpSent && (
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <Button
              size="sm"
              type="button"
              variant={loginMethod === 'email' ? 'default' : 'ghost'}
              onClick={() => setLoginMethod('email')}
              className={`w-1/2 text-xs font-bold ${loginMethod === 'email' ? 'bg-white shadow-sm text-[#0057B8] hover:bg-white hover:text-[#0057B8]' : 'text-slate-500 hover:text-slate-700 hover:bg-transparent'}`}
            >
              Email / Password
            </Button>
            <Button
              size="sm"
              type="button"
              variant={loginMethod === 'wa' ? 'default' : 'ghost'}
              onClick={() => setLoginMethod('wa')}
              className={`w-1/2 text-xs font-bold gap-1 ${loginMethod === 'wa' ? 'bg-white shadow-sm text-emerald-600 hover:bg-white hover:text-emerald-600' : 'text-slate-500 hover:text-emerald-600 hover:bg-transparent'}`}
            >
              <MessageCircle className="h-3.5 w-3.5" /> OTP WhatsApp
            </Button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            OTP VERIFICATION FORM
        ═══════════════════════════════════════════════ */}
        {isOtpSent ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6 text-xs">
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
                  className="w-14 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button type="submit" className="w-full h-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              Verifikasi & Masuk <ShieldCheck className="ml-1.5 h-4 w-4" />
            </Button>

            <div className="text-center pt-2 text-xs">
              <span className="text-slate-500 block mb-3">
                {countdown > 0 ? (
                  `Kirim ulang kode dalam ${countdown} detik`
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setCountdown(60)} 
                    className="text-emerald-600 font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Kirim Ulang OTP
                  </button>
                )}
              </span>
              <button 
                type="button" 
                onClick={() => setIsOtpSent(false)} 
                className="text-slate-400 font-medium hover:text-[#0057B8] hover:underline"
              >
                Ganti Nomor WhatsApp
              </button>
            </div>
          </form>
        ) : (
          /* ═══════════════════════════════════════════════
              REGULAR LOGIN FORM
          ═══════════════════════════════════════════════ */
          <form onSubmit={loginMethod === 'email' ? handleEmailLogin : handleSendOtp} className="space-y-4 text-xs">
            {loginMethod === 'email' ? (
              <>
                <div>
                  <label className="font-bold text-[#172033] block mb-1">Email:</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 text-xs h-10 border-[#D9DEE5]"
                      required
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-[#172033] block mb-1">Password:</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 text-xs h-10 border-[#D9DEE5]"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-10 font-bold bg-[#0057B8] hover:bg-[#003B73] text-white shadow-sm">
                  Masuk Sekarang <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="font-bold text-[#172033] block mb-1">Nomor WhatsApp:</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="pl-9 text-xs h-10 border-[#D9DEE5] focus-visible:ring-emerald-500"
                      required
                      autoFocus
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Kode rahasia (OTP) 4-digit akan dikirimkan otomatis melalui pesan WhatsApp.
                  </span>
                </div>
                <Button type="submit" className="w-full h-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                  Kirim Kode OTP <MessageCircle className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            )}
          </form>
        )}

        {/* Footer Link */}
        {!isOtpSent && (
          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#0057B8] font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
