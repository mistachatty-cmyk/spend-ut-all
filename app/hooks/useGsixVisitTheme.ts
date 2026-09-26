"use client";

import { useSyncExternalStore } from "react";
import { parseVisitTheme, VISIT_THEME_STORAGE_KEY, type VisitTheme } from "@/game/systems/gsixVisitTheme";

let current: VisitTheme | null | undefined;
const listeners = new Set<() => void>();

function read(): VisitTheme | null {
  if (current !== undefined) return current;
  current = null;
  try {
    const fromUrl = parseVisitTheme(window.location.search);
    if (fromUrl) {
      // The URL keeps the params until dismissal: Next's router restores the original
      // URL while hydrating, so stripping them here doesn't stick.
      sessionStorage.setItem(VISIT_THEME_STORAGE_KEY, JSON.stringify(fromUrl));
      current = fromUrl;
    } else {
      const stored = JSON.parse(sessionStorage.getItem(VISIT_THEME_STORAGE_KEY) ?? "null") as VisitTheme | null;
      current = stored?.id && stored.colors ? stored : null;
    }
  } catch {
    // Blocked storage: keep the player's own look.
  }
  return current;
}

export function dismissGsixVisitTheme() {
  current = null;
  try { sessionStorage.removeItem(VISIT_THEME_STORAGE_KEY); } catch { /* nothing stored */ }
  // Drop the handoff from the address bar too, or a reload would bring the theme back.
  const url = new URL(window.location.href);
  if (url.searchParams.has("lok_theme") || url.searchParams.has("lok_palette")) {
    url.searchParams.delete("lok_theme");
    url.searchParams.delete("lok_palette");
    window.history.replaceState(window.history.state, "", url);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** The GSix theme for this tab, or null. Null during server render, so hydration matches. */
export function useGsixVisitTheme(): VisitTheme | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
