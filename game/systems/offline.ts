import { GameState } from '../types';

export const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;

export function calculateOfflineIncome(
  state: GameState,
  passiveCashPerSecond: (state: GameState) => number,
  now = Date.now(),
) {
  const elapsed = Math.min(MAX_OFFLINE_MS, Math.max(0, now - state.updatedAt));
  if (elapsed < 5_000) return { elapsedMs: elapsed, income: 0 };

  const incomePerSecond = passiveCashPerSecond({
    ...state,
    activeEventId: null,
    eventEndsAt: 0,
  });

  return {
    elapsedMs: elapsed,
    income: Math.max(0, incomePerSecond * (elapsed / 1000)),
  };
}