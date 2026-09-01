import type { ActiveEarningDefinition, IncomeStreamDefinition } from '@/game/income-types';

export const activeEarnings: ActiveEarningDefinition[] = [
  { id: 'odd-job', name: 'Odd Job', emoji: '🧰', description: 'Do a quick local job for pocket money.', payout: 25 },
  { id: 'freelance', name: 'Freelance Project', emoji: '🎨', description: 'Take on a small client project.', payout: 250, unlockSpent: 100 },
  { id: 'consulting', name: 'Consulting Contract', emoji: '💼', description: 'Sell expertise for a much larger check.', payout: 5_000, unlockSpent: 10_000 },
  { id: 'broker-deal', name: 'Broker a Deal', emoji: '🤝', description: 'Put together a serious commercial transaction.', payout: 1_000_000, unlockSpent: 5_000_000 },
  { id: 'mega-deal', name: 'Close a Mega Deal', emoji: '🏛️', description: 'Coordinate a city-scale transaction.', payout: 250_000_000, requiredTownLevel: 3 },
  { id: 'sovereign-deal', name: 'Sovereign Development Deal', emoji: '🌐', description: 'Arrange infrastructure and capital at national scale.', payout: 25_000_000_000, requiredRegionLevel: 2 },
  { id: 'planetary-contract', name: 'Planetary Contract', emoji: '🪐', description: 'One signature moves civilization-scale money.', payout: 5_000_000_000_000, requiredRegionLevel: 5 },
];

export const incomeStreams: IncomeStreamDefinition[] = [
  { id: 'vending-route', name: 'Vending Route', emoji: '🥤', description: 'A tiny route of machines making money all day.', baseCost: 2_500, growthRate: 1.12, incomePerSecond: 0.35 },
  { id: 'laundromat', name: 'Laundromat', emoji: '🧺', description: 'A neighborhood cash-flow business.', baseCost: 90_000, growthRate: 1.14, incomePerSecond: 3.2, unlockSpent: 5_000 },
  { id: 'parking-lot', name: 'Parking Lot', emoji: '🅿️', description: 'Simple property income with very little drama.', baseCost: 450_000, growthRate: 1.15, incomePerSecond: 14, unlockSpent: 50_000 },
  { id: 'billboard-network', name: 'Billboard Network', emoji: '📣', description: 'Monetize attention across a growing city.', baseCost: 4_000_000, growthRate: 1.16, incomePerSecond: 135, unlockSpent: 500_000 },
  { id: 'warehouse-network', name: 'Warehouse Network', emoji: '📦', description: 'Storage and logistics across multiple districts.', baseCost: 40_000_000, growthRate: 1.17, incomePerSecond: 1_650, requiredTownLevel: 1 },
  { id: 'data-center', name: 'Data Center', emoji: '🖧', description: 'Rent compute and infrastructure at industrial scale.', baseCost: 600_000_000, growthRate: 1.18, incomePerSecond: 35_000, requiredTownLevel: 3 },
  { id: 'investment-fund', name: 'Investment Fund', emoji: '📈', description: 'A giant pool of capital producing diversified returns.', baseCost: 18_000_000_000, growthRate: 1.2, incomePerSecond: 900_000, requiredTownLevel: 4 },
  { id: 'shipping-empire', name: 'Global Shipping Empire', emoji: '🚢', description: 'Ports, fleets, freight contracts and global trade.', baseCost: 350_000_000_000, growthRate: 1.22, incomePerSecond: 28_000_000, requiredRegionLevel: 1 },
  { id: 'infrastructure-fund', name: 'Sovereign Infrastructure Fund', emoji: '🏗️', description: 'Own pieces of entire national infrastructure systems.', baseCost: 12_000_000_000_000, growthRate: 1.24, incomePerSecond: 1_500_000_000, requiredRegionLevel: 3 },
  { id: 'orbital-trade-network', name: 'Orbital Trade Network', emoji: '🛰️', description: 'Control high-value commerce between Earth and off-world economies.', baseCost: 900_000_000_000_000, growthRate: 1.26, incomePerSecond: 150_000_000_000, requiredRegionLevel: 5 },
];
