'use client';

import { useEffect, useMemo, useState } from 'react';
import { achievements, houseTiers, items, scenarios, townTiers } from '@/data/content';
import {
  advance,
  buyItem,
  canBuyItem,
  grossIncomePerSecond,
  holdingsValue,
  itemBulkPrice,
  maxAffordableQuantity,
  netWorth,
  newGame,
  normalizeState,
  passiveCashPerSecond,
  scenarioProgress,
  sellItem,
  totalOwned,
  unlockedAchievements,
  upkeepPerSecond,
  upgradeHouse,
  upgradeTown,
} from '@/game/engine';
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
      try { setState(normalizeState(JSON.parse(raw))); } catch { localStorage.removeItem(SAVE_KEY); }
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
        <div className="eyebrow">STANDALONE GAME · LOK READY</div>
        <h1>Spend It All</h1>
        <p className="lead">Spend impossible fortunes, own increasingly absurd assets, build cash-flowing businesses, upgrade your estate, and turn it into a city-scale economic empire.</p>
        <div className="choice-grid">
          {scenarios.map((scenario) => <button key={scenario.id} className={`choice ${scenarioId === scenario.id ? 'selected' : ''}`} onClick={() => setScenarioId(scenario.id)}>
            <strong>{scenario.name}</strong><span>{scenario.description}</span><b>{money(scenario.startingCash)}</b><small>{scenario.goalLabel}</small>
          </button>)}
        </div>
        <div className="mode-row">
          <button className={mode === 'simple' ? 'pill selected' : 'pill'} onClick={() => setMode('simple')}>Simple Financials</button>
          <button className={mode === 'advanced' ? 'pill selected' : 'pill'} onClick={() => setMode('advanced')}>Advanced Financials</button>
        </div>
        <button className="primary" onClick={() => setState(newGame(scenarioId, mode))}>Start Scenario</button>
        <p className="micro">Playing earns 1 LOK Token every 10 seconds. LOK is isolated behind an integration adapter so this game can run independently while the shared wallet is connected later.</p>
      </section>
    </main>;
  }

  const income = passiveCashPerSecond(state);
  const gross = grossIncomePerSecond(state);
  const upkeep = upkeepPerSecond(state);
  const worth = netWorth(state);
  const holdings = holdingsValue(state);
  const scenario = scenarios.find((entry) => entry.id === state.scenarioId) ?? scenarios[0];
  const progress = scenarioProgress(state);
  const won = progress >= 1;
  const currentHouse = houseTiers.find((tier) => tier.level === state.houseLevel)!;
  const nextHouse = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  const currentTown = townTiers.find((tier) => tier.level === (state.townLevel ?? 0)) ?? townTiers[0];
  const nextTown = townTiers.find((tier) => tier.level === (state.townLevel ?? 0) + 1);
  const earned = unlockedAchievements(state);
  const ownedCount = totalOwned(state);

  return <main className={state.theme === 'midnight' ? 'app midnight' : 'app'}>
    <header className="topbar">
      <div><div className="eyebrow">SPEND IT ALL</div><div className="balance">{money(state.cash)}</div><div className={income >= 0 ? 'positive' : 'negative'}>{income >= 0 ? '+' : ''}{money(income)}/sec</div></div>
      <div className="top-stats"><div><span>Net worth</span><b>{money(worth)}</b></div><div><span>Spent</span><b>{money(state.totalSpent)}</b></div><div><span>LOK</span><b>◈ {state.lokTokens.toLocaleString()}</b><small>+1 in {Math.max(1, Math.ceil((10_000 - state.lokProgressMs) / 1000))}s</small></div></div>
    </header>

    <section className={`goal-strip ${won ? 'won' : ''}`}>
      <div><span className="eyebrow">SCENARIO GOAL</span><b>{won ? 'Goal complete ✓' : scenario.goalLabel}</b></div>
      <div className="goal-progress"><span style={{ width: `${progress * 100}%` }} /></div>
      <small>{Math.round(progress * 100)}%</small>
    </section>

    <nav className="tabs">
      {['all','everyday','luxury','property','business','infrastructure'].map((entry) => <button key={entry} className={category === entry ? 'active' : ''} onClick={() => setCategory(entry)}>{entry}</button>)}
    </nav>

    <section className="dashboard-grid">
      <section className="catalog panel">
        <div className="section-heading"><div><span className="eyebrow">MARKETPLACE</span><h2>Buy the world</h2></div><span>{state.mode === 'advanced' ? 'Revenue + upkeep active' : 'Simple economy'}</span></div>
        <div className="item-list">
          {visibleItems.map((item) => {
            const owned = state.owned[item.id] ?? 0;
            const unlocked = state.totalSpent >= (item.unlockSpent ?? 0);
            const price = itemBulkPrice(item, owned, 1);
            const maxQty = maxAffordableQuantity(state, item);
            return <article className={`item-card ${!unlocked ? 'locked' : ''}`} key={item.id}>
              <div className="item-icon">{item.emoji}</div>
              <div className="item-copy"><div className="item-title"><h3>{item.name}</h3><span>Owned {owned.toLocaleString()}</span></div><p>{item.description}</p><div className="item-meta"><b>{money(price)}</b>{item.incomePerSecond ? <span>+{money(item.incomePerSecond)}/sec ea.</span> : null}{state.mode === 'advanced' && item.upkeepPerSecond ? <span className="negative">-{money(item.upkeepPerSecond)}/sec upkeep</span> : null}</div></div>
              <div className="buy-stack">{unlocked ? <>
                <button disabled={!canBuyItem(state,item,1)} onClick={() => setState((s) => s ? buyItem(s,item,1) : s)}>Buy</button>
                <button disabled={!canBuyItem(state,item,10)} onClick={() => setState((s) => s ? buyItem(s,item,10) : s)}>×10</button>
                <button disabled={!canBuyItem(state,item,100)} onClick={() => setState((s) => s ? buyItem(s,item,100) : s)}>×100</button>
                <button disabled={maxQty < 1} onClick={() => setState((s) => s ? buyItem(s,item,maxAffordableQuantity(s,item)) : s)}>MAX</button>
                <button className="sell" disabled={owned < 1} onClick={() => setState((s) => s ? sellItem(s,item,1) : s)}>Sell 1</button>
              </> : <span>Unlock after {money(item.unlockSpent ?? 0)} spent</span>}</div>
            </article>;
          })}
        </div>
      </section>

      <aside className="side-stack">
        <section className="panel finance-panel"><span className="eyebrow">FINANCIAL DASHBOARD</span><h2>{state.mode === 'simple' ? 'Simple view' : 'Advanced view'}</h2><div className="finance-grid">
          <span>Cash <b>{money(state.cash)}</b></span><span>Assets <b>{money(holdings)}</b></span><span>Gross income <b>{money(gross)}/s</b></span><span>Operating cost <b>{state.mode === 'advanced' ? `${money(upkeep)}/s` : 'Hidden'}</b></span><span>Net income <b className={income >= 0 ? 'positive' : 'negative'}>{money(income)}/s</b></span><span>Items owned <b>{ownedCount.toLocaleString()}</b></span>
        </div><button className="secondary" onClick={() => setState((s) => s ? {...s, mode: s.mode === 'simple' ? 'advanced' : 'simple'} : s)}>Switch to {state.mode === 'simple' ? 'Advanced' : 'Simple'}</button></section>

        <section className="panel house-panel"><span className="eyebrow">YOUR HOME</span><div className="house-visual">{state.houseLevel < 2 ? '🏠' : state.houseLevel < 4 ? '🏡' : '🏰'}</div><h2>{currentHouse.name}</h2><p>{currentHouse.description}</p><div className="house-stats"><span>Level <b>{currentHouse.level}</b></span><span>Rooms <b>{currentHouse.rooms}</b></span></div>{nextHouse ? <><div className="next-up"><span>Next: {nextHouse.name}</span><b>{money(nextHouse.cost)}</b><small>Requires {money(nextHouse.requiredNetWorth)} net worth</small></div><button className="primary" onClick={() => setState((s) => s ? upgradeHouse(s) : s)}>Upgrade Home</button></> : <div className="complete">Estate complete. Town building unlocked.</div>}</section>

        {state.houseLevel >= 5 ? <section className="panel town-panel"><span className="eyebrow">SETTLEMENT</span><div className="town-visual">{currentTown.level < 2 ? '🏘️' : currentTown.level < 4 ? '🏙️' : '🌇'}</div><h2>{currentTown.name}</h2><p>{currentTown.description}</p><div className="finance-grid"><span>Population <b>{currentTown.population.toLocaleString()}</b></span><span>Jobs <b>{currentTown.jobs.toLocaleString()}</b></span></div>{nextTown ? <><div className="next-up"><span>Next: {nextTown.name}</span><b>{money(nextTown.cost)}</b><small>Requires {money(nextTown.requiredNetWorth)} net worth</small></div><button className="primary" onClick={() => setState((s) => s ? upgradeTown(s) : s)}>Expand Settlement</button></> : <div className="complete">Metropolis reached. Regional expansion comes next.</div>}</section> : null}

        <section className="panel"><span className="eyebrow">ACHIEVEMENTS</span><h2>{earned.length}/{achievements.length} unlocked</h2><div className="achievement-list">{achievements.map((achievement) => {
          const unlocked = earned.some((entry) => entry.id === achievement.id);
          return <div className={unlocked ? 'achievement unlocked' : 'achievement'} key={achievement.id}><span>{unlocked ? achievement.emoji : '🔒'}</span><div><b>{achievement.name}</b><small>{achievement.description}</small></div></div>;
        })}</div></section>

        <section className="panel"><span className="eyebrow">CUSTOMIZE</span><h2>Theme</h2><p>Theme hooks are live now; the LOK Store and shared entitlements can plug into this standalone game later.</p><button className="secondary" onClick={() => setState((s) => s ? {...s, theme: s.theme === 'light' ? 'midnight' : 'light'} : s)}>Toggle {state.theme === 'light' ? 'Midnight' : 'Light'}</button></section>

        <button className="danger" onClick={() => { localStorage.removeItem(SAVE_KEY); setState(null); }}>Reset Run</button>
      </aside>
    </section>
  </main>;
}
