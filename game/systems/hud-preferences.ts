export type InterfaceMode = 'simple' | 'advanced';
export type LooperArtStyle = 'classic' | 'pixel-plus';

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
export const DEFAULT_HUD_PREFS: HudPreferences = {
  showLok: true,
  showRunClock: true,
  showGameDay: true,
  showMilliseconds: false,
  showDebt: false,
  compactHud: true,
  boxedBalance: false,
  interfaceMode: 'simple',
  looperArtStyle: 'pixel-plus',
};

const EVENT_NAME = 'spend-it-all-hud-preferences';

export function loadHudPreferences(): HudPreferences {
  if (typeof window === 'undefined') return DEFAULT_HUD_PREFS;
  try {
    const raw = window.localStorage.getItem(HUD_PREFS_KEY);
    return raw ? { ...DEFAULT_HUD_PREFS, ...JSON.parse(raw) } : DEFAULT_HUD_PREFS;
  } catch {
    return DEFAULT_HUD_PREFS;
  }
}

export function saveHudPreferences(value: HudPreferences): HudPreferences {
  const normalized = { ...DEFAULT_HUD_PREFS, ...value };
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(HUD_PREFS_KEY, JSON.stringify(normalized)); } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
  }
  return normalized;
}

export function subscribeHudPreferences(listener: (value: HudPreferences) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const custom = event as CustomEvent<HudPreferences>;
    listener(custom.detail ?? loadHudPreferences());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
