'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { money } from '@/game/format';
import { formatRunClock, runClockParts } from '@/game/systems/run-clock';
import { gameClockLabel, gameDay } from '@/game/systems/time-simulation';
import { bankruptcySecondsRemaining } from '@/game/systems/risk';
import { debtSummary, normalizeDebtState } from '@/game/systems/debt';
import type { GameState } from '@/game/types';

type HudPrefs = {
  showLok: boolean;
  showRunClock: boolean;
  showGameDay: boolean;
  showMilliseconds: boolean;
  showDebt: boolean;
  compactHud: boolean;
  boxedBalance: boolean;
};

const HUD_PREFS_KEY = 'spend-it-all-hud-counters-v1';
const defaultPrefs: HudPrefs = { showLok: true, showRunClock: true, showGameDay: true, showMilliseconds: true, showDebt: false, compactHud: true, boxedBalance: false };

function BoxedBalance({ value }: { value: number }) {
  const formatted = money(value);
  const match = formatted.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
  if (!match) return <>{formatted}</>;
  const [, prefix, number, suffix] = match;
  const groups = number.split(',');
  return <span className="boxed-balance" aria-label={formatted}>{prefix ? <i className="boxed-prefix">{prefix}</i> : null}{groups.map((group, index) => <span className="boxed-group-wrap" key={`${group}-${index}`}><span className="boxed-group">{group}</span>{index < groups.length - 1 ? <span className="boxed-comma">,</span> : null}</span>)}{suffix ? <i className="boxed-suffix">{suffix}</i> : null}</span>;
}

