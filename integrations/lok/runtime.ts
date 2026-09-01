import { localLokWalletAdapter, mergeRunIntoWallet } from './wallet';

export const LOK_PLAY_INTERVAL_MS = 10_000;

export type LokAccrual = {
  balance: number;
  progressMs: number;
  awarded: number;
};

export function accrueLok(balance: number, progressMs: number, deltaMs: number): LokAccrual {
  const stored = mergeRunIntoWallet(localLokWalletAdapter.load(), balance, progressMs);
  const accumulator = stored.progressMs + deltaMs;
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
  return localLokWalletAdapter.save(mergeRunIntoWallet(localLokWalletAdapter.load(), balance, progressMs));
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
};
