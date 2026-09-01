import type { BusinessPortfolio } from './business-types';
import type { CityEconomyState } from './city-types';

export type FinancialMode = 'simple' | 'advanced';
export type ScenarioId = 'nothing' | 'freeplay' | 'ten-x' | 'hundred-x' | 'thousand-x' | 'billionaire' | 'trillionaire';
export type ItemCategory = 'everyday' | 'luxury' | 'property' | 'business' | 'infrastructure';
export type CitySpecializationId = 'finance' | 'technology' | 'industrial' | 'tourism';
export type RunStatus = 'active' | 'bankrupt';
export type AchievementKind = 'spent' | 'netWorth' | 'income' | 'house' | 'town' | 'region' | 'collection' | 'cash' | 'lifetimeIncome' | 'businesses' | 'incomeStreams' | 'combo';
export type AchievementCategory = 'wealth' | 'speedrunner' | 'wolf-boss' | 'comeback' | 'spending' | 'income' | 'business' | 'empire' | 'collection' | 'risk' | 'scenario' | 'secret';
export type AchievementConditionId =
  | 'nothing-millionaire' | 'nothing-billionaire' | 'nothing-trillionaire' | 'nothing-first-business' | 'nothing-first-home' | 'nothing-town' | 'nothing-metropolis' | 'nothing-planetary'
  | 'ten-x-win' | 'hundred-x-win' | 'thousand-x-win' | 'no-sales-millionaire' | 'debt-comeback' | 'deep-debt-comeback' | 'diversified' | 'all-businesses'
  | 'positive-million-income' | 'exact-zero' | 'moon-and-metropolis' | 'collector-cashflow' | 'risk-millionaire'
  | 'nothing-million-speed-2m' | 'nothing-million-speed-5m' | 'nothing-million-speed-10m' | 'billion-speed-30m' | 'town-speed-15m' | 'metropolis-speed-60m'
  | 'wolf-first-billion' | 'wolf-three-businesses' | 'wolf-million-income' | 'wolf-market-master' | 'wolf-risk-billionaire'
  | 'debt-10k-comeback' | 'debt-1m-comeback' | 'debt-100m-comeback' | 'debt-billion-comeback' | 'near-bankruptcy-comeback'
  | 'nothing-no-passive-millionaire' | 'nothing-active-100k' | 'risk-100x-win' | 'risk-1000x-win' | 'no-sales-billionaire'
  | 'one-of-everything' | 'coffee-million' | 'all-upgrades-max' | 'planetary-from-nothing' | 'spend-elon-benchmark' | 'spendutall-super';

export type GameItem = { id: string; name: string; emoji: string; category: ItemCategory; basePrice: number; growthRate: number; incomePerSecond?: number; upkeepPerSecond?: number; unlockSpent?: number; description: string; };
export type Scenario = { id: ScenarioId; name: string; description: string; startingCash: number; targetSpent?: number; targetNetWorth?: number; targetMultiplier?: number; goalLabel: string; freeMode?: boolean; };
export type HouseTier = { level: number; name: string; cost: number; requiredNetWorth: number; rooms: number; description: string; };
export type TownTier = { level: number; name: string; cost: number; requiredNetWorth: number; population: number; jobs: number; description: string; };
export type RegionTier = { level: number; name: string; cost: number; requiredNetWorth: number; population: number; economy: string; description: string; };
export type EmpireUpgrade = { id: string; name: string; emoji: string; description: string; baseCost: number; growthRate: number; maxLevel: number; incomeMultiplierPerLevel?: number; upkeepReductionPerLevel?: number; requiredTownLevel?: number; requiredRegionLevel?: number; };
export type CitySpecialization = { id: CitySpecializationId; name: string; emoji: string; description: string; incomeMultiplier: number; upkeepMultiplier: number; };
export type MarketEvent = { id: string; name: string; emoji: string; description: string; incomeMultiplier: number; upkeepMultiplier: number; durationMs: number; };
export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  kind: AchievementKind;
  threshold: number;
  category: AchievementCategory;
  subgroup: string;
  condition?: AchievementConditionId;
  hidden?: boolean;
  scenarioOnly?: ScenarioId[];
  points?: number;
  super?: boolean;
};

export type GameState = {
  started: boolean;
  scenarioId: ScenarioId;
  mode: FinancialMode;
  cash: number;
  totalSpent: number;
  totalSold: number;
  lifetimeIncome: number;
  owned: Record<string, number>;
  incomeStreams: Record<string, number>;
  businesses: BusinessPortfolio;
  cityEconomy: CityEconomyState;
  houseLevel: number;
  townLevel: number;
  regionLevel: number;
  upgrades: Record<string, number>;
  citySpecialization: CitySpecializationId | null;
  activeEventId: string | null;
  eventEndsAt: number;
  nextEventAt: number;
  lastOfflineIncome: number;
  riskMode: boolean;
  runStatus: RunStatus;
  bankruptcyDeadline: number;
  peakCash: number;
  peakNetWorth: number;
  lowestCash: number;
  runAchievements: Record<string, number>;
  lokTokens: number;
  lokProgressMs: number;
  theme: 'light' | 'midnight';
  createdAt: number;
  updatedAt: number;
};
