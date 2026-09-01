'use client';

import { useEffect, useState } from 'react';
import { loadHudPreferences, saveHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';

export function AdvancedInterfaceControl() {
  const [prefs, setPrefs] = useState<HudPreferences>(() => loadHudPreferences());

  useEffect(() => subscribeHudPreferences(setPrefs), []);
  useEffect(() => {
    document.documentElement.dataset.interfaceMode = prefs.interfaceMode;
    document.documentElement.dataset.looperArt = prefs.looperArtStyle;
  }, [prefs.interfaceMode, prefs.looperArtStyle]);

  const advanced = prefs.interfaceMode === 'advanced';
  const pixelPlus = prefs.looperArtStyle === 'pixel-plus';
  const patch = (nextPatch: Partial<HudPreferences>) => {
    const next = saveHudPreferences({ ...prefs, ...nextPatch });
    setPrefs(next);
  };

  return <aside className="advanced-interface-control" aria-label="Interface and Looper visual modes">
    <section className="interface-setting-block">
      <div>
        <span className="eyebrow">INTERFACE MODE · BUILD PREVIEW</span>
        <b>{advanced ? 'Advanced Command UI' : 'Simple UI'}</b>
        <small>{advanced ? 'Dense command presentation is enabled. You can return to Simple at any time.' : 'Turn on the in-development command interface. This is temporarily available to everyone while it is being built.'}</small>
        <em>Later, Advanced UI will unlock through meaningful progression, but Simple UI will remain permanently available.</em>
      </div>
      <button type="button" className={advanced ? 'active' : ''} onClick={() => patch({ interfaceMode: advanced ? 'simple' : 'advanced' })} aria-pressed={advanced}>{advanced ? 'Use Simple UI' : 'Preview Advanced UI'}</button>
    </section>

    <section className="interface-setting-block looper-art-setting">
      <div>
        <span className="eyebrow">LOOPER ART STYLE</span>
        <b>{pixelPlus ? 'Pixel+ Production Art' : 'Classic Pixel Art'}</b>
        <small>{pixelPlus ? 'Higher-detail canonical Firstlight sprites and signature animation layers.' : 'Original compact companion sprites preserved as a lightweight legacy option.'}</small>
        <em>Pixel+ is the default direction. Classic remains available for preference, nostalgia, and lower visual load.</em>
      </div>
      <button type="button" className={pixelPlus ? 'active' : ''} onClick={() => patch({ looperArtStyle: pixelPlus ? 'classic' : 'pixel-plus' })} aria-pressed={pixelPlus}>{pixelPlus ? 'Use Classic Art' : 'Use Pixel+ Art'}</button>
    </section>
  </aside>;
}
