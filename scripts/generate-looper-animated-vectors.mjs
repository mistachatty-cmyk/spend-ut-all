import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'public/assets/loopers/g1/index.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const writeMissing = process.argv.includes('--write-missing');

const motionByName = {
  'LOK Slime': ['squash', '0%,100%{transform:translateY(0) scale(1)}28%{transform:translateY(2px) scale(1.035,.965)}55%{transform:translateY(-4px) scale(.985,1.035)}76%{transform:translateY(0) scale(1.012,.99)}'],
  'Scrapshine Raccoon': ['scavenge', '0%,100%{transform:translate(0,0) rotate(0)}42%{transform:translate(-2px,-1px) rotate(-1deg)}54%{transform:translate(1px,-2px) rotate(.8deg)}'],
  'Tickstep Mouse': ['tick', '0%,100%{transform:translateX(0)}20%{transform:translateX(-2px)}40%{transform:translateX(2px)}60%{transform:translateX(-1px)}80%{transform:translateX(1px)}'],
  'Coin Cat': ['coin', '0%,100%{transform:translateY(0) rotate(0)}48%{transform:translateY(-4px) rotate(.5deg)}66%{transform:translateY(-2px) rotate(-.45deg)}'],
  'Leafline Lizard': ['crawl', '0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(-1deg)}'],
  'Rippledash Otter': ['ripple', '0%,100%{transform:translateY(1px) rotate(-.3deg)}50%{transform:translate(1px,-4px) rotate(.4deg)}'],
  'Charm Crow': ['wing', '0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-3px) rotate(-1.2deg)}56%{transform:translateY(-1px) rotate(1deg)}'],
  'Espresso Bot': ['servo', '0%,100%{transform:translateY(0)}25%{transform:translateY(-2px)}50%{transform:translateY(0)}75%{transform:translateY(-3px)}'],
  'Sparkwing Sparrow': ['spark', '0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(1px,-4px) rotate(.6deg)}50%{transform:translate(-1px,-2px) rotate(-.5deg)}75%{transform:translate(1px,-5px) rotate(.4deg)}'],
  'Pixel Puffer': ['puffer', '0%,100%{transform:scale(1)}42%{transform:scale(1.025)}58%{transform:scale(1.06)}80%{transform:scale(1.012)}'],
  'Wirewhisk Ferret': ['wire', '0%,100%{transform:translateX(0) rotate(0)}45%{transform:translateX(3px) rotate(.8deg)}58%{transform:translateX(-1px) rotate(-.5deg)}'],
  'Signalsilk Moth': ['signal', '0%,100%{transform:translateY(0) rotate(-.5deg)}50%{transform:translateY(-4px) rotate(.7deg)}'],
  'Drift Duck': ['drift', '0%,100%{transform:translateY(1px) rotate(-.5deg)}50%{transform:translateY(-3px) rotate(.5deg)}'],
  'Brick Badger': ['stomp', '0%,100%{transform:translateY(0)}43%{transform:translateY(-2px)}54%{transform:translateY(2px) scaleY(.985)}'],
  'Chime Cricket': ['chime', '0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-2px) rotate(-.8deg)}50%{transform:translateY(0) rotate(.8deg)}75%{transform:translateY(-1px) rotate(-.4deg)}'],
  'Shadow Raven': ['shadow', '0%,100%{transform:translateY(0);filter:brightness(.92)}50%{transform:translateY(-4px);filter:brightness(1.08)}'],
  'Wolf Pup': ['slink', '0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-2px) rotate(-.7deg)}60%{transform:translateY(-1px) rotate(.6deg)}'],
  'Glassfang Cobra': ['glass', '0%,100%{transform:translateY(0) rotate(-.4deg)}50%{transform:translateY(-3px) rotate(.7deg)}'],
  'Towerhorn Stag': ['tower', '0%,100%{transform:translateY(0)}48%{transform:translateY(-2px)}58%{transform:translateY(2px)}'],
  'Timeslip Jelly': ['timeslip', '0%,100%{transform:translateY(1px) scaleY(.985)}50%{transform:translateY(-4px) scaleY(1.025)}'],
  'Orbit Owl': ['orbit', '0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(.6deg)}'],
  'Lunar Moth': ['lunar', '0%,100%{transform:translateY(0) rotate(-.5deg)}50%{transform:translateY(-4px) rotate(.5deg)}'],
  'Moon Gecko': ['moon', '0%,100%{transform:translateY(0) rotate(-.4deg)}50%{transform:translateY(-2px) rotate(.7deg)}'],
  'Singularity Sprite': ['void', '0%,100%{transform:translateY(0) rotate(0) scale(1);filter:brightness(.96)}50%{transform:translateY(-4px) rotate(.8deg) scale(1.025);filter:brightness(1.08)}'],
};

function wrapper(character) {
  const [signature, frames] = motionByName[character.name] ?? ['float', '0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" data-looper-id="${character.id}" data-looper-name="${character.name}" data-motion-signature="${signature}"><title>${character.name} — animated vector</title><style>.looper{transform-box:fill-box;transform-origin:center;animation:looper 2.6s ease-in-out infinite}@keyframes looper{${frames}}@media(prefers-reduced-motion:reduce){.looper{animation:none}}</style><g class="looper"><image href="master.svg" x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid meet"/></g></svg>`;
}

let missing = 0;
for (const character of catalog.characters ?? []) {
  const relative = character.animated.replace(/^\//, 'public/');
  const target = path.join(root, relative);
  if (fs.existsSync(target)) continue;
  missing += 1;
  if (writeMissing) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, wrapper(character));
    console.log(`created ${relative}`);
  } else {
    console.log(`missing ${relative}`);
  }
}

if (missing && !writeMissing) {
  console.error(`${missing} animated vector file(s) missing. Re-run with --write-missing to create safe wrappers without overwriting approved bespoke files.`);
  process.exitCode = 1;
} else {
  console.log(`Looper animated-vector generator OK: ${catalog.characters?.length ?? 0} catalog entries checked; approved existing files were not overwritten.`);
}
