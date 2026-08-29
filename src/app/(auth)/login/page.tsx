'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthForm } from '@/components/ui/sign-in';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleEmailSubmit = async (data: { email: string; password?: string }) => {
    if (!data.password) return;
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert('Gagal masuk: ' + error.message);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleSocialSignIn = async (provider: 'google') => {
    if (provider === 'google') {
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
    }
  };

  const handleEmailLink = () => {
    alert('Fitur link login via email belum tersedia.');
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFA] flex items-center justify-center px-4 py-24 sm:px-6" style={{ fontFamily: "'SF Pro Display', 'Geist Sans', 'Helvetica Neue', sans-serif" }}>
      <AuthForm
        onEmailSubmit={handleEmailSubmit}
        onSocialSignIn={handleSocialSignIn}
        onEmailLink={handleEmailLink}
        isLoading={isLoading}
      />
    </div>
  );
}
