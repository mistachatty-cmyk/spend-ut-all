import { scenarios } from '@/data/content';
import { advance, canSellItem, netWorth, scenarioProgress, sellItem } from './engine';
import type { GameItem, GameState } from './types';
import { advanceDebtState, debtSummary, isItemPledged, normalizeDebtState } from './systems/debt';

export function leveragedNetWorth(state: GameState) {
  return netWorth(state) - debtSummary(normalizeDebtState(state.debt)).totalDebt;
}

export function advanceWithDebt(state: GameState, deltaMs: number): GameState {
  const previousGameMinute = state.time.gameMinute;
  let next = advance(state, deltaMs);
  const result = advanceDebtState(normalizeDebtState(next.debt), previousGameMinute, next.time.gameMinute);
  let owned = next.owned;
  if (result.seized.length) {
    owned = { ...next.owned };
    for (const collateral of result.seized) owned[collateral.itemId] = Math.max(0, (owned[collateral.itemId] ?? 0) - collateral.quantity);
  }
  next = { ...next, debt: result.debt, owned, updatedAt: Date.now() };
  return next;
}

export function canSellItemWithDebt(state: GameState, item: GameItem) {
  return canSellItem(state, item) && !isItemPledged(normalizeDebtState(state.debt), item.id);
}

export function sellItemWithDebt(state: GameState, item: GameItem, quantity = 1) {
  return canSellItemWithDebt(state, item) ? sellItem(state, item, quantity) : state;
}

export function scenarioProgressWithDebt(state: GameState) {
  const worth = leveragedNetWorth(state);
  if (state.scenarioId === 'custom' && state.customScenario) {
    const { winCondition, startingCash } = state.customScenario;
    const target = Math.max(0.0001, winCondition.target);
    if (winCondition.type === 'net-worth') return Math.min(1, Math.max(0, worth) / target);
    if (winCondition.type === 'wealth-multiplier') return startingCash > 0 ? Math.min(1, Math.max(0, worth) / (startingCash * target)) : 0;
    return scenarioProgress(state);
  }
  const scenario = scenarios.find((entry) => entry.id === state.scenarioId);
  if (!scenario || scenario.freeMode) return scenarioProgress(state);
  const modifier = state.rules.progression.scenarioGoalMultiplier;
  if (scenario.targetNetWorth) return Math.min(1, Math.max(0, worth) / (scenario.targetNetWorth * modifier));
  if (scenario.targetMultiplier && scenario.startingCash > 0) return Math.min(1, Math.max(0, worth) / (scenario.startingCash * scenario.targetMultiplier * modifier));
  return scenarioProgress(state);
}
