import { achievements, houseTiers, items, scenarios, townTiers } from '@/data/content';
import { lokRuntime } from '@/integrations/lok/runtime';
import { Achievement, GameItem, GameState, ScenarioId } from './types';

export function newGame(scenarioId: ScenarioId, mode: GameState['mode']): GameState {
  const scenario = scenarios.find((entry) => entry.id === scenarioId) ?? scenarios[0];
  const now = Date.now();
  return {
    started: true,
    scenarioId,
    mode,
    cash: scenario.startingCash,
    totalSpent: 0,
    totalSold: 0,
    lifetimeIncome: 0,
    owned: {},
    houseLevel: 0,
    townLevel: 0,
    lokTokens: 0,
    lokProgressMs: 0,
    theme: 'light',
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeState(state: GameState): GameState {
  return {
    ...state,
    totalSold: state.totalSold ?? 0,
    townLevel: state.townLevel ?? 0,
  };
}

export function itemUnitPrice(item: GameItem, owned: number) {
  return item.basePrice * Math.pow(item.growthRate, owned);
}

export function itemBulkPrice(item: GameItem, owned: number, quantity: number) {
  if (quantity <= 0) return 0;
  if (item.growthRate === 1) return item.basePrice * quantity;
  return item.basePrice * Math.pow(item.growthRate, owned) * ((Math.pow(item.growthRate, quantity) - 1) / (item.growthRate - 1));
}

export function maxAffordableQuantity(state: GameState, item: GameItem) {
  if ((item.unlockSpent ?? 0) > state.totalSpent || state.cash < itemUnitPrice(item, state.owned[item.id] ?? 0)) return 0;
  const owned = state.owned[item.id] ?? 0;
  if (item.growthRate === 1) return Math.floor(state.cash / item.basePrice);

  const factor = 1 + (state.cash * (item.growthRate - 1)) / (item.basePrice * Math.pow(item.growthRate, owned));
  return Math.max(0, Math.floor(Math.log(factor) / Math.log(item.growthRate)));
}

export function grossIncomePerSecond(state: GameState) {
  return items.reduce((total, item) => total + (item.incomePerSecond ?? 0) * (state.owned[item.id] ?? 0), 0);
}

export function upkeepPerSecond(state: GameState) {
  if (state.mode !== 'advanced') return 0;
  return items.reduce((total, item) => total + (item.upkeepPerSecond ?? 0) * (state.owned[item.id] ?? 0), 0);
}

export function passiveCashPerSecond(state: GameState) {
  return grossIncomePerSecond(state) - upkeepPerSecond(state);
}

export function holdingsValue(state: GameState) {
  return items.reduce((total, item) => total + item.basePrice * (state.owned[item.id] ?? 0), 0);
}

export function netWorth(state: GameState) {
  const homeValue = houseTiers.find((tier) => tier.level === state.houseLevel)?.cost ?? 0;
  const townValue = townTiers.find((tier) => tier.level === (state.townLevel ?? 0))?.cost ?? 0;
  return state.cash + holdingsValue(state) + homeValue + townValue;
}

export function canBuyItem(state: GameState, item: GameItem, quantity = 1) {
  if ((item.unlockSpent ?? 0) > state.totalSpent) return false;
  return state.cash >= itemBulkPrice(item, state.owned[item.id] ?? 0, quantity);
}

export function buyItem(state: GameState, item: GameItem, quantity = 1): GameState {
  const owned = state.owned[item.id] ?? 0;
  const price = itemBulkPrice(item, owned, quantity);
  if (quantity <= 0 || (item.unlockSpent ?? 0) > state.totalSpent || state.cash < price) return state;
  return { ...state, cash: state.cash - price, totalSpent: state.totalSpent + price, owned: { ...state.owned, [item.id]: owned + quantity }, updatedAt: Date.now() };
}

export function sellItem(state: GameState, item: GameItem, quantity = 1): GameState {
  const owned = state.owned[item.id] ?? 0;
  const sold = Math.min(Math.max(0, quantity), owned);
  if (!sold) return state;
  const originalPrice = itemBulkPrice(item, owned - sold, sold);
  const refund = originalPrice * 0.7;
  return {
    ...state,
    cash: state.cash + refund,
    totalSold: (state.totalSold ?? 0) + refund,
    owned: { ...state.owned, [item.id]: owned - sold },
    updatedAt: Date.now(),
  };
}

export function upgradeHouse(state: GameState): GameState {
  const next = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, houseLevel: next.level, updatedAt: Date.now() };
}

export function upgradeTown(state: GameState): GameState {
  if (state.houseLevel < 5) return state;
  const level = state.townLevel ?? 0;
  const next = townTiers.find((tier) => tier.level === level + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, townLevel: next.level, updatedAt: Date.now() };
}

export function totalOwned(state: GameState) {
  return Object.values(state.owned).reduce((sum, count) => sum + count, 0);
}

export function unlockedAchievements(state: GameState): Achievement[] {
  const worth = netWorth(state);
  const income = passiveCashPerSecond(state);
  const collection = totalOwned(state);
  return achievements.filter((achievement) => {
    if (achievement.kind === 'spent') return state.totalSpent >= achievement.threshold;
    if (achievement.kind === 'netWorth') return worth >= achievement.threshold;
    if (achievement.kind === 'income') return income >= achievement.threshold;
    if (achievement.kind === 'house') return state.houseLevel >= achievement.threshold;
    if (achievement.kind === 'town') return (state.townLevel ?? 0) >= achievement.threshold;
    return collection >= achievement.threshold;
  });
}

export function scenarioProgress(state: GameState) {
  const scenario = scenarios.find((entry) => entry.id === state.scenarioId) ?? scenarios[0];
  if (scenario.targetSpent) return Math.min(1, state.totalSpent / scenario.targetSpent);
  if (scenario.targetNetWorth) return Math.min(1, netWorth(state) / scenario.targetNetWorth);
  return 0;
}

export function advance(state: GameState, deltaMs: number): GameState {
  const safeState = normalizeState(state);
  const seconds = deltaMs / 1000;
  const income = passiveCashPerSecond(safeState) * seconds;
  const lok = lokRuntime.accrue(safeState.lokTokens, safeState.lokProgressMs, deltaMs);

  return {
    ...safeState,
    cash: safeState.cash + income,
    lifetimeIncome: safeState.lifetimeIncome + Math.max(0, income),
    lokTokens: lok.balance,
    lokProgressMs: lok.progressMs,
    updatedAt: Date.now(),
  };
}
