import { courtConfig } from '@/data/debt-products';
import type { CourtCase, DebtCollateral, DebtObligation, DebtState, DebtSummary } from '../debt-types';

export const DEBT_VERSION = 2;
const YEAR_GAME_MINUTES = 365 * 24 * 60;

export function createDebtState(): DebtState {
  return {
    version: DEBT_VERSION,
    enabled: false,
    lastAdvancedGameMinute: 0,
    obligations: [],
    courtCases: [],
    creditScore: 650,
    lifetimeBorrowed: 0,
    lifetimeRepaid: 0,
    lifetimeInterest: 0,
    lifetimeLegalCosts: 0,
    lifetimeDefaults: 0,
    lifetimeSeizures: 0,
    lifetimeAutopayPaid: 0,
    lifetimeRefinanced: 0,
    lifetimeConsolidated: 0,
    lifetimeForeclosures: 0,
  };
}

function finite(value: unknown, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function normalizeObligation(input: DebtObligation): DebtObligation {
  return {
    ...input,
    principal: Math.max(0, finite(input.principal)),
    balance: Math.max(0, finite(input.balance)),
    apr: Math.max(0, finite(input.apr)),
    paymentPercent: Math.max(0.001, finite(input.paymentPercent, 0.08)),
    paymentIntervalGameMinutes: Math.max(1, finite(input.paymentIntervalGameMinutes, 43_200)),
    nextPaymentGameMinute: Math.max(0, finite(input.nextPaymentGameMinute)),
    graceGameMinutes: Math.max(0, finite(input.graceGameMinutes)),
    defaultAfterMisses: Math.max(1, Math.floor(finite(input.defaultAfterMisses, 2))),
    missedPayments: Math.max(0, Math.floor(finite(input.missedPayments))),
    originatedAtGameMinute: Math.max(0, finite(input.originatedAtGameMinute)),
    lastPaymentGameMinute: Math.max(0, finite(input.lastPaymentGameMinute)),
    defaultedAtGameMinute: input.defaultedAtGameMinute == null ? null : Math.max(0, finite(input.defaultedAtGameMinute)),
    collateral: input.collateral ?? null,
    autopayMode: input.autopayMode ?? 'off',
    refinanceCount: Math.max(0, Math.floor(finite(input.refinanceCount))),
    refinancedFromIds: Array.isArray(input.refinancedFromIds) ? input.refinancedFromIds.filter((id) => typeof id === 'string') : [],
  };
}

export function normalizeDebtState(input?: Partial<DebtState> | null): DebtState {
  const base = createDebtState();
  return {
    ...base,
    ...input,
    version: DEBT_VERSION,
    enabled: input?.enabled ?? base.enabled,
    lastAdvancedGameMinute: Math.max(0, finite(input?.lastAdvancedGameMinute)),
    obligations: Array.isArray(input?.obligations) ? input!.obligations.map((entry) => normalizeObligation(entry as DebtObligation)) : [],
    courtCases: Array.isArray(input?.courtCases) ? input!.courtCases.map((entry) => ({
      ...(entry as CourtCase),
      amountClaimed: Math.max(0, finite((entry as CourtCase).amountClaimed)),
      legalFees: Math.max(0, finite((entry as CourtCase).legalFees)),
      filedAtGameMinute: Math.max(0, finite((entry as CourtCase).filedAtGameMinute)),
      nextEventGameMinute: Math.max(0, finite((entry as CourtCase).nextEventGameMinute)),
      judgmentAmount: (entry as CourtCase).judgmentAmount == null ? null : Math.max(0, finite((entry as CourtCase).judgmentAmount)),
    })) : [],
    creditScore: Math.max(300, Math.min(850, Math.round(finite(input?.creditScore, base.creditScore)))),
    lifetimeBorrowed: Math.max(0, finite(input?.lifetimeBorrowed)),
    lifetimeRepaid: Math.max(0, finite(input?.lifetimeRepaid)),
    lifetimeInterest: Math.max(0, finite(input?.lifetimeInterest)),
    lifetimeLegalCosts: Math.max(0, finite(input?.lifetimeLegalCosts)),
    lifetimeDefaults: Math.max(0, Math.floor(finite(input?.lifetimeDefaults))),
    lifetimeSeizures: Math.max(0, Math.floor(finite(input?.lifetimeSeizures))),
    lifetimeAutopayPaid: Math.max(0, finite(input?.lifetimeAutopayPaid)),
    lifetimeRefinanced: Math.max(0, finite(input?.lifetimeRefinanced)),
    lifetimeConsolidated: Math.max(0, finite(input?.lifetimeConsolidated)),
    lifetimeForeclosures: Math.max(0, Math.floor(finite(input?.lifetimeForeclosures))),
  };
}

export function debtMinimumPayment(debt: DebtObligation) {
  return Math.min(debt.balance, Math.max(1, debt.principal * debt.paymentPercent));
}

export function debtSummary(input?: DebtState | null): DebtSummary {
  const debt = normalizeDebtState(input);
  const active = debt.obligations.filter((entry) => !['paid', 'seized'].includes(entry.status) && entry.balance > 0);
  return {
    totalDebt: active.reduce((sum, entry) => sum + entry.balance, 0),
    currentDebt: active.filter((entry) => entry.status === 'current' || entry.status === 'late').reduce((sum, entry) => sum + entry.balance, 0),
    defaultedDebt: active.filter((entry) => entry.status === 'default' || entry.status === 'judgment').reduce((sum, entry) => sum + entry.balance, 0),
    monthlyEquivalentInterest: active.reduce((sum, entry) => sum + entry.balance * entry.apr / 12, 0),
    activeObligations: active.length,
    activeCourtCases: debt.courtCases.filter((entry) => !['settled', 'dismissed'].includes(entry.stage)).length,
    pledgedAssets: active.filter((entry) => !!entry.collateral).length,
    homeLoans: active.filter((entry) => entry.collateral?.kind === 'home').length,
    autopayEnabled: active.filter((entry) => entry.autopayMode !== 'off').length,
  };
}

export function isItemPledged(input: DebtState | null | undefined, itemId: string) {
  return normalizeDebtState(input).obligations.some((entry) => entry.balance > 0 && !['paid', 'seized'].includes(entry.status) && entry.collateral?.kind === 'item' && entry.collateral.itemId === itemId);
}

export function hasHomeLien(input?: DebtState | null) {
  return normalizeDebtState(input).obligations.some((entry) => entry.balance > 0 && !['paid', 'seized'].includes(entry.status) && entry.collateral?.kind === 'home');
}

function accrueInterest(debt: DebtObligation, deltaGameMinutes: number) {
  if (debt.balance <= 0 || ['paid', 'seized'].includes(debt.status)) return { debt, interest: 0 };
  const interest = debt.balance * debt.apr * (Math.max(0, deltaGameMinutes) / YEAR_GAME_MINUTES);
  return { debt: { ...debt, balance: debt.balance + interest }, interest };
}

function makeCourtCase(debt: DebtObligation, gameMinute: number): CourtCase {
  const legalFees = Math.max(250, debt.balance * courtConfig.filingFeeRate);
  return {
    id: `court-${debt.id}`,
    debtId: debt.id,
    plaintiff: debt.creditorName,
    amountClaimed: debt.balance,
    legalFees,
    stage: 'filed',
    filedAtGameMinute: gameMinute,
    nextEventGameMinute: gameMinute + courtConfig.hearingDelayGameMinutes,
    judgmentAmount: null,
  };
}

function autopayAmount(debt: DebtObligation, cashAvailable: number) {
  if (debt.autopayMode === 'off' || cashAvailable <= 0) return 0;
  const minimum = debtMinimumPayment(debt);
  if (debt.autopayMode === 'full' && cashAvailable >= debt.balance) return debt.balance;
  return cashAvailable >= minimum ? minimum : 0;
}

export function advanceDebtState(input: DebtState | null | undefined, previousGameMinute: number, currentGameMinute: number, availableCash = 0) {
  let state = normalizeDebtState(input);
  if (!state.enabled || currentGameMinute <= previousGameMinute) return { debt: { ...state, lastAdvancedGameMinute: Math.max(state.lastAdvancedGameMinute, currentGameMinute) }, seized: [] as DebtCollateral[], cashUsed: 0 };
  const delta = currentGameMinute - previousGameMinute;
  let interestTotal = 0;
  let defaults = 0;
  let autopayPaid = 0;
  let cashRemaining = Math.max(0, availableCash);
  const seized: DebtCollateral[] = [];

  let obligations = state.obligations.map((raw) => {
    let debt = raw;
    const accrued = accrueInterest(debt, delta);
    debt = accrued.debt;
    interestTotal += accrued.interest;
    if (debt.balance <= 0 || ['paid', 'seized'].includes(debt.status)) return debt;

    let safety = 0;
    while (currentGameMinute >= debt.nextPaymentGameMinute && safety < 24 && !['default', 'judgment', 'paid', 'seized'].includes(debt.status)) {
      const autoPayment = autopayAmount(debt, cashRemaining);
      if (autoPayment > 0) {
        cashRemaining -= autoPayment;
        autopayPaid += autoPayment;
        const balance = Math.max(0, debt.balance - autoPayment);
        const paid = balance <= 0.01;
        debt = {
          ...debt,
          balance: paid ? 0 : balance,
          status: paid ? 'paid' : 'current',
          missedPayments: 0,
          lastPaymentGameMinute: debt.nextPaymentGameMinute,
          nextPaymentGameMinute: debt.nextPaymentGameMinute + debt.paymentIntervalGameMinutes,
          defaultedAtGameMinute: null,
        };
      } else {
        debt = { ...debt, missedPayments: debt.missedPayments + 1, status: 'late', nextPaymentGameMinute: debt.nextPaymentGameMinute + debt.paymentIntervalGameMinutes };
      }
      safety += 1;
    }

    const lastDue = debt.nextPaymentGameMinute - debt.paymentIntervalGameMinutes;
    if (!['default', 'judgment', 'paid', 'seized'].includes(debt.status) && debt.missedPayments >= debt.defaultAfterMisses && currentGameMinute >= lastDue + debt.graceGameMinutes) {
      debt = { ...debt, status: 'default', defaultedAtGameMinute: currentGameMinute };
      defaults += 1;
    }

    if (debt.status === 'default' && debt.security !== 'unsecured' && debt.collateral && debt.defaultedAtGameMinute != null && currentGameMinute >= debt.defaultedAtGameMinute + debt.graceGameMinutes) {
      seized.push(debt.collateral);
      debt = { ...debt, status: 'seized', balance: 0 };
    }
    return debt;
  });

  let courtCases = [...state.courtCases];
  for (const debt of obligations) {
    if (debt.status !== 'default' || debt.security !== 'unsecured' || debt.defaultedAtGameMinute == null) continue;
    if (currentGameMinute < debt.defaultedAtGameMinute + courtConfig.filingDelayGameMinutes) continue;
    if (!courtCases.some((entry) => entry.debtId === debt.id)) courtCases.push(makeCourtCase(debt, currentGameMinute));
  }

  let legalCosts = 0;
  courtCases = courtCases.map((raw) => {
    let court = raw;
    if (court.stage === 'filed' && currentGameMinute >= court.nextEventGameMinute) {
      court = { ...court, stage: 'hearing', nextEventGameMinute: currentGameMinute + courtConfig.judgmentDelayGameMinutes };
    }
    if (court.stage === 'hearing' && currentGameMinute >= court.nextEventGameMinute) {
      const debt = obligations.find((entry) => entry.id === court.debtId);
      if (debt && debt.balance > 0) {
        const judgment = debt.balance * (1 + courtConfig.judgmentPenaltyRate) + court.legalFees;
        obligations = obligations.map((entry) => entry.id === debt.id ? { ...entry, status: 'judgment', balance: judgment } : entry);
        legalCosts += court.legalFees;
        court = { ...court, stage: 'judgment', judgmentAmount: judgment, amountClaimed: judgment, nextEventGameMinute: 0 };
      } else {
        court = { ...court, stage: 'dismissed', nextEventGameMinute: 0 };
      }
    }
    return court;
  });

  const foreclosures = seized.filter((entry) => entry.kind === 'home').length;
  state = normalizeDebtState({
    ...state,
    lastAdvancedGameMinute: currentGameMinute,
    obligations,
    courtCases,
    creditScore: state.creditScore - defaults * 90 - seized.length * 35 + (autopayPaid > 0 ? 1 : 0),
    lifetimeInterest: state.lifetimeInterest + interestTotal,
    lifetimeLegalCosts: state.lifetimeLegalCosts + legalCosts,
    lifetimeDefaults: state.lifetimeDefaults + defaults,
    lifetimeSeizures: state.lifetimeSeizures + seized.length,
    lifetimeForeclosures: state.lifetimeForeclosures + foreclosures,
    lifetimeRepaid: state.lifetimeRepaid + autopayPaid,
    lifetimeAutopayPaid: state.lifetimeAutopayPaid + autopayPaid,
  });
  return { debt: state, seized, cashUsed: autopayPaid };
}
