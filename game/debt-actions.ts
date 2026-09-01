import { courtConfig, debtProducts } from '@/data/debt-products';
import { items } from '@/data/content';
import type { DebtObligation, DebtProductDefinition } from './debt-types';
import type { GameState } from './types';
import { foundedBusinessCount } from './systems/businesses';
import { debtMinimumPayment, debtSummary, isItemPledged, normalizeDebtState } from './systems/debt';

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function debtOf(state: GameState) { return normalizeDebtState(state.debt); }

export function setDebtSystemEnabled(state: GameState, enabled: boolean): GameState {
  const current = debtOf(state);
  const summary = debtSummary(current);
  if (!enabled && (summary.totalDebt > 0 || summary.activeCourtCases > 0)) return state;
  return { ...state, debt: { ...current, enabled, lastAdvancedGameMinute: state.time.gameMinute }, updatedAt: Date.now() };
}

export function collateralCandidates(state: GameState) {
  const current = debtOf(state);
  return items.filter((item) => {
    const owned = state.owned[item.id] ?? 0;
    return owned > 0 && item.basePrice >= 1_000 && !isItemPledged(current, item.id);
  }).map((item) => ({ ...item, pledgedValue: item.basePrice * state.rules.economy.purchasePriceMultiplier }));
}

export function canBorrowProduct(state: GameState, product: DebtProductDefinition, collateralItemId?: string) {
  const current = debtOf(state);
  if (!current.enabled || state.runStatus !== 'active') return false;
  if (current.creditScore < 420) return false;
  if (product.requiresBusiness && foundedBusinessCount(state.businesses ?? {}) < 1) return false;
  if (debtSummary(current).activeObligations >= 12) return false;
  if (product.security === 'item') return !!collateralCandidates(state).find((item) => item.id === collateralItemId);
  return true;
}

export function estimatedBorrowAmount(state: GameState, product: DebtProductDefinition, collateralItemId?: string) {
  const current = debtOf(state);
  if (product.security === 'item') {
    const item = collateralCandidates(state).find((entry) => entry.id === collateralItemId);
    return item ? Math.max(1_000, item.pledgedValue * (product.collateralLtv ?? 0.5)) : 0;
  }
  const creditFactor = clamp((current.creditScore - 400) / 250, 0.55, 1.35);
  return Math.max(100, product.baseAmount * creditFactor);
}

export function borrowFromProduct(state: GameState, productId: string, collateralItemId?: string): GameState {
  const product = debtProducts.find((entry) => entry.id === productId);
  if (!product || !canBorrowProduct(state, product, collateralItemId)) return state;
  const amount = estimatedBorrowAmount(state, product, collateralItemId);
  if (amount <= 0) return state;
  const current = debtOf(state);
  const collateralItem = product.security === 'item' ? collateralCandidates(state).find((entry) => entry.id === collateralItemId) : null;
  const gameMinute = state.time.gameMinute;
  const obligation: DebtObligation = {
    id: `debt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId: product.id,
    creditorName: product.creditorName,
    creditorType: product.creditorType,
    security: product.security,
    principal: amount,
    balance: amount,
    apr: product.apr,
    paymentPercent: product.paymentPercent,
    paymentIntervalGameMinutes: product.paymentIntervalGameMinutes,
    nextPaymentGameMinute: gameMinute + product.paymentIntervalGameMinutes,
    graceGameMinutes: product.graceGameMinutes,
    defaultAfterMisses: product.defaultAfterMisses,
    missedPayments: 0,
    status: 'current',
    originatedAtGameMinute: gameMinute,
    lastPaymentGameMinute: gameMinute,
    defaultedAtGameMinute: null,
    collateral: collateralItem ? { kind: 'item', itemId: collateralItem.id, quantity: 1, pledgedValue: collateralItem.pledgedValue } : null,
  };
  const debt = normalizeDebtState({
    ...current,
    lastAdvancedGameMinute: gameMinute,
    obligations: [...current.obligations, obligation],
    lifetimeBorrowed: current.lifetimeBorrowed + amount,
  });
  return { ...state, debt, cash: state.cash + amount, peakCash: Math.max(state.peakCash, state.cash + amount), updatedAt: Date.now() };
}

export function repayDebt(state: GameState, debtId: string, requestedAmount: number): GameState {
  if (state.runStatus !== 'active' || state.cash <= 0) return state;
  const current = debtOf(state);
  const debt = current.obligations.find((entry) => entry.id === debtId);
  if (!debt || debt.balance <= 0 || ['paid', 'seized'].includes(debt.status)) return state;
  const payment = Math.min(state.cash, debt.balance, Math.max(0, requestedAmount));
  if (payment <= 0) return state;
  const balance = Math.max(0, debt.balance - payment);
  const paid = balance <= 0.01;
  const obligations = current.obligations.map((entry) => entry.id === debtId ? {
    ...entry,
    balance: paid ? 0 : balance,
    status: paid ? 'paid' as const : entry.status === 'late' ? 'current' as const : entry.status,
    missedPayments: paid ? 0 : Math.max(0, entry.missedPayments - 1),
    lastPaymentGameMinute: state.time.gameMinute,
    nextPaymentGameMinute: entry.status === 'late' ? state.time.gameMinute + entry.paymentIntervalGameMinutes : entry.nextPaymentGameMinute,
  } : entry);
  const courtCases = paid ? current.courtCases.map((entry) => entry.debtId === debtId && entry.stage !== 'judgment' ? { ...entry, stage: 'dismissed' as const, nextEventGameMinute: 0 } : entry) : current.courtCases;
  return {
    ...state,
    cash: state.cash - payment,
    debt: normalizeDebtState({
      ...current,
      lastAdvancedGameMinute: state.time.gameMinute,
      obligations,
      courtCases,
      creditScore: current.creditScore + (paid ? 8 : 2),
      lifetimeRepaid: current.lifetimeRepaid + payment,
    }),
    updatedAt: Date.now(),
  };
}

export function repayMinimum(state: GameState, debtId: string) {
  const debt = debtOf(state).obligations.find((entry) => entry.id === debtId);
  return debt ? repayDebt(state, debtId, debtMinimumPayment(debt)) : state;
}

export function settleCourtCase(state: GameState, caseId: string): GameState {
  const current = debtOf(state);
  const court = current.courtCases.find((entry) => entry.id === caseId);
  if (!court || ['settled', 'dismissed'].includes(court.stage)) return state;
  const debt = current.obligations.find((entry) => entry.id === court.debtId);
  if (!debt || debt.balance <= 0) return state;
  const settlement = Math.min(debt.balance, court.amountClaimed * courtConfig.settlementRate);
  if (state.cash < settlement) return state;
  return {
    ...state,
    cash: state.cash - settlement,
    debt: normalizeDebtState({
      ...current,
      lastAdvancedGameMinute: state.time.gameMinute,
      obligations: current.obligations.map((entry) => entry.id === debt.id ? { ...entry, balance: 0, status: 'paid' as const, missedPayments: 0 } : entry),
      courtCases: current.courtCases.map((entry) => entry.id === caseId ? { ...entry, stage: 'settled' as const, nextEventGameMinute: 0 } : entry),
      lifetimeRepaid: current.lifetimeRepaid + settlement,
      creditScore: current.creditScore + 4,
    }),
    updatedAt: Date.now(),
  };
}
