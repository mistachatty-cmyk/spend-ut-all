import type { CustomizationRarity } from '@/game/customization-types';

/**
 * Sealed LokPacks hold LokPets (companions) only. Card packs in `card-shop.ts`
 * are a separate product that gives LokDex cards for Card Credits.
 * Pets are the pool: every non-starter LokPet, weighted by rarity here.
 */
export type LokPackId = 'lokpack-street' | 'lokpack-prime';

export type LokPackDef = {
  id: LokPackId;
  name: string;
  emoji: string;
  description: string;
  lokPrice: number;
  /** Relative chance per rarity. A rarity with no eligible pet is skipped. */
  weights: Partial<Record<CustomizationRarity, number>>;
};

export const lokPacks: LokPackDef[] = [
  { id: 'lokpack-street', name: 'Street LokPack', emoji: '📦', description: 'One sealed companion. Mostly uncommon and rare pets.', lokPrice: 20, weights: { uncommon: 50, rare: 35, epic: 10, legendary: 4, mythic: 1 } },
  { id: 'lokpack-prime', name: 'Prime LokPack', emoji: '💎', description: 'One sealed companion weighted toward rare and above. Achievements and scenarios also grant one.', lokPrice: 60, weights: { uncommon: 15, rare: 35, epic: 30, legendary: 15, mythic: 5 } },
];

export const LOKPACKS_BY_ID = Object.fromEntries(lokPacks.map((pack) => [pack.id, pack])) as Record<LokPackId, LokPackDef>;
