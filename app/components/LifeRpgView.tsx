'use client';

import React, { useState } from 'react';
import {
  homeFurnishings,
  housingOptions,
  lifeBackgrounds,
  lifeSkills,
  relationshipContacts,
  simActions,
  vehicleDefinitions,
} from '@/data/life-progression';
import { money } from '@/game/format';
import {
  buyHomeFurnishing,
  buyVehicle,
  chooseLifeBackground,
  currentHousing,
  enableLifeRpg,
  equipVehicle,
  getSimMood,
  homeComfortScore,
  interactContact,
  lifeSkillProgress,
  lifeSkillXpMultiplier,
  moveToHousing,
  normalizeLifeRpg,
  performSimAction,
} from '@/game/systems/life-progression';
import type { GameState } from '@/game/types';
import type {
  RelationshipContactId,
  RelationshipInteractionType,
  SimActionCategory,
  SimNeedId,
} from '@/game/life-types';

const statLabels = [
  ['grit', 'Grit', 'Physical stamina, grit & manual skills'],
  ['focus', 'Focus', 'Deep work, creative arts & concentration'],
  ['people', 'People', 'Charisma, networking & salesmanship'],
  ['knowledge', 'Knowledge', 'Engineering, market theory & finance'],
  ['adaptability', 'Adaptability', 'Universal learning rate boost'],
] as const;

type SimSubTab = 'routine' | 'housing' | 'social' | 'garage' | 'skills' | 'journal';

