export type CreditorType = 'bank' | 'credit-union' | 'private-lender' | 'asset-lender' | 'business-lender' | 'mortgage-lender';
export type DebtSecurityType = 'unsecured' | 'item' | 'home';
export type DebtStatus = 'current' | 'late' | 'default' | 'paid' | 'seized' | 'judgment';
export type CourtStage = 'filed' | 'hearing' | 'judgment' | 'settled' | 'dismissed';
export type AutopayMode = 'off' | 'minimum' | 'full';

export type DebtProductDefinition = {
  id: string;
  name: string;
  emoji: string;
  creditorName: string;
  creditorType: CreditorType;
  description: string;
  security: DebtSecurityType;
  apr: number;
  baseAmount: number;
  paymentPercent: number;
  paymentIntervalGameMinutes: number;
  graceGameMinutes: number;
  defaultAfterMisses: number;
  collateralLtv?: number;
  requiresBusiness?: boolean;
};

export type ItemDebtCollateral = {
  kind: 'item';
  itemId: string;
  quantity: number;
  pledgedValue: number;
};

export type HomeDebtCollateral = {
  kind: 'home';
  houseLevel: number;
  pledgedValue: number;
};

export type DebtCollateral = ItemDebtCollateral | HomeDebtCollateral;

export type DebtObligation = {
  id: string;
  productId: string;
  creditorName: string;
  creditorType: CreditorType;
  security: DebtSecurityType;
  principal: number;
  balance: number;
  apr: number;
  paymentPercent: number;
  paymentIntervalGameMinutes: number;
  nextPaymentGameMinute: number;
  graceGameMinutes: number;
  defaultAfterMisses: number;
  missedPayments: number;
  status: DebtStatus;
  originatedAtGameMinute: number;
  lastPaymentGameMinute: number;
  defaultedAtGameMinute: number | null;
  collateral: DebtCollateral | null;
  autopayMode: AutopayMode;
  refinanceCount: number;
  refinancedFromIds: string[];
};

export type CourtCase = {
  id: string;
  debtId: string;
  plaintiff: string;
  amountClaimed: number;
  legalFees: number;
  stage: CourtStage;
  filedAtGameMinute: number;
  nextEventGameMinute: number;
  judgmentAmount: number | null;
};

export type DebtState = {
  version: number;
  enabled: boolean;
  lastAdvancedGameMinute: number;
  obligations: DebtObligation[];
  courtCases: CourtCase[];
  creditScore: number;
  lifetimeBorrowed: number;
  lifetimeRepaid: number;
  lifetimeInterest: number;
  lifetimeLegalCosts: number;
  lifetimeDefaults: number;
  lifetimeSeizures: number;
  lifetimeAutopayPaid: number;
  lifetimeRefinanced: number;
  lifetimeConsolidated: number;
  lifetimeForeclosures: number;
};

export type DebtSummary = {
  totalDebt: number;
  currentDebt: number;
  defaultedDebt: number;
  monthlyEquivalentInterest: number;
  activeObligations: number;
  activeCourtCases: number;
  pledgedAssets: number;
  homeLoans: number;
  autopayEnabled: number;
};
