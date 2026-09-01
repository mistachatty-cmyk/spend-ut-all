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
};

export type HouseTier = {
  level: number;
  name: string;
  cost: number;
  requiredNetWorth: number;
  rooms: number;
  description: string;
};

export type GameState = {
  started: boolean;
  scenarioId: ScenarioId;
  mode: FinancialMode;
  cash: number;
  totalSpent: number;
  lifetimeIncome: number;
  owned: Record<string, number>;
  houseLevel: number;
  lokTokens: number;
  lokProgressMs: number;
  theme: 'light' | 'midnight';
  createdAt: number;
  updatedAt: number;
};
