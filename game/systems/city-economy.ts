import { townTiers } from '@/data/content';
import type { BusinessPortfolio } from '../business-types';
import type { CityEconomySnapshot, CityEconomyState } from '../city-types';
import { portfolioEconomics } from './businesses';

export function createCityEconomyState(now = Date.now()): CityEconomyState {
  return { population: 120, housingUnits: 60, infrastructureLevel: 0, lastPopulationUpdate: now };
}

export function normalizeCityEconomy(input: Partial<CityEconomyState> | null | undefined, now = Date.now()): CityEconomyState {
  const base = createCityEconomyState(now);
  return {
    population: Math.max(20, input?.population ?? base.population),
    housingUnits: Math.max(10, input?.housingUnits ?? base.housingUnits),
    infrastructureLevel: Math.max(0, input?.infrastructureLevel ?? 0),
    lastPopulationUpdate: input?.lastPopulationUpdate ?? now,
  };
}

export function cityEconomySnapshot(city: CityEconomyState, portfolio: BusinessPortfolio, townLevel: number): CityEconomySnapshot {
  const portfolioBase = portfolioEconomics(portfolio);
  const tier = townTiers.find((entry) => entry.level === townLevel) ?? townTiers[0];
  const civicJobs = Math.max(15, Math.round((tier.jobs || 0) * 0.15));
  const availableJobs = portfolioBase.jobs + civicJobs;
  const workingAge = Math.max(1, city.population * 0.62);
  const employed = Math.min(workingAge, availableJobs);
  const unemploymentRate = Math.max(0, 1 - employed / workingAge);
  const housingCapacity = city.housingUnits * 2.15;
  const housingPressure = Math.max(0.55, city.population / Math.max(1, housingCapacity));
  const laborTightness = availableJobs / Math.max(1, workingAge);
  const averageWageIndex = Math.max(0.75, Math.min(2.5, 0.9 + laborTightness * 0.55 + city.infrastructureLevel * 0.03));
  const costOfLiving = Math.max(0.7, Math.min(3, 0.82 + housingPressure * 0.42 + city.infrastructureLevel * 0.018));
  const disposableIncome = averageWageIndex / costOfLiving;
  const consumerDemand = Math.max(0.35, Math.min(2.5, (city.population / 2_000) * 0.18 + disposableIncome * 0.82));
  const housingComfort = housingPressure <= 1 ? 1 : Math.max(0.2, 1 - (housingPressure - 1) * 0.45);
  const jobHealth = 1 - Math.min(0.8, unemploymentRate);
  const happiness = Math.max(0, Math.min(100, 35 + housingComfort * 25 + jobHealth * 25 + Math.min(15, city.infrastructureLevel * 1.5)));
  const laborCostMultiplier = Math.max(0.7, Math.min(2.2, averageWageIndex));
  const businessDemandMultiplier = Math.max(0.4, Math.min(2.25, consumerDemand * (0.75 + happiness / 400)));
  const localGdpPerSecond = portfolioBase.revenuePerSecond * businessDemandMultiplier;
  return { population: city.population, employed, availableJobs, unemploymentRate, housingUnits: city.housingUnits, housingPressure, averageWageIndex, consumerDemand, costOfLiving, happiness, localGdpPerSecond, laborCostMultiplier, businessDemandMultiplier };
}

export function advanceCityEconomy(cityInput: CityEconomyState, portfolio: BusinessPortfolio, townLevel: number, deltaMs: number): CityEconomyState {
  const city = normalizeCityEconomy(cityInput);
  const snapshot = cityEconomySnapshot(city, portfolio, townLevel);
  const seconds = Math.max(0, deltaMs / 1000);
  const housingCapacity = city.housingUnits * 2.15;
  const jobCapacity = snapshot.availableJobs / 0.62;
  const desirablePopulation = Math.max(40, Math.min(housingCapacity * 1.08, Math.max(120, jobCapacity * 1.18)));
  const happinessFactor = 0.35 + snapshot.happiness / 100;
  const changePerSecond = (desirablePopulation - city.population) * 0.00018 * happinessFactor;
  const nextPopulation = Math.max(20, city.population + changePerSecond * seconds);
  return { ...city, population: nextPopulation, lastPopulationUpdate: Date.now() };
}

export function housingExpansionCost(city: CityEconomyState) {
  return 250_000 * Math.pow(1.22, Math.max(0, Math.floor((city.housingUnits - 60) / 50)));
}

export function infrastructureUpgradeCost(city: CityEconomyState) {
  return 2_000_000 * Math.pow(2.1, city.infrastructureLevel);
}
