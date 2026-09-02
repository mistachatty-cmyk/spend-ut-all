'use client';

import { useEffect, useState } from 'react';
import { loadHudPreferences, saveHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';
import { loadMicroMotionPreferences, saveMicroMotionPreferences, subscribeMicroMotionPreferences } from '@/game/systems/micro-animations';
import type { MicroMotionPreferences } from '@/game/micro-animation-types';

export function AdvancedInterfaceControl() {
  const [prefs, setPrefs] = useState<HudPreferences>(() => loadHudPreferences());
  const [motionPrefs, setMotionPrefs] = useState<MicroMotionPreferences>(() => loadMicroMotionPreferences());

  useEffect(() => subscribeHudPreferences(setPrefs), []);
  useEffect(() => subscribeMicroMotionPreferences(setMotionPrefs), []);
  useEffect(() => {
    document.documentElement.dataset.interfaceMode = prefs.interfaceMode;
    document.documentElement.dataset.looperArt = prefs.looperArtStyle;
  }, [prefs.interfaceMode, prefs.looperArtStyle]);

  const advanced = prefs.interfaceMode === 'advanced';
  const production = prefs.looperArtStyle === 'production';
  const looperAnimated = motionPrefs.enabled && motionPrefs.amplificationLevel >= 2;
  const patch = (nextPatch: Partial<HudPreferences>) => {
    const next = saveHudPreferences({ ...prefs, ...nextPatch });
    setPrefs(next);
  };
  const enableLooperMotion = () => {
    const next = saveMicroMotionPreferences({ ...motionPrefs, enabled: true, amplificationLevel: Math.max(2, motionPrefs.amplificationLevel) as MicroMotionPreferences['amplificationLevel'] });
    setMotionPrefs(next);
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
        <span className="eyebrow">LOOPER / COMPANION ART</span>
        <b>{production ? 'Production Looper Art' : 'Classic Pixel Art'}</b>
        <small>{production ? 'Canonical high-detail Firstlight characters with personality motifs, materials and signature visual layers.' : 'Original compact companion sprites preserved as the lightweight legacy option.'}</small>
        <em>Production is the primary art direction. Classic remains available at any time for preference and lower visual load.</em>
      </div>
      <div className="interface-setting-actions"><button type="button" className={production ? 'active' : ''} onClick={() => patch({ looperArtStyle: production ? 'classic' : 'production' })} aria-pressed={production}>{production ? 'Switch to Classic' : 'Use Production Art'}</button><a href="/loopers">Open Looper Production Lab</a></div>
    </section>

    <section className="interface-setting-block looper-motion-setting">
      <div>
        <span className="eyebrow">LOOPER ANIMATION</span>
        <b>{looperAnimated ? 'Animations On' : 'Animations Off / Static'}</b>
        <small>{looperAnimated ? `Effects level ${motionPrefs.amplificationLevel} is high enough for body, face, tail, wing and signature animation.` : 'Looper animation starts at Effects level Animated (2). Static (1) intentionally keeps characters still.'}</small>
        <em>Production Loopers use the same global performance ceiling and respect reduced-motion preferences.</em>
      </div>
      <button type="button" className={looperAnimated ? 'active' : ''} disabled={looperAnimated} onClick={enableLooperMotion}>{looperAnimated ? 'Animated ✓' : 'Enable Looper Animations'}</button>
    </section>
  </aside>;
}
