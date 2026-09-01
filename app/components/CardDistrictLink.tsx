'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMicroMotionPreferences } from '@/app/hooks/useMicroMotion';
import { customizationById } from '@/data/customizations';
import { loadCustomizationInventory } from '@/game/systems/customizations';

export function CardDistrictLink() {
  const pathname = usePathname();
  const motion = useMicroMotionPreferences();
  const [themeKey, setThemeKey] = useState('classic-ledger');

  useEffect(() => {
    const refresh = () => {
      const inventory = loadCustomizationInventory();
      const theme = customizationById(inventory.equipped.themeId);
      setThemeKey(theme?.previewKey ?? 'classic-ledger');
    };
    refresh();
    window.addEventListener('storage', refresh);
    const timer = window.setInterval(refresh, 1500);
    return () => { window.removeEventListener('storage', refresh); window.clearInterval(timer); };
  }, []);

  if (pathname?.startsWith('/cards')) return null;

  const expressive = !['classic-ledger', 'midnight'].includes(themeKey);
  const animated = expressive && motion.enabled && motion.amplificationLevel >= 2;

  return <aside className={`card-district-link theme-${themeKey} ${expressive ? 'card-district-expressive' : ''} ${animated ? 'card-district-animated' : ''}`} aria-label="Card Shop access">
    <a href="/cards">
      <span className="card-district-icon">🃏</span>
      <span className="card-district-copy">
        {expressive ? <strong className="card-district-kicker">CARD DISTRICT</strong> : null}
        <b>{expressive ? 'LOKDEX & CARD SHOP' : 'Cards & LOKDEX'}</b>
        <small>Packs · binder · collection · Card Credits</small>
      </span>
      <span className="card-district-enter">Open</span>
    </a>
  </aside>;
}
