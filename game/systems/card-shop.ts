import { CARD_SHOP_FREE_PACK_COOLDOWN_MS, CARD_SHOP_STARTER_CREDITS, cardShopProducts } from '@/data/card-shop';
import { lokDexEntries } from '@/data/lokdex';
import type { CardShopProduct, CardShopPull, CardShopState } from '../card-shop-types';
import type { CustomizationRarity } from '../customization-types';
import type { LokDexCardVariant, LokDexCollection, LokDexOwnedCard } from '../lokdex-types';
import { grantLokDexCard, normalizeLokDexCollection } from './lokdex';

export const CARD_SHOP_KEY = 'spend-it-all-card-shop-v1';
export const CARD_SHOP_VERSION = 1;
export const CARD_COLLECTION_REWARDS = [
  { discovered:5, credits:100 },
  { discovered:10, credits:175 },
  { discovered:15, credits:250 },
  { discovered:20, credits:400 },
  { discovered:24, credits:750 },
] as const;

const rarityRank: Record<CustomizationRarity, number> = { common:0, uncommon:1, rare:2, epic:3, legendary:4, mythic:5, secret:6 };
const rarityRecycle: Record<CustomizationRarity, number> = { common:8, uncommon:14, rare:28, epic:65, legendary:150, mythic:400, secret:600 };
const variantMultiplier: Record<LokDexCardVariant, number> = { standard:1, foil:1.5, holo:2.5, negative:3, glitch:4, gold:8, event:5 };

export function createCardShopState(): CardShopState {
  return {
    version:CARD_SHOP_VERSION,
    credits:0,
    lifetimeCreditsEarned:0,
    lifetimeCreditsSpent:0,
    packsOpened:0,
    cardsPulled:0,
    cardsRecycled:0,
    creditsFromRecycling:0,
    creditsFromCollectionRewards:0,
    claimedCollectionMilestones:[],
    ownedDeckBlueprintIds:[],
    lastFreePackAt:0,
    freePacksClaimed:0,
    starterGrantClaimed:false,
    recentPulls:[],
  };
}

export function normalizeCardShopState(input?: Partial<CardShopState> | null): CardShopState {
  const base = createCardShopState();
  return {
    ...base,
    ...input,
    version:CARD_SHOP_VERSION,
    credits:Math.max(0, Number.isFinite(input?.credits) ? Number(input!.credits) : 0),
    lifetimeCreditsEarned:Math.max(0, Number.isFinite(input?.lifetimeCreditsEarned) ? Number(input!.lifetimeCreditsEarned) : 0),
    lifetimeCreditsSpent:Math.max(0, Number.isFinite(input?.lifetimeCreditsSpent) ? Number(input!.lifetimeCreditsSpent) : 0),
    packsOpened:Math.max(0, Math.floor(Number.isFinite(input?.packsOpened) ? Number(input!.packsOpened) : 0)),
    cardsPulled:Math.max(0, Math.floor(Number.isFinite(input?.cardsPulled) ? Number(input!.cardsPulled) : 0)),
    cardsRecycled:Math.max(0, Math.floor(Number.isFinite(input?.cardsRecycled) ? Number(input!.cardsRecycled) : 0)),
    creditsFromRecycling:Math.max(0, Number.isFinite(input?.creditsFromRecycling) ? Number(input!.creditsFromRecycling) : 0),
    creditsFromCollectionRewards:Math.max(0, Number.isFinite(input?.creditsFromCollectionRewards) ? Number(input!.creditsFromCollectionRewards) : 0),
    claimedCollectionMilestones:Array.isArray(input?.claimedCollectionMilestones) ? [...new Set(input!.claimedCollectionMilestones.filter((value): value is number => Number.isFinite(value)).map((value) => Math.floor(value)))] : [],
    ownedDeckBlueprintIds:Array.isArray(input?.ownedDeckBlueprintIds) ? [...new Set(input!.ownedDeckBlueprintIds.filter((id): id is string => typeof id === 'string'))] : [],
    lastFreePackAt:Math.max(0, Number.isFinite(input?.lastFreePackAt) ? Number(input!.lastFreePackAt) : 0),
    freePacksClaimed:Math.max(0, Math.floor(Number.isFinite(input?.freePacksClaimed) ? Number(input!.freePacksClaimed) : 0)),
    starterGrantClaimed:!!input?.starterGrantClaimed,
    recentPulls:Array.isArray(input?.recentPulls) ? input!.recentPulls.slice(0, 24) : [],
  };
}

export function loadCardShopState() {
  if (typeof window === 'undefined') return createCardShopState();
  try {
    const raw = localStorage.getItem(CARD_SHOP_KEY);
    return raw ? normalizeCardShopState(JSON.parse(raw)) : createCardShopState();
  } catch { return createCardShopState(); }
}

