import { looperHdRecipes } from './looper-hd-recipes';
import { productionAnimations, type LooperMotionSignature, type LooperProductionManifest } from '@/game/looper-production-types';

const signatureByName: Record<string, LooperMotionSignature> = {
  'LOK Slime':'squash',
  'Scrapshine Raccoon':'slink',
  'Tickstep Mouse':'tick',
  'Coin Cat':'coin',
  'Leafline Lizard':'crawl',
  'Rippledash Otter':'ripple',
  'Charm Crow':'flutter',
  'Espresso Bot':'servo',
  'Sparkwing Sparrow':'spark',
  'Pixel Puffer':'float',
  'Wirewhisk Ferret':'slink',
  'Signalsilk Moth':'signal',
  'Drift Duck':'float',
  'Brick Badger':'stomp',
  'Chime Cricket':'chime',
  'Shadow Raven':'shadow',
  'Wolf Pup':'slink',
  'Glassfang Cobra':'coil',
  'Towerhorn Stag':'stomp',
  'Timeslip Jelly':'timeslip',
  'Orbit Owl':'orbit',
  'Lunar Moth':'lunar',
  'Moon Gecko':'crawl',
  'Singularity Sprite':'void',
};

export const looperProductionManifests: LooperProductionManifest[] = looperHdRecipes.map((recipe) => ({
  schemaVersion: 1,
  characterId: recipe.ids.find((id) => id.startsWith('lokdex:')) ?? recipe.ids[0],
  aliases: recipe.ids,
  artStandard: 'production-hd',
  fallback: 'classic-pixel',
  portraitSafeArea: .12,
  animations: productionAnimations(signatureByName[recipe.name] ?? 'float'),
}));

export function looperProductionManifestById(id: string) {
  return looperProductionManifests.find((manifest) => manifest.characterId === id || manifest.aliases.includes(id)) ?? null;
}
