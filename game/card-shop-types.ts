import type { LokDexAffinity, LokDexArchetype, LokDexCardVariant } from './lokdex-types';

export type CardShopProductKind = 'pack' | 'deck-kit';

export type CardPackGuarantee = {
  minRarity?: 'uncommon' | 'rare' | 'epic' | 'legendary';
  affinity?: LokDexAffinity[];
  archetype?: LokDexArchetype[];
  variantBoost?: number;
};

export type CardShopProduct = {
  id: string;
  kind: CardShopProductKind;
  name: string;
  emoji: string;
  description: string;
  priceCredits: number;
  cardCount: number;
  accent: string;
  guarantee?: CardPackGuarantee;
  fixedCharacterIds?: string[];
  deckBlueprintId?: string;
  featured?: boolean;
};

export type CardDeckBlueprint = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  style: string;
  recommendedAffinities: LokDexAffinity[];
  recommendedArchetypes: LokDexArchetype[];
  targetSize: number;
};

export type CardShopPull = {
  instanceId: string;
  characterId: string;
  variant: LokDexCardVariant;
  rarity: string;
  isNewCharacter: boolean;
};

export type CardShopState = {
  version: number;
  credits: number;
  lifetimeCreditsEarned: number;
  lifetimeCreditsSpent: number;
  packsOpened: number;
  cardsPulled: number;
  cardsRecycled: number;
  creditsFromRecycling: number;
  creditsFromCollectionRewards: number;
  claimedCollectionMilestones: number[];
  ownedDeckBlueprintIds: string[];
  lastFreePackAt: number;
  freePacksClaimed: number;
  starterGrantClaimed: boolean;
  recentPulls: CardShopPull[];
};
