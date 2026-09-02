import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { console.error(`LOOPER VALIDATION FAILED: ${message}`); process.exitCode = 1; };
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

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
const vectorIndex = JSON.parse(read('public/assets/loopers/g1/index.json'));

for (const [index,name] of expected.entries()) {
  if (!recipes.includes(`name:'${name}'`) && !recipes.includes(`name: '${name}'`) && !recipes.includes(`name: \"${name}\"`)) fail(`missing canonical recipe for ${name}`);
  if (!manifests.includes(`'${name}'`)) fail(`missing production animation signature for ${name}`);
  if (!motionCss.includes(`[data-looper-hd=\"${name}\"]`)) fail(`missing character-specific motion selector for ${name}`);

  const number = String(index + 1).padStart(3,'0');
  const folder = `public/assets/loopers/g1/${number}-${slug(name)}`;
  const masterPath = `${folder}/master.svg`;
  const animatedPath = `${folder}/animated.svg`;
  if (!fs.existsSync(path.join(root,masterPath))) {
    fail(`missing scalable SVG master for ${name}: ${masterPath}`);
  } else {
    const svg = read(masterPath);
    if (!svg.includes('<svg')) fail(`${name} master is not SVG`);
    if (!svg.includes('width=\"1024\"') || !svg.includes('height=\"1024\"')) fail(`${name} master is missing 1024 presentation sizing`);
    if (!svg.includes(`data-looper-id=\"lokdex:g1:${number}\"`)) fail(`${name} master has the wrong stable LOKDEX ID`);
  }
  if (!fs.existsSync(path.join(root,animatedPath))) {
    fail(`missing reusable animated SVG for ${name}: ${animatedPath}`);
  } else {
    const animated = read(animatedPath);
    if (!animated.includes('<style>') || !animated.includes('@keyframes')) fail(`${name} animated SVG is missing self-contained motion`);
    if (!animated.includes('prefers-reduced-motion')) fail(`${name} animated SVG must respect reduced motion`);
    if (!animated.includes('href=\"master.svg\"')) fail(`${name} animated SVG must derive from its canonical master`);
  }
}

if (vectorIndex.characters?.length !== 24) fail(`vector asset catalog should contain 24 characters, found ${vectorIndex.characters?.length ?? 0}`);
if (vectorIndex.format !== 'svg' || vectorIndex.scalable !== true) fail('vector asset catalog must declare scalable SVG masters');
for (const item of vectorIndex.characters ?? []) {
  if (!item.master || !item.animated) fail(`vector catalog entry ${item.id ?? 'unknown'} must expose master and animated SVG paths`);
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
if (!lab.includes('looperVectorAssetById')) fail('Production Lab is not exposing canonical vector masters');

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
if (!fs.existsSync(path.join(root,'data/looper-vector-assets.ts'))) fail('missing application-side vector asset catalog');
if (!fs.existsSync(path.join(root,'docs/LOOPER_VECTOR_ASSETS.md'))) fail('missing reusable vector asset documentation');

if (!process.exitCode) console.log(`Looper production coverage OK: ${expected.length} canonical characters, ${moods.length} live states, ${vectorIndex.characters.length} scalable SVG masters + reusable animated vectors, Classic fallback, live surfaces and Forge verified.`);
