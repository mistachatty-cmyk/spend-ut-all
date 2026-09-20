import type { GameState } from './types';
import {
  normalizeFameState,
  getFameTier,
  PR_ACTIONS,
  CELEBRITY_IMMIGRANTS,
  MAGAZINE_COVERS,
} from './systems/fame';

export function addFame(state: GameState, amount: number, now = Date.now()): GameState {
  if (amount <= 0) return state;
  const currentFame = normalizeFameState(state.fame);
  const nextPoints = currentFame.points + amount;
  const totalEarned = currentFame.totalEarned + amount;

  // Check newly unlocked magazine covers
  const currentCovers = new Set(currentFame.unlockedCovers);
  for (const mag of MAGAZINE_COVERS) {
    if (nextPoints >= mag.requiredFame && !currentCovers.has(mag.id)) {
      currentCovers.add(mag.id);
    }
  }

  // Check newly eligible celebrities
  const currentCelebrities = new Set(currentFame.celebrityResidents);
  for (const celeb of CELEBRITY_IMMIGRANTS) {
    if (nextPoints >= celeb.requiredFame && !currentCelebrities.has(celeb.id)) {
      currentCelebrities.add(celeb.id);
    }
  }

  return {
    ...state,
    fame: {
      ...currentFame,
      points: nextPoints,
      totalEarned,
      unlockedCovers: Array.from(currentCovers),
      celebrityResidents: Array.from(currentCelebrities),
    },
    updatedAt: now,
  };
}

export function executePRAction(
  state: GameState,
  actionId: string,
  now = Date.now(),
): { state: GameState; success: boolean; message: string } {
  const currentFame = normalizeFameState(state.fame);
  const action = PR_ACTIONS.find((a) => a.id === actionId);

  if (!action) {
    return { state, success: false, message: 'PR Action not found' };
  }

  const tier = getFameTier(currentFame.points);
  if (tier.level < action.minTier) {
    return { state, success: false, message: `Requires Fame Tier ${action.minTier}` };
  }

  if (state.cash < action.cost) {
    return { state, success: false, message: 'Insufficient funds for this PR stunt' };
  }

  const lastUsed = currentFame.prCooldowns[action.id] ?? 0;
  if (now - lastUsed < action.cooldownMs) {
    const remainingSec = Math.ceil((action.cooldownMs - (now - lastUsed)) / 1000);
    return { state, success: false, message: `PR Action on cooldown (${remainingSec}s)` };
  }

  const updatedCooldowns = { ...currentFame.prCooldowns, [action.id]: now };
  const updatedGoodwill = Math.min(
    100,
    (state.cityEconomy?.communityGoodwill ?? 50) + action.townGoodwillReward,
  );

  const updatedCityEconomy = state.cityEconomy
    ? {
        ...state.cityEconomy,
        communityGoodwill: updatedGoodwill,
        immigrationLog: [
          {
            id: `pr-${now}`,
            timestamp: now,
            count: 0,
            message: `Media sensation! "${action.name}" broadcast to millions, elevating town prestige.`,
          },
          ...state.cityEconomy.immigrationLog,
        ],
      }
    : state.cityEconomy;

  const baseState: GameState = {
    ...state,
    cash: state.cash - action.cost,
    totalSpent: state.totalSpent + action.cost,
    lowestCash: Math.min(state.lowestCash, state.cash - action.cost),
    cityEconomy: updatedCityEconomy,
    fame: {
      ...currentFame,
      prCooldowns: updatedCooldowns,
    },
    updatedAt: now,
  };

  const finalState = addFame(baseState, action.fameReward, now);

  return {
    state: finalState,
    success: true,
    message: `Executed "${action.name}"! Gained +${action.fameReward.toLocaleString()} Fame Points!`,
  };
}
