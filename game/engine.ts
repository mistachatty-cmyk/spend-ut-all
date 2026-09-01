import { achievements, citySpecializations, empireUpgrades, houseTiers, items, regionTiers, scenarios, townTiers } from '@/data/content';
import { lokRuntime } from '@/integrations/lok/runtime';
import { Achievement, CitySpecializationId, EmpireUpgrade, GameItem, GameState, ScenarioId } from './types';
import { EVENT_INTERVAL_MS, getActiveMarketEvent, getEventMultipliers, updateMarketEventState } from './systems/market-events';
import { calculateOfflineIncome } from './systems/offline';
import { normalizeGameState } from './systems/save';

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
    regionLevel: 0,
    upgrades: {},
    citySpecialization: null,
    activeEventId: null,
    eventEndsAt: 0,
    nextEventAt: now + EVENT_INTERVAL_MS,
    lastOfflineIncome: 0,
    lokTokens: 0,
    lokProgressMs: 0,
    theme: 'light',
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeState(state: GameState): GameState {
  return normalizeGameState(state);
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

function upgradeIncomeMultiplier(state: GameState) {
  return empireUpgrades.reduce((multiplier, upgrade) => {
    const level = state.upgrades?.[upgrade.id] ?? 0;
    return multiplier * (1 + (upgrade.incomeMultiplierPerLevel ?? 0) * level);
  }, 1);
}

function upgradeUpkeepMultiplier(state: GameState) {
  return empireUpgrades.reduce((multiplier, upgrade) => {
    const level = state.upgrades?.[upgrade.id] ?? 0;
    return multiplier * Math.max(0.25, 1 - (upgrade.upkeepReductionPerLevel ?? 0) * level);
  }, 1);
}

function specializationMultipliers(state: GameState) {
  const spec = citySpecializations.find((entry) => entry.id === state.citySpecialization);
  return { income: spec?.incomeMultiplier ?? 1, upkeep: spec?.upkeepMultiplier ?? 1 };
}

export function activeMarketEvent(state: GameState) {
  return getActiveMarketEvent(state);
}

export function grossIncomePerSecond(state: GameState) {
  const base = items.reduce((total, item) => total + (item.incomePerSecond ?? 0) * (state.owned[item.id] ?? 0), 0);
  const spec = specializationMultipliers(state);
  const event = getEventMultipliers(state);
  return base * upgradeIncomeMultiplier(state) * spec.income * event.income;
}

export function upkeepPerSecond(state: GameState) {
  if (state.mode !== 'advanced') return 0;
  const base = items.reduce((total, item) => total + (item.upkeepPerSecond ?? 0) * (state.owned[item.id] ?? 0), 0);
  const spec = specializationMultipliers(state);
  const event = getEventMultipliers(state);
  return base * upgradeUpkeepMultiplier(state) * spec.upkeep * event.upkeep;
}

export function passiveCashPerSecond(state: GameState) {
  return grossIncomePerSecond(state) - upkeepPerSecond(state);
}

export function holdingsValue(state: GameState) {
  return items.reduce((total, item) => total + item.basePrice * (state.owned[item.id] ?? 0), 0);
}

export function upgradesValue(state: GameState) {
  return empireUpgrades.reduce((total, upgrade) => {
    const level = state.upgrades?.[upgrade.id] ?? 0;
    let value = 0;
    for (let i = 0; i < level; i += 1) value += upgrade.baseCost * Math.pow(upgrade.growthRate, i);
    return total + value;
  }, 0);
}

export function netWorth(state: GameState) {
  const homeValue = houseTiers.find((tier) => tier.level === state.houseLevel)?.cost ?? 0;
  const townValue = townTiers.find((tier) => tier.level === (state.townLevel ?? 0))?.cost ?? 0;
  const regionValue = regionTiers.find((tier) => tier.level === (state.regionLevel ?? 0))?.cost ?? 0;
  return state.cash + holdingsValue(state) + upgradesValue(state) + homeValue + townValue + regionValue;
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
  return { ...state, cash: state.cash + refund, totalSold: state.totalSold + refund, owned: { ...state.owned, [item.id]: owned - sold }, updatedAt: Date.now() };
}

export function upgradeHouse(state: GameState): GameState {
  const next = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, houseLevel: next.level, updatedAt: Date.now() };
}

