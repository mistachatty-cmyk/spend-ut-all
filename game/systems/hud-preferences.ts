export type InterfaceMode = 'simple' | 'advanced';
export type LooperArtStyle = 'classic' | 'production';
export type UiEdgeStyle = 'rounded' | 'boxed';
export type InformationDensity = 'more' | 'balanced' | 'less';
/** Photo becomes selectable only when a rights-cleared local photo pack is installed. */
export type VisualArtMode = 'pixel' | 'photo';
/** Reserved for the incoming asset pack; today it controls no game rules. */
export type VisualQualityPreset = 'potato' | 'mid' | 'high';

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
  /** Global chrome treatment selected in the post-companion Style Deck. */
  uiEdgeStyle: UiEdgeStyle;
  /** Controls how much secondary HUD information stays visible by default. */
  informationDensity: InformationDensity;
  visualArtMode: VisualArtMode;
  visualQualityPreset: VisualQualityPreset;
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
  looperArtStyle: 'classic',
  uiEdgeStyle: 'rounded',
  informationDensity: 'balanced',
  visualArtMode: 'pixel',
  visualQualityPreset: 'mid',
};

const EVENT_NAME = 'spend-it-all-hud-preferences';

function normalize(input?: Partial<HudPreferences> & { looperArtStyle?: string; uiEdgeStyle?: string; informationDensity?: string; visualArtMode?: string; visualQualityPreset?: string } | null): HudPreferences {
  const legacyStyle = input?.looperArtStyle;
  const looperArtStyle: LooperArtStyle = legacyStyle === 'production' ? 'production' : 'classic';
  const uiEdgeStyle: UiEdgeStyle = input?.uiEdgeStyle === 'boxed' ? 'boxed' : 'rounded';
  const informationDensity: InformationDensity = input?.informationDensity === 'more'
    ? 'more'
    : input?.informationDensity === 'less'
      ? 'less'
      : 'balanced';
  const visualArtMode: VisualArtMode = input?.visualArtMode === 'photo' ? 'photo' : 'pixel';
  const visualQualityPreset: VisualQualityPreset = input?.visualQualityPreset === 'potato'
    ? 'potato'
    : input?.visualQualityPreset === 'high'
      ? 'high'
      : 'mid';
  return { ...DEFAULT_HUD_PREFS, ...input, looperArtStyle, uiEdgeStyle, informationDensity, visualArtMode, visualQualityPreset } as HudPreferences;
}

export function loadHudPreferences(): HudPreferences {
  if (typeof window === 'undefined') return DEFAULT_HUD_PREFS;
  try {
    const raw = window.localStorage.getItem(HUD_PREFS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return normalize(parsed);
  } catch {
    return DEFAULT_HUD_PREFS;
  }
}

export function saveHudPreferences(value: HudPreferences): HudPreferences {
  const normalized = normalize(value);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(HUD_PREFS_KEY, JSON.stringify(normalized));
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
