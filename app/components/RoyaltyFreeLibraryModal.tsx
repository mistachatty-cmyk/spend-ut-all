'use client';

import { useEffect } from 'react';
import type { HudPreferences } from '@/game/systems/hud-preferences';

interface RoyaltyFreeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hudPrefs: HudPreferences;
  onUpdateHudPrefs: (patch: Partial<HudPreferences>) => void;
}

export function RoyaltyFreeLibraryModal({
  isOpen,
  onClose,
  hudPrefs,
  onUpdateHudPrefs,
}: RoyaltyFreeLibraryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="visual-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-info-title"
    >
      <div className="visual-modal-dialog" style={{ maxWidth: '620px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: '#059669' }}>OPEN ASSET ARCHITECTURE</span>
            <h2 id="library-info-title" style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
              Royalty-Free & Free-for-Profit Visuals Mode
            </h2>
          </div>
          <button
            type="button"
            className="visual-modal-close-btn"
            style={{ position: 'static', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ padding: '14px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <b style={{ color: '#065f46', fontSize: '13.5px' }}>✓ 100% Free For Commercial Use & Royalty-Free</b>
            <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#047857', lineHeight: 1.5 }}>
              All purchase cards, estates, superyachts, and megaprojects utilize imagery from open, royalty-free libraries and public domain repositories that grant irrevocable, worldwide licenses for commercial redistribution.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', textTransform: 'uppercase', color: '#475569', letterSpacing: '0.04em' }}>
              Recommended Repositories & Methods Used:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>1. Unsplash Public Library</b>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  Under the Unsplash License, photos are free to download and use for commercial and non-commercial purposes with no royalties.
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>2. Wikimedia Commons & CC0</b>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  Public Domain CC0 assets from NASA, CDC, and European Heritage archives for spaceflight, cultural masterworks, and mega-infrastructure.
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>3. Deterministic Picsum Mirrors</b>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  High-uptime CDN fallback mirrors using stable seeds and direct image headers to ensure zero broken image placeholders.
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>4. 5-Tier Escalation Hierarchy</b>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
                  As purchases climb in price from Coffee ($6) to Megayachts ($180M) and Moon Colonies ($18T), visual complexity and prestige escalate dramatically.
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#334155' }}>
              Visual Mode Toggle Settings
            </span>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>Show Rich Photo Cards (Default: ON)</b>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Renders high-res photography banners, tier badges, and inspectable specs for every purchasable asset.
                </div>
              </div>
              <input
                type="checkbox"
                checked={hudPrefs.showItemPhotos}
                onChange={(e) => onUpdateHudPrefs({ showItemPhotos: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>Tier Escalation Borders & Badges (Default: ON)</b>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Colors card borders according to wealth tier (Green → Cyan → Purple → Amber → Pink).
                </div>
              </div>
              <input
                type="checkbox"
                checked={hudPrefs.itemPhotoEscalation}
                onChange={(e) => onUpdateHudPrefs({ itemPhotoEscalation: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
          <button
            type="button"
            className="primary"
            onClick={onClose}
            style={{ padding: '8px 20px', borderRadius: '8px', fontWeight: 700 }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
