import type { MarketEvent } from '@/game/types';

export const worldEvents: MarketEvent[] = [
  { id: 'energy-glut', name: 'Energy Glut', emoji: '🔋', description: 'Power prices collapse and operating costs fall across the economy.', incomeMultiplier: 1.06, upkeepMultiplier: 0.72, durationMs: 50_000 },
  { id: 'labor-crunch', name: 'Labor Crunch', emoji: '🧑‍🏭', description: 'Hiring gets difficult and wages rise faster than revenue.', incomeMultiplier: 0.97, upkeepMultiplier: 1.24, durationMs: 55_000 },
  { id: 'infrastructure-grant', name: 'Infrastructure Grant', emoji: '🏗️', description: 'Public investment boosts trade, construction, and regional demand.', incomeMultiplier: 1.22, upkeepMultiplier: 0.9, durationMs: 60_000 },
  { id: 'trade-blockage', name: 'Trade Blockage', emoji: '🚢', description: 'Shipping lanes choke, inventories tighten, and logistics costs jump.', incomeMultiplier: 0.84, upkeepMultiplier: 1.28, durationMs: 45_000 },
  { id: 'ai-productivity-rush', name: 'AI Productivity Rush', emoji: '🧠', description: 'Automation boosts output and temporarily improves margins.', incomeMultiplier: 1.3, upkeepMultiplier: 0.82, durationMs: 45_000 },
  { id: 'tourism-wave', name: 'Tourism Wave', emoji: '🧳', description: 'A travel boom floods cities, hotels, retail, and entertainment with demand.', incomeMultiplier: 1.26, upkeepMultiplier: 1.03, durationMs: 55_000 },
  { id: 'credit-squeeze', name: 'Credit Squeeze', emoji: '🏦', description: 'Financing tightens and businesses become cautious with spending.', incomeMultiplier: 0.79, upkeepMultiplier: 1.04, durationMs: 60_000 },
  { id: 'construction-boom', name: 'Construction Boom', emoji: '🏙️', description: 'Development accelerates and the surrounding economy heats up.', incomeMultiplier: 1.24, upkeepMultiplier: 1.1, durationMs: 50_000 },
  { id: 'commodity-crash', name: 'Commodity Crash', emoji: '🛢️', description: 'Raw material prices plunge, easing costs but weakening some demand.', incomeMultiplier: 0.96, upkeepMultiplier: 0.74, durationMs: 45_000 },
  { id: 'weather-disruption', name: 'Severe Weather Disruption', emoji: '⛈️', description: 'Transport slows and operations become temporarily more expensive.', incomeMultiplier: 0.86, upkeepMultiplier: 1.2, durationMs: 40_000 },
  { id: 'consumer-confidence', name: 'Consumer Confidence Surge', emoji: '🛍️', description: 'Households spend freely and brands enjoy a broad demand lift.', incomeMultiplier: 1.28, upkeepMultiplier: 1.04, durationMs: 55_000 },
  { id: 'automation-backlash', name: 'Automation Backlash', emoji: '🪧', description: 'Regulatory and labor resistance slows productivity for a while.', incomeMultiplier: 0.9, upkeepMultiplier: 1.16, durationMs: 50_000 },
];
