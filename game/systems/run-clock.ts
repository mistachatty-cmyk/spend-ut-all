import type { GameState } from '../types';

export type RunClockParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type RunClockMilestone = {
  id: string;
  atMs: number;
  label: string;
  emoji: string;
};

export const runClockMilestones: RunClockMilestone[] = [
  { id: '1s', atMs: 1_000, label: 'First second', emoji: '⏱️' },
  { id: '10s', atMs: 10_000, label: 'Ten seconds', emoji: '⚡' },
  { id: '1m', atMs: 60_000, label: 'One minute', emoji: '🕐' },
  { id: '10m', atMs: 600_000, label: 'Ten minutes', emoji: '🏃' },
  { id: '1h', atMs: 3_600_000, label: 'One hour', emoji: '⌛' },
  { id: '6h', atMs: 21_600_000, label: 'Six hours', emoji: '🌆' },
  { id: '24h', atMs: 86_400_000, label: 'One active day', emoji: '🌅' },
  { id: '7d', atMs: 604_800_000, label: 'Seven active days', emoji: '🗓️' },
];

export function runClockParts(msInput: number): RunClockParts {
  const ms = Math.max(0, Math.floor(msInput));
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const milliseconds = ms % 1_000;
  return { days, hours, minutes, seconds, milliseconds };
}

export function formatRunClock(ms: number) {
  const p = runClockParts(ms);
  if (p.days > 0) return `${p.days}d ${String(p.hours).padStart(2, '0')}h ${String(p.minutes).padStart(2, '0')}m ${String(p.seconds).padStart(2, '0')}s`;
  if (p.hours > 0) return `${p.hours}h ${String(p.minutes).padStart(2, '0')}m ${String(p.seconds).padStart(2, '0')}s`;
  if (p.minutes > 0) return `${p.minutes}m ${String(p.seconds).padStart(2, '0')}s ${String(p.milliseconds).padStart(3, '0')}ms`;
  return `${p.seconds}.${String(p.milliseconds).padStart(3, '0')}s`;
}

export function playthroughAgeMs(state: GameState, now = Date.now()) {
  return Math.max(0, now - state.createdAt);
}

export function nextRunClockMilestone(activePlayMs: number) {
  return runClockMilestones.find((milestone) => activePlayMs < milestone.atMs) ?? null;
}

export function runClockProgress(activePlayMs: number) {
  const next = nextRunClockMilestone(activePlayMs);
  if (!next) return 1;
  const previous = [...runClockMilestones].reverse().find((milestone) => milestone.atMs <= activePlayMs);
  const floor = previous?.atMs ?? 0;
  return Math.max(0, Math.min(1, (activePlayMs - floor) / (next.atMs - floor)));
}
