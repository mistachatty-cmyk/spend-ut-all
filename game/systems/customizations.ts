import { allCustomizations, customizationById } from '@/data/customizations';
import type { AcquisitionMethod, CustomizationDefinition, CustomizationInventory, CustomizationKind } from '../customization-types';
import type { GameState } from '../types';

export const CUSTOMIZATION_KEY = 'spend-it-all-customization-v1';
export const CUSTOMIZATION_VERSION = 1;

const starterIds = allCustomizations.filter((entry) => entry.acquisition.includes('starter')).map((entry) => entry.id);
const darkThemeKeys = new Set(['midnight','executive-glass','market-terminal','neon-pulse','aurora-ledger','deep-ocean','retrofuture','gilded-empire','orbital-command','living-city','singularity-finance','quantum-casino','lunar-office']);

export function createCustomizationInventory(now = Date.now()): CustomizationInventory {
  return {
    version: CUSTOMIZATION_VERSION,
    ownedIds: [...starterIds],
    equipped: {
      themeId: 'theme-classic-ledger',
      hudId: 'hud-default',
      moneyCounterId: 'counter-smooth',
      backgroundId: null,
      profileFrameId: null,
      titleStyleId: null,
      effectId: null,
      petId: 'pet-lok-slime',
      petAccessoryIds: [],
    },
    unlocks: Object.fromEntries(starterIds.map((id) => [id, { acquiredAt: now, method: 'starter' as const }])),
  };
}

function validOwnedIds(ids: unknown) {
  if (!Array.isArray(ids)) return [];
  const valid = new Set(allCustomizations.map((entry) => entry.id));
  return ids.filter((id): id is string => typeof id === 'string' && valid.has(id));
}

function validEquipped(id: unknown, kind: CustomizationKind, owned: Set<string>) {
  if (typeof id !== 'string' || !owned.has(id)) return null;
  return customizationById(id)?.kind === kind ? id : null;
}

export function normalizeCustomizationInventory(value?: Partial<CustomizationInventory> | null): CustomizationInventory {
  const base = createCustomizationInventory();
  const ownedIds = Array.from(new Set([...starterIds, ...validOwnedIds(value?.ownedIds)]));
  const owned = new Set(ownedIds);
  const source = value?.equipped ?? base.equipped;
  const unlocks: CustomizationInventory['unlocks'] = { ...base.unlocks };
  if (value?.unlocks && typeof value.unlocks === 'object') {
    for (const [id, record] of Object.entries(value.unlocks)) {
      if (!owned.has(id) || !record || typeof record !== 'object') continue;
      unlocks[id] = { acquiredAt: Number.isFinite(record.acquiredAt) ? record.acquiredAt : Date.now(), method: record.method ?? 'starter' };
    }
  }
  return {
    version: CUSTOMIZATION_VERSION,
    ownedIds,
    unlocks,
    equipped: {
      themeId: validEquipped(source.themeId, 'theme', owned) ?? 'theme-classic-ledger',
      hudId: validEquipped(source.hudId, 'hud', owned) ?? 'hud-default',
      moneyCounterId: validEquipped(source.moneyCounterId, 'money-counter', owned) ?? 'counter-smooth',
      backgroundId: validEquipped(source.backgroundId, 'background', owned),
      profileFrameId: validEquipped(source.profileFrameId, 'profile-frame', owned),
      titleStyleId: validEquipped(source.titleStyleId, 'title-style', owned),
      effectId: validEquipped(source.effectId, 'effect', owned),
      petId: validEquipped(source.petId, 'pet', owned) ?? 'pet-lok-slime',
      petAccessoryIds: Array.isArray(source.petAccessoryIds) ? source.petAccessoryIds.filter((id) => owned.has(id) && customizationById(id)?.kind === 'pet-accessory') : [],
    },
  };
}

export function loadCustomizationInventory() {
  if (typeof window === 'undefined') return createCustomizationInventory();
  const raw = window.localStorage.getItem(CUSTOMIZATION_KEY);
  if (!raw) return createCustomizationInventory();
  try { return normalizeCustomizationInventory(JSON.parse(raw)); }
  catch { window.localStorage.removeItem(CUSTOMIZATION_KEY); return createCustomizationInventory(); }
}

