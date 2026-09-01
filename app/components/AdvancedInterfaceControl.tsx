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
  const pixelPlus = prefs.looperArtStyle === 'pixel-plus';
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
        <b>{pixelPlus ? 'Pixel+ Production Art' : 'Classic Pixel Art'}</b>
        <small>{pixelPlus ? 'Higher-detail canonical Firstlight sprites and signature visual layers.' : 'Original compact companion sprites preserved as the lightweight legacy option.'}</small>
        <em>This switch changes the actual Looper renderer used in companions, LOKDEX and supported Card Shop surfaces.</em>
      </div>
      <button type="button" className={pixelPlus ? 'active' : ''} onClick={() => patch({ looperArtStyle: pixelPlus ? 'classic' : 'pixel-plus' })} aria-pressed={pixelPlus}>{pixelPlus ? 'Switch to Classic' : 'Switch to Pixel+'}</button>
    </section>

    <section className="interface-setting-block looper-motion-setting">
      <div>
        <span className="eyebrow">LOOPER ANIMATION</span>
        <b>{looperAnimated ? 'Animations On' : 'Animations Off / Static'}</b>
        <small>{looperAnimated ? `Effects level ${motionPrefs.amplificationLevel} is high enough for sprite-frame, body and signature animation.` : 'Looper animation starts at Effects level Animated (2). Static (1) intentionally keeps characters still.'}</small>
        <em>You can fine-tune the full effect level from Settings → Effects.</em>
      </div>
      <button type="button" className={looperAnimated ? 'active' : ''} disabled={looperAnimated} onClick={enableLooperMotion}>{looperAnimated ? 'Animated ✓' : 'Enable Looper Animations'}</button>
    </section>
  </aside>;
}
