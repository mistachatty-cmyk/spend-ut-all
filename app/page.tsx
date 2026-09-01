'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AchievementsView } from '@/app/components/AchievementsView';
import { BusinessView } from '@/app/components/BusinessView';
import { CollectionView } from '@/app/components/CollectionView';
import { CustomScenarioBuilder } from '@/app/components/CustomScenarioBuilder';
import { CustomizationView } from '@/app/components/CustomizationView';
import { EarningsView } from '@/app/components/EarningsView';
import { GameOverView } from '@/app/components/GameOverView';
import { LeaderboardView } from '@/app/components/LeaderboardView';
import { MoneyCounter } from '@/app/components/MoneyCounter';
import { PetCompanion } from '@/app/components/PetCompanion';
import { SettingsView } from '@/app/components/SettingsView';
import { achievements } from '@/data/achievements';
import { citySpecializations, empireUpgrades, houseTiers, items, regionTiers, scenarios, townTiers } from '@/data/content';
import { activeMarketEvent, advance, applyOfflineProgress, buyItem, buyUpgrade, canBuyItem, canBuyUpgrade, canSellItem, chooseCitySpecialization, grossIncomePerSecond, holdingsValue, itemBulkPrice, maxAffordableQuantity, netWorth, newCustomGame, newGame, passiveCashPerSecond, scenarioGoalLabel, scenarioIsFreeMode, scenarioProgress, sellItem, totalOwned, upkeepPerSecond, upgradeCost, upgradeHouse, upgradeRegion, upgradeTown, upgradesValue } from '@/game/engine';
import { createMetaState, equipTitle, normalizeMetaState, syncMetaProgression, toggleShowcaseBadge } from '@/game/systems/meta-progression';
import { addRunResult, createRunResult, LEADERBOARD_KEY, normalizeRunHistory } from '@/game/systems/leaderboard';
import { createCustomizationInventory, equipCustomization, loadCustomizationInventory, moneyCounterClass, saveCustomizationInventory, syncCustomizationUnlocks, themeClass } from '@/game/systems/customizations';
import type { RunResult } from '@/game/run-types';
import { money } from '@/game/format';
import type { MetaState } from '@/game/meta-types';
import type { CustomizationInventory } from '@/game/customization-types';
import { FinancialMode, GameState, ScenarioId } from '@/game/types';

