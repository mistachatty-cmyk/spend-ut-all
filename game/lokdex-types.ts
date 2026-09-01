import type { CustomizationRarity } from './customization-types';

export type LokDexAffinity = 'coin' | 'work' | 'tech' | 'nature' | 'market' | 'risk' | 'travel' | 'cosmic' | 'mystery';
export type LokDexArchetype = 'builder' | 'collector' | 'trader' | 'guardian' | 'scout' | 'trickster' | 'engineer' | 'mystic';
export type LokDexAcquisition = 'starter' | 'achievement' | 'scenario' | 'lok' | 'event' | 'secret' | 'generated' | 'pack' | 'trade';

export type LokDexCardStats = {
  power: number;
  wit: number;
  hustle: number;
  luck: number;
  resilience: number;
};

export type LokDexCharacter = {
  id: string;
  number: number;
  generation: number;
  setId: string;
  name: string;
  species: string;
  description: string;
  rarity: CustomizationRarity;
  affinity: LokDexAffinity;
  archetype: LokDexArchetype;
  acquisition: LokDexAcquisition[];
  discoveryHint: string;
  cardStats: LokDexCardStats;
  tags: string[];
  companionCustomizationId?: string;
};

export type LokDexCardVariant = 'standard' | 'foil' | 'holo' | 'negative' | 'glitch' | 'gold' | 'event';

export type LokDexOwnedCard = {
  instanceId: string;
  characterId: string;
  variant: LokDexCardVariant;
  serial: number | null;
  acquiredAt: number;
  acquisition: LokDexAcquisition;
  sourceGame: string;
  generationSeed?: string;
  favorite: boolean;
  tradeLocked: boolean;
  transferCount: number;
};

export type LokDexCollection = {
  version: number;
  discoveredIds: string[];
  discoveredAt: Record<string, number>;
  cards: LokDexOwnedCard[];
  favoriteCharacterIds: string[];
};
