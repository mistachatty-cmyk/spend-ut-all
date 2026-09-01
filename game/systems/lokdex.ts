import { lokPets } from '@/data/customizations';
import type { CustomizationInventory } from '../customization-types';
import type { LokDexCollection, LokDexOwnedCard, LokDexAcquisition, LokDexCardVariant } from '../lokdex-types';

export const LOKDEX_COLLECTION_KEY = 'spend-it-all-lokdex-v1';
export const LOKDEX_COLLECTION_VERSION = 1;

export function createLokDexCollection(): LokDexCollection {
  return { version: LOKDEX_COLLECTION_VERSION, discoveredIds: [], discoveredAt: {}, cards: [], favoriteCharacterIds: [] };
}

export function normalizeLokDexCollection(input?: Partial<LokDexCollection> | null): LokDexCollection {
  const base = createLokDexCollection();
  const discoveredIds = Array.isArray(input?.discoveredIds) ? [...new Set(input!.discoveredIds.filter((id): id is string => typeof id === 'string'))] : [];
  const cards = Array.isArray(input?.cards) ? input!.cards.filter((card): card is LokDexOwnedCard => !!card && typeof card.instanceId === 'string' && typeof card.characterId === 'string').map((card) => ({
    ...card,
    editionId: typeof card.editionId === 'string' ? card.editionId : undefined,
    releaseId: typeof card.releaseId === 'string' ? card.releaseId : undefined,
    serial: Number.isFinite(card.serial) ? card.serial : null,
    acquiredAt: Number.isFinite(card.acquiredAt) ? card.acquiredAt : Date.now(),
    favorite: !!card.favorite,
    tradeLocked: card.tradeLocked ?? true,
    transferCount: Math.max(0, Number.isFinite(card.transferCount) ? card.transferCount : 0),
  })) : [];
  return {
    version: LOKDEX_COLLECTION_VERSION,
    discoveredIds,
    discoveredAt: input?.discoveredAt && typeof input.discoveredAt === 'object' ? input.discoveredAt : {},
    cards,
    favoriteCharacterIds: Array.isArray(input?.favoriteCharacterIds) ? [...new Set(input!.favoriteCharacterIds.filter((id): id is string => typeof id === 'string'))] : [],
  };
}

export function loadLokDexCollection() {
  if (typeof window === 'undefined') return createLokDexCollection();
  try {
    const raw = localStorage.getItem(LOKDEX_COLLECTION_KEY);
    return raw ? normalizeLokDexCollection(JSON.parse(raw)) : createLokDexCollection();
  } catch {
    return createLokDexCollection();
  }
}

export function saveLokDexCollection(input: LokDexCollection) {
  const next = normalizeLokDexCollection(input);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(LOKDEX_COLLECTION_KEY, JSON.stringify(next)); } catch {}
  }
  return next;
}

export function discoverLokDexCharacter(input: LokDexCollection, characterId: string, at = Date.now()) {
  const collection = normalizeLokDexCollection(input);
  if (collection.discoveredIds.includes(characterId)) return collection;
  return {
    ...collection,
    discoveredIds: [...collection.discoveredIds, characterId],
    discoveredAt: { ...collection.discoveredAt, [characterId]: at },
  };
}

export function grantLokDexCard(input: LokDexCollection, characterId: string, acquisition: LokDexAcquisition, options?: {
  instanceId?: string;
  editionId?: string;
  variant?: LokDexCardVariant;
  releaseId?: string;
  serial?: number | null;
  sourceGame?: string;
  generationSeed?: string;
  tradeLocked?: boolean;
}) {
  let collection = discoverLokDexCharacter(input, characterId);
  const instanceId = options?.instanceId ?? `lokcard-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  if (collection.cards.some((card) => card.instanceId === instanceId)) return collection;
  const card: LokDexOwnedCard = {
    instanceId,
    characterId,
    editionId: options?.editionId,
    variant: options?.variant ?? 'standard',
    releaseId: options?.releaseId,
    serial: options?.serial ?? null,
    acquiredAt: Date.now(),
    acquisition,
    sourceGame: options?.sourceGame ?? 'spend-it-all',
    generationSeed: options?.generationSeed,
    favorite: false,
    tradeLocked: options?.tradeLocked ?? true,
    transferCount: 0,
  };
  return { ...collection, cards: [...collection.cards, card] };
}

/**
 * Companion unlocks reveal/grant one local base card for the LOKdex character they are inspired by.
 * This does NOT make arbitrary LOKdex characters into companions.
 */
export function syncCompanionsToLokDex(input: LokDexCollection, inventory: CustomizationInventory) {
  let collection = normalizeLokDexCollection(input);
  for (const companion of lokPets) {
    if (!inventory.ownedIds.includes(companion.id)) continue;
    const instanceId = `companion-origin:${companion.id}`;
    collection = grantLokDexCard(collection, companion.dexCharacterId, companion.acquisition.includes('starter') ? 'starter' : companion.acquisition.includes('achievement') ? 'achievement' : companion.acquisition.includes('scenario') ? 'scenario' : 'lok', {
      instanceId,
      releaseId: 'lok-gen1-origin',
      sourceGame: 'spend-it-all',
      tradeLocked: true,
    });
  }
  return collection;
}

export function cardCopiesForCharacter(collection: LokDexCollection, characterId: string) {
  return normalizeLokDexCollection(collection).cards.filter((card) => card.characterId === characterId);
}
