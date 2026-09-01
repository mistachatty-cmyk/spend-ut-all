'use client';

import { businessDefinitions, hqTiers } from '@/data/businesses';
import { addBusinessLocation, businessSnapshot, foundBusiness, hireEmployees, reduceEmployees, upgradeBusinessHq, upgradeBusinessManagement } from '@/game/business-actions';
import { hqUpgradeCost, locationCost, managementUpgradeCost, portfolioEconomics } from '@/game/systems/businesses';
import { money } from '@/game/format';
import type { GameState } from '@/game/types';

export function BusinessView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const portfolio = portfolioEconomics(state.businesses ?? {});
  const founded = businessDefinitions.filter((definition) => state.businesses?.[definition.id]?.founded).length;

  return <section className="business-shell">
    <section className="panel business-hero">
      <div><span className="eyebrow">BUSINESS EMPIRE</span><h2>Build companies, not just assets</h2><p>Found companies, open locations, hire staff, build headquarters and improve marketing, operations and quality. These businesses create jobs and feed directly into your cash flow.</p></div>
      <div className="business-summary"><span><b>{founded}</b> companies</span><span><b>{portfolio.jobs.toLocaleString()}</b> jobs</span><span><b>{money(portfolio.revenuePerSecond)}/s</b> revenue</span><span><b className={portfolio.profitPerSecond >= 0 ? 'positive' : 'negative'}>{money(portfolio.profitPerSecond)}/s</b> profit</span></div>
    </section>

    <section className="business-grid">{businessDefinitions.map((definition) => {
      const { business, economics } = businessSnapshot(state, definition);
      const locked = state.townLevel < (definition.requiredTownLevel ?? 0);
      const nextLocation = locationCost(definition, business);
      const nextHq = hqUpgradeCost(definition, business);
      const targetStaff = Math.max(1, business.locations * definition.employeesPerLocation);
      return <article className={`panel company-card ${locked ? 'locked' : ''}`} key={definition.id}>
        <header><span className="company-emoji">{definition.emoji}</span><div><span className="eyebrow">{business.founded ? hqTiers[business.hqLevel] : 'NEW COMPANY'}</span><h3>{definition.name}</h3></div>{business.founded ? <span className="margin-chip">{Math.round(economics.margin * 100)}% margin</span> : null}</header>
        <p>{definition.description}</p>
        {!business.founded ? <button className="primary company-found" disabled={locked || state.cash < definition.foundingCost} onClick={() => setState((current) => current ? foundBusiness(current, definition) : current)}>{locked ? `Reach town level ${definition.requiredTownLevel}` : `Found · ${money(definition.foundingCost)}`}</button> : <>
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
