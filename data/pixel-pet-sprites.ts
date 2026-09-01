import type { PetMood } from '@/game/customization-types';

export type PixelMotion = 'float' | 'bounce' | 'wiggle' | 'sleep' | 'shake' | 'travel' | 'celebrate' | 'slime' | 'coin' | 'steam' | 'tick' | 'flutter' | 'puffer' | 'spark' | 'crawl' | 'slink' | 'signal' | 'orbit' | 'coil';

export type PixelPetSpriteDefinition = {
  petId: string;
  aliases?: string[];
  name: string;
  grid: string[];
  palette: Record<string, string>;
  animation: Record<PetMood, PixelMotion>;
  signatureClass?: string;
};

const motion = (idle: PixelMotion, happy: PixelMotion = 'bounce', excited: PixelMotion = 'wiggle', worried: PixelMotion = 'shake', sleepy: PixelMotion = 'sleep', traveling: PixelMotion = 'travel', celebrating: PixelMotion = 'celebrate'): PixelPetSpriteDefinition['animation'] => ({ idle, happy, excited, worried, sleepy, traveling, celebrating });

export const pixelPetSprites: PixelPetSpriteDefinition[] = [
  {
    petId: 'pet-lok-slime', aliases: ['lokdex:g1:001'], name: 'LOK Slime',
    grid: [
      '0000000000000000','0000001111000000','0000012222100000','0000122222210000',
      '0001222332221000','0012222222222100','0122242224222210','1222222222222221',
      '1222233333322221','1222335555332221','1222333333332221','0122222222222210',
      '0012222222222100','0001222222221000','0000111111100000','0000000000000000',
    ],
    palette: { '1':'#163629','2':'#56d67c','3':'#90f2a8','4':'#07120d','5':'#b8ffd0' },
    animation: motion('slime','bounce','slime'), signatureClass:'looper-fx-slime',
  },
  {
    petId: 'pet-coin-cat', aliases: ['lokdex:g1:004'], name: 'Coin Cat',
    grid: [
      '0110000000011000','1221000000122100','1222100001222100','1222211112222100',
      '1222222222222100','1222332223322100','1222442224422100','1222225522222100',
      '0122222222221000','0012223332210000','0012222222210000','0011222221100000',
      '0001222221006600','0001211210066660','0001100110006600','0000000000000000',
    ],
    palette: { '1':'#4b3422','2':'#d7a754','3':'#f2c96d','4':'#17110c','5':'#fff0b0','6':'#e8b93e' },
    animation: motion('coin','bounce','coin'), signatureClass:'looper-fx-coin',
  },
  {
    petId: 'pet-espresso-bot', aliases: ['lokdex:g1:008'], name: 'Espresso Bot',
    grid: [
      '0000011111100000','0000122222210000','0001222222221000','0012222222222100',
      '0122442222442210','0122222222222210','0122233333222210','0012222222222100',
      '0001225555221000','0066125555216600','0666122222216660','0066111111116600',
      '0000122222210000','0000112002110000','0000111001110000','0000000000000000',
    ],
    palette: { '1':'#2d333d','2':'#bcc7d3','3':'#74482f','4':'#39e2d1','5':'#eef4f7','6':'#9b6848' },
    animation: motion('steam','bounce','steam'), signatureClass:'looper-fx-steam',
  },
  {
    petId: 'looper-tickstep-mouse', aliases: ['lokdex:g1:003'], name: 'Tickstep Mouse',
    grid: [
      '0001100000011000','0012210000122100','0122221001222210','0122222112222210',
      '0012222222222100','0012242224222100','0012222222222100','0001222333221000',
      '0000122222210000','0001122222116000','0012221122166600','0122210012167600',
      '0121100001166600','0011000000116000','0000000000000000','0000000000000000',
    ],
    palette: { '1':'#4a3b39','2':'#b9938a','3':'#e7b7a7','4':'#171313','6':'#8d6539','7':'#e3bd5a' },
    animation: motion('tick','bounce','tick'), signatureClass:'looper-fx-tick',
  },
  {
    petId: 'looper-charm-crow', aliases: ['lokdex:g1:007'], name: 'Charm Crow',
    grid: [
      '0000000110000000','0000001221000000','0000012222100000','0000122222210000',
      '0001222422221000','0012222222222100','0122223332222210','1222222222222221',
      '0112222222222110','0001222222221000','0000122222210000','0000012222100000',
      '0000011211600000','0000110016660000','0001100000600000','0000000000000000',
    ],
    palette: { '1':'#151827','2':'#2a3047','3':'#59617b','4':'#72b6ff','6':'#d3a74a' },
    animation: motion('flutter','bounce','flutter'), signatureClass:'looper-fx-charm',
  },
  {
    petId: 'looper-pixel-puffer', aliases: ['lokdex:g1:010'], name: 'Pixel Puffer',
    grid: [
      '0000010010010000','0000121121210000','0001222222221000','0012223333222100',
      '0122233333322210','1222332222332221','1223422222432221','1222225552222221',
      '1222222222222221','0122233333322210','0012223333222100','0001222222221000',
      '0000122112210000','0000011001100000','0000000000000000','0000000000000000',
    ],
    palette: { '1':'#20364d','2':'#6da8d6','3':'#a9d7eb','4':'#101a25','5':'#f4f8f9' },
    animation: motion('puffer','bounce','puffer'), signatureClass:'looper-fx-puffer',
  },
  {
    petId: 'looper-sparkwing-sparrow', aliases: ['lokdex:g1:009'], name: 'Sparkwing Sparrow',
    grid: [
      '0000001100000000','0000012210000000','0000122221000000','0001224222100000',
      '0012222222210000','0122332222221000','1222233222222100','0112222222233210',
      '0001222223332100','0000122222210000','0000012222100000','0000112211000000',
      '0001100110000000','0055000055000000','0500000000500000','0000000000000000',
    ],
    palette: { '1':'#49372b','2':'#b87b3c','3':'#efb84f','4':'#132334','5':'#ffd64f' },
    animation: motion('spark','bounce','spark'), signatureClass:'looper-fx-spark',
  },
  {
    petId: 'looper-leafline-lizard', aliases: ['lokdex:g1:005'], name: 'Leafline Lizard',
    grid: [
      '0000000110000000','0000011221000000','0000122222100000','0001224222210000',
      '0012222222221000','0122332222222100','1222233222222210','0112222222222221',
      '0001222222222210','0000122222222100','0000012222221000','0000001222210000',
      '0000000112100000','0000000011211000','0000000000111100','0000000000000000',
    ],
    palette: { '1':'#28452b','2':'#6fa34d','3':'#a7ca68','4':'#111d13' },
    animation: motion('crawl','bounce','crawl'), signatureClass:'looper-fx-leafline',
  },
  {
    petId: 'looper-wirewhisk-ferret', aliases: ['lokdex:g1:011'], name: 'Wirewhisk Ferret',
    grid: [
      '0000000110000000','0000011221000000','0000122222100000','0001224222210000',
      '0012222222221000','0122332222222100','1222222222222210','0112222222222221',
      '0001222222222221','0000122222222210','0000012222222100','0000001222221000',
      '0000000112210000','0000005501121000','0000055000111000','0000000000000000',
    ],
    palette: { '1':'#29272b','2':'#665d63','3':'#c8b9ad','4':'#121012','5':'#f2b84c' },
    animation: motion('slink','bounce','slink'), signatureClass:'looper-fx-wire',
  },
  {
    petId: 'looper-signalsilk-moth', aliases: ['lokdex:g1:012'], name: 'Signalsilk Moth',
    grid: [
      '0001100000011000','0012210000122100','0122331001332210','1222333113332221',
      '1222333443332221','0122234443222210','0012224442222100','0001224442221000',
      '0000124442210000','0000012222100000','0000012525100000','0000122552210000',
      '0001212002121000','0001100000011000','0000000000000000','0000000000000000',
    ],
    palette: { '1':'#2d2942','2':'#7467a8','3':'#a78fe0','4':'#7ee0ed','5':'#151421' },
    animation: motion('signal','flutter','signal'), signatureClass:'looper-fx-signal',
  },
  {
    petId: 'looper-orbit-owl', aliases: ['lokdex:g1:021'], name: 'Orbit Owl',
    grid: [
      '0000110000110000','0001221001221000','0012222112222100','0122222222222210',
      '1222442222442221','1222442222442221','1222225552222221','0122222222222210',
      '0012233333322100','0012222222222100','0001222222221000','0000122222210000',
      '0000112002110000','0001100000110000','0066000000006600','0006666666666000',
    ],
    palette: { '1':'#312b30','2':'#69564d','3':'#b48d57','4':'#66d8ff','5':'#17131a','6':'#d7b75b' },
    animation: motion('orbit','bounce','orbit'), signatureClass:'looper-fx-orbit',
  },
  {
    petId: 'looper-glassfang-cobra', aliases: ['lokdex:g1:018'], name: 'Glassfang Cobra',
    grid: [
      '0000011111000000','0000122222100000','0001223332210000','0012234443221000',
      '0122344444322100','1223445554432210','0122344444322100','0012234443221000',
      '0001223332210000','0000122222100000','0000012221000000','0000012221000000',
      '0000122222100000','0001222112210000','0012211001221000','0111000000111000',
    ],
    palette: { '1':'#252747','2':'#53659d','3':'#79a7d5','4':'#9be3ed','5':'#1b1429' },
    animation: motion('coil','bounce','coil'), signatureClass:'looper-fx-glass',
  },
  {
    petId: 'pet-wolf-pup', aliases: ['lokdex:g1:017'], name: 'Wolf Pup',
    grid: ['1100000011','1210000121','1221111221','1222222221','1224224221','1222222221','1223333221','0122222210','0012112100','0110000110'],
    palette: { '1':'#25272e','2':'#838b98','3':'#cbd0d8','4':'#f0bd55' }, animation: motion('float'),
  },
  {
    petId: 'pet-moon-gecko', aliases: ['lokdex:g1:023'], name: 'Moon Gecko',
    grid: ['0000110000','0001221000','0012222100','0124224210','0122222210','0012332100','0001221000','0012112100','0121001210','1100000011'],
    palette: { '1':'#29304e','2':'#9dcfba','3':'#d7efe4','4':'#171c2c' }, animation: motion('float'),
  },
];

export function pixelPetSpriteById(id: string) {
  return pixelPetSprites.find((entry) => entry.petId === id || entry.aliases?.includes(id)) ?? pixelPetSprites[0];
}
