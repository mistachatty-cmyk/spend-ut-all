import type { Achievement } from '@/game/types';

export const timeAchievements: Achievement[] = [
  { id: 'play-1s', name: 'First Tick', description: 'Spend 1 active second inside a run.', emoji: '⏱️', kind: 'combo', threshold: 1, condition: 'play-1s', category: 'speedrunner', subgroup: 'Run Clock', points: 5 },
  { id: 'play-10s', name: 'Ten Seconds In', description: 'Spend 10 active seconds in the same playthrough.', emoji: '🔟', kind: 'combo', threshold: 1, condition: 'play-10s', category: 'speedrunner', subgroup: 'Run Clock', points: 5 },
  { id: 'play-1m', name: 'Clocked In', description: 'Reach 1 active minute in a playthrough.', emoji: '🕐', kind: 'combo', threshold: 1, condition: 'play-1m', category: 'speedrunner', subgroup: 'Run Clock', points: 10 },
  { id: 'play-10m', name: 'Deep Session', description: 'Reach 10 active minutes in one playthrough.', emoji: '⌚', kind: 'combo', threshold: 1, condition: 'play-10m', category: 'speedrunner', subgroup: 'Run Clock', points: 15 },
  { id: 'play-1h', name: 'One-Hour Empire', description: 'Keep one playthrough active for a full hour.', emoji: '⌛', kind: 'combo', threshold: 1, condition: 'play-1h', category: 'speedrunner', subgroup: 'Marathon', points: 30 },
  { id: 'play-6h', name: 'Market Marathon', description: 'Accumulate 6 active hours in a single run.', emoji: '🌆', kind: 'combo', threshold: 1, condition: 'play-6h', category: 'speedrunner', subgroup: 'Marathon', points: 75 },
  { id: 'play-24h', name: 'A Full Economic Day', description: 'Accumulate 24 active hours in one playthrough.', emoji: '🌅', kind: 'combo', threshold: 1, condition: 'play-24h', category: 'speedrunner', subgroup: 'Marathon', points: 175, super: true },
  { id: 'play-7d', name: 'The Long Game', description: 'Accumulate 7 full active days in one playthrough.', emoji: '🗓️', kind: 'combo', threshold: 1, condition: 'play-7d', category: 'speedrunner', subgroup: 'Marathon', points: 500, super: true },
  { id: 'nothing-million-under-60s', name: 'Minute Millionaire', description: 'Reach $1M from nothing in 60 active seconds or less.', emoji: '💥', kind: 'combo', threshold: 1, condition: 'nothing-million-under-60s', category: 'speedrunner', subgroup: 'Impossible Splits', scenarioOnly: ['nothing'], points: 500, super: true },
  { id: 'risk-survive-30m', name: 'Thirty Minutes on the Edge', description: 'Survive 30 active minutes in Risk Mode without going bankrupt.', emoji: '🫀', kind: 'combo', threshold: 1, condition: 'risk-survive-30m', category: 'risk', subgroup: 'Survival Clock', points: 150 },
  { id: 'spendutall-after-24h', name: 'Slow Burn SPENDUTALL', description: 'Spend $200T after surviving at least 24 active hours in the same run.', emoji: '🔥', kind: 'combo', threshold: 1, condition: 'spendutall-after-24h', category: 'spending', subgroup: 'Game Namesakes', points: 1500, super: true },
];
