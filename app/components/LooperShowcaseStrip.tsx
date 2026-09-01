'use client';

import { lokDexEntries } from '@/data/lokdex';
import { findPixelPetSprite } from '@/data/pixel-pet-sprites';
import { PixelPetSprite } from './PixelPetSprite';

const priorityIds = [
  'lokdex:g1:001','lokdex:g1:004','lokdex:g1:008','lokdex:g1:003','lokdex:g1:007','lokdex:g1:010',
  'lokdex:g1:009','lokdex:g1:005','lokdex:g1:011','lokdex:g1:012','lokdex:g1:021','lokdex:g1:018',
];

export function LooperShowcaseStrip() {
  const entries = priorityIds.map((id) => lokDexEntries.find((entry) => entry.id === id)).filter(Boolean);
  return <section className="looper-showcase" aria-label="Firstlight Pixel+ Loopers">
    <div className="looper-showcase-heading"><div><span className="eyebrow">PIXEL+ PRODUCTION WAVE 1</span><b>Loopers of Knowledge</b></div><small>Animated canonical sprites · classic companion art remains optional</small></div>
    <div className="looper-showcase-track">{entries.map((entry) => {
      if (!entry || !findPixelPetSprite(entry.id)) return null;
      return <article key={entry.id} className={`looper-showcase-card rarity-${entry.rarity}`}><PixelPetSprite petId={entry.id} mood="idle" size={60}/><div><b>{entry.name}</b><small>{entry.rarity} · {entry.affinity}</small></div></article>;
    })}</div>
  </section>;
}