export function saveCardShopState(input: CardShopState) {
  const next = normalizeCardShopState(input);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(CARD_SHOP_KEY, JSON.stringify(next)); } catch {}
  }
  return next;
}

export function ensureCardShopStarterGrant(input: CardShopState) {
  const state = normalizeCardShopState(input);
  if (state.starterGrantClaimed) return state;
  return {
    ...state,
    credits:state.credits + CARD_SHOP_STARTER_CREDITS,
    lifetimeCreditsEarned:state.lifetimeCreditsEarned + CARD_SHOP_STARTER_CREDITS,
    starterGrantClaimed:true,
  };
}

export function applyCardCollectionMilestones(shopInput: CardShopState, collectionInput: LokDexCollection) {
  let shop = normalizeCardShopState(shopInput);
  const collection = normalizeLokDexCollection(collectionInput);
  const discovered = new Set(collection.discoveredIds).size;
  const newlyClaimed = CARD_COLLECTION_REWARDS.filter((reward) => discovered >= reward.discovered && !shop.claimedCollectionMilestones.includes(reward.discovered));
  if (!newlyClaimed.length) return { shop, creditsAwarded:0, milestones:[] as number[] };
  const creditsAwarded = newlyClaimed.reduce((sum, reward) => sum + reward.credits, 0);
  shop = normalizeCardShopState({
    ...shop,
    credits:shop.credits + creditsAwarded,
    lifetimeCreditsEarned:shop.lifetimeCreditsEarned + creditsAwarded,
    creditsFromCollectionRewards:shop.creditsFromCollectionRewards + creditsAwarded,
    claimedCollectionMilestones:[...shop.claimedCollectionMilestones, ...newlyClaimed.map((reward) => reward.discovered)],
  });
  return { shop, creditsAwarded, milestones:newlyClaimed.map((reward) => reward.discovered) };
}

