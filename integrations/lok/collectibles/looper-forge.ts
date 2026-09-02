import { generatePetBlueprint, generatedPetPreviewId, type GeneratedPetBlueprint } from './pet-generator';
import type { LooperHdKind, LooperHdRecipe } from '@/data/looper-hd-recipes';
import { productionAnimations, type LooperMotionSignature, type LooperProductionManifest } from '@/game/looper-production-types';

export type ForgedLooper = {
  id: string;
  blueprint: GeneratedPetBlueprint;
  recipe: LooperHdRecipe;
  manifest: LooperProductionManifest;
};

const paletteMap: Record<string, {base:string;light:string;dark:string;accent:string;glow:string}> = {
  mint:{base:'#58d67b',light:'#c8ffd0',dark:'#173a2a',accent:'#91f5a8',glow:'#5eff78'},
  ember:{base:'#d97545',light:'#ffd2a4',dark:'#49251c',accent:'#ffb454',glow:'#ff8e4d'},
  moon:{base:'#9fc9c5',light:'#e2f7f0',dark:'#303853',accent:'#84dfff',glow:'#adf2ff'},
  cafe:{base:'#b88459',light:'#f0d3b5',dark:'#4b3125',accent:'#e7b85b',glow:'#ffd280'},
  terminal:{base:'#4abf7a',light:'#b9ffd1',dark:'#173a2a',accent:'#6fffb1',glow:'#70ffc0'},
  neon:{base:'#6e5ee8',light:'#c7c0ff',dark:'#251f54',accent:'#46e8ff',glow:'#8c7cff'},
  aurora:{base:'#68a7b7',light:'#d2fbff',dark:'#273f53',accent:'#a875ff',glow:'#8feaff'},
  gold:{base:'#d7a754',light:'#fff0b0',dark:'#4a3422',accent:'#f5cf62',glow:'#ffd45d'},
};

function speciesKind(species: string): LooperHdKind {
  if (species === 'slime') return 'slime';
  if (species === 'bot') return 'bot';
  if (species === 'owl') return 'owl';
  if (species === 'moth') return 'moth';
  if (species === 'gecko' || species === 'axolotl') return 'reptile';
  if (species === 'sprite') return 'sprite';
  return 'mammal';
}

function signatureFor(kind: LooperHdKind, species: string): LooperMotionSignature {
  if (kind === 'slime') return 'squash';
  if (kind === 'bot') return 'servo';
  if (kind === 'owl') return 'orbit';
  if (kind === 'moth') return 'flutter';
  if (kind === 'reptile') return 'crawl';
  if (kind === 'sprite') return 'void';
  if (species === 'cat') return 'coin';
  if (species === 'wolf' || species === 'fox') return 'slink';
  return 'float';
}

function motifFor(blueprint: GeneratedPetBlueprint, kind: LooperHdKind) {
  if (kind === 'slime') return blueprint.aura === 'orbit-ring' ? 'orbit' : 'cube';
  if (kind === 'bot') return blueprint.palette === 'cafe' ? 'coffee' : 'signal';
  if (kind === 'owl') return 'orbit';
  if (kind === 'moth') return blueprint.palette === 'moon' ? 'lunar' : 'signal';
  if (kind === 'reptile') return blueprint.palette === 'moon' ? 'moon' : 'leaf';
  if (kind === 'sprite') return 'void';
  if (blueprint.species === 'cat') return 'coin';
  if (blueprint.species === 'wolf') return 'wolf';
  return blueprint.aura === 'spark' ? 'spark' : blueprint.pattern === 'glitch' ? 'wire' : 'scrap';
}

export function forgeLooper(seed: string, generation = 1): ForgedLooper {
  const blueprint = generatePetBlueprint(seed, generation);
  const id = generatedPetPreviewId(seed, generation);
  const colors = paletteMap[blueprint.palette] ?? paletteMap.mint;
  const kind = speciesKind(blueprint.species);
  const motif = motifFor(blueprint, kind);
  const signature = signatureFor(kind, blueprint.species);
  const name = `${blueprint.palette[0].toUpperCase()}${blueprint.palette.slice(1)} ${blueprint.species[0].toUpperCase()}${blueprint.species.slice(1)}`;
  const recipe: LooperHdRecipe = {
    ids:[id],
    name,
    kind,
    ...colors,
    motif,
  };
  const manifest: LooperProductionManifest = {
    schemaVersion:1,
    characterId:id,
    aliases:[id],
    artStandard:'production-hd',
    fallback:'classic-pixel',
    portraitSafeArea:.12,
    animations:productionAnimations(signature),
  };
  return { id, blueprint, recipe, manifest };
}

export function forgeLooperBatch(seedPrefix: string, count: number, generation = 1) {
  return Array.from({length:Math.max(0,Math.min(100,count))},(_,index)=>forgeLooper(`${seedPrefix}:${index+1}`,generation));
}
