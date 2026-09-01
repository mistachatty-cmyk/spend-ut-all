import type { LokAssetRarity, LokPetCardMetadata } from '../assets/types';

export type GeneratedPetBlueprint = {
  seed: string;
  generation: number;
  species: string;
  body: string;
  ears: string;
  eyes: string;
  pattern: string;
  palette: string;
  aura: string | null;
  temperament: string;
  mutation: string | null;
  rarity: LokAssetRarity;
  metadata: LokPetCardMetadata;
};

const pools = {
  species: ['slime','cat','fox','gecko','owl','bot','wolf','moth','axolotl','sprite'],
  body: ['round','bean','long','compact','fluffy','armored'],
  ears: ['none','round','pointed','long','antenna','fin'],
  eyes: ['dot','sleepy','bright','visor','star','mischief'],
  pattern: ['solid','spots','stripe','split','constellation','glitch'],
  palette: ['mint','ember','moon','cafe','terminal','neon','aurora','gold'],
  aura: ['spark','pixel-dust','soft-glow','orbit-ring','scanline'],
  temperament: ['curious','calm','bold','sleepy','chaotic','loyal','clever','dramatic'],
  mutation: ['tiny-crown','double-tail','star-eye','holo-edge','gold-paws','moon-mark'],
};

function hashSeed(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function pick<T>(values: readonly T[], next: () => number) {
  return values[Math.floor(next() * values.length) % values.length];
}

function rarityFromRoll(roll: number): LokAssetRarity {
  if (roll < 0.0005) return 'mythic';
  if (roll < 0.003) return 'legendary';
  if (roll < 0.02) return 'epic';
  if (roll < 0.10) return 'rare';
  if (roll < 0.32) return 'uncommon';
  return 'common';
}

export function generatePetBlueprint(seed: string, generation = 1): GeneratedPetBlueprint {
  const next = rng(`${generation}:${seed}`);
  const rarity = rarityFromRoll(next());
  const species = pick(pools.species, next);
  const body = pick(pools.body, next);
  const ears = pick(pools.ears, next);
  const eyes = pick(pools.eyes, next);
  const pattern = pick(pools.pattern, next);
  const palette = pick(pools.palette, next);
  const temperament = pick(pools.temperament, next);
  const aura = ['epic','legendary','mythic'].includes(rarity) ? pick(pools.aura, next) : null;
  const mutation = ['legendary','mythic'].includes(rarity) || next() < 0.025 ? pick(pools.mutation, next) : null;
  const traits = [body, ears, eyes, pattern, palette, temperament, aura, mutation].filter((value): value is string => !!value);
  return {
    seed,
    generation,
    species,
    body,
    ears,
    eyes,
    pattern,
    palette,
    aura,
    temperament,
    mutation,
    rarity,
    metadata: {
      species,
      generation,
      variant: `${palette}-${pattern}`,
      personality: temperament,
      traits,
      evolutionFamily: species,
      powerProfile: {},
    },
  };
}

export function generatedPetPreviewId(seed: string, generation = 1) {
  return `preview:g${generation}:${hashSeed(seed).toString(36)}`;
}
