'use client';

import { useState } from 'react';
import type { GameState } from '@/game/types';
import {
  FAME_TIERS,
  PR_ACTIONS,
  MAGAZINE_COVERS,
  CELEBRITY_IMMIGRANTS,
  FORBES_TITANS,
  getFameTier,
  getNextFameTier,
  calculateForbesRank,
  normalizeFameState,
} from '@/game/systems/fame';
import { executePRAction } from '@/game/fame-actions';
import { playClickSound, playPurchaseSound, playPrestigeSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';
import { money } from '@/game/format';
import { netWorth } from '@/game/engine';
import { getRichPersonProfile } from '@/data/rich-people';
import { computeForbesStandings, normalizeForbesListState, FORBES_RIVALS } from '@/game/systems/forbes-list';

const FORBES_RIVALS_COUNT = FORBES_RIVALS.length;
import { setForbesListSystemEnabled } from '@/game/forbes-actions';

export function FameView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [activeTab, setActiveTab] = useState<'pr' | 'forbes' | 'magazines' | 'celebrities'>('pr');
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const fame = normalizeFameState(state.fame);
  const currentTier = getFameTier(fame.points);
  const nextTier = getNextFameTier(fame.points);

  const playerNetWorth = netWorth(state);
  const forbes = calculateForbesRank(playerNetWorth, fame.points);
  const richProfileForbes = getRichPersonProfile(state.scenarioId);
  const forbesList = normalizeForbesListState(state.forbesList);
  const forbesDisplayRank = forbesList.enabled ? forbesList.playerRank : forbes.rank;
  const liveStandings = forbesList.enabled
    ? computeForbesStandings(forbesList, playerNetWorth, richProfileForbes ? richProfileForbes.name : 'You')
    : null;

  const handleToggleForbesList = (enabled: boolean) => {
    setState((curr) => (curr ? setForbesListSystemEnabled(curr, enabled) : curr));
    playClickSound();
  };

  const tierProgress = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((fame.points - currentTier.minPoints) /
            (nextTier.minPoints - currentTier.minPoints)) *
            100,
        ),
      )
    : 100;

  const handleLaunchPR = (actionId: string, e: React.MouseEvent) => {
    setState((curr) => {
      if (!curr) return curr;
      const result = executePRAction(curr, actionId);
      if (result.success) {
        playPurchaseSound();
        setLastMessage(result.message);
        emitFloatingNumber({
          text: `+⭐ ${PR_ACTIONS.find((a) => a.id === actionId)?.fameReward ?? 0} Fame`,
          x: e.clientX,
          y: e.clientY,
          color: '#d97706',
        });
      } else {
        playClickSound();
        setLastMessage(result.message);
      }
      return result.state;
    });
  };

  // Compile Forbes Leaderboard including player
  const leaderboardList = [...FORBES_TITANS];
  const richProfile = getRichPersonProfile(state.scenarioId);
  const playerTitan = {
    rank: forbes.rank,
    name: richProfile ? `${richProfile.name.toUpperCase()} (YOU)` : `${state.scenarioId.toUpperCase()} (YOU)`,
    netWorth: playerNetWorth,
    famePoints: fame.points,
    title: `${currentTier.title} · ${currentTier.name}`,
    emoji: richProfile ? richProfile.badge.split(' ')[0] : currentTier.emoji,
    isPlayer: true,
  };

  const fullList = [...leaderboardList.map((t) => ({ ...t, isPlayer: false })), playerTitan]
    .sort((a, b) => b.netWorth - a.netWorth)
    .map((entry, idx) => ({ ...entry, displayRank: idx + 1 }));

  return (
    <div className="fame-shell">
      {/* Fame Hero Header */}
      <section className="fame-hero">
        <div className="fame-hero-info">
          <span className="eyebrow">PUBLIC RENOWN & CULTURAL INFLUENCE</span>
          <h2>
            <span>{currentTier.emoji}</span> {currentTier.name}
          </h2>
          <p>{currentTier.perkDescription}</p>
          <div className="fame-progress-bar-wrap">
            <div
              className="fame-progress-bar-fill"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
          <small style={{ color: '#b45309', fontWeight: 600, display: 'block', marginTop: 4 }}>
            {nextTier
              ? `${Math.floor(fame.points).toLocaleString()} / ${nextTier.minPoints.toLocaleString()} Fame Points (${Math.round(tierProgress)}%) to reach ${nextTier.name}`
              : '🌟 Maximum Civilization Renown Achieved!'}
          </small>
        </div>

        <div className="fame-hero-stats">
          <div className="fame-stat-box">
            <span>FAME POINTS</span>
            <b>⭐ {Math.floor(fame.points).toLocaleString()}</b>
          </div>
          <div className="fame-stat-box">
            <span>FORBES RANK</span>
            <b style={{ color: '#059669' }}>#{forbesDisplayRank}</b>
          </div>
          <div className="fame-stat-box">
            <span>REVENUE BOOST</span>
            <b>+{(currentTier.incomeBonusPct * 100).toFixed(0)}%</b>
          </div>
          <div className="fame-stat-box">
            <span>MIGRATION BOOST</span>
            <b>+{(currentTier.immigrationBonusPct * 100).toFixed(0)}%</b>
          </div>
        </div>
      </section>

      {lastMessage ? (
        <div
          style={{
            padding: '12px 18px',
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            color: '#065f46',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{lastMessage}</span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#065f46',
              fontWeight: 700,
            }}
            onClick={() => setLastMessage(null)}
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* Navigation Sub-Tabs */}
      <nav className="fame-tabs">
        <button
          className={activeTab === 'pr' ? 'active' : ''}
          onClick={() => {
            playClickSound();
            setActiveTab('pr');
          }}
        >
          📢 PR & Media Stunts
        </button>
        <button
          className={activeTab === 'forbes' ? 'active' : ''}
          onClick={() => {
            playClickSound();
            setActiveTab('forbes');
          }}
        >
          🏆 Forbes Titan Leaderboard (#{forbesDisplayRank})
        </button>
        <button
          className={activeTab === 'magazines' ? 'active' : ''}
          onClick={() => {
            playClickSound();
            setActiveTab('magazines');
          }}
        >
          📰 Magazine Covers ({fame.unlockedCovers.length}/{MAGAZINE_COVERS.length})
        </button>
        <button
          className={activeTab === 'celebrities' ? 'active' : ''}
          onClick={() => {
            playClickSound();
            setActiveTab('celebrities');
          }}
        >
          🌟 Celebrity Immigrants ({fame.celebrityResidents.length}/{CELEBRITY_IMMIGRANTS.length})
        </button>
      </nav>

      {/* Tab 1: PR Stunts */}
      {activeTab === 'pr' ? (
        <section className="pr-grid">
          {PR_ACTIONS.map((action) => {
            const lastUsed = fame.prCooldowns[action.id] ?? 0;
            const cooldownRemaining = Math.max(
              0,
              Math.ceil((action.cooldownMs - (Date.now() - lastUsed)) / 1000),
            );
            const isUnlocked = currentTier.level >= action.minTier;
            const canAfford = state.cash >= action.cost;
            const ready = isUnlocked && canAfford && cooldownRemaining === 0;

            return (
              <article className="pr-card" key={action.id}>
                <div className="pr-header">
                  <div className="pr-icon">{action.emoji}</div>
                  <div>
                    <h3>{action.name}</h3>
                    <p>{action.description}</p>
                  </div>
                </div>

                <div className="pr-meta">
                  <div>
                    <span>Cost: {money(action.cost)}</span>
                    <br />
                    <small>Requires Tier {action.minTier}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#d97706' }}>+⭐ {action.fameReward} Fame</span>
                    <br />
                    <small style={{ color: '#059669' }}>+{action.townGoodwillReward}% Town Goodwill</small>
                  </div>
                </div>

                <button
                  className="pr-actions-btn"
                  disabled={!ready}
                  onClick={(e) => handleLaunchPR(action.id, e)}
                >
                  {!isUnlocked
                    ? `Locked (Reach Tier ${action.minTier})`
                    : cooldownRemaining > 0
                      ? `Cooldown (${cooldownRemaining}s)`
                      : !canAfford
                        ? 'Insufficient Funds'
                        : `Launch Campaign · ${money(action.cost)}`}
                </button>
              </article>
            );
          })}
        </section>
      ) : null}

      {/* Tab 2: Forbes Leaderboard */}
      {activeTab === 'forbes' ? (
        <section className="forbes-panel">
          <div style={{ marginBottom: '16px' }}>
            <span className="eyebrow">GLOBAL WEALTH & CULTURAL TITANS</span>
            <h2>Forbes Real-Time Billionaire Index</h2>
            <p style={{ margin: 0, color: '#6b7280' }}>
              {forbesList.enabled
                ? 'Rivals compound their own net worth while you play — overtake them by spending, building towns, and compounding cash. Rankings and standings below update live.'
                : 'Your net worth is ranked against a fixed snapshot of historical and modern titans. Enable the Forbes List add-on for a living rivalry where every oligarch keeps growing their own fortune in the background.'}
            </p>
          </div>

          {!forbesList.enabled ? (
            <div className="forbes-addon-prompt">
              <span className="eyebrow">OPTIONAL ADD-ON</span>
              <h3>Turn rivals into a living race</h3>
              <p>
                Flip this on and {FORBES_RIVALS_COUNT} oligarchs, entrepreneurs, and a few fictional wildcards start compounding their own
                fortunes in real time. Overtake one and they fire back with a quote; fall behind and they gloat. Fully optional — leave it off
                for the classic static scoreboard below.
              </p>
              <button className="primary" onClick={() => handleToggleForbesList(true)}>
                Enable Forbes List Rivalry
              </button>
            </div>
          ) : (
            <div className="forbes-addon-prompt forbes-addon-enabled">
              <span>
                Best rank this run: <b>#{forbesList.bestPlayerRank}</b> · Rivals overtaken: <b>{forbesList.everOvertakenIds.length}/{FORBES_RIVALS_COUNT}</b>
                {forbesList.reachedNumberOneAt ? ' · 👑 You have held #1' : ''}
              </span>
              <button className="secondary" onClick={() => handleToggleForbesList(false)}>
                Disable Add-on
              </button>
            </div>
          )}

          {forbesList.enabled && forbesList.events.length > 0 ? (
            <div className="forbes-events-feed">
              {forbesList.events.slice(0, 5).map((event) => (
                <div key={event.id} className={`forbes-event forbes-event-${event.kind}`}>
                  <span>{event.kind === 'overtakenBy' ? '🔻' : event.kind === 'newLeader' ? '👑' : '🔺'}</span>
                  <span>{event.message}</span>
                </div>
              ))}
            </div>
          ) : null}

          <table className="forbes-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>TITAN</th>
                <th>NET WORTH</th>
                <th>{forbesList.enabled ? 'DOMAIN' : 'FAME RATING'}</th>
                <th>{forbesList.enabled ? 'TITLE' : 'CIVILIZATION DOMAIN'}</th>
              </tr>
            </thead>
            <tbody>
              {forbesList.enabled && liveStandings
                ? liveStandings.map((entry) => (
                    <tr key={entry.id} className={entry.isPlayer ? 'player-row' : ''}>
                      <td className="forbes-rank">{entry.isPlayer ? `★ #${entry.rank}` : `#${entry.rank}`}</td>
                      <td>
                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{entry.emoji}</span>
                        <b>{entry.name}</b>
                        {entry.fictional ? <small style={{ marginLeft: 6, color: '#94a3b8' }}>(fictional rival)</small> : null}
                      </td>
                      <td>
                        <b>{money(entry.netWorth)}</b>
                      </td>
                      <td>
                        <small>{entry.domain}</small>
                      </td>
                      <td>
                        <small>{entry.title}</small>
                      </td>
                    </tr>
                  ))
                : fullList.map((entry) => (
                    <tr key={entry.name} className={entry.isPlayer ? 'player-row' : ''}>
                      <td className="forbes-rank">
                        {entry.isPlayer ? `★ #${entry.displayRank}` : `#${entry.displayRank}`}
                      </td>
                      <td>
                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                          {entry.emoji}
                        </span>
                        <b>{entry.name}</b>
                      </td>
                      <td>
                        <b>{money(entry.netWorth)}</b>
                      </td>
                      <td>
                        <span style={{ color: '#d97706', fontWeight: 600 }}>
                          ⭐ {entry.famePoints.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <small>{entry.title}</small>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {/* Tab 3: Magazine Covers */}
      {activeTab === 'magazines' ? (
        <section className="magazine-grid">
          {MAGAZINE_COVERS.map((mag) => {
            const unlocked = fame.points >= mag.requiredFame;
            return (
              <article
                className="mag-card"
                key={mag.id}
                style={{ borderColor: mag.borderColor }}
              >
                <div
                  className="mag-cover-top"
                  style={{ background: mag.accentColor }}
                >
                  <h3 className="mag-masthead">{mag.publication}</h3>
                  <span className="mag-badge">{mag.badge}</span>
                </div>

                <div className="mag-body">
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: mag.borderColor,
                      letterSpacing: '0.05em',
                    }}
                  >
                    EXCLUSIVE INTERVIEW
                  </span>
                  <h4>{mag.coverTitle}</h4>
                  <p>{mag.subheadline}</p>
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid #f3f4f6',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>Net Worth: {money(playerNetWorth)}</span>
                    <span style={{ color: '#d97706' }}>⭐ {mag.requiredFame.toLocaleString()} pts</span>
                  </div>
                </div>

                {!unlocked ? (
                  <div className="mag-locked-overlay">
                    <span>🔒</span>
                    <b>Unlock at {mag.requiredFame.toLocaleString()} Fame</b>
                    <small>Expand your empire and media presence to earn this cover</small>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}

      {/* Tab 4: Celebrity Residents */}
      {activeTab === 'celebrities' ? (
        <section className="celebrity-grid">
          {CELEBRITY_IMMIGRANTS.map((celeb) => {
            const hasArrived = fame.celebrityResidents.includes(celeb.id);
            return (
              <article
                className="celebrity-card"
                key={celeb.id}
                style={{ opacity: hasArrived ? 1 : 0.7 }}
              >
                <div className="celebrity-header">
                  <div className="celebrity-avatar">{celeb.emoji}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{celeb.name}</h3>
                    <small style={{ color: '#b45309', fontWeight: 600 }}>{celeb.role}</small>
                  </div>
                </div>

                <p className="celebrity-quote">“{celeb.quote}”</p>
                <div className="celebrity-perk">✓ {celeb.perkDescription}</div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px dashed #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    +{money(celeb.cashBonusPerSecond)}/sec
                  </span>
                  <span>
                    {hasArrived ? (
                      <b style={{ color: '#059669' }}>✓ Resident in Town</b>
                    ) : (
                      <small style={{ color: '#6b7280' }}>
                        Requires ⭐ {celeb.requiredFame.toLocaleString()} Fame
                      </small>
                    )}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
