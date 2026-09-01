'use client';

import { useEffect, useState } from 'react';
import { RULE_PRESET_INFO } from '@/data/rule-presets';
import { applyRulePreset, markRulesCustom, normalizeGameRules } from '@/game/systems/rules';
import { debtSummary, normalizeDebtState } from '@/game/systems/debt';
import { loadMicroMotionPreferences, microMotionProfile, saveMicroMotionPreferences, subscribeMicroMotionPreferences } from '@/game/systems/micro-animations';
import { loadHudPreferences, saveHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';
import type { MicroMotionLevel, MicroMotionPreferences } from '@/game/micro-animation-types';
import { setDebtSystemEnabled } from '@/game/debt-actions';
import { lokRuntime } from '@/integrations/lok/runtime';
import type { GameState } from '@/game/types';

type RuleSection = 'economy' | 'world' | 'difficulty' | 'progression';
type SettingsSection = 'display' | 'gameplay' | 'time' | 'risk' | 'effects' | 'account';

const settingsSections: Array<{ id: SettingsSection; icon: string; label: string; hint: string }> = [
  { id: 'display', icon: '◫', label: 'Display', hint: 'HUD & counters' },
  { id: 'gameplay', icon: '◎', label: 'Gameplay', hint: 'Rules & economy' },
  { id: 'time', icon: '◷', label: 'Time', hint: 'Clock & schedule' },
  { id: 'risk', icon: '⚖', label: 'Risk', hint: 'Debt & legal' },
  { id: 'effects', icon: '✦', label: 'Effects', hint: 'Motion & feedback' },
  { id: 'account', icon: '◇', label: 'Account', hint: 'Persistence' },
];

export function SettingsView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const wallet = lokRuntime.snapshot();
  const challengeLocked = state.scenarioId === 'custom' && !!state.customScenario?.rulesLocked;
  const debt = normalizeDebtState(state.debt);
  const debtInfo = debtSummary(debt);
  const [section, setSection] = useState<SettingsSection>('display');
  const [motionPrefs, setMotionPrefs] = useState<MicroMotionPreferences>(() => loadMicroMotionPreferences());
  const [hudPrefs, setHudPrefs] = useState<HudPreferences>(() => loadHudPreferences());
  const motionProfile = microMotionProfile(motionPrefs.amplificationLevel);

  useEffect(() => subscribeMicroMotionPreferences(setMotionPrefs), []);
  useEffect(() => subscribeHudPreferences(setHudPrefs), []);

  const patchMotion = (patch: Partial<MicroMotionPreferences>) => setMotionPrefs((current) => saveMicroMotionPreferences({ ...current, ...patch }));
  const patchHud = (patch: Partial<HudPreferences>) => setHudPrefs((current) => saveHudPreferences({ ...current, ...patch }));
  const patchRules = (ruleSection: RuleSection, patch: Record<string, number | boolean>) => setState((current) => {
    if (!current || (current.scenarioId === 'custom' && current.customScenario?.rulesLocked)) return current;
    const nextRules = normalizeGameRules({ ...current.rules, [ruleSection]: { ...current.rules[ruleSection], ...patch } } as GameState['rules']);
    return { ...current, rules: markRulesCustom(nextRules), updatedAt: Date.now() };
  });
  const patchTime = (patch: Partial<GameState['time']['settings']>) => setState((current) => {
    if (!current || (current.scenarioId === 'custom' && current.customScenario?.rulesLocked)) return current;
    return { ...current, time: { ...current.time, settings: { ...current.time.settings, ...patch } }, updatedAt: Date.now() };
  });
  const patchDisplay = (patch: Partial<GameState['time']['display']>) => setState((current) => current ? { ...current, time: { ...current.time, display: { ...current.time.display, ...patch } }, updatedAt: Date.now() } : current);

  return <section className="settings-shell">
    <section className="panel settings-hero">
      <div><span className="eyebrow">SETTINGS</span><h2>Control the game, not the clutter</h2><p>Presentation, gameplay rules, time, risk and effects are separated so the main game stays focused on playing. Run rules stay with the run; display preferences and your LOK wallet persist locally.</p></div>
      <div className="settings-preset-badge"><small>Current ruleset</small><b>{state.rules.presetId.toUpperCase()}</b></div>
    </section>

    <nav className="settings-section-tabs" aria-label="Settings categories">{settingsSections.map((entry) => <button type="button" key={entry.id} className={section === entry.id ? 'active' : ''} onClick={() => setSection(entry.id)}><span>{entry.icon}</span><b>{entry.label}</b><small>{entry.hint}</small></button>)}</nav>

    {challengeLocked && ['gameplay','time','risk'].includes(section) ? <div className="challenge-locked-note">🔒 This custom challenge locked gameplay rules at the start. Display, effects and account preferences remain editable.</div> : null}

    {section === 'display' ? <div className="settings-section-content">
      <section className="panel settings-group"><span className="eyebrow">HUD & BALANCE</span><h2>What belongs on the play screen</h2><p className="muted">These controls used to sit under the balance. They now live here so the game HUD stays clean.</p>
        <Toggle label="Compact HUD" checked={hudPrefs.compactHud} onChange={(v) => patchHud({ compactHud: v })}/>
        <Toggle label="Boxed balance digits" checked={hudPrefs.boxedBalance} onChange={(v) => patchHud({ boxedBalance: v })}/>
        <Toggle label="LOK counter" checked={hudPrefs.showLok} onChange={(v) => patchHud({ showLok: v })}/>
        <Toggle label="Active playtime" checked={hudPrefs.showRunClock} onChange={(v) => patchHud({ showRunClock: v })}/>
        <Toggle label="Game world / day" checked={hudPrefs.showGameDay} onChange={(v) => patchHud({ showGameDay: v })}/>
        <Toggle label="Milliseconds" checked={hudPrefs.showMilliseconds} onChange={(v) => patchHud({ showMilliseconds: v })}/>
        <Toggle label="Debt counter" checked={hudPrefs.showDebt} onChange={(v) => patchHud({ showDebt: v })} disabled={!debt.enabled}/>
      </section>
      <section className="panel settings-group"><span className="eyebrow">DETAILED TIME READOUTS</span><h2>Secondary clock information</h2>
        <Toggle label="Detailed counter HUD" checked={state.time.display.enabled} onChange={(v) => patchDisplay({enabled:v})}/>
        <Toggle label="Show game day" checked={state.time.display.showGameDay} onChange={(v) => patchDisplay({showGameDay:v})}/>
        <Toggle label="Seconds" checked={state.time.display.showSeconds} onChange={(v) => patchDisplay({showSeconds:v})}/>
        <Toggle label="Minutes" checked={state.time.display.showMinutes} onChange={(v) => patchDisplay({showMinutes:v})}/>
        <Toggle label="Hours" checked={state.time.display.showHours} onChange={(v) => patchDisplay({showHours:v})}/>
        <Toggle label="Days" checked={state.time.display.showDays} onChange={(v) => patchDisplay({showDays:v})}/>
      </section>
    </div> : null}

    {section === 'gameplay' ? <fieldset className="settings-lockable" disabled={challengeLocked}>
      <section className="panel"><span className="eyebrow">RULE PRESETS</span><h2>Pick a philosophy, then fine-tune</h2><div className="preset-grid">{RULE_PRESET_INFO.map((preset) => <button type="button" key={preset.id} className={state.rules.presetId === preset.id ? 'selected' : ''} onClick={() => setState((current) => current ? { ...current, rules: applyRulePreset(current.rules, preset.id), updatedAt: Date.now() } : current)}><span>{preset.emoji}</span><b>{preset.name}</b><small>{preset.description}</small></button>)}</div></section>
      <div className="settings-columns">
        <section className="panel settings-group"><span className="eyebrow">ECONOMY</span><h2>Money & prices</h2>
          <Range label="Income multiplier" value={state.rules.economy.incomeMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{incomeMultiplier:v})}/>
          <Range label="Operating costs" value={state.rules.economy.costMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{costMultiplier:v})}/>
          <Range label="Purchase prices" value={state.rules.economy.purchasePriceMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{purchasePriceMultiplier:v})}/>
          <Range label="Business demand" value={state.rules.economy.businessDemandMultiplier} min={0.1} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{businessDemandMultiplier:v})}/>
          <Range label="Labor costs" value={state.rules.economy.laborCostMultiplier} min={0.1} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{laborCostMultiplier:v})}/>
          <Range label="Inflation pressure" value={state.rules.economy.inflationMultiplier} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('economy',{inflationMultiplier:v})}/>
        </section>
        <section className="panel settings-group"><span className="eyebrow">WORLD & ACTIVITY</span><h2>Events and earning pressure</h2>
          <Toggle label="Market events" checked={state.rules.world.marketEventsEnabled} onChange={(v) => patchRules('world',{marketEventsEnabled:v})}/>
          <Range label="Event intensity" value={state.rules.world.eventIntensity} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('world',{eventIntensity:v})}/>
          <Toggle label="Offline income" checked={state.rules.world.offlineIncomeEnabled} onChange={(v) => patchRules('world',{offlineIncomeEnabled:v})}/>
          <Range label="Offline income" value={state.rules.world.offlineIncomeMultiplier} min={0} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('world',{offlineIncomeMultiplier:v})}/>
          <Range label="Active work payouts" value={state.rules.difficulty.activeIncomeMultiplier} min={0.1} max={5} step={0.05} suffix="×" onChange={(v) => patchRules('difficulty',{activeIncomeMultiplier:v})}/>
        </section>
      </div>
    </fieldset> : null}

    {section === 'time' ? <fieldset className="settings-lockable" disabled={challengeLocked}><section className="panel settings-group settings-single"><span className="eyebrow">TIME & SCHEDULE</span><h2>How much the clock matters</h2>
      <Toggle label="Time simulation" checked={state.time.settings.enabled} onChange={(v) => patchTime({enabled:v})}/>
      <Toggle label="Activities consume time" checked={state.time.settings.activityTimeCosts} onChange={(v) => patchTime({activityTimeCosts:v})}/>
      <Toggle label="Industry availability windows" checked={state.time.settings.availabilityWindows} onChange={(v) => patchTime({availabilityWindows:v})}/>
      <Toggle label="Random schedule events" checked={state.time.settings.randomTimeEvents} onChange={(v) => patchTime({randomTimeEvents:v})}/>
      <Toggle label="Travel fatigue" checked={state.time.settings.travelFatigue} onChange={(v) => patchTime({travelFatigue:v})}/>
      <Toggle label="Jet lag" checked={state.time.settings.jetLag} onChange={(v) => patchTime({jetLag:v})}/>
      <Range label="Game minutes / real minute" value={state.time.settings.timeScale} min={1} max={240} step={1} suffix="×" onChange={(v) => patchTime({timeScale:v})}/>
    </section></fieldset> : null}

    {section === 'risk' ? <fieldset className="settings-lockable" disabled={challengeLocked}><div className="settings-section-content">
      <section className="panel settings-group"><span className="eyebrow">DEBT & LEGAL</span><h2>Optional leverage simulation</h2>
        <Toggle label="Debt, collateral & court system" checked={debt.enabled} onChange={(v) => setState((current) => current ? setDebtSystemEnabled(current, v) : current)}/>
        <p className="muted">Enable the system here; manage loans, collateral, defaults and court cases from the dedicated Debt & Court game tab.</p>
        <div className="finance-grid"><span>Outstanding <b>{moneyLike(debtInfo.totalDebt)}</b></span><span>Credit score <b>{debt.creditScore}</b></span><span>Court cases <b>{debtInfo.activeCourtCases}</b></span><span>Pledged assets <b>{debtInfo.pledgedAssets}</b></span></div>
      </section>
      <section className="panel settings-group"><span className="eyebrow">RISK PRESSURE</span><h2>How punishing leverage feels</h2>
        <Range label="Risk overdraft pressure" value={state.rules.difficulty.debtPressureMultiplier} min={0} max={3} step={0.05} suffix="×" onChange={(v) => patchRules('difficulty',{debtPressureMultiplier:v})}/>
        <p className="muted">Risk Mode overdraft is separate from the explicit debt system. This setting adjusts pressure without exposing loan management on the main HUD.</p>
      </section>
    </div></fieldset> : null}

    {section === 'effects' ? <section className="panel settings-group settings-single"><span className="eyebrow">EFFECTS & MICRO MOTION</span><h2>From quiet feedback to absurd spectacle</h2>
      <p className="muted">Themes can provide their own animation language, but this global control remains the performance ceiling. It never changes rewards or challenge rules.</p>
      <EffectsKnob value={motionPrefs.amplificationLevel} onChange={(value) => patchMotion({ amplificationLevel:value })} />
      <div className={`motion-profile-summary level-${motionProfile.level}`}><div><span className="motion-profile-orb" /><div><b>{motionProfile.name}</b><small>{motionProfile.description}</small></div></div><div className="motion-profile-metrics"><span>{motionProfile.particles} particles</span><span>{motionProfile.echoes} echoes</span><span>{motionProfile.maxConcurrent} max flyouts</span></div></div>
      <Toggle label="Micro-motion system" checked={motionPrefs.enabled} onChange={(v) => patchMotion({enabled:v})}/>
      <Toggle label="Flying value trails" checked={motionPrefs.flyoutsEnabled} onChange={(v) => patchMotion({flyoutsEnabled:v})}/>
      <Toggle label="Animated counter counting" checked={motionPrefs.counterCountingEnabled} onChange={(v) => patchMotion({counterCountingEnabled:v})}/>
      <Toggle label="Match active palette / counter color" checked={motionPrefs.paletteReactive} onChange={(v) => patchMotion({paletteReactive:v})}/>
      <Toggle label="Respect reduced-motion preference" checked={motionPrefs.respectReducedMotion} onChange={(v) => patchMotion({respectReducedMotion:v})}/>
      <label className="settings-toggle"><span>Floating symbol treatment</span><select value={motionPrefs.symbolStyle} onChange={(e) => patchMotion({symbolStyle:e.target.value as MicroMotionPreferences['symbolStyle']})}><option value="auto">Auto</option><option value="minimal">Minimal</option><option value="burst">Burst</option></select></label>
    </section> : null}

    {section === 'account' ? <section className="panel account-settings"><div><span className="eyebrow">ACCOUNT & PERSISTENCE</span><h2>Local-first today, portable later</h2><p>Your active run, Legacy Collection, leaderboard, cosmetics and LOK wallet are local for now. Future account sync can carry them between devices without making an account mandatory to play.</p></div><div className="persistence-cards"><span><small>LOK wallet</small><b>◈ {wallet.balance.toLocaleString()}</b><em>{wallet.lifetimeEarned.toLocaleString()} lifetime earned</em></span><span><small>Identity</small><b>Local</b><em>Cloud linking planned</em></span><span><small>LOK Pass</small><b>Future</b><em>Supporter / ad-free entitlement</em></span><span><small>Cloud saves</small><b>Future</b><em>Server adapter ready</em></span></div></section> : null}
  </section>;
}

