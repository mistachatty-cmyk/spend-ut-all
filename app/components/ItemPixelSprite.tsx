'use client';

import { itemPixelSpriteById } from '@/data/item-pixel-sprites';

export function ItemPixelSprite({ itemId, emoji, size = 34 }: { itemId: string; emoji: string; size?: number }) {
  const sprite = itemPixelSpriteById(itemId);
  if (!sprite) return <>{emoji}</>;

  const columns = sprite.grid[0]?.length ?? 10;
  const cell = size / columns;

  return <span className="item-pixel-wrap" style={{ width: size, height: size }} role="img" aria-label={emoji}>
    <span className="pixel-pet item-pixel-art" style={{ width: size, height: size, gridTemplateColumns: `repeat(${columns}, ${cell}px)`, gridAutoRows: `${cell}px` }}>
      {sprite.grid.flatMap((row, y) => row.split('').map((token, x) => <i key={`${x}-${y}`} style={{ background: token === '0' ? 'transparent' : sprite.palette[token] ?? 'transparent' }} />))}
    </span>
  </span>;
}
