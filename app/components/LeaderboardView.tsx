'use client';

import { useEffect, useState } from 'react';
import { money } from '@/game/format';
import type { RunResult } from '@/game/run-types';
import { LEADERBOARD_KEY, normalizeRunHistory } from '@/game/systems/leaderboard';

export function LeaderboardView() {
  const [history, setHistory] = useState<RunResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return;
    try { setHistory(normalizeRunHistory(JSON.parse(raw))); } catch { localStorage.removeItem(LEADERBOARD_KEY); }
  }, []);
  const copyCode = async (run: RunResult) => {
    if (!run.challengeCode) return;
    try { await navigator.clipboard.writeText(run.challengeCode); setCopied(run.id); window.setTimeout(() => setCopied(null), 1500); } catch { setCopied(null); }
  };

  return <section className="leaderboard-shell"><section className="panel"><span className="eyebrow">RUN HISTORY</span><h2>Saved leaderboard</h2><p className="muted">Completed and bankrupt runs stay here even after the active run is reset. Custom challenges preserve their name and share code. This MVP leaderboard is local to this device.</p>{history.length ? <div className="leaderboard-list">{history.map((run, index) => <article key={run.id}><strong>#{index + 1}</strong><div><b>{run.result === 'bankrupt' ? '💥 Bankrupt' : '🏆 Completed'} · {run.scenarioName ?? run.scenarioId}</b><small>{run.riskMode ? 'Risk Mode' : 'Standard'} · {run.mode} · {Math.round(run.durationMs / 1000)}s</small>{run.challengeCode ? <button className="run-code-button" onClick={() => copyCode(run)}>{copied === run.id ? 'Code copied ✓' : 'Copy challenge code'}</button> : null}</div><span><b>{run.score.toLocaleString()}</b><small>score</small></span><span><b>{money(run.peakNetWorth)}</b><small>peak worth</small></span><span><b>{money(run.lifetimeIncome)}</b><small>earned</small></span></article>)}</div> : <div className="empty-leaderboard">Finish or lose a run to create your first leaderboard entry.</div>}</section></section>;
}
