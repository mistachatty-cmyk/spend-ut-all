'use client';

import { useEffect, useState } from 'react';
import type { GameState } from '@/game/types';
import { formatRunClock, nextRunClockMilestone, runClockProgress, runClockParts } from '@/game/systems/run-clock';
import { gameClockLabel, gameDay } from '@/game/systems/time-simulation';

export function RunClock({ state }: { state: GameState }) {
  const [, refresh] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => refresh((v) => v + 1), 47); return () => window.clearInterval(timer); }, []);
  if (!state.time.display.enabled) return null;
  const parts = runClockParts(state.activePlayMs);
  const next = nextRunClockMilestone(state.activePlayMs);
  const d = state.time.display;
  return <section className="run-clock" aria-label="Run clock">
    <div className="run-clock-main"><span className="eyebrow">ACTIVE PLAYTIME</span><b>{formatRunClock(state.activePlayMs)}</b></div>
    <div className="run-clock-units">
      {d.showDays ? <span><b>{parts.days}</b><small>days</small></span> : null}
      {d.showHours ? <span><b>{parts.hours}</b><small>hours</small></span> : null}
      {d.showMinutes ? <span><b>{parts.minutes}</b><small>min</small></span> : null}
      {d.showSeconds ? <span><b>{parts.seconds}</b><small>sec</small></span> : null}
      {d.showMilliseconds ? <span><b>{String(parts.milliseconds).padStart(3,'0')}</b><small>ms</small></span> : null}
    </div>
    {d.showGameDay ? <div className="game-day-counter"><b>Day {gameDay(state.time)}</b><span>{gameClockLabel(state.time)}</span></div> : null}
    {next ? <div className="run-clock-milestone"><div><small>Next time milestone</small><b>{next.emoji} {next.label}</b></div><div className="run-clock-bar"><span style={{ width: `${runClockProgress(state.activePlayMs) * 100}%` }} /></div></div> : null}
  </section>;
}
