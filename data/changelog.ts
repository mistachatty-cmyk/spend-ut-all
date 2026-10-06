/**
 * Patch notes, shown as a one-time popup (see `app/components/UpdatePopup.tsx`)
 * the first time a player loads the app after `CURRENT_VERSION` moves past
 * their locally-remembered `lastSeenChangelogVersion`, and as a running
 * history behind the persistent footer link on every page (see
 * `app/components/UpdateFooter.tsx`). Modeled on 616 Survivor's changelog
 * (`data/changelog.ts` in that repo) -- same shape, same rule, so the LOK
 * ecosystem's games stay consistent for anyone working across both.
 *
 * Versions are plain `MAJOR.MINOR.PATCH` strings, oldest entry first. Bump
 * MINOR for a real update (new content/systems), PATCH for a hotfix
 * (bug-only), and just append a new entry -- `CURRENT_VERSION` and the
 * "Update #" counter both derive from this array, nothing else to update.
 *
 * Appending an entry here is part of shipping any player-visible change,
 * the same way running the typecheck is -- not an optional chore, and that
 * applies to every AI agent or contributor touching this repo. See 616
 * Survivor's `.agents/memory/update-popup-footer-2026-09-26.md` for what
 * happens when the popup/footer mount itself gets silently dropped by an
 * unrelated edit: don't let `app/layout.tsx`'s `<UpdateFooter />` /
 * `<UpdatePopup />` mounts get edited away the same way.
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  kind: 'update' | 'hotfix';
  title: string;
  body: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-09-26',
    kind: 'update',
    title: 'Patch Notes Start Here',
    body: [
      "Spend It All didn't have a running changelog before now -- this is the first tracked version. Everything already live (Marketplace, Businesses, Empire, Town & Community, Card Deck/LOKDEX, Daily Rewards, Faith & Sanctuary, Prestige, Debt & Court, Achievements, Collection, Leaderboard, Customize, and Settings) stays exactly as it was.",
      'Going forward, every real update or hotfix gets an entry here.',
    ],
  },
  {
    version: '1.0.1',
    date: '2026-09-26',
    kind: 'hotfix',
    title: "Settings & Debt Tabs Back Where They Belong",
    body: [
      "Fixed the mobile nav bar: it was rendering tab icons/labels off fixed screen position instead of the real tab, left over from before Town & Community, Daily Rewards, Faith & Sanctuary and Prestige were added. That mislabeled the Debt & Court and Settings tabs on phones, and pushed Achievements, Collection, Leaderboard, Customize and the real Settings tab off-screen entirely.",
      "Every tab now shows its own real name and works on any screen size, and can't drift out of sync again the same way.",
    ],
  },
  {
    version: '1.1.0',
    date: '2026-09-26',
    kind: 'update',
    title: 'A Proper Update Board',
    body: [
      "Added a persistent \"what's new\" link at the bottom of every page, and a one-time popup that shows what changed the next time you load the game after an update -- same pattern as 616 Survivor, so it feels consistent across LOK games.",
    ],
  },
];

export const CURRENT_VERSION = CHANGELOG[CHANGELOG.length - 1]!.version;

export function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i += 1) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function isVersionNewer(a: string, b: string): boolean {
  return compareVersions(a, b) > 0;
}

/** Entries strictly newer than `version`, oldest-of-the-unseen first. */
export function changelogEntriesSince(version: string): ChangelogEntry[] {
  return CHANGELOG.filter((entry) => isVersionNewer(entry.version, version));
}

/** 1-based "Update #N" position in ship order. */
export function updateNumber(entry: ChangelogEntry): number {
  return CHANGELOG.indexOf(entry) + 1;
}
