import type { GameState } from './types';
import { createForbesListState, normalizeForbesListState } from './systems/forbes-list';

function forbesOf(state: GameState) {
  return normalizeForbesListState(state.forbesList);
}

export function setForbesListSystemEnabled(state: GameState, enabled: boolean, now = Date.now()): GameState {
  const current = forbesOf(state);
  if (enabled && current.enabled) return state;
  if (!enabled) return { ...state, forbesList: { ...current, enabled: false }, updatedAt: now };
  // Re-enabling restarts the rivalry roster fresh so a long-idle rival field doesn't feel stale.
  return { ...state, forbesList: { ...createForbesListState(now), enabled: true }, updatedAt: now };
}