function moneyLike(value: number) { return value >= 1e12 ? `$${(value / 1e12).toFixed(2)}T` : value >= 1e9 ? `$${(value / 1e9).toFixed(2)}B` : value >= 1e6 ? `$${(value / 1e6).toFixed(2)}M` : `$${Math.round(value).toLocaleString()}`; }
function Toggle({label,checked,onChange,disabled=false}:{label:string;checked:boolean;onChange:(value:boolean)=>void;disabled?:boolean}) { return <label className={`settings-toggle ${disabled ? 'disabled' : ''}`}><span>{label}</span><input type="checkbox" checked={checked} disabled={disabled} onChange={(e)=>onChange(e.target.checked)}/></label>; }
function Range({label,value,min,max,step,suffix,onChange}:{label:string;value:number;min:number;max:number;step:number;suffix:string;onChange:(value:number)=>void}) { return <label className="settings-range"><span><b>{label}</b><em>{Number(value.toFixed(2))}{suffix}</em></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(Number(e.target.value))}/></label>; }
function EffectsKnob({value,onChange}:{value:MicroMotionLevel;onChange:(value:MicroMotionLevel)=>void}) { const labels=['Nothing','Static','Animated','High','Uber','Absurd']; return <div className={`effects-knob level-${value}`}><div className="effects-knob-head"><b>Effects</b><span>{labels[value]}</span></div><input aria-label="Effects amplification" type="range" min={0} max={5} step={1} value={value} onChange={(e)=>onChange(Number(e.target.value) as MicroMotionLevel)}/><div className="effects-knob-labels">{labels.map((label,index)=><button type="button" key={label} className={value===index?'active':''} onClick={()=>onChange(index as MicroMotionLevel)}>{label}</button>)}</div></div>; }
