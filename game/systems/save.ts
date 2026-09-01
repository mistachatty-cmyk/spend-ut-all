import { normalizeBusinessPortfolio } from './businesses';
import { normalizeCityEconomy } from './city-economy';
import { GameState } from '../types';

const DEFAULT_EVENT_INTERVAL_MS = 120_000;

export function normalizeGameState(state: GameState, now = Date.now()): GameState {
  return {
    ...state,
    totalSold: state.totalSold ?? 0,
    businesses: normalizeBusinessPortfolio(state.businesses),
    cityEconomy: normalizeCityEconomy(state.cityEconomy, now),
    townLevel: state.townLevel ?? 0,
    regionLevel: state.regionLevel ?? 0,
    upgrades: state.upgrades ?? {},
    citySpecialization: state.citySpecialization ?? null,
    activeEventId: state.activeEventId ?? null,
    eventEndsAt: state.eventEndsAt ?? 0,
    nextEventAt: state.nextEventAt ?? now + DEFAULT_EVENT_INTERVAL_MS,
    lastOfflineIncome: state.lastOfflineIncome ?? 0,
  };
}
