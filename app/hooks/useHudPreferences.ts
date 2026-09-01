'use client';

import { useEffect, useState } from 'react';
import { loadHudPreferences, subscribeHudPreferences, type HudPreferences } from '@/game/systems/hud-preferences';

export function useHudPreferences() {
  const [preferences, setPreferences] = useState<HudPreferences>(() => loadHudPreferences());
  useEffect(() => subscribeHudPreferences(setPreferences), []);
  return preferences;
}
