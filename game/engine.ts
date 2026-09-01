import { achievements, citySpecializations, empireUpgrades, houseTiers, items, regionTiers, scenarios, townTiers } from '@/data/content';
import { lokRuntime } from '@/integrations/lok/runtime';
import { Achievement, CitySpecializationId, EmpireUpgrade, GameItem, GameState, ScenarioId } from './types';
import { EVENT_INTERVAL_MS, getActiveMarketEvent, getEventMultipliers, updateMarketEventState } from './systems/market-events';
import { calculateOfflineIncome } from './systems/offline';
import { normalizeGameState } from './systems/save';
import { portfolioEconomics } from './systems/businesses';
import { advanceCityEconomy, cityEconomySnapshot, createCityEconomyState } from './systems/city-economy';
import { incomeStreamsPerSecond, incomeStreamValue } from './systems/earnings';
import { availableBuyingPower, canRiskSpend, debtInterestPerSecond, updateRiskState } from './systems/risk';
import { achievementUnlockedByRule } from './systems/achievement-rules';

export function newGame(scenarioId: ScenarioId, mode: GameState['mode'], riskMode = false): GameState {
  const scenario = scenarios.find((entry) => entry.id === scenarioId) ?? scenarios[0];
  const now = Date.now();
  return { started: true, scenarioId, mode, cash: scenario.startingCash, totalSpent: 0, totalSold: 0, lifetimeIncome: 0, owned: {}, incomeStreams: {}, businesses: {}, cityEconomy: createCityEconomyState(now), houseLevel: 0, townLevel: 0, regionLevel: 0, upgrades: {}, citySpecialization: null, activeEventId: null, eventEndsAt: 0, nextEventAt: now + EVENT_INTERVAL_MS, lastOfflineIncome: 0, riskMode, runStatus: 'active', bankruptcyDeadline: 0, peakCash: scenario.startingCash, peakNetWorth: scenario.startingCash, lowestCash: scenario.startingCash, lokTokens: 0, lokProgressMs: 0, theme: 'light', createdAt: now, updatedAt: now };
}

export function normalizeState(state: GameState): GameState { return normalizeGameState(state); }
export function itemUnitPrice(item: GameItem, owned: number) { return item.basePrice * Math.pow(item.growthRate, owned); }
export function itemBulkPrice(item: GameItem, owned: number, quantity: number) { if (quantity <= 0) return 0; if (item.growthRate === 1) return item.basePrice * quantity; return item.basePrice * Math.pow(item.growthRate, owned) * ((Math.pow(item.growthRate, quantity) - 1) / (item.growthRate - 1)); }

function upgradeIncomeMultiplier(state: GameState) { return empireUpgrades.reduce((multiplier, upgrade) => multiplier * (1 + (upgrade.incomeMultiplierPerLevel ?? 0) * (state.upgrades?.[upgrade.id] ?? 0)), 1); }
function upgradeUpkeepMultiplier(state: GameState) { return empireUpgrades.reduce((multiplier, upgrade) => multiplier * Math.max(0.25, 1 - (upgrade.upkeepReductionPerLevel ?? 0) * (state.upgrades?.[upgrade.id] ?? 0)), 1); }
function specializationMultipliers(state: GameState) { const spec = citySpecializations.find((entry) => entry.id === state.citySpecialization); return { income: spec?.incomeMultiplier ?? 1, upkeep: spec?.upkeepMultiplier ?? 1 }; }
export function activeMarketEvent(state: GameState) { return getActiveMarketEvent(state); }
function businessEnvironment(state: GameState) { const city = cityEconomySnapshot(state.cityEconomy, state.businesses ?? {}, state.townLevel); return { demandMultiplier: city.businessDemandMultiplier, laborCostMultiplier: city.laborCostMultiplier }; }

export function grossIncomePerSecond(state: GameState) {
  const assetBase = items.reduce((total, item) => total + (item.incomePerSecond ?? 0) * (state.owned[item.id] ?? 0), 0);
  const spec = specializationMultipliers(state), event = getEventMultipliers(state), businesses = portfolioEconomics(state.businesses ?? {}, businessEnvironment(state));
  return assetBase * upgradeIncomeMultiplier(state) * spec.income * event.income + businesses.revenuePerSecond + incomeStreamsPerSecond(state);
}

export function upkeepPerSecond(state: GameState) {
  const assetBase = state.mode === 'advanced' ? items.reduce((total, item) => total + (item.upkeepPerSecond ?? 0) * (state.owned[item.id] ?? 0), 0) : 0;
  const spec = specializationMultipliers(state), event = getEventMultipliers(state), businesses = portfolioEconomics(state.businesses ?? {}, businessEnvironment(state));
  return assetBase * upgradeUpkeepMultiplier(state) * spec.upkeep * event.upkeep + businesses.payrollPerSecond + businesses.operatingCostPerSecond + debtInterestPerSecond(state);
}

