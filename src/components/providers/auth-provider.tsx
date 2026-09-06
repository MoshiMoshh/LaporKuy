'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

/**
 * AuthProvider must be mounted once at the root of the app.
 * It calls initialize() which triggers a single Supabase getSession()
 * and sets up an onAuthStateChange listener for the entire session.
 *
 * The initialize() call is idempotent — even if AuthProvider re-renders
 * or is accidentally mounted multiple times, the auth check only runs once.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
