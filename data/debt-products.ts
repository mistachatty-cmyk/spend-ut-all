import type { DebtProductDefinition } from '@/game/debt-types';

const DAY = 24 * 60;

export const debtProducts: DebtProductDefinition[] = [
  {
    id: 'citywide-personal', name: 'Citywide Personal Loan', emoji: '🏦', creditorName: 'Citywide Bank', creditorType: 'bank',
    description: 'A conventional unsecured bank loan. Miss enough payments and the bank can sue for a judgment.', security: 'unsecured', apr: 0.12,
    baseAmount: 25_000, paymentPercent: 0.08, paymentIntervalGameMinutes: 30 * DAY, graceGameMinutes: 7 * DAY, defaultAfterMisses: 2,
  },
  {
    id: 'community-credit', name: 'Community Credit Loan', emoji: '🤝', creditorName: 'Community Credit Union', creditorType: 'credit-union',
    description: 'Lower-rate unsecured borrowing with a smaller balance and slower escalation.', security: 'unsecured', apr: 0.085,
    baseAmount: 10_000, paymentPercent: 0.07, paymentIntervalGameMinutes: 30 * DAY, graceGameMinutes: 10 * DAY, defaultAfterMisses: 3,
  },
  {
    id: 'quickbridge-private', name: 'QuickBridge Private Note', emoji: '📝', creditorName: 'QuickBridge Capital', creditorType: 'private-lender',
    description: 'Fast expensive money. The lender moves to court quickly when the note goes bad.', security: 'unsecured', apr: 0.30,
    baseAmount: 50_000, paymentPercent: 0.12, paymentIntervalGameMinutes: 14 * DAY, graceGameMinutes: 3 * DAY, defaultAfterMisses: 2,
  },
  {
    id: 'asset-equity', name: 'Asset Equity Loan', emoji: '🔐', creditorName: 'Atlas Asset Finance', creditorType: 'asset-lender',
    description: 'Borrow against an owned item. The pledged asset cannot be sold and can be seized after default.', security: 'item', apr: 0.09,
    baseAmount: 0, paymentPercent: 0.06, paymentIntervalGameMinutes: 30 * DAY, graceGameMinutes: 5 * DAY, defaultAfterMisses: 2, collateralLtv: 0.50,
  },
  {
    id: 'business-expansion', name: 'Business Expansion Facility', emoji: '🏢', creditorName: 'Mercantile Business Bank', creditorType: 'business-lender',
    description: 'A larger unsecured facility for players who already operate a managed company.', security: 'unsecured', apr: 0.16,
    baseAmount: 500_000, paymentPercent: 0.06, paymentIntervalGameMinutes: 30 * DAY, graceGameMinutes: 5 * DAY, defaultAfterMisses: 2, requiresBusiness: true,
  },
];

export const courtConfig = {
  filingDelayGameMinutes: 2 * DAY,
  hearingDelayGameMinutes: 7 * DAY,
  judgmentDelayGameMinutes: 7 * DAY,
  filingFeeRate: 0.03,
  judgmentPenaltyRate: 0.12,
  settlementRate: 0.75,
};
