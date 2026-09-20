import { townTiers } from '@/data/content';
import { defaultPetitions, townBuildings } from '@/data/town-content';
import type { BusinessPortfolio } from '../business-types';
import type {
  CityEconomySnapshot,
  CityEconomyState,
  CommunityPetition,
  TownBuildingDefinition,
  TownPolicyId,
} from '../city-types';
import type { GameState } from '../types';
import { portfolioEconomics } from './businesses';
import { getFameTier } from './fame';
import { addFame } from '../fame-actions';

export function createCityEconomyState(now = Date.now(), initialPopulation = 0): CityEconomyState {
  return {
    townName: initialPopulation > 0 ? 'Frontier Settlement' : 'Uncharted Settlement',
    founded: initialPopulation > 0,
    foundedAt: initialPopulation > 0 ? now : undefined,
    population: initialPopulation,
    housingUnits: Math.max(0, Math.round(initialPopulation / 2)),
    infrastructureLevel: 0,
    lastPopulationUpdate: now,
    buildings: {},
    taxRate: 0.05,
    activePolicies: [],
    festivalEndsAt: 0,
    totalImmigrants: initialPopulation,
    communityGoodwill: 50,
    petitions: defaultPetitions.map((p) => ({ ...p })),
    immigrationLog:
      initialPopulation > 0
        ? [
            {
              id: `immig-${now}`,
              timestamp: now,
              count: initialPopulation,
              message: `${initialPopulation} initial residents established homes in the district.`,
            },
          ]
        : [],
  };
}

export function normalizeCityEconomy(
  input: Partial<CityEconomyState> | null | undefined,
  now = Date.now(),
): CityEconomyState {
  const base = createCityEconomyState(now, 0);
  const buildings = input?.buildings ?? {};
  const hasBuildings = Object.values(buildings).some((v) => v > 0);
  const rawPop = input?.population ?? 0;
  const isFounded = input?.founded ?? (rawPop > 0 || hasBuildings);

  return {
    townName: input?.townName || (isFounded ? 'Emerald Valley' : 'Uncharted Settlement'),
    founded: isFounded,
    foundedAt: input?.foundedAt ?? (isFounded ? now : undefined),
    population: Math.max(0, rawPop),
    housingUnits: Math.max(0, input?.housingUnits ?? 0),
    infrastructureLevel: Math.max(0, input?.infrastructureLevel ?? 0),
    lastPopulationUpdate: input?.lastPopulationUpdate ?? now,
    buildings,
    taxRate: Math.max(0, Math.min(0.25, input?.taxRate ?? 0.05)),
    activePolicies: input?.activePolicies ?? [],
    festivalEndsAt: input?.festivalEndsAt ?? 0,
    totalImmigrants: Math.max(0, input?.totalImmigrants ?? rawPop),
    communityGoodwill: Math.max(0, Math.min(100, input?.communityGoodwill ?? 50)),
    petitions:
      input?.petitions && input.petitions.length > 0
        ? input.petitions
        : defaultPetitions.map((p) => ({ ...p })),
    immigrationLog: input?.immigrationLog ?? [],
  };
}

export function getBuildingCount(city: CityEconomyState, buildingId: string): number {
  return city.buildings[buildingId] ?? 0;
}

export function townBuildingCost(city: CityEconomyState, building: TownBuildingDefinition): number {
  const owned = getBuildingCount(city, building.id);
  return Math.round(building.baseCost * Math.pow(building.growthRate, owned));
}

