'use client';

import { RULE_PRESET_INFO } from '@/data/rule-presets';
import { applyRulePreset, markRulesCustom, normalizeGameRules } from '@/game/systems/rules';
import { debtSummary, normalizeDebtState } from '@/game/systems/debt';
import { setDebtSystemEnabled } from '@/game/debt-actions';
import { lokRuntime } from '@/integrations/lok/runtime';
import type { GameState } from '@/game/types';

type RuleSection = 'economy' | 'world' | 'difficulty' | 'progression';

export function SettingsView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const wallet = lokRuntime.snapshot();
  const challengeLocked = state.scenarioId === 'custom' && !!state.customScenario?.rulesLocked;
  const debt = normalizeDebtState(state.debt);
  const debtInfo = debtSummary(debt);
  const patchRules = (section: RuleSection, patch: Record<string, number | boolean>) => setState((current) => {
    if (!current || (current.scenarioId === 'custom' && current.customScenario?.rulesLocked)) return current;
    const nextRules = normalizeGameRules({ ...current.rules, [section]: { ...current.rules[section], ...patch } } as GameState['rules']);
    return { ...current, rules: markRulesCustom(nextRules), updatedAt: Date.now() };
  });
  const patchTime = (patch: Partial<GameState['time']['settings']>) => setState((current) => {
    if (!current || (current.scenarioId === 'custom' && current.customScenario?.rulesLocked)) return current;
    return { ...current, time: { ...current.time, settings: { ...current.time.settings, ...patch } }, updatedAt: Date.now() };
  });
  const patchDisplay = (patch: Partial<GameState['time']['display']>) => setState((current) => current ? { ...current, time: { ...current.time, display: { ...current.time.display, ...patch } }, updatedAt: Date.now() } : current);

  return <section className="settings-shell">
    <section className="panel settings-hero"><div><span className="eyebrow">GAME RULES ENGINE</span><h2>Make Spend It All play your way</h2><p>Presets change the whole economy at once. Advanced controls let you tune individual systems. Rules are stored with the run, while your LOK wallet remains separate and persistent.</p></div><div className="settings-preset-badge"><small>Current ruleset</small><b>{state.rules.presetId.toUpperCase()}</b></div></section>
    {challengeLocked ? <div className="challenge-locked-note">🔒 This custom challenge locked its gameplay rules at the start. HUD preferences remain editable, but economy and time rules stay fixed so the challenge code remains reproducible.</div> : null}

    <fieldset className="settings-lockable" disabled={challengeLocked}>
      <section className="panel"><span className="eyebrow">PRESETS</span><h2>One-click rule sets</h2><div className="preset-grid">{RULE_PRESET_INFO.map((preset) => <button type="button" key={preset.id} className={state.rules.presetId === preset.id ? 'selected' : ''} onClick={() => setState((current) => current ? { ...current, rules: applyRulePreset(current.rules, preset.id), updatedAt: Date.now() } : current)}><span>{preset.emoji}</span><b>{preset.name}</b><small>{preset.description}</small></button>)}</div></section>

      <div className="settings-columns">
        <section className="panel settings-group"><span className="eyebrow">ECONOMY</span><h2>Money & prices</h2>
          <Range label="Income multiplier" value={state.rules.economy.incomeMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{incomeMultiplier:v})}/>
          <Range label="Operating costs" value={state.rules.economy.costMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{costMultiplier:v})}/>
          <Range label="Purchase prices" value={state.rules.economy.purchasePriceMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{purchasePriceMultiplier:v})}/>
          <Range label="Business demand" value={state.rules.economy.businessDemandMultiplier} min={0.1} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{businessDemandMultiplier:v})}/>
          <Range label="Labor costs" value={state.rules.economy.laborCostMultiplier} min={0.1} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{laborCostMultiplier:v})}/>
          <Range label="Inflation pressure" value={state.rules.economy.inflationMultiplier} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{inflationMultiplier:v})}/>
        </section>

        <section className="panel settings-group"><span className="eyebrow">WORLD</span><h2>Events & offline play</h2>
          <Toggle label="Market events" checked={state.rules.world.marketEventsEnabled} onChange={(v) => patchRules('world',{marketEventsEnabled:v})}/>
          <Range label="Event intensity" value={state.rules.world.eventIntensity} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('world',{eventIntensity:v})}/>
          <Toggle label="Offline income" checked={state.rules.world.offlineIncomeEnabled} onChange={(v) => patchRules('world',{offlineIncomeEnabled:v})}/>
          <Range label="Offline income" value={state.rules.world.offlineIncomeMultiplier} min={0} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('world',{offlineIncomeMultiplier:v})}/>
          <Range label="Risk overdraft pressure" value={state.rules.difficulty.debtPressureMultiplier} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('difficulty',{debtPressureMultiplier:v})}/>
          <Range label="Active work payouts" value={state.rules.difficulty.activeIncomeMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('difficulty',{activeIncomeMultiplier:v})}/>
        </section>

        <section className="panel settings-group"><span className="eyebrow">TIME & SCHEDULE</span><h2>How much the clock matters</h2>
          <Toggle label="Time simulation" checked={state.time.settings.enabled} onChange={(v) => patchTime({enabled:v})}/>
          <Toggle label="Activities consume time" checked={state.time.settings.activityTimeCosts} onChange={(v) => patchTime({activityTimeCosts:v})}/>
          <Toggle label="Industry availability windows" checked={state.time.settings.availabilityWindows} onChange={(v) => patchTime({availabilityWindows:v})}/>
          <Toggle label="Random schedule events" checked={state.time.settings.randomTimeEvents} onChange={(v) => patchTime({randomTimeEvents:v})}/>
          <Toggle label="Travel fatigue" checked={state.time.settings.travelFatigue} onChange={(v) => patchTime({travelFatigue:v})}/>
          <Toggle label="Jet lag" checked={state.time.settings.jetLag} onChange={(v) => patchTime({jetLag:v})}/>
          <Range label="Game minutes / real minute" value={state.time.settings.timeScale} min={1} max={240} step={1} suffix="×" onChange={(v) => patchTime({timeScale:v})}/>
        </section>

        <section className="panel settings-group"><span className="eyebrow">DEBT & LEGAL</span><h2>Optional leverage simulation</h2>
          <Toggle label="Debt, collateral & court system" checked={debt.enabled} onChange={(v) => setState((current) => current ? setDebtSystemEnabled(current, v) : current)}/>
          <p className="muted">When enabled, explicit loans accrue interest against the game calendar. Secured defaults can seize pledged assets; unsecured defaults can become civil court cases.</p>
          <div className="finance-grid"><span>Outstanding <b>{moneyLike(debtInfo.totalDebt)}</b></span><span>Credit score <b>{debt.creditScore}</b></span><span>Court cases <b>{debtInfo.activeCourtCases}</b></span><span>Pledged assets <b>{debtInfo.pledgedAssets}</b></span></div>
          {!debt.enabled ? <small>Off by default. Risk Mode overdraft can still exist independently.</small> : null}
          {debt.enabled && debtInfo.totalDebt > 0 ? <small>Outstanding debt must be repaid or resolved before this system can be switched off.</small> : null}
        </section>
      </div>
    </fieldset>

    <section className="panel settings-group"><span className="eyebrow">HUD COUNTERS</span><h2>What stays visible</h2>
      <Toggle label="Counter HUD" checked={state.time.display.enabled} onChange={(v) => patchDisplay({enabled:v})}/>
      <Toggle label="Game day counter" checked={state.time.display.showGameDay} onChange={(v) => patchDisplay({showGameDay:v})}/>
      <Toggle label="Milliseconds" checked={state.time.display.showMilliseconds} onChange={(v) => patchDisplay({showMilliseconds:v})}/>
      <Toggle label="Seconds" checked={state.time.display.showSeconds} onChange={(v) => patchDisplay({showSeconds:v})}/>
      <Toggle label="Minutes" checked={state.time.display.showMinutes} onChange={(v) => patchDisplay({showMinutes:v})}/>
      <Toggle label="Hours" checked={state.time.display.showHours} onChange={(v) => patchDisplay({showHours:v})}/>
      <Toggle label="Days" checked={state.time.display.showDays} onChange={(v) => patchDisplay({showDays:v})}/>
      <p className="muted">The live debt counter is controlled separately from the Counters ⚙ menu under the main balance, and only appears when the debt system is enabled.</p>
    </section>

    <section className="panel account-settings"><div><span className="eyebrow">ACCOUNT & PERSISTENCE</span><h2>Local-first today, portable later</h2><p>Your active run, Legacy Collection, leaderboard and LOK wallet are local for now. Future account sync will let Apple, Discord, GitHub or G-Six identity carry them between devices without making an account mandatory to play.</p></div><div className="persistence-cards"><span><small>LOK wallet</small><b>◈ {wallet.balance.toLocaleString()}</b><em>Local persistent wallet</em></span><span><small>Identity</small><b>Local</b><em>Cloud linking planned</em></span><span><small>LOK Pass</small><b>Future</b><em>$2.99 supporter/ad-free entitlement</em></span><span><small>Cloud saves</small><b>Future</b><em>Server adapter ready</em></span></div></section>
  </section>;
}

function moneyLike(value: number) { return value >= 1e12 ? `$${(value / 1e12).toFixed(2)}T` : value >= 1e9 ? `$${(value / 1e9).toFixed(2)}B` : value >= 1e6 ? `$${(value / 1e6).toFixed(2)}M` : `$${Math.round(value).toLocaleString()}`; }
function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(value:boolean)=>void}) { return <label className="settings-toggle"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/></label>; }
function Range({label,value,min,max,step,suffix,onChange}:{label:string;value:number;min:number;max:number;step:number;suffix:string;onChange:(value:number)=>void}) { return <label className="settings-range"><span><b>{label}</b><em>{Number(value.toFixed(2))}{suffix}</em></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(Number(e.target.value))}/></label>; }
