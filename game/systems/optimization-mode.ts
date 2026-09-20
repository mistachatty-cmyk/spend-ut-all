'use client';

export type OptimizationMode = 'potato' | 'mid' | 'uber';

const OPTIMIZATION_KEY = 'spend-it-all-opt-mode-v1';

export function loadOptimizationMode(): OptimizationMode {
  if (typeof window === 'undefined') return 'uber';
  try {
    const saved = localStorage.getItem(OPTIMIZATION_KEY);
    if (saved === 'potato' || saved === 'mid' || saved === 'uber') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'uber';
}

export function saveOptimizationMode(mode: OptimizationMode): OptimizationMode {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(OPTIMIZATION_KEY, mode);
      applyOptimizationClass(mode);
    } catch {
      // fallback
    }
  }
  return mode;
}

export function applyOptimizationClass(mode: OptimizationMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('mode-potato', 'mode-mid', 'mode-uber');
  root.classList.add(`mode-${mode}`);
}
