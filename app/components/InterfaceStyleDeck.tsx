'use client';

import { useEffect, useState } from 'react';
import { lokPets } from '@/data/customizations';
import { PixelPetSprite } from './PixelPetSprite';
import {
  loadHudPreferences,
  saveHudPreferences,
  subscribeHudPreferences,
  type HudPreferences,
  type InformationDensity,
  type UiEdgeStyle,
} from '@/game/systems/hud-preferences';

const edgeChoices: Array<{ id: UiEdgeStyle; title: string; detail: string }> = [
  { id: 'rounded', title: 'Rounded edges', detail: 'Soft, polished panels that match the Production Looper collection.' },
  { id: 'boxed', title: 'Boxed edges', detail: 'Tighter, pixel-forward corners for a terminal-like layout.' },
];

const densityChoices: Array<{ id: InformationDensity; title: string; detail: string }> = [
  { id: 'more', title: 'More information', detail: 'Keep every useful counter and progress detail visible.' },
  { id: 'balanced', title: 'Middle information', detail: 'Show the important readouts and hold back the extra noise.' },
  { id: 'less', title: 'Less information', detail: 'Keep the money and next decision in focus.' },
];

export function InterfaceStyleDeck({ companionId, companionName, onComplete }: { companionId: string; companionName: string; onComplete: () => void }) {
  const [prefs, setPrefs] = useState<HudPreferences>(() => loadHudPreferences());
  const companion = lokPets.find((entry) => entry.id === companionId);

  useEffect(() => subscribeHudPreferences(setPrefs), []);

  const patch = (next: Partial<HudPreferences>) => {
    setPrefs((current) => saveHudPreferences({ ...current, ...next }));
  };

  return (
    <section className="interface-style-deck" aria-labelledby="interface-style-title">
      <aside className="interface-style-sidebar" aria-label="Style Deck controls">
        <div>
          <span className="eyebrow">STYLE DECK · STEP 2 OF 2</span>
          <h2>Set your play screen</h2>
          <p>{companionName} is ready. Choose how your dashboard should feel before you start spending.</p>
        </div>

        <nav className="interface-style-nav" aria-label="Style Deck sections">
          <a href="#style-corners">01 <span>Edges</span></a>
          <a href="#style-information">02 <span>Information</span></a>
          <a href="#style-preview">03 <span>Preview</span></a>
        </nav>

        <p className="interface-style-sidebar-note">These are display preferences only. Your earnings, purchases, companions, and difficulty stay exactly the same.</p>
      </aside>

      <div className="interface-style-content">
        <header>
          <span className="eyebrow">YOUR INTERFACE</span>
          <h1 id="interface-style-title">Make the screen yours</h1>
          <p>Use the sidebar to set the frame, visual language, and how much information stays in view. You can revise every choice later.</p>
        </header>

        <section className="interface-companion-preview" data-art-mode={prefs.visualArtMode} aria-live="polite">
          <div className="interface-companion-stage">
            {prefs.visualArtMode === 'emoji' ? <span className="interface-companion-emoji" aria-hidden="true">{companion?.emoji ?? '🐾'}</span> : null}
            {prefs.visualArtMode === 'pixel' ? <PixelPetSprite petId={companionId} mood="happy" size={108} artStyle="classic" /> : null}
            {prefs.visualArtMode === 'photo' ? <PixelPetSprite petId={companionId} mood="happy" size={124} artStyle="production" /> : null}
          </div>
          <div><span className="eyebrow">LIVE COMPANION PREVIEW</span><h3>{companionName}</h3><p>{prefs.visualArtMode === 'emoji' ? 'Lightweight emoji mode' : prefs.visualArtMode === 'pixel' ? 'Classic pixel collection' : 'Real-life imagery with production companion art'}</p></div>
        </section>

        <section id="style-corners" className="interface-style-section">
          <div><span className="eyebrow">FRAME</span><h3>How should panels look?</h3></div>
          <div className="interface-style-choice-grid">
            {edgeChoices.map((choice) => (
              <button
                type="button"
                key={choice.id}
                className={prefs.uiEdgeStyle === choice.id ? 'selected' : ''}
                aria-pressed={prefs.uiEdgeStyle === choice.id}
                onClick={() => patch({ uiEdgeStyle: choice.id })}
              >
                <i className={`interface-style-edge-sample ${choice.id}`} aria-hidden="true" />
                <b>{choice.title}</b>
                <small>{choice.detail}</small>
              </button>
            ))}
          </div>
        </section>

        <section id="style-information" className="interface-style-section">
          <div><span className="eyebrow">READOUTS</span><h3>How much information should stay visible?</h3></div>
          <div className="interface-style-choice-grid density-grid">
            {densityChoices.map((choice) => (
              <button
                type="button"
                key={choice.id}
                className={prefs.informationDensity === choice.id ? 'selected' : ''}
                aria-pressed={prefs.informationDensity === choice.id}
                onClick={() => patch({ informationDensity: choice.id })}
              >
                <i className={`interface-style-density-sample ${choice.id}`} aria-hidden="true"><span /><span /><span /></i>
                <b>{choice.title}</b>
                <small>{choice.detail}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="interface-style-section">
          <div><span className="eyebrow">GAME ART STYLE</span><h3>Choose one visual language</h3></div>
          <div className="interface-style-choice-grid interface-art-grid three-mode-grid">
            <button type="button" className={prefs.visualArtMode === 'emoji' ? 'selected' : ''} aria-pressed={prefs.visualArtMode === 'emoji'} onClick={() => patch({ visualArtMode: 'emoji' })}>
              <i className="interface-style-emoji-sample" aria-hidden="true">💼</i>
              <b>Emoji</b>
              <small>Fastest and simplest. Every item uses its matching symbol.</small>
            </button>
            <button type="button" className={prefs.visualArtMode === 'pixel' ? 'selected' : ''} aria-pressed={prefs.visualArtMode === 'pixel'} onClick={() => patch({ visualArtMode: 'pixel', looperArtStyle: 'classic' })}>
              <i className="interface-style-pixel-sample" aria-hidden="true"><span /><span /><span /><span /></i>
              <b>Pixel</b>
              <small>Item-specific pixel art and classic pixel companions, with no emoji overlay.</small>
            </button>
            <button type="button" className={prefs.visualArtMode === 'photo' ? 'selected' : ''} aria-pressed={prefs.visualArtMode === 'photo'} onClick={() => patch({ visualArtMode: 'photo', looperArtStyle: 'production' })}>
              <i className="interface-style-photo-sample" aria-hidden="true" />
              <b>Real-life</b>
              <small>Matching photography for the economy and production companion artwork.</small>
            </button>
          </div>
          <p className="interface-style-coming">This selection controls purchases, earnings, businesses, debt, upgrades, and rich-person scenarios. Missing photos safely fall back to pixel art—never to an unrelated person.</p>
        </section>

        <section id="style-preview" className="interface-style-preview" data-ui-edge={prefs.uiEdgeStyle} data-information-density={prefs.informationDensity}>
          <div className="interface-style-preview-top"><span>SPEND IT ALL</span><b>◈ 24</b></div>
          <div className="interface-style-preview-balance"><small>AVAILABLE TO SPEND</small><b>$12,480</b><span>+$86 / sec</span></div>
          <div className="interface-style-preview-bars" aria-label="Preview information bars">
            <span><i />Net worth <b>$18.4K</b></span>
            <span className="preview-secondary"><i />Goals <b>3 active</b></span>
            <span className="preview-tertiary"><i />Playtime <b>01:42</b></span>
          </div>
        </section>

        <button type="button" className="interface-style-finish" onClick={onComplete}>Start with this setup</button>
      </div>
    </section>
  );
}

export default InterfaceStyleDeck;
