import type { CustomizationRarity } from './customization-types';

export type LokDexAffinity = 'coin' | 'work' | 'tech' | 'nature' | 'market' | 'risk' | 'travel' | 'cosmic' | 'mystery';
export type LokDexArchetype = 'builder' | 'collector' | 'trader' | 'guardian' | 'scout' | 'trickster' | 'engineer' | 'mystic';
export type LokDexAcquisition = 'starter' | 'achievement' | 'scenario' | 'lok' | 'event' | 'secret' | 'generated' | 'pack' | 'trade';
export type LokDexReleaseKind = 'core-set' | 'capsule' | 'event' | 'collab' | 'secret';

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
  /**
   * Absent (or 'spend-it-all') for the native Firstlight roster in data/lokdex.ts.
   * Set on a character definition that arrived through the LOK card exchange
   * protocol (see game/systems/lok-card-exchange.ts) from another G-Six game,
   * identified by its portable namespace (e.g. 'g6.616-survivor').
   */
  sourceGame?: string;
};

/**
 * An edition is a named creative spin on an existing LOKdex character.
 * Example: the base Coin Cat character can have a business-capsule edition
 * with a tie, new art/name, and release provenance while remaining Coin Cat.
 * Editions are distinct from foil/holo/gold print finishes.
 */
export type LokDexCharacterEdition = {
  id: string;
  baseCharacterId: string;
  releaseId: string;
  name: string;
  description: string;
  artKey: string;
  acquisition: LokDexAcquisition[];
  tags: string[];
  rarityOverride?: CustomizationRarity;
  statDelta?: Partial<LokDexCardStats>;
  companionProfileId?: string;
};

/** Print/visual finish on a specific card copy. */
export type LokDexCardVariant = 'standard' | 'foil' | 'holo' | 'negative' | 'glitch' | 'gold' | 'event';

export type LokDexOwnedCard = {
  instanceId: string;
  characterId: string;
  /** Optional named character edition; absent means base character art. */
  editionId?: string;
  /** Print finish such as foil/holo/gold. */
  variant: LokDexCardVariant;
  releaseId?: string;
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
  /**
   * Cached character definitions for cards imported from another game via the
   * LOK card exchange protocol. The native Firstlight roster (data/lokdex.ts)
   * never lives here; this is only the "definition" half of foreign cards
   * whose id isn't in that static roster. See resolveLokDexCharacter().
   */
  foreignCharacters: LokDexCharacter[];
};
