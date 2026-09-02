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

  if (pathname?.startsWith('/cards') || pathname?.startsWith('/loopers')) return null;

  const expressive = !['classic-ledger', 'midnight'].includes(themeKey);
  const animated = expressive && motion.enabled && motion.amplificationLevel >= 2;

  return <aside className={`card-district-link theme-${themeKey} ${expressive ? 'card-district-expressive' : ''} ${animated ? 'card-district-animated' : ''}`} aria-label="Card Shop access">
    <a href="/cards">
      <span className="card-district-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="12" height="15" rx="2"/><path d="m9 8 8-2a2 2 0 0 1 2.4 1.5l2.2 9a2 2 0 0 1-1.5 2.4L14 20"/><path d="M8 8h6M8 12h6"/></svg></span>
      <span className="card-district-copy">
        {expressive ? <strong className="card-district-kicker">CARD DISTRICT</strong> : null}
        <b>{expressive ? 'LOKDEX & CARD SHOP' : 'Cards & LOKDEX'}</b>
        <small>Packs · binder · collection · Card Credits</small>
      </span>
      <span className="card-district-enter">Open</span>
    </a>
  </aside>;
}
