export type MicroMotionTarget = 'cash' | 'lok' | 'card-credits' | 'debt' | 'reward';
export type MicroMotionTone = 'positive' | 'negative' | 'debt' | 'reward' | 'neutral';
export type MicroMotionKind = 'currency' | 'debt' | 'card' | 'purchase' | 'reward' | 'system';

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
  intensity: number;
  symbolStyle: 'auto' | 'minimal' | 'burst';
};
