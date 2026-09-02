import { activeEarnings } from '@/data/earnings';
import type { ActiveEarningDefinition, IncomeStreamDefinition } from './income-types';
import type { GameState } from './types';
import { canUnlockIncomeStream, incomeStreamUnitCost } from './systems/earnings';
import { gainLifeSkillXp, lifeMeetsSkill } from './systems/life-progression';

export function performActiveEarning(state: GameState, earning: ActiveEarningDefinition): GameState {
  if ((earning.unlockSpent ?? 0) > state.totalSpent) return state;
  if ((earning.requiredTownLevel ?? 0) > state.townLevel) return state;
  if ((earning.requiredRegionLevel ?? 0) > state.regionLevel) return state;
  if (!lifeMeetsSkill(state, earning.requiredSkillId, earning.requiredSkillLevel ?? 0)) return state;
  const life = earning.rewardSkillId && earning.rewardSkillXp
    ? gainLifeSkillXp(state.life, earning.rewardSkillId, earning.rewardSkillXp)
    : state.life;
  return {
    ...state,
    life,
    cash: state.cash + earning.payout,
    lifetimeIncome: state.lifetimeIncome + earning.payout,
    updatedAt: Date.now(),
  };
}

export function buyIncomeStream(state: GameState, stream: IncomeStreamDefinition): GameState {
  if (!canUnlockIncomeStream(state, stream)) return state;
  const cost = incomeStreamUnitCost(state, stream);
  if (state.cash < cost) return state;
  const owned = state.incomeStreams?.[stream.id] ?? 0;
  return {
    ...state,
    cash: state.cash - cost,
    totalSpent: state.totalSpent + cost,
    incomeStreams: { ...(state.incomeStreams ?? {}), [stream.id]: owned + 1 },
    updatedAt: Date.now(),
  };
}

export function activeEarningUnlocked(state: GameState, id: string) {
  const earning = activeEarnings.find((entry) => entry.id === id);
  if (!earning) return false;
  if ((earning.unlockSpent ?? 0) > state.totalSpent) return false;
  if ((earning.requiredTownLevel ?? 0) > state.townLevel) return false;
  if ((earning.requiredRegionLevel ?? 0) > state.regionLevel) return false;
  if (!lifeMeetsSkill(state, earning.requiredSkillId, earning.requiredSkillLevel ?? 0)) return false;
  return true;
}
