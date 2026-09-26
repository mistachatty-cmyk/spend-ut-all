/**
 * GSix hands its site theme to games in the link: `?lok_theme=<id>&lok_palette=<7 hex>`
 * (see @lok/skins `withThemeHandoff` in the Gsixhub repo). Spend It All only recolors
 * itself with it for this browser tab. It never equips or unlocks a customization, and
 * "Use my Spend It All look" drops it straight away.
 */
export interface VisitTheme {
  id: string;
  colors: { bg: string; ink: string; muted: string; accent: string; accentAlt: string; highlight: string; steel: string };
}

export const VISIT_THEME_STORAGE_KEY = "lok.visitTheme.v1";
const ORDER = ["bg", "ink", "muted", "accent", "accentAlt", "highlight", "steel"] as const;

export function parseVisitTheme(search: string): VisitTheme | null {
  const params = new URLSearchParams(search);
  const id = params.get("lok_theme");
  const parts = params.get("lok_palette")?.split("-") ?? [];
  if (!id || !/^[a-z0-9-]{1,40}$/.test(id)) return null;
  if (parts.length !== ORDER.length || !parts.every((part) => /^[0-9a-f]{6}$/i.test(part))) return null;
  const colors = Object.fromEntries(ORDER.map((key, index) => [key, `#${parts[index]!.toLowerCase()}`])) as VisitTheme["colors"];
  return { id, colors };
}

/** CSS custom properties read by app/gsix-visit-theme.css. */
export function visitThemeStyle(theme: VisitTheme): Record<string, string> {
  const { bg, ink, muted, accent, accentAlt, highlight } = theme.colors;
  return {
    "--gsix-bg": bg,
    "--gsix-ink": ink,
    "--gsix-muted": muted,
    "--gsix-accent": accent,
    "--gsix-accent-alt": accentAlt,
    "--gsix-highlight": highlight,
  };
}
