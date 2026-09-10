'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

const isBypassEnabled = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
const supabase = createClient();

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  _booted: boolean;
  initializeAuth: () => void;
  setLoggedIn: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: isBypassEnabled,
  isInitialized: isBypassEnabled,
  _booted: isBypassEnabled,

  initializeAuth: () => {
    if (isBypassEnabled) {
      set({ isLoggedIn: true, isInitialized: true, _booted: true });
      return;
    }

    if (get()._booted) return;
    set({ _booted: true });

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        set({ isLoggedIn: !!session, isInitialized: true });
      } catch {
        set({ isLoggedIn: false, isInitialized: true });
      }
    })();

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isLoggedIn: !!session });
    });
  },

  setLoggedIn: (val: boolean) => {
    set({ isLoggedIn: val, isInitialized: true });
  }
}));

export const initializeAuth = () => useAuthStore.getState().initializeAuth();
export const setLoggedIn = (val: boolean) => useAuthStore.getState().setLoggedIn(val);
