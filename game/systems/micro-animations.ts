import type { MicroMotionEvent, MicroMotionPoint, MicroMotionPreferences, MicroMotionTarget, MicroMotionTone, MicroMotionKind } from '../micro-animation-types';

export const MICRO_MOTION_EVENT = 'spend-it-all:micro-motion';
export const MICRO_MOTION_PREFS_EVENT = 'spend-it-all:micro-motion-prefs';
export const MICRO_MOTION_PREFS_KEY = 'spend-it-all-micro-motion-v1';

export const DEFAULT_MICRO_MOTION_PREFS: MicroMotionPreferences = {
  enabled: true,
  flyoutsEnabled: true,
  counterCountingEnabled: true,
  paletteReactive: true,
  respectReducedMotion: true,
  intensity: 1,
  symbolStyle: 'auto',
};

export function normalizeMicroMotionPreferences(input?: Partial<MicroMotionPreferences> | null): MicroMotionPreferences {
  return {
    ...DEFAULT_MICRO_MOTION_PREFS,
    ...input,
    enabled: input?.enabled ?? true,
    flyoutsEnabled: input?.flyoutsEnabled ?? true,
    counterCountingEnabled: input?.counterCountingEnabled ?? true,
    paletteReactive: input?.paletteReactive ?? true,
    respectReducedMotion: input?.respectReducedMotion ?? true,
    intensity: Math.max(.25, Math.min(2, Number.isFinite(input?.intensity) ? Number(input!.intensity) : 1)),
    symbolStyle: input?.symbolStyle === 'minimal' || input?.symbolStyle === 'burst' ? input.symbolStyle : 'auto',
  };
}

export function loadMicroMotionPreferences() {
  if (typeof window === 'undefined') return DEFAULT_MICRO_MOTION_PREFS;
  try {
    const raw = localStorage.getItem(MICRO_MOTION_PREFS_KEY);
    return raw ? normalizeMicroMotionPreferences(JSON.parse(raw)) : DEFAULT_MICRO_MOTION_PREFS;
  } catch {
    return DEFAULT_MICRO_MOTION_PREFS;
  }
}

export function saveMicroMotionPreferences(input: MicroMotionPreferences) {
  const next = normalizeMicroMotionPreferences(input);
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(MICRO_MOTION_PREFS_KEY, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new CustomEvent(MICRO_MOTION_PREFS_EVENT, { detail: next }));
  }
  return next;
}

export function motionPointFromElement(element?: HTMLElement | null): MicroMotionPoint | null {
  if (!element || typeof window === 'undefined') return null;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function motionTargetPoint(target: MicroMotionTarget): MicroMotionPoint | null {
  if (typeof document === 'undefined') return null;
  const element = document.querySelector<HTMLElement>(`[data-motion-target="${target}"]`);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function emitMicroMotion(input: {
  kind?: MicroMotionKind;
  target: MicroMotionTarget;
  amount: number;
  displayText: string;
  symbol?: string;
  tone?: MicroMotionTone;
  sourceElement?: HTMLElement | null;
  source?: MicroMotionPoint | null;
  durationMs?: number;
  delayMs?: number;
  paletteKey?: string;
}) {
  if (typeof window === 'undefined') return null;
  const prefs = loadMicroMotionPreferences();
  if (!prefs.enabled) return null;
  const detail: MicroMotionEvent = {
    id: `motion-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    kind: input.kind ?? 'currency',
    target: input.target,
    amount: input.amount,
    displayText: input.displayText,
    symbol: input.symbol,
    tone: input.tone ?? (input.amount < 0 ? 'negative' : 'positive'),
    source: input.source ?? motionPointFromElement(input.sourceElement),
    createdAt: Date.now(),
    durationMs: input.durationMs,
    delayMs: input.delayMs,
    paletteKey: input.paletteKey,
  };
  window.dispatchEvent(new CustomEvent(MICRO_MOTION_EVENT, { detail }));
  return detail;
}

export function subscribeMicroMotion(listener: (event: MicroMotionEvent) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => listener((event as CustomEvent<MicroMotionEvent>).detail);
  window.addEventListener(MICRO_MOTION_EVENT, handler);
  return () => window.removeEventListener(MICRO_MOTION_EVENT, handler);
}

export function subscribeMicroMotionPreferences(listener: (prefs: MicroMotionPreferences) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => listener(normalizeMicroMotionPreferences((event as CustomEvent<MicroMotionPreferences>).detail));
  window.addEventListener(MICRO_MOTION_PREFS_EVENT, handler);
  return () => window.removeEventListener(MICRO_MOTION_PREFS_EVENT, handler);
}