export function passiveCashPerSecond(state: GameState) { return state.runStatus === 'bankrupt' ? 0 : grossIncomePerSecond(state) - upkeepPerSecond(state); }
export function holdingsValue(state: GameState) { return items.reduce((total, item) => total + item.basePrice * (state.owned[item.id] ?? 0), 0); }
export function upgradesValue(state: GameState) { return empireUpgrades.reduce((total, upgrade) => { const level = state.upgrades?.[upgrade.id] ?? 0; let value = 0; for (let i = 0; i < level; i += 1) value += upgrade.baseCost * Math.pow(upgrade.growthRate, i); return total + value; }, 0); }
export function netWorth(state: GameState) { const homeValue = houseTiers.find((tier) => tier.level === state.houseLevel)?.cost ?? 0; const townValue = townTiers.find((tier) => tier.level === (state.townLevel ?? 0))?.cost ?? 0; const regionValue = regionTiers.find((tier) => tier.level === (state.regionLevel ?? 0))?.cost ?? 0; return state.cash + holdingsValue(state) + upgradesValue(state) + incomeStreamValue(state) + homeValue + townValue + regionValue; }

export function maxAffordableQuantity(state: GameState, item: GameItem) {
  if ((item.unlockSpent ?? 0) > state.totalSpent) return 0;
  const owned = state.owned[item.id] ?? 0;
  const budget = state.riskMode ? availableBuyingPower(state, netWorth(state)) : Math.max(0, state.cash);
  if (budget < itemUnitPrice(item, owned)) return 0;
  if (item.growthRate === 1) return Math.floor(budget / item.basePrice);
  const factor = 1 + (budget * (item.growthRate - 1)) / (item.basePrice * Math.pow(item.growthRate, owned));
  return Math.max(0, Math.floor(Math.log(factor) / Math.log(item.growthRate)));
}

