'use client';

import { useEffect, useRef } from 'react';
import { ledgerFingerprint, reportAchievements, toUnlocks, updateLedger, type AchievementLedger } from '@/lib/lok-universe/src/achievements';
import { lokAuthClient } from '@/integrations/lok/founder';
import { useLokAccount } from './useLokAccount';

const LEDGER_KEY = 'spendutall.achievement-ledger.v1';
const APP_KEY = 'spendutall';
const SYNC_DEBOUNCE_MS = 4000;

function loadLedger(): AchievementLedger | null {
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as AchievementLedger) : null;
  } catch {
    return null;
  }
}

/**
 * Keeps a permanent "first unlocked" record of every achievement, and while
 * signed in reports it to the GSix account so the hub's Achievements page can
 * show what is earned and when.
 *
 * A run's `runAchievements` resets with each new run, so the ledger lives in
 * its own localStorage key and only ever grows. Each entry keeps the real
 * unlock time the game stamped. Mount once at the app root.
 */
export function useLokAchievementSync(unlockedAt: Record<string, number> | undefined, ready: boolean) {
  const { user } = useLokAccount();
  const userId = user?.id;
  const sent = useRef<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const stored = loadLedger();
    const { ledger, changed } = updateLedger(stored ?? {}, Object.keys(unlockedAt ?? {}), Date.now(), {
      firstRun: stored === null,
      knownAt: unlockedAt,
    });
    if (changed || stored === null) {
      try {
        window.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
      } catch {
        /* storage blocked: reporting below still works for this session */
      }
    }

    if (!userId || !lokAuthClient) {
      sent.current = null;
      return;
    }
    const fingerprint = ledgerFingerprint(ledger);
    if (fingerprint === sent.current || Object.keys(ledger).length === 0) return;
    const client = lokAuthClient;
    const timer = setTimeout(() => {
      void reportAchievements(client, APP_KEY, toUnlocks(APP_KEY, ledger)).then(({ error }) => {
        // On failure leave the fingerprint unset so the next change retries.
        if (!error) sent.current = fingerprint;
      });
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [unlockedAt, userId, ready]);
}
