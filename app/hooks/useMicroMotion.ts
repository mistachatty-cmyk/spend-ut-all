'use client';

import { useEffect, useRef, useState } from 'react';
import type { MicroMotionPreferences } from '@/game/micro-animation-types';
import { loadMicroMotionPreferences, microMotionProfile, subscribeMicroMotionPreferences } from '@/game/systems/micro-animations';

export function useMicroMotionPreferences() {
  const [prefs, setPrefs] = useState<MicroMotionPreferences>(() => loadMicroMotionPreferences());
  useEffect(() => subscribeMicroMotionPreferences(setPrefs), []);
  return prefs;
}

export function useCountedNumber(value: number, durationMs = 520) {
  const prefs = useMicroMotionPreferences();
  const [display, setDisplay] = useState(value);
  const previousRef = useRef(value);

  useEffect(() => {
    const profile = microMotionProfile(prefs.amplificationLevel);
    const reduced = prefs.respectReducedMotion && typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!prefs.enabled || !prefs.counterCountingEnabled || !profile.countCounters || reduced) {
      previousRef.current = value;
      setDisplay(value);
      return;
    }
    const from = previousRef.current;
    const delta = value - from;
    previousRef.current = value;
    if (!Number.isFinite(delta) || Math.abs(delta) < .0001) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const duration = Math.max(120, durationMs * profile.durationScale / Math.max(.25, prefs.intensity));
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, prefs.enabled, prefs.counterCountingEnabled, prefs.respectReducedMotion, prefs.intensity, prefs.amplificationLevel]);

  return display;
}
