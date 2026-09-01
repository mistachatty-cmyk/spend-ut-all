export type CustomizationKind =
  | 'theme'
  | 'hud'
  | 'money-counter'
  | 'background'
  | 'profile-frame'
  | 'title-style'
  | 'effect'
  | 'pet'
  | 'pet-accessory';

export type CustomizationRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';

export type AcquisitionMethod =
  | 'starter'
  | 'achievement'
  | 'scenario'
  | 'lok'
  | 'lok-pass'
  | 'event'
  | 'secret'
  | 'supporter';

export type CustomizationDefinition = {
  id: string;
  kind: CustomizationKind;
  name: string;
  emoji?: string;
  description: string;
  rarity: CustomizationRarity;
  acquisition: AcquisitionMethod[];
  lokPrice?: number;
  /** Optional progression gate. This never spends extra LOK; it only asks the player to have earned this much over time. */
  lokLifetimeRequired?: number;
  requirementId?: string;
  previewKey?: string;
};

export type PetMood = 'idle' | 'happy' | 'excited' | 'worried' | 'sleepy' | 'traveling' | 'celebrating';

/**
 * Spend It All companions are a curated subset of the much larger LOKdex.
 * Owning a LOKdex character does not automatically make it an advisor.
 */
export type LokPetDefinition = CustomizationDefinition & {
  kind: 'pet';
  dexCharacterId: string;
  species: string;
  personality: string;
  advisorRole: 'starter' | 'money' | 'work' | 'risk' | 'travel' | 'general';
  preferredAnchor: 'money-counter' | 'sidebar' | 'footer' | 'room' | 'free';
  reactions: Array<'money-up' | 'money-down' | 'achievement' | 'bankruptcy-warning' | 'purchase' | 'travel' | 'coffee' | 'day-night'>;
};

export type CustomizationInventory = {
  version: number;
  ownedIds: string[];
  equipped: {
    themeId: string | null;
    hudId: string | null;
    moneyCounterId: string | null;
    backgroundId: string | null;
    profileFrameId: string | null;
    titleStyleId: string | null;
    effectId: string | null;
    petId: string | null;
    petAccessoryIds: string[];
  };
  unlocks: Record<string, { acquiredAt: number; method: AcquisitionMethod }>;
};
