'use client';

import { useEffect } from 'react';
import { money } from '@/game/format';
import { addRunResult, createRunResult, LEADERBOARD_KEY, normalizeRunHistory } from '@/game/systems/leaderboard';
import type { GameState } from '@/game/types';

export function GameOverView({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  useEffect(() => {
    const result = createRunResult(state, false);
    let history = [];
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) { try { history = normalizeRunHistory(JSON.parse(raw)); } catch { history = []; } }
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(addRunResult(history, result)));
  }, [state]);

  return <main className="gameover-shell"><section className="panel gameover-card"><span className="gameover-icon">💥</span><span className="eyebrow">RUN OVER</span><h1>Bankrupt</h1><p>The countdown reached zero. This empire is frozen, but your LOK Tokens and Legacy Collection are untouched.</p><div className="gameover-stats"><span>Ending cash <b>{money(state.cash)}</b></span><span>Peak cash <b>{money(state.peakCash)}</b></span><span>Peak net worth <b>{money(state.peakNetWorth)}</b></span><span>Total earned <b>{money(state.lifetimeIncome)}</b></span><span>Total spent <b>{money(state.totalSpent)}</b></span><span>Scale <b>City {state.townLevel} · Region {state.regionLevel}</b></span></div><button className="primary" onClick={onRestart}>Start a New Run</button><small>Your result has been saved to the local leaderboard.</small></section></main>;
}
