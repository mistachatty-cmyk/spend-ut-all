import { lokDexEditionById } from '@/data/lokdex-editions';
import {
  DEFAULT_LOK_NAMESPACE,
  LOK_ASSET_SCHEMA,
  LOK_ASSET_SCHEMA_VERSION,
  makeLokAssetId,
  validateLokAssetManifest,
} from '@/integrations/lok/assets/spec';
import type { LokAssetManifest, LokAssetProvenance, LokOwnedAsset, LokPetCardMetadata } from '@/integrations/lok/assets/types';
import type { LokDexCardVariant, LokDexCharacter, LokDexCollection, LokDexOwnedCard } from '../lokdex-types';
import { grantLokDexCard, resolveLokDexCharacter, upsertForeignLokDexCharacter } from './lokdex';

/**
 * Bridges Spend It All's LOKdex collection to the game-agnostic LOK Portable
 * Asset Spec (docs/LOK_PORTABLE_ASSET_SPEC.md, integrations/lok/assets/).
 * This is the concrete implementation of what that document calls "a future
 * card game using the same LOKdex asset/instance IDs" — any G-Six game that
 * emits/accepts the same `lok.card-exchange` envelope can trade cards with
 * Spend It All (and with each other) without sharing a database, a server,
 * or even a TypeScript dependency: the envelope is plain JSON.
 *
 * See docs/LOK_CARD_EXCHANGE_PROTOCOL.md for the integration recipe another
 * game's own (independently implemented) exporter/importer should follow.
 */
export const LOK_CARD_EXCHANGE_FORMAT = 'lok.card-exchange';
export const LOK_CARD_EXCHANGE_FORMAT_VERSION = 1;

/** The full file/clipboard payload one game hands another to move a single card. */
export type LokPortableCardExport = {
  format: typeof LOK_CARD_EXCHANGE_FORMAT;
  formatVersion: typeof LOK_CARD_EXCHANGE_FORMAT_VERSION;
  manifest: LokAssetManifest<LokPetCardMetadata>;
  owned: LokOwnedAsset;
  /** Print finish (foil/holo/etc.) — LOKdex-specific, so it rides alongside the generic envelope rather than inside it. */
  printVariant: LokDexCardVariant;
};

/**
 * Cosmetic collectible cards stay non-transferable until a real ownership
 * service exists (see LOK_PORTABLE_ASSET_SPEC.md "Transfer policy" /
 * "Future card/trading service"): giftable in spirit, but
 * requiresServerAuthorityForTransfer keeps canTransferAsset() false so no
 * local save-file edit can fake a secure trade.
 */
function exportedCardOwnershipRules() {
  return {
    transferPolicy: 'giftable' as const,
    uniqueInstance: true,
    stackable: false,
    requiresServerAuthorityForTransfer: true,
    survivesRunReset: true,
  };
}

/** Native Firstlight ids look like `lokdex:g1:001`, which isn't a valid single-colon `namespace:slug` portable id. */
function portableCardId(character: LokDexCharacter): { namespace: string; slug: string; id: string } {
  if (character.sourceGame && character.sourceGame !== DEFAULT_LOK_NAMESPACE) {
    const namespace = character.id.includes(':') ? character.id.slice(0, character.id.indexOf(':')) : character.sourceGame;
    const slug = character.id.includes(':') ? character.id.slice(character.id.indexOf(':') + 1) : character.id;
    return { namespace, slug, id: makeLokAssetId(namespace, slug) };
  }
  const slug = character.id.replace(/:/g, '-');
  return { namespace: DEFAULT_LOK_NAMESPACE, slug, id: makeLokAssetId(DEFAULT_LOK_NAMESPACE, slug) };
}

/**
 * Turns a locally-owned LOKdex card into the portable manifest + owned-asset
 * pair another game can read. Re-exporting a card that itself arrived from a
 * third game preserves that game's original provenance instead of relabeling
 * it as Spend It All's own — provenance is meant to travel, not reset.
 */
export function exportOwnedCardAsPortable(character: LokDexCharacter, ownedCard: LokDexOwnedCard): LokPortableCardExport {
  const edition = lokDexEditionById(ownedCard.editionId);
  const { namespace, slug, id } = portableCardId(character);
  const provenance: LokAssetProvenance = {
    sourceGame: character.sourceGame ?? DEFAULT_LOK_NAMESPACE,
    createdAt: ownedCard.acquiredAt,
    generationSeed: ownedCard.generationSeed,
  };
  const manifest: LokAssetManifest<LokPetCardMetadata> = {
    schema: LOK_ASSET_SCHEMA,
    schemaVersion: LOK_ASSET_SCHEMA_VERSION,
    id,
    namespace,
    slug,
    kind: 'card',
    version: 1,
    name: edition?.name ?? character.name,
    description: edition?.description ?? character.description,
    rarity: edition?.rarityOverride ?? character.rarity,
    tags: [...character.tags, ...(edition?.tags ?? [])],
    acquisition: character.acquisition,
    ownership: exportedCardOwnershipRules(),
    provenance,
    metadata: {
      species: character.species,
      generation: character.generation,
      variant: edition?.id,
      cardNumber: character.number ? String(character.number).padStart(3, '0') : undefined,
      powerProfile: { ...character.cardStats },
    },
  };
  const errors = validateLokAssetManifest(manifest);
  if (errors.length) throw new Error(`Cannot export ${character.id} as a portable card: ${errors.join('; ')}`);

  const owned: LokOwnedAsset = {
    instanceId: `${manifest.id}#${ownedCard.instanceId}`,
    assetId: manifest.id,
    assetVersion: manifest.version,
    acquiredAt: ownedCard.acquiredAt,
    acquisitionMethod: ownedCard.acquisition,
    ownerId: null,
    sourceGame: provenance.sourceGame,
    quantity: 1,
    provenance,
    transferCount: ownedCard.transferCount,
  };
  return { format: LOK_CARD_EXCHANGE_FORMAT, formatVersion: LOK_CARD_EXCHANGE_FORMAT_VERSION, manifest, owned, printVariant: ownedCard.variant };
}

