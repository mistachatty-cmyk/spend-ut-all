import type { GameState } from '../types';

export const BANKRUPTCY_WINDOW_MS = 10_000;
export const DEBT_INTEREST_RATE_PER_SECOND = 0.0002;

export function creditLimit(state: GameState, currentNetWorth: number) {
  if (!state.riskMode) return 0;
  const baseline = Math.max(state.peakCash * 0.2, currentNetWorth * 0.15, 10_000);
  return Math.max(10_000, baseline);
}

export function availableBuyingPower(state: GameState, currentNetWorth: number) {
  return Math.max(0, state.cash + creditLimit(state, currentNetWorth));
}

export function canRiskSpend(state: GameState, amount: number, currentNetWorth: number) {
  if (amount <= 0) return false;
  if (!state.riskMode) return state.cash >= amount;
  return state.cash - amount >= -creditLimit(state, currentNetWorth);
}

export function debtInterestPerSecond(state: GameState) {
  if (!state.riskMode || state.cash >= 0 || state.runStatus !== 'active') return 0;
  return Math.abs(state.cash) * DEBT_INTEREST_RATE_PER_SECOND;
}

export function updateRiskState(state: GameState, currentNetWorth: number, now = Date.now()): GameState {
  if (!state.riskMode || state.runStatus !== 'active') return state;
  const limit = creditLimit(state, currentNetWorth);
  const distressLine = -limit * 0.8;
  const recoveryLine = -limit * 0.5;
  const distressed = state.cash <= distressLine || currentNetWorth <= 0;
  let next = state;

  if (!distressed && state.bankruptcyDeadline && state.cash > recoveryLine && currentNetWorth > 0) next = { ...state, bankruptcyDeadline: 0 };
  if (distressed && !next.bankruptcyDeadline) next = { ...next, bankruptcyDeadline: now + BANKRUPTCY_WINDOW_MS };
  if (next.bankruptcyDeadline && now >= next.bankruptcyDeadline) next = { ...next, runStatus: 'bankrupt', bankruptcyDeadline: 0, updatedAt: now };
  return next;
}

export function bankruptcySecondsRemaining(state: GameState, now = Date.now()) {
  if (!state.bankruptcyDeadline) return 0;
  return Math.max(0, Math.ceil((state.bankruptcyDeadline - now) / 1000));
}
