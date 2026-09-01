'use client';

import { pixelPetSpriteById } from '@/data/pixel-pet-sprites';
import { useMicroMotionPreferences } from '@/app/hooks/useMicroMotion';
import type { PetMood } from '@/game/customization-types';

export function PixelPetSprite({ petId, mood = 'idle', silhouette = false, size = 52 }: { petId: string; mood?: PetMood; silhouette?: boolean; size?: number }) {
  const sprite = pixelPetSpriteById(petId);
  const prefs = useMicroMotionPreferences();
  const animation = prefs.amplificationLevel >= 2 ? sprite.animation[mood] : 'static';
  const columns = sprite.grid[0]?.length ?? 10;
  const cell = size / columns;

  return <span className={`pixel-pet pixel-pet-${animation} effects-level-${prefs.amplificationLevel} ${silhouette ? 'pixel-pet-silhouette' : ''}`} style={{ width: size, height: size, gridTemplateColumns: `repeat(${columns}, ${cell}px)`, gridAutoRows: `${cell}px` }} aria-hidden="true">
    {sprite.grid.flatMap((row, y) => row.split('').map((token, x) => <i key={`${x}-${y}`} style={{ background: token === '0' ? 'transparent' : silhouette ? 'currentColor' : sprite.palette[token] ?? 'transparent' }} />))}
  </span>;
}