export function serializeLokCardExport(payload: LokPortableCardExport): string {
  return JSON.stringify(payload, null, 2);
}

function isLokPortableCardExport(value: unknown): value is LokPortableCardExport {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<LokPortableCardExport>;
  return candidate.format === LOK_CARD_EXCHANGE_FORMAT
    && candidate.formatVersion === LOK_CARD_EXCHANGE_FORMAT_VERSION
    && !!candidate.manifest
    && !!candidate.owned
    && typeof candidate.printVariant === 'string';
}

/** Parses (without importing) a pasted/uploaded export. Returns null for anything malformed or unrecognized. */
export function parseLokCardExport(raw: string): LokPortableCardExport | null {
  try {
    const value: unknown = JSON.parse(raw);
    return isLokPortableCardExport(value) ? value : null;
  } catch {
    return null;
  }
}

function foreignCharacterFromManifest(manifest: LokAssetManifest<LokPetCardMetadata>): LokDexCharacter {
  const metadata: Partial<LokPetCardMetadata> = manifest.metadata ?? {};
  return {
    id: manifest.id,
    number: 0,
    generation: metadata.generation ?? 1,
    setId: manifest.namespace,
    name: manifest.name,
    species: metadata.species ?? 'unknown',
    description: manifest.description || `A LOKdex character visiting from ${manifest.provenance.sourceGame}.`,
    rarity: manifest.rarity,
    // Cross-game imports don't carry Spend It All's own affinity/archetype vocabulary;
    // 'mystery'/'mystic' read intentionally as "not yet categorized" rather than a guess.
    affinity: 'mystery',
    archetype: 'mystic',
    acquisition: ['trade'],
    discoveryHint: `Arrived from ${manifest.provenance.sourceGame}.`,
    cardStats: { power: 50, wit: 50, hustle: 50, luck: 50, resilience: 50 },
    tags: [...(manifest.tags ?? []), 'cross-game'],
    sourceGame: manifest.provenance.sourceGame,
  };
}

export type LokCardImportResult =
  | { success: true; collection: LokDexCollection; character: LokDexCharacter; alreadyOwned: boolean }
  | { success: false; error: string };

/**
 * Accepts a portable card export from another game into this LOKdex
 * collection. Never fabricates gameplay power for a card this game didn't
 * author — imported cards get neutral placeholder cardStats and no companion
 * profile, per docs/LOKDEX_COMPANION_MODEL.md: card ownership alone never
 * grants advisor/gameplay behavior.
 */
export function importLokCardExport(collection: LokDexCollection, raw: string): LokCardImportResult {
  const payload = parseLokCardExport(raw);
  if (!payload) return { success: false, error: 'That is not a recognized LOK card export.' };

  const { manifest, owned, printVariant } = payload;
  const errors = validateLokAssetManifest(manifest);
  if (errors.length) return { success: false, error: `Invalid card manifest: ${errors.join('; ')}` };
  if (manifest.kind !== 'card') return { success: false, error: 'Only card-kind LOK assets can be imported into the LOKdex.' };
  if (manifest.namespace === DEFAULT_LOK_NAMESPACE) return { success: false, error: "This card already belongs to Spend It All's own LOKdex — nothing to import." };

  if (collection.cards.some((card) => card.instanceId === owned.instanceId)) {
    const existing = resolveLokDexCharacter(collection, manifest.id) ?? foreignCharacterFromManifest(manifest);
    return { success: true, collection, character: existing, alreadyOwned: true };
  }

  const character = foreignCharacterFromManifest(manifest);
  let next = upsertForeignLokDexCharacter(collection, character);
  next = grantLokDexCard(next, character.id, 'trade', {
    instanceId: owned.instanceId,
    variant: printVariant,
    releaseId: manifest.namespace,
    sourceGame: manifest.provenance.sourceGame,
    generationSeed: manifest.provenance.generationSeed,
    tradeLocked: true,
  });
  return { success: true, collection: next, character, alreadyOwned: false };
}
