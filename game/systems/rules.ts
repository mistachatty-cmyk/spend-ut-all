import { RULE_PRESETS } from '@/data/rule-presets';
import type { GameRules, RulePresetId } from '@/game/rules-types';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function createGameRules(presetId: RulePresetId = 'standard'): GameRules {
  return structuredClone(RULE_PRESETS[presetId] ?? RULE_PRESETS.standard);
}

export function normalizeGameRules(value?: Partial<GameRules> | null): GameRules {
  const base = createGameRules(value?.presetId ?? 'standard');
  return {
    presetId: value?.presetId ?? base.presetId,
    economy: {
      incomeMultiplier: clamp(value?.economy?.incomeMultiplier ?? base.economy.incomeMultiplier, 0, 100),
      costMultiplier: clamp(value?.economy?.costMultiplier ?? base.economy.costMultiplier, 0, 100),
      purchasePriceMultiplier: clamp(value?.economy?.purchasePriceMultiplier ?? base.economy.purchasePriceMultiplier, 0.01, 100),
      businessDemandMultiplier: clamp(value?.economy?.businessDemandMultiplier ?? base.economy.businessDemandMultiplier, 0, 20),
      laborCostMultiplier: clamp(value?.economy?.laborCostMultiplier ?? base.economy.laborCostMultiplier, 0, 20),
      inflationMultiplier: clamp(value?.economy?.inflationMultiplier ?? base.economy.inflationMultiplier, 0, 10),
    },
    world: {
      marketEventsEnabled: value?.world?.marketEventsEnabled ?? base.world.marketEventsEnabled,
      eventIntensity: clamp(value?.world?.eventIntensity ?? base.world.eventIntensity, 0, 5),
      offlineIncomeEnabled: value?.world?.offlineIncomeEnabled ?? base.world.offlineIncomeEnabled,
      offlineIncomeMultiplier: clamp(value?.world?.offlineIncomeMultiplier ?? base.world.offlineIncomeMultiplier, 0, 20),
    },
    difficulty: {
      activeIncomeMultiplier: clamp(value?.difficulty?.activeIncomeMultiplier ?? base.difficulty.activeIncomeMultiplier, 0, 100),
      investmentRiskMultiplier: clamp(value?.difficulty?.investmentRiskMultiplier ?? base.difficulty.investmentRiskMultiplier, 0, 5),
      debtPressureMultiplier: clamp(value?.difficulty?.debtPressureMultiplier ?? base.difficulty.debtPressureMultiplier, 0, 10),
    },
    progression: {
      scenarioGoalMultiplier: clamp(value?.progression?.scenarioGoalMultiplier ?? base.progression.scenarioGoalMultiplier, 0.05, 20),
      achievementTimingMultiplier: clamp(value?.progression?.achievementTimingMultiplier ?? base.progression.achievementTimingMultiplier, 0.1, 10),
    },
  };
}

export function applyRulePreset(_: GameRules, presetId: RulePresetId) {
  return createGameRules(presetId);
}

export function markRulesCustom(rules: GameRules): GameRules {
  return { ...normalizeGameRules(rules), presetId: 'sandbox' };
}
