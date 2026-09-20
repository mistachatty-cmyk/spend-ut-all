'use client';

import { useEffect, useRef, useState } from 'react';
import { money } from '@/game/format';
import type { GameState } from '@/game/types';

interface PersistentFollowHudProps {
  state: GameState;
  income: number;
  worth: number;
  cardCredits: number;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
}

interface HudBubble {
  id: number;
  text: string;
  isPositive: boolean;
}

export function PersistentFollowHud({
  state,
  income,
  worth,
  cardCredits,
  activeTab,
  onTabChange,
}: PersistentFollowHudProps) {
  const [visible, setVisible] = useState(false);
  const [displayedCash, setDisplayedCash] = useState(state.cash);
  const [cashDeltaClass, setCashDeltaClass] = useState<'positive' | 'negative' | null>(null);
  const [bubbles, setBubbles] = useState<HudBubble[]>([]);
  const prevCashRef = useRef(state.cash);
  const nextBubbleIdRef = useRef(1);

  // Monitor window scroll to show HUD when scrolling past main header
  useEffect(() => {
    const handleScroll = () => {
      // Show HUD once user scrolls past 150px
      const shouldShow = window.scrollY > 150;
      setVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live count up / down effect and bubble generation on cash changes
  useEffect(() => {
    const prev = prevCashRef.current;
    const current = state.cash;
    const diff = current - prev;

    if (Math.abs(diff) >= 1) {
      const isPos = diff > 0;
      setCashDeltaClass(isPos ? 'positive' : 'negative');

      // Create a floating bubble
      const bubbleId = nextBubbleIdRef.current++;
      const bubbleText = isPos ? `+${money(diff)}` : `-${money(Math.abs(diff))}`;
      setBubbles(curr => [...curr.slice(-4), { id: bubbleId, text: bubbleText, isPositive: isPos }]);

      // Remove bubble after animation
      setTimeout(() => {
        setBubbles(curr => curr.filter(b => b.id !== bubbleId));
      }, 1400);

      // Reset pulse class
      const timer = setTimeout(() => {
        setCashDeltaClass(null);
      }, 700);

      prevCashRef.current = current;
      setDisplayedCash(current);

      return () => clearTimeout(timer);
    } else {
      setDisplayedCash(current);
      prevCashRef.current = current;
    }
  }, [state.cash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <aside
      id="persistent-follow-hud"
      aria-label="Floating Status Bar"
      className={`persistent-follow-hud ${cashDeltaClass ? `pulse-${cashDeltaClass}` : ''}`}
    >
      <div className="hud-content">
        {/* Cash with live counter & floating bubbles */}
        <div className="hud-metric hud-cash-section" data-motion-target="cash">
          <span className="hud-label">Cash</span>
          <div className="hud-cash-wrapper">
            <strong className={`hud-cash-value ${cashDeltaClass ?? ''}`}>
              {money(displayedCash)}
            </strong>
            {/* Live floating bubbles attached to the HUD */}
            <div className="hud-bubbles-anchor">
              {bubbles.map(bubble => (
                <span
                  key={bubble.id}
                  className={`hud-bubble ${bubble.isPositive ? 'positive' : 'negative'}`}
                >
                  {bubble.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hud-divider" />

        {/* Income / sec */}
        <div className="hud-metric hud-income-section">
          <span className="hud-label">Income</span>
          <b className={`hud-income-value ${income >= 0 ? 'positive' : 'negative'}`}>
            {income >= 0 ? '+' : ''}{money(income)}/s
          </b>
        </div>

        <div className="hud-divider hide-mobile" />

        {/* Net Worth */}
        <div className="hud-metric hide-mobile">
          <span className="hud-label">Net Worth</span>
          <b>{money(worth)}</b>
        </div>

        <div className="hud-divider" />

        {/* Card Credits */}
        <a
          href="/cards"
          className="hud-metric hud-card-credits"
          title="Open Card District"
        >
          <span className="hud-label">Credits</span>
          <b className="hud-credit-val">◫ {Math.floor(cardCredits).toLocaleString()}</b>
        </a>

        {/* Scroll To Top button */}
        <button
          className="hud-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
          aria-label="Scroll back to top"
        >
          ▲ Top
        </button>
      </div>
    </aside>
  );
}
