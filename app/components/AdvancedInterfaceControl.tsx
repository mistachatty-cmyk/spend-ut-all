'use client';

import { useEffect, useState } from 'react';
import { loadHudPreferences, saveHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';

export function AdvancedInterfaceControl() {
  const [prefs, setPrefs] = useState<HudPreferences>(() => loadHudPreferences());

  useEffect(() => subscribeHudPreferences(setPrefs), []);
  useEffect(() => {
    document.documentElement.dataset.interfaceMode = prefs.interfaceMode;
  }, [prefs.interfaceMode]);

  const advanced = prefs.interfaceMode === 'advanced';
  const toggle = () => {
    const next = saveHudPreferences({ ...prefs, interfaceMode: advanced ? 'simple' : 'advanced' });
    setPrefs(next);
  };

  return <aside className="advanced-interface-control" aria-label="Interface mode">
    <div>
      <span className="eyebrow">INTERFACE MODE · BUILD PREVIEW</span>
      <b>{advanced ? 'Advanced Command UI' : 'Simple UI'}</b>
      <small>{advanced ? 'Dense command presentation is enabled. You can return to Simple at any time.' : 'Turn on the in-development command interface. This is temporarily available to everyone while it is being built.'}</small>
      <em>Planned progression: Advanced UI will later unlock through meaningful play, but the unlock will never force it on. Simple UI remains permanently available for accessibility, performance and preference.</em>
    </div>
    <button type="button" className={advanced ? 'active' : ''} onClick={toggle} aria-pressed={advanced}>{advanced ? 'Use Simple UI' : 'Preview Advanced UI'}</button>
  </aside>;
}