export function LifeRpgView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [activeSubTab, setActiveSubTab] = useState<SimSubTab>('routine');
  const [actionCategory, setActionCategory] = useState<SimActionCategory | 'all'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const life = normalizeLifeRpg(state.life, state.time.gameMinute, state.time.settings.dayLengthMinutes);

  if (!life.enabled) {
    const returning = !!life.backgroundId || Object.values(life.skillXp).some((xp) => xp > 0);
    return (
      <section className="panel life-rpg-optin">
        <div>
          <span className="eyebrow">SIMULATION & LIFE RPG</span>
          <h2>{returning ? 'Resume your Sim character' : 'Turn the run into an interactive Sim life'}</h2>
          <p>
            Experience simulated human life in the metro! Manage vitals (energy, hunger, health, happiness, social),
            furnish your residence, build romantic and professional relationships, collect vehicles, and advance career
            skills.
            {returning ? ' Your existing character stats and progress are fully preserved.' : ''}
          </p>
        </div>
        <button
          className="primary"
          type="button"
          onClick={() =>
            setState((current) =>
              current
                ? {
                    ...current,
                    life: enableLifeRpg(current.life, current.time.gameMinute, current.time.settings.dayLengthMinutes),
                    updatedAt: Date.now(),
                  }
                : current,
            )
          }
        >
          {returning ? 'Resume Sim Life' : 'Activate Sim Mode'}
        </button>
      </section>
    );
  }

  const housing = currentHousing(life);
  const mood = getSimMood(life);
  const comfortScore = homeComfortScore(life);
  const equippedVehicle =
    vehicleDefinitions.find((v) => v.id === life.equippedVehicleId) ?? vehicleDefinitions[0];

  const handleAction = (actionId: string) => {
    setState((current) => {
      if (!current) return current;
      const res = performSimAction(current, actionId);
      setFeedbackMessage(res.message);
      setTimeout(() => setFeedbackMessage(null), 4000);
      return res.state;
    });
  };

  const handleFurnishing = (furnishingId: string) => {
    setState((current) => {
      if (!current) return current;
      return buyHomeFurnishing(current, furnishingId);
    });
  };

  const handleInteract = (contactId: RelationshipContactId, type: RelationshipInteractionType) => {
    setState((current) => {
      if (!current) return current;
      const res = interactContact(current, contactId, type);
      setFeedbackMessage(res.message);
      setTimeout(() => setFeedbackMessage(null), 4000);
      return res.state;
    });
  };

  const handleVehicleBuy = (vehicleId: string) => {
    setState((current) => {
      if (!current) return current;
      return buyVehicle(current, vehicleId);
    });
  };

  const handleVehicleEquip = (vehicleId: string) => {
    setState((current) => {
      if (!current) return current;
      return equipVehicle(current, vehicleId);
    });
  };

  const getNeedColor = (val: number) => {
    if (val >= 70) return '#10b981';
    if (val >= 35) return '#f59e0b';
    return '#ef4444';
  };

  const filteredActions =
    actionCategory === 'all'
      ? simActions
      : simActions.filter((a) => a.category === actionCategory);

  return (
    <section className="life-rpg-shell">
      {/* Background Selector if first time */}
      {!life.backgroundId ? (
        <section className="panel life-background-panel">
          <span className="eyebrow">CHOOSE LIFE ORIGIN</span>
          <h2>What is your character&apos;s background?</h2>
          <p className="muted">
            Select a starting identity for your Sim. This provides starting attribute bonuses and initial skill proficiencies.
            Every skill and path can still be freely pursued!
          </p>
          <div className="life-background-grid">
            {lifeBackgrounds.map((entry) => (
              <button
                type="button"
                key={entry.id}
                onClick={() =>
                  setState((current) =>
                    current
                      ? {
                          ...current,
                          life: chooseLifeBackground(current.life, entry.id),
                          updatedAt: Date.now(),
                        }
                      : current,
                  )
                }
              >
                <span>{entry.emoji}</span>
                <b>{entry.name}</b>
                <small>{entry.description}</small>
                <em>
                  {Object.entries(entry.startingSkillXp)
                    .map(([id, xp]) => `${lifeSkills.find((s) => s.id === id)?.name ?? id} +${xp} XP`)
                    .join(' · ') || 'Balanced start'}
                </em>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sim Vitals & Mood Banner */}
      <section className="sim-vitals-card">
        <div className="sim-mood-banner">
          <div className="sim-mood-left">
            <span className="sim-mood-icon" style={{ borderColor: mood.color }}>
              {mood.emoji}
            </span>
            <div className="sim-mood-title">
              <b style={{ color: mood.color }}>{mood.label}</b>
              <small>{mood.description}</small>
            </div>
          </div>
          <div className="sim-mood-perks">
            <span className={`sim-perk-pill ${mood.bonusXpMultiplier >= 1 ? '' : 'penalty'}`}>
              ⚡ XP Multiplier: ×{mood.bonusXpMultiplier.toFixed(2)}
            </span>
            <span className={`sim-perk-pill income ${mood.incomeMultiplier >= 1 ? '' : 'penalty'}`}>
              💵 Cash Flow: ×{mood.incomeMultiplier.toFixed(2)}
            </span>
            <span className="life-housing-chip">
              {housing.emoji} {housing.name}
            </span>
            <button
              type="button"
              className="life-pause-button"
              onClick={() =>
                setState((current) =>
                  current
                    ? {
                        ...current,
                        life: { ...current.life, enabled: false },
                        updatedAt: Date.now(),
                      }
                    : current,
                )
              }
            >
              Pause Sim Layer
            </button>
          </div>
        </div>

        {/* 5 Interactive Need Meters */}
        <div className="sim-needs-grid">
          {(
            [
              ['energy', 'Energy', '⚡', life.needs.energy],
              ['hunger', 'Hunger', '🥪', life.needs.hunger],
              ['health', 'Health', '❤️', life.needs.health],
              ['happiness', 'Happiness', '😊', life.needs.happiness],
              ['social', 'Social', '💬', life.needs.social],
            ] as const
          ).map(([key, label, emoji, val]) => {
            const color = getNeedColor(val);
            return (
              <div key={key} className="sim-need-box">
                <div className="sim-need-head">
                  <span className="sim-need-label">
                    {emoji} {label}
                  </span>
                  <span className="sim-need-val" style={{ color }}>
                    {Math.round(val)}%
                  </span>
                </div>
                <div className="sim-need-bar">
                  <div
                    className="sim-need-fill"
                    style={{
                      width: `${Math.max(5, Math.min(100, val))}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {feedbackMessage ? (
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: '#065f46',
              fontSize: '11px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {feedbackMessage}
          </div>
        ) : null}
      </section>

      {/* Sim Feature Subtabs */}
      <nav className="sim-subtabs">
        <button
          type="button"
          className={activeSubTab === 'routine' ? 'active' : ''}
          onClick={() => setActiveSubTab('routine')}
        >
          ⚡ Daily Routine & Actions
        </button>
        <button
          type="button"
          className={activeSubTab === 'housing' ? 'active' : ''}
          onClick={() => setActiveSubTab('housing')}
        >
          🏡 Residence & Furnishings
        </button>
        <button
          type="button"
          className={activeSubTab === 'social' ? 'active' : ''}
          onClick={() => setActiveSubTab('social')}
        >
          💬 Rolodex & Dating
        </button>
        <button
          type="button"
          className={activeSubTab === 'garage' ? 'active' : ''}
          onClick={() => setActiveSubTab('garage')}
        >
          🚗 Garage & Transit
        </button>
        <button
          type="button"
          className={activeSubTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveSubTab('skills')}
        >
          🎓 Skills & Stats
        </button>
        <button
          type="button"
          className={activeSubTab === 'journal' ? 'active' : ''}
          onClick={() => setActiveSubTab('journal')}
        >
          📜 Life Timeline
        </button>
      </nav>

      {/* Subtab 1: Daily Routine & Actions */}
      {activeSubTab === 'routine' && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SIM LIVING</span>
              <h2>Daily Routine & Actions</h2>
            </div>
            <span>Manage vitals through real-time activities</span>
          </div>

          <div className="sim-category-filter">
            {(
              [
                ['all', 'All Routines'],
                ['rest', '😴 Sleep & Rest'],
                ['dining', '🍲 Food & Dining'],
                ['fitness', '🏋️ Fitness & Wellness'],
                ['leisure', '🎉 Leisure & Fun'],
              ] as const
            ).map(([cat, title]) => (
              <button
                key={cat}
                type="button"
                className={actionCategory === cat ? 'active' : ''}
                onClick={() => setActionCategory(cat as any)}
              >
                {title}
              </button>
            ))}
          </div>

          <div className="sim-actions-grid">
            {filteredActions.map((action) => {
              const canAfford = state.cash >= action.cost;
              return (
                <article key={action.id} className="sim-action-card">
                  <div className="sim-action-top">
                    <span className="sim-action-icon">{action.emoji}</span>
                    <div className="sim-action-info">
                      <b>{action.name}</b>
                      <small>{action.description}</small>
                    </div>
                  </div>

                  <div className="sim-impact-tags">
                    {action.durationMinutes > 0 && (
                      <span className="sim-impact-pill">⏱️ {action.durationMinutes} min</span>
                    )}
                    {Object.entries(action.needsImpact).map(([need, val]) => (
                      <span
                        key={need}
                        className={`sim-impact-pill ${val && val > 0 ? 'pos' : 'neg'}`}
                      >
                        {val && val > 0 ? `+${val}` : val} {need}
                      </span>
                    ))}
                    {action.skillXpImpact &&
                      Object.entries(action.skillXpImpact).map(([sk, val]) => (
                        <span key={sk} className="sim-impact-pill skill">
                          +{val} {sk} XP
                        </span>
                      ))}
                    {action.fameReward && (
                      <span className="sim-impact-pill pos">+{action.fameReward} Fame</span>
                    )}
                  </div>

                  <div className="sim-action-bottom">
                    <span className="sim-action-cost">
                      {action.cost === 0 ? 'Free' : money(action.cost)}
                    </span>
                    <button
                      type="button"
                      className="sim-act-btn"
                      disabled={!canAfford}
                      onClick={() => handleAction(action.id)}
                    >
                      {action.cost === 0 ? 'Do Action' : `Pay ${money(action.cost)}`}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Subtab 2: Residence & Furnishings */}
      {activeSubTab === 'housing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Current Home & Interior Comfort */}
          <section className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR LIVING QUARTERS</span>
                <h2>
                  {housing.emoji} {housing.name}
                </h2>
              </div>
              <span>Comfort Rating: {comfortScore}/100</span>
            </div>
            <p className="muted">
              Your home provides the foundation for focus and recuperation. Upgrading your furnishings boosts your
              comfort rating, unlocks faster sleep recovery, kitchen buffs, and gives passive daily wellness perks.
            </p>

            {life.housingArrears > 0 ? (
              <div className="housing-arrears">
                ⚠️ Housing arrears: <b>{money(life.housingArrears)}</b>. Unpaid rent will impact credit and happiness!
              </div>
            ) : null}

            <div className="housing-numbers" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              <span>
                Status <b>{housing.kind.toUpperCase()}</b>
              </span>
              <span>
                Daily Carrying <b>{money(housing.dailyCost)}</b>
              </span>
              <span>
                Stability Rating <b>{housing.stability}/10</b>
              </span>
              <span>
                Installed Upgrades <b>{life.furnishingIds.length} items</b>
              </span>
            </div>
          </section>

          {/* Home Furnishings Upgrades */}
          <section className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">INTERIOR UPGRADES</span>
                <h2>Home Furnishings & Amenities</h2>
              </div>
              <span>Invest in your daily living standards</span>
            </div>

            <div className="furnishing-grid">
              {homeFurnishings.map((furnishing) => {
                const isInstalled = life.furnishingIds.includes(furnishing.id);
                const canAfford = state.cash >= furnishing.price;

                return (
                  <article
                    key={furnishing.id}
                    className={`furnishing-card ${isInstalled ? 'installed' : ''}`}
                  >
                    <div className="furnishing-header">
                      <span className="furnishing-icon">{furnishing.emoji}</span>
                      <div className="furnishing-title">
                        <b>{furnishing.name}</b>
                        <small>{furnishing.category}</small>
                      </div>
                    </div>

                    <div className="furnishing-perk">{furnishing.perkSummary}</div>
                    <p className="furnishing-desc">{furnishing.description}</p>

                    {isInstalled ? (
                      <button type="button" className="furnishing-install-btn installed-badge" disabled>
                        ✓ Installed in Home
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="furnishing-install-btn"
                        disabled={!canAfford}
                        onClick={() => handleFurnishing(furnishing.id)}
                      >
                        Buy & Install · {money(furnishing.price)}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Housing Relocation Catalog */}
          <section className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">REAL ESTATE MARKET</span>
                <h2>Relocate or Purchase Property</h2>
              </div>
              <span>Move to bigger units as your income scales</span>
            </div>

            <div className="housing-option-grid">
              {housingOptions.map((entry) => {
                const selected = life.housingId === entry.id;
                const owned = life.ownedHousingIds.includes(entry.id);
                const upfront = owned && entry.kind === 'owned' ? 0 : entry.upfrontCost;
                const canAfford = state.cash >= upfront;

                return (
                  <article key={entry.id} className={selected ? 'selected' : ''}>
                    <header>
                      <span>{entry.emoji}</span>
                      <div>
                        <b>{entry.name}</b>
                        <small>{entry.kind.toUpperCase()}</small>
                      </div>
                      {selected ? <em>Current</em> : null}
                    </header>
                    <p>{entry.description}</p>
                    <div className="housing-numbers">
                      <span>
                        Move-in <b>{owned ? 'Owned' : money(upfront)}</b>
                      </span>
                      <span>
                        Daily <b>{money(entry.dailyCost)}</b>
                      </span>
                      <span>
                        Stability <b>{entry.stability}/10</b>
                      </span>
                      <span>
                        Focus <b>{entry.focusBonus >= 0 ? '+' : ''}{entry.focusBonus}</b>
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={selected || !canAfford}
                      onClick={() =>
                        setState((current) => (current ? moveToHousing(current, entry.id) : current))
                      }
                    >
                      {selected
                        ? 'Current Residence'
                        : owned
                          ? 'Move Back In'
                          : entry.kind === 'owned'
                            ? `Purchase · ${money(upfront)}`
                            : upfront
                              ? `Move · ${money(upfront)}`
                              : 'Move Here'}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Subtab 3: Rolodex & Dating */}
      {activeSubTab === 'social' && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SOCIAL CAPITAL</span>
              <h2>Rolodex, Mentors & Companions</h2>
            </div>
            <span>Cultivate high-value friendships and romance</span>
          </div>
          <p className="muted">
            Connect with influential figures across tech, art, venture capital, and fitness. Deepening your bond unlocks
            skill mentoring, career contracts, and companionship perks.
          </p>

          <div className="contact-grid">
            {relationshipContacts.map((contact) => {
              const currentContact = life.contacts[contact.id];
              const affinity = currentContact?.affinity ?? 0;
              const level = currentContact?.level ?? 'acquaintance';

              return (
                <article key={contact.id} className="contact-card">
                  <div className="contact-head">
                    <span
                      className="contact-avatar"
                      style={{ border: `2px solid ${contact.avatarColor}` }}
                    >
                      {contact.emoji}
                    </span>
                    <div className="contact-meta">
                      <b>{contact.name}</b>
                      <small>{contact.role}</small>
                    </div>
                    <span
                      className={`contact-status-tag ${
                        level === 'partner' ? 'partner' : level === 'confidant' ? 'confidant' : ''
                      }`}
                    >
                      {level}
                    </span>
                  </div>

                  <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>
                    {contact.bio}
                  </p>

                  <div className="contact-affinity-strip">
                    <div className="contact-affinity-labels">
                      <span>Affinity</span>
                      <span>{affinity}%</span>
                    </div>
                    <div className="contact-affinity-bar">
                      <div
                        className="contact-affinity-fill"
                        style={{
                          width: `${affinity}%`,
                          backgroundColor: contact.avatarColor,
                        }}
                      />
                    </div>
                  </div>

                  <div className="contact-perk-hint">
                    ✨ <b>Companion Perk:</b> {contact.perkDescription}
                  </div>

                  <div className="contact-interact-buttons">
                    <button
                      type="button"
                      disabled={state.cash < 14}
                      onClick={() => handleInteract(contact.id, 'coffee')}
                    >
                      <span>☕ Coffee</span>
                      <small>$14</small>
                    </button>
                    <button
                      type="button"
                      disabled={state.cash < 68}
                      onClick={() => handleInteract(contact.id, 'dinner')}
                    >
                      <span>🍽️ Dinner</span>
                      <small>$68</small>
                    </button>
                    <button
                      type="button"
                      disabled={state.cash < 135}
                      onClick={() => handleInteract(contact.id, 'gift')}
                    >
                      <span>🎁 Gift</span>
                      <small>$135</small>
                    </button>
                    <button
                      type="button"
                      disabled={affinity < 50}
                      onClick={() => handleInteract(contact.id, 'collaborate')}
                    >
                      <span>🤝 Collab</span>
                      <small>{affinity >= 50 ? '+50 XP' : 'Locked'}</small>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Subtab 4: Garage & Vehicles */}
      {activeSubTab === 'garage' && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRANSIT & PRESTIGE</span>
              <h2>Garage & City Travel</h2>
            </div>
            <span>Equipped: {equippedVehicle.emoji} {equippedVehicle.name}</span>
          </div>
          <p className="muted">
            Getting around quickly reduces commute times and builds prestige. Upgrading from public transit to
            bicycles, sport sedans, and exotic supercars improves social status and career momentum.
          </p>

          <div className="vehicle-grid">
            {vehicleDefinitions.map((vehicle) => {
              const isOwned = life.ownedVehicleIds.includes(vehicle.id);
              const isEquipped = life.equippedVehicleId === vehicle.id;
              const canAfford = state.cash >= vehicle.price;

              return (
                <article
                  key={vehicle.id}
                  className={`vehicle-card ${isEquipped ? 'equipped' : ''}`}
                >
                  <div className="vehicle-header">
                    <span className="vehicle-icon">{vehicle.emoji}</span>
                    <div className="vehicle-info">
                      <b>{vehicle.name}</b>
                      <small>Speed ×{vehicle.transitSpeedMultiplier.toFixed(2)}</small>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0', minHeight: '34px' }}>
                    {vehicle.description}
                  </p>

                  <div className="vehicle-stats">
                    <span>
                      Prestige <b>+{vehicle.prestigeScore}</b>
                    </span>
                    <span>
                      Daily Upkeep <b>{money(vehicle.dailyMaintenance)}</b>
                    </span>
                  </div>

                  {isEquipped ? (
                    <button type="button" className="vehicle-btn equipped-badge" disabled>
                      ✓ In Use
                    </button>
                  ) : isOwned ? (
                    <button
                      type="button"
                      className="vehicle-btn"
                      onClick={() => handleVehicleEquip(vehicle.id)}
                    >
                      Equip for Travel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="vehicle-btn"
                      disabled={!canAfford}
                      onClick={() => handleVehicleBuy(vehicle.id)}
                    >
                      Buy · {money(vehicle.price)}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Subtab 5: Skills & Stats */}
      {activeSubTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <section className="panel life-profile-panel">
            <div className="life-profile-head">
              <div>
                <span className="eyebrow">CORE ATTRIBUTES</span>
                <h2>
                  {lifeBackgrounds.find((entry) => entry.id === life.backgroundId)?.name ??
                    'Developing Character'}
                </h2>
                <small className="life-profile-note">
                  Attributes govern how quickly related skills level up. High mood and comfort further accelerate your
                  learning multiplier.
                </small>
              </div>
            </div>
            <div className="life-stat-grid">
              {statLabels.map(([id, label, hint]) => (
                <div key={id}>
                  <span>{label}</span>
                  <b>{life.stats[id]}</b>
                  <small>{hint}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="panel life-skills-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">PROFICIENCY TREE</span>
                <h2>Life & Industry Skills</h2>
              </div>
              <span>Max Level: 10</span>
            </div>
            <div className="life-skill-grid">
              {lifeSkills.map((skill) => {
                const progress = lifeSkillProgress(life, skill.id);
                const rate = lifeSkillXpMultiplier(life, skill.id);
                return (
                  <article key={skill.id}>
                    <header>
                      <span>{skill.emoji}</span>
                      <div>
                        <b>{skill.name}</b>
                        <small>{skill.description}</small>
                      </div>
                      <em>Lv {progress.level}</em>
                    </header>
                    <div className="life-xp-bar">
                      <i>
                        <span style={{ width: `${Math.round(progress.progress * 100)}%` }} />
                      </i>
                      <small>
                        {Math.round(progress.xp).toLocaleString()} XP
                        {progress.level < 10
                          ? ` · ${Math.max(0, progress.next - progress.xp).toFixed(0)} to next`
                          : ' · MAX LEVEL'}{' '}
                        · rate ×{rate.toFixed(2)}
                      </small>
                    </div>
                    <p>{skill.examples}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Subtab 6: Life Journal / Log */}
      {activeSubTab === 'journal' && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MEMOIRS</span>
              <h2>Sim Character Journal</h2>
            </div>
            <span>{life.lifeLog.length} recorded events</span>
          </div>

          <div className="life-log-list">
            {life.lifeLog.map((item) => (
              <div key={item.id} className="life-log-item">
                <span className="life-log-icon">{item.emoji}</span>
                <div className="life-log-content">
                  <div className="life-log-title">
                    <b>{item.title}</b>
                    <small>Minute {item.gameMinute}</small>
                  </div>
                  <span className="life-log-desc">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
