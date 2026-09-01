'use client';

import { useEffect, useMemo, useState } from 'react';
import { lokDexEntries } from '@/data/lokdex';
import { lokPets } from '@/data/customizations';
import type { CustomizationInventory } from '@/game/customization-types';
import type { LokDexCollection } from '@/game/lokdex-types';
import { cardCopiesForCharacter, createLokDexCollection, loadLokDexCollection, saveLokDexCollection, syncCompanionsToLokDex } from '@/game/systems/lokdex';
import { PixelPetSprite } from './PixelPetSprite';

const affinityIcon: Record<string, string> = {
  coin: '◈', work: '⚒', tech: '⌁', nature: '◆', market: '↗', risk: '⚠', travel: '✦', cosmic: '✧', mystery: '?',
};

export function LokDexPanel({ inventory }: { inventory: CustomizationInventory }) {
  const [collection, setCollection] = useState<LokDexCollection>(createLokDexCollection());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const next = syncCompanionsToLokDex(loadLokDexCollection(), inventory);
    setCollection(saveLokDexCollection(next));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setCollection((current) => saveLokDexCollection(syncCompanionsToLokDex(current, inventory)));
  }, [inventory.ownedIds, loaded]);

  const companionCount = useMemo(() => lokDexEntries.filter((entry) => !!entry.companionCustomizationId).length, []);
  const discovered = collection.discoveredIds.length;
  const progress = Math.min(100, Math.round((discovered / Math.max(1, lokDexEntries.length)) * 100));

  return <section className="panel lokdex-panel">
    <div className="lokdex-head">
      <div><span className="eyebrow">GEN 1 LOKDEX · FIRSTLIGHT</span><h2>{discovered}/{lokDexEntries.length} characters discovered</h2><p>Firstlight is the broad opening set of the larger LOKverse—not a finance-only roster. Spend It All currently supports only <b>{companionCount}</b> curated companion/advisors; owning other LOKdex characters does not automatically make them talking pets.</p></div>
      <div className="lokdex-progress"><b>{progress}%</b><span><i style={{ width: `${progress}%` }} /></span><small>{collection.cards.length} local card {collection.cards.length === 1 ? 'copy' : 'copies'}</small></div>
    </div>
    <div className="lokdex-grid">{lokDexEntries.map((entry) => {
      const discoveredEntry = collection.discoveredIds.includes(entry.id);
      const companion = entry.companionCustomizationId ? lokPets.find((candidate) => candidate.id === entry.companionCustomizationId) ?? null : null;
      const companionOwned = companion ? inventory.ownedIds.includes(companion.id) : false;
      const copies = cardCopiesForCharacter(collection, entry.id).length;
      return <article className={`lokdex-card ${discoveredEntry ? 'discovered' : 'undiscovered'} rarity-${entry.rarity}`} key={entry.id}>
        <div className="lokdex-sprite">{companion ? <PixelPetSprite petId={companion.id} mood={companionOwned ? 'happy' : 'idle'} silhouette={!discoveredEntry} size={58} /> : <span className="lokdex-placeholder" aria-hidden="true">{discoveredEntry ? affinityIcon[entry.affinity] ?? '◈' : '?'}</span>}</div>
        <div className="lokdex-card-copy"><small>#{String(entry.number).padStart(3, '0')} · GEN {entry.generation}</small><b>{discoveredEntry ? entry.name : '???'}</b><span>{discoveredEntry ? entry.species : entry.discoveryHint}</span><div className="lokdex-tags"><em>{discoveredEntry ? entry.rarity : 'undiscovered'}</em><em>{entry.affinity}</em>{copies > 0 ? <em>×{copies}</em> : null}{companion ? <em className="companion-badge">Companion {companionOwned ? 'owned' : 'available'}</em> : null}</div></div>
      </article>;
    })}</div>
  </section>;
}
