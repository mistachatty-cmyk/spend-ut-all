'use client';

import { getHouseVisual } from '@/data/purchase-visuals';
import type { houseTiers } from '@/data/content';

interface HouseVisualBannerProps {
  currentHouse: (typeof houseTiers)[number];
  nextHouse?: (typeof houseTiers)[number];
  onInspect: (visual: ReturnType<typeof getHouseVisual>) => void;
  showPhotos: boolean;
}

export function HouseVisualBanner({
  currentHouse,
  nextHouse,
  onInspect,
  showPhotos,
}: HouseVisualBannerProps) {
  if (!showPhotos) return null;

  const visual = getHouseVisual(currentHouse.level);

  return (
    <div
      className="house-visual-card"
      onClick={() => onInspect(visual)}
      title="Click to inspect residence details & photography"
      style={{ cursor: 'pointer' }}
    >
      <img
        src={visual.imageUrl}
        alt={visual.name}
        className="house-visual-banner"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== visual.fallbackSeedUrl) {
            img.src = visual.fallbackSeedUrl;
          }
        }}
      />
      <div className="house-visual-caption">
        <div>
          <b>{visual.name}</b>
          <br />
          <small>{visual.caption}</small>
        </div>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '9999px',
            background: visual.tierColor,
            color: '#ffffff',
          }}
        >
          {visual.badge}
        </span>
      </div>
    </div>
  );
}
