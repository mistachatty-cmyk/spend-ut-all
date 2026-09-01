import type { GameState } from '../types';
import type { RunResult } from '../run-types';
import { foundedBusinessCount } from './businesses';

export const LEADERBOARD_KEY = 'spend-it-all-run-history-v1';

export function runScore(state: GameState, completed = false) {
  const wealth = Math.log10(Math.max(1, state.peakNetWorth + 1)) * 1000;
  const scale = state.townLevel * 300 + state.regionLevel * 1200;
  const completion = completed ? 5000 : 0;
  const risk = state.riskMode ? 1.35 : 1;
  const bankruptcyPenalty = state.runStatus === 'bankrupt' ? 1500 : 0;
  return Math.max(0, Math.round((wealth + scale + completion - bankruptcyPenalty) * risk));
}

export function createRunResult(state: GameState, completed = false): RunResult {
  const endedAt = Date.now();
  return {
    id: `${state.createdAt}-${endedAt}`,
    endedAt,
    result: state.runStatus === 'bankrupt' ? 'bankrupt' : 'completed',
    scenarioId: state.scenarioId,
    mode: state.mode,
    riskMode: state.riskMode,
    endingCash: state.cash,
    peakCash: state.peakCash,
    peakNetWorth: state.peakNetWorth,
    lifetimeIncome: state.lifetimeIncome,
    totalSpent: state.totalSpent,
    townLevel: state.townLevel,
    regionLevel: state.regionLevel,
    businessesFounded: foundedBusinessCount(state.businesses ?? {}),
    durationMs: Math.max(0, endedAt - state.createdAt),
    score: runScore(state, completed),
  };
}

export function normalizeRunHistory(input: unknown): RunResult[] {
  if (!Array.isArray(input)) return [];
  return input.filter((entry): entry is RunResult => !!entry && typeof entry === 'object' && typeof (entry as RunResult).id === 'string' && typeof (entry as RunResult).score === 'number').slice(0, 100);
}

export function addRunResult(history: RunResult[], result: RunResult) {
  if (history.some((entry) => entry.id === result.id)) return history;
  return [result, ...history].sort((a, b) => b.score - a.score).slice(0, 100);
}
