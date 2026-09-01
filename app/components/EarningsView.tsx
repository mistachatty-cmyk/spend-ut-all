'use client';

import { useState } from 'react';
import { TimeView } from './TimeView';
import { activeEarnings, incomeStreams } from '@/data/earnings';
import { investments } from '@/data/investments';
import { activeEarningUnlocked, buyIncomeStream, performActiveEarning } from '@/game/earning-actions';
import { executeInvestment, investmentUnlocked } from '@/game/investment-actions';
import { money } from '@/game/format';
import { netWorth } from '@/game/engine';
import { canUnlockIncomeStream, incomeStreamUnitCost, incomeStreamsPerSecond } from '@/game/systems/earnings';
import { emitMicroMotion } from '@/game/systems/micro-animations';
import type { GameState } from '@/game/types';

export function EarningsView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const [lastResult, setLastResult] = useState<string>('');
  const passive = incomeStreamsPerSecond(state);
  const worth = netWorth(state);
  return <section className="earnings-shell">
    <section className="panel earnings-hero"><div><span className="eyebrow">WAYS TO EARN</span><h2>Make $25 or make $150B every second</h2><p>Work manually when you are small, buy scalable income streams as you grow, and optionally take investment risk. Every source feeds the live money counter.</p></div><div><b>{money(passive)}/s</b><span>earnings-stream income</span></div></section>

    <section className="panel"><span className="eyebrow">ACTIVE EARNINGS</span><h2>Make money right now</h2><div className="earning-grid">{activeEarnings.map((earning) => { const unlocked = activeEarningUnlocked(state, earning.id); return <button key={earning.id} disabled={!unlocked || state.runStatus !== 'active'} onClick={(event) => { const sourceElement = event.currentTarget; setState((current) => { if (!current) return current; const next = performActiveEarning(current, earning); const delta = next.cash - current.cash; if (delta > 0) emitMicroMotion({ target:'cash', amount:delta, displayText:`+${money(delta)}`, symbol:earning.emoji, tone:'positive', kind:'currency', sourceElement }); return next; }); }}><span>{earning.emoji}</span><div><b>{earning.name}</b><small>{earning.description}</small></div><em>+{money(earning.payout)}</em></button>; })}</div></section>

    <TimeView state={state} setState={setState} />

    <section className="panel"><span className="eyebrow">PASSIVE INCOME</span><h2>Build the money machine</h2><div className="stream-grid">{incomeStreams.map((stream) => { const owned = state.incomeStreams?.[stream.id] ?? 0; const cost = incomeStreamUnitCost(state, stream); const unlocked = canUnlockIncomeStream(state, stream); return <article key={stream.id}><span>{stream.emoji}</span><div><b>{stream.name}</b><small>{stream.description}</small><em>Owned {owned} · +{money(stream.incomePerSecond * owned)}/s</em></div><button disabled={!unlocked || state.cash < cost || state.runStatus !== 'active'} onClick={(event) => { const sourceElement = event.currentTarget; setState((current) => { if (!current) return current; const next = buyIncomeStream(current, stream); const spent = Math.max(0, current.cash - next.cash); if (spent > 0) emitMicroMotion({ target:'cash', amount:-spent, displayText:`-${money(spent)}`, symbol:stream.emoji, tone:'negative', kind:'purchase', sourceElement }); return next; }); }}>Buy · {money(cost)}</button></article>; })}</div></section>

    <section className="panel investment-panel"><span className="eyebrow">OPTIONAL INVESTING</span><h2>Risk can make the counter flip direction</h2><p className="muted">These are fictional game investments, not real investment recommendations. In Risk Mode, losses can push you into debt and bankruptcy.</p>{lastResult ? <div className="investment-result">{lastResult}</div> : null}<div className="investment-grid">{investments.map((investment) => { const unlocked = investmentUnlocked(state, investment); return <article key={investment.id}><span>{investment.emoji}</span><div><b>{investment.name}</b><small>{investment.description}</small><em>Outcome range {Math.round(investment.minReturn * 100)}% to +{Math.round(investment.maxReturn * 100)}%</em></div><div>{[0.1,0.25,0.5].map((fraction) => <button key={fraction} disabled={!unlocked || state.runStatus !== 'active'} onClick={(event) => { const sourceElement = event.currentTarget; setState((current) => { if (!current) return current; const result = executeInvestment(current, investment, fraction, worth); if (!result.stake) { setLastResult(`Need at least ${money(investment.minimumStake)} available.`); return current; } const cashDelta = result.state.cash - current.cash; if (cashDelta !== 0) emitMicroMotion({ target:'cash', amount:cashDelta, displayText:`${cashDelta >= 0 ? '+' : '-'}${money(Math.abs(cashDelta))}`, symbol:investment.emoji, tone:cashDelta >= 0 ? 'positive' : 'negative', kind:'currency', sourceElement }); setLastResult(`${investment.name}: ${money(result.stake)} at risk → ${result.delta >= 0 ? '+' : ''}${money(result.delta)} (${Math.round(result.returnRate * 100)}%).`); return result.state; }); }}>{Math.round(fraction * 100)}%</button>)}</div></article>; })}</div></section>
  </section>;
}
