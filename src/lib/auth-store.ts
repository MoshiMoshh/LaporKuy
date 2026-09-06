'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  _booted: boolean;
  initialize: () => void;
}

// Module-level singleton: one Supabase client for the whole app
const supabase = createClient();

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isInitialized: false,
  _booted: false,

  initialize: () => {
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
