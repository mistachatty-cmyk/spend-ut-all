'use client';

import { businessDefinitions, hqTiers } from '@/data/businesses';
import { lifeSkills } from '@/data/life-progression';
import { addBusinessLocation, businessSnapshot, businessUnlocked, foundBusiness, hireEmployees, reduceEmployees, upgradeBusinessHq, upgradeBusinessManagement } from '@/game/business-actions';
import { addHousing, upgradeInfrastructure } from '@/game/city-actions';
import { hqUpgradeCost, locationCost, managementUpgradeCost, portfolioEconomics } from '@/game/systems/businesses';
import { cityEconomySnapshot, housingExpansionCost, infrastructureUpgradeCost } from '@/game/systems/city-economy';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import { money } from '@/game/format';
import type { GameState } from '@/game/types';

export function BusinessView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const city = cityEconomySnapshot(state.cityEconomy, state.businesses ?? {}, state.townLevel);
  const portfolio = portfolioEconomics(state.businesses ?? {}, { demandMultiplier: city.businessDemandMultiplier, laborCostMultiplier: city.laborCostMultiplier });
  const founded = businessDefinitions.filter((definition) => state.businesses?.[definition.id]?.founded).length;
  const housingCost = housingExpansionCost(state.cityEconomy);
  const infrastructureCost = infrastructureUpgradeCost(state.cityEconomy);

  return <section className="business-shell">
    <section className="panel city-economy-card">
      <div className="city-economy-copy"><span className="eyebrow">LIVING CITY ECONOMY</span><h2>{Math.round(city.population).toLocaleString()} residents reacting to your empire</h2><p>Jobs pull people in, housing constrains growth, labor shortages raise wages, and consumer demand changes business revenue.</p></div>
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
        <button disabled={state.cash < housingCost} onClick={() => setState((current) => current ? addHousing(current, 50) : current)}>+50 Homes · {money(housingCost)}</button>
        <button disabled={state.cash < infrastructureCost} onClick={() => setState((current) => current ? upgradeInfrastructure(current) : current)}>Infrastructure Lv {state.cityEconomy.infrastructureLevel + 1} · {money(infrastructureCost)}</button>
      </div>
      <div className="city-signal-row"><span>Business demand <b>×{city.businessDemandMultiplier.toFixed(2)}</b></span><span>Labor cost <b>×{city.laborCostMultiplier.toFixed(2)}</b></span><span>Local GDP <b>{money(city.localGdpPerSecond)}/s</b></span><span>Housing <b>{state.cityEconomy.housingUnits.toLocaleString()} units</b></span></div>
    </section>

    <section className="panel business-hero">
      <div><span className="eyebrow">BUSINESS LADDER</span><h2>Start with $300, not $750,000</h2><p>The company path now starts with solo services, cleaning, lawn care, detailing, food carts, online shops and small professional firms before growing into restaurant groups, software companies and institutional empires.</p></div>
      <div className="business-summary"><span><b>{founded}</b> companies</span><span><b>{portfolio.jobs.toLocaleString()}</b> jobs</span><span><b>{money(portfolio.revenuePerSecond)}/s</b> revenue</span><span><b className={portfolio.profitPerSecond >= 0 ? 'positive' : 'negative'}>{money(portfolio.profitPerSecond)}/s</b> profit</span></div>
    </section>

    <section className="business-grid">{businessDefinitions.map((definition) => {
      const { business, economics } = businessSnapshot(state, definition);
      const unlocked = businessUnlocked(state, definition);
      const townLocked = state.townLevel < (definition.requiredTownLevel ?? 0);
      const skillLevel = definition.requiredSkillId ? lifeSkillLevel(state.life,definition.requiredSkillId) : 0;
      const skillLocked = state.life.enabled && definition.requiredSkillId && skillLevel < (definition.requiredSkillLevel ?? 0);
      const skillName = lifeSkills.find((entry)=>entry.id===definition.requiredSkillId)?.name;
      const nextLocation = locationCost(definition, business);
      const nextHq = hqUpgradeCost(definition, business);
      const targetStaff = Math.max(1, business.locations * definition.employeesPerLocation);
      return <article className={`panel company-card ${!unlocked ? 'locked' : ''}`} key={definition.id}>
        <header><span className="company-emoji">{definition.emoji}</span><div><span className="eyebrow">{business.founded ? hqTiers[business.hqLevel] : definition.foundingCost < 100_000 ? 'STARTER BUSINESS' : 'NEW COMPANY'}</span><h3>{definition.name}</h3></div>{business.founded ? <span className="margin-chip">{Math.round(economics.margin * 100)}% margin</span> : null}</header>
        <p>{definition.description}</p>
        {state.life.enabled && definition.requiredSkillId ? <div className={`business-skill-gate ${skillLocked?'locked':''}`}><span>{skillLocked?'🔒':'✓'} {skillName}</span><b>Lv {skillLevel} / {definition.requiredSkillLevel}</b></div> : null}
        {!business.founded ? <button className="primary company-found" disabled={!unlocked || state.cash < definition.foundingCost} onClick={() => setState((current) => current ? foundBusiness(current, definition) : current)}>{townLocked ? `Reach town level ${definition.requiredTownLevel}` : skillLocked ? `Learn ${skillName} Lv ${definition.requiredSkillLevel}` : `Found · ${money(definition.foundingCost)}`}</button> : <>
          <div className="company-metrics"><span>Locations <b>{business.locations}</b></span><span>Employees <b>{business.employees.toLocaleString()}</b></span><span>Revenue <b>{money(economics.revenuePerSecond)}/s</b></span><span>Profit <b className={economics.profitPerSecond >= 0 ? 'positive' : 'negative'}>{money(economics.profitPerSecond)}/s</b></span>{state.mode === 'advanced' ? <><span>Payroll <b>{money(economics.payrollPerSecond)}/s</b></span><span>Ops cost <b>{money(economics.operatingCostPerSecond)}/s</b></span></> : null}</div>
          <div className="staffing-bar"><div><span>Staffing</span><b>{Math.round(Math.min(1, business.employees / targetStaff) * 100)}%</b></div><i><span style={{ width: `${Math.min(100, (business.employees / targetStaff) * 100)}%` }} /></i><small>Target {targetStaff.toLocaleString()} staff across {business.locations} location{business.locations === 1 ? '' : 's'}.</small></div>
          <div className="company-actions"><button disabled={state.cash < nextLocation} onClick={() => setState((current) => current ? addBusinessLocation(current, definition) : current)}>+ Location · {money(nextLocation)}</button><button disabled={business.hqLevel >= hqTiers.length - 1 || state.cash < nextHq} onClick={() => setState((current) => current ? upgradeBusinessHq(current, definition) : current)}>{business.hqLevel >= hqTiers.length - 1 ? 'HQ MAXED' : `HQ → ${hqTiers[business.hqLevel + 1]} · ${money(nextHq)}`}</button></div>
          <div className="employee-controls"><span>Staff</span><button onClick={() => setState((current) => current ? reduceEmployees(current, definition, 10) : current)}>-10</button><button onClick={() => setState((current) => current ? hireEmployees(current, definition, 10) : current)}>+10</button><button onClick={() => setState((current) => current ? hireEmployees(current, definition, definition.employeesPerLocation) : current)}>+ Team</button></div>
          <div className="management-grid">{(['marketing','operations','quality'] as const).map((kind) => {
            const level = kind === 'marketing' ? business.marketingLevel : kind === 'operations' ? business.operationsLevel : business.qualityLevel;
            const cost = managementUpgradeCost(definition, kind, business);
            return <button key={kind} disabled={state.cash < cost} onClick={() => setState((current) => current ? upgradeBusinessManagement(current, definition, kind) : current)}><span>{kind}</span><b>Lv {level}</b><small>{kind === 'marketing' ? '+12% revenue' : kind === 'quality' ? '+10% revenue' : '-5.5% operating cost'}</small><em>{money(cost)}</em></button>;
          })}</div>
        </>}
      </article>;
    })}</section>
  </section>;
}
