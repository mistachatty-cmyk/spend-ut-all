import { marketEvents } from '@/data/content';
import { worldEvents } from '@/data/world-events';
import { GameState, MarketEvent } from '../types';

export const EVENT_INTERVAL_MS = 120_000;
const allMarketEvents: MarketEvent[] = [...marketEvents, ...worldEvents];

export function getActiveMarketEvent(state: GameState, now = Date.now()): MarketEvent | null {
  if (!state.activeEventId || now >= state.eventEndsAt) return null;
  return allMarketEvents.find((event) => event.id === state.activeEventId) ?? null;
}

export function getEventMultipliers(state: GameState, now = Date.now()) {
  const event = getActiveMarketEvent(state, now);
  return {
    income: event?.incomeMultiplier ?? 1,
    upkeep: event?.upkeepMultiplier ?? 1,
  };
}

export function updateMarketEventState(state: GameState, now = Date.now()): GameState {
  let next = state;

  if (next.activeEventId && now >= next.eventEndsAt) {
    next = {
      ...next,
      activeEventId: null,
      eventEndsAt: 0,
      nextEventAt: Math.max(next.nextEventAt, now + EVENT_INTERVAL_MS),
    };
  }

  if (!next.activeEventId && now >= next.nextEventAt && allMarketEvents.length > 0) {
    const index = Math.floor(now / 1000) % allMarketEvents.length;
    const event = allMarketEvents[index];
    next = {
      ...next,
      activeEventId: event.id,
      eventEndsAt: now + event.durationMs,
      nextEventAt: now + event.durationMs + EVENT_INTERVAL_MS,
    };
  }

  return next;
}
