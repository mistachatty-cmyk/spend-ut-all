import { lokRuntime } from '@/integrations/lok/runtime';
import { normalizeBusinessPortfolio } from './businesses';
import { normalizeCityEconomy } from './city-economy';
import { normalizeIncomeStreams } from './earnings';
import { normalizeTimeSimulation } from './time-simulation';
import { normalizeGameRules } from './rules';
import { normalizeCustomScenario } from './custom-scenarios';
import { advanceDebtState, normalizeDebtState } from './debt';
import { GameState } from '../types';

const DEFAULT_EVENT_INTERVAL_MS = 120_000;

export function normalizeGameState(state: GameState, now = Date.now()): GameState {
  const cash = Number.isFinite(state.cash) ? state.cash : 0;
  const inferredActivePlayMs = Math.max(0, Math.min((state.updatedAt ?? now) - (state.createdAt ?? now), 24 * 60 * 60 * 1000));
  const lok = lokRuntime.migrateRun(state.lokTokens ?? 0, state.lokProgressMs ?? 0);
  const time = normalizeTimeSimulation(state.time);
  const debtBase = normalizeDebtState(state.debt);
  const previousDebtMinute = debtBase.lastAdvancedGameMinute || time.gameMinute;
  const debtTick = advanceDebtState(debtBase, previousDebtMinute, time.gameMinute);
  let owned = state.owned ?? {};
  if (debtTick.seized.length) {
    owned = { ...owned };
    for (const collateral of debtTick.seized) owned[collateral.itemId] = Math.max(0, (owned[collateral.itemId] ?? 0) - collateral.quantity);
  }
  return {
    ...state,
    cash,
    owned,
    customScenario: state.scenarioId === 'custom' && state.customScenario ? normalizeCustomScenario(state.customScenario) : null,
    totalSold: state.totalSold ?? 0,
    businesses: normalizeBusinessPortfolio(state.businesses),
    cityEconomy: normalizeCityEconomy(state.cityEconomy, now),
    incomeStreams: normalizeIncomeStreams(state.incomeStreams),
    time,
    rules: normalizeGameRules(state.rules),
    debt: debtTick.debt,
    townLevel: state.townLevel ?? 0,
    regionLevel: state.regionLevel ?? 0,
    upgrades: state.upgrades ?? {},
    citySpecialization: state.citySpecialization ?? null,
    activeEventId: state.activeEventId ?? null,
    eventEndsAt: state.eventEndsAt ?? 0,
    nextEventAt: state.nextEventAt ?? now + DEFAULT_EVENT_INTERVAL_MS,
    lastOfflineIncome: state.lastOfflineIncome ?? 0,
    riskMode: state.riskMode ?? false,
    runStatus: state.runStatus ?? 'active',
    bankruptcyDeadline: state.bankruptcyDeadline ?? 0,
    bankruptcyWarnings: state.bankruptcyWarnings ?? 0,
    peakCash: Math.max(state.peakCash ?? cash, cash),
    peakNetWorth: Math.max(0, state.peakNetWorth ?? 0),
    lowestCash: Math.min(state.lowestCash ?? cash, cash),
    activePlayMs: Math.max(0, state.activePlayMs ?? inferredActivePlayMs),
    runAchievements: state.runAchievements ?? {},
    lokTokens: lok.balance,
    lokProgressMs: lok.progressMs,
  };
}