const SAVE_KEY = 'spend-it-all-v1';
const META_KEY = 'spend-it-all-meta-v1';
type View = 'market' | 'earnings' | 'businesses' | 'empire' | 'achievements' | 'collection' | 'leaderboard' | 'customize' | 'settings';

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);
  const [meta, setMeta] = useState<MetaState>(createMetaState());
  const [metaLoaded, setMetaLoaded] = useState(false);
  const [customization, setCustomization] = useState<CustomizationInventory>(createCustomizationInventory());
  const [customizationLoaded, setCustomizationLoaded] = useState(false);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('nothing');
  const [mode, setMode] = useState<FinancialMode>('simple');
  const [riskMode, setRiskMode] = useState(false);
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<View>('market');
  const [offlineAward, setOfflineAward] = useState(0);
  const [customBuilderOpen, setCustomBuilderOpen] = useState(false);
  const recordedWin = useRef<number | null>(null);

  useEffect(() => {
    const rawMeta = localStorage.getItem(META_KEY);
    if (rawMeta) { try { setMeta(normalizeMetaState(JSON.parse(rawMeta))); } catch { localStorage.removeItem(META_KEY); } }
    setMetaLoaded(true);
    setCustomization(loadCustomizationInventory());
    setCustomizationLoaded(true);
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try { const restored = applyOfflineProgress(JSON.parse(raw)); setOfflineAward(restored.lastOfflineIncome); setState(restored); }
    catch { localStorage.removeItem(SAVE_KEY); }
  }, []);

  useEffect(() => { if (state) localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { if (metaLoaded) localStorage.setItem(META_KEY, JSON.stringify(meta)); }, [meta, metaLoaded]);
  useEffect(() => { if (customizationLoaded) saveCustomizationInventory(customization); }, [customization, customizationLoaded]);
  useEffect(() => { if (!state || !metaLoaded) return; setMeta((current) => syncMetaProgression(current, state, { netWorth: netWorth(state), incomePerSecond: passiveCashPerSecond(state), totalOwned: totalOwned(state), scenarioComplete: scenarioProgress(state) >= 1 })); }, [state, metaLoaded]);
  useEffect(() => {
    if (!state || !customizationLoaded) return;
    setCustomization((current) => {
      const next = syncCustomizationUnlocks(current, state);
      if (next.ownedIds.length === current.ownedIds.length) return current;
      return saveCustomizationInventory(next);
    });
  }, [state?.regionLevel, state?.runAchievements, customizationLoaded]);
  useEffect(() => {
    if (!state?.started || state.runStatus !== 'active' || recordedWin.current === state.createdAt || scenarioIsFreeMode(state) || scenarioProgress(state) < 1) return;
    let history: RunResult[] = [];
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) { try { history = normalizeRunHistory(JSON.parse(raw)); } catch { history = []; } }
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(addRunResult(history, createRunResult(state, true))));
    recordedWin.current = state.createdAt;
  }, [state]);
  useEffect(() => { if (!state?.started || state.runStatus !== 'active') return; let last = performance.now(); const timer = window.setInterval(() => { const now = performance.now(); const delta = Math.min(now - last, 5_000); last = now; setState((current) => current ? advance(current, delta) : current); }, 250); return () => window.clearInterval(timer); }, [state?.started, state?.runStatus]);

  const visibleItems = useMemo(() => items.filter((item) => category === 'all' || item.category === category), [category]);

  if (!state?.started) return <main className="menu-shell">{customBuilderOpen ? <CustomScenarioBuilder onClose={() => setCustomBuilderOpen(false)} onStart={(custom) => { setOfflineAward(0); setView(custom.startingCash === 0 ? 'earnings' : 'market'); recordedWin.current = null; setCustomBuilderOpen(false); setState(newCustomGame(custom)); }} /> : <section className="hero-card"><div className="eyebrow">ECONOMIC EMPIRE SANDBOX · LOK READY</div><h1>Spend It All</h1><p className="lead">Start from absolutely nothing, multiply a small fortune 10× to 1,000×, play with no finish line, or begin absurdly rich. Speedrunner, Wolf Boss, Comeback, Risk, Empire and hidden achievements track how you built it.</p><div className="choice-grid">{scenarios.map((scenario) => <button key={scenario.id} className={`choice ${scenarioId === scenario.id ? 'selected' : ''}`} onClick={() => setScenarioId(scenario.id)}><strong>{scenario.name}</strong><span>{scenario.description}</span><b>{money(scenario.startingCash)}</b><small>{scenario.goalLabel}</small></button>)}</div><div className="custom-launch"><div><b>🧬 Custom Challenge Lab</b><span>Choose the starting cash, finish line, Risk Mode, economy modifiers, time rules and restrictions—or import a friend’s SIA challenge code.</span></div><button className="secondary" onClick={() => setCustomBuilderOpen(true)}>Build Custom Scenario</button></div><div className="mode-row"><button className={mode === 'simple' ? 'pill selected' : 'pill'} onClick={() => setMode('simple')}>Simple Financials</button><button className={mode === 'advanced' ? 'pill selected' : 'pill'} onClick={() => setMode('advanced')}>Advanced Financials</button></div><label className="risk-toggle"><input type="checkbox" checked={riskMode} onChange={(event) => setRiskMode(event.target.checked)} /><div><b>Optional Risk Mode</b><small>Allows bounded overspending, debt interest, risky investments, a bankruptcy countdown and true comeback achievements.</small></div></label><button className="primary" onClick={() => { setOfflineAward(0); setView(scenarioId === 'nothing' ? 'earnings' : 'market'); recordedWin.current = null; setState(newGame(scenarioId, mode, riskMode)); }}>Start Scenario</button><p className="micro">Start From Nothing begins at exactly $0, so your first move is earning. LOK, cosmetics, pets and Legacy Collection persist across every mode.</p></section>}</main>;

  if (state.runStatus === 'bankrupt') return <GameOverView state={state} onRestart={() => { localStorage.removeItem(SAVE_KEY); setState(null); setOfflineAward(0); }} />;

  const income = passiveCashPerSecond(state), gross = grossIncomePerSecond(state), upkeep = upkeepPerSecond(state), worth = netWorth(state), holdings = holdingsValue(state), upgradeValue = upgradesValue(state);
  const progress = scenarioProgress(state), freeMode = scenarioIsFreeMode(state), won = !freeMode && progress >= 1, goalLabel = scenarioGoalLabel(state);
  const currentHouse = houseTiers.find((tier) => tier.level === state.houseLevel)!, nextHouse = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  const currentTown = townTiers.find((tier) => tier.level === state.townLevel) ?? townTiers[0], nextTown = townTiers.find((tier) => tier.level === state.townLevel + 1);
  const currentRegion = regionTiers.find((tier) => tier.level === state.regionLevel) ?? regionTiers[0], nextRegion = regionTiers.find((tier) => tier.level === state.regionLevel + 1);
  const ownedCount = totalOwned(state), event = activeMarketEvent(state), specialization = citySpecializations.find((entry) => entry.id === state.citySpecialization);
  const achievementCount = Object.keys(state.runAchievements ?? {}).length;
  const darkTheme = ['theme-midnight','theme-executive-glass','theme-market-terminal','theme-lunar-office'].includes(customization.equipped.themeId ?? '');
  const appClass = `app ${darkTheme ? 'midnight ' : ''}${themeClass(customization)} ${moneyCounterClass(customization)}`;

  return <main className={appClass}>
    <header className="topbar"><div><div className="eyebrow">SPEND IT ALL {state.riskMode ? '· RISK MODE' : ''} · {state.rules.presetId.toUpperCase()} {state.customScenario ? `· ${state.customScenario.name.toUpperCase()}` : ''} {meta.equippedTitle ? `· ${meta.equippedTitle.toUpperCase()}` : ''}</div><MoneyCounter state={state} income={income} /></div><div className="top-stats"><div><span>Net worth</span><b>{money(worth)}</b></div><div><span>Spent</span><b>{money(state.totalSpent)}</b></div><div><span>Achievements</span><b>{achievementCount}/{achievements.length}</b></div><div><span>LOK</span><b>◈ {state.lokTokens.toLocaleString()}</b><small>+1 in {Math.max(1, Math.ceil((10_000 - state.lokProgressMs) / 1000))}s</small></div></div></header>
    <PetCompanion state={state} income={income} inventory={customization} />
    {offlineAward > 0 ? <button className="offline-banner" onClick={() => setOfflineAward(0)}>Welcome back — your empire earned <b>{money(offlineAward)}</b> while away. <span>Dismiss</span></button> : null}
    {event ? <section className="event-strip"><span className="event-emoji">{event.emoji}</span><div><span className="eyebrow">LIVE MARKET EVENT</span><b>{event.name}</b><small>{event.description}</small></div><div className="event-numbers"><span>Revenue ×{event.incomeMultiplier.toFixed(2)}</span><span>Costs ×{event.upkeepMultiplier.toFixed(2)}</span><small>{Math.max(0, Math.ceil((state.eventEndsAt - Date.now()) / 1000))}s left</small></div></section> : null}
    <section className={`goal-strip ${won ? 'won' : ''}`}><div><span className="eyebrow">SCENARIO GOAL</span><b>{freeMode ? 'Free Mode ∞ — no finish line' : won ? 'Goal complete ✓ — saved to leaderboard' : goalLabel}</b></div><div className="goal-progress"><span style={{ width: `${freeMode ? 100 : progress * 100}%` }} /></div><small>{freeMode ? '∞' : `${Math.round(progress * 100)}%`}</small></section>
    <nav className="view-tabs"><button className={view === 'market' ? 'active' : ''} onClick={() => setView('market')}>Marketplace</button><button className={view === 'earnings' ? 'active' : ''} onClick={() => setView('earnings')}>Earn</button><button className={view === 'businesses' ? 'active' : ''} onClick={() => setView('businesses')}>Businesses</button><button className={view === 'empire' ? 'active' : ''} onClick={() => setView('empire')}>Empire</button><button className={view === 'achievements' ? 'active' : ''} onClick={() => setView('achievements')}>Achievements · {achievementCount}</button><button className={view === 'collection' ? 'active' : ''} onClick={() => setView('collection')}>Collection · {meta.collectibles.length}</button><button className={view === 'leaderboard' ? 'active' : ''} onClick={() => setView('leaderboard')}>Leaderboard</button><button className={view === 'customize' ? 'active' : ''} onClick={() => setView('customize')}>Customize ◈</button><button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>Settings ⚙</button></nav>

    {view === 'achievements' ? <AchievementsView state={state} /> : null}
    {view === 'collection' ? <CollectionView meta={meta} onEquipTitle={(title) => setMeta((current) => equipTitle(current, title))} onToggleBadge={(id) => setMeta((current) => toggleShowcaseBadge(current, id))} /> : null}
    {view === 'leaderboard' ? <LeaderboardView /> : null}
    {view === 'customize' ? <CustomizationView state={state} setState={setState} inventory={customization} onInventoryChange={setCustomization} /> : null}
    {view === 'settings' ? <SettingsView state={state} setState={setState} /> : null}
    {view === 'earnings' ? <EarningsView state={state} setState={setState} /> : null}
    {view === 'businesses' ? <BusinessView state={state} setState={setState} /> : null}
    {view === 'market' ? <><nav className="tabs">{['all','everyday','luxury','property','business','infrastructure'].map((entry) => <button key={entry} className={category === entry ? 'active' : ''} onClick={() => setCategory(entry)}>{entry}</button>)}</nav><section className="dashboard-grid"><section className="catalog panel"><div className="section-heading"><div><span className="eyebrow">MARKETPLACE</span><h2>Buy the world</h2></div><span>{state.riskMode ? 'Credit enabled · bankruptcy possible' : state.mode === 'advanced' ? 'Revenue + upkeep active' : 'Simple economy'}</span></div><div className="item-list">{visibleItems.map((item) => { const owned = state.owned[item.id] ?? 0, unlocked = state.totalSpent >= (item.unlockSpent ?? 0), price = itemBulkPrice(item, owned, 1, state), maxQty = maxAffordableQuantity(state,item); return <article className={`item-card ${!unlocked ? 'locked' : ''}`} key={item.id}><div className="item-icon">{item.emoji}</div><div className="item-copy"><div className="item-title"><h3>{item.name}</h3><span>Owned {owned.toLocaleString()}</span></div><p>{item.description}</p><div className="item-meta"><b>{money(price)}</b>{item.incomePerSecond ? <span>+{money(item.incomePerSecond)}/sec ea.</span> : null}{state.mode === 'advanced' && item.upkeepPerSecond ? <span className="negative">-{money(item.upkeepPerSecond)}/sec upkeep</span> : null}</div></div><div className="buy-stack">{unlocked ? <><button disabled={!canBuyItem(state,item,1)} onClick={() => setState((s) => s ? buyItem(s,item,1) : s)}>Buy</button><button disabled={!canBuyItem(state,item,10)} onClick={() => setState((s) => s ? buyItem(s,item,10) : s)}>×10</button><button disabled={!canBuyItem(state,item,100)} onClick={() => setState((s) => s ? buyItem(s,item,100) : s)}>×100</button><button disabled={maxQty < 1} onClick={() => setState((s) => s ? buyItem(s,item,maxAffordableQuantity(s,item)) : s)}>MAX</button><button className="sell" disabled={!canSellItem(state,item)} onClick={() => setState((s) => s ? sellItem(s,item,1) : s)}>{state.scenarioId === 'custom' && state.customScenario && !state.customScenario.restrictions.sellingEnabled ? 'No Sell' : 'Sell'}</button></> : <span>Unlock after {money(item.unlockSpent ?? 0)} spent</span>}</div></article>; })}</div></section><aside className="side-stack"><FinancialPanel state={state} gross={gross} upkeep={upkeep} income={income} holdings={holdings} upgradeValue={upgradeValue} ownedCount={ownedCount} onMode={() => setState((s) => s && !(s.scenarioId === 'custom' && s.customScenario?.rulesLocked) ? {...s, mode: s.mode === 'simple' ? 'advanced' : 'simple'} : s)} /><ProgressPanels state={state} currentHouse={currentHouse} nextHouse={nextHouse} currentTown={currentTown} nextTown={nextTown} currentRegion={currentRegion} nextRegion={nextRegion} setState={setState} /></aside></section></> : null}
    {view === 'empire' ? <section className="empire-grid"><section className="panel empire-main"><span className="eyebrow">EMPIRE UPGRADES</span><h2>Make everything you own stronger</h2><p className="muted">Upgrades affect your whole economy and become increasingly expensive.</p><div className="upgrade-grid">{empireUpgrades.map((upgrade) => { const level = state.upgrades[upgrade.id] ?? 0, locked = state.townLevel < (upgrade.requiredTownLevel ?? 0) || state.regionLevel < (upgrade.requiredRegionLevel ?? 0); return <article className={`upgrade-card ${locked ? 'locked' : ''}`} key={upgrade.id}><div className="upgrade-icon">{upgrade.emoji}</div><div><div className="item-title"><h3>{upgrade.name}</h3><span>Lv {level}/{upgrade.maxLevel}</span></div><p>{upgrade.description}</p><div className="upgrade-effects">{upgrade.incomeMultiplierPerLevel ? <span>+{Math.round(upgrade.incomeMultiplierPerLevel * 100)}% revenue/lvl</span> : null}{upgrade.upkeepReductionPerLevel ? <span>-{Math.round(upgrade.upkeepReductionPerLevel * 100)}% costs/lvl</span> : null}</div></div><button disabled={!canBuyUpgrade(state, upgrade)} onClick={() => setState((s) => s ? buyUpgrade(s, upgrade) : s)}>{level >= upgrade.maxLevel ? 'MAXED' : locked ? 'LOCKED' : `Upgrade · ${money(upgradeCost(state, upgrade))}`}</button></article>; })}</div></section><aside className="side-stack">{state.townLevel >= 4 ? <section className="panel"><span className="eyebrow">CITY SPECIALIZATION</span><h2>{specialization ? `${specialization.emoji} ${specialization.name}` : 'Choose your city identity'}</h2>{specialization ? <p>{specialization.description}</p> : <div className="specialization-list">{citySpecializations.map((spec) => <button key={spec.id} onClick={() => setState((s) => s ? chooseCitySpecialization(s, spec.id) : s)}><span>{spec.emoji}</span><div><b>{spec.name}</b><small>{spec.description}</small></div></button>)}</div>}</section> : null}<ProgressPanels state={state} currentHouse={currentHouse} nextHouse={nextHouse} currentTown={currentTown} nextTown={nextTown} currentRegion={currentRegion} nextRegion={nextRegion} setState={setState} /><section className="panel"><span className="eyebrow">ACHIEVEMENT VAULT</span><h2>{achievementCount}/{achievements.length} unlocked</h2><p>Speedrunner, Wolf Boss, Comeback, Risk, Scenario and Super achievements now live in their own grouped vault.</p><button className="secondary" onClick={() => setView('achievements')}>Open Achievement Vault</button></section></aside></section> : null}
    <footer className="game-footer"><button onClick={() => setCustomization((current) => saveCustomizationInventory(equipCustomization(current, darkTheme ? 'theme-classic-ledger' : 'theme-midnight')))}>Toggle {darkTheme ? 'Classic' : 'Midnight'}</button><button className="secondary" onClick={() => setView('customize')}>Customize ◈</button><button className="secondary" onClick={() => setView('settings')}>Game Rules ⚙</button><button className="danger" onClick={() => { localStorage.removeItem(SAVE_KEY); setState(null); setOfflineAward(0); }}>Reset Run</button></footer>
  </main>;
}

