import { houseTiers, items, scenarios } from '@/data/content';
import { lokRuntime } from '@/integrations/lok/runtime';
import { GameItem, GameState, ScenarioId } from './types';

export function newGame(scenarioId: ScenarioId, mode: GameState['mode']): GameState {
  const scenario = scenarios.find((entry) => entry.id === scenarioId) ?? scenarios[0];
  const now = Date.now();
  return {
    started: true,
    scenarioId,
    mode,
    cash: scenario.startingCash,
    totalSpent: 0,
    lifetimeIncome: 0,
    owned: {},
    houseLevel: 0,
    lokTokens: 0,
    lokProgressMs: 0,
    theme: 'light',
    createdAt: now,
    updatedAt: now,
  };
}

export function itemUnitPrice(item: GameItem, owned: number) {
  return item.basePrice * Math.pow(item.growthRate, owned);
}

export function itemBulkPrice(item: GameItem, owned: number, quantity: number) {
  if (item.growthRate === 1) return item.basePrice * quantity;
  return item.basePrice * Math.pow(item.growthRate, owned) * ((Math.pow(item.growthRate, quantity) - 1) / (item.growthRate - 1));
}

export function passiveCashPerSecond(state: GameState) {
  return items.reduce((total, item) => {
    const count = state.owned[item.id] ?? 0;
    const gross = (item.incomePerSecond ?? 0) * count;
    const upkeep = state.mode === 'advanced' ? (item.upkeepPerSecond ?? 0) * count : 0;
    return total + gross - upkeep;
  }, 0);
}

export function netWorth(state: GameState) {
  const holdings = items.reduce((total, item) => total + item.basePrice * (state.owned[item.id] ?? 0), 0);
  const homeValue = houseTiers.find((tier) => tier.level === state.houseLevel)?.cost ?? 0;
  return state.cash + holdings + homeValue;
}

export function canBuyItem(state: GameState, item: GameItem, quantity = 1) {
  if ((item.unlockSpent ?? 0) > state.totalSpent) return false;
  return state.cash >= itemBulkPrice(item, state.owned[item.id] ?? 0, quantity);
}

export function buyItem(state: GameState, item: GameItem, quantity = 1): GameState {
  const owned = state.owned[item.id] ?? 0;
  const price = itemBulkPrice(item, owned, quantity);
  if ((item.unlockSpent ?? 0) > state.totalSpent || state.cash < price) return state;
  return { ...state, cash: state.cash - price, totalSpent: state.totalSpent + price, owned: { ...state.owned, [item.id]: owned + quantity }, updatedAt: Date.now() };
}

export function upgradeHouse(state: GameState): GameState {
  const next = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, houseLevel: next.level, updatedAt: Date.now() };
}

export function advance(state: GameState, deltaMs: number): GameState {
  const seconds = deltaMs / 1000;
  const income = passiveCashPerSecond(state) * seconds;
  const lok = lokRuntime.accrue(state.lokTokens, state.lokProgressMs, deltaMs);

  return {
    ...state,
    cash: state.cash + income,
    lifetimeIncome: state.lifetimeIncome + Math.max(0, income),
    lokTokens: lok.balance,
    lokProgressMs: lok.progressMs,
    updatedAt: Date.now(),
  };
}
