import { businessDefinitions, hqTiers } from '@/data/businesses';
import type { BusinessDefinition, BusinessEconomics, BusinessPortfolio, ManagedBusiness } from '../business-types';

export function emptyManagedBusiness(): ManagedBusiness {
  return { founded: false, locations: 0, employees: 0, hqLevel: 0, marketingLevel: 0, operationsLevel: 0, qualityLevel: 0 };
}

export function normalizeBusinessPortfolio(input: BusinessPortfolio | null | undefined): BusinessPortfolio {
  const portfolio: BusinessPortfolio = { ...(input ?? {}) };
  for (const definition of businessDefinitions) {
    const current = portfolio[definition.id] ?? emptyManagedBusiness();
    portfolio[definition.id] = {
      founded: !!current.founded,
      locations: Math.max(0, current.locations ?? 0),
      employees: Math.max(0, current.employees ?? 0),
      hqLevel: Math.min(hqTiers.length - 1, Math.max(0, current.hqLevel ?? 0)),
      marketingLevel: Math.max(0, current.marketingLevel ?? 0),
      operationsLevel: Math.max(0, current.operationsLevel ?? 0),
      qualityLevel: Math.max(0, current.qualityLevel ?? 0),
    };
  }
  return portfolio;
}

export function locationCost(definition: BusinessDefinition, business: ManagedBusiness) {
  return definition.locationCost * Math.pow(definition.locationGrowthRate, Math.max(0, business.locations - 1));
}

export function hqUpgradeCost(definition: BusinessDefinition, business: ManagedBusiness) {
  return definition.hqUpgradeBaseCost * Math.pow(3.2, business.hqLevel);
}

export function managementUpgradeCost(definition: BusinessDefinition, kind: 'marketing' | 'operations' | 'quality', business: ManagedBusiness) {
  const level = kind === 'marketing' ? business.marketingLevel : kind === 'operations' ? business.operationsLevel : business.qualityLevel;
  return definition.foundingCost * 0.65 * Math.pow(2.4, level);
}

export function businessEconomics(definition: BusinessDefinition, business: ManagedBusiness): BusinessEconomics {
  if (!business.founded) return { revenuePerSecond: 0, payrollPerSecond: 0, operatingCostPerSecond: 0, profitPerSecond: 0, margin: 0, jobs: 0 };
  const locations = Math.max(1, business.locations);
  const targetEmployees = locations * definition.employeesPerLocation;
  const staffing = targetEmployees > 0 ? Math.min(1, business.employees / targetEmployees) : 1;
  const hqMultiplier = 1 + business.hqLevel * 0.09;
  const marketingMultiplier = 1 + business.marketingLevel * 0.12;
  const qualityMultiplier = 1 + business.qualityLevel * 0.1;
  const operationsMultiplier = Math.max(0.5, 1 - business.operationsLevel * 0.055);
  const revenuePerSecond = definition.baseRevenuePerSecond * locations * (0.35 + staffing * 0.65) * hqMultiplier * marketingMultiplier * qualityMultiplier;
  const payrollPerSecond = business.employees * definition.basePayrollPerEmployee;
  const operatingCostPerSecond = definition.baseRevenuePerSecond * locations * 0.24 * operationsMultiplier;
  const profitPerSecond = revenuePerSecond - payrollPerSecond - operatingCostPerSecond;
  return { revenuePerSecond, payrollPerSecond, operatingCostPerSecond, profitPerSecond, margin: revenuePerSecond > 0 ? profitPerSecond / revenuePerSecond : 0, jobs: business.employees };
}

export function portfolioEconomics(portfolio: BusinessPortfolio): BusinessEconomics {
  return businessDefinitions.reduce<BusinessEconomics>((total, definition) => {
    const current = businessEconomics(definition, portfolio[definition.id] ?? emptyManagedBusiness());
    const revenuePerSecond = total.revenuePerSecond + current.revenuePerSecond;
    const profitPerSecond = total.profitPerSecond + current.profitPerSecond;
    return {
      revenuePerSecond,
      payrollPerSecond: total.payrollPerSecond + current.payrollPerSecond,
      operatingCostPerSecond: total.operatingCostPerSecond + current.operatingCostPerSecond,
      profitPerSecond,
      margin: revenuePerSecond > 0 ? profitPerSecond / revenuePerSecond : 0,
      jobs: total.jobs + current.jobs,
    };
  }, { revenuePerSecond: 0, payrollPerSecond: 0, operatingCostPerSecond: 0, profitPerSecond: 0, margin: 0, jobs: 0 });
}

export function foundedBusinessCount(portfolio: BusinessPortfolio) {
  return Object.values(portfolio).filter((business) => business.founded).length;
}