function FinancialPanel({ state, gross, upkeep, income, holdings, upgradeValue, ownedCount, onMode }: { state: GameState; gross: number; upkeep: number; income: number; holdings: number; upgradeValue: number; ownedCount: number; onMode: () => void }) { const locked = state.scenarioId === 'custom' && !!state.customScenario?.rulesLocked; return <section className="panel finance-panel"><span className="eyebrow">FINANCIAL DASHBOARD</span><h2>{state.mode === 'simple' ? 'Simple view' : 'Advanced view'}</h2><div className="finance-grid"><span>Cash <b>{money(state.cash)}</b></span><span>Assets <b>{money(holdings)}</b></span><span>Upgrades <b>{money(upgradeValue)}</b></span><span>Gross income <b>{money(gross)}/s</b></span><span>Operating cost <b>{state.mode === 'advanced' || state.riskMode ? `${money(upkeep)}/s` : 'Hidden'}</b></span><span>Net income <b className={income >= 0 ? 'positive' : 'negative'}>{money(income)}/s</b></span><span>Items owned <b>{ownedCount.toLocaleString()}</b></span><span>Sold <b>{money(state.totalSold)}</b></span></div><button className="secondary" disabled={locked} onClick={onMode}>{locked ? 'Financial mode locked by challenge' : `Switch to ${state.mode === 'simple' ? 'Advanced' : 'Simple'}`}</button></section>; }

