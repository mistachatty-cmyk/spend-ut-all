'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { money, formatMoneyWithPref } from '@/game/format';
import { formatRunClock, runClockParts } from '@/game/systems/run-clock';
import { gameClockLabel, gameDay } from '@/game/systems/time-simulation';
import { bankruptcySecondsRemaining } from '@/game/systems/risk';
import { debtSummary, normalizeDebtState } from '@/game/systems/debt';
import { loadHudPreferences, saveHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';
import { FlipCounter } from './FlipCounter';
import type { GameState } from '@/game/types';

export function MoneyCounter({ state, income }: { state: GameState; income: number }) {
  const [display, setDisplay] = useState(state.cash);
  const [clockTick, setClockTick] = useState(0);
  const [prefs, setPrefs] = useState<HudPreferences>(() => loadHudPreferences());
  const [isPulsing, setIsPulsing] = useState(false);
  const targetRef = useRef(state.cash);
  const lastRef = useRef(performance.now());
  const activePlayBaseRef = useRef({ ms: state.activePlayMs ?? 0, at: performance.now() });

  useEffect(() => { targetRef.current = state.cash; }, [state.cash]);
  useEffect(() => { activePlayBaseRef.current = { ms: state.activePlayMs ?? 0, at: performance.now() }; }, [state.activePlayMs]);
  useEffect(() => { setPrefs(loadHudPreferences()); return subscribeHudPreferences(setPrefs); }, []);

  // Performance-adaptive animation loop: potato mode snaps directly or updates at reduced cadence
  useEffect(() => {
    let frame = 0;
    if (prefs.potatoMode) {
      // In potato mode, skip continuous rAF interpolation to conserve CPU
      setDisplay(targetRef.current);
      return;
    }

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
  }, [income, prefs.potatoMode, state.cash]);

  // Clock tick rate adapts to potato PC mode: 500ms for eco / potato, 47ms only if milliseconds enabled
  useEffect(() => {
    const intervalMs = prefs.potatoMode || prefs.lowPowerTicks ? 1000 : prefs.showMilliseconds ? 47 : 250;
    const timer = window.setInterval(() => setClockTick((value) => value + 1), intervalMs);
    return () => window.clearInterval(timer);
  }, [prefs.potatoMode, prefs.lowPowerTicks, prefs.showMilliseconds]);

  // Visual income pulse tick every second when income is non-zero
  useEffect(() => {
    if (!prefs.incomePulse || prefs.potatoMode || income === 0) return;
    const timer = window.setInterval(() => {
      setIsPulsing(true);
      const timeout = window.setTimeout(() => setIsPulsing(false), 550);
      return () => window.clearTimeout(timeout);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [income, prefs.incomePulse, prefs.potatoMode]);

  const liveActivePlayMs = useMemo(() => {
    void clockTick;
    if (state.runStatus !== 'active') return state.activePlayMs ?? 0;
    return (activePlayBaseRef.current.ms ?? 0) + Math.max(0, performance.now() - activePlayBaseRef.current.at);
  }, [clockTick, state.activePlayMs, state.runStatus]);

  const parts = runClockParts(liveActivePlayMs);
  const lokProgress = Math.max(0, Math.min(1, (state.lokProgressMs ?? 0) / 10_000));
  const lokMsRemaining = Math.max(0, 10_000 - (state.lokProgressMs ?? 0));
  const countdown = bankruptcySecondsRemaining(state);
  const debt = normalizeDebtState(state.debt);
  const debtInfo = debtSummary(debt);
  const status = state.runStatus === 'bankrupt' ? 'bankrupt' : countdown ? 'critical' : display < 0 ? 'debt' : income < 0 ? 'falling' : 'growing';

  const formattedBalance = formatMoneyWithPref(display, prefs.showFullDigits, true);
  const formattedIncome = `${income >= 0 ? '+' : ''}${formatMoneyWithPref(income, prefs.showFullDigits, false)}/sec`;

  const toggleFullDigits = () => {
    saveHudPreferences({ ...prefs, showFullDigits: !prefs.showFullDigits });
  };

  const toggleAnimatedFlip = () => {
    saveHudPreferences({ ...prefs, animatedFlip: !prefs.animatedFlip });
  };

  return <div className={`live-money live-money-${status} ${prefs.compactHud ? 'hud-compact' : ''}`}>
    <div className="balance-wrap">
      <div className="balance-row">
        <div
          className={`balance ${prefs.boxedBalance ? 'balance-boxed' : ''} ${prefs.showFullDigits ? 'balance-full-digits' : ''}`}
          data-motion-target="cash"
          title="Click to toggle between Full Digits and Compact Notation"
        >
          <FlipCounter
            value={formattedBalance}
            animated={prefs.animatedFlip && !prefs.potatoMode}
            boxed={prefs.boxedBalance}
            ariaLabel={formattedBalance}
          />
        </div>
        <button
          type="button"
          className={`digit-mode-toggle ${prefs.showFullDigits ? 'active' : ''}`}
          onClick={toggleFullDigits}
          title={prefs.showFullDigits ? 'Showing every single digit. Click to switch to compact format ($B).' : 'Showing compact format. Click to show every digit.'}
        >
          {prefs.showFullDigits ? '123 · All Digits' : '$B · Compact'}
        </button>
        {prefs.potatoMode ? (
          <span className="digit-mode-toggle" title="Potato PC mode active: flip animations and blur disabled to preserve FPS" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
            🥔 Potato Mode
          </span>
        ) : (
          <button
            type="button"
            className={`digit-mode-toggle ${prefs.animatedFlip ? 'active' : ''}`}
            onClick={toggleAnimatedFlip}
            title={prefs.animatedFlip ? 'Animated digit flip is ON. Click to turn off.' : 'Animated digit flip is OFF. Click to turn on.'}
          >
            {prefs.animatedFlip ? '🎴 Flip: ON' : '🎴 Flip: OFF'}
          </button>
        )}
      </div>
      <div className="income-rate-wrap">
        <div
          className={`income-pill-badge ${income >= 0 ? 'positive' : 'negative'} ${prefs.incomePulse ? 'income-pulse-active' : ''} ${isPulsing ? (income >= 0 ? 'income-pulse-tick-positive' : 'income-pulse-tick-negative') : ''}`}
          title={income >= 0 ? `Active Net Cashflow: +${money(income)} per second` : `Active Cash Drain: ${money(income)} per second`}
        >
          <span className="income-beacon-dot">
            <span className="income-beacon-ring" />
          </span>
          <FlipCounter
            value={formattedIncome}
            animated={prefs.animatedFlip && !prefs.potatoMode}
            ariaLabel={formattedIncome}
          />
          {prefs.incomePulse && income > 0 && !prefs.potatoMode ? (
            <span className="income-sparkle-indicator" aria-hidden="true">⚡</span>
          ) : null}
        </div>
        <button
          type="button"
          className={`digit-mode-toggle ${prefs.incomePulse ? 'active' : ''}`}
          onClick={() => saveHudPreferences({ ...prefs, incomePulse: !prefs.incomePulse })}
          title={prefs.incomePulse ? "Visual Income Pulse is ON. Click to disable." : "Visual Income Pulse is OFF. Click to enable."}
          style={{ padding: '2px 7px', fontSize: '10px' }}
        >
          {prefs.incomePulse ? '🟢 Pulse: ON' : '⚪ Pulse: OFF'}
        </button>
      </div>
    </div>

    <section className="counter-hud" aria-label="Run counters">
      {prefs.showLok ? <div className="counter-card lok-counter"><span className="counter-label">LOK TOKENS</span><div className="counter-value"><b data-motion-target="lok">◈ {state.lokTokens.toLocaleString()}</b><small>+1 / 10s active</small></div><div className="counter-progress"><span style={{ width: `${lokProgress * 100}%` }} /></div><small>{(lokMsRemaining / 1000).toFixed(1)}s next</small></div> : null}
      {prefs.showRunClock ? <div className="counter-card run-counter"><span className="counter-label">PLAYTIME</span><div className="counter-value"><b>{formatRunClock(liveActivePlayMs)}</b><small>active</small></div><div className="counter-unit-row"><span>{parts.days}d</span><span>{parts.hours}h</span><span>{parts.minutes}m</span><span>{parts.seconds}s</span>{prefs.showMilliseconds ? <span>{String(parts.milliseconds).padStart(3, '0')}ms</span> : null}</div></div> : null}
      {prefs.showGameDay ? <div className="counter-card day-counter"><span className="counter-label">WORLD</span><div className="counter-value"><b>Day {gameDay(state.time)}</b><small>{gameClockLabel(state.time)}</small></div><div className="counter-unit-row"><span>{state.time.settings.enabled ? `${state.time.settings.timeScale}×` : 'paused'}</span><span>{Math.round(state.time.fatigue)}% fatigue</span><span>{Math.round(state.time.jetLag)}% lag</span></div></div> : null}
      {prefs.showDebt && debt.enabled ? <div className={`counter-card debt-counter ${debtInfo.defaultedDebt > 0 ? 'debt-counter-danger' : ''}`}><span className="counter-label">DEBT</span><div className="counter-value"><b data-motion-target="debt">{money(debtInfo.totalDebt)}</b><small>{debtInfo.activeObligations} creditor{debtInfo.activeObligations === 1 ? '' : 's'}</small></div><div className="counter-unit-row"><span>{debt.creditScore} score</span><span>{money(debtInfo.monthlyEquivalentInterest)}/mo</span>{debtInfo.activeCourtCases ? <span>⚖ {debtInfo.activeCourtCases}</span> : null}</div></div> : null}
    </section>
    {countdown ? <div className="bankruptcy-countdown"><b>{countdown}</b><span>seconds to bankruptcy</span></div> : null}
    {state.riskMode && display < 0 ? <small>DEBT · interest is draining cash</small> : null}
  </div>;
}

