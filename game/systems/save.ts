import { normalizeBusinessPortfolio } from './businesses';
import { normalizeCityEconomy } from './city-economy';
import { normalizeIncomeStreams } from './earnings';
import { GameState } from '../types';

const DEFAULT_EVENT_INTERVAL_MS = 120_000;

export function normalizeGameState(state: GameState, now = Date.now()): GameState {
  const cash = Number.isFinite(state.cash) ? state.cash : 0;
  const inferredActivePlayMs = Math.max(0, Math.min((state.updatedAt ?? now) - (state.createdAt ?? now), 24 * 60 * 60 * 1000));
  return {
    ...state,
    cash,
    totalSold: state.totalSold ?? 0,
    businesses: normalizeBusinessPortfolio(state.businesses),
    cityEconomy: normalizeCityEconomy(state.cityEconomy, now),
    incomeStreams: normalizeIncomeStreams(state.incomeStreams),
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
  };
}
