import type { FinancialMode, ScenarioId } from './types';

export type RunResult = {
  id: string;
  endedAt: number;
  result: 'bankrupt' | 'completed';
  scenarioId: ScenarioId;
  scenarioName?: string;
  challengeCode?: string;
  mode: FinancialMode;
  riskMode: boolean;
  endingCash: number;
  peakCash: number;
  peakNetWorth: number;
  lifetimeIncome: number;
  totalSpent: number;
  townLevel: number;
  regionLevel: number;
  businessesFounded: number;
  durationMs: number;
  score: number;
};
