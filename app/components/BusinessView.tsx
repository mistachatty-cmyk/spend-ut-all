'use client';

import { useState } from 'react';
import { businessDefinitions, hqTiers } from '@/data/businesses';
import { freelanceServices } from '@/data/freelance';
import { lifeSkills } from '@/data/life-progression';
import {
  addBusinessLocation,
  businessFoundingCost,
  businessSnapshot,
  businessUnlocked,
  customizeBusiness,
  foundBusiness,
  hireEmployees,
  reduceEmployees,
  upgradeBusinessHq,
  upgradeBusinessManagement,
} from '@/game/business-actions';
import { addHousing, upgradeInfrastructure } from '@/game/city-actions';
import { money } from '@/game/format';
import { hqUpgradeCost, locationCost, managementUpgradeCost, portfolioEconomics } from '@/game/systems/businesses';
import { cityEconomySnapshot, housingExpansionCost, infrastructureUpgradeCost } from '@/game/systems/city-economy';
import { freelanceBusinessReadiness } from '@/game/systems/freelance';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import { playPurchaseSound, playClickSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';
import { emitMicroMotion } from '@/game/systems/micro-animations';
import { SponsoredAdBanner } from './SponsoredAdBanner';
import { PurchaseVisual } from './PurchaseVisual';
import type { GameState } from '@/game/types';

export function BusinessView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [customizingId, setCustomizingId] = useState<string | null>(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [customSloganInput, setCustomSloganInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');
  const [customIconInput, setCustomIconInput] = useState('');

  const city = cityEconomySnapshot(state.cityEconomy, state.businesses ?? {}, state.townLevel);
  const portfolio = portfolioEconomics(state.businesses ?? {}, {
    demandMultiplier: city.businessDemandMultiplier,
    laborCostMultiplier: city.laborCostMultiplier,
  });
  const founded = businessDefinitions.filter(definition => state.businesses?.[definition.id]?.founded).length;
  const housingCost = housingExpansionCost(state.cityEconomy);
  const infrastructureCost = infrastructureUpgradeCost(state.cityEconomy);

  const openCustomizer = (defId: string, currentBus: any, def: any) => {
    if (customizingId === defId) {
      setCustomizingId(null);
    } else {
      setCustomizingId(defId);
      setCustomNameInput(currentBus.customName || def.name);
      setCustomSloganInput(currentBus.slogan || '');
      setCustomColorInput(currentBus.brandColor || def.accentColor || '#3b82f6');
      setCustomIconInput(currentBus.logoIcon || def.emoji);
    }
  };

  const saveCustomization = (defId: string) => {
    playClickSound();
    setState(curr => curr ? customizeBusiness(curr, defId, {
      customName: customNameInput.trim() || undefined,
      slogan: customSloganInput.trim() || undefined,
      brandColor: customColorInput || undefined,
      logoIcon: customIconInput || undefined,
    }) : curr);
    setCustomizingId(null);
  };

  return (
    <section className="business-shell">
      <section className="panel city-economy-card">
        <div className="city-economy-copy">
          <span className="eyebrow">LIVING CITY ECONOMY</span>
          <h2>{Math.round(city.population).toLocaleString()} residents reacting to your empire</h2>
          <p>Jobs pull people in, housing constrains growth, labor shortages raise wages, and consumer demand changes business revenue.</p>
        </div>
        <div className="city-metrics">
          <span><small>Population</small><b>{Math.round(city.population).toLocaleString()}</b></span>
          <span><small>Jobs</small><b>{city.availableJobs.toLocaleString()}</b></span>
          <span><small>Unemployment</small><b>{Math.round(city.unemploymentRate * 100)}%</b></span>
          <span><small>Housing pressure</small><b>{city.housingPressure.toFixed(2)}×</b></span>
          <span><small>Wage index</small><b>{city.averageWageIndex.toFixed(2)}×</b></span>
          <span><small>Demand</small><b>{city.consumerDemand.toFixed(2)}×</b></span>
          <span><small>Cost of living</small><b>{city.costOfLiving.toFixed(2)}×</b></span>
          <span><small>Happiness</small><b>{Math.round(city.happiness)}%</b></span>
        </div>
        <div className="city-actions">
          <button disabled={state.cash < housingCost} onClick={() => setState(current => current ? addHousing(current, 50) : current)}>
            +50 Homes · {money(housingCost)}
          </button>
          <button disabled={state.cash < infrastructureCost} onClick={() => setState(current => current ? upgradeInfrastructure(current) : current)}>
            Infrastructure Lv {state.cityEconomy.infrastructureLevel + 1} · {money(infrastructureCost)}
          </button>
        </div>
        <div className="city-signal-row">
          <span>Business demand <b>×{city.businessDemandMultiplier.toFixed(2)}</b></span>
          <span>Labor cost <b>×{city.laborCostMultiplier.toFixed(2)}</b></span>
          <span>Local GDP <b>{money(city.localGdpPerSecond)}/s</b></span>
          <span>Housing <b>{state.cityEconomy.housingUnits.toLocaleString()} units</b></span>
        </div>
      </section>

      <section className="panel business-hero">
        <div>
          <span className="eyebrow">BUSINESS LADDER</span>
          <h2>Work your way into ownership</h2>
          <p>
            Buy a startup outright, or build clients and reputation first. Relevant freelance work can reduce the cash needed to formalize a small operation, so the job → client → business path now connects directly.
          </p>
        </div>
        <div className="business-summary">
          <span><b>{founded}</b> companies</span>
          <span><b>{portfolio.jobs.toLocaleString()}</b> jobs</span>
          <span><b>{money(portfolio.revenuePerSecond)}/s</b> revenue</span>
          <span><b className={portfolio.profitPerSecond >= 0 ? 'positive' : 'negative'}>{money(portfolio.profitPerSecond)}/s</b> profit</span>
        </div>
      </section>

      <section className="business-grid">
        {businessDefinitions.map(definition => {
          const { business, economics } = businessSnapshot(state, definition);
          const unlocked = businessUnlocked(state, definition);
          const townLocked = state.townLevel < (definition.requiredTownLevel ?? 0);
          const skillLevel = definition.requiredSkillId ? lifeSkillLevel(state.life, definition.requiredSkillId) : 0;
          const skillLocked = Boolean(
            state.life.enabled
            && definition.requiredSkillId
            && skillLevel < (definition.requiredSkillLevel ?? 0),
          );
          const skillName = lifeSkills.find(entry => entry.id === definition.requiredSkillId)?.name;
          const nextLocation = locationCost(definition, business);
          const nextHq = hqUpgradeCost(definition, business);
          const targetStaff = Math.max(1, business.locations * definition.employeesPerLocation);
          const foundingCost = businessFoundingCost(state, definition);
          const readiness = freelanceBusinessReadiness(state, definition.id);
          const relatedServices = freelanceServices.filter(service => service.targetBusinessId === definition.id);
          const startupSavings = Math.max(0, definition.foundingCost - foundingCost);
          const displayName = business.customName || definition.name;
          const displayEmoji = business.logoIcon || definition.emoji;
          const displayColor = business.brandColor || definition.accentColor || '#3b82f6';

          return (
            <article className={`panel company-card ${!unlocked ? 'locked' : ''}`} key={definition.id}>
              <PurchaseVisual
                id={definition.id}
                name={displayName}
                emoji={displayEmoji}
                family="business"
                value={definition.foundingCost}
                imageSrc={definition.imageUrl}
                imageAlt={`${displayName} business preview`}
                locked={!unlocked}
              />

              <header>
                <div>
                  <span className="eyebrow">
                    {business.founded ? hqTiers[business.hqLevel] : definition.foundingCost < 100_000 ? 'STARTER BUSINESS' : 'NEW COMPANY'}
                  </span>
                  <h3>{displayName}</h3>
                  {business.slogan ? <div className="company-slogan">"{business.slogan}"</div> : null}
                </div>
                {business.founded ? <span className="margin-chip">{Math.round(economics.margin * 100)}% margin</span> : null}
              </header>

              <p>{definition.description}</p>

              {state.life.enabled && definition.requiredSkillId ? (
                <div className={`business-skill-gate ${skillLocked ? 'locked' : ''}`}>
                  <span>{skillLocked ? '🔒' : '✓'} {skillName}</span>
                  <b>Lv {skillLevel} / {definition.requiredSkillLevel}</b>
                </div>
              ) : null}

              {!business.founded && state.life.enabled && relatedServices.length > 0 ? (
                <div className={`business-organic-route ${readiness.ready ? 'ready' : ''}`}>
                  <div>
                    <span className="eyebrow">ORGANIC STARTUP ROUTE</span>
                    <b>{readiness.completedJobs}/6 relevant client jobs · Rep {readiness.reputation}/12</b>
                  </div>
                  <small>
                    {readiness.ready
                      ? `Your client book cuts startup cash by ${Math.round(readiness.discount * 100)}% (${money(startupSavings)} saved).`
                      : `Build this through ${relatedServices.map(service => service.name).join(', ')} instead of relying only on cash.`}
                  </small>
                </div>
              ) : null}

              {!business.founded ? (
                <button
                  className="primary company-found"
                  disabled={!unlocked || state.cash < foundingCost}
                  onClick={event => {
                    const sourceElement = event.currentTarget;
                    playPurchaseSound();
                    emitFloatingNumber({
                      text: `-${money(foundingCost)}`,
                      x: event.clientX,
                      y: event.clientY,
                      color: '#e11d48',
                    });
                    emitMicroMotion({
                      target: 'cash',
                      amount: -foundingCost,
                      displayText: `-${money(foundingCost)}`,
                      symbol: definition.emoji,
                      tone: 'negative',
                      kind: 'currency',
                      sourceElement,
                    });
                    setState(current => current ? foundBusiness(current, definition) : current);
                  }}
                >
                  {townLocked
                    ? `Reach town level ${definition.requiredTownLevel}`
                    : skillLocked
                      ? `Learn ${skillName} Lv ${definition.requiredSkillLevel}`
                      : `Found · ${money(foundingCost)}`}
                </button>
              ) : (
                <>
                  <div className="company-metrics">
                    <span>Locations <b>{business.locations}</b></span>
                    <span>Employees <b>{business.employees.toLocaleString()}</b></span>
                    <span>Revenue <b>{money(economics.revenuePerSecond)}/s</b></span>
                    <span>Profit <b className={economics.profitPerSecond >= 0 ? 'positive' : 'negative'}>{money(economics.profitPerSecond)}/s</b></span>
                    {state.mode === 'advanced' ? (
                      <>
                        <span>Payroll <b>{money(economics.payrollPerSecond)}/s</b></span>
                        <span>Ops cost <b>{money(economics.operatingCostPerSecond)}/s</b></span>
                      </>
                    ) : null}
                  </div>
                  <div className="staffing-bar">
                    <div><span>Staffing</span><b>{Math.round(Math.min(1, business.employees / targetStaff) * 100)}%</b></div>
                    <i><span style={{ width: `${Math.min(100, (business.employees / targetStaff) * 100)}%` }} /></i>
                    <small>Target {targetStaff.toLocaleString()} staff across {business.locations} location{business.locations === 1 ? '' : 's'}.</small>
                  </div>
                  <div className="company-actions">
                    <button
                      disabled={state.cash < nextLocation}
                      onClick={event => {
                        const sourceElement = event.currentTarget;
                        playPurchaseSound();
                        emitFloatingNumber({
                          text: `-${money(nextLocation)}`,
                          x: event.clientX,
                          y: event.clientY,
                          color: '#e11d48',
                        });
                        emitMicroMotion({
                          target: 'cash',
                          amount: -nextLocation,
                          displayText: `-${money(nextLocation)}`,
                          symbol: '🏢',
                          tone: 'negative',
                          kind: 'currency',
                          sourceElement,
                        });
                        setState(current => current ? addBusinessLocation(current, definition) : current);
                      }}
                    >
                      + Location · {money(nextLocation)}
                    </button>
                    <button
                      disabled={business.hqLevel >= hqTiers.length - 1 || state.cash < nextHq}
                      onClick={event => {
                        const sourceElement = event.currentTarget;
                        playPurchaseSound();
                        emitFloatingNumber({
                          text: `-${money(nextHq)}`,
                          x: event.clientX,
                          y: event.clientY,
                          color: '#e11d48',
                        });
                        emitMicroMotion({
                          target: 'cash',
                          amount: -nextHq,
                          displayText: `-${money(nextHq)}`,
                          symbol: '🏛',
                          tone: 'negative',
                          kind: 'currency',
                          sourceElement,
                        });
                        setState(current => current ? upgradeBusinessHq(current, definition) : current);
                      }}
                    >
                      {business.hqLevel >= hqTiers.length - 1 ? 'HQ MAXED' : `HQ → ${hqTiers[business.hqLevel + 1]} · ${money(nextHq)}`}
                    </button>
                  </div>
                  <div className="employee-controls">
                    <span>Staff</span>
                    <button onClick={() => setState(current => current ? reduceEmployees(current, definition, 10) : current)}>-10</button>
                    <button onClick={() => setState(current => current ? hireEmployees(current, definition, 10) : current)}>+10</button>
                    <button onClick={() => setState(current => current ? hireEmployees(current, definition, definition.employeesPerLocation) : current)}>+ Team</button>
                  </div>
                  <div className="management-grid">
                    {(['marketing', 'operations', 'quality'] as const).map(kind => {
                      const level = kind === 'marketing'
                        ? business.marketingLevel
                        : kind === 'operations'
                          ? business.operationsLevel
                          : business.qualityLevel;
                      const cost = managementUpgradeCost(definition, kind, business);
                      return (
                        <button key={kind} disabled={state.cash < cost} onClick={() => setState(current => current ? upgradeBusinessManagement(current, definition, kind) : current)}>
                          <span>{kind}</span><b>Lv {level}</b>
                          <small>{kind === 'marketing' ? '+12% revenue' : kind === 'quality' ? '+10% revenue' : '-5.5% operating cost'}</small>
                          <em>{money(cost)}</em>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="company-custom-toggle-btn"
                      onClick={() => openCustomizer(definition.id, business, definition)}
                    >
                      🎨 {customizingId === definition.id ? 'Close Customizer' : 'Customize Brand'}
                    </button>
                    {business.customName || business.brandColor || business.logoIcon || business.slogan ? (
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>★ Customized Brand</span>
                    ) : null}
                  </div>

                  {customizingId === definition.id ? (
                    <div className="company-custom-panel">
                      <label>
                        Company Name
                        <input
                          type="text"
                          value={customNameInput}
                          maxLength={35}
                          onChange={(e) => setCustomNameInput(e.target.value)}
                          placeholder="Enter custom business name..."
                        />
                      </label>
                      <label>
                        Brand Slogan
                        <input
                          type="text"
                          value={customSloganInput}
                          maxLength={60}
                          onChange={(e) => setCustomSloganInput(e.target.value)}
                          placeholder="e.g. Scaling innovation at lightspeed"
                        />
                      </label>
                      <label>
                        Brand Theme Color
                        <div className="brand-color-row">
                          {['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#ef4444', '#1e293b'].map(c => (
                            <button
                              key={c}
                              type="button"
                              className={`brand-color-swatch ${customColorInput === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setCustomColorInput(c)}
                              title={c}
                            />
                          ))}
                        </div>
                      </label>
                      <label>
                        Brand Logo Icon
                        <div className="brand-icon-row">
                          {['🚀', '⚡', '💎', '👑', '🛡️', '🌐', '🌟', '🎯', '🧬', '🤖', '💼', '🏢', '🔥', definition.emoji].map(icon => (
                            <button
                              key={icon}
                              type="button"
                              className={`brand-icon-btn ${customIconInput === icon ? 'active' : ''}`}
                              onClick={() => setCustomIconInput(icon)}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          type="button"
                          style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', fontWeight: 800, cursor: 'pointer' }}
                          onClick={() => saveCustomization(definition.id)}
                        >
                          ✓ Save Brand
                        </button>
                        <button
                          type="button"
                          style={{ background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => setCustomizingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </article>
          );
        })}
      </section>
      <SponsoredAdBanner slotId="7849102487" format="horizontal" />
    </section>
  );
}