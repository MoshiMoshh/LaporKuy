'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  _booted: boolean;
  initialize: () => void;
  setLoggedIn: (val: boolean) => void;
}

const isBypassEnabled = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

// Module-level singleton: one Supabase client for the whole app
const supabase = createClient();

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: isBypassEnabled,
  isInitialized: isBypassEnabled,
  _booted: isBypassEnabled,

  setLoggedIn: (val: boolean) => set({ isLoggedIn: val, isInitialized: true }),

  initialize: () => {
    if (isBypassEnabled) {
      set({ isLoggedIn: true, isInitialized: true, _booted: true });
      return;
    }

    // Idempotent: only runs once across all component trees
    if (get()._booted) return;
    set({ _booted: true });

    // Async session fetch — never throws, never loops
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        set({ isLoggedIn: !!session, isInitialized: true });
      } catch {
        // On any error (network failure, bad cookie, etc.) treat as logged out
        set({ isLoggedIn: false, isInitialized: true });
      }
    })();

    // Subscribe to auth state changes (login/logout) for the rest of the session
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isLoggedIn: !!session });
    });
  },
}));
