'use client';

import { useEffect, useState } from 'react';
import { CardShopView } from '@/app/components/CardShopView';
import type { CustomizationInventory } from '@/game/customization-types';
import { createCustomizationInventory, loadCustomizationInventory } from '@/game/systems/customizations';

export default function CardsPage() {
  const [inventory, setInventory] = useState<CustomizationInventory>(() => createCustomizationInventory());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setInventory(loadCustomizationInventory());
    setLoaded(true);
  }, []);

  return <main className="standalone-card-page">
    <header className="standalone-card-nav">
      <a href="/" className="card-home-link">← Spend It All</a>
      <div><span className="eyebrow">LOKDEX · ORIGIN DISTRICT</span><b>Standalone Card Shop</b></div>
      <span>{loaded ? 'Local collection loaded' : 'Loading local collection…'}</span>
    </header>
    <section className="standalone-card-content"><CardShopView inventory={inventory} /></section>
  </main>;
}
