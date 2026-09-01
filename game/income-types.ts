export type IncomeStreamId =
  | 'vending-route'
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
};
