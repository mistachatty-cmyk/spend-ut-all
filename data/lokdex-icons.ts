import type { LokDexCardStats } from '@/game/lokdex-types';

export const affinityIcon: Record<string, string> = {
  coin: '◈', work: '⚒', tech: '⌁', nature: '◆', market: '↗', risk: '⚠', travel: '✦', cosmic: '✧', mystery: '?',
};

export const cardStatLabels: Array<{ key: keyof LokDexCardStats; label: string }> = [
  { key: 'power', label: 'Power' },
  { key: 'wit', label: 'Wit' },
  { key: 'hustle', label: 'Hustle' },
  { key: 'luck', label: 'Luck' },
  { key: 'resilience', label: 'Resilience' },
];
