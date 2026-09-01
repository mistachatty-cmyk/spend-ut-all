'use client';

import { useEffect, useRef, useState } from 'react';
import { badges, collectibleSets, collectibles } from '@/data/meta';
import { normalizeMetaState } from '@/game/systems/meta-progression';
import type { DiscoveryRecord, MetaState } from '@/game/meta-types';

const META_KEY = 'spend-it-all-meta-v1';

function definitionFor(discovery: DiscoveryRecord) {
  if (discovery.kind === 'badge') return badges.find((entry) => entry.id === discovery.id);
  if (discovery.kind === 'collectible') return collectibles.find((entry) => entry.id === discovery.id);
  return collectibleSets.find((entry) => entry.id === discovery.id);
}

export function DiscoveryNotifier() {
  const initialized = useRef(false);
  const lastKey = useRef<string | null>(null);
  const [discovery, setDiscovery] = useState<DiscoveryRecord | null>(null);

  useEffect(() => {
    const check = () => {
      const raw = localStorage.getItem(META_KEY);
      if (!raw) return;
      let meta: MetaState;
      try { meta = normalizeMetaState(JSON.parse(raw)); } catch { return; }
      const latest = meta.discoveries[0];
      if (!latest) return;
      const key = `${latest.kind}:${latest.id}:${latest.discoveredAt}`;
      if (!initialized.current) {
        initialized.current = true;
        lastKey.current = key;
        return;
      }
      if (key === lastKey.current) return;
      lastKey.current = key;
      setDiscovery(latest);
      window.setTimeout(() => setDiscovery((current) => current === latest ? null : current), 6500);
    };

    check();
    const timer = window.setInterval(check, 500);
    return () => window.clearInterval(timer);
  }, []);

  if (!discovery) return null;
  const definition = definitionFor(discovery);
  const label = discovery.kind === 'badge' ? 'BADGE UNLOCKED' : discovery.kind === 'collectible' ? 'RELIC DISCOVERED' : 'COLLECTION COMPLETED';

  return <button className={`discovery-toast discovery-${discovery.kind}`} onClick={() => setDiscovery(null)} aria-label="Dismiss discovery notification">
    <div className="discovery-burst">{definition?.emoji ?? '✨'}</div>
    <div><span>{label}</span><b>{definition?.name ?? discovery.id}</b><small>{definition?.description ?? 'A new piece of your legacy has been recorded.'}</small></div>
    <i>×</i>
  </button>;
}
