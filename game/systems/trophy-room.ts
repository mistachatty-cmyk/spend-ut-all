import type { MetaState } from '../meta-types';

export type TrophyRoomTier = {
  level: number;
  name: string;
  emoji: string;
  requiredCollectibles: number;
  requiredSets: number;
  capacityLabel: string;
  description: string;
};

export const trophyRoomTiers: TrophyRoomTier[] = [
  { level: 0, name: 'Shelf in the Office', emoji: '🗄️', requiredCollectibles: 0, requiredSets: 0, capacityLabel: 'A few souvenirs', description: 'A humble shelf for the first strange things your empire leaves behind.' },
  { level: 1, name: 'Private Trophy Room', emoji: '🏆', requiredCollectibles: 2, requiredSets: 0, capacityLabel: 'Curated display', description: 'A dedicated room for badges, relics, plaques, and questionable financial decisions.' },
  { level: 2, name: 'Estate Gallery', emoji: '🖼️', requiredCollectibles: 5, requiredSets: 1, capacityLabel: 'Multiple collections', description: 'Your estate now has a real gallery with themed wings and provenance plaques.' },
  { level: 3, name: 'Empire Museum', emoji: '🏛️', requiredCollectibles: 8, requiredSets: 2, capacityLabel: 'Public museum', description: 'Your artifacts become a museum chronicling the economic history of your empire.' },
  { level: 4, name: 'World Archive', emoji: '🌐', requiredCollectibles: 10, requiredSets: 3, capacityLabel: 'Civilization archive', description: 'A global archive preserving the oddest milestones of your rise to planetary influence.' },
  { level: 5, name: 'Interplanetary Vault', emoji: '🪐', requiredCollectibles: 11, requiredSets: 4, capacityLabel: 'Off-world collection', description: 'The collection has outgrown Earth. Your rarest relics are preserved across worlds.' },
];

export function trophyRoomTier(meta: MetaState) {
  return trophyRoomTiers.reduce((best, tier) => {
    if (meta.collectibles.length >= tier.requiredCollectibles && meta.completedSets.length >= tier.requiredSets) return tier;
    return best;
  }, trophyRoomTiers[0]);
}

export function nextTrophyRoomTier(meta: MetaState) {
  const current = trophyRoomTier(meta);
  return trophyRoomTiers.find((tier) => tier.level === current.level + 1);
}

export function trophyRoomProgress(meta: MetaState) {
  const current = trophyRoomTier(meta);
  const next = nextTrophyRoomTier(meta);
  if (!next) return 1;
  const collectibleSpan = Math.max(1, next.requiredCollectibles - current.requiredCollectibles);
  const setSpan = Math.max(1, next.requiredSets - current.requiredSets);
  const collectibleProgress = Math.min(1, Math.max(0, meta.collectibles.length - current.requiredCollectibles) / collectibleSpan);
  const setProgress = next.requiredSets === current.requiredSets ? 1 : Math.min(1, Math.max(0, meta.completedSets.length - current.requiredSets) / setSpan);
  return Math.min(1, (collectibleProgress + setProgress) / 2);
}
