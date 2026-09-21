'use client';

import React, { useState } from 'react';
import {
  getAllReligions,
  getReligionDefinition,
  ReligionDefinition,
  ReligionId,
} from '@/game/systems/religion';

interface ReligionFrontPageSectionProps {
  selectedReligionId: ReligionId | null;
  onSelectReligion: (id: ReligionId | null) => void;
  customPrayerTimes: Record<string, string>;
  onUpdatePrayerTime: (prayerId: string, time: string) => void;
  playClickSound: () => void;
}

export function ReligionFrontPageSection({
  selectedReligionId,
  onSelectReligion,
  customPrayerTimes,
  onUpdatePrayerTime,
  playClickSound,
}: ReligionFrontPageSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [detailModalReligion, setDetailModalReligion] = useState<ReligionDefinition | null>(null);
  const religions = getAllReligions();

  const handleToggleEnable = () => {
    playClickSound();
    if (selectedReligionId) {
      onSelectReligion(null);
      setExpanded(false);
    } else {
      onSelectReligion('christianity');
      setExpanded(false);
    }
  };

  const currentDef = selectedReligionId ? getReligionDefinition(selectedReligionId) : null;

  return (
    <section className="religion-frontpage-card">
      <div className="religion-header-row">
        <div className="religion-title-col">
          <div className="religion-badge">
            <span>🕊️ FAITH & SPIRITUAL OBSERVANCE PATHWAY</span>
          </div>
          <h2 style={{ margin: '6px 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            Spiritual Rhythms, Moral Desires & Daily Prayers
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            Integrate authentic spiritual grounding with your financial empire. When enabled, your match
            includes a dedicated <b>Religion Panel</b> with your tradition’s sacred texts, needed moral desires
            (charity, honest labor, contentment), and daily prayer schedules that notify you at your decided times.
          </p>
        </div>

        <div className="religion-toggle-container">
          <button
            type="button"
            className={selectedReligionId ? 'religion-enable-btn active' : 'religion-enable-btn'}
            onClick={handleToggleEnable}
            aria-pressed={Boolean(selectedReligionId)}
          >
            {selectedReligionId ? '✓ Faith Pathway Active' : '+ Enable Faith Pathway'}
          </button>
        </div>
      </div>

      {selectedReligionId ? (
        <button type="button" className="religion-expansion-bar" aria-expanded={expanded} aria-controls="religion-setup-scroll" onClick={() => { playClickSound(); setExpanded((value) => !value); }}>
          <span><b>{currentDef?.emblem} {currentDef?.name}</b><small>Choose tradition, teachings, and prayer times</small></span>
          <strong>{expanded ? 'Collapse ▲' : 'Open faith setup ▼'}</strong>
        </button>
      ) : null}

      {selectedReligionId && expanded ? (
        <div className="religion-expanded-body religion-setup-scroll" id="religion-setup-scroll">
          <div className="religion-selection-header">
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Your Mainstay Religion or Tradition
            </span>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              Active: {currentDef?.emblem} {currentDef?.name}
            </span>
          </div>

          <div className="religion-grid">
            {religions.map((rel) => {
              const isSelected = selectedReligionId === rel.id;
              return (
                <div
                  key={rel.id}
                  className={`religion-card-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    playClickSound();
                    onSelectReligion(rel.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      playClickSound();
                      onSelectReligion(rel.id);
                    }
                  }}
                >
                  <div className="religion-card-top">
                    <span className="religion-emblem">{rel.emblem}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                        {rel.name}
                      </strong>
                      <small style={{ fontSize: '11px', color: '#64748b' }}>{rel.tradition}</small>
                    </div>
                    {isSelected && <span className="religion-selected-pill">Active</span>}
                  </div>

                  <p className="religion-tagline">{rel.tagline}</p>

                  <div className="religion-card-footer">
                    <span className="religion-text-name">📖 {rel.sacredTextName}</span>
                    <button
                      type="button"
                      className="religion-preview-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        setDetailModalReligion(rel);
                      }}
                    >
                      Read Teachings ▾
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {currentDef && (
            <div className="religion-current-summary">
              <div className="religion-summary-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{currentDef.emblem}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 800 }}>
                      {currentDef.name} — Spiritual Pathway Overview
                    </h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{currentDef.sacredTextName}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="religion-secondary-btn"
                  onClick={() => setDetailModalReligion(currentDef)}
                >
                  Full Doctrine & Study Archive
                </button>
              </div>

              <div className="religion-summary-text">
                <p>
                  <b>Teachings on Wealth & Purpose:</b> {currentDef.teachingsOnWealth}
                </p>
                <p>
                  <b>Core Spiritual Desires:</b> {currentDef.coreDesiresSummary}
                </p>
              </div>

              {/* Scheduled Prayers preview and customizable times */}
              <div className="religion-schedule-preview">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                    ⏰ Scheduled Daily Prayers & Notification Times:
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    (You can customize your decided alert times anytime)
                  </span>
                </div>

                <div className="religion-prayer-times-row">
                  {currentDef.defaultPrayers.map((prayer) => {
                    const scheduled = customPrayerTimes[prayer.id] || prayer.standardTime;
                    return (
                      <div key={prayer.id} className="prayer-time-chip">
                        <span className="prayer-name">{prayer.name}</span>
                        <div className="prayer-time-input-wrap">
                          <input
                            type="time"
                            value={scheduled}
                            aria-label={`Notification time for ${prayer.name}`}
                            onChange={(e) => {
                              onUpdatePrayerTime(prayer.id, e.target.value);
                            }}
                            className="prayer-time-input"
                          />
                        </div>
                        <small className="prayer-window">{prayer.windowLabel}</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="religion-preview-inactive">
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            Enable the optional pathway above. Its tradition and prayer settings stay collapsed until you open the setup bar.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalReligion && (
        <div className="religion-modal-backdrop" onClick={() => setDetailModalReligion(null)}>
          <div className="religion-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="religion-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{detailModalReligion.emblem}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                    {detailModalReligion.name} — Faith & Economic Ethics
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {detailModalReligion.sacredTextName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="religion-modal-close"
                onClick={() => setDetailModalReligion(null)}
              >
                ✕
              </button>
            </div>

            <div className="religion-modal-body">
              <div className="modal-section">
                <h4>Tradition & Heritage</h4>
                <p>{detailModalReligion.frontPageExplanation}</p>
              </div>

              <div className="modal-section">
                <h4>Teachings on Wealth, Commerce & Stewardship</h4>
                <p>{detailModalReligion.teachingsOnWealth}</p>
              </div>

              <div className="modal-section">
                <h4>Spiritual Desires & Pillars</h4>
                <p>{detailModalReligion.coreDesiresSummary}</p>
              </div>

              <div className="modal-section">
                <h4>Canonical Daily Prayers</h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {detailModalReligion.defaultPrayers.map((p) => (
                    <div key={p.id} className="modal-prayer-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>{p.name} {p.arabicOrNativeName ? `(${p.arabicOrNativeName})` : ''}</strong>
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Standard: {p.standardTime}</span>
                      </div>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>
                        &ldquo;{p.scriptureText}&rdquo;
                      </p>
                      <small style={{ color: '#64748b', fontSize: '11px' }}>{p.guidance}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4>Reputable Scholarly Study Archives</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155' }}>
                  {detailModalReligion.reputableStudyLinks.map((link) => (
                    <li key={link.id} style={{ marginBottom: '6px' }}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>
                        {link.name} ↗
                      </a>
                      {' — '}{link.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="religion-modal-footer">
              <button
                type="button"
                className="religion-modal-select-btn"
                onClick={() => {
                  playClickSound();
                  onSelectReligion(detailModalReligion.id);
                  setDetailModalReligion(null);
                }}
              >
                Select {detailModalReligion.name} for Match
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
