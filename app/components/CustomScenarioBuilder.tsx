'use client';

import { useMemo, useState } from 'react';
import { RULE_PRESET_INFO } from '@/data/rule-presets';
import type { CustomScenarioDefinition, CustomWinConditionType } from '@/game/custom-scenario-types';
import { createGameRules, markRulesCustom } from '@/game/systems/rules';
import { createCustomScenario, customGoalLabel, customScenarioValidation, decodeChallengeCode, encodeChallengeCode, normalizeCustomScenario } from '@/game/systems/custom-scenarios';

const winOptions: { id: CustomWinConditionType; label: string; defaultTarget: number }[] = [
  { id: 'net-worth', label: 'Reach net worth', defaultTarget: 1_000_000 },
  { id: 'total-spent', label: 'Spend a total amount', defaultTarget: 1_000_000 },
  { id: 'wealth-multiplier', label: 'Multiply starting wealth', defaultTarget: 100 },
  { id: 'income-per-second', label: 'Reach income per second', defaultTarget: 100_000 },
  { id: 'town-level', label: 'Reach city level', defaultTarget: 5 },
  { id: 'region-level', label: 'Reach region level', defaultTarget: 5 },
  { id: 'survive-minutes', label: 'Survive active minutes', defaultTarget: 60 },
  { id: 'free', label: 'No finish line', defaultTarget: 0 },
];

