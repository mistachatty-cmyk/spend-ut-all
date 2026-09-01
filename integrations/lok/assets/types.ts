export type LokAssetKind =
  | 'theme'
  | 'palette'
  | 'hud'
  | 'money-counter'
  | 'background'
  | 'profile-frame'
  | 'title-style'
  | 'effect'
  | 'pet'
  | 'companion-profile'
  | 'pet-accessory'
  | 'collectible'
  | 'card';

export type LokAssetRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';
export type LokAssetTransferPolicy = 'soulbound' | 'tradeable' | 'giftable' | 'server-controlled';
export type LokAssetAcquisitionMethod = 'starter' | 'achievement' | 'scenario' | 'lok' | 'lok-pass' | 'event' | 'secret' | 'supporter' | 'generated' | 'trade';

export type LokAssetProvenance = {
  sourceGame: string;
  sourceVersion?: string;
  createdAt?: number;
  generation?: number;
  generationSeed?: string;
  eventId?: string;
  achievementId?: string;
  scenarioId?: string;
  originalOwnerId?: string | null;
};

export type LokAssetOwnershipRules = {
  transferPolicy: LokAssetTransferPolicy;
  uniqueInstance: boolean;
  stackable: boolean;
  maxStack?: number;
  requiresServerAuthorityForTransfer: boolean;
  survivesRunReset: boolean;
};

export type LokAssetVisualRef = {
  previewKey?: string;
  spriteSheet?: string;
  spriteFrameWidth?: number;
  spriteFrameHeight?: number;
  paletteId?: string;
  animationSetId?: string;
};

export type LokAssetManifest<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  schema: 'lok.asset';
  schemaVersion: 1;
  id: string;
  namespace: string;
  slug: string;
  kind: LokAssetKind;
  version: number;
  name: string;
  description?: string;
  rarity: LokAssetRarity;
  tags?: string[];
  acquisition: LokAssetAcquisitionMethod[];
  ownership: LokAssetOwnershipRules;
  provenance: LokAssetProvenance;
  visual?: LokAssetVisualRef;
  metadata?: TMetadata;
};

export type LokOwnedAsset = {
  instanceId: string;
  assetId: string;
  assetVersion: number;
  acquiredAt: number;
  acquisitionMethod: LokAssetAcquisitionMethod;
  ownerId: string | null;
  sourceGame: string;
  quantity: number;
  provenance: LokAssetProvenance;
  transferCount: number;
  lastTransferredAt?: number;
};

export type LokAssetTransferRecord = {
  transferId: string;
  instanceId: string;
  fromOwnerId: string | null;
  toOwnerId: string;
  transferredAt: number;
  method: 'trade' | 'gift' | 'system';
  sourceGame: string;
};

/** Portable metadata for a character/card inside the broad LOKdex universe. */
export type LokPetCardMetadata = {
  species: string;
  generation?: number;
  variant?: string;
  personality?: string;
  traits?: string[];
  cardNumber?: string;
  evolutionFamily?: string;
  powerProfile?: Record<string, number>;
};

/**
 * A companion profile is a separate presentation/behavior asset that references a LOKdex character.
 * Only curated characters receive one; card ownership alone never grants advisor behavior.
 */
export type LokCompanionProfileMetadata = {
  characterAssetId: string;
  hostGame: string;
  advisorRole: 'starter' | 'money' | 'work' | 'risk' | 'travel' | 'general';
  preferredAnchor: 'money-counter' | 'sidebar' | 'footer' | 'room' | 'free';
  reactionIds: string[];
  dialogueSetId?: string;
  animationSetId?: string;
};
