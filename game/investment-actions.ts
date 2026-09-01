import type { InvestmentDefinition } from '@/data/investments';
import type { GameState } from './types';
import { availableBuyingPower, creditLimit } from './systems/risk';

export function investmentUnlocked(state: GameState, investment: InvestmentDefinition) {
  if ((investment.requiredTownLevel ?? 0) > state.townLevel) return false;
  if ((investment.requiredRegionLevel ?? 0) > state.regionLevel) return false;
  return state.runStatus === 'active';
}

export function investmentStake(state: GameState, investment: InvestmentDefinition, fraction: number, currentNetWorth: number) {
  const buyingPower = state.riskMode ? availableBuyingPower(state, currentNetWorth) : Math.max(0, state.cash);
  return Math.max(0, Math.min(buyingPower * Math.max(0.01, Math.min(1, fraction)), buyingPower));
}

export function executeInvestment(state: GameState, investment: InvestmentDefinition, fraction: number, currentNetWorth: number): { state: GameState; returnRate: number; delta: number; stake: number } {
  if (!investmentUnlocked(state, investment)) return { state, returnRate: 0, delta: 0, stake: 0 };
  const stake = investmentStake(state, investment, fraction, currentNetWorth);
  if (stake < investment.minimumStake) return { state, returnRate: 0, delta: 0, stake: 0 };
  const returnRate = investment.minReturn + Math.random() * (investment.maxReturn - investment.minReturn);
  const delta = stake * returnRate;
  const nextCash = state.cash + delta;
  const floor = state.riskMode ? -creditLimit(state, currentNetWorth) : 0;
  const boundedCash = Math.max(floor, nextCash);
  const actualDelta = boundedCash - state.cash;
  const next = { ...state, cash: boundedCash, lifetimeIncome: state.lifetimeIncome + Math.max(0, actualDelta), updatedAt: Date.now() };
  return { state: next, returnRate, delta: actualDelta, stake };
}
