import { pixelPetSprites, type PixelPetSpriteDefinition } from './pixel-pet-sprites';
import { pixelPetSpritesWave2 } from './pixel-pet-sprites-wave2';
import { pixelPetSpritesWave3 } from './pixel-pet-sprites-wave3';

export const looperSpriteRegistry: PixelPetSpriteDefinition[] = [
  ...pixelPetSpritesWave2,
  ...pixelPetSpritesWave3,
  ...pixelPetSprites,
];

export function findLooperSprite(id: string) {
  return looperSpriteRegistry.find((entry) => entry.petId === id || entry.aliases?.includes(id)) ?? null;
}

export function looperSpriteById(id: string) {
  return findLooperSprite(id) ?? looperSpriteRegistry[0];
}
