import type { PetMood } from '@/game/customization-types';

export type PixelPetSpriteDefinition = {
  petId: string;
  grid: string[];
  palette: Record<string, string>;
  animation: Record<PetMood, 'float' | 'bounce' | 'wiggle' | 'sleep' | 'shake' | 'travel' | 'celebrate'>;
};

const defaultAnimation: PixelPetSpriteDefinition['animation'] = {
  idle: 'float',
  happy: 'bounce',
  excited: 'wiggle',
  worried: 'shake',
  sleepy: 'sleep',
  traveling: 'travel',
  celebrating: 'celebrate',
};

export const pixelPetSprites: PixelPetSpriteDefinition[] = [
  {
    petId: 'pet-lok-slime',
    grid: ['0000000000','0001111000','0012222100','0122222210','1224224221','1222222221','1223333221','0122222210','0011111100','0000000000'],
    palette: { '1': '#173a2a', '2': '#58d67b', '3': '#91f5a8', '4': '#07120d' },
    animation: defaultAnimation,
  },
  {
    petId: 'pet-coin-cat',
    grid: ['0100000010','1210000121','1221111221','1222222221','1224224221','1222222221','1222332221','0122222210','0012112100','0011001100'],
    palette: { '1': '#4a3422', '2': '#d7a858', '3': '#f4cf78', '4': '#15100b' },
    animation: defaultAnimation,
  },
  {
    petId: 'pet-espresso-bot',
    grid: ['0001111000','0012222100','0122222210','1224224221','1222222221','1223333221','0122222210','0011111100','0012002100','0011001100'],
    palette: { '1': '#2c3038', '2': '#b7c2cf', '3': '#75482f', '4': '#2ee6c8' },
    animation: defaultAnimation,
  },
  {
    petId: 'pet-wolf-pup',
    grid: ['1100000011','1210000121','1221111221','1222222221','1224224221','1222222221','1223333221','0122222210','0012112100','0110000110'],
    palette: { '1': '#25272e', '2': '#838b98', '3': '#cbd0d8', '4': '#f0bd55' },
    animation: defaultAnimation,
  },
  {
    petId: 'pet-moon-gecko',
    grid: ['0000110000','0001221000','0012222100','0124224210','0122222210','0012332100','0001221000','0012112100','0121001210','1100000011'],
    palette: { '1': '#29304e', '2': '#9dcfba', '3': '#d7efe4', '4': '#171c2c' },
    animation: defaultAnimation,
  },
];

export function pixelPetSpriteById(petId: string) {
  return pixelPetSprites.find((entry) => entry.petId === petId) ?? pixelPetSprites[0];
}
