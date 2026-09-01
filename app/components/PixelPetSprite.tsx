'use client';

import { useEffect, useMemo, useState } from 'react';
import { classicPetSprites } from '@/data/classic-pet-sprites';
import { looperSpriteById } from '@/data/looper-sprite-registry';
import { useHudPreferences } from '@/app/hooks/useHudPreferences';
import { useMicroMotionPreferences } from '@/app/hooks/useMicroMotion';
import { buildLooperFrameSequence } from '@/game/systems/looper-frame-animation';
import type { PetMood } from '@/game/customization-types';

export function PixelPetSprite({ petId, mood = 'idle', silhouette = false, size = 52 }: { petId: string; mood?: PetMood; silhouette?: boolean; size?: number }) {
  const sprite = looperSpriteById(petId);
  const motionPrefs = useMicroMotionPreferences();
  const hudPrefs = useHudPreferences();
  const classic = hudPrefs.looperArtStyle === 'classic' ? classicPetSprites[petId] ?? null : null;
  const baseGrid = classic?.grid ?? sprite.grid;
  const palette = classic?.palette ?? sprite.palette;
  const animated = motionPrefs.enabled && motionPrefs.amplificationLevel >= 2;
  const sequence = useMemo(() => buildLooperFrameSequence(baseGrid, mood), [baseGrid, mood]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
    if (!animated || sequence.frames.length <= 1) return;
    const timer = window.setInterval(() => setFrameIndex((value) => (value + 1) % sequence.frames.length), sequence.frameMs);
    return () => window.clearInterval(timer);
  }, [animated, sequence]);

  const grid = animated ? sequence.frames[frameIndex] ?? baseGrid : baseGrid;
  const animation = animated ? sprite.animation[mood] : 'static';
  const columns = grid[0]?.length ?? 10;
  const cell = size / columns;
  const signature = animated && !silhouette && !classic && sprite.signatureClass ? sprite.signatureClass : '';

  return <span className={`pixel-pet-wrap ${signature} ${classic ? 'looper-art-classic' : 'looper-art-pixel-plus'}`} style={{ width: size, height: size }} aria-hidden="true">
    <span className={`pixel-pet pixel-pet-${animation} effects-level-${motionPrefs.amplificationLevel} ${silhouette ? 'pixel-pet-silhouette' : ''}`} style={{ width: size, height: size, gridTemplateColumns: `repeat(${columns}, ${cell}px)`, gridAutoRows: `${cell}px` }}>
      {grid.flatMap((row, y) => row.split('').map((token, x) => <i key={`${x}-${y}`} style={{ background: token === '0' ? 'transparent' : silhouette ? 'currentColor' : palette[token] ?? 'transparent' }} />))}
    </span>
  </span>;
}
