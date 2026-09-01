import { incomeStreams } from '@/data/earnings';
import type { GameState } from '../types';
import type { IncomeStreamDefinition } from '../income-types';

export function normalizeIncomeStreams(input: Record<string, number> | null | undefined) {
  const next: Record<string, number> = { ...(input ?? {}) };
  for (const stream of incomeStreams) next[stream.id] = Math.max(0, Math.floor(next[stream.id] ?? 0));
  return next;
}

export function incomeStreamUnitCost(state: GameState, stream: IncomeStreamDefinition) {
  const owned = state.incomeStreams?.[stream.id] ?? 0;
  return stream.baseCost * Math.pow(stream.growthRate, owned);
}

export function canUnlockIncomeStream(state: GameState, stream: IncomeStreamDefinition) {
  if ((stream.unlockSpent ?? 0) > state.totalSpent) return false;
  if ((stream.requiredTownLevel ?? 0) > state.townLevel) return false;
  if ((stream.requiredRegionLevel ?? 0) > state.regionLevel) return false;
  return true;
}

export function incomeStreamsPerSecond(state: GameState) {
  return incomeStreams.reduce((total, stream) => total + stream.incomePerSecond * (state.incomeStreams?.[stream.id] ?? 0), 0);
}

export function incomeStreamValue(state: GameState) {
  return incomeStreams.reduce((total, stream) => {
    const owned = state.incomeStreams?.[stream.id] ?? 0;
    if (!owned) return total;
    if (stream.growthRate === 1) return total + stream.baseCost * owned;
    return total + stream.baseCost * ((Math.pow(stream.growthRate, owned) - 1) / (stream.growthRate - 1));
  }, 0);
}