export function saveCustomizationInventory(inventory: CustomizationInventory) {
  const normalized = normalizeCustomizationInventory(inventory);
  if (typeof window !== 'undefined') window.localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(normalized));
  return normalized;
}

export function grantCustomization(inventory: CustomizationInventory, id: string, method: AcquisitionMethod, now = Date.now()) {
  const definition = customizationById(id);
  if (!definition) return normalizeCustomizationInventory(inventory);
  const current = normalizeCustomizationInventory(inventory);
  if (current.ownedIds.includes(id)) return current;
  return normalizeCustomizationInventory({ ...current, ownedIds: [...current.ownedIds, id], unlocks: { ...current.unlocks, [id]: { acquiredAt: now, method } } });
}

export function syncCustomizationUnlocks(inventory: CustomizationInventory, state: GameState, now = Date.now()) {
  let next = normalizeCustomizationInventory(inventory);
  for (const item of allCustomizations) {
    if (next.ownedIds.includes(item.id) || !item.requirementId) continue;
    if (item.acquisition.includes('achievement') && state.runAchievements?.[item.requirementId]) next = grantCustomization(next, item.id, 'achievement', now);
    if (item.requirementId === 'region-planetary' && state.regionLevel >= 5) next = grantCustomization(next, item.id, 'scenario', now);
  }
  return next;
}

function equippedFieldForKind(kind: CustomizationKind) {
  switch (kind) {
    case 'theme': return 'themeId' as const;
    case 'hud': return 'hudId' as const;
    case 'money-counter': return 'moneyCounterId' as const;
    case 'background': return 'backgroundId' as const;
    case 'profile-frame': return 'profileFrameId' as const;
    case 'title-style': return 'titleStyleId' as const;
    case 'effect': return 'effectId' as const;
    case 'pet': return 'petId' as const;
    default: return null;
  }
}

export function equipCustomization(inventory: CustomizationInventory, id: string) {
  const current = normalizeCustomizationInventory(inventory);
  const item = customizationById(id);
  if (!item || !current.ownedIds.includes(id)) return current;
  if (item.kind === 'pet-accessory') {
    const equipped = current.equipped.petAccessoryIds.includes(id);
    return normalizeCustomizationInventory({ ...current, equipped: { ...current.equipped, petAccessoryIds: equipped ? current.equipped.petAccessoryIds.filter((entry) => entry !== id) : [...current.equipped.petAccessoryIds, id] } });
  }
  const field = equippedFieldForKind(item.kind);
  if (!field) return current;
  return normalizeCustomizationInventory({ ...current, equipped: { ...current.equipped, [field]: id } });
}

export function isEquipped(inventory: CustomizationInventory, item: CustomizationDefinition) {
  if (item.kind === 'pet-accessory') return inventory.equipped.petAccessoryIds.includes(item.id);
  const field = equippedFieldForKind(item.kind);
  return field ? inventory.equipped[field] === item.id : false;
}

function cosmeticClass(id: string | null | undefined, prefix: string) {
  const key = customizationById(id)?.previewKey;
  return key ? `${prefix}-${key}` : '';
}

/** Returns the complete visual class bundle for the active cosmetic loadout. */
export function themeClass(inventory: CustomizationInventory) {
  const themeKey = customizationById(inventory.equipped.themeId)?.previewKey ?? 'classic-ledger';
  return [
    darkThemeKeys.has(themeKey) ? 'midnight' : '',
    `theme-${themeKey}`,
    cosmeticClass(inventory.equipped.backgroundId, 'background'),
    cosmeticClass(inventory.equipped.hudId, 'hud'),
    cosmeticClass(inventory.equipped.profileFrameId, 'frame'),
    cosmeticClass(inventory.equipped.titleStyleId, 'title'),
    cosmeticClass(inventory.equipped.effectId, 'effect'),
  ].filter(Boolean).join(' ');
}

export function moneyCounterClass(inventory: CustomizationInventory) {
  return `counter-${customizationById(inventory.equipped.moneyCounterId)?.previewKey ?? 'smooth'}`;
}

export function hudClass(inventory: CustomizationInventory) {
  return cosmeticClass(inventory.equipped.hudId, 'hud') || 'hud-default';
}
