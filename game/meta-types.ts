import type { ScenarioId } from './types';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';

export type BadgeDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: Rarity;
  hidden?: boolean;
  titleReward?: string;
};

export type CollectibleDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: Rarity;
  setId?: string;
  hidden?: boolean;
};

export type CollectibleSetDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  collectibleIds: string[];
  titleReward?: string;
};

export type DiscoveryRecord = {
  id: string;
  kind: 'badge' | 'collectible' | 'set';
  discoveredAt: number;
  scenarioId: ScenarioId;
};

export type MetaState = {
  version: number;
  badges: string[];
  collectibles: string[];
  completedSets: string[];
  titles: string[];
  equippedTitle: string | null;
  showcaseBadges: string[];
  discoveries: DiscoveryRecord[];
  scenariosCompleted: ScenarioId[];
};

export type MetaMetrics = {
  netWorth: number;
  incomePerSecond: number;
  totalOwned: number;
  scenarioComplete: boolean;
};