export function cityEconomySnapshot(
  cityInput: CityEconomyState,
  portfolio: BusinessPortfolio,
  townLevel: number,
  now = Date.now(),
  famePoints = 0,
): CityEconomySnapshot {
  const city = normalizeCityEconomy(cityInput, now);
  const portfolioBase = portfolioEconomics(portfolio);
  const tier = townTiers.find((entry) => entry.level === townLevel) ?? townTiers[0];

  // Calculate built housing capacity
  let builtHousingCapacity = 0;
  let builtJobs = 0;
  let builtHappiness = 0;
  let builtTaxRevenue = 0;

  for (const b of townBuildings) {
    const count = getBuildingCount(city, b.id);
    if (count > 0) {
      if (b.housingCapacity) builtHousingCapacity += b.housingCapacity * count;
      if (b.jobsProvided) builtJobs += b.jobsProvided * count;
      if (b.happinessBonus) builtHappiness += b.happinessBonus * count;
      if (b.taxRevenuePerSec) builtTaxRevenue += b.taxRevenuePerSec * count;
    }
  }

  // Legacy fallback housing capacity if no buildings yet but legacy housingUnits > 0
  const legacyCapacity = city.housingUnits * 2.15;
  const housingCapacity = Math.max(builtHousingCapacity, legacyCapacity);

  // Available jobs in town
  const civicJobs = Math.max(city.founded ? 10 : 0, Math.round((tier.jobs || 0) * 0.15));
  const availableJobs = portfolioBase.jobs + civicJobs + builtJobs;

  const workingAge = Math.max(0, Math.round(city.population * 0.65));
  const employed = Math.min(workingAge, availableJobs);
  const unemploymentRate = workingAge > 0 ? Math.max(0, 1 - employed / workingAge) : 0;

  const housingPressure = housingCapacity > 0 ? city.population / housingCapacity : city.population > 0 ? 3 : 0;
  const occupancyRate = housingCapacity > 0 ? Math.min(1, city.population / housingCapacity) : 0;

  const laborTightness = workingAge > 0 ? availableJobs / workingAge : 1;
  const averageWageIndex = Math.max(
    0.75,
    Math.min(2.5, 0.9 + laborTightness * 0.55 + city.infrastructureLevel * 0.03),
  );

  // Policy bonuses
  let policyHappinessBonus = 0;
  if (city.activePolicies.includes('housing-subsidy')) policyHappinessBonus += 12;
  if (city.activePolicies.includes('green-initiative')) policyHappinessBonus += 10;
  if (city.activePolicies.includes('tech-incubator')) policyHappinessBonus += 5;

  const isFestivalActive = city.festivalEndsAt > now;
  const festivalHappinessBonus = isFestivalActive ? 25 : 0;

  // Tax penalty on happiness: 5% is neutral, >5% reduces happiness, <5% boosts it
  const taxHappinessImpact = (0.05 - city.taxRate) * 100;

  // Housing comfort
  const housingComfort = housingPressure <= 1 ? 1 : Math.max(0.1, 1 - (housingPressure - 1) * 0.5);
  const jobHealth = workingAge > 0 ? 1 - Math.min(0.8, unemploymentRate) : 1;

  const happiness = Math.max(
    5,
    Math.min(
      100,
      35 +
        builtHappiness * 0.8 +
        housingComfort * 20 +
        jobHealth * 20 +
        policyHappinessBonus +
        festivalHappinessBonus +
        taxHappinessImpact +
        Math.min(15, city.infrastructureLevel * 1.5),
    ),
  );

  const costOfLiving = Math.max(
    0.7,
    Math.min(3, 0.82 + housingPressure * 0.42 + city.infrastructureLevel * 0.018),
  );
  const disposableIncome = averageWageIndex / costOfLiving;
  const consumerDemand = Math.max(
    0.35,
    Math.min(2.5, (city.population / 2_000) * 0.18 + disposableIncome * 0.82),
  );

  const laborCostMultiplier = Math.max(0.7, Math.min(2.2, averageWageIndex));
  const businessDemandMultiplier = Math.max(0.4, Math.min(2.25, consumerDemand * (0.75 + happiness / 400)));
  const localGdpPerSecond = portfolioBase.revenuePerSecond * businessDemandMultiplier;

  // Citizen tax revenue
  const citizenTaxRevenue = employed * 0.04 * averageWageIndex * (city.taxRate / 0.05);
  const taxRevenuePerSecond = Math.max(0, builtTaxRevenue + citizenTaxRevenue);

  // Immigration flow rate per minute
  let immigrationRatePerMinute = 0;
  if (city.founded && housingCapacity > city.population) {
    const vacancy = housingCapacity - city.population;
    const baseFlow = Math.max(0.5, Math.min(vacancy * 0.12, 1 + vacancy * 0.04));
    const jobAttraction = Math.max(0.4, Math.min(2.0, availableJobs / Math.max(1, workingAge)));
    const happinessFactor = Math.max(0.2, happiness / 80);
    const policyMultiplier = city.activePolicies.includes('open-borders') ? 1.6 : 1.0;
    const festivalMultiplier = isFestivalActive ? 1.5 : 1.0;

    // Has transit terminal?
    const hasTransit = (city.buildings['transit-terminal'] ?? 0) > 0;
    const transitMultiplier = hasTransit ? 1.5 : 1.0;

    const fameMultiplier = 1 + getFameTier(famePoints).immigrationBonusPct;

    immigrationRatePerMinute = baseFlow * jobAttraction * happinessFactor * policyMultiplier * festivalMultiplier * transitMultiplier * fameMultiplier;
  }

  return {
    townName: city.townName,
    founded: city.founded,
    population: Math.round(city.population),
    employed: Math.round(employed),
    availableJobs: Math.round(availableJobs),
    unemploymentRate,
    housingCapacity: Math.round(housingCapacity),
    housingUnits: city.housingUnits,
    housingPressure,
    occupancyRate,
    averageWageIndex,
    consumerDemand,
    costOfLiving,
    happiness: Math.round(happiness),
    localGdpPerSecond,
    laborCostMultiplier,
    businessDemandMultiplier,
    taxRevenuePerSecond,
    immigrationRatePerMinute: Math.round(immigrationRatePerMinute * 10) / 10,
    isFestivalActive,
  };
}

