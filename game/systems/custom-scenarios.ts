import { createGameRules, normalizeGameRules } from './rules';
import type { CustomScenarioDefinition, CustomWinConditionType } from '../custom-scenario-types';
import type { TimeSystemSettings } from '../time-types';

const VERSION = 1 as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function normalizeWinTarget(type: CustomWinConditionType, target: number) {
  if (type === 'free') return 0;
  if (type === 'town-level' || type === 'region-level') return Math.round(clamp(target, 1, 5));
  if (type === 'wealth-multiplier') return clamp(target, 1.01, 1_000_000);
  if (type === 'survive-minutes') return clamp(target, 0.1, 525_600);
  return clamp(target, 0.0001, 1e30);
}

export function createCustomScenario(): CustomScenarioDefinition {
  return {
    version: VERSION,
    name: 'My Custom Challenge',
    description: 'A custom Spend It All challenge.',
    startingCash: 0,
    mode: 'simple',
    riskMode: false,
    rulesLocked: true,
    rules: createGameRules('standard'),
    time: {
      enabled: true,
      timeScale: 60,
      activityTimeCosts: true,
      availabilityWindows: true,
      randomTimeEvents: true,
      travelFatigue: true,
      jetLag: true,
    },
    restrictions: { sellingEnabled: true },
    winCondition: { type: 'net-worth', target: 1_000_000 },
  };
}

const winTypes: CustomWinConditionType[] = ['free','net-worth','total-spent','wealth-multiplier','income-per-second','town-level','region-level','survive-minutes'];

export function normalizeCustomScenario(value?: Partial<CustomScenarioDefinition> | null): CustomScenarioDefinition {
  const base = createCustomScenario();
  const winType = winTypes.includes(value?.winCondition?.type as CustomWinConditionType) ? value!.winCondition!.type! : base.winCondition.type;
  const rawTarget = Number(value?.winCondition?.target ?? base.winCondition.target);
  return {
    ...base,
    ...value,
    version: VERSION,
    name: String(value?.name ?? base.name).trim().slice(0, 60) || base.name,
    description: String(value?.description ?? base.description).trim().slice(0, 220),
    startingCash: clamp(Number(value?.startingCash ?? base.startingCash), 0, 1e30),
    mode: value?.mode === 'advanced' ? 'advanced' : 'simple',
    riskMode: !!value?.riskMode,
    rulesLocked: value?.rulesLocked ?? true,
    rules: normalizeGameRules(value?.rules),
    time: {
      enabled: value?.time?.enabled ?? base.time.enabled,
      timeScale: clamp(Number(value?.time?.timeScale ?? base.time.timeScale), 1, 240),
      activityTimeCosts: value?.time?.activityTimeCosts ?? base.time.activityTimeCosts,
      availabilityWindows: value?.time?.availabilityWindows ?? base.time.availabilityWindows,
      randomTimeEvents: value?.time?.randomTimeEvents ?? base.time.randomTimeEvents,
      travelFatigue: value?.time?.travelFatigue ?? base.time.travelFatigue,
      jetLag: value?.time?.jetLag ?? base.time.jetLag,
    },
    restrictions: { sellingEnabled: value?.restrictions?.sellingEnabled ?? true },
    winCondition: { type: winType, target: normalizeWinTarget(winType, rawTarget) },
  };
}

export function customScenarioValidation(scenario: CustomScenarioDefinition) {
  if (scenario.winCondition.type === 'wealth-multiplier' && scenario.startingCash <= 0) return 'Wealth multiplier challenges need starting cash above $0.';
  return null;
}

export function customGoalLabel(scenario: CustomScenarioDefinition) {
  const target = scenario.winCondition.target;
  switch (scenario.winCondition.type) {
    case 'free': return 'Free Mode ∞ — no finish line';
    case 'net-worth': return `Reach $${target.toLocaleString()} net worth`;
    case 'total-spent': return `Spend $${target.toLocaleString()}`;
    case 'wealth-multiplier': return `Reach ${target.toLocaleString()}× starting wealth`;
    case 'income-per-second': return `Reach $${target.toLocaleString()}/sec income`;
    case 'town-level': return `Reach city level ${Math.round(target)}`;
    case 'region-level': return `Reach region level ${Math.round(target)}`;
    case 'survive-minutes': return `Survive ${target.toLocaleString()} active minutes`;
  }
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(code: string) {
  const normalized = code.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeChallengeCode(value: CustomScenarioDefinition) {
  const payload = JSON.stringify(normalizeCustomScenario(value));
  return `SIA1-${bytesToBase64Url(new TextEncoder().encode(payload))}`;
}

export function decodeChallengeCode(code: string): CustomScenarioDefinition {
  const clean = code.trim();
  if (!clean.startsWith('SIA1-')) throw new Error('This is not a Spend It All challenge code.');
  try {
    const payload = new TextDecoder().decode(base64UrlToBytes(clean.slice(5)));
    return normalizeCustomScenario(JSON.parse(payload));
  } catch {
    throw new Error('That challenge code is damaged or unsupported.');
  }
}

export function applyCustomTimeSettings<T extends TimeSystemSettings>(current: T, scenario: CustomScenarioDefinition): T {
  return { ...current, ...scenario.time };
}
