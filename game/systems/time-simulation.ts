import { activities, timeEvents } from '@/data/activities';
import type { ActivityDefinition, TimeSimulationState } from '../time-types';

export function createTimeSimulationState(): TimeSimulationState {
  return {
    settings: { enabled: true, timeScale: 60, dayLengthMinutes: 1440, activityTimeCosts: true, availabilityWindows: true, randomTimeEvents: true, travelFatigue: true, jetLag: true },
    display: { enabled: true, showMilliseconds: true, showSeconds: true, showMinutes: true, showHours: true, showDays: true, showGameDay: true, showSchedule: true },
    gameMinute: 8 * 60,
    fatigue: 0,
    jetLag: 0,
    activeActivity: null,
    lastEventId: null,
  };
}

export function normalizeTimeSimulation(input?: Partial<TimeSimulationState> | null): TimeSimulationState {
  const base = createTimeSimulationState();
  if (!input) return base;
  return {
    ...base,
    ...input,
    settings: { ...base.settings, ...(input.settings ?? {}) },
    display: { ...base.display, ...(input.display ?? {}) },
    fatigue: Math.max(0, Math.min(100, input.fatigue ?? 0)),
    jetLag: Math.max(0, Math.min(100, input.jetLag ?? 0)),
    activeActivity: input.activeActivity ?? null,
  };
}

export function gameDay(time: TimeSimulationState) { return Math.floor(time.gameMinute / time.settings.dayLengthMinutes) + 1; }
export function minuteOfDay(time: TimeSimulationState) { return ((Math.floor(time.gameMinute) % time.settings.dayLengthMinutes) + time.settings.dayLengthMinutes) % time.settings.dayLengthMinutes; }
export function gameClockLabel(time: TimeSimulationState) { const m = minuteOfDay(time); const h = Math.floor(m / 60); return `${String(h).padStart(2,'0')}:${String(m % 60).padStart(2,'0')}`; }

export function activityAvailable(time: TimeSimulationState, activity: ActivityDefinition) {
  if (!time.settings.enabled || !time.settings.availabilityWindows || !activity.availability) return true;
  const hour = Math.floor(minuteOfDay(time) / 60);
  const dayIndex = Math.floor(time.gameMinute / time.settings.dayLengthMinutes) % 7;
  const weekday = (dayIndex + 1) % 7;
  const inHours = hour >= activity.availability.startHour && hour < activity.availability.endHour;
  const inDay = !activity.availability.weekdays?.length || activity.availability.weekdays.includes(weekday);
  return inHours && inDay;
}

export function startTimedActivity(time: TimeSimulationState, activityId: string) {
  const activity = activities.find((entry) => entry.id === activityId);
  if (!activity || time.activeActivity || !activityAvailable(time, activity)) return time;
  const duration = time.settings.enabled && time.settings.activityTimeCosts ? activity.durationMinutes : 0;
  return { ...time, activeActivity: { id: activity.id, startedAtGameMinute: time.gameMinute, endsAtGameMinute: time.gameMinute + duration } };
}

export function advanceTimeSimulation(timeInput: TimeSimulationState, deltaMs: number) {
  let time = normalizeTimeSimulation(timeInput);
  if (!time.settings.enabled) {
    if (!time.activeActivity) return { time, completedActivityId: null as string | null, eventId: null as string | null };
    const completedActivityId = time.activeActivity.id;
    const activity = activities.find((entry) => entry.id === completedActivityId);
    time = { ...time, fatigue: Math.max(0, Math.min(100, time.fatigue + (activity?.fatigueDelta ?? 0))), activeActivity:null };
    return { time, completedActivityId, eventId:null as string | null };
  }
  const gameMinutesDelta = (deltaMs / 60_000) * Math.max(0, time.settings.timeScale);
  const before = time.gameMinute;
  const gameMinute = before + gameMinutesDelta;
  let completedActivityId: string | null = null;
  if (time.activeActivity && gameMinute >= time.activeActivity.endsAtGameMinute) {
    completedActivityId = time.activeActivity.id;
    const activity = activities.find((entry) => entry.id === completedActivityId);
    time = { ...time, fatigue: Math.max(0, Math.min(100, time.fatigue + (activity?.fatigueDelta ?? 0))), jetLag: Math.max(0, Math.min(100, time.jetLag + (time.settings.jetLag ? activity?.jetLagDelta ?? 0 : 0))), activeActivity: null };
  }
  let eventId: string | null = null;
  if (time.settings.randomTimeEvents && Math.floor(before / 360) !== Math.floor(gameMinute / 360) && timeEvents.length) {
    const index = Math.floor(gameMinute / 360) % timeEvents.length;
    const event = timeEvents[index];
    if (event.id !== time.lastEventId) {
      eventId = event.id;
      time = { ...time, lastEventId: event.id, fatigue: Math.max(0, Math.min(100, time.fatigue + (event.fatigueDelta ?? 0))), jetLag: Math.max(0, Math.min(100, time.jetLag + (event.jetLagDelta ?? 0))), gameMinute: gameMinute + event.durationMinutes };
    }
  }
  return { time: { ...time, gameMinute: eventId ? time.gameMinute : gameMinute }, completedActivityId, eventId };
}

export function timeEfficiencyMultiplier(time: TimeSimulationState) {
  const fatiguePenalty = Math.min(0.45, time.fatigue / 220);
  const jetLagPenalty = Math.min(0.25, time.jetLag / 300);
  return Math.max(0.35, 1 - fatiguePenalty - jetLagPenalty);
}
