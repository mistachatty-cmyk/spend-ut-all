// Floating Number Particles System

export interface FloatingNumberItem {
  id: string;
  text: string;
  type: 'income' | 'expense' | 'lok' | 'card' | 'relic';
  x?: number;
  y?: number;
  createdAt: number;
}

type FloaterListener = (item: FloatingNumberItem) => void;
const listeners = new Set<FloaterListener>();

let enabled = true;
if (typeof window !== 'undefined') {
  const raw = localStorage.getItem('sia_floaters_enabled');
  if (raw !== null) {
    enabled = raw === 'true';
  }
}

export function isFloatersEnabled(): boolean {
  return enabled;
}

export function setFloatersEnabled(val: boolean): boolean {
  enabled = val;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sia_floaters_enabled', String(val));
  }
  return enabled;
}

export interface EmitFloatingOptions {
  text: string;
  type?: FloatingNumberItem['type'];
  x?: number;
  y?: number;
  color?: string;
}

export function emitFloatingNumber(
  optionsOrText: string | EmitFloatingOptions,
  type: FloatingNumberItem['type'] = 'income',
  x?: number,
  y?: number
) {
  if (!enabled) return;
  const isObj = typeof optionsOrText === 'object' && optionsOrText !== null;
  const rawText = isObj ? optionsOrText.text : optionsOrText;
  const floaterType = isObj ? (optionsOrText.type ?? (optionsOrText.text.startsWith('-') ? 'expense' : 'income')) : type;
  const posX = isObj ? optionsOrText.x : x;
  const posY = isObj ? optionsOrText.y : y;

  const item: FloatingNumberItem = {
    id: `float-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    text: rawText,
    type: floaterType,
    x: posX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 + (Math.random() * 80 - 40) : 0),
    y: posY ?? (typeof window !== 'undefined' ? 140 + (Math.random() * 30 - 15) : 0),
    createdAt: Date.now(),
  };

  for (const listener of listeners) {
    try {
      listener(item);
    } catch {
      // Ignore listener error
    }
  }
}

export function subscribeFloatingNumbers(listener: FloaterListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
