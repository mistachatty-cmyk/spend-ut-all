export type InvestmentDefinition = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  minimumStake: number;
  minReturn: number;
  maxReturn: number;
  requiredTownLevel?: number;
  requiredRegionLevel?: number;
};

export const investments: InvestmentDefinition[] = [
  { id: 'safe-reserve', name: 'Safe Reserve', emoji: '🛡️', description: 'Low-volatility fictional reserve strategy.', minimumStake: 1_000, minReturn: -0.05, maxReturn: 0.08 },
  { id: 'growth-fund', name: 'Growth Fund', emoji: '📊', description: 'Moderate upside with meaningful drawdown risk.', minimumStake: 25_000, minReturn: -0.25, maxReturn: 0.35 },
  { id: 'venture-basket', name: 'Venture Basket', emoji: '🚀', description: 'High-risk private-company bets with wide outcomes.', minimumStake: 1_000_000, minReturn: -0.65, maxReturn: 1.2, requiredTownLevel: 1 },
  { id: 'moonshot-fund', name: 'Moonshot Fund', emoji: '🌙', description: 'Extreme fictional speculation. It can rescue or wreck a run.', minimumStake: 1_000_000_000, minReturn: -1, maxReturn: 4, requiredRegionLevel: 1 },
];
