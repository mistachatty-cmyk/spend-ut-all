import type { LifeSkillId } from './life-types';

export type IncomeStreamId =
  | 'snack-cooler'
  | 'print-on-demand'
  | 'tool-rental'
  | 'local-ad-page'
  | 'vending-route'
  | 'storage-flips'
  | 'laundromat'
  | 'parking-lot'
  | 'billboard-network'
  | 'warehouse-network'
  | 'data-center'
  | 'investment-fund'
  | 'shipping-empire'
  | 'infrastructure-fund'
  | 'orbital-trade-network';

export type IncomeStreamDefinition = {
  id: IncomeStreamId;
  name: string;
  emoji: string;
  description: string;
  baseCost: number;
  growthRate: number;
  incomePerSecond: number;
  unlockSpent?: number;
  requiredTownLevel?: number;
  requiredRegionLevel?: number;
  requiredSkillId?: LifeSkillId;
  requiredSkillLevel?: number;
};

export type ActiveEarningDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  payout: number;
  unlockSpent?: number;
  requiredTownLevel?: number;
  requiredRegionLevel?: number;
  requiredSkillId?: LifeSkillId;
  requiredSkillLevel?: number;
  rewardSkillId?: LifeSkillId;
  rewardSkillXp?: number;
};
