'use client';

import { useEffect, useMemo, useState } from 'react';
import { classicPetSprites } from '@/data/classic-pet-sprites';
import { looperSpriteById } from '@/data/looper-sprite-registry';
import { useHudPreferences } from '@/app/hooks/useHudPreferences';
import { useMicroMotionPreferences } from '@/app/hooks/useMicroMotion';
import { buildLooperFrameSequence } from '@/game/systems/looper-frame-animation';
import type { PetMood } from '@/game/customization-types';
import { LooperHDSprite } from './LooperHDSprite';

export function PixelPetSprite({ petId, mood = 'idle', silhouette = false, size = 52 }: { petId: string; mood?: PetMood; silhouette?: boolean; size?: number }) {
  const sprite = looperSpriteById(petId);
  const motionPrefs = useMicroMotionPreferences();
  const hudPrefs = useHudPreferences();
  const classicMode = hudPrefs.looperArtStyle === 'classic';
  const classic = classicMode ? classicPetSprites[petId] ?? classicPetSprites[sprite.petId] ?? null : null;
  const baseGrid = classic?.grid ?? sprite.grid;
  const palette = classic?.palette ?? sprite.palette;
  const animated = motionPrefs.enabled && motionPrefs.amplificationLevel >= 2;
  const sequence = useMemo(() => buildLooperFrameSequence(baseGrid, mood), [baseGrid, mood]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
    if (!classicMode || !animated || sequence.frames.length <= 1) return;
    const timer = window.setInterval(() => setFrameIndex((value) => (value + 1) % sequence.frames.length), sequence.frameMs);
    return () => window.clearInterval(timer);
  }, [classicMode, animated, sequence]);

  if (!classicMode) {
    return <LooperHDSprite petId={petId} mood={mood} size={size} animated={animated} silhouette={silhouette}/>;
  }

  const grid = animated ? sequence.frames[frameIndex] ?? baseGrid : baseGrid;
  const animation = animated ? sprite.animation[mood] : 'static';
  const columns = grid[0]?.length ?? 10;
  const cell = size / columns;

  return <span className="pixel-pet-wrap looper-art-classic" data-looper-art="classic" data-looper-motion={animated ? 'animated' : 'static'} style={{ width: size, height: size }} aria-hidden="true">
    <span className={`pixel-pet pixel-pet-${animation} effects-level-${motionPrefs.amplificationLevel} ${silhouette ? 'pixel-pet-silhouette' : ''}`} style={{ width: size, height: size, gridTemplateColumns: `repeat(${columns}, ${cell}px)`, gridAutoRows: `${cell}px` }}>
      {grid.flatMap((row, y) => row.split('').map((token, x) => <i key={`${x}-${y}`} style={{ background: token === '0' ? 'transparent' : silhouette ? 'currentColor' : palette[token] ?? 'transparent' }} />))}
    </span>
  </span>;
}
