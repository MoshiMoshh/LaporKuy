'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const isBypassEnabled = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
const supabase = createClient();

let globalLoggedIn = isBypassEnabled;
let globalInitialized = isBypassEnabled;
let globalBooted = isBypassEnabled;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(l => l());
}

export function initializeAuth() {
  if (isBypassEnabled) {
    globalLoggedIn = true;
    globalInitialized = true;
    globalBooted = true;
    notify();
    return;
  }

  if (globalBooted) return;
  globalBooted = true;

  (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      globalLoggedIn = !!session;
      globalInitialized = true;
    } catch {
      globalLoggedIn = false;
      globalInitialized = true;
    }
    notify();
  })();

  supabase.auth.onAuthStateChange((_event, session) => {
    globalLoggedIn = !!session;
    notify();
  });
}

export function setLoggedIn(val: boolean) {
  globalLoggedIn = val;
  globalInitialized = true;
  notify();
}

export function useAuthStore() {
  const [state, setState] = useState({
    isLoggedIn: globalLoggedIn,
    isInitialized: globalInitialized,
  });

  useEffect(() => {
    const handler = () => {
      setState({
        isLoggedIn: globalLoggedIn,
        isInitialized: globalInitialized,
      });
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return state;
}

