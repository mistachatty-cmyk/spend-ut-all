export type InterfaceMode = 'simple' | 'advanced';
export type LooperArtStyle = 'classic' | 'production';
export type UiEdgeStyle = 'rounded' | 'boxed';
export type InformationDensity = 'more' | 'balanced' | 'less';
export type VisualArtMode = 'emoji' | 'pixel' | 'photo';
export type VisualQualityPreset = 'potato' | 'mid' | 'high';

export type HudPreferences = {
  showLok: boolean;
  showRunClock: boolean;
  showGameDay: boolean;
  showMilliseconds: boolean;
  showDebt: boolean;
  compactHud: boolean;
  boxedBalance: boolean;
  showFullDigits: boolean;
  animatedFlip: boolean;
  potatoMode: boolean;
  disableBlur: boolean;
  lowPowerTicks: boolean;
  incomePulse: boolean;
  interfaceMode: InterfaceMode;
  looperArtStyle: LooperArtStyle;
  showItemPhotos: boolean;
  itemPhotoEscalation: boolean;
  uiEdgeStyle: UiEdgeStyle;
  informationDensity: InformationDensity;
  visualArtMode: VisualArtMode;
  visualQualityPreset: VisualQualityPreset;
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
  showFullDigits: false,
  animatedFlip: true,
  potatoMode: false,
  disableBlur: false,
  lowPowerTicks: false,
  incomePulse: true,
  interfaceMode: 'simple',
  looperArtStyle: 'classic',
  showItemPhotos: true,
  itemPhotoEscalation: true,
  uiEdgeStyle: 'rounded',
  informationDensity: 'balanced',
  visualArtMode: 'pixel',
  visualQualityPreset: 'mid',
};

const EVENT_NAME = 'spend-it-all-hud-preferences';

function normalize(input?: Partial<HudPreferences> & { looperArtStyle?: string } | null): HudPreferences {
  const legacyStyle = input?.looperArtStyle;
  const looperArtStyle: LooperArtStyle = legacyStyle === 'production' ? 'production' : 'classic';
  const potato = input?.potatoMode ?? false;
  return {
    ...DEFAULT_HUD_PREFS,
    ...input,
    looperArtStyle,
    showFullDigits: input?.showFullDigits ?? DEFAULT_HUD_PREFS.showFullDigits,
    animatedFlip: potato ? false : (input?.animatedFlip ?? DEFAULT_HUD_PREFS.animatedFlip),
    potatoMode: potato,
    disableBlur: potato || (input?.disableBlur ?? DEFAULT_HUD_PREFS.disableBlur),
    lowPowerTicks: potato || (input?.lowPowerTicks ?? DEFAULT_HUD_PREFS.lowPowerTicks),
    incomePulse: potato ? false : (input?.incomePulse ?? DEFAULT_HUD_PREFS.incomePulse),
    showItemPhotos: input?.showItemPhotos ?? DEFAULT_HUD_PREFS.showItemPhotos,
    itemPhotoEscalation: input?.itemPhotoEscalation ?? DEFAULT_HUD_PREFS.itemPhotoEscalation,
    uiEdgeStyle: input?.uiEdgeStyle === 'boxed' ? 'boxed' : 'rounded',
    informationDensity: input?.informationDensity === 'more' || input?.informationDensity === 'less' ? input.informationDensity : 'balanced',
    visualArtMode: input?.visualArtMode === 'emoji' || input?.visualArtMode === 'pixel' ? input.visualArtMode : 'photo',
    visualQualityPreset: input?.visualQualityPreset === 'potato' || input?.visualQualityPreset === 'high' ? input.visualQualityPreset : 'mid',
  } as HudPreferences;
}

export function syncDocumentPerformanceAttrs(prefs: HudPreferences) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.potatoMode = String(prefs.potatoMode);
  document.documentElement.dataset.disableBlur = String(prefs.disableBlur || prefs.potatoMode);
  document.documentElement.dataset.animatedFlip = String(prefs.animatedFlip && !prefs.potatoMode);
  document.documentElement.dataset.looperArt = prefs.looperArtStyle;
  document.documentElement.dataset.uiEdge = prefs.uiEdgeStyle;
  document.documentElement.dataset.informationDensity = prefs.informationDensity;
  document.documentElement.dataset.visualArt = prefs.visualArtMode;
  document.documentElement.dataset.visualQuality = prefs.visualQualityPreset;
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
      window.localStorage.setItem(LOOPER_PRODUCTION_MIGRATION_KEY, '1');
    } catch {}
    syncDocumentPerformanceAttrs(normalized);
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
