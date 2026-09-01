import { courtConfig } from '@/data/debt-products';
import type { CourtRepresentation } from './debt-types';
import type { GameState } from './types';
import { normalizeDebtState } from './systems/debt';

const DAY = 24 * 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function debtOf(state: GameState) {
  return normalizeDebtState(state.debt);
}

export function counselQuote(state: GameState, caseId: string, representation: Exclude<CourtRepresentation, 'self'>) {
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court || ['settled', 'dismissed'].includes(court.stage)) return null;
  const local = representation === 'local-counsel';
  const fee = local ? Math.max(500, court.amountClaimed * 0.015) : Math.max(5_000, court.amountClaimed * 0.04);
  const settlementDiscount = local ? 0.05 : 0.12;
  return { fee, settlementDiscount, representation };
}

export function hireCourtCounsel(state: GameState, caseId: string, representation: Exclude<CourtRepresentation, 'self'>): GameState {
  const quote = counselQuote(state, caseId, representation);
  if (!quote || state.cash < quote.fee) return state;
  const debt = debtOf(state);
  const courtCases = debt.courtCases.map((entry) => entry.id === caseId ? {
    ...entry,
    representation,
    settlementDiscount: Math.max(entry.settlementDiscount ?? 0, quote.settlementDiscount),
    legalSpend: (entry.legalSpend ?? 0) + quote.fee,
    lastAction: representation === 'elite-firm' ? 'Elite counsel retained' : 'Local counsel retained',
  } : entry);
  return {
    ...state,
    cash: state.cash - quote.fee,
    debt: normalizeDebtState({ ...debt, courtCases, lifetimeLegalCosts: debt.lifetimeLegalCosts + quote.fee }),
    updatedAt: Date.now(),
  };
}

export function continuanceQuote(state: GameState, caseId: string) {
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court || !['filed', 'hearing'].includes(court.stage) || (court.continuances ?? 0) >= 2) return null;
  const fee = Math.max(150, court.amountClaimed * 0.002);
  const days = (court.representation ?? 'self') === 'elite-firm' ? 7 : 3;
  return { fee, delayGameMinutes: days * DAY, days };
}

export function requestCourtContinuance(state: GameState, caseId: string): GameState {
  const quote = continuanceQuote(state, caseId);
  if (!quote || state.cash < quote.fee) return state;
  const debt = debtOf(state);
  const courtCases = debt.courtCases.map((entry) => entry.id === caseId ? {
    ...entry,
    continuances: (entry.continuances ?? 0) + 1,
    nextEventGameMinute: entry.nextEventGameMinute + quote.delayGameMinutes,
    legalSpend: (entry.legalSpend ?? 0) + quote.fee,
    lastAction: `Continuance granted · +${quote.days} days`,
  } : entry);
  return {
    ...state,
    cash: state.cash - quote.fee,
    debt: normalizeDebtState({ ...debt, courtCases, lifetimeLegalCosts: debt.lifetimeLegalCosts + quote.fee }),
    updatedAt: Date.now(),
  };
}

export function courtSettlementQuote(state: GameState, caseId: string) {
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court || ['settled', 'dismissed'].includes(court.stage)) return null;
  const obligation = debt.obligations.find((entry) => entry.id === court.debtId);
  if (!obligation || obligation.balance <= 0) return null;
  const stageRate = court.stage === 'judgment' ? 0.90 : courtConfig.settlementRate;
  const discount = clamp(court.settlementDiscount ?? 0, 0, 0.20);
  const amount = Math.min(obligation.balance, court.amountClaimed * stageRate * (1 - discount));
  return { amount, discount, affordable: state.cash >= amount };
}

export function settleCourtCaseNegotiated(state: GameState, caseId: string): GameState {
  const quote = courtSettlementQuote(state, caseId);
  if (!quote || !quote.affordable) return state;
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court) return state;
  const obligations = debt.obligations.map((entry) => entry.id === court.debtId ? {
    ...entry,
    balance: 0,
    status: 'paid' as const,
    missedPayments: 0,
    defaultedAtGameMinute: null,
    autopayMode: 'off' as const,
  } : entry);
  const courtCases = debt.courtCases.map((entry) => entry.id === caseId ? {
    ...entry,
    stage: 'settled' as const,
    nextEventGameMinute: 0,
    lastAction: `Settled for ${Math.round((1 - quote.discount) * 100)}% of negotiated basis`,
  } : entry);
  return {
    ...state,
    cash: state.cash - quote.amount,
    debt: normalizeDebtState({
      ...debt,
      obligations,
      courtCases,
      lifetimeRepaid: debt.lifetimeRepaid + quote.amount,
      creditScore: debt.creditScore + 4,
    }),
    updatedAt: Date.now(),
  };
}

export function courtPaymentPlanQuote(state: GameState, caseId: string) {
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court || !['filed', 'hearing'].includes(court.stage)) return null;
  const obligation = debt.obligations.find((entry) => entry.id === court.debtId);
  if (!obligation || obligation.balance <= 0) return null;
  const setupFee = Math.max(100, court.legalFees * 0.5);
  const newBalance = obligation.balance + setupFee;
  const apr = clamp(obligation.apr, 0.08, 0.18);
  const minimum = Math.max(25, newBalance * 0.05);
  return { setupFee, newBalance, apr, minimum };
}

export function acceptCourtPaymentPlan(state: GameState, caseId: string): GameState {
  const quote = courtPaymentPlanQuote(state, caseId);
  if (!quote) return state;
  const debt = debtOf(state);
  const court = debt.courtCases.find((entry) => entry.id === caseId);
  if (!court) return state;
  const obligations = debt.obligations.map((entry) => entry.id === court.debtId ? {
    ...entry,
    principal: quote.newBalance,
    balance: quote.newBalance,
    apr: quote.apr,
    paymentPercent: 0.05,
    paymentIntervalGameMinutes: 30 * DAY,
    nextPaymentGameMinute: state.time.gameMinute + 30 * DAY,
    graceGameMinutes: 7 * DAY,
    defaultAfterMisses: 2,
    missedPayments: 0,
    status: 'current' as const,
    defaultedAtGameMinute: null,
    autopayMode: 'minimum' as const,
  } : entry);
  const courtCases = debt.courtCases.map((entry) => entry.id === caseId ? {
    ...entry,
    stage: 'settled' as const,
    paymentPlan: true,
    nextEventGameMinute: 0,
    lastAction: 'Court payment plan accepted',
  } : entry);
  return {
    ...state,
    debt: normalizeDebtState({
      ...debt,
      obligations,
      courtCases,
      lifetimeLegalCosts: debt.lifetimeLegalCosts + quote.setupFee,
      creditScore: debt.creditScore - 5,
    }),
    updatedAt: Date.now(),
  };
}
