import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { console.error(`LOOPER VALIDATION FAILED: ${message}`); process.exitCode = 1; };

const expected = [
  'LOK Slime','Scrapshine Raccoon','Tickstep Mouse','Coin Cat','Leafline Lizard','Rippledash Otter','Charm Crow','Espresso Bot',
  'Sparkwing Sparrow','Pixel Puffer','Wirewhisk Ferret','Signalsilk Moth','Drift Duck','Brick Badger','Chime Cricket','Shadow Raven',
  'Wolf Pup','Glassfang Cobra','Towerhorn Stag','Timeslip Jelly','Orbit Owl','Lunar Moth','Moon Gecko','Singularity Sprite',
];
const moods = ['idle','happy','excited','worried','sleepy','traveling','celebrating'];

const recipes = read('data/looper-hd-recipes.ts');
const manifests = read('data/looper-production-manifests.ts');
const animationTypes = read('game/looper-production-types.ts');
const motionCss = read('app/looper-character-motion.css');
const gateway = read('app/components/PixelPetSprite.tsx');
const lab = read('app/components/LooperProductionLab.tsx');

for (const name of expected) {
  if (!recipes.includes(`name:'${name}'`) && !recipes.includes(`name: '${name}'`) && !recipes.includes(`name: "${name}"`)) fail(`missing canonical recipe for ${name}`);
  if (!manifests.includes(`'${name}'`)) fail(`missing production animation signature for ${name}`);
  if (!motionCss.includes(`[data-looper-hd="${name}"]`)) fail(`missing character-specific motion selector for ${name}`);
}

const lokdexAliases = new Set([...recipes.matchAll(/lokdex:g1:(\d{3})/g)].map((match) => match[1]));
if (lokdexAliases.size !== 24) fail(`expected 24 unique LOKDEX aliases, found ${lokdexAliases.size}`);
for (let number = 1; number <= 24; number += 1) {
  const id = String(number).padStart(3, '0');
  if (!lokdexAliases.has(id)) fail(`missing LOKDEX alias ${id}`);
}

for (const mood of moods) {
  if (!animationTypes.includes(`${mood}:`)) fail(`animation contract missing ${mood}`);
  if (!lab.includes(`id:'${mood}'`) && !lab.includes(`id: '${mood}'`)) fail(`Production Lab missing ${mood} state button`);
}

if (!gateway.includes('LooperProductionSprite')) fail('PixelPetSprite is not routing to the Production renderer');
if (!gateway.includes("looperArtStyle === 'classic'")) fail('Classic fallback is not preserved in the shared gateway');

const requiredSurfaces = [
  ['app/components/StarterCompanionPrompt.tsx','PixelPetSprite'],
  ['app/components/PetCompanion.tsx','PixelPetSprite'],
  ['app/components/LokDexPanel.tsx','PixelPetSprite'],
  ['app/components/CardShopView.tsx','PixelPetSprite'],
];
for (const [file, symbol] of requiredSurfaces) {
  const content = read(file);
  if (!content.includes(symbol)) fail(`${file} is no longer using ${symbol}`);
}

if (!fs.existsSync(path.join(root,'app/loopers/page.tsx'))) fail('missing /loopers Production Lab route');
if (!fs.existsSync(path.join(root,'integrations/lok/collectibles/looper-forge.ts'))) fail('missing local Looper Forge');

if (!process.exitCode) console.log(`Looper production coverage OK: ${expected.length} canonical characters, ${moods.length} states, Classic fallback, live surfaces and Forge verified.`);
