import { hqTiers } from '@/data/businesses';
import type { BusinessDefinition } from './business-types';
import type { GameState } from './types';
import { businessEconomics, emptyManagedBusiness, hqUpgradeCost, locationCost, managementUpgradeCost } from './systems/businesses';

function currentBusiness(state: GameState, definition: BusinessDefinition) {
  return state.businesses?.[definition.id] ?? emptyManagedBusiness();
}

export function foundBusiness(state: GameState, definition: BusinessDefinition): GameState {
  const current = currentBusiness(state, definition);
  if (current.founded || state.cash < definition.foundingCost || state.townLevel < (definition.requiredTownLevel ?? 0)) return state;
  const employees = definition.employeesPerLocation;
  return { ...state, cash: state.cash - definition.foundingCost, totalSpent: state.totalSpent + definition.foundingCost, businesses: { ...state.businesses, [definition.id]: { ...current, founded: true, locations: 1, employees } }, updatedAt: Date.now() };
}

export function addBusinessLocation(state: GameState, definition: BusinessDefinition): GameState {
  const current = currentBusiness(state, definition);
  if (!current.founded) return state;
  const cost = locationCost(definition, current);
  if (state.cash < cost) return state;
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, businesses: { ...state.businesses, [definition.id]: { ...current, locations: current.locations + 1, employees: current.employees + definition.employeesPerLocation } }, updatedAt: Date.now() };
}

export function hireEmployees(state: GameState, definition: BusinessDefinition, quantity: number): GameState {
  const current = currentBusiness(state, definition);
  if (!current.founded || quantity <= 0) return state;
  const capacity = current.locations * definition.employeesPerLocation * 2;
  const nextEmployees = Math.min(capacity, current.employees + quantity);
  if (nextEmployees === current.employees) return state;
  return { ...state, businesses: { ...state.businesses, [definition.id]: { ...current, employees: nextEmployees } }, updatedAt: Date.now() };
}

export function reduceEmployees(state: GameState, definition: BusinessDefinition, quantity: number): GameState {
  const current = currentBusiness(state, definition);
  if (!current.founded || quantity <= 0) return state;
  return { ...state, businesses: { ...state.businesses, [definition.id]: { ...current, employees: Math.max(0, current.employees - quantity) } }, updatedAt: Date.now() };
}

export function upgradeBusinessHq(state: GameState, definition: BusinessDefinition): GameState {
  const current = currentBusiness(state, definition);
  if (!current.founded || current.hqLevel >= hqTiers.length - 1) return state;
  const cost = hqUpgradeCost(definition, current);
  if (state.cash < cost) return state;
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, businesses: { ...state.businesses, [definition.id]: { ...current, hqLevel: current.hqLevel + 1 } }, updatedAt: Date.now() };
}

export function upgradeBusinessManagement(state: GameState, definition: BusinessDefinition, kind: 'marketing' | 'operations' | 'quality'): GameState {
  const current = currentBusiness(state, definition);
  if (!current.founded) return state;
  const cost = managementUpgradeCost(definition, kind, current);
  if (state.cash < cost) return state;
  const key = kind === 'marketing' ? 'marketingLevel' : kind === 'operations' ? 'operationsLevel' : 'qualityLevel';
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, businesses: { ...state.businesses, [definition.id]: { ...current, [key]: current[key] + 1 } }, updatedAt: Date.now() };
}

export function businessCanAffordLocation(state: GameState, definition: BusinessDefinition) {
  return state.cash >= locationCost(definition, currentBusiness(state, definition));
}

export function businessSnapshot(state: GameState, definition: BusinessDefinition) {
  const business = currentBusiness(state, definition);
  return { business, economics: businessEconomics(definition, business) };
}