export function upgradeTown(state: GameState): GameState {
  if (state.houseLevel < 5) return state;
  const next = townTiers.find((tier) => tier.level === state.townLevel + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, townLevel: next.level, updatedAt: Date.now() };
}

export function upgradeRegion(state: GameState): GameState {
  if (state.townLevel < 5) return state;
  const next = regionTiers.find((tier) => tier.level === state.regionLevel + 1);
  if (!next || state.cash < next.cost || netWorth(state) < next.requiredNetWorth) return state;
  return { ...state, cash: state.cash - next.cost, totalSpent: state.totalSpent + next.cost, regionLevel: next.level, updatedAt: Date.now() };
}

export function upgradeCost(state: GameState, upgrade: EmpireUpgrade) {
  const level = state.upgrades?.[upgrade.id] ?? 0;
  return upgrade.baseCost * Math.pow(upgrade.growthRate, level);
}

export function canBuyUpgrade(state: GameState, upgrade: EmpireUpgrade) {
  const level = state.upgrades?.[upgrade.id] ?? 0;
  if (level >= upgrade.maxLevel) return false;
  if ((upgrade.requiredTownLevel ?? 0) > state.townLevel) return false;
  if ((upgrade.requiredRegionLevel ?? 0) > state.regionLevel) return false;
  return state.cash >= upgradeCost(state, upgrade);
}

export function buyUpgrade(state: GameState, upgrade: EmpireUpgrade): GameState {
  if (!canBuyUpgrade(state, upgrade)) return state;
  const level = state.upgrades?.[upgrade.id] ?? 0;
  const cost = upgradeCost(state, upgrade);
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, upgrades: { ...state.upgrades, [upgrade.id]: level + 1 }, updatedAt: Date.now() };
}

export function chooseCitySpecialization(state: GameState, specialization: CitySpecializationId): GameState {
  if (state.townLevel < 4 || state.citySpecialization) return state;
  return { ...state, citySpecialization: specialization, updatedAt: Date.now() };
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
    if (achievement.kind === 'town') return state.townLevel >= achievement.threshold;
    if (achievement.kind === 'region') return state.regionLevel >= achievement.threshold;
    return collection >= achievement.threshold;
  });
}

export function scenarioProgress(state: GameState) {
  const scenario = scenarios.find((entry) => entry.id === state.scenarioId) ?? scenarios[0];
  if (scenario.targetSpent) return Math.min(1, state.totalSpent / scenario.targetSpent);
  if (scenario.targetNetWorth) return Math.min(1, netWorth(state) / scenario.targetNetWorth);
  return 0;
}

export function applyOfflineProgress(state: GameState, now = Date.now()): GameState {
  const safeState = normalizeGameState(state, now);
  const offline = calculateOfflineIncome(safeState, passiveCashPerSecond, now);
  if (offline.income <= 0) return { ...safeState, lastOfflineIncome: 0 };
  return {
    ...safeState,
    cash: safeState.cash + offline.income,
    lifetimeIncome: safeState.lifetimeIncome + offline.income,
    lastOfflineIncome: offline.income,
    updatedAt: now,
  };
}

export function advance(state: GameState, deltaMs: number): GameState {
  let safeState = normalizeGameState(state);
  const now = Date.now();
  safeState = updateMarketEventState(safeState, now);
  const seconds = deltaMs / 1000;
  const income = passiveCashPerSecond(safeState) * seconds;
  const lok = lokRuntime.accrue(safeState.lokTokens, safeState.lokProgressMs, deltaMs);
  return {
    ...safeState,
    cash: safeState.cash + income,
    lifetimeIncome: safeState.lifetimeIncome + Math.max(0, income),
    lokTokens: lok.balance,
    lokProgressMs: lok.progressMs,
    lastOfflineIncome: 0,
    updatedAt: now,
  };
}
