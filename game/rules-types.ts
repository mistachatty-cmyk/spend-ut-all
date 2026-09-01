export type RulePresetId = 'casual' | 'standard' | 'simulation' | 'hardcore' | 'sandbox';

export type GameRules = {
  presetId: RulePresetId;
  economy: {
    incomeMultiplier: number;
    costMultiplier: number;
    purchasePriceMultiplier: number;
    businessDemandMultiplier: number;
    laborCostMultiplier: number;
    inflationMultiplier: number;
  };
  world: {
    marketEventsEnabled: boolean;
    eventIntensity: number;
    offlineIncomeEnabled: boolean;
    offlineIncomeMultiplier: number;
  };
  difficulty: {
    activeIncomeMultiplier: number;
    investmentRiskMultiplier: number;
    debtPressureMultiplier: number;
  };
  progression: {
    scenarioGoalMultiplier: number;
    achievementTimingMultiplier: number;
  };
};

export type LocalPlayerSettings = {
  version: number;
  rules: GameRules;
  showAds: boolean;
  lokPassOwned: boolean;
  cloudSyncEnabled: boolean;
};
