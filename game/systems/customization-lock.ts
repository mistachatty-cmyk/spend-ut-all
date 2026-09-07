import type { CustomizationDefinition } from '../customization-types';

export const requirementNames: Record<string, string> = {
  'wolf-risk-billionaire': 'Wolf With No Net achievement',
  'spendutall-super': 'SPENDUTALL super achievement',
  'debt-billion-comeback': 'Resurrected Empire achievement',
  'nothing-millionaire': 'Self-Made Millionaire achievement',
  'region-planetary': 'Planetary Economy progression',
};

export function lockInfo(item: CustomizationDefinition, wallet: { balance: number; lifetimeEarned: number }) {
  const lokBuyable = item.acquisition.includes('lok') && typeof item.lokPrice === 'number';
  const requirement = item.requirementId ? requirementNames[item.requirementId] ?? item.requirementId : null;
  const lifetimeRequired = item.lokLifetimeRequired ?? 0;
  const lifetimeReady = wallet.lifetimeEarned >= lifetimeRequired;
  const canAfford = wallet.balance >= (item.lokPrice ?? 0);
  return { lokBuyable, requirement, lifetimeRequired, lifetimeReady, canAfford };
}
