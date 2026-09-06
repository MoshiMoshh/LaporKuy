'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { ShieldCheck } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    // CRITICAL: never redirect until the session check is complete.
    // Premature redirect (before isInitialized) causes the mobile loop.
    if (!isInitialized) return;

    if (!isLoggedIn) {
      // Not logged in — redirect away from protected pages
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        router.replace('/login');
      }
    } else {
      // Logged in — redirect away from auth pages
      if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        router.replace('/');
      }
    }
  }, [isInitialized, isLoggedIn, pathname, router]);

  // Show loading screen until:
  // 1. isInitialized is true (Supabase check is complete), AND
  // 2. the user is either allowed on this page (no redirect needed)
  //    OR a redirect has already been issued.
  //
  // This avoids flashing protected content before redirecting.
  const isOnAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const shouldShowContent =
    isInitialized && (isLoggedIn ? !isOnAuthPage : isOnAuthPage);

  if (!shouldShowContent) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#0057B8] rounded-2xl flex items-center justify-center animate-pulse mb-4 shadow-lg">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <p className="text-[#003B73] font-bold tracking-widest text-sm animate-pulse">
          MEMVERIFIKASI SESI...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
