'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { ShieldCheck } from 'lucide-react';

const isBypassEnabled = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    // If auth bypass is enabled (local audit mode), do not force-redirect anywhere.
    // This allows inspecting all pages freely (both main app and auth pages).
    if (isBypassEnabled) return;

    // CRITICAL: never redirect until the session check is complete.
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

  // When bypass is enabled for UI audit, render content immediately
  if (isBypassEnabled) {
    return <>{children}</>;
  }

  // Normal mode: Show loading screen until session check is complete
  const isOnAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const shouldShowContent =
    isInitialized && (isLoggedIn ? !isOnAuthPage : isOnAuthPage);

  if (!shouldShowContent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center animate-pulse mb-4 shadow-float">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <p className="text-primary font-bold tracking-widest text-xs animate-pulse">
          MEMVERIFIKASI SESI...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
