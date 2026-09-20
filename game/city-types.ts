export type TownBuildingCategory = 'residential' | 'community' | 'municipal';

export type TownBuildingType =
  // Residential
  | 'pioneer-cabins'
  | 'suburban-cottages'
  | 'townhomes'
  | 'midrise-apartments'
  | 'residential-towers'
  | 'eco-arcology'
  // Community & Civic
  | 'community-well'
  | 'medical-clinic'
  | 'schoolhouse-library'
  | 'central-park'
  | 'safety-station'
  | 'sports-complex'
  | 'general-hospital'
  | 'grand-theater'
  // Municipal & Economy
  | 'town-hall'
  | 'farmers-market'
  | 'clean-power-grid'
  | 'water-utility'
  | 'transit-terminal'
  | 'industrial-park'
  | 'cargo-terminal';

export type TownBuildingDefinition = {
  id: TownBuildingType;
  name: string;
  emoji: string;
  category: TownBuildingCategory;
  baseCost: number;
  growthRate: number;
  housingCapacity?: number;
  jobsProvided?: number;
  happinessBonus?: number;
  taxRevenuePerSec?: number;
  upkeepPerSec?: number;
  description: string;
  minTownLevel?: number;
};

export type TownPolicyId =
  | 'open-borders'      // +50% immigration flow, $25/min welcome grant cost
  | 'housing-subsidy'  // +10 happiness, lower housing pressure
  | 'green-initiative' // +8 happiness, clean environment
  | 'tech-incubator';   // +15% jobs revenue, attracts skilled residents

export type CommunityPetition = {
  id: string;
  title: string;
  emoji: string;
  requesterName: string;
  description: string;
  cost: number;
  rewardHappiness: number;
  rewardResidents: number;
  rewardLokTokens?: number;
  status: 'pending' | 'funded' | 'dismissed';
};

export type ImmigrationLogEntry = {
  id: string;
  timestamp: number;
  count: number;
  message: string;
};

export type CityEconomyState = {
  townName: string;
  founded: boolean;
  foundedAt?: number;
  population: number;
  housingUnits: number;
  infrastructureLevel: number;
  lastPopulationUpdate: number;
  buildings: Record<string, number>;
  taxRate: number; // e.g. 0.05 = 5%
  activePolicies: TownPolicyId[];
  festivalEndsAt: number;
  totalImmigrants: number;
  communityGoodwill: number;
  petitions: CommunityPetition[];
  immigrationLog: ImmigrationLogEntry[];
};

export type CityEconomySnapshot = {
  townName: string;
  founded: boolean;
  population: number;
  employed: number;
  availableJobs: number;
  unemploymentRate: number;
  housingCapacity: number;
  housingUnits: number;
  housingPressure: number;
  occupancyRate: number;
  averageWageIndex: number;
  consumerDemand: number;
  costOfLiving: number;
  happiness: number;
  localGdpPerSecond: number;
  laborCostMultiplier: number;
  businessDemandMultiplier: number;
  taxRevenuePerSecond: number;
  immigrationRatePerMinute: number;
  isFestivalActive: boolean;
};
