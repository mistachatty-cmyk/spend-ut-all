import { lokPets } from '@/data/customizations';
import { lokDexEntries } from '@/data/lokdex';
import { lokDexEditions } from '@/data/lokdex-editions';
import type { CustomizationInventory } from '../customization-types';
import type { LokDexCardVariant, LokDexCollection } from '../lokdex-types';
import { normalizeLokDexCollection } from './lokdex';

/**
 * The compact "what does this player own" record Spend It All publishes to
 * their account so the GSix hub's LokDex can show it. Hand-kept mirror of
 * `apps/hub/lib/lokdex/types.ts` in the Gsixhub repo (separate repos, no
 * shared build). `version` is the drift alarm: bump it on both sides together.
 *
 * Derived from the local collection on every push, never stored separately.
 */
export const LOKDEX_APP_KEY = 'spendutall';
export const LOKDEX_SNAPSHOT_SCHEMA = 'lok.dex-snapshot';
export const LOKDEX_SNAPSHOT_VERSION = 1;
export const LOK_SPEND_IT_ALL_NAMESPACE = 'g6.spend-it-all';

export type DexRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';

export type DexSnapshotCard = { id: string; copies: number; best?: string };
export type DexSnapshotPet = { id: string; speciesId: string; name: string; level?: number; rarity?: DexRarity; starter?: boolean };
export type LokDexSnapshot = {
  schema: typeof LOKDEX_SNAPSHOT_SCHEMA;
  version: typeof LOKDEX_SNAPSHOT_VERSION;
  appKey: string;
  updatedAt: number;
  cards: DexSnapshotCard[];
  pets: DexSnapshotPet[];
};

/** `lokdex:g1:004` -> `g6.spend-it-all:lokdex-g1-004`, the id the hub catalog uses. */
export function lokDexPortableId(nativeId: string) {
  return `${LOK_SPEND_IT_ALL_NAMESPACE}:${nativeId.replace(/:/g, '-')}`;
}

const VARIANT_RANK: LokDexCardVariant[] = ['standard', 'foil', 'holo', 'negative', 'glitch', 'event', 'gold'];

function bestVariant(variants: LokDexCardVariant[]): LokDexCardVariant {
  return variants.reduce((best, next) => (VARIANT_RANK.indexOf(next) > VARIANT_RANK.indexOf(best) ? next : best), 'standard' as LokDexCardVariant);
}

/**
 * Only the native Firstlight roster and its editions are published. Cards
 * received from another game stay on this device -- that game publishes its
 * own cards itself.
 */
export function buildLokDexSnapshot(input: LokDexCollection, inventory: Pick<CustomizationInventory, 'ownedIds'>, now = Date.now()): LokDexSnapshot {
  const collection = normalizeLokDexCollection(input);
  const nativeIds = new Set(lokDexEntries.map((entry) => entry.id));
  const editionIds = new Set(lokDexEditions.map((edition) => edition.id));

  const copies = new Map<string, LokDexCardVariant[]>();
  for (const id of collection.discoveredIds) if (nativeIds.has(id)) copies.set(lokDexPortableId(id), []);
  for (const card of collection.cards) {
    const subject = card.editionId && editionIds.has(card.editionId) ? card.editionId : nativeIds.has(card.characterId) ? card.characterId : null;
    if (!subject) continue;
    const key = lokDexPortableId(subject);
    copies.set(key, [...(copies.get(key) ?? []), card.variant]);
  }

  const cards: DexSnapshotCard[] = [...copies.entries()]
    .map(([id, variants]) => ({ id, copies: variants.length, ...(variants.length && bestVariant(variants) !== 'standard' ? { best: bestVariant(variants) } : {}) }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const owned = new Set(inventory.ownedIds);
  const pets: DexSnapshotPet[] = lokPets
    .filter((pet) => owned.has(pet.id))
    .map((pet) => ({ id: pet.id, speciesId: lokDexPortableId(pet.dexCharacterId), name: pet.name, rarity: pet.rarity as DexRarity }));

  return { schema: LOKDEX_SNAPSHOT_SCHEMA, version: LOKDEX_SNAPSHOT_VERSION, appKey: LOKDEX_APP_KEY, updatedAt: now, cards, pets };
}

/** Everything except `updatedAt`, so unchanged collections skip the network write. */
export function lokDexSnapshotFingerprint(snapshot: LokDexSnapshot) {
  return JSON.stringify([snapshot.cards, snapshot.pets]);
}