export function canBuyItem(state: GameState, item: GameItem, quantity = 1) { if ((item.unlockSpent ?? 0) > state.totalSpent || state.runStatus !== 'active') return false; return canRiskSpend(state, itemBulkPrice(item, state.owned[item.id] ?? 0, quantity), netWorth(state)); }
export function buyItem(state: GameState, item: GameItem, quantity = 1): GameState { const owned = state.owned[item.id] ?? 0; const price = itemBulkPrice(item, owned, quantity); if (quantity <= 0 || (item.unlockSpent ?? 0) > state.totalSpent || !canRiskSpend(state, price, netWorth(state))) return state; return { ...state, cash: state.cash - price, totalSpent: state.totalSpent + price, owned: { ...state.owned, [item.id]: owned + quantity }, lowestCash: Math.min(state.lowestCash, state.cash - price), updatedAt: Date.now() }; }
export function sellItem(state: GameState, item: GameItem, quantity = 1): GameState { const owned = state.owned[item.id] ?? 0; const sold = Math.min(Math.max(0, quantity), owned); if (!sold || state.runStatus !== 'active') return state; const originalPrice = itemBulkPrice(item, owned - sold, sold); const refund = originalPrice * 0.7; return { ...state, cash: state.cash + refund, totalSold: state.totalSold + refund, owned: { ...state.owned, [item.id]: owned - sold }, updatedAt: Date.now() }; }
export function upgradeHouse(state: GameState): GameState { const next = houseTiers.find((tier) => tier.level === state.houseLevel + 1); if (!next || !canRiskSpend(state, next.cost, netWorth(state)) || netWorth(state) < next.requiredNetWorth) return state; const cash = state.cash - next.cost; return { ...state, cash, totalSpent: state.totalSpent + next.cost, houseLevel: next.level, lowestCash: Math.min(state.lowestCash, cash), updatedAt: Date.now() }; }
export function upgradeTown(state: GameState): GameState { if (state.houseLevel < 5) return state; const next = townTiers.find((tier) => tier.level === state.townLevel + 1); if (!next || !canRiskSpend(state, next.cost, netWorth(state)) || netWorth(state) < next.requiredNetWorth) return state; const cash = state.cash - next.cost; return { ...state, cash, totalSpent: state.totalSpent + next.cost, townLevel: next.level, lowestCash: Math.min(state.lowestCash, cash), updatedAt: Date.now() }; }
export function upgradeRegion(state: GameState): GameState { if (state.townLevel < 5) return state; const next = regionTiers.find((tier) => tier.level === state.regionLevel + 1); if (!next || !canRiskSpend(state, next.cost, netWorth(state)) || netWorth(state) < next.requiredNetWorth) return state; const cash = state.cash - next.cost; return { ...state, cash, totalSpent: state.totalSpent + next.cost, regionLevel: next.level, lowestCash: Math.min(state.lowestCash, cash), updatedAt: Date.now() }; }
export function upgradeCost(state: GameState, upgrade: EmpireUpgrade) { return upgrade.baseCost * Math.pow(upgrade.growthRate, state.upgrades?.[upgrade.id] ?? 0); }
export function canBuyUpgrade(state: GameState, upgrade: EmpireUpgrade) { const level = state.upgrades?.[upgrade.id] ?? 0; if (level >= upgrade.maxLevel || (upgrade.requiredTownLevel ?? 0) > state.townLevel || (upgrade.requiredRegionLevel ?? 0) > state.regionLevel || state.runStatus !== 'active') return false; return canRiskSpend(state, upgradeCost(state, upgrade), netWorth(state)); }
export function buyUpgrade(state: GameState, upgrade: EmpireUpgrade): GameState { if (!canBuyUpgrade(state, upgrade)) return state; const level = state.upgrades?.[upgrade.id] ?? 0, cost = upgradeCost(state, upgrade), cash = state.cash - cost; return { ...state, cash, totalSpent: state.totalSpent + cost, upgrades: { ...state.upgrades, [upgrade.id]: level + 1 }, lowestCash: Math.min(state.lowestCash, cash), updatedAt: Date.now() }; }
export function chooseCitySpecialization(state: GameState, specialization: CitySpecializationId): GameState { if (state.townLevel < 4 || state.citySpecialization || state.runStatus !== 'active') return state; return { ...state, citySpecialization: specialization, updatedAt: Date.now() }; }
export function totalOwned(state: GameState) { return Object.values(state.owned).reduce((sum, count) => sum + count, 0); }
export function unlockedAchievements(state: GameState): Achievement[] { const metrics = { netWorth: netWorth(state), incomePerSecond: passiveCashPerSecond(state), totalOwned: totalOwned(state) }; return achievements.filter((achievement) => achievementUnlockedByRule(state, achievement, metrics)); }
export function scenarioProgress(state: GameState) { const scenario = scenarios.find((entry) => entry.id === state.scenarioId) ?? scenarios[0]; if (scenario.freeMode) return 0; if (scenario.targetSpent) return Math.min(1, state.totalSpent / scenario.targetSpent); if (scenario.targetNetWorth) return Math.min(1, netWorth(state) / scenario.targetNetWorth); if (scenario.targetMultiplier && scenario.startingCash > 0) return Math.min(1, netWorth(state) / (scenario.startingCash * scenario.targetMultiplier)); return 0; }
export function applyOfflineProgress(state: GameState, now = Date.now()): GameState { const safeState = normalizeGameState(state, now); if (safeState.riskMode || safeState.runStatus !== 'active') return { ...safeState, lastOfflineIncome: 0 }; const offline = calculateOfflineIncome(safeState, passiveCashPerSecond, now); if (offline.income <= 0) return { ...safeState, lastOfflineIncome: 0 }; const cash = safeState.cash + offline.income; return { ...safeState, cash, lifetimeIncome: safeState.lifetimeIncome + offline.income, peakCash: Math.max(safeState.peakCash, cash), lastOfflineIncome: offline.income, updatedAt: now }; }
export function advance(state: GameState, deltaMs: number): GameState {
  let safeState = normalizeGameState(state);
  if (safeState.runStatus !== 'active') return safeState;
  const now = Date.now();
  safeState = updateMarketEventState(safeState, now);
  safeState = { ...safeState, cityEconomy: advanceCityEconomy(safeState.cityEconomy, safeState.businesses ?? {}, safeState.townLevel, deltaMs) };
  const income = passiveCashPerSecond(safeState) * (deltaMs / 1000);
  const lok = lokRuntime.accrue(safeState.lokTokens, safeState.lokProgressMs, deltaMs);
  const cash = safeState.cash + income;
  let next = { ...safeState, cash, lifetimeIncome: safeState.lifetimeIncome + Math.max(0, income), lokTokens: lok.balance, lokProgressMs: lok.progressMs, lastOfflineIncome: 0, lowestCash: Math.min(safeState.lowestCash, cash), updatedAt: now };
  const worth = netWorth(next);
  next = { ...next, peakCash: Math.max(next.peakCash, next.cash), peakNetWorth: Math.max(next.peakNetWorth, worth) };
  return updateRiskState(next, worth, now);
}
