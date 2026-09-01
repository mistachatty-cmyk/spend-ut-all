export type TimeDisplaySettings = {
  enabled: boolean;
  showMilliseconds: boolean;
  showSeconds: boolean;
  showMinutes: boolean;
  showHours: boolean;
  showDays: boolean;
  showGameDay: boolean;
  showSchedule: boolean;
};

export type TimeSystemSettings = {
  enabled: boolean;
  timeScale: number;
  dayLengthMinutes: number;
  activityTimeCosts: boolean;
  availabilityWindows: boolean;
  randomTimeEvents: boolean;
  travelFatigue: boolean;
  jetLag: boolean;
};

export type ActivityCategory = 'work' | 'business' | 'travel' | 'recovery' | 'leisure';

export type ActivityDefinition = {
  id: string;
  name: string;
  emoji: string;
  category: ActivityCategory;
  durationMinutes: number;
  description: string;
  income?: number;
  cost?: number;
  partTime?: boolean;
  availability?: { startHour: number; endHour: number; weekdays?: number[] };
  industry?: string;
  fatigueDelta?: number;
  jetLagDelta?: number;
};

export type ActiveActivity = {
  id: string;
  startedAtGameMinute: number;
  endsAtGameMinute: number;
};

export type TimeEvent = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  durationMinutes: number;
  fatigueDelta?: number;
  jetLagDelta?: number;
  incomeMultiplier?: number;
};

export type TimeSimulationState = {
  settings: TimeSystemSettings;
  display: TimeDisplaySettings;
  gameMinute: number;
  fatigue: number;
  jetLag: number;
  activeActivity: ActiveActivity | null;
  lastEventId: string | null;
};
