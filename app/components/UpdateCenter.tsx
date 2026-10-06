'use client';

/**
 * Persistent "what's new" entry point, mounted once in `app/layout.tsx` so
 * it shows on every page regardless of run state -- the Spend It All
 * counterpart to 616 Survivor's Hub footer + `UpdatePopup`. Two ways in:
 *
 * 1. Automatic: the first time this browser loads the app after
 *    `CURRENT_VERSION` (see `data/changelog.ts`) moves past the
 *    locally-remembered `lastSeenChangelogVersion`, the popup opens on its
 *    own showing just the unseen entries. Dismissing it marks the current
 *    version seen, so it won't reappear until the next real update ships.
 * 2. Manual: the small footer link at the bottom of every page opens the
 *    same popup on demand, showing the *full* history regardless of what's
 *    already been seen.
 *
 * `lastSeenChangelogVersion` lives in its own tiny localStorage key,
 * independent of the game's save/meta blobs -- see `useLokAccount.ts` for
 * the same "own slice of storage" pattern used elsewhere in this repo.
 */
import { useEffect, useState } from 'react';
import { CHANGELOG, CURRENT_VERSION, changelogEntriesSince, updateNumber, type ChangelogEntry } from '@/data/changelog';

const SEEN_KEY = 'spend-it-all-changelog-seen-v1';

function readLastSeen(): string {
  try {
    return localStorage.getItem(SEEN_KEY) ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, CURRENT_VERSION);
  } catch {
    // Private-browsing/storage-blocked: the popup will just show again next visit.
  }
}

export function UpdateCenter() {
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    const seen = readLastSeen();
    setLastSeen(seen);
    const unseen = changelogEntriesSince(seen);
    if (unseen.length > 0) {
      setEntries(unseen);
      setMode('auto');
      setOpen(true);
    }
  }, []);

  const close = () => {
    markSeen();
    setLastSeen(CURRENT_VERSION);
    setOpen(false);
  };

  const openFullHistory = () => {
    setEntries([...CHANGELOG].reverse());
    setMode('manual');
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openFullHistory}
        className="update-footer-link"
        data-testid="button-open-updates"
        aria-label={`Version ${CURRENT_VERSION}, see what's new`}
      >
        📣 v{CURRENT_VERSION} · {CHANGELOG.length} updates — see what&apos;s new
      </button>

      {open && lastSeen !== null && (
        <div className="update-popup-backdrop" role="dialog" aria-modal="true" aria-label="Game update">
          <div className="update-popup panel">
            <button type="button" onClick={close} className="update-popup-close" aria-label="Dismiss update notice">
              ✕
            </button>
            <div className="update-popup-header">
              <span className="eyebrow">{mode === 'manual' ? 'Update History' : 'Game Updated!'}</span>
              <b>Now on v{CURRENT_VERSION} · Update #{updateNumber(CHANGELOG[CHANGELOG.length - 1]!)}</b>
            </div>
            <div className="update-popup-entries">
              {entries.map((entry) => (
                <div key={entry.version} className={`update-popup-entry ${entry.kind === 'hotfix' ? 'hotfix' : ''}`}>
                  <div className="update-popup-entry-meta">
                    <span className="update-popup-badge">{entry.kind === 'hotfix' ? 'Hotfix' : 'Update'} #{updateNumber(entry)}</span>
                    <small>v{entry.version} · {entry.date}</small>
                  </div>
                  <h3>{entry.title}</h3>
                  <ul>
                    {entry.body.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <button type="button" onClick={close} className="primary update-popup-ack">Let&apos;s Go</button>
          </div>
        </div>
      )}
    </>
  );
}
