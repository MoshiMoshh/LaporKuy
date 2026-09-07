'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  _booted: boolean;
  user: User | null;
  session: Session | null;
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
  user: null,
  session: null,

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
        if (session) {
          set({ isLoggedIn: true, isInitialized: true, user: session.user, session: session });
          recordUserSession(session);
        } else {
          set({ isLoggedIn: false, isInitialized: true, user: null, session: null });
        }
      } catch {
        // On any error (network failure, bad cookie, etc.) treat as logged out
        set({ isLoggedIn: false, isInitialized: true, user: null, session: null });
      }
    })();

    // Subscribe to auth state changes (login/logout) for the rest of the session
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ isLoggedIn: true, user: session.user, session: session });
        if (_event === 'SIGNED_IN') {
          recordUserSession(session);
        }
      } else {
        set({ isLoggedIn: false, user: null, session: null });
      }
    });
  },
}));

async function recordUserSession(session: Session) {
  try {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';
    // Gunakan hash token atau bagian dari JWT sebagai session_id sementara yang cukup unik
    const sessionId = session.access_token ? session.access_token.substring(session.access_token.length - 20) : Date.now().toString();
    
    await supabase.from('user_sessions').insert({
      user_id: session.user.id,
      session_id: sessionId,
      user_agent: userAgent
    });
  } catch (err) {
    console.error('Failed to record user session in database:', err);
  }
}
