'use client';

import { lokDexEntries } from '@/data/lokdex';
import { lokPets } from '@/data/customizations';
import type { CustomizationInventory } from '@/game/customization-types';
import { PixelPetSprite } from './PixelPetSprite';

export function LokDexPanel({ inventory }: { inventory: CustomizationInventory }) {
  const discovered = lokDexEntries.filter((entry) => inventory.ownedIds.includes(entry.petId)).length;
  return <section className="panel lokdex-panel">
    <div className="lokdex-head"><div><span className="eyebrow">GEN 1 LOKDEX</span><h2>{discovered}/{lokDexEntries.length} companions discovered</h2><p>Spend It All is the origin set. Future generated variants can use the same IDs, provenance and card metadata without turning local play into online trading yet.</p></div><div className="lokdex-progress"><b>{Math.round((discovered / Math.max(1, lokDexEntries.length)) * 100)}%</b><span><i style={{ width: `${(discovered / Math.max(1, lokDexEntries.length)) * 100}%` }} /></span></div></div>
    <div className="lokdex-grid">{lokDexEntries.map((entry) => {
      const pet = lokPets.find((candidate) => candidate.id === entry.petId);
      const owned = inventory.ownedIds.includes(entry.petId);
      if (!pet) return null;
      return <article className={`lokdex-card ${owned ? 'discovered' : 'undiscovered'} rarity-${pet.rarity}`} key={entry.petId}>
        <div className="lokdex-sprite"><PixelPetSprite petId={entry.petId} mood={owned ? 'happy' : 'idle'} silhouette={!owned} size={58} /></div>
        <div><small>#{String(entry.number).padStart(3, '0')} · GEN {entry.generation}</small><b>{owned ? pet.name : '???'}</b><span>{owned ? pet.species : entry.discoveryHint}</span><em>{owned ? pet.rarity : 'undiscovered'}</em></div>
      </article>;
    })}</div>
  </section>;
}
