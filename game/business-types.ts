import type { LifeSkillId } from './life-types';

export type BusinessId =
  | 'solo-service'
  | 'cleaning-service'
  | 'lawn-care'
  | 'mobile-detailing'
  | 'food-cart'
  | 'online-shop'
  | 'creative-agency'
  | 'media-studio'
  | 'tech-consultancy'
  | 'bookkeeping-practice'
  | 'property-services'
  | 'restaurant-group'
  | 'retail-brand'
  | 'software-company'
  | 'hotel-group'
  | 'manufacturing-company'
  | 'media-company'
  | 'banking-group';

export type BusinessDefinition = {
  id: BusinessId;
  name: string;
  emoji: string;
  description: string;
  foundingCost: number;
  baseRevenuePerSecond: number;
  basePayrollPerEmployee: number;
  employeesPerLocation: number;
  locationCost: number;
  locationGrowthRate: number;
  hqUpgradeBaseCost: number;
  requiredTownLevel?: number;
  requiredSkillId?: LifeSkillId;
  requiredSkillLevel?: number;
};

export type ManagedBusiness = {
  founded: boolean;
  locations: number;
  employees: number;
  hqLevel: number;
  marketingLevel: number;
  operationsLevel: number;
  qualityLevel: number;
};

export type BusinessPortfolio = Record<string, ManagedBusiness>;

export type BusinessEconomics = {
  revenuePerSecond: number;
  payrollPerSecond: number;
  operatingCostPerSecond: number;
  profitPerSecond: number;
  margin: number;
  jobs: number;
};