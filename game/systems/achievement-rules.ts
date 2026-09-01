import type { Achievement, GameState } from '../types';

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

export function achievementUnlockedByRule(state: GameState, achievement: Achievement, metrics: AchievementMetrics) {
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

  switch (achievement.condition) {
    case 'nothing-millionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000;
    case 'nothing-billionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000_000;
    case 'nothing-trillionaire': return state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000_000_000;
    case 'nothing-first-business': return state.scenarioId === 'nothing' && foundedBusinesses(state) >= 1;
    case 'nothing-first-home': return state.scenarioId === 'nothing' && state.houseLevel >= 1;
    case 'nothing-town': return state.scenarioId === 'nothing' && state.townLevel >= 1;
    case 'nothing-metropolis': return state.scenarioId === 'nothing' && state.townLevel >= 5;
    case 'nothing-planetary': return state.scenarioId === 'nothing' && state.regionLevel >= 5;
    case 'ten-x-win': return state.scenarioId === 'ten-x' && metrics.netWorth >= 1_000_000;
    case 'hundred-x-win': return state.scenarioId === 'hundred-x' && metrics.netWorth >= 10_000_000;
    case 'thousand-x-win': return state.scenarioId === 'thousand-x' && metrics.netWorth >= 100_000_000;
    case 'no-sales-millionaire': return state.scenarioId === 'nothing' && state.totalSold === 0 && metrics.netWorth >= 1_000_000;
    case 'debt-comeback': return state.riskMode && state.lowestCash < 0 && state.cash > 0 && metrics.netWorth > 0;
    case 'deep-debt-comeback': return state.riskMode && state.lowestCash <= -1_000_000 && state.cash > 0;
    case 'diversified': return ownedIncomeStreams(state) >= 1 && foundedBusinesses(state) >= 1 && Object.keys(state.owned ?? {}).some((id) => (state.owned[id] ?? 0) > 0);
    case 'all-businesses': return foundedBusinesses(state) >= 7;
    case 'positive-million-income': return state.cash > 0 && metrics.incomePerSecond >= 1_000_000;
    case 'exact-zero': return Math.abs(state.cash) < 0.01;
    case 'moon-and-metropolis': return (state.owned['moon-colony'] ?? 0) >= 1 && state.townLevel >= 5;
    case 'collector-cashflow': return metrics.totalOwned >= 1_000 && metrics.incomePerSecond >= 100_000;
    case 'risk-millionaire': return state.riskMode && metrics.netWorth >= 1_000_000;
    default: return false;
  }
}
