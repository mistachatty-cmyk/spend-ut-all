'use client';

import { useEffect, useRef, useState } from 'react';
import { money } from '@/game/format';
import { bankruptcySecondsRemaining } from '@/game/systems/risk';
import type { GameState } from '@/game/types';

export function MoneyCounter({ state, income }: { state: GameState; income: number }) {
  const [display, setDisplay] = useState(state.cash);
  const targetRef = useRef(state.cash);
  const lastRef = useRef(performance.now());

  useEffect(() => { targetRef.current = state.cash; }, [state.cash]);

  useEffect(() => {
    let frame = 0;
    const animate = (now: number) => {
      const dt = Math.min(0.1, (now - lastRef.current) / 1000);
      lastRef.current = now;
      setDisplay((current) => {
        const projected = current + income * dt;
        const target = targetRef.current;
        const gap = target - projected;
        return projected + gap * Math.min(1, dt * 8);
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [income]);

  const countdown = bankruptcySecondsRemaining(state);
  const status = state.runStatus === 'bankrupt' ? 'bankrupt' : countdown ? 'critical' : display < 0 ? 'debt' : income < 0 ? 'falling' : 'growing';
  return <div className={`live-money live-money-${status}`}>
    <div className="balance">{money(display)}</div>
    <div className={income >= 0 ? 'positive' : 'negative'}>{income >= 0 ? '+' : ''}{money(income)}/sec</div>
    {countdown ? <div className="bankruptcy-countdown"><b>{countdown}</b><span>seconds to bankruptcy</span></div> : null}
    {state.riskMode && display < 0 ? <small>DEBT · interest is draining cash</small> : null}
  </div>;
}
