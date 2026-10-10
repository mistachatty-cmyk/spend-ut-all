import { lokPets } from '@/data/customizations';
import { LOKPACKS_BY_ID, type LokPackId } from '@/data/lokpacks';
import type { CustomizationInventory, LokPetDefinition } from '../customization-types';
import type { GameState } from '../types';
import { grantCustomization, normalizeCustomizationInventory } from './customizations';

/** Adds sealed LokPacks to the inventory. Card packs never come through here. */
export function grantLokPack(inventory: CustomizationInventory, packId: LokPackId, count = 1) {
  const current = normalizeCustomizationInventory(inventory);
  if (!(packId in LOKPACKS_BY_ID) || count < 1) return current;
  return normalizeCustomizationInventory({ ...current, sealedLokPacks: { ...current.sealedLokPacks, [packId]: (current.sealedLokPacks[packId] ?? 0) + count } });
}

/**
 * Achievement and scenario pets pay out one LokPack instead of the pet itself.
 * The claim list makes the reward one-time, since unlock checks run on every sync.
 */
export function claimLokPackForPet(inventory: CustomizationInventory, petId: string, packId: LokPackId) {
  const current = normalizeCustomizationInventory(inventory);
  if (current.ownedIds.includes(petId) || current.packClaimedPetIds.includes(petId)) return current;
  return grantLokPack({ ...current, packClaimedPetIds: [...current.packClaimedPetIds, petId] }, packId);
}

/** Pets a LokPack can roll: every non-starter pet whose lifetime-LOK gate is met. */
export function lokPackPool(lifetimeEarned: number): LokPetDefinition[] {
  return lokPets.filter((pet) => !pet.acquisition.includes('starter') && (pet.lokLifetimeRequired ?? 0) <= lifetimeEarned);
}

/** Weighted rarity first, then a uniform pick inside that rarity. `rng` returns [0, 1). */
export function rollLokPackPet(packId: LokPackId, pool: LokPetDefinition[], rng: () => number = Math.random): LokPetDefinition | null {
  if (!pool.length) return null;
  const weights = LOKPACKS_BY_ID[packId].weights;
  const rarities = [...new Set(pool.map((pet) => pet.rarity))].filter((rarity) => (weights[rarity] ?? 0) > 0);
  if (!rarities.length) return pool[Math.floor(rng() * pool.length)] ?? null;
  const total = rarities.reduce((sum, rarity) => sum + (weights[rarity] ?? 0), 0);
  let roll = rng() * total;
  let picked = rarities[rarities.length - 1];
  for (const rarity of rarities) {
    const weight = weights[rarity] ?? 0;
    if (roll < weight) { picked = rarity; break; }
    roll -= weight;
  }
  const candidates = pool.filter((pet) => pet.rarity === picked);
  return candidates[Math.floor(rng() * candidates.length)] ?? null;
}

export type LokPackOpenResult = { inventory: CustomizationInventory; pet: LokPetDefinition | null; duplicate: boolean };

/**
 * Opens one sealed pack. Prefers pets the player does not own yet; if every
 * eligible pet is already owned, the roll is a duplicate and grants nothing new.
 * With no eligible pet at all, the pack stays sealed.
 */
export function openLokPack(inventory: CustomizationInventory, packId: LokPackId, lifetimeEarned: number, rng: () => number = Math.random): LokPackOpenResult {
  const current = normalizeCustomizationInventory(inventory);
  const sealed = current.sealedLokPacks[packId] ?? 0;
  const pool = lokPackPool(lifetimeEarned);
  if (sealed < 1 || !pool.length) return { inventory: current, pet: null, duplicate: false };
  const unowned = pool.filter((pet) => !current.ownedIds.includes(pet.id));
  const pet = rollLokPackPet(packId, unowned.length ? unowned : pool, rng);
  const remaining = { ...current.sealedLokPacks };
  if (sealed > 1) remaining[packId] = sealed - 1;
  else delete remaining[packId];
  const afterOpen = normalizeCustomizationInventory({ ...current, sealedLokPacks: remaining });
  if (!pet) return { inventory: afterOpen, pet: null, duplicate: false };
  if (afterOpen.ownedIds.includes(pet.id)) return { inventory: afterOpen, pet, duplicate: true };
  return { inventory: grantCustomization(afterOpen, pet.id, 'lokpack'), pet, duplicate: false };
}

/** Applies achievement and scenario unlocks to pets as LokPack rewards. Call after `syncCustomizationUnlocks`. */
export function syncLokPackUnlocks(inventory: CustomizationInventory, state: GameState) {
  let next = normalizeCustomizationInventory(inventory);
  for (const pet of lokPets) {
    if (!pet.requirementId) continue;
    if (pet.acquisition.includes('achievement') && state.runAchievements?.[pet.requirementId]) next = claimLokPackForPet(next, pet.id, 'lokpack-prime');
    if (pet.requirementId === 'region-planetary' && state.regionLevel >= 5) next = claimLokPackForPet(next, pet.id, 'lokpack-prime');
  }
  return next;
}
