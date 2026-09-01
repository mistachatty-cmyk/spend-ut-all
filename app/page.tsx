'use client';

import { useEffect, useMemo, useState } from 'react';
import { houseTiers, items, scenarios } from '@/data/content';
import { advance, buyItem, canBuyItem, itemBulkPrice, netWorth, newGame, passiveCashPerSecond, upgradeHouse } from '@/game/engine';
import { money } from '@/game/format';
import { FinancialMode, GameState, ScenarioId } from '@/game/types';

const SAVE_KEY = 'spend-it-all-v1';

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('billionaire');
  const [mode, setMode] = useState<FinancialMode>('simple');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try { setState(JSON.parse(raw)); } catch { localStorage.removeItem(SAVE_KEY); }
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state?.started) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - last, 5_000);
      last = now;
      setState((current) => current ? advance(current, delta) : current);
    }, 250);
    return () => window.clearInterval(timer);
  }, [state?.started]);

  const visibleItems = useMemo(() => items.filter((item) => category === 'all' || item.category === category), [category]);

  if (!state?.started) {
    return <main className="menu-shell">
      <section className="hero-card">
        <div className="eyebrow">LOK ECOSYSTEM READY · ECONOMIC SANDBOX</div>
        <h1>Spend It All</h1>
        <p className="lead">Spend impossible fortunes. Build assets and businesses. Upgrade your home. Grow toward towns, cities, and an economic empire.</p>
        <div className="choice-grid">
          {scenarios.map((scenario) => <button key={scenario.id} className={`choice ${scenarioId === scenario.id ? 'selected' : ''}`} onClick={() => setScenarioId(scenario.id)}><strong>{scenario.name}</strong><span>{scenario.description}</span><b>{money(scenario.startingCash)}</b></button>)}
        </div>
        <div className="mode-row">
          <button className={mode === 'simple' ? 'pill selected' : 'pill'} onClick={() => setMode('simple')}>Simple Financials</button>
          <button className={mode === 'advanced' ? 'pill selected' : 'pill'} onClick={() => setMode('advanced')}>Advanced Financials</button>
        </div>
        <button className="primary" onClick={() => setState(newGame(scenarioId, mode))}>Start Scenario</button>
        <p className="micro">Playing earns 1 LOK Token every 10 seconds. The current adapter stores LOK locally until the shared ecosystem wallet is connected.</p>
      </section>
    </main>;
  }

  const income = passiveCashPerSecond(state);
  const worth = netWorth(state);
  const currentHouse = houseTiers.find((tier) => tier.level === state.houseLevel)!;
  const nextHouse = houseTiers.find((tier) => tier.level === state.houseLevel + 1);

  return <main className={state.theme === 'midnight' ? 'app midnight' : 'app'}>
    <header className="topbar">
      <div><div className="eyebrow">SPEND IT ALL</div><div className="balance">{money(state.cash)}</div><div className={income >= 0 ? 'positive' : 'negative'}>{income >= 0 ? '+' : ''}{money(income)}/sec</div></div>
      <div className="top-stats"><div><span>Net worth</span><b>{money(worth)}</b></div><div><span>Spent</span><b>{money(state.totalSpent)}</b></div><div><span>LOK</span><b>◈ {state.lokTokens.toLocaleString()}</b><small>+1 in {Math.max(1, Math.ceil((10_000 - state.lokProgressMs) / 1000))}s</small></div></div>
    </header>

    <nav className="tabs">
      {['all','everyday','luxury','property','business','infrastructure'].map((entry) => <button key={entry} className={category === entry ? 'active' : ''} onClick={() => setCategory(entry)}>{entry}</button>)}
    </nav>

    <section className="dashboard-grid">
      <section className="catalog panel">
        <div className="section-heading"><div><span className="eyebrow">MARKETPLACE</span><h2>Buy the world</h2></div><span>{state.mode === 'advanced' ? 'Upkeep enabled' : 'Simple economy'}</span></div>
        <div className="item-list">
          {visibleItems.map((item) => {
            const owned = state.owned[item.id] ?? 0;
            const unlocked = state.totalSpent >= (item.unlockSpent ?? 0);
            const price = itemBulkPrice(item, owned, 1);
            return <article className={`item-card ${!unlocked ? 'locked' : ''}`} key={item.id}>
              <div className="item-icon">{item.emoji}</div>
              <div className="item-copy"><div className="item-title"><h3>{item.name}</h3><span>Owned {owned}</span></div><p>{item.description}</p><div className="item-meta"><b>{money(price)}</b>{item.incomePerSecond ? <span>+{money(item.incomePerSecond)}/sec ea.</span> : null}{state.mode === 'advanced' && item.upkeepPerSecond ? <span className="negative">-{money(item.upkeepPerSecond)}/sec upkeep</span> : null}</div></div>
              <div className="buy-stack">{unlocked ? <><button disabled={!canBuyItem(state,item,1)} onClick={() => setState((s) => s ? buyItem(s,item,1) : s)}>Buy</button><button disabled={!canBuyItem(state,item,10)} onClick={() => setState((s) => s ? buyItem(s,item,10) : s)}>×10</button></> : <span>Unlock after {money(item.unlockSpent ?? 0)} spent</span>}</div>
            </article>;
          })}
        </div>
      </section>

      <aside className="side-stack">
        <section className="panel house-panel"><span className="eyebrow">YOUR HOME</span><div className="house-visual">{state.houseLevel < 2 ? '🏠' : state.houseLevel < 4 ? '🏡' : '🏰'}</div><h2>{currentHouse.name}</h2><p>{currentHouse.description}</p><div className="house-stats"><span>Level <b>{currentHouse.level}</b></span><span>Rooms <b>{currentHouse.rooms}</b></span></div>{nextHouse ? <><div className="next-up"><span>Next: {nextHouse.name}</span><b>{money(nextHouse.cost)}</b><small>Requires {money(nextHouse.requiredNetWorth)} net worth</small></div><button className="primary" onClick={() => setState((s) => s ? upgradeHouse(s) : s)}>Upgrade Home</button></> : <div className="complete">Town-building threshold reached.</div>}</section>

        <section className="panel"><span className="eyebrow">FINANCIAL MODE</span><h2>{state.mode === 'simple' ? 'Simple' : 'Advanced'}</h2><p>{state.mode === 'simple' ? 'Income is emphasized while operating costs stay hidden.' : 'Operating upkeep is active, making asset selection and cash flow more important.'}</p><button className="secondary" onClick={() => setState((s) => s ? {...s, mode: s.mode === 'simple' ? 'advanced' : 'simple'} : s)}>Switch to {state.mode === 'simple' ? 'Advanced' : 'Simple'}</button></section>

        <section className="panel"><span className="eyebrow">CUSTOMIZE</span><h2>Theme</h2><p>Theme hooks are live now; the LOK Store and shared entitlements come next.</p><button className="secondary" onClick={() => setState((s) => s ? {...s, theme: s.theme === 'light' ? 'midnight' : 'light'} : s)}>Toggle {state.theme === 'light' ? 'Midnight' : 'Light'}</button></section>

        <button className="danger" onClick={() => { localStorage.removeItem(SAVE_KEY); setState(null); }}>Reset Run</button>
      </aside>
    </section>
  </main>;
}
