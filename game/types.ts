export type FinancialMode = 'simple' | 'advanced';
export type ScenarioId = 'freeplay' | 'billionaire' | 'trillionaire';
export type ItemCategory = 'everyday' | 'luxury' | 'property' | 'business' | 'infrastructure';

export type GameItem = {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  basePrice: number;
  growthRate: number;
  incomePerSecond?: number;
  upkeepPerSecond?: number;
  unlockSpent?: number;
  description: string;
};

export type Scenario = {
  id: ScenarioId;
  name: string;
  description: string;
  startingCash: number;
  targetSpent?: number;
  targetNetWorth?: number;
  goalLabel: string;
};

export type HouseTier = {
  level: number;
  name: string;
  cost: number;
  requiredNetWorth: number;
  rooms: number;
  description: string;
};

export type TownTier = {
  level: number;
  name: string;
  cost: number;
  requiredNetWorth: number;
  population: number;
  jobs: number;
  description: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  kind: 'spent' | 'netWorth' | 'income' | 'house' | 'town' | 'collection';
  threshold: number;
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
  houseLevel: number;
  townLevel: number;
  lokTokens: number;
  lokProgressMs: number;
  theme: 'light' | 'midnight';
  createdAt: number;
  updatedAt: number;
};
