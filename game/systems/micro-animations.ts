import type { MicroMotionEvent, MicroMotionPoint, MicroMotionPreferences, MicroMotionTarget, MicroMotionTone, MicroMotionKind, MicroMotionLevel, MicroMotionProfile } from '../micro-animation-types';

export const MICRO_MOTION_EVENT = 'spend-it-all:micro-motion';
export const MICRO_MOTION_PREFS_EVENT = 'spend-it-all:micro-motion-prefs';
export const MICRO_MOTION_PREFS_KEY = 'spend-it-all-micro-motion-v1';
const LOOPER_MOTION_ROLLOUT_KEY = 'spend-it-all-looper-motion-v2';

export const MICRO_MOTION_PROFILES: Record<MicroMotionLevel, MicroMotionProfile> = {
  0:{ level:0, name:'Nothing', description:'No flyouts, particles, or animated counting.', moving:false, countCounters:false, particles:0, echoes:0, maxConcurrent:0, durationScale:.35, glow:0, scale:.85 },
  1:{ level:1, name:'Static', description:'Tiny value pings with no travel. Characters stay still.', moving:false, countCounters:false, particles:0, echoes:0, maxConcurrent:4, durationScale:.5, glow:0, scale:.9 },
  2:{ level:2, name:'Animated', description:'Production Looper motion, one lightweight value trail and smooth counter counting.', moving:true, countCounters:true, particles:1, echoes:0, maxConcurrent:8, durationScale:.8, glow:.15, scale:1 },
  3:{ level:3, name:'High', description:'More particles, stronger arrival feedback, and richer trails.', moving:true, countCounters:true, particles:3, echoes:0, maxConcurrent:12, durationScale:1, glow:.35, scale:1.08 },
  4:{ level:4, name:'Uber', description:'Dense particles, echo tokens, brighter glows, and bigger motion.', moving:true, countCounters:true, particles:6, echoes:1, maxConcurrent:18, durationScale:1.12, glow:.65, scale:1.18 },
  5:{ level:5, name:'Absurd', description:'Intentionally excessive celebration mode for capable devices.', moving:true, countCounters:true, particles:10, echoes:2, maxConcurrent:26, durationScale:1.25, glow:1, scale:1.32 },
};

export const DEFAULT_MICRO_MOTION_PREFS: MicroMotionPreferences = {
  enabled: true,
  flyoutsEnabled: true,
  counterCountingEnabled: true,
  paletteReactive: true,
  respectReducedMotion: true,
  amplificationLevel: 2,
  intensity: 1,
  symbolStyle: 'auto',
};

export function microMotionProfile(level: number | undefined | null) {
  const normalized = Math.max(0, Math.min(5, Math.round(Number.isFinite(level) ? Number(level) : 2))) as MicroMotionLevel;
  return MICRO_MOTION_PROFILES[normalized];
}

export function normalizeMicroMotionPreferences(input?: Partial<MicroMotionPreferences> | null): MicroMotionPreferences {
  const legacyLevel = input?.amplificationLevel == null && Number.isFinite(input?.intensity)
    ? Number(input!.intensity) <= .5 ? 1 : Number(input!.intensity) <= 1.15 ? 2 : Number(input!.intensity) <= 1.6 ? 3 : 4
    : input?.amplificationLevel;
  const amplificationLevel = microMotionProfile(legacyLevel).level;
  return {
    ...DEFAULT_MICRO_MOTION_PREFS,
    ...input,
    enabled: input?.enabled ?? true,
    flyoutsEnabled: input?.flyoutsEnabled ?? true,
    counterCountingEnabled: input?.counterCountingEnabled ?? true,
    paletteReactive: input?.paletteReactive ?? true,
    respectReducedMotion: input?.respectReducedMotion ?? true,
    amplificationLevel,
    intensity: Math.max(.25, Math.min(2, Number.isFinite(input?.intensity) ? Number(input!.intensity) : 1)),
    symbolStyle: input?.symbolStyle === 'minimal' || input?.symbolStyle === 'burst' ? input.symbolStyle : 'auto',
  };
}

export function loadMicroMotionPreferences() {
  if (typeof window === 'undefined') return DEFAULT_MICRO_MOTION_PREFS;
  try {
    const raw = localStorage.getItem(MICRO_MOTION_PREFS_KEY);
    let next = raw ? normalizeMicroMotionPreferences(JSON.parse(raw)) : DEFAULT_MICRO_MOTION_PREFS;
    // One-time Production Looper rollout. Existing installs that were on Static
    // get Animated so the new live character system is actually visible. The
    // player can immediately return to Static/Nothing afterward.
    if (!localStorage.getItem(LOOPER_MOTION_ROLLOUT_KEY)) {
      next = { ...next, enabled:true, amplificationLevel: Math.max(2, next.amplificationLevel) as MicroMotionLevel };
      localStorage.setItem(LOOPER_MOTION_ROLLOUT_KEY, '1');
      localStorage.setItem(MICRO_MOTION_PREFS_KEY, JSON.stringify(next));
    }
    return next;
  } catch {
    return DEFAULT_MICRO_MOTION_PREFS;
  }
}

export function saveMicroMotionPreferences(input: MicroMotionPreferences) {
  const next = normalizeMicroMotionPreferences(input);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MICRO_MOTION_PREFS_KEY, JSON.stringify(next));
      localStorage.setItem(LOOPER_MOTION_ROLLOUT_KEY, '1');
    } catch {}
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
  if (!prefs.enabled || prefs.amplificationLevel === 0 || document.visibilityState === 'hidden') return null;
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
