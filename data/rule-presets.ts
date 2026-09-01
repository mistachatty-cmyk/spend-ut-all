import type { GameRules, RulePresetId } from '@/game/rules-types';

const standardRules: GameRules = {
  presetId: 'standard',
  economy: { incomeMultiplier: 1, costMultiplier: 1, purchasePriceMultiplier: 1, businessDemandMultiplier: 1, laborCostMultiplier: 1, inflationMultiplier: 1 },
  world: { marketEventsEnabled: true, eventIntensity: 1, offlineIncomeEnabled: true, offlineIncomeMultiplier: 1 },
  difficulty: { activeIncomeMultiplier: 1, investmentRiskMultiplier: 1, debtPressureMultiplier: 1 },
  progression: { scenarioGoalMultiplier: 1, achievementTimingMultiplier: 1 },
};

export const RULE_PRESETS: Record<RulePresetId, GameRules> = {
  casual: {
    presetId: 'casual',
    economy: { incomeMultiplier: 1.5, costMultiplier: 0.75, purchasePriceMultiplier: 0.8, businessDemandMultiplier: 1.2, laborCostMultiplier: 0.85, inflationMultiplier: 0.75 },
    world: { marketEventsEnabled: true, eventIntensity: 0.6, offlineIncomeEnabled: true, offlineIncomeMultiplier: 1.25 },
    difficulty: { activeIncomeMultiplier: 1.5, investmentRiskMultiplier: 0.7, debtPressureMultiplier: 0.7 },
    progression: { scenarioGoalMultiplier: 0.8, achievementTimingMultiplier: 1.25 },
  },
  standard: standardRules,
  simulation: {
    presetId: 'simulation',
    economy: { incomeMultiplier: 0.95, costMultiplier: 1.08, purchasePriceMultiplier: 1.05, businessDemandMultiplier: 1, laborCostMultiplier: 1.08, inflationMultiplier: 1.1 },
    world: { marketEventsEnabled: true, eventIntensity: 1.15, offlineIncomeEnabled: true, offlineIncomeMultiplier: 0.8 },
    difficulty: { activeIncomeMultiplier: 0.9, investmentRiskMultiplier: 1.1, debtPressureMultiplier: 1.15 },
    progression: { scenarioGoalMultiplier: 1.1, achievementTimingMultiplier: 0.95 },
  },
  hardcore: {
    presetId: 'hardcore',
    economy: { incomeMultiplier: 0.72, costMultiplier: 1.35, purchasePriceMultiplier: 1.25, businessDemandMultiplier: 0.88, laborCostMultiplier: 1.3, inflationMultiplier: 1.4 },
    world: { marketEventsEnabled: true, eventIntensity: 1.5, offlineIncomeEnabled: false, offlineIncomeMultiplier: 0 },
    difficulty: { activeIncomeMultiplier: 0.75, investmentRiskMultiplier: 1.45, debtPressureMultiplier: 1.5 },
    progression: { scenarioGoalMultiplier: 1.25, achievementTimingMultiplier: 0.8 },
  },
  sandbox: {
    presetId: 'sandbox',
    economy: { incomeMultiplier: 5, costMultiplier: 0.2, purchasePriceMultiplier: 0.25, businessDemandMultiplier: 2, laborCostMultiplier: 0.25, inflationMultiplier: 0 },
    world: { marketEventsEnabled: false, eventIntensity: 0, offlineIncomeEnabled: true, offlineIncomeMultiplier: 5 },
    difficulty: { activeIncomeMultiplier: 5, investmentRiskMultiplier: 0, debtPressureMultiplier: 0 },
    progression: { scenarioGoalMultiplier: 0.25, achievementTimingMultiplier: 3 },
  },
  custom: { ...standardRules, presetId: 'custom', economy: { ...standardRules.economy }, world: { ...standardRules.world }, difficulty: { ...standardRules.difficulty }, progression: { ...standardRules.progression } },
};

export const RULE_PRESET_INFO = [
  { id: 'casual' as const, name: 'Casual', emoji: '🌤️', description: 'Fast growth, forgiving costs, generous offline progress.' },
  { id: 'standard' as const, name: 'Standard', emoji: '⚖️', description: 'The intended baseline economy.' },
  { id: 'simulation' as const, name: 'Simulation', emoji: '🏙️', description: 'More economic friction, stronger labor and market pressure.' },
  { id: 'hardcore' as const, name: 'Hardcore Tycoon', emoji: '🔥', description: 'Expensive growth, harsh debt, no offline income.' },
  { id: 'sandbox' as const, name: 'Ridiculous Sandbox', emoji: '🧪', description: 'Huge income, cheap assets, events off, experiment freely.' },
];
