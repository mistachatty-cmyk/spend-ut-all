'use client';

import { useEffect, useState } from 'react';
import { getSession, lokAccountsAvailable, onAuthStateChange, type Session } from '@/integrations/lok/founder';

export function useLokAccount() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSession().then((next) => { if (!cancelled) setSession(next); });
    const unsubscribe = onAuthStateChange(setSession);
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  return { session, user: session?.user ?? null, available: lokAccountsAvailable };
}
