import { empireUpgrades, items } from '@/data/content';
import type { Achievement, GameState } from '../types';

export const ELON_GAME_BENCHMARK = 2_000_000_000_000;
export const SPENDUTALL_SUPER_THRESHOLD = ELON_GAME_BENCHMARK * 100;

export type AchievementMetrics = {
  netWorth: number;
  incomePerSecond: number;
  totalOwned: number;
};

function foundedBusinesses(state: GameState) {
  return Object.values(state.businesses ?? {}).filter((business) => business.founded).length;
}

function ownedIncomeStreams(state: GameState) {
  return Object.values(state.incomeStreams ?? {}).reduce((total, count) => total + count, 0);
}

function elapsedMs(state: GameState, now: number) {
  return Math.max(0, now - state.createdAt);
}

function ownsMarketplaceAsset(state: GameState) {
  return items.some((item) => (state.owned?.[item.id] ?? 0) > 0);
}

function ownsOneOfEverything(state: GameState) {
  return items.every((item) => (state.owned?.[item.id] ?? 0) >= 1);
}

function allEmpireUpgradesMaxed(state: GameState) {
  return empireUpgrades.every((upgrade) => (state.upgrades?.[upgrade.id] ?? 0) >= upgrade.maxLevel);
}

export function achievementUnlockedByRule(state: GameState, achievement: Achievement, metrics: AchievementMetrics, now = Date.now()) {
  if (state.runAchievements?.[achievement.id]) return true;
  if (achievement.scenarioOnly?.length && !achievement.scenarioOnly.includes(state.scenarioId)) return false;

  if (achievement.kind === 'spent') return state.totalSpent >= achievement.threshold;
  if (achievement.kind === 'netWorth') return metrics.netWorth >= achievement.threshold;
  if (achievement.kind === 'income') return metrics.incomePerSecond >= achievement.threshold;
  if (achievement.kind === 'house') return state.houseLevel >= achievement.threshold;
  if (achievement.kind === 'town') return state.townLevel >= achievement.threshold;
  if (achievement.kind === 'region') return state.regionLevel >= achievement.threshold;
  if (achievement.kind === 'collection') return metrics.totalOwned >= achievement.threshold;
  if (achievement.kind === 'cash') return state.cash >= achievement.threshold;
  if (achievement.kind === 'lifetimeIncome') return state.lifetimeIncome >= achievement.threshold;
  if (achievement.kind === 'businesses') return foundedBusinesses(state) >= achievement.threshold;
  if (achievement.kind === 'incomeStreams') return ownedIncomeStreams(state) >= achievement.threshold;

  const elapsed = elapsedMs(state, now);
  const businesses = foundedBusinesses(state);
  const streams = ownedIncomeStreams(state);

  switch (achievement.condition) {
    case 'nothing-millionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000;
    case 'nothing-billionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000_000;
    case 'nothing-trillionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000_000_000;
    case 'nothing-first-business': return state.scenarioId === 'nothing' && businesses >= 1;
    case 'nothing-first-home': return state.scenarioId === 'nothing' && state.houseLevel >= 1;
    case 'nothing-town': return state.scenarioId === 'nothing' && state.townLevel >= 1;
    case 'nothing-metropolis': return state.scenarioId === 'nothing' && state.townLevel >= 5;
    case 'nothing-planetary': return state.scenarioId === 'nothing' && state.regionLevel >= 5;
    case 'planetary-from-nothing': return state.scenarioId === 'nothing' && state.regionLevel >= 5;

    case 'ten-x-win': return state.scenarioId === 'ten-x' && metrics.netWorth >= 1_000_000;
    case 'hundred-x-win': return state.scenarioId === 'hundred-x' && metrics.netWorth >= 10_000_000;
    case 'thousand-x-win': return state.scenarioId === 'thousand-x' && metrics.netWorth >= 100_000_000;
    case 'risk-100x-win': return state.scenarioId === 'hundred-x' && state.riskMode && metrics.netWorth >= 10_000_000;
    case 'risk-1000x-win': return state.scenarioId === 'thousand-x' && state.riskMode && metrics.netWorth >= 100_000_000;

    case 'nothing-million-speed-10m': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000 && elapsed <= 10 * 60_000;
    case 'nothing-million-speed-5m': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000 && elapsed <= 5 * 60_000;
    case 'nothing-million-speed-2m': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000 && elapsed <= 2 * 60_000;
    case 'billion-speed-30m': return metrics.netWorth >= 1_000_000_000 && elapsed <= 30 * 60_000;
    case 'town-speed-15m': return state.townLevel >= 1 && elapsed <= 15 * 60_000;
    case 'metropolis-speed-60m': return state.townLevel >= 5 && elapsed <= 60 * 60_000;

    case 'wolf-first-billion': return businesses >= 1 && metrics.netWorth >= 1_000_000_000;
    case 'wolf-three-businesses': return businesses >= 3 && metrics.netWorth >= 100_000_000;
    case 'wolf-million-income': return businesses >= 1 && metrics.incomePerSecond >= 1_000_000;
    case 'wolf-market-master': return businesses >= 7 && metrics.netWorth >= 10_000_000_000;
    case 'wolf-risk-billionaire': return state.riskMode && businesses >= 3 && metrics.netWorth >= 1_000_000_000;

    case 'debt-comeback': return state.riskMode && state.lowestCash < 0 && state.cash > 0 && metrics.netWorth > 0;
    case 'debt-10k-comeback': return state.riskMode && state.lowestCash <= -10_000 && state.cash > 0;
    case 'debt-1m-comeback':
    case 'deep-debt-comeback': return state.riskMode && state.lowestCash <= -1_000_000 && state.cash > 0;
    case 'debt-100m-comeback': return state.riskMode && state.lowestCash <= -100_000_000 && state.cash > 0;
    case 'debt-billion-comeback': return state.riskMode && state.lowestCash <= -1_000_000_000 && state.cash > 0;
    case 'near-bankruptcy-comeback': return state.riskMode && (state.bankruptcyWarnings ?? 0) > 0 && state.bankruptcyDeadline === 0 && state.cash > 0 && state.runStatus === 'active';

    case 'diversified': return streams >= 1 && businesses >= 1 && ownsMarketplaceAsset(state);
    case 'all-businesses': return businesses >= 7;
    case 'positive-million-income': return state.cash > 0 && metrics.incomePerSecond >= 1_000_000;
    case 'exact-zero': return Math.abs(state.cash) < 0.01;
    case 'moon-and-metropolis': return (state.owned['moon-colony'] ?? 0) >= 1 && state.townLevel >= 5;
    case 'collector-cashflow': return metrics.totalOwned >= 1_000 && metrics.incomePerSecond >= 100_000;
    case 'risk-millionaire': return state.riskMode && metrics.netWorth >= 1_000_000;
    case 'no-sales-millionaire': return state.scenarioId === 'nothing' && state.totalSold === 0 && metrics.netWorth >= 1_000_000;
    case 'no-sales-billionaire': return state.scenarioId === 'nothing' && state.totalSold === 0 && metrics.netWorth >= 1_000_000_000;
    case 'nothing-no-passive-millionaire': return state.scenarioId === 'nothing' && streams === 0 && metrics.netWorth >= 1_000_000;
    case 'nothing-active-100k': return state.scenarioId === 'nothing' && streams === 0 && state.lifetimeIncome >= 100_000;

    case 'one-of-everything': return ownsOneOfEverything(state);
    case 'coffee-million': return (state.owned['coffee'] ?? 0) >= 1_000_000;
    case 'all-upgrades-max': return allEmpireUpgradesMaxed(state);
    case 'spend-elon-benchmark': return state.totalSpent >= ELON_GAME_BENCHMARK;
    case 'spendutall-super': return state.totalSpent >= SPENDUTALL_SUPER_THRESHOLD;
    default: return false;
  }
}

export function syncAchievementUnlocks(state: GameState, definitions: Achievement[], metrics: AchievementMetrics, now = Date.now()): GameState {
  const current = state.runAchievements ?? {};
  let changed = false;
  const next = { ...current };
  for (const achievement of definitions) {
    if (next[achievement.id]) continue;
    if (!achievementUnlockedByRule(state, achievement, metrics, now)) continue;
    next[achievement.id] = now;
    changed = true;
  }
  return changed ? { ...state, runAchievements: next } : state;
}
