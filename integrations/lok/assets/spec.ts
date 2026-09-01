import type { LokAssetKind, LokAssetManifest, LokOwnedAsset } from './types';

export const LOK_ASSET_SCHEMA = 'lok.asset' as const;
export const LOK_ASSET_SCHEMA_VERSION = 1 as const;
export const DEFAULT_LOK_NAMESPACE = 'g6.spend-it-all';

const ID_PATTERN = /^[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;

export function makeLokAssetId(namespace: string, slug: string) {
  const safeNamespace = namespace.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!safeNamespace || !safeSlug) throw new Error('LOK asset namespace and slug are required.');
  return `${safeNamespace}:${safeSlug}`;
}

export function createLokAssetManifest(input: Omit<LokAssetManifest, 'schema' | 'schemaVersion' | 'id'> & { id?: string }): LokAssetManifest {
  const id = input.id ?? makeLokAssetId(input.namespace, input.slug);
  const manifest: LokAssetManifest = { ...input, id, schema: LOK_ASSET_SCHEMA, schemaVersion: LOK_ASSET_SCHEMA_VERSION };
  const errors = validateLokAssetManifest(manifest);
  if (errors.length) throw new Error(`Invalid LOK asset manifest: ${errors.join('; ')}`);
  return manifest;
}

export function validateLokAssetManifest(value: unknown): string[] {
  if (!value || typeof value !== 'object') return ['manifest must be an object'];
  const asset = value as Partial<LokAssetManifest>;
  const errors: string[] = [];
  if (asset.schema !== LOK_ASSET_SCHEMA) errors.push(`schema must equal ${LOK_ASSET_SCHEMA}`);
  if (asset.schemaVersion !== LOK_ASSET_SCHEMA_VERSION) errors.push(`schemaVersion must equal ${LOK_ASSET_SCHEMA_VERSION}`);
  if (typeof asset.id !== 'string' || !ID_PATTERN.test(asset.id)) errors.push('id must be namespace:slug using lowercase portable characters');
  if (typeof asset.namespace !== 'string' || !asset.namespace.trim()) errors.push('namespace is required');
  if (typeof asset.slug !== 'string' || !asset.slug.trim()) errors.push('slug is required');
  if (asset.id && asset.namespace && asset.slug && asset.id !== makeLokAssetId(asset.namespace, asset.slug)) errors.push('id must match namespace + slug');
  if (!asset.kind) errors.push('kind is required');
  if (!Number.isInteger(asset.version) || Number(asset.version) < 1) errors.push('version must be a positive integer');
  if (typeof asset.name !== 'string' || !asset.name.trim()) errors.push('name is required');
  if (!asset.rarity) errors.push('rarity is required');
  if (!Array.isArray(asset.acquisition) || asset.acquisition.length < 1) errors.push('at least one acquisition method is required');
  if (!asset.ownership) errors.push('ownership rules are required');
  if (!asset.provenance?.sourceGame) errors.push('provenance.sourceGame is required');
  return errors;
}

export function assetSupportsKind(asset: LokAssetManifest, kind: LokAssetKind) {
  return asset.kind === kind;
}

export function createLocalOwnedAsset(asset: LokAssetManifest, acquisitionMethod: LokOwnedAsset['acquisitionMethod'], now = Date.now()): LokOwnedAsset {
  return {
    instanceId: asset.ownership.uniqueInstance ? `${asset.id}#local-${now}-${Math.random().toString(36).slice(2, 9)}` : asset.id,
    assetId: asset.id,
    assetVersion: asset.version,
    acquiredAt: now,
    acquisitionMethod,
    ownerId: null,
    sourceGame: asset.provenance.sourceGame,
    quantity: 1,
    provenance: { ...asset.provenance, createdAt: asset.provenance.createdAt ?? now },
    transferCount: 0,
  };
}

export function canTransferAsset(asset: LokAssetManifest, owned: LokOwnedAsset) {
  if (owned.quantity <= 0) return false;
  if (asset.ownership.requiresServerAuthorityForTransfer) return false;
  return asset.ownership.transferPolicy === 'tradeable' || asset.ownership.transferPolicy === 'giftable';
}

export function portableAssetJson(asset: LokAssetManifest) {
  return JSON.stringify(asset);
}
