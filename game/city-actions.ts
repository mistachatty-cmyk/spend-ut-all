import type { GameState } from './types';
import { housingExpansionCost, infrastructureUpgradeCost, normalizeCityEconomy } from './systems/city-economy';

export function addHousing(state: GameState, units = 50): GameState {
  const city = normalizeCityEconomy(state.cityEconomy);
  const cost = housingExpansionCost(city);
  if (units <= 0 || state.cash < cost) return state;
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, cityEconomy: { ...city, housingUnits: city.housingUnits + units }, updatedAt: Date.now() };
}

export function upgradeInfrastructure(state: GameState): GameState {
  const city = normalizeCityEconomy(state.cityEconomy);
  const cost = infrastructureUpgradeCost(city);
  if (state.cash < cost) return state;
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, cityEconomy: { ...city, infrastructureLevel: city.infrastructureLevel + 1 }, updatedAt: Date.now() };
}
