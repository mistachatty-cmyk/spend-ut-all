import type { PixelPetSpriteDefinition } from './pixel-pet-sprites';

const motion = (idle: PixelPetSpriteDefinition['animation']['idle'], excited: PixelPetSpriteDefinition['animation']['excited'] = 'wiggle'): PixelPetSpriteDefinition['animation'] => ({ idle, happy:'bounce', excited, worried:'shake', sleepy:'sleep', traveling:'travel', celebrating:'celebrate' });

export const pixelPetSpritesWave3: PixelPetSpriteDefinition[] = [
  {
    petId:'looper-shadow-raven', aliases:['lokdex:g1:016'], name:'Shadow Raven',
    grid:['0000000110000000','0000001221000000','0000012222100000','0000122222210000','0001222422221000','0012222222222100','0122233333222210','1222332222332221','0112222222222110','0001222222221000','0000122222210000','0000012222100000','0000011211000000','0000110011000000','0001100000110000','0000000000000000'],
    palette:{'1':'#11131b','2':'#242838','3':'#4d536d','4':'#a26cff'}, animation:motion('flutter','flutter'), signatureClass:'looper-fx-shadow',
  },
  {
    petId:'looper-towerhorn-stag', aliases:['lokdex:g1:019'], name:'Towerhorn Stag',
    grid:['0011000000001100','0122100000012210','1221100000011221','1210000000000121','0110001111000110','0011012222101100','0001122222211000','0012224224222100','0122222222222210','1222233333322221','0122222222222210','0012222222222100','0001222002221000','0001121001211000','0001100000110000','0000000000000000'],
    palette:{'1':'#43362b','2':'#9f7955','3':'#d4b17a','4':'#17120e','5':'#c9d8a1'}, animation:motion('float'), signatureClass:'looper-fx-towerhorn',
  },
  {
    petId:'looper-timeslip-jelly', aliases:['lokdex:g1:020'], name:'Timeslip Jelly',
    grid:['0000011111100000','0000122222210000','0001223333221000','0012233333322100','0122334444332210','0123334444333210','0012333333332100','0001222222221000','0000111111110000','0000120010210000','0001210010121000','0012100100012100','0121001000001210','1210010000000121','1100100000000011','0000000000000000'],
    palette:{'1':'#2d3158','2':'#6d79bd','3':'#9fb1e8','4':'#8ef0ee'}, animation:motion('signal','signal'), signatureClass:'looper-fx-timeslip',
  },
  {
    petId:'looper-lunar-moth', aliases:['lokdex:g1:022'], name:'Lunar Moth',
    grid:['0011000000001100','0122100000012210','1223310000133221','1233311111333321','1233344444333321','0123345555433210','0012235555322100','0001225555221000','0000125555210000','0000012222100000','0000012626100000','0000122662210000','0001212002121000','0001100000011000','0000000000000000','0000000000000000'],
    palette:{'1':'#343750','2':'#d6d9e7','3':'#a9b2d9','4':'#7b87bd','5':'#eff4ff','6':'#8edfff'}, animation:motion('signal','flutter'), signatureClass:'looper-fx-lunar',
  },
];