function weightedCharacter(product: CardShopProduct, guarantee = false) {
  let pool = lokDexEntries.filter((entry) => entry.rarity !== 'secret');
  const g = product.guarantee;
  if (guarantee && g?.minRarity) {
    const min = rarityRank[g.minRarity];
    const filtered = pool.filter((entry) => rarityRank[entry.rarity] >= min);
    if (filtered.length) pool = filtered;
  }
  const affinity = g?.affinity ?? [];
  const archetype = g?.archetype ?? [];
  const weighted = pool.flatMap((entry) => {
    let weight = 1;
    if (affinity.includes(entry.affinity)) weight += 4;
    if (archetype.includes(entry.archetype)) weight += 2;
    if (entry.rarity === 'common') weight += 8;
    else if (entry.rarity === 'uncommon') weight += 5;
    else if (entry.rarity === 'rare') weight += 2;
    else if (entry.rarity === 'epic') weight += .65;
    else if (entry.rarity === 'legendary') weight += .18;
    else if (entry.rarity === 'mythic') weight += .025;
    return Array.from({ length:Math.max(1, Math.round(weight * 10)) }, () => entry);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] ?? pool[0];
}

function rollVariant(boost = 1): LokDexCardVariant {
  const roll = Math.random();
  const gold = .002 * boost;
  const glitch = .005 * boost;
  const negative = .009 * boost;
  const holo = .025 * boost;
  const foil = .07 * boost;
  if (roll < gold) return 'gold';
  if (roll < gold + glitch) return 'glitch';
  if (roll < gold + glitch + negative) return 'negative';
  if (roll < gold + glitch + negative + holo) return 'holo';
  if (roll < gold + glitch + negative + holo + foil) return 'foil';
  return 'standard';
}

function pullProduct(collectionInput: LokDexCollection, product: CardShopProduct) {
  let collection = normalizeLokDexCollection(collectionInput);
  const pulls: CardShopPull[] = [];
  const boost = product.guarantee?.variantBoost ?? 1;
  const fixed = product.fixedCharacterIds ?? [];
  for (let index = 0; index < product.cardCount; index += 1) {
    const fixedId = fixed[index];
    const character = fixedId ? lokDexEntries.find((entry) => entry.id === fixedId) ?? weightedCharacter(product, index === product.cardCount - 1) : weightedCharacter(product, index === product.cardCount - 1);
    const variant = rollVariant(boost);
    const wasDiscovered = collection.discoveredIds.includes(character.id);
    const instanceId = `shop:${Date.now()}:${index}:${Math.random().toString(36).slice(2,8)}`;
    collection = grantLokDexCard(collection, character.id, 'pack', { instanceId, variant, sourceGame:'spend-it-all', tradeLocked:true });
    pulls.push({ instanceId, characterId:character.id, variant, rarity:character.rarity, isNewCharacter:!wasDiscovered });
  }
  return { collection, pulls };
}

export function purchaseCardProduct(shopInput: CardShopState, collectionInput: LokDexCollection, productId: string) {
  let shop = ensureCardShopStarterGrant(shopInput);
  const product = cardShopProducts.find((entry) => entry.id === productId);
  if (!product || shop.credits < product.priceCredits) return { success:false as const, shop, collection:normalizeLokDexCollection(collectionInput), pulls:[] as CardShopPull[] };
  const opened = pullProduct(collectionInput, product);
  const discoveryBonus = opened.pulls.filter((pull) => pull.isNewCharacter).reduce((sum, pull) => {
    const rarity = pull.rarity as CustomizationRarity;
    return sum + ({ common:5, uncommon:8, rare:12, epic:20, legendary:35, mythic:75, secret:100 }[rarity] ?? 5);
  }, 0);
  shop = normalizeCardShopState({
    ...shop,
    credits:shop.credits - product.priceCredits + discoveryBonus,
    lifetimeCreditsSpent:shop.lifetimeCreditsSpent + product.priceCredits,
    lifetimeCreditsEarned:shop.lifetimeCreditsEarned + discoveryBonus,
    packsOpened:shop.packsOpened + 1,
    cardsPulled:shop.cardsPulled + opened.pulls.length,
    ownedDeckBlueprintIds:product.deckBlueprintId ? [...shop.ownedDeckBlueprintIds, product.deckBlueprintId] : shop.ownedDeckBlueprintIds,
    recentPulls:[...opened.pulls, ...shop.recentPulls].slice(0,24),
  });
  const milestone = applyCardCollectionMilestones(shop, opened.collection);
  shop = milestone.shop;
  return { success:true as const, shop, collection:opened.collection, pulls:opened.pulls, discoveryBonus, milestoneBonus:milestone.creditsAwarded, milestones:milestone.milestones };
}

export function freePackReady(shopInput: CardShopState, now = Date.now()) {
  const shop = normalizeCardShopState(shopInput);
  return shop.lastFreePackAt === 0 || now - shop.lastFreePackAt >= CARD_SHOP_FREE_PACK_COOLDOWN_MS;
}

export function freePackRemainingMs(shopInput: CardShopState, now = Date.now()) {
  const shop = normalizeCardShopState(shopInput);
  return freePackReady(shop, now) ? 0 : Math.max(0, CARD_SHOP_FREE_PACK_COOLDOWN_MS - (now - shop.lastFreePackAt));
}

export function claimFreeCardPack(shopInput: CardShopState, collectionInput: LokDexCollection, now = Date.now()) {
  let shop = ensureCardShopStarterGrant(shopInput);
  if (!freePackReady(shop, now)) return { success:false as const, shop, collection:normalizeLokDexCollection(collectionInput), pulls:[] as CardShopPull[] };
  const product = cardShopProducts.find((entry) => entry.id === 'pack-street')!;
  const opened = pullProduct(collectionInput, { ...product, cardCount:3, guarantee:{ minRarity:'uncommon' } });
  shop = normalizeCardShopState({
    ...shop,
    lastFreePackAt:now,
    freePacksClaimed:shop.freePacksClaimed + 1,
    packsOpened:shop.packsOpened + 1,
    cardsPulled:shop.cardsPulled + opened.pulls.length,
    recentPulls:[...opened.pulls, ...shop.recentPulls].slice(0,24),
  });
  const milestone = applyCardCollectionMilestones(shop, opened.collection);
  return { success:true as const, shop:milestone.shop, collection:opened.collection, pulls:opened.pulls, milestoneBonus:milestone.creditsAwarded, milestones:milestone.milestones };
}

export function recycleValue(card: LokDexOwnedCard) {
  const character = lokDexEntries.find((entry) => entry.id === card.characterId);
  return character ? Math.max(1, Math.round(rarityRecycle[character.rarity] * variantMultiplier[card.variant])) : 1;
}

export function recycleDuplicateCard(shopInput: CardShopState, collectionInput: LokDexCollection, characterId: string) {
  const shop = ensureCardShopStarterGrant(shopInput);
  const collection = normalizeLokDexCollection(collectionInput);
  const copies = collection.cards.filter((card) => card.characterId === characterId).sort((a,b) => a.acquiredAt - b.acquiredAt);
  if (copies.length < 2) return { success:false as const, shop, collection, creditsGained:0 };
  const recyclable = copies.find((card) => !card.favorite) ?? copies[copies.length - 1];
  const creditsGained = recycleValue(recyclable);
  const nextCollection = { ...collection, cards:collection.cards.filter((card) => card.instanceId !== recyclable.instanceId) };
  const nextShop = normalizeCardShopState({
    ...shop,
    credits:shop.credits + creditsGained,
    lifetimeCreditsEarned:shop.lifetimeCreditsEarned + creditsGained,
    cardsRecycled:shop.cardsRecycled + 1,
    creditsFromRecycling:shop.creditsFromRecycling + creditsGained,
  });
  return { success:true as const, shop:nextShop, collection:nextCollection, creditsGained };
}