export function advanceCityEconomy(
  cityInput: CityEconomyState,
  portfolio: BusinessPortfolio,
  townLevel: number,
  deltaMs: number,
  now = Date.now(),
  famePoints = 0,
): CityEconomyState {
  const city = normalizeCityEconomy(cityInput, now);
  if (!city.founded) return city;

  const snapshot = cityEconomySnapshot(city, portfolio, townLevel, now, famePoints);
  const seconds = Math.max(0, deltaMs / 1000);

  // Calculate immigration delta
  let newResidents = 0;
  if (snapshot.housingCapacity > city.population) {
    const immigrantsThisTick = (snapshot.immigrationRatePerMinute / 60) * seconds;
    if (immigrantsThisTick > 0) {
      newResidents = Math.min(snapshot.housingCapacity - city.population, immigrantsThisTick);
    }
  }

  const nextPopulation = Math.min(snapshot.housingCapacity, city.population + newResidents);
  const totalImmigrants = city.totalImmigrants + newResidents;

  // Periodic log entry if significant people arrived
  let immigrationLog = city.immigrationLog;
  if (Math.floor(nextPopulation) > Math.floor(city.population)) {
    const arrived = Math.floor(nextPopulation) - Math.floor(city.population);
    if (arrived >= 5 || (city.population === 0 && arrived >= 1)) {
      const newEntry = {
        id: `immig-${now}-${Math.random()}`,
        timestamp: now,
        count: arrived,
        message: `${arrived} new resident${arrived > 1 ? 's' : ''} moved into ${city.townName}.`,
      };
      immigrationLog = [newEntry, ...immigrationLog.slice(0, 19)];
    }
  }

  return {
    ...city,
    population: nextPopulation,
    totalImmigrants,
    lastPopulationUpdate: now,
    immigrationLog,
  };
}

export function foundTown(state: GameState, townName: string, now = Date.now()): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const name = townName.trim() || 'Emerald Bay';

  const welcomeEntry = {
    id: `found-${now}`,
    timestamp: now,
    count: 0,
    message: `Town Charter established! ${name} was officially founded.`,
  };

  const nextCity: CityEconomyState = {
    ...city,
    townName: name,
    founded: true,
    foundedAt: now,
    immigrationLog: [welcomeEntry, ...city.immigrationLog],
  };

  return {
    ...state,
    townLevel: Math.max(1, state.townLevel),
    cityEconomy: nextCity,
    updatedAt: now,
  };
}

