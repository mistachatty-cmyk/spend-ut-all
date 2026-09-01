export const LOK_PLAY_INTERVAL_MS = 10_000;

export type LokAccrual = {
  balance: number;
  progressMs: number;
  awarded: number;
};

export function accrueLok(balance: number, progressMs: number, deltaMs: number): LokAccrual {
  const accumulator = progressMs + deltaMs;
  const awarded = Math.floor(accumulator / LOK_PLAY_INTERVAL_MS);

  return {
    balance: balance + awarded,
    progressMs: accumulator % LOK_PLAY_INTERVAL_MS,
    awarded,
  };
}

/**
 * This local adapter keeps Spend It All independently runnable.
 * Replace the storage/ledger boundary with the shared LOK ecosystem API later;
 * the game simulation should not need to know where the authoritative wallet lives.
 */
export const lokRuntime = {
  intervalMs: LOK_PLAY_INTERVAL_MS,
  accrue: accrueLok,
};
