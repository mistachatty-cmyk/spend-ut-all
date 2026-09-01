export type MicroMotionTarget = 'cash' | 'lok' | 'card-credits' | 'debt' | 'reward';
export type MicroMotionTone = 'positive' | 'negative' | 'debt' | 'reward' | 'neutral';
export type MicroMotionKind = 'currency' | 'debt' | 'card' | 'purchase' | 'reward' | 'system';
export type MicroMotionLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type MicroMotionPoint = { x: number; y: number };

export type MicroMotionEvent = {
  id: string;
  kind: MicroMotionKind;
  target: MicroMotionTarget;
  amount: number;
  displayText: string;
  symbol?: string;
  tone: MicroMotionTone;
  source: MicroMotionPoint | null;
  createdAt: number;
  durationMs?: number;
  delayMs?: number;
  paletteKey?: string;
};

export type MicroMotionPreferences = {
  enabled: boolean;
  flyoutsEnabled: boolean;
  counterCountingEnabled: boolean;
  paletteReactive: boolean;
  respectReducedMotion: boolean;
  /** 0 Nothing, 1 Static, 2 Animated, 3 High, 4 Uber, 5 Absurd. */
  amplificationLevel: MicroMotionLevel;
  /** Fine adjustment retained for compatibility and future expert controls. */
  intensity: number;
  symbolStyle: 'auto' | 'minimal' | 'burst';
};

export type MicroMotionProfile = {
  level: MicroMotionLevel;
  name: 'Nothing' | 'Static' | 'Animated' | 'High' | 'Uber' | 'Absurd';
  description: string;
  moving: boolean;
  countCounters: boolean;
  particles: number;
  echoes: number;
  maxConcurrent: number;
  durationScale: number;
  glow: number;
  scale: number;
};