export function MoneyCounter({ state, income }: { state: GameState; income: number }) {
  const [display, setDisplay] = useState(state.cash);
  const [clockTick, setClockTick] = useState(0);
  const [prefs, setPrefs] = useState<HudPrefs>(defaultPrefs);
  const [showCounterMenu, setShowCounterMenu] = useState(false);
  const targetRef = useRef(state.cash);
  const lastRef = useRef(performance.now());
  const activePlayBaseRef = useRef({ ms: state.activePlayMs ?? 0, at: performance.now() });

  useEffect(() => { targetRef.current = state.cash; }, [state.cash]);
  useEffect(() => { activePlayBaseRef.current = { ms: state.activePlayMs ?? 0, at: performance.now() }; }, [state.activePlayMs]);
  useEffect(() => { try { const saved = localStorage.getItem(HUD_PREFS_KEY); if (saved) setPrefs({ ...defaultPrefs, ...JSON.parse(saved) }); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(HUD_PREFS_KEY, JSON.stringify(prefs)); } catch {} }, [prefs]);
  useEffect(() => { let frame = 0; const animate = (now: number) => { const dt = Math.min(0.1, (now - lastRef.current) / 1000); lastRef.current = now; setDisplay((current) => { const projected = current + income * dt; const target = targetRef.current; const gap = target - projected; return projected + gap * Math.min(1, dt * 8); }); frame = requestAnimationFrame(animate); }; frame = requestAnimationFrame(animate); return () => cancelAnimationFrame(frame); }, [income]);
  useEffect(() => { const timer = window.setInterval(() => setClockTick((value) => value + 1), 47); return () => window.clearInterval(timer); }, []);

  const liveActivePlayMs = useMemo(() => { void clockTick; if (state.runStatus !== 'active') return state.activePlayMs ?? 0; return (activePlayBaseRef.current.ms ?? 0) + Math.max(0, performance.now() - activePlayBaseRef.current.at); }, [clockTick, state.activePlayMs, state.runStatus]);
  const parts = runClockParts(liveActivePlayMs);
  const lokProgress = Math.max(0, Math.min(1, (state.lokProgressMs ?? 0) / 10_000));
  const lokMsRemaining = Math.max(0, 10_000 - (state.lokProgressMs ?? 0));
  const countdown = bankruptcySecondsRemaining(state);
  const debt = normalizeDebtState(state.debt);
  const debtInfo = debtSummary(debt);
  const status = state.runStatus === 'bankrupt' ? 'bankrupt' : countdown ? 'critical' : display < 0 ? 'debt' : income < 0 ? 'falling' : 'growing';
  const patchPref = (key: keyof HudPrefs) => setPrefs((current) => ({ ...current, [key]: !current[key] }));

  return <div className={`live-money live-money-${status} ${prefs.compactHud ? 'hud-compact' : ''}`}>
    <div className={`balance ${prefs.boxedBalance ? 'balance-boxed' : ''}`} data-motion-target="cash">{prefs.boxedBalance ? <BoxedBalance value={display} /> : money(display)}</div>
    <div className={income >= 0 ? 'positive' : 'negative'}>{income >= 0 ? '+' : ''}{money(income)}/sec</div>
    <section className="counter-hud" aria-label="Run counters">
      {prefs.showLok ? <div className="counter-card lok-counter"><span className="counter-label">LOK TOKENS</span><div className="counter-value"><b data-motion-target="lok">◈ {state.lokTokens.toLocaleString()}</b><small>+1 every 10s active</small></div><div className="counter-progress"><span style={{ width: `${lokProgress * 100}%` }} /></div><small>{(lokMsRemaining / 1000).toFixed(1)}s until next LOK</small></div> : null}
      {prefs.showRunClock ? <div className="counter-card run-counter"><span className="counter-label">ACTIVE PLAYTIME</span><div className="counter-value"><b>{formatRunClock(liveActivePlayMs)}</b><small>real active time</small></div><div className="counter-unit-row"><span>{parts.days}d</span><span>{parts.hours}h</span><span>{parts.minutes}m</span><span>{parts.seconds}s</span>{prefs.showMilliseconds ? <span>{String(parts.milliseconds).padStart(3, '0')}ms</span> : null}</div></div> : null}
      {prefs.showGameDay ? <div className="counter-card day-counter"><span className="counter-label">GAME WORLD</span><div className="counter-value"><b>Day {gameDay(state.time)}</b><small>{gameClockLabel(state.time)}</small></div><div className="counter-unit-row"><span>{state.time.settings.enabled ? `${state.time.settings.timeScale}× time` : 'time paused'}</span><span>{Math.round(state.time.fatigue)}% fatigue</span><span>{Math.round(state.time.jetLag)}% jet lag</span></div></div> : null}
      {prefs.showDebt && debt.enabled ? <div className={`counter-card debt-counter ${debtInfo.defaultedDebt > 0 ? 'debt-counter-danger' : ''}`}><span className="counter-label">TOTAL DEBT</span><div className="counter-value"><b data-motion-target="debt">{money(debtInfo.totalDebt)}</b><small>{debtInfo.activeObligations} creditor{debtInfo.activeObligations === 1 ? '' : 's'}</small></div><div className="counter-unit-row"><span>{debt.creditScore} credit</span><span>{money(debtInfo.monthlyEquivalentInterest)}/mo interest</span>{debtInfo.activeCourtCases ? <span>⚖️ {debtInfo.activeCourtCases} court</span> : null}</div></div> : null}
    </section>
    <div className="counter-actions"><button type="button" onClick={() => setShowCounterMenu((value) => !value)} aria-expanded={showCounterMenu}>Counters ⚙</button>{showCounterMenu ? <div className="counter-menu"><label><input type="checkbox" checked={prefs.compactHud} onChange={() => patchPref('compactHud')} /> Compact HUD</label><label><input type="checkbox" checked={prefs.boxedBalance} onChange={() => patchPref('boxedBalance')} /> Boxed balance</label><label><input type="checkbox" checked={prefs.showLok} onChange={() => patchPref('showLok')} /> LOK</label><label><input type="checkbox" checked={prefs.showRunClock} onChange={() => patchPref('showRunClock')} /> Playtime</label><label><input type="checkbox" checked={prefs.showGameDay} onChange={() => patchPref('showGameDay')} /> Day / world time</label><label><input type="checkbox" checked={prefs.showMilliseconds} onChange={() => patchPref('showMilliseconds')} /> Milliseconds</label><label><input type="checkbox" checked={prefs.showDebt} onChange={() => patchPref('showDebt')} disabled={!debt.enabled} /> Debt {debt.enabled ? '' : '(system off)'}</label></div> : null}</div>
    {countdown ? <div className="bankruptcy-countdown"><b>{countdown}</b><span>seconds to bankruptcy</span></div> : null}
    {state.riskMode && display < 0 ? <small>DEBT · interest is draining cash</small> : null}
  </div>;
}
