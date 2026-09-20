'use client';

import React, { useState } from 'react';
import { townBuildings, townPoliciesConfig } from '@/data/town-content';
import type {
  CityEconomySnapshot,
  CityEconomyState,
  TownBuildingCategory,
  TownBuildingDefinition,
  TownPolicyId,
} from '@/game/city-types';
import {
  buyTownBuilding,
  cityEconomySnapshot,
  fundCommunityPetition,
  foundTown,
  getBuildingCount,
  hostTownFestival,
  setTownTaxRate,
  toggleTownPolicy,
  townBuildingCost,
} from '@/game/systems/city-economy';
import {
  calculateTownTourismSnapshot,
  CELEBRITY_IMMIGRANTS,
  getFameTier,
} from '@/game/systems/fame';
import type { GameState } from '@/game/types';

interface TownCommunityViewProps {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
  money: (n: number) => string;
}

export function TownCommunityView({ state, setState, money }: TownCommunityViewProps) {
  const [activeDistrict, setActiveDistrict] = useState<'all' | TownBuildingCategory>('all');
  const [buyMultiplier, setBuyMultiplier] = useState<1 | 5 | 10>(1);
  const [newTownName, setNewTownName] = useState('Emerald Valley');
  const [activeSubTab, setActiveSubTab] = useState<'districts' | 'petitions' | 'policies' | 'gazette' | 'tourism'>('districts');

  const city: CityEconomyState = state.cityEconomy;
  const snapshot: CityEconomySnapshot = cityEconomySnapshot(
    city,
    state.businesses ?? {},
    state.townLevel,
    Date.now(),
    state.fame?.points ?? 0,
  );
  const tourism = calculateTownTourismSnapshot(
    state.fame?.points ?? 0,
    city.population,
    city.communityGoodwill,
  );

  const festivalRemainingSeconds = Math.max(
    0,
    Math.ceil(((city.festivalEndsAt ?? 0) - Date.now()) / 1000),
  );

  const handleFoundTown = (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => (s ? foundTown(s, newTownName) : s));
  };

  const handleBuyBuilding = (building: TownBuildingDefinition, count: number) => {
    setState((s) => {
      if (!s) return s;
      let nextState = s;
      for (let i = 0; i < count; i++) {
        const cost = townBuildingCost(nextState.cityEconomy, building);
        if (nextState.cash < cost) break;
        nextState = buyTownBuilding(nextState, building);
      }
      return nextState;
    });
  };

  const handleTogglePolicy = (policyId: TownPolicyId) => {
    setState((s) => (s ? toggleTownPolicy(s, policyId) : s));
  };

  const handleFundPetition = (petitionId: string) => {
    setState((s) => (s ? fundCommunityPetition(s, petitionId) : s));
  };

  const handleFestival = () => {
    setState((s) => (s ? hostTownFestival(s) : s));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setState((s) => (s ? setTownTaxRate(s, val) : s));
  };

  // If town has not yet been founded
  if (!city?.founded) {
    return (
      <div className="town-unfounded-container">
        <div className="town-charter-card">
          <div className="charter-badge">📜 OFFICIAL CHARTER PROCLAMATION</div>
          <h2>Found Your Settlement</h2>
          <p className="charter-lead">
            Claim unsettled territory and begin building a prosperous civilization from scratch.
            You start with <strong>0 residents</strong>. Purchase residential quarters to provide shelter,
            build civic clinics and schools to cultivate community happiness, and establish transit hubs
            to welcome waves of enthusiastic immigrants!
          </p>

          <form onSubmit={handleFoundTown} className="charter-form">
            <label htmlFor="town-name-input">Settlement Name</label>
            <div className="charter-input-row">
              <input
                id="town-name-input"
                type="text"
                value={newTownName}
                onChange={(e) => setNewTownName(e.target.value)}
                placeholder="e.g. Emerald Valley, New Horizon, Solana Port"
                maxLength={32}
                required
              />
              <button type="submit" className="found-btn">
                Establish Town Charter 🏛️
              </button>
            </div>
            <span className="charter-hint">
              Charter registration fee: <strong>$0</strong>. Pioneer grants active upon founding.
            </span>
          </form>

          <div className="charter-perks-grid">
            <div className="perk-box">
              <span className="perk-icon">🏡</span>
              <h4>Residential Districts</h4>
              <p>Construct cabins, cottages, and high-rise arcologies to expand housing capacity.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">🤝</span>
              <h4>Citizen Petitions</h4>
              <p>Directly assist citizens with parks, streetlights, and startup incubators for big rewards.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">🪙</span>
              <h4>Municipal Revenue</h4>
              <p>Collect citizen income taxes and industrial revenue deposited directly into your bank account.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredBuildings = townBuildings.filter(
    (b) => activeDistrict === 'all' || b.category === activeDistrict,
  );

  const pendingPetitions = city.petitions.filter((p) => p.status === 'pending');
  const fundedPetitions = city.petitions.filter((p) => p.status === 'funded');

  const festivalCost = Math.max(2_500, Math.round(city.population * 25));

  // Determine happiness mood badge
  const happinessLabel =
    snapshot.happiness >= 80
      ? '🌟 Thriving Utopia'
      : snapshot.happiness >= 60
      ? '😊 Content & Prosperous'
      : snapshot.happiness >= 40
      ? '😐 Stable & Growing'
      : '⚠️ Discontent & Overcrowded';

  return (
    <div className="town-view-wrapper">
      {/* Top Town Banner */}
      <header className="town-header-banner">
        <div className="town-title-block">
          <span className="town-eyebrow">
            MUNICIPAL DISTRICT · LEVEL {state.townLevel || 1}
          </span>
          <div className="town-name-row">
            <h1>{city.townName}</h1>
            <span className="town-status-chip">{happinessLabel}</span>
            {festivalRemainingSeconds > 0 && (
              <span className="festival-active-chip">
                🎉 Festival Active: {Math.floor(festivalRemainingSeconds / 60)}:
                {(festivalRemainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <p className="town-motto">
            A self-governed settlement founded by you. Balanced by housing capacity, civic services,
            and steady migration.
          </p>
        </div>

        <div className="town-action-actions">
          <button
            className={`festival-btn ${festivalRemainingSeconds > 0 ? 'disabled' : ''}`}
            onClick={handleFestival}
            disabled={festivalRemainingSeconds > 0 || state.cash < festivalCost}
          >
            {festivalRemainingSeconds > 0 ? (
              <>🎉 Parades In Session</>
            ) : (
              <>Host Community Festival 🎉 ({money(festivalCost)})</>
            )}
          </button>
        </div>
      </header>

      {/* Town Demographics & Key Indicators */}
      <section className="town-stats-grid">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-label">Total Population</span>
            <span className="stat-emoji">👥</span>
          </div>
          <div className="stat-number">{snapshot.population.toLocaleString()}</div>
          <div className="stat-foot">
            <span>+{snapshot.immigrationRatePerMinute}/min migration</span>
            <span className="stat-total-tag">Total arrived: {Math.round(city.totalImmigrants).toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-label">Housing Capacity</span>
            <span className="stat-emoji">🏠</span>
          </div>
          <div className="stat-number">
            {snapshot.population.toLocaleString()} / {snapshot.housingCapacity.toLocaleString()}
          </div>
          <div className="stat-foot">
            <div className="occupancy-progress-bg">
              <div
                className={`occupancy-fill ${snapshot.occupancyRate >= 0.95 ? 'full' : ''}`}
                style={{ width: `${Math.min(100, Math.round(snapshot.occupancyRate * 100))}%` }}
              />
            </div>
            <span className="occupancy-label">
              {snapshot.housingCapacity <= snapshot.population
                ? '⚠️ Full - Build homes to grow!'
                : `${(snapshot.housingCapacity - snapshot.population).toLocaleString()} vacancies`}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-label">Employment & Jobs</span>
            <span className="stat-emoji">💼</span>
          </div>
          <div className="stat-number">
            {snapshot.employed.toLocaleString()} / {snapshot.availableJobs.toLocaleString()} jobs
          </div>
          <div className="stat-foot">
            <span>Unemployment: {(snapshot.unemploymentRate * 100).toFixed(1)}%</span>
            <span>Wage Index: {snapshot.averageWageIndex.toFixed(2)}×</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-label">Community Happiness</span>
            <span className="stat-emoji">❤️</span>
          </div>
          <div className="stat-number">{snapshot.happiness}%</div>
          <div className="stat-foot">
            <span>Goodwill: {city.communityGoodwill}%</span>
            <span>Cost of Living: {snapshot.costOfLiving.toFixed(2)}×</span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-head">
            <span className="stat-label">Municipal Tax Revenue</span>
            <span className="stat-emoji">🪙</span>
          </div>
          <div className="stat-number">+{money(snapshot.taxRevenuePerSecond)} / sec</div>
          <div className="stat-foot">
            <span>Tax Rate: {(city.taxRate * 100).toFixed(0)}%</span>
            <span>Deposited to player cash</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-label">Tourism & Renown</span>
            <span className="stat-emoji">⭐</span>
          </div>
          <div className="stat-number">+{money(tourism.tourismRevenuePerSec)} / sec</div>
          <div className="stat-foot">
            <span>{tourism.attractionRating}</span>
            <span>~{tourism.touristsPerDay.toLocaleString()} tourists/day</span>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Navigation Tabs */}
      <nav className="town-subnav">
        <button
          className={activeSubTab === 'districts' ? 'active' : ''}
          onClick={() => setActiveSubTab('districts')}
        >
          🏗️ Construction & Districts ({townBuildings.length})
        </button>
        <button
          className={activeSubTab === 'petitions' ? 'active' : ''}
          onClick={() => setActiveSubTab('petitions')}
        >
          📜 Citizen Petitions {pendingPetitions.length > 0 && <span className="tab-pill">{pendingPetitions.length}</span>}
        </button>
        <button
          className={activeSubTab === 'policies' ? 'active' : ''}
          onClick={() => setActiveSubTab('policies')}
        >
          ⚖️ Municipal Governance & Taxes
        </button>
        <button
          className={activeSubTab === 'tourism' ? 'active' : ''}
          onClick={() => setActiveSubTab('tourism')}
        >
          ⭐ Renown & Tourism Bureau
        </button>
        <button
          className={activeSubTab === 'gazette' ? 'active' : ''}
          onClick={() => setActiveSubTab('gazette')}
        >
          📰 Immigration Gazette ({city.immigrationLog.length})
        </button>
      </nav>

      {/* TAB 1: DISTRICTS & BUILDINGS */}
      {activeSubTab === 'districts' && (
        <div className="districts-container">
          <div className="districts-filter-bar">
            <div className="category-filters">
              <button
                className={activeDistrict === 'all' ? 'active' : ''}
                onClick={() => setActiveDistrict('all')}
              >
                All Buildings
              </button>
              <button
                className={activeDistrict === 'residential' ? 'active' : ''}
                onClick={() => setActiveDistrict('residential')}
              >
                🏡 Residential Zones
              </button>
              <button
                className={activeDistrict === 'community' ? 'active' : ''}
                onClick={() => setActiveDistrict('community')}
              >
                🌳 Civic & Community
              </button>
              <button
                className={activeDistrict === 'municipal' ? 'active' : ''}
                onClick={() => setActiveDistrict('municipal')}
              >
                🏛️ Municipal & Industry
              </button>
            </div>

            <div className="multiplier-filters">
              <span className="mult-label">Buy Amount:</span>
              <button
                className={buyMultiplier === 1 ? 'active' : ''}
                onClick={() => setBuyMultiplier(1)}
              >
                1×
              </button>
              <button
                className={buyMultiplier === 5 ? 'active' : ''}
                onClick={() => setBuyMultiplier(5)}
              >
                5×
              </button>
              <button
                className={buyMultiplier === 10 ? 'active' : ''}
                onClick={() => setBuyMultiplier(10)}
              >
                10×
              </button>
            </div>
          </div>

          <div className="town-buildings-grid">
            {filteredBuildings.map((building) => {
              const owned = getBuildingCount(city, building.id);
              let totalCost = 0;
              let tempCity = { ...city };
              for (let i = 0; i < buyMultiplier; i++) {
                const singleCost = townBuildingCost(tempCity, building);
                totalCost += singleCost;
                tempCity = {
                  ...tempCity,
                  buildings: {
                    ...tempCity.buildings,
                    [building.id]: (tempCity.buildings[building.id] || 0) + 1,
                  },
                };
              }
              const canAfford = state.cash >= totalCost;

              return (
                <div key={building.id} className="town-building-card">
                  <div className="building-header">
                    <span className="building-emoji">{building.emoji}</span>
                    <div className="building-meta">
                      <h3>{building.name}</h3>
                      <span className="building-type-tag">{building.category}</span>
                    </div>
                    <span className="owned-counter-pill">Owned: {owned}</span>
                  </div>

                  <p className="building-desc">{building.description}</p>

                  <div className="building-stats-row">
                    {building.housingCapacity && (
                      <span className="benefit-chip housing">
                        🏠 +{(building.housingCapacity * buyMultiplier).toLocaleString()} Homes
                      </span>
                    )}
                    {building.jobsProvided && (
                      <span className="benefit-chip jobs">
                        💼 +{(building.jobsProvided * buyMultiplier).toLocaleString()} Jobs
                      </span>
                    )}
                    {building.happinessBonus && (
                      <span className="benefit-chip happiness">
                        ❤️ +{building.happinessBonus * buyMultiplier}% Happiness
                      </span>
                    )}
                    {building.taxRevenuePerSec && (
                      <span className="benefit-chip tax">
                        🪙 +{money(building.taxRevenuePerSec * buyMultiplier)}/s Tax
                      </span>
                    )}
                  </div>

                  <div className="building-buy-row">
                    <div className="price-display">
                      <span className="price-label">Cost ({buyMultiplier}×):</span>
                      <span className="price-value">{money(totalCost)}</span>
                    </div>
                    <button
                      className="town-buy-btn"
                      disabled={!canAfford}
                      onClick={() => handleBuyBuilding(building, buyMultiplier)}
                    >
                      {canAfford ? `Construct ${buyMultiplier}× 🏗️` : 'Insufficient Cash'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN PETITIONS */}
      {activeSubTab === 'petitions' && (
        <div className="petitions-container">
          <div className="petitions-intro-card">
            <h3>📜 Town Hall Citizen Petitions</h3>
            <p>
              Your citizens bring direct grassroots improvement projects to the town charter. Funding
              their proposals increases community goodwill, elevates happiness, attracts new residents,
              and awards rare ◈ LOK Tokens!
            </p>
          </div>

          <div className="petitions-list">
            {pendingPetitions.length === 0 ? (
              <div className="empty-petitions-notice">
                🎉 All current citizen petitions have been completed and funded! Your townspeople adore
                their leadership.
              </div>
            ) : (
              pendingPetitions.map((petition) => {
                const canAfford = state.cash >= petition.cost;
                return (
                  <div key={petition.id} className="petition-card">
                    <div className="petition-top">
                      <span className="petition-emoji">{petition.emoji}</span>
                      <div className="petition-headers">
                        <h4>{petition.title}</h4>
                        <span className="requester-label">Proposed by: {petition.requesterName}</span>
                      </div>
                      <span className="status-badge pending">Pending Vote</span>
                    </div>

                    <p className="petition-text">{petition.description}</p>

                    <div className="petition-rewards-row">
                      <span className="reward-pill">❤️ +{petition.rewardHappiness}% Town Happiness</span>
                      <span className="reward-pill">👥 +{petition.rewardResidents} Immigrants</span>
                      {petition.rewardLokTokens && (
                        <span className="reward-pill lok">◈ +{petition.rewardLokTokens} LOK Tokens</span>
                      )}
                    </div>

                    <div className="petition-footer">
                      <span className="petition-cost">Required Funding: <strong>{money(petition.cost)}</strong></span>
                      <button
                        className="fund-petition-btn"
                        disabled={!canAfford}
                        onClick={() => handleFundPetition(petition.id)}
                      >
                        {canAfford ? 'Fund Community Project 🤝' : 'Need More Funds'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {fundedPetitions.length > 0 && (
              <div className="funded-section">
                <h4 className="funded-heading">Completed Civic Projects ({fundedPetitions.length})</h4>
                <div className="funded-grid">
                  {fundedPetitions.map((p) => (
                    <div key={p.id} className="funded-card">
                      <span>{p.emoji}</span>
                      <div>
                        <b>{p.title}</b>
                        <small>Funded & Constructed · Verified Community Benefit</small>
                      </div>
                      <span className="verified-chip">✅ Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MUNICIPAL POLICIES & TAXES */}
      {activeSubTab === 'policies' && (
        <div className="policies-container">
          {/* Tax Regulation Card */}
          <div className="policy-control-card">
            <div className="control-header">
              <span className="control-icon">🪙</span>
              <div>
                <h3>Municipal Income & Business Tax Rate</h3>
                <p>
                  Adjust the local tax rate levied across employed citizens and commercial districts.
                  Lower taxes spark extreme citizen happiness and attract workers; higher taxes generate
                  massive direct revenue for your empire.
                </p>
              </div>
            </div>

            <div className="tax-slider-block">
              <div className="slider-header-row">
                <span>Current Rate: <strong>{(city.taxRate * 100).toFixed(0)}%</strong></span>
                <span>Revenue: <strong>+{money(snapshot.taxRevenuePerSecond)}/s</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="0.20"
                step="0.01"
                value={city.taxRate}
                onChange={handleTaxChange}
                className="tax-slider"
              />
              <div className="slider-labels">
                <span>0% (Tax Haven · +5 Happiness)</span>
                <span>5% (Balanced Standard)</span>
                <span>10% (Growth Surtax)</span>
                <span>20% (Max Services · -15 Happiness)</span>
              </div>
            </div>
          </div>

          {/* Town Policies Grid */}
          <div className="policies-grid">
            {townPoliciesConfig.map((policy) => {
              const isActive = city.activePolicies.includes(policy.id);
              return (
                <div key={policy.id} className={`policy-item-card ${isActive ? 'active' : ''}`}>
                  <div className="policy-header">
                    <span className="policy-emoji">{policy.emoji}</span>
                    <div className="policy-title-wrap">
                      <h4>{policy.name}</h4>
                      <span className={`policy-status ${isActive ? 'enabled' : 'disabled'}`}>
                        {isActive ? '● Enacted' : '○ Suspended'}
                      </span>
                    </div>
                  </div>

                  <p className="policy-desc">{policy.description}</p>
                  <div className="policy-effect">{policy.effectLabel}</div>

                  <button
                    className={`policy-toggle-btn ${isActive ? 'disable' : 'enable'}`}
                    onClick={() => handleTogglePolicy(policy.id)}
                  >
                    {isActive ? 'Repeal Ordinance' : 'Enact Policy ⚖️'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: TOURISM & RENOWN BUREAU */}
      {activeSubTab === 'tourism' && (
        <div className="tourism-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.05em' }}>
              MUNICIPAL TOURISM & CULTURAL RENOWN BUREAU
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#78350f' }}>
                  {tourism.attractionRating}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#92400e', fontSize: '0.95rem' }}>
                  {city.townName} attracts high-net-worth travelers, journalists, and global tourists based on your worldwide Fame.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '12px 20px', borderRadius: '10px', border: '1px solid #fcd34d', textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>TOURISM REVENUE</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
                  +{money(tourism.tourismRevenuePerSec)} / sec
                </div>
                <small style={{ color: '#6b7280' }}>~{tourism.touristsPerDay.toLocaleString()} visitors daily</small>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>🌟 Celebrity Residents & Cultural Icons</h3>
            <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '0.92rem' }}>
              High-profile figures attracted by your empire&apos;s Fame and town prestige who have chosen to settle in {city.townName}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {CELEBRITY_IMMIGRANTS.map((celeb) => {
                const isResident = (state.fame?.celebrityResidents ?? []).includes(celeb.id);
                return (
                  <div
                    key={celeb.id}
                    style={{
                      background: '#ffffff',
                      border: isResident ? '2px solid #10b981' : '1px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '16px',
                      opacity: isResident ? 1 : 0.75,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '2rem' }}>{celeb.emoji}</span>
                      <div>
                        <b style={{ fontSize: '1.05rem', display: 'block' }}>{celeb.name}</b>
                        <small style={{ color: '#b45309', fontWeight: 600 }}>{celeb.role}</small>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.85rem', color: '#4b5563' }}>
                      “{celeb.quote}”
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>+{money(celeb.cashBonusPerSecond)}/sec</span>
                      <span>
                        {isResident ? (
                          <span style={{ color: '#059669', fontWeight: 700 }}>✓ Settled Resident</span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Requires ⭐ {celeb.requiredFame.toLocaleString()} Fame</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: IMMIGRATION & TOWN GAZETTE LOG */}
      {activeSubTab === 'gazette' && (
        <div className="gazette-container">
          <div className="gazette-header-card">
            <h3>📰 The Daily Settlement Gazette & Immigration Annals</h3>
            <p>
              Live chronicled timeline of newly settled families, district construction completions,
              charter proclamations, and civic celebrations in <strong>{city.townName}</strong>.
            </p>
          </div>

          <div className="gazette-timeline">
            {city.immigrationLog.length === 0 ? (
              <div className="empty-gazette">No public chronicles logged yet. Build homes to attract residents!</div>
            ) : (
              city.immigrationLog.map((entry) => (
                <div key={entry.id} className="gazette-entry">
                  <div className="entry-bullet" />
                  <div className="entry-content">
                    <div className="entry-meta">
                      <span className="entry-time">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      {entry.count > 0 && <span className="entry-count-tag">+{entry.count} Citizens</span>}
                    </div>
                    <p className="entry-msg">{entry.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