export function CustomScenarioBuilder({ onStart, onClose }: { onStart: (scenario: CustomScenarioDefinition) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<CustomScenarioDefinition>(() => createCustomScenario());
  const [codeInput, setCodeInput] = useState('');
  const [message, setMessage] = useState('');
  const challengeCode = useMemo(() => encodeChallengeCode(draft), [draft]);
  const validation = customScenarioValidation(draft);

  const update = (patch: Partial<CustomScenarioDefinition>) => setDraft((current) => normalizeCustomScenario({ ...current, ...patch }));
  const customRules = (change: (rules: CustomScenarioDefinition['rules']) => CustomScenarioDefinition['rules']) => setDraft((current) => normalizeCustomScenario({ ...current, rules: markRulesCustom(change(current.rules)) }));
  const setWinType = (type: CustomWinConditionType) => {
    const option = winOptions.find((entry) => entry.id === type)!;
    update({ winCondition: { type, target: option.defaultTarget } });
  };
  const importCode = () => {
    try { const decoded = decodeChallengeCode(codeInput); setDraft(decoded); setMessage(`Loaded “${decoded.name}”.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load that code.'); }
  };
  const copyCode = async () => {
    try { await navigator.clipboard.writeText(challengeCode); setMessage('Challenge code copied.'); }
    catch { setMessage('Copy is unavailable here. Select the code and copy it manually.'); }
  };

  return <section className="custom-builder" aria-label="Custom scenario builder">
    <div className="custom-builder-head"><div><span className="eyebrow">CUSTOM CHALLENGE LAB</span><h2>Build your own run</h2><p>Choose the starting point, finish line, economic rules and time pressure. Lock the rules to keep the challenge reproducible.</p></div><button type="button" className="secondary compact" onClick={onClose}>Close</button></div>

    <div className="custom-builder-grid">
      <section className="custom-builder-section">
        <span className="eyebrow">IDENTITY & GOAL</span>
        <label>Challenge name<input value={draft.name} maxLength={60} onChange={(e) => update({ name: e.target.value })}/></label>
        <label>Description<textarea value={draft.description} maxLength={220} onChange={(e) => update({ description: e.target.value })}/></label>
        <label>Starting cash<input type="number" min="0" step="100" value={draft.startingCash} onChange={(e) => update({ startingCash: Number(e.target.value) })}/></label>
        <label>Win condition<select value={draft.winCondition.type} onChange={(e) => setWinType(e.target.value as CustomWinConditionType)}>{winOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        {draft.winCondition.type !== 'free' ? <label>Target<input type="number" min="0.0001" step="1" value={draft.winCondition.target} onChange={(e) => update({ winCondition: { ...draft.winCondition, target: Number(e.target.value) } })}/></label> : null}
        <div className="custom-goal-preview"><small>Goal preview</small><b>{customGoalLabel(draft)}</b></div>
        {validation ? <div className="builder-warning">⚠️ {validation}</div> : null}
      </section>

      <section className="custom-builder-section">
        <span className="eyebrow">RUN RULES</span>
        <label>Financial mode<select value={draft.mode} onChange={(e) => update({ mode: e.target.value === 'advanced' ? 'advanced' : 'simple' })}><option value="simple">Simple</option><option value="advanced">Advanced</option></select></label>
        <Toggle label="Risk Mode" checked={draft.riskMode} onChange={(value) => update({ riskMode: value })}/>
        <Toggle label="Allow selling" checked={draft.restrictions.sellingEnabled} onChange={(value) => update({ restrictions: { sellingEnabled: value } })}/>
        <Toggle label="Lock rules after start" checked={draft.rulesLocked} onChange={(value) => update({ rulesLocked: value })}/>
        <label>Economy preset<select value={draft.rules.presetId === 'custom' ? 'custom' : draft.rules.presetId} onChange={(e) => { const id = e.target.value; if (id !== 'custom') update({ rules: createGameRules(id as Exclude<CustomScenarioDefinition['rules']['presetId'],'custom'>) }); }}><option value="custom">Custom</option>{RULE_PRESET_INFO.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
        <Range label="Income" value={draft.rules.economy.incomeMultiplier} min={0.1} max={5} step={0.05} onChange={(v) => customRules((r) => ({ ...r, economy: { ...r.economy, incomeMultiplier: v } }))}/>
        <Range label="Costs" value={draft.rules.economy.costMultiplier} min={0.1} max={5} step={0.05} onChange={(v) => customRules((r) => ({ ...r, economy: { ...r.economy, costMultiplier: v } }))}/>
        <Range label="Purchase prices" value={draft.rules.economy.purchasePriceMultiplier} min={0.1} max={5} step={0.05} onChange={(v) => customRules((r) => ({ ...r, economy: { ...r.economy, purchasePriceMultiplier: v } }))}/>
        <Range label="Debt pressure" value={draft.rules.difficulty.debtPressureMultiplier} min={0} max={3} step={0.05} onChange={(v) => customRules((r) => ({ ...r, difficulty: { ...r.difficulty, debtPressureMultiplier: v } }))}/>
        <Toggle label="Market events" checked={draft.rules.world.marketEventsEnabled} onChange={(v) => customRules((r) => ({ ...r, world: { ...r.world, marketEventsEnabled: v } }))}/>
        <Toggle label="Offline income" checked={draft.rules.world.offlineIncomeEnabled} onChange={(v) => customRules((r) => ({ ...r, world: { ...r.world, offlineIncomeEnabled: v } }))}/>
      </section>

      <section className="custom-builder-section">
        <span className="eyebrow">TIME & SCHEDULE</span>
        <Toggle label="Time simulation" checked={draft.time.enabled} onChange={(v) => update({ time: { ...draft.time, enabled: v } })}/>
        <Range label="Time speed" value={draft.time.timeScale} min={1} max={240} step={1} suffix="×" onChange={(v) => update({ time: { ...draft.time, timeScale: v } })}/>
        <Toggle label="Activities consume time" checked={draft.time.activityTimeCosts} onChange={(v) => update({ time: { ...draft.time, activityTimeCosts: v } })}/>
        <Toggle label="Industry availability" checked={draft.time.availabilityWindows} onChange={(v) => update({ time: { ...draft.time, availabilityWindows: v } })}/>
        <Toggle label="Random time events" checked={draft.time.randomTimeEvents} onChange={(v) => update({ time: { ...draft.time, randomTimeEvents: v } })}/>
        <Toggle label="Travel fatigue" checked={draft.time.travelFatigue} onChange={(v) => update({ time: { ...draft.time, travelFatigue: v } })}/>
        <Toggle label="Jet lag" checked={draft.time.jetLag} onChange={(v) => update({ time: { ...draft.time, jetLag: v } })}/>
      </section>

      <section className="custom-builder-section challenge-code-section">
        <span className="eyebrow">RULE CODE</span><h3>Share the exact challenge</h3><p>This code contains the scenario goal, rules and schedule settings—not your save data or LOK balance.</p>
        <textarea className="challenge-code" readOnly value={challengeCode}/><button type="button" className="secondary" onClick={copyCode}>Copy challenge code</button>
        <label>Import a code<textarea value={codeInput} placeholder="SIA1-…" onChange={(e) => setCodeInput(e.target.value)}/></label><button type="button" className="secondary" disabled={!codeInput.trim()} onClick={importCode}>Load code</button>
        {message ? <div className="builder-message" aria-live="polite">{message}</div> : null}
      </section>
    </div>

    <div className="custom-builder-footer"><div><span className="eyebrow">READY TO PLAY</span><b>{draft.name}</b><small>{customGoalLabel(draft)} · {draft.riskMode ? 'Risk Mode' : 'No Risk Mode'} · {draft.rulesLocked ? 'Rules locked' : 'Rules editable'}</small></div><button type="button" className="primary" disabled={!!validation} onClick={() => onStart(normalizeCustomScenario(draft))}>Start Custom Challenge</button></div>
  </section>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="builder-toggle"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}/></label>; }
function Range({ label, value, min, max, step, suffix = '×', onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (value: number) => void }) { return <label className="builder-range"><span><b>{label}</b><em>{Number(value.toFixed(2))}{suffix}</em></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}/></label>; }
