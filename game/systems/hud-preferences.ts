export type InterfaceMode = 'simple' | 'advanced';
export type LooperArtStyle = 'classic' | 'production';

export type HudPreferences = {
  showLok: boolean;
  showRunClock: boolean;
  showGameDay: boolean;
  showMilliseconds: boolean;
  showDebt: boolean;
  compactHud: boolean;
  boxedBalance: boolean;
  interfaceMode: InterfaceMode;
  looperArtStyle: LooperArtStyle;
};

export const HUD_PREFS_KEY = 'spend-it-all-hud-counters-v1';
const LOOPER_PRODUCTION_MIGRATION_KEY = 'spend-it-all-looper-production-art-v2';

export const DEFAULT_HUD_PREFS: HudPreferences = {
  showLok: true,
  showRunClock: true,
  showGameDay: true,
  showMilliseconds: false,
  showDebt: false,
  compactHud: true,
  boxedBalance: false,
  interfaceMode: 'simple',
  looperArtStyle: 'production',
};

const EVENT_NAME = 'spend-it-all-hud-preferences';

function normalize(input?: Partial<HudPreferences> & { looperArtStyle?: string } | null): HudPreferences {
  const legacyStyle = input?.looperArtStyle;
  const looperArtStyle: LooperArtStyle = legacyStyle === 'classic' ? 'classic' : 'production';
  return { ...DEFAULT_HUD_PREFS, ...input, looperArtStyle } as HudPreferences;
}

export function loadHudPreferences(): HudPreferences {
  if (typeof window === 'undefined') return DEFAULT_HUD_PREFS;
  try {
    const raw = window.localStorage.getItem(HUD_PREFS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    let next = normalize(parsed);

    // One-time rollout migration: existing installs are shown the new canonical
    // Production Looper renderer once it ships. Classic remains selectable
    // afterward and is never removed.
    if (!window.localStorage.getItem(LOOPER_PRODUCTION_MIGRATION_KEY)) {
      next = { ...next, looperArtStyle: 'production' };
      window.localStorage.setItem(LOOPER_PRODUCTION_MIGRATION_KEY, '1');
      window.localStorage.setItem(HUD_PREFS_KEY, JSON.stringify(next));
    }
    return next;
  } catch {
    return DEFAULT_HUD_PREFS;
  }
}

export function saveHudPreferences(value: HudPreferences): HudPreferences {
  const normalized = normalize(value);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(HUD_PREFS_KEY, JSON.stringify(normalized));
      window.localStorage.setItem(LOOPER_PRODUCTION_MIGRATION_KEY, '1');
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
  }
  return normalized;
}

export function subscribeHudPreferences(listener: (value: HudPreferences) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const custom = event as CustomEvent<HudPreferences>;
    listener(custom.detail ? normalize(custom.detail) : loadHudPreferences());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
