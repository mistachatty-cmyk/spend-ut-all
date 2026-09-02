export type LooperVectorAsset = { id:string; name:string; master:string; animated:string; };
export const looperVectorAssets: LooperVectorAsset[] = [
  { id:'lokdex:g1:001', name:'LOK Slime', master:'/assets/loopers/g1/001-lok-slime/master.svg', animated:'/assets/loopers/g1/001-lok-slime/animated.svg' },
  { id:'lokdex:g1:002', name:'Scrapshine Raccoon', master:'/assets/loopers/g1/002-scrapshine-raccoon/master.svg', animated:'/assets/loopers/g1/002-scrapshine-raccoon/animated.svg' },
  { id:'lokdex:g1:003', name:'Tickstep Mouse', master:'/assets/loopers/g1/003-tickstep-mouse/master.svg', animated:'/assets/loopers/g1/003-tickstep-mouse/animated.svg' },
  { id:'lokdex:g1:004', name:'Coin Cat', master:'/assets/loopers/g1/004-coin-cat/master.svg', animated:'/assets/loopers/g1/004-coin-cat/animated.svg' },
  { id:'lokdex:g1:005', name:'Leafline Lizard', master:'/assets/loopers/g1/005-leafline-lizard/master.svg', animated:'/assets/loopers/g1/005-leafline-lizard/animated.svg' },
  { id:'lokdex:g1:006', name:'Rippledash Otter', master:'/assets/loopers/g1/006-rippledash-otter/master.svg', animated:'/assets/loopers/g1/006-rippledash-otter/animated.svg' },
  { id:'lokdex:g1:007', name:'Charm Crow', master:'/assets/loopers/g1/007-charm-crow/master.svg', animated:'/assets/loopers/g1/007-charm-crow/animated.svg' },
  { id:'lokdex:g1:008', name:'Espresso Bot', master:'/assets/loopers/g1/008-espresso-bot/master.svg', animated:'/assets/loopers/g1/008-espresso-bot/animated.svg' },
  { id:'lokdex:g1:009', name:'Sparkwing Sparrow', master:'/assets/loopers/g1/009-sparkwing-sparrow/master.svg', animated:'/assets/loopers/g1/009-sparkwing-sparrow/animated.svg' },
  { id:'lokdex:g1:010', name:'Pixel Puffer', master:'/assets/loopers/g1/010-pixel-puffer/master.svg', animated:'/assets/loopers/g1/010-pixel-puffer/animated.svg' },
  { id:'lokdex:g1:011', name:'Wirewhisk Ferret', master:'/assets/loopers/g1/011-wirewhisk-ferret/master.svg', animated:'/assets/loopers/g1/011-wirewhisk-ferret/animated.svg' },
  { id:'lokdex:g1:012', name:'Signalsilk Moth', master:'/assets/loopers/g1/012-signalsilk-moth/master.svg', animated:'/assets/loopers/g1/012-signalsilk-moth/animated.svg' },
  { id:'lokdex:g1:013', name:'Drift Duck', master:'/assets/loopers/g1/013-drift-duck/master.svg', animated:'/assets/loopers/g1/013-drift-duck/animated.svg' },
  { id:'lokdex:g1:014', name:'Brick Badger', master:'/assets/loopers/g1/014-brick-badger/master.svg', animated:'/assets/loopers/g1/014-brick-badger/animated.svg' },
  { id:'lokdex:g1:015', name:'Chime Cricket', master:'/assets/loopers/g1/015-chime-cricket/master.svg', animated:'/assets/loopers/g1/015-chime-cricket/animated.svg' },
  { id:'lokdex:g1:016', name:'Shadow Raven', master:'/assets/loopers/g1/016-shadow-raven/master.svg', animated:'/assets/loopers/g1/016-shadow-raven/animated.svg' },
  { id:'lokdex:g1:017', name:'Wolf Pup', master:'/assets/loopers/g1/017-wolf-pup/master.svg', animated:'/assets/loopers/g1/017-wolf-pup/animated.svg' },
  { id:'lokdex:g1:018', name:'Glassfang Cobra', master:'/assets/loopers/g1/018-glassfang-cobra/master.svg', animated:'/assets/loopers/g1/018-glassfang-cobra/animated.svg' },
  { id:'lokdex:g1:019', name:'Towerhorn Stag', master:'/assets/loopers/g1/019-towerhorn-stag/master.svg', animated:'/assets/loopers/g1/019-towerhorn-stag/animated.svg' },
  { id:'lokdex:g1:020', name:'Timeslip Jelly', master:'/assets/loopers/g1/020-timeslip-jelly/master.svg', animated:'/assets/loopers/g1/020-timeslip-jelly/animated.svg' },
  { id:'lokdex:g1:021', name:'Orbit Owl', master:'/assets/loopers/g1/021-orbit-owl/master.svg', animated:'/assets/loopers/g1/021-orbit-owl/animated.svg' },
  { id:'lokdex:g1:022', name:'Lunar Moth', master:'/assets/loopers/g1/022-lunar-moth/master.svg', animated:'/assets/loopers/g1/022-lunar-moth/animated.svg' },
  { id:'lokdex:g1:023', name:'Moon Gecko', master:'/assets/loopers/g1/023-moon-gecko/master.svg', animated:'/assets/loopers/g1/023-moon-gecko/animated.svg' },
  { id:'lokdex:g1:024', name:'Singularity Sprite', master:'/assets/loopers/g1/024-singularity-sprite/master.svg', animated:'/assets/loopers/g1/024-singularity-sprite/animated.svg' },
];
const companionAliases: Record<string,string> = {
  'pet-lok-slime':'lokdex:g1:001',
  'pet-coin-cat':'lokdex:g1:004',
  'pet-espresso-bot':'lokdex:g1:008',
  'pet-wolf-pup':'lokdex:g1:017',
  'pet-moon-gecko':'lokdex:g1:023',
};
export function looperVectorAssetById(id:string){
  const normalized = companionAliases[id] ?? id;
  return looperVectorAssets.find((asset)=>asset.id===normalized) ?? null;
}
