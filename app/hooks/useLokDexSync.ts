'use client';

import { useEffect, useRef } from 'react';
import type { CustomizationInventory } from '@/game/customization-types';
import { LOKDEX_CHANGED_EVENT, loadLokDexCollection, saveLokDexCollection, syncCompanionsToLokDex } from '@/game/systems/lokdex';
import { LOKDEX_APP_KEY, buildLokDexSnapshot, lokDexSnapshotFingerprint } from '@/game/systems/lokdex-snapshot';
import { pushLokDexSnapshot } from '@/integrations/lok/founder';
import { useLokAccount } from './useLokAccount';

const SYNC_DEBOUNCE_MS = 5000;

/**
 * While signed in, keeps the account's LokDex snapshot in step with this
 * device so the GSix hub shows the same cards and companions. Mount once at the
 * app root: it listens for collection writes anywhere in the game, so it does
 * not depend on the LokDex tab being open. Does nothing when signed out or
 * until `ready` (local saves loaded).
 *
 * Also grants the LokDex card for every LokPet the player owns, whenever the
 * inventory changes (starter pick, achievement, scenario, purchase). Without
 * this the card only appeared once the LokDex or card shop was opened, so the
 * snapshot pushed to the hub lagged behind the pet the player had just earned.
 */
export function useLokDexSync(inventory: CustomizationInventory, ready: boolean) {
  const { user } = useLokAccount();
  const userId = user?.id;
  const ownedKey = inventory.ownedIds.join(',');
  const lastFingerprint = useRef<string | null>(null);
  const owned = useRef(inventory);
  owned.current = inventory;

  useEffect(() => {
    if (!ready) return;
    const current = loadLokDexCollection();
    const next = syncCompanionsToLokDex(current, owned.current);
    // Only write when a card or discovery was actually added, so an unchanged
    // collection does not fire LOKDEX_CHANGED_EVENT on every load.
    if (next.cards.length !== current.cards.length || next.discoveredIds.length !== current.discoveredIds.length) saveLokDexCollection(next);
  }, [ownedKey, ready]);

  useEffect(() => {
    if (!userId) {
      lastFingerprint.current = null;
      return;
    }
    // Wait for the saved inventory to load, or the default one would overwrite the cloud copy.
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const run = () => {
      const snapshot = buildLokDexSnapshot(loadLokDexCollection(), owned.current);
      const fingerprint = lokDexSnapshotFingerprint(snapshot);
      if (fingerprint === lastFingerprint.current) return;
      void pushLokDexSnapshot(userId, LOKDEX_APP_KEY, snapshot).then(({ error }) => {
        // On failure leave the fingerprint unset so the next change retries.
        if (!error) lastFingerprint.current = fingerprint;
      });
    };
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, SYNC_DEBOUNCE_MS);
    };
    schedule();
    window.addEventListener(LOKDEX_CHANGED_EVENT, schedule);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(LOKDEX_CHANGED_EVENT, schedule);
    };
  }, [userId, ownedKey, ready]);
}
