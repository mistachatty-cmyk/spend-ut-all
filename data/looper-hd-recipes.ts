export type LooperHdKind = 'slime'|'mammal'|'bird'|'reptile'|'bot'|'puffer'|'moth'|'jelly'|'owl'|'cobra'|'stag'|'sprite'|'cricket';

export type LooperHdRecipe = {
  ids: string[];
  name: string;
  kind: LooperHdKind;
  base: string;
  light: string;
  dark: string;
  accent: string;
  glow: string;
  motif: string;
};

export const looperHdRecipes: LooperHdRecipe[] = [
  {ids:['lokdex:g1:001','pet-lok-slime'],name:'LOK Slime',kind:'slime',base:'#54df76',light:'#c8ffd0',dark:'#12663b',accent:'#8dff45',glow:'#5eff78',motif:'cube'},
  {ids:['lokdex:g1:002','looper-scrapshine-raccoon'],name:'Scrapshine Raccoon',kind:'mammal',base:'#727782',light:'#d9dbe0',dark:'#242833',accent:'#e3c75c',glow:'#f2dc77',motif:'scrap'},
  {ids:['lokdex:g1:003','looper-tickstep-mouse'],name:'Tickstep Mouse',kind:'mammal',base:'#b9938a',light:'#f2d2c5',dark:'#4a3535',accent:'#e3bd5a',glow:'#ffd96a',motif:'clock'},
  {ids:['lokdex:g1:004','pet-coin-cat'],name:'Coin Cat',kind:'mammal',base:'#d9a74c',light:'#fff0c1',dark:'#4b3422',accent:'#ffd45d',glow:'#ffcc4d',motif:'coin'},
  {ids:['lokdex:g1:005','looper-leafline-lizard'],name:'Leafline Lizard',kind:'reptile',base:'#73ab55',light:'#c7e58b',dark:'#244a2c',accent:'#9fd46a',glow:'#a9e87a',motif:'leaf'},
  {ids:['lokdex:g1:006','looper-rippledash-otter'],name:'Rippledash Otter',kind:'mammal',base:'#8c654b',light:'#e0bd8e',dark:'#3c2d28',accent:'#6fd4df',glow:'#87eef2',motif:'ripple'},
  {ids:['lokdex:g1:007','looper-charm-crow'],name:'Charm Crow',kind:'bird',base:'#2b3047',light:'#68718d',dark:'#10131f',accent:'#d5ad54',glow:'#7dc0ff',motif:'charm'},
  {ids:['lokdex:g1:008','pet-espresso-bot'],name:'Espresso Bot',kind:'bot',base:'#e3e0d7',light:'#ffffff',dark:'#2d333d',accent:'#46e8d8',glow:'#39dfff',motif:'coffee'},
  {ids:['lokdex:g1:009','looper-sparkwing-sparrow'],name:'Sparkwing Sparrow',kind:'bird',base:'#b87b3c',light:'#efc170',dark:'#49372b',accent:'#ffd64f',glow:'#fff071',motif:'spark'},
  {ids:['lokdex:g1:010','looper-pixel-puffer'],name:'Pixel Puffer',kind:'puffer',base:'#6da8d6',light:'#c7ecf7',dark:'#20364d',accent:'#92dfff',glow:'#9ef4ff',motif:'pixel'},
  {ids:['lokdex:g1:011','looper-wirewhisk-ferret'],name:'Wirewhisk Ferret',kind:'mammal',base:'#665d63',light:'#d8c9bd',dark:'#28262b',accent:'#f2b84c',glow:'#ffd36f',motif:'wire'},
  {ids:['lokdex:g1:012','looper-signalsilk-moth'],name:'Signalsilk Moth',kind:'moth',base:'#7467a8',light:'#cbb8f5',dark:'#2d2942',accent:'#7ee0ed',glow:'#91f4ff',motif:'signal'},
  {ids:['lokdex:g1:013','looper-drift-duck'],name:'Drift Duck',kind:'bird',base:'#d4b567',light:'#fff0aa',dark:'#514839',accent:'#db7f3b',glow:'#ffc45f',motif:'drift'},
  {ids:['lokdex:g1:014','looper-brick-badger'],name:'Brick Badger',kind:'mammal',base:'#75685d',light:'#d0c0ad',dark:'#302c2a',accent:'#b45d47',glow:'#de785d',motif:'brick'},
  {ids:['lokdex:g1:015','looper-chime-cricket'],name:'Chime Cricket',kind:'cricket',base:'#7d8141',light:'#d9df7b',dark:'#313023',accent:'#f0dc78',glow:'#fff29a',motif:'chime'},
  {ids:['lokdex:g1:016','looper-shadow-raven'],name:'Shadow Raven',kind:'bird',base:'#242838',light:'#59617b',dark:'#0e1018',accent:'#a26cff',glow:'#bd8cff',motif:'shadow'},
  {ids:['lokdex:g1:017','pet-wolf-pup'],name:'Wolf Pup',kind:'mammal',base:'#808a98',light:'#dce1e7',dark:'#292d35',accent:'#f0bd55',glow:'#ffd771',motif:'wolf'},
  {ids:['lokdex:g1:018','looper-glassfang-cobra'],name:'Glassfang Cobra',kind:'cobra',base:'#53659d',light:'#b8eff5',dark:'#252747',accent:'#9be3ed',glow:'#b6f5ff',motif:'glass'},
  {ids:['lokdex:g1:019','looper-towerhorn-stag'],name:'Towerhorn Stag',kind:'stag',base:'#9f7955',light:'#e4c69c',dark:'#43362b',accent:'#c9d8a1',glow:'#e7f6b7',motif:'tower'},
  {ids:['lokdex:g1:020','looper-timeslip-jelly'],name:'Timeslip Jelly',kind:'jelly',base:'#6d79bd',light:'#c7d3ff',dark:'#2d3158',accent:'#8ef0ee',glow:'#adffff',motif:'time'},
  {ids:['lokdex:g1:021','looper-orbit-owl'],name:'Orbit Owl',kind:'owl',base:'#69564d',light:'#c7a977',dark:'#312b30',accent:'#66d8ff',glow:'#8ceaff',motif:'orbit'},
  {ids:['lokdex:g1:022','looper-lunar-moth'],name:'Lunar Moth',kind:'moth',base:'#d6d9e7',light:'#ffffff',dark:'#343750',accent:'#8edfff',glow:'#b8efff',motif:'lunar'},
  {ids:['lokdex:g1:023','pet-moon-gecko'],name:'Moon Gecko',kind:'reptile',base:'#9fc9c5',light:'#e2f7f0',dark:'#303853',accent:'#84dfff',glow:'#adf2ff',motif:'moon'},
  {ids:['lokdex:g1:024','looper-singularity-sprite'],name:'Singularity Sprite',kind:'sprite',base:'#5f3c84',light:'#df9bff',dark:'#151020',accent:'#a66cff',glow:'#df9bff',motif:'void'},
];

export function looperHdRecipeById(id: string) {
  return looperHdRecipes.find((recipe) => recipe.ids.includes(id)) ?? null;
}