export function buyTownBuilding(
  state: GameState,
  building: TownBuildingDefinition,
  now = Date.now(),
): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const cost = townBuildingCost(city, building);
  if (state.cash < cost) return state;

  const currentCount = getBuildingCount(city, building.id);
  const nextBuildings = {
    ...city.buildings,
    [building.id]: currentCount + 1,
  };

  // If building provides housing, also bump legacy housingUnits
  let nextHousingUnits = city.housingUnits;
  if (building.housingCapacity) {
    nextHousingUnits += Math.round(building.housingCapacity / 2.15);
  }

  const nextCity: CityEconomyState = {
    ...city,
    buildings: nextBuildings,
    housingUnits: nextHousingUnits,
    totalImmigrants: city.totalImmigrants,
  };

  return {
    ...state,
    cash: state.cash - cost,
    totalSpent: state.totalSpent + cost,
    lowestCash: Math.min(state.lowestCash, state.cash - cost),
    cityEconomy: nextCity,
    updatedAt: now,
  };
}

export function toggleTownPolicy(state: GameState, policyId: TownPolicyId, now = Date.now()): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const exists = city.activePolicies.includes(policyId);
  const nextPolicies = exists
    ? city.activePolicies.filter((p) => p !== policyId)
    : [...city.activePolicies, policyId];

  return {
    ...state,
    cityEconomy: {
      ...city,
      activePolicies: nextPolicies,
    },
    updatedAt: now,
  };
}

export function setTownTaxRate(state: GameState, rate: number, now = Date.now()): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const clamped = Math.max(0, Math.min(0.25, Math.round(rate * 100) / 100));
  return {
    ...state,
    cityEconomy: {
      ...city,
      taxRate: clamped,
    },
    updatedAt: now,
  };
}

export function hostTownFestival(state: GameState, now = Date.now()): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const festivalCost = Math.max(2_500, Math.round(city.population * 25));
  if (state.cash < festivalCost) return state;

  const festivalDurationMs = 5 * 60_000; // 5 minutes
  const festivalEntry = {
    id: `fest-${now}`,
    timestamp: now,
    count: 0,
    message: `Grand Town Festival launched! Music, parades, and food carts flood the streets.`,
  };

  const baseState: GameState = {
    ...state,
    cash: state.cash - festivalCost,
    totalSpent: state.totalSpent + festivalCost,
    lowestCash: Math.min(state.lowestCash, state.cash - festivalCost),
    cityEconomy: {
      ...city,
      festivalEndsAt: now + festivalDurationMs,
      communityGoodwill: Math.min(100, city.communityGoodwill + 15),
      immigrationLog: [festivalEntry, ...city.immigrationLog],
    },
    updatedAt: now,
  };

  return addFame(baseState, 350, now);
}

export function fundCommunityPetition(
  state: GameState,
  petitionId: string,
  now = Date.now(),
): GameState {
  const city = normalizeCityEconomy(state.cityEconomy, now);
  const petition = city.petitions.find((p) => p.id === petitionId);
  if (!petition || petition.status === 'funded' || state.cash < petition.cost) return state;

  const updatedPetitions = city.petitions.map((p) =>
    p.id === petitionId ? ({ ...p, status: 'funded' } as CommunityPetition) : p,
  );

  const newResidents = petition.rewardResidents || 0;
  const petitionEntry = {
    id: `pet-${now}`,
    timestamp: now,
    count: newResidents,
    message: `Funded "${petition.title}"! Citizens rejoice and ${newResidents} new residents joined the town.`,
  };

  const baseState: GameState = {
    ...state,
    cash: state.cash - petition.cost,
    totalSpent: state.totalSpent + petition.cost,
    lowestCash: Math.min(state.lowestCash, state.cash - petition.cost),
    lokTokens: state.lokTokens + (petition.rewardLokTokens || 0),
    cityEconomy: {
      ...city,
      population: city.population + newResidents,
      totalImmigrants: city.totalImmigrants + newResidents,
      communityGoodwill: Math.min(100, city.communityGoodwill + petition.rewardHappiness),
      petitions: updatedPetitions,
      immigrationLog: [petitionEntry, ...city.immigrationLog],
    },
    updatedAt: now,
  };

  const fameBonus = Math.max(50, (petition.rewardHappiness || 5) * 15);
  return addFame(baseState, fameBonus, now);
}

export function housingExpansionCost(city: CityEconomyState): number {
  return Math.round(25_000 * Math.pow(1.18, Math.floor((city.housingUnits ?? 0) / 50)));
}

export function infrastructureUpgradeCost(city: CityEconomyState): number {
  return Math.round(75_000 * Math.pow(1.35, city.infrastructureLevel ?? 1));
}

