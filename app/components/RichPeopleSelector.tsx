'use client';

import React, { useState } from 'react';
import type { ScenarioId } from '@/game/types';
import {
  PRIME_TITANS,
  OTHER_RICH_PEOPLE,
  type RichPersonProfile,
} from '@/data/rich-people';

interface RichPeopleSelectorProps {
  selectedScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  playClickSound?: () => void;
}

export const RichPeopleSelector: React.FC<RichPeopleSelectorProps> = ({
  selectedScenarioId,
  onSelectScenario,
  playClickSound,
}) => {
  const [subTab, setSubTab] = useState<'all' | 'modern' | 'historic' | 'scale'>('all');

  const filteredOthers = OTHER_RICH_PEOPLE.filter((person) => {
    if (subTab === 'all') return true;
    return person.category === subTab;
  });

  const handleSelect = (id: ScenarioId) => {
    if (playClickSound) playClickSound();
    onSelectScenario(id);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback: string
  ) => {
    const target = e.currentTarget;
    if (target.src !== fallback) {
      target.src = fallback;
    }
  };

  return (
    <div className="rich-people-system" style={{ width: '100%' }}>
      {/* ⚡ THE THREE PRIME TITANS SECTION */}
      <div className="prime-titans-section">
        <div className="prime-titans-header">
          <h3>
            <span>⚡</span> The Three Prime Titans Peak
          </h3>
          <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
            Historic All-Time Monopoly Peaks ($300B – $1 Trillion)
          </span>
        </div>

        <div className="prime-titans-grid">
          {PRIME_TITANS.map((titan) => {
            const isSelected = selectedScenarioId === titan.id;
            const extraClass = titan.id === 'bezos-prime' ? 'bezos' : titan.id === 'gates-prime' ? 'gates' : '';

            return (
              <button
                key={titan.id}
                type="button"
                className={`prime-titan-card ${isSelected ? `selected ${extraClass}` : ''}`}
                onClick={() => handleSelect(titan.id)}
                style={{
                  background: isSelected ? titan.accentGradient : '#ffffff',
                }}
              >
                <div className="prime-titan-banner">
                  <img
                    src={titan.portraitUrl}
                    alt={titan.name}
                    className="prime-titan-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, titan.fallbackSeedUrl)}
                  />
                  <div className="prime-titan-gradient-overlay">
                    <span
                      className="prime-badge-tag"
                      style={{ backgroundColor: titan.badgeColor }}
                    >
                      {titan.badge}
                    </span>
                    {isSelected && (
                      <span className="prime-selected-badge">
                        ✓ SELECTED
                      </span>
                    )}
                  </div>
                </div>

                <div className="prime-titan-body">
                  <div className="prime-titan-name-row">
                    <h4>{titan.name}</h4>
                    <span className="prime-titan-moniker">{titan.moniker}</span>
                  </div>

                  <div className="prime-titan-cash">{titan.fortuneFormatted}</div>

                  <p className="prime-titan-desc">{titan.description}</p>

                  <div className="prime-titan-asset-pill">
                    <span>✨</span>
                    <span>{titan.signatureAsset}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 👑 SUB-MENU FOR OTHER RICH PEOPLE */}
      <div className="other-rich-section">
        <div className="other-rich-header">
          <h3>
            <span>👑</span> Other Rich People & Historic Fortunes
          </h3>

          <div className="other-rich-subtabs">
            <button
              type="button"
              className={`other-rich-tab-btn ${subTab === 'all' ? 'selected' : ''}`}
              onClick={() => {
                if (playClickSound) playClickSound();
                setSubTab('all');
              }}
            >
              All Others ({OTHER_RICH_PEOPLE.length})
            </button>
            <button
              type="button"
              className={`other-rich-tab-btn ${subTab === 'modern' ? 'selected' : ''}`}
              onClick={() => {
                if (playClickSound) playClickSound();
                setSubTab('modern');
              }}
            >
              💎 Modern Tycoons (8)
            </button>
            <button
              type="button"
              className={`other-rich-tab-btn ${subTab === 'historic' ? 'selected' : ''}`}
              onClick={() => {
                if (playClickSound) playClickSound();
                setSubTab('historic');
              }}
            >
              🏛️ Historic Legends (2)
            </button>
            <button
              type="button"
              className={`other-rich-tab-btn ${subTab === 'scale' ? 'selected' : ''}`}
              onClick={() => {
                if (playClickSound) playClickSound();
                setSubTab('scale');
              }}
            >
              🌌 Wealth Sandboxes (2)
            </button>
          </div>
        </div>

        <div className="other-rich-grid">
          {filteredOthers.map((person) => {
            const isSelected = selectedScenarioId === person.id;

            return (
              <button
                key={person.id}
                type="button"
                className={`other-rich-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(person.id)}
              >
                <div className="other-rich-avatar-wrap">
                  <img
                    src={person.portraitUrl}
                    alt={person.name}
                    className="other-rich-avatar-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, person.fallbackSeedUrl)}
                  />
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        background: '#10b981',
                        color: '#fff',
                        borderRadius: '999px',
                        fontSize: '9px',
                        padding: '1px 4px',
                        fontWeight: 900,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div className="other-rich-body">
                  <div className="other-rich-name-row">
                    <strong>{person.name}</strong>
                    <span
                      className="other-rich-badge"
                      style={{
                        backgroundColor: `${person.badgeColor}15`,
                        color: person.badgeColor,
                        border: `1px solid ${person.badgeColor}40`,
                      }}
                    >
                      {person.badge}
                    </span>
                  </div>

                  <div className="other-rich-cash">{person.fortuneFormatted}</div>
                  <div className="other-rich-desc">{person.description}</div>

                  <div className="other-rich-asset-tag">
                    🏷️ {person.signatureAsset}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
