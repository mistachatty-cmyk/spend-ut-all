import { localLokWalletAdapter, mergeRunIntoWallet, spendLok } from './wallet';

export const LOK_PLAY_INTERVAL_MS = 10_000;
const LOK_RUN_MIGRATION_KEY = 'gsix-lok-run-migrated-v1';

export type LokAccrual = {
  balance: number;
  progressMs: number;
  awarded: number;
};

export function accrueLok(_balance: number, _progressMs: number, deltaMs: number): LokAccrual {
  const stored = localLokWalletAdapter.load();
  const accumulator = stored.progressMs + Math.max(0, deltaMs);
  const awarded = Math.floor(accumulator / LOK_PLAY_INTERVAL_MS);
  const next = localLokWalletAdapter.save({
    ...stored,
    balance: stored.balance + awarded,
    progressMs: accumulator % LOK_PLAY_INTERVAL_MS,
    lifetimeEarned: stored.lifetimeEarned + awarded,
  });

  return {
    balance: next.balance,
    progressMs: next.progressMs,
    awarded,
  };
}

export function snapshotLok() {
  return localLokWalletAdapter.load();
}

export function migrateRunLok(balance: number, progressMs: number) {
  const stored = localLokWalletAdapter.load();
  if (typeof window === 'undefined') return stored;
  if (window.localStorage.getItem(LOK_RUN_MIGRATION_KEY) === '1') return stored;

  const merged = localLokWalletAdapter.save(mergeRunIntoWallet(stored, balance, progressMs));
  window.localStorage.setItem(LOK_RUN_MIGRATION_KEY, '1');
  return merged;
}

export function spendPersistentLok(amount: number) {
  const wallet = localLokWalletAdapter.load();
  const spent = spendLok(wallet, amount);
  if (spent === wallet) return { success: false, wallet };
  return { success: true, wallet: localLokWalletAdapter.save(spent) };
}

/**
 * Spend It All currently uses the local adapter as the authoritative wallet.
 * Later, swap this boundary to a G-Six server adapter that can attach the same
 * wallet to Apple, Discord, GitHub, or a first-party G-Six account.
 */
export const lokRuntime = {
  intervalMs: LOK_PLAY_INTERVAL_MS,
  accrue: accrueLok,
  snapshot: snapshotLok,
  migrateRun: migrateRunLok,
  spend: spendPersistentLok,
};
