'use client';

import { useEffect } from 'react';
import type { PurchaseVisualItem } from '@/data/purchase-visuals';
import { PURCHASE_TIER_CONFIG } from '@/data/purchase-visuals';

interface ItemPhotoModalProps {
  visual: PurchaseVisualItem | null;
  onClose: () => void;
}

export function ItemPhotoModal({ visual, onClose }: ItemPhotoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!visual) return null;

  const tierInfo = PURCHASE_TIER_CONFIG[visual.tier];

  return (
    <div
      className="visual-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-title"
    >
      <div className="visual-modal-dialog">
        <div className="visual-modal-hero">
          <button
            type="button"
            className="visual-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
          <img
            src={visual.imageUrl}
            alt={visual.name}
            className="visual-modal-img"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to deterministic seed mirror if primary image encounters network restriction
              const img = e.currentTarget;
              if (img.src !== visual.fallbackSeedUrl) {
                img.src = visual.fallbackSeedUrl;
              }
            }}
          />
          <div className="visual-modal-badge-overlay">
            <span
              className={`item-photo-tier-badge tier-${visual.tier}`}
              style={{ background: tierInfo.color }}
            >
              {visual.badge}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'rgba(0,0,0,0.6)',
                padding: '2.5px 8px',
                borderRadius: '9999px',
                backdropFilter: 'blur(4px)',
              }}
            >
              {tierInfo.name}
            </span>
          </div>
        </div>

        <div className="visual-modal-content">
          <div className="visual-modal-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <h2 id="asset-title">{visual.name}</h2>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: tierInfo.color,
                  textTransform: 'uppercase',
                }}
              >
                Tier {visual.tier} of 5
              </span>
            </div>
            <div className="escalation-ladder">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`escalation-step ${step <= visual.tier ? `active-${step}` : ''}`}
                />
              ))}
            </div>
            <p style={{ marginTop: '8px' }}>{visual.caption}</p>
          </div>

          {Object.keys(visual.specs).length > 0 && (
            <div className="visual-modal-specs-grid">
              {Object.entries(visual.specs).map(([label, value]) => (
                <div className="visual-spec-item" key={label}>
                  <span>{label.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          )}

          {visual.highlights && visual.highlights.length > 0 && (
            <div className="visual-modal-highlights">
              <h4>Luxury Features & Specifications</h4>
              <ul>
                {visual.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="visual-modal-license-bar">
            <div>
              <span>Photo by <b>{visual.photographer}</b></span>
              <span style={{ margin: '0 6px', color: '#94a3b8' }}>•</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>{visual.source}</span>
            </div>
            <a
              href={visual.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
            >
              Inspect Source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
