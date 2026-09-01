import type { FinancialMode } from './types';
import type { GameRules } from './rules-types';
import type { TimeSystemSettings } from './time-types';

export type CustomWinConditionType =
  | 'free'
  | 'net-worth'
  | 'total-spent'
  | 'wealth-multiplier'
  | 'income-per-second'
  | 'town-level'
  | 'region-level'
  | 'survive-minutes';

export type CustomScenarioDefinition = {
  version: 1;
  name: string;
  description: string;
  startingCash: number;
  mode: FinancialMode;
  riskMode: boolean;
  rulesLocked: boolean;
  rules: GameRules;
  time: Pick<TimeSystemSettings, 'enabled' | 'timeScale' | 'activityTimeCosts' | 'availabilityWindows' | 'randomTimeEvents' | 'travelFatigue' | 'jetLag'>;
  restrictions: {
    sellingEnabled: boolean;
  };
  winCondition: {
    type: CustomWinConditionType;
    target: number;
  };
};
