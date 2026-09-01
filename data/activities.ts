import type { ActivityDefinition, TimeEvent } from '@/game/time-types';

export const activities: ActivityDefinition[] = [
  { id: 'shift-cafe', name: 'Part-Time Café Shift', emoji: '☕', category: 'work', durationMinutes: 240, description: 'Work a four-hour shift for reliable early cash.', income: 120, partTime: true, availability: { startHour: 6, endHour: 22, weekdays: [1,2,3,4,5,6] }, industry: 'hospitality', fatigueDelta: 12 },
  { id: 'shift-warehouse', name: 'Warehouse Shift', emoji: '📦', category: 'work', durationMinutes: 480, description: 'Put in a full eight-hour shift.', income: 320, availability: { startHour: 5, endHour: 23 }, industry: 'logistics', fatigueDelta: 24 },
  { id: 'freelance-block', name: 'Freelance Block', emoji: '💻', category: 'work', durationMinutes: 120, description: 'Two focused hours of contract work.', income: 450, partTime: true, industry: 'technology', fatigueDelta: 8 },
  { id: 'client-meeting', name: 'Major Client Meeting', emoji: '🤝', category: 'business', durationMinutes: 90, description: 'Spend time closing a higher-value deal.', income: 2500, availability: { startHour: 8, endHour: 18, weekdays: [1,2,3,4,5] }, industry: 'business', fatigueDelta: 6 },
  { id: 'regional-flight', name: 'Regional Flight', emoji: '✈️', category: 'travel', durationMinutes: 240, description: 'Fly four hours to another business market.', cost: 450, fatigueDelta: 8, jetLagDelta: 8 },
  { id: 'long-haul-flight', name: 'Long-Haul Flight', emoji: '🛫', category: 'travel', durationMinutes: 720, description: 'Cross multiple time zones for international business.', cost: 3200, fatigueDelta: 18, jetLagDelta: 28 },
  { id: 'sleep', name: 'Sleep', emoji: '😴', category: 'recovery', durationMinutes: 480, description: 'Recover with eight hours of sleep.', fatigueDelta: -55, jetLagDelta: -12 },
  { id: 'power-nap', name: 'Power Nap', emoji: '🛋️', category: 'recovery', durationMinutes: 30, description: 'Trade half an hour for a quick recovery boost.', fatigueDelta: -12, jetLagDelta: -2 },
  { id: 'espresso-break', name: 'Espresso Break', emoji: '☕', category: 'recovery', durationMinutes: 10, description: 'A short caffeine stop that temporarily cuts fatigue.', cost: 6, fatigueDelta: -10 },
];

export const timeEvents: TimeEvent[] = [
  { id: 'flight-delay', name: 'Flight Delay', emoji: '🕓', description: 'A delay eats into your schedule and leaves you more tired.', durationMinutes: 90, fatigueDelta: 6 },
  { id: 'red-eye', name: 'Rough Red-Eye', emoji: '🌙', description: 'The overnight leg hits harder than expected.', durationMinutes: 0, fatigueDelta: 10, jetLagDelta: 12 },
  { id: 'walk-in-client', name: 'Unexpected Client', emoji: '🤝', description: 'A surprise opportunity appears in your schedule.', durationMinutes: 45, incomeMultiplier: 1.25 },
  { id: 'quiet-day', name: 'Quiet Industry Day', emoji: '📉', description: 'Demand is unusually slow today.', durationMinutes: 0, incomeMultiplier: 0.85 },
];
