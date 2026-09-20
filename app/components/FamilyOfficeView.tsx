'use client';

import { useState, useEffect } from 'react';
import type { GameState } from '@/game/types';
import {
  loadPrestigeState,
  savePrestigeState,
  calculateRelicsToEarn,
  upgradePrestigePerk,
  executeFamilyOfficeAscension,
  getPerkCost,
  DYNASTY_TITLES,
  type PrestigeState,
  type PrestigePerks,
} from '@/game/systems/prestige';
import { leveragedNetWorth } from '@/game/debt-runtime';
import { getFameTier } from '@/game/systems/fame';
import { playPrestigeSound, playClickSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';
import { money } from '@/game/format';

export function FamilyOfficeView({
  state,
  onAscensionReset,
  onPrestige,
}: {
  state: GameState;
  onAscensionReset?: () => void;
  onPrestige?: () => void;
}) {
  const [prestige, setPrestige] = useState<PrestigeState>(() => loadPrestigeState());
  const [confirmAscend, setConfirmAscend] = useState(false);

  useEffect(() => {
    setPrestige(loadPrestigeState());
  }, []);

  const netWorth = leveragedNetWorth(state);
  const fameTier = getFameTier(state.fame?.points ?? 0);
  const fameRelicMult = 1 + fameTier.level * 0.05;
  const baseRelics = calculateRelicsToEarn(netWorth);
  const potentialRelics = Math.floor(baseRelics * fameRelicMult);
  const dynastyTitleIndex = Math.min(prestige.dynastyLevel, DYNASTY_TITLES.length - 1);
  const dynastyTitle = DYNASTY_TITLES[dynastyTitleIndex];

  const handleUpgrade = (perkKey: keyof PrestigePerks) => {
    const result = upgradePrestigePerk(prestige, perkKey);
    if (result.success) {
      setPrestige(result.state);
      playClickSound();
      emitFloatingNumber('-⚜️ Upgrade', 'relic');
    }
  };

  const handleAscend = () => {
    if (potentialRelics <= 0) return;
    const result = executeFamilyOfficeAscension(prestige, netWorth);
    setPrestige(result.state);
    playPrestigeSound();
    emitFloatingNumber(`+⚜️ ${result.relicsEarned} Relics`, 'relic');
    setConfirmAscend(false);
    if (onAscensionReset) {
      onAscensionReset();
    } else if (onPrestige) {
      onPrestige();
    }
  };

  const perksList: Array<{
    key: keyof PrestigePerks;
    title: string;
    icon: string;
    description: string;
    currentValue: string;
    nextValue: string;
  }> = [
    {
      key: 'gildedHeritage',
      title: 'Gilded Heritage',
      icon: '👑',
      description: 'Increases permanent global cash revenue across all holdings.',
      currentValue: `+${prestige.perks.gildedHeritage * 5}% Revenue`,
      nextValue: `+${(prestige.perks.gildedHeritage + 1) * 5}% Revenue`,
    },
    {
      key: 'trustFund',
      title: 'Trust Fund Seed',
      icon: '🏦',
      description: 'Provides guaranteed starting cash on all future scenario runs.',
      currentValue: `+$${(prestige.perks.trustFund * 15000).toLocaleString()}`,
      nextValue: `+$${((prestige.perks.trustFund + 1) * 15000).toLocaleString()}`,
    },
    {
      key: 'negotiator',
      title: 'Executive Negotiator',
      icon: '🤝',
      description: 'Secures permanent institutional discounts across all marketplace assets.',
      currentValue: `-${prestige.perks.negotiator * 3}% Prices`,
      nextValue: `-${(prestige.perks.negotiator + 1) * 3}% Prices`,
    },
    {
      key: 'masterOfCoin',
      title: 'Master of Coin',
      icon: '◈',
      description: 'Amplifies LOK token yields gained from achievements and milestones.',
      currentValue: `+${prestige.perks.masterOfCoin * 15}% LOK`,
      nextValue: `+${(prestige.perks.masterOfCoin + 1) * 15}% LOK`,
    },
    {
      key: 'endowmentVault',
      title: 'Perpetual Endowment',
      icon: '⏳',
      description: 'Extends maximum offline earnings accumulation window.',
      currentValue: `+${prestige.perks.endowmentVault * 2} hrs offline`,
      nextValue: `+${(prestige.perks.endowmentVault + 1) * 2} hrs offline`,
    },
  ];

  return (
    <section className="family-office-shell panel" style={{ marginTop: '14px', padding: '24px', borderRadius: '20px' }}>
      <header className="family-office-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(127,127,127,0.18)', paddingBottom: '18px' }}>
        <div>
          <span className="eyebrow" style={{ color: '#d97706', fontWeight: 900 }}>GENERATIONAL DYNASTY · FAMILY OFFICE</span>
          <h2 style={{ margin: '4px 0 0', fontSize: '26px' }}>{dynastyTitle}</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>
            Transform empire wealth into permanent generational influence, relic endowments, and cross-run multipliers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '14px', padding: '10px 16px', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d97706' }}>Available Relics</span>
            <b style={{ display: 'block', fontSize: '24px', color: '#b45309' }}>⚜️ {prestige.relics.toLocaleString()}</b>
          </div>
        </div>
      </header>

      {/* Ascension Action Card */}
      <section style={{ margin: '18px 0', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(245, 158, 11, 0.03))', border: '1px solid rgba(217, 119, 6, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏛️</span>
            <b style={{ fontSize: '16px' }}>Found / Expand Family Office</b>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', maxWidth: '600px' }}>
            Current Net Worth: <b>{money(netWorth)}</b>. Banking this wealth into your permanent Dynasty will grant{' '}
            <strong style={{ color: '#b45309' }}>+{potentialRelics} Legacy Relics (⚜️)</strong>.
            {fameTier.level > 0 && (
              <span style={{ display: 'block', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>
                ⭐ Cultural Renown Bonus: +{((fameRelicMult - 1) * 100).toFixed(0)}% Relics from {fameTier.name}
              </span>
            )}
            {potentialRelics <= 0 ? ' (Requires at least $500,000 net worth).' : ''}
          </p>
        </div>

        <div>
          {confirmAscend ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleAscend}
                style={{ background: '#b45309', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
              >
                Confirm (+{potentialRelics} ⚜️)
              </button>
              <button
                type="button"
                onClick={() => setConfirmAscend(false)}
                style={{ background: 'transparent', border: '1px solid #9ca3af', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={potentialRelics <= 0}
              onClick={() => setConfirmAscend(true)}
              style={{
                background: potentialRelics > 0 ? '#b45309' : '#9ca3af',
                color: '#fff',
                border: 'none',
                padding: '11px 20px',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: potentialRelics > 0 ? 'pointer' : 'not-allowed',
                boxShadow: potentialRelics > 0 ? '0 4px 14px rgba(180, 83, 9, 0.25)' : 'none',
              }}
            >
              ⚜️ Bank {potentialRelics > 0 ? `+${potentialRelics} Relics` : 'Relics'}
            </button>
          )}
        </div>
      </section>

      {/* Relic Perks Grid */}
      <h3 style={{ margin: '20px 0 12px', fontSize: '17px' }}>Permanent Dynasty Relic Endowments</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {perksList.map((perk) => {
          const level = prestige.perks[perk.key];
          const cost = getPerkCost(level);
          const maxed = level >= 10;
          const canAfford = prestige.relics >= cost && !maxed;

          return (
            <div
              key={perk.key}
              style={{
                border: '1px solid rgba(127,127,127,0.18)',
                borderRadius: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{perk.icon}</span>
                    <b style={{ fontSize: '15px' }}>{perk.title}</b>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(127,127,127,0.12)', padding: '3px 8px', borderRadius: '999px' }}>
                    Rank {level}/10
                  </span>
                </div>
                <p style={{ margin: '8px 0 6px', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>
                  {perk.description}
                </p>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                  Current: {perk.currentValue}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <small style={{ color: '#6b7280' }}>
                  {maxed ? 'Max rank attained' : `Next: ${perk.nextValue}`}
                </small>
                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => handleUpgrade(perk.key)}
                  style={{
                    border: 'none',
                    borderRadius: '10px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: canAfford ? '#b45309' : 'rgba(127,127,127,0.2)',
                    color: canAfford ? '#fff' : '#9ca3af',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                  }}
                >
                  {maxed ? 'Maxed' : `Upgrade (${cost} ⚜️)`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
