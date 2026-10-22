'use client';

import { useEffect } from 'react';
import { startPlaytimeTracker } from '@/lib/lok-universe/src/playtime';
import { getSession } from '@/integrations/lok/founder';
import { LOKDEX_APP_KEY } from '@/game/systems/lokdex-snapshot';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Saves how long the signed-in player is actively playing to their GSix
 * account (shown on their gsix.online profile). Counted while this tab is
 * visible and focused. Signed-out play is counted in the separate cookieless
 * guest tally (only the seconds are sent; nothing is stored, and browsers that
 * send Global Privacy Control or Do Not Track are skipped). It stays idle when the
 * game is framed by the GSix site, which counts that time itself, so no minute
 * is ever counted twice. Mount once at the app root.
 */
export function useLokPlaytime() {
  useEffect(() => {
    if (!url || !anonKey) return;
    const tracker = startPlaytimeTracker({
      appKey: LOKDEX_APP_KEY,
      supabaseUrl: url,
      publishableKey: anonKey,
      getAccessToken: async () => (await getSession())?.access_token ?? null,
      countGuests: true,
    });
    return () => tracker.stop();
  }, []);
}
