import { badges, collectibleSets, collectibles } from '@/data/meta';
import type { GameState } from '../types';
import type { MetaMetrics, MetaState } from '../meta-types';

export const META_VERSION = 2;

export function createMetaState(): MetaState {
  return { version: META_VERSION, badges: [], collectibles: [], completedSets: [], titles: [], equippedTitle: null, showcaseBadges: [], discoveries: [], scenariosCompleted: [] };
}

export function normalizeMetaState(input: Partial<MetaState> | null | undefined): MetaState {
  const base = createMetaState();
  if (!input) return base;
  return {
    ...base,
    ...input,
    version: META_VERSION,
    badges: Array.from(new Set(input.badges ?? [])),
    collectibles: Array.from(new Set(input.collectibles ?? [])),
    completedSets: Array.from(new Set(input.completedSets ?? [])),
    titles: Array.from(new Set(input.titles ?? [])),
    showcaseBadges: Array.from(new Set(input.showcaseBadges ?? [])).slice(0, 3),
    discoveries: input.discoveries ?? [],
    scenariosCompleted: Array.from(new Set(input.scenariosCompleted ?? [])),
  };
}

function addDiscovery(meta: MetaState, id: string, kind: 'badge' | 'collectible' | 'set', state: GameState) {
  if (meta.discoveries.some((entry) => entry.id === id && entry.kind === kind)) return meta;
  return {
    ...meta,
    discoveries: [{
      id,
      kind,
      discoveredAt: Date.now(),
      scenarioId: state.scenarioId,
      snapshot: {
        cash: state.cash,
        totalSpent: state.totalSpent,
        houseLevel: state.houseLevel,
        townLevel: state.townLevel,
        regionLevel: state.regionLevel,
      },
    }, ...meta.discoveries].slice(0, 150),
  };
}

function awardBadge(meta: MetaState, id: string, state: GameState) {
  if (meta.badges.includes(id)) return meta;
  const definition = badges.find((entry) => entry.id === id);
  let next = { ...meta, badges: [...meta.badges, id] };
  if (definition?.titleReward && !next.titles.includes(definition.titleReward)) next = { ...next, titles: [...next.titles, definition.titleReward] };
  return addDiscovery(next, id, 'badge', state);
}

function awardCollectible(meta: MetaState, id: string, state: GameState) {
  if (meta.collectibles.includes(id)) return meta;
  return addDiscovery({ ...meta, collectibles: [...meta.collectibles, id] }, id, 'collectible', state);
}

function completeSets(meta: MetaState, state: GameState) {
  let next = meta;
  for (const set of collectibleSets) {
    if (next.completedSets.includes(set.id)) continue;
    if (!set.collectibleIds.every((id) => next.collectibles.includes(id))) continue;
    next = { ...next, completedSets: [...next.completedSets, set.id] };
    if (set.titleReward && !next.titles.includes(set.titleReward)) next = { ...next, titles: [...next.titles, set.titleReward] };
    next = addDiscovery(next, set.id, 'set', state);
  }
  return next;
}

export function syncMetaProgression(metaInput: MetaState, state: GameState, metrics: MetaMetrics): MetaState {
  let meta = normalizeMetaState(metaInput);

  if (state.totalSpent >= 1_000_000) meta = awardBadge(meta, 'first-million', state);
  if (state.totalSpent >= 1_000_000_000) meta = awardBadge(meta, 'billion-burner', state);
  if (state.totalSpent >= 1_000_000_000_000) meta = awardBadge(meta, 'trillion-burner', state);
  if (metrics.incomePerSecond >= 100_000) meta = awardBadge(meta, 'cashflow-king', state);
  if (state.townLevel >= 5) meta = awardBadge(meta, 'city-founder', state);
  if (state.regionLevel >= 5) meta = awardBadge(meta, 'planetary', state);
  if (metrics.totalOwned >= 100) meta = awardBadge(meta, 'collector-100', state);

  if (state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000) meta = awardBadge(meta, 'self-made-millionaire', state);
  if (state.scenarioId === 'nothing' && metrics.netWorth >= 1_000_000_000) meta = awardBadge(meta, 'self-made-billionaire', state);
  if (state.scenarioId === 'nothing' && state.totalSold === 0 && metrics.netWorth >= 1_000_000) meta = awardBadge(meta, 'never-sell', state);
  if (state.scenarioId === 'ten-x' && metrics.netWorth >= 1_000_000) meta = awardBadge(meta, 'wealth-10x', state);
  if (state.scenarioId === 'hundred-x' && metrics.netWorth >= 10_000_000) meta = awardBadge(meta, 'wealth-100x', state);
  if (state.scenarioId === 'thousand-x' && metrics.netWorth >= 100_000_000) meta = awardBadge(meta, 'wealth-1000x', state);

  if (metrics.scenarioComplete) {
    meta = awardBadge(meta, 'scenario-finisher', state);
    if (!meta.scenariosCompleted.includes(state.scenarioId)) meta = { ...meta, scenariosCompleted: [...meta.scenariosCompleted, state.scenarioId] };
  }
  if ((state.owned['yacht'] ?? 0) >= 1 && state.houseLevel === 0) meta = awardBadge(meta, 'yacht-before-house', state);
  if ((state.owned['gaming-pc'] ?? 0) >= 404) meta = awardBadge(meta, 'pc-404', state);

  if ((state.owned['coffee'] ?? 0) >= 1) meta = awardCollectible(meta, 'first-coffee-receipt', state);
  if ((state.owned['coffee'] ?? 0) >= 1000) meta = awardCollectible(meta, 'diamond-coffee-cup', state);
  if ((state.owned['gaming-pc'] ?? 0) >= 404) meta = awardCollectible(meta, '404-trophy', state);
  if ((state.owned['supercar'] ?? 0) >= 1) meta = awardCollectible(meta, 'first-supercar-key', state);
  if ((state.owned['private-jet'] ?? 0) >= 1) meta = awardCollectible(meta, 'jet-tail-number', state);
  if ((state.owned['yacht'] ?? 0) >= 1) meta = awardCollectible(meta, 'yacht-bell', state);
  if (state.townLevel >= 5) meta = awardCollectible(meta, 'city-key', state);
  if (state.regionLevel >= 5) meta = awardCollectible(meta, 'planetary-globe', state);
  if ((state.owned['moon-colony'] ?? 0) >= 1) meta = awardCollectible(meta, 'moon-dust-vial', state);
  if (state.cash >= 0 && state.cash < 1) meta = awardCollectible(meta, 'zero-balance-coin', state);
  if ((state.owned['yacht'] ?? 0) >= 1 && state.houseLevel === 0) meta = awardCollectible(meta, 'questionable-priorities-plaque', state);

  return completeSets(meta, state);
}

export function equipTitle(meta: MetaState, title: string | null): MetaState {
  if (title && !meta.titles.includes(title)) return meta;
  return { ...meta, equippedTitle: title };
}

export function toggleShowcaseBadge(meta: MetaState, badgeId: string): MetaState {
  if (!meta.badges.includes(badgeId)) return meta;
  const exists = meta.showcaseBadges.includes(badgeId);
  if (exists) return { ...meta, showcaseBadges: meta.showcaseBadges.filter((id) => id !== badgeId) };
  return { ...meta, showcaseBadges: [...meta.showcaseBadges, badgeId].slice(-3) };
}

export function collectionCompletion(meta: MetaState) {
  return collectibles.length ? meta.collectibles.length / collectibles.length : 0;
}