function ProgressPanels({ state, currentHouse, nextHouse, currentTown, nextTown, currentRegion, nextRegion, setState }: { state: GameState; currentHouse: (typeof houseTiers)[number]; nextHouse: (typeof houseTiers)[number] | undefined; currentTown: (typeof townTiers)[number]; nextTown: (typeof townTiers)[number] | undefined; currentRegion: (typeof regionTiers)[number]; nextRegion: (typeof regionTiers)[number] | undefined; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const price = state.rules.economy.purchasePriceMultiplier;
  return <>
    <section className="panel compact-progress"><span className="eyebrow">HOME</span><h2>{currentHouse.name}</h2><p>{currentHouse.rooms} rooms · Level {currentHouse.level}</p>{nextHouse ? <button className="primary" onClick={() => setState((s) => s ? upgradeHouse(s) : s)}>Upgrade · {money(nextHouse.cost * price)}</button> : <div className="complete">Estate complete</div>}</section>
    {state.houseLevel >= 5 ? <section className="panel compact-progress"><span className="eyebrow">CITY</span><h2>{currentTown.name}</h2><p>{currentTown.population.toLocaleString()} population · {currentTown.jobs.toLocaleString()} base jobs</p>{nextTown ? <button className="primary" onClick={() => setState((s) => s ? upgradeTown(s) : s)}>Expand · {money(nextTown.cost * price)}</button> : <div className="complete">Metropolis complete</div>}</section> : null}
    {state.townLevel >= 5 ? <section className="panel compact-progress region-panel"><span className="eyebrow">REGIONAL POWER</span><h2>{currentRegion.name}</h2><p>{currentRegion.population.toLocaleString()} people influenced · {currentRegion.economy} economy</p>{nextRegion ? <><small>Next: {nextRegion.name} · requires {money(nextRegion.requiredNetWorth)} net worth</small><button className="primary" onClick={() => setState((s) => s ? upgradeRegion(s) : s)}>Expand Influence · {money(nextRegion.cost * price)}</button></> : <div className="complete">Planetary economic scale reached 🌍</div>}</section> : null}
  </>;
}
