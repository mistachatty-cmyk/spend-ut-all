import type { BusinessPortfolio } from './business-types';

export type FinancialMode = 'simple' | 'advanced';
export type ScenarioId = 'freeplay' | 'billionaire' | 'trillionaire';
export type ItemCategory = 'everyday' | 'luxury' | 'property' | 'business' | 'infrastructure';
export type CitySpecializationId = 'finance' | 'technology' | 'industrial' | 'tourism';

export type GameItem = { id: string; name: string; emoji: string; category: ItemCategory; basePrice: number; growthRate: number; incomePerSecond?: number; upkeepPerSecond?: number; unlockSpent?: number; description: string; };
export type Scenario = { id: ScenarioId; name: string; description: string; startingCash: number; targetSpent?: number; targetNetWorth?: number; goalLabel: string; };
export type HouseTier = { level: number; name: string; cost: number; requiredNetWorth: number; rooms: number; description: string; };
export type TownTier = { level: number; name: string; cost: number; requiredNetWorth: number; population: number; jobs: number; description: string; };
export type RegionTier = { level: number; name: string; cost: number; requiredNetWorth: number; population: number; economy: string; description: string; };
export type EmpireUpgrade = { id: string; name: string; emoji: string; description: string; baseCost: number; growthRate: number; maxLevel: number; incomeMultiplierPerLevel?: number; upkeepReductionPerLevel?: number; requiredTownLevel?: number; requiredRegionLevel?: number; };
export type CitySpecialization = { id: CitySpecializationId; name: string; emoji: string; description: string; incomeMultiplier: number; upkeepMultiplier: number; };
export type MarketEvent = { id: string; name: string; emoji: string; description: string; incomeMultiplier: number; upkeepMultiplier: number; durationMs: number; };
export type Achievement = { id: string; name: string; description: string; emoji: string; kind: 'spent' | 'netWorth' | 'income' | 'house' | 'town' | 'region' | 'collection'; threshold: number; };

export type GameState = {
  started: boolean;
  scenarioId: ScenarioId;
  mode: FinancialMode;
  cash: number;
  totalSpent: number;
  totalSold: number;
  lifetimeIncome: number;
  owned: Record<string, number>;
  businesses: BusinessPortfolio;
  houseLevel: number;
  townLevel: number;
  regionLevel: number;
  upgrades: Record<string, number>;
  citySpecialization: CitySpecializationId | null;
  activeEventId: string | null;
  eventEndsAt: number;
  nextEventAt: number;
  lastOfflineIncome: number;
  lokTokens: number;
  lokProgressMs: number;
  theme: 'light' | 'midnight';
  createdAt: number;
  updatedAt: number;
};
