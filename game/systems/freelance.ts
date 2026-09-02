import { freelanceServices, starterFreelanceServiceIds } from '@/data/freelance';
import type { BusinessId } from '../business-types';
import type { FreelanceClient, FreelanceServiceId, FreelanceState } from '../freelance-types';
import type { GameState } from '../types';
import { gainLifeSkillXp, lifeSkillLevel } from './life-progression';

const validServiceIds = new Set(freelanceServices.map(service => service.id));
const clientFirst = ['North','Bright','Green','Copper','Maple','River','Blue','Golden','Cedar','Open','Moon','Stone','Signal','Harbor','Pine','Metro'];
const clientLast = ['Works','Cafe','Studio','Market','Supply','House','Labs','Collective','Services','Workshop','Group','Co','Corner','Partners','Project','Goods'];

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function uniqueServiceIds(ids: FreelanceServiceId[] = []) {
  return [...new Set([...starterFreelanceServiceIds, ...ids.filter(id => validServiceIds.has(id))])] as FreelanceServiceId[];
}

function generatedClient(serviceId: FreelanceServiceId, seed: number): FreelanceClient {
  const first = clientFirst[hashString(`${seed}:${serviceId}:first`) % clientFirst.length];
  const last = clientLast[hashString(`${seed}:${serviceId}:last`) % clientLast.length];
  return {
    id: `client-${serviceId}-${seed}`,
    name: `${first} ${last}`,
    serviceId,
    trust: 45,
    jobsCompleted: 0,
    totalSpend: 0,
  };
}

export function createFreelanceState(): FreelanceState {
  return {
    reputation: 0,
    portfolio: 0,
    completedJobs: 0,
    failedJobs: 0,
    lifetimeRevenue: 0,
    repeatClients: 0,
    knownServiceIds: [...starterFreelanceServiceIds],
    researchCount: 0,
    offerRotation: 0,
    clients: [],
    serviceCooldownUntil: {},
    completedByService: {},
  };
}

export function normalizeFreelance(input?: Partial<FreelanceState> | null): FreelanceState {
  const base = createFreelanceState();
  return {
    ...base,
    ...input,
    reputation: Math.max(0, input?.reputation ?? 0),
    portfolio: Math.max(0, input?.portfolio ?? 0),
    completedJobs: Math.max(0, input?.completedJobs ?? 0),
    failedJobs: Math.max(0, input?.failedJobs ?? 0),
    lifetimeRevenue: Math.max(0, input?.lifetimeRevenue ?? 0),
    repeatClients: Math.max(0, input?.repeatClients ?? 0),
    knownServiceIds: uniqueServiceIds(input?.knownServiceIds),
    researchCount: Math.max(0, input?.researchCount ?? 0),
    offerRotation: Math.max(0, input?.offerRotation ?? 0),
    clients: (input?.clients ?? []).slice(0, 80).map(client => ({
      ...client,
      trust: Math.max(0, Math.min(100, client.trust ?? 45)),
      jobsCompleted: Math.max(0, client.jobsCompleted ?? 0),
      totalSpend: Math.max(0, client.totalSpend ?? 0),
    })),
    serviceCooldownUntil: input?.serviceCooldownUntil ?? {},
    completedByService: input?.completedByService ?? {},
  };
}

export function freelanceServiceDiscovered(state: GameState, serviceId: FreelanceServiceId) {
  const service = freelanceServices.find(candidate => candidate.id === serviceId);
  if (!service) return false;
  if (!state.life.enabled || service.alwaysVisible) return true;

  const freelance = normalizeFreelance(state.freelance);
  if (freelance.knownServiceIds.includes(serviceId)) return true;
  const skill = lifeSkillLevel(state.life, service.skillId);
  return skill >= Math.max(1, service.requiredSkillLevel - 1)
    && freelance.reputation >= Math.max(0, (service.requiredReputation ?? 0) - 3);
}

export function freelanceServiceUnlocked(state: GameState, serviceId: FreelanceServiceId, now = Date.now()) {
  const service = freelanceServices.find(candidate => candidate.id === serviceId);
  if (!service || !freelanceServiceDiscovered(state, serviceId)) return false;
  if (state.runStatus !== 'active') return false;
  const freelance = normalizeFreelance(state.freelance);
  if ((freelance.serviceCooldownUntil[serviceId] ?? 0) > now) return false;
  if (!state.life.enabled) return true;
  return lifeSkillLevel(state.life, service.skillId) >= service.requiredSkillLevel
    && freelance.reputation >= (service.requiredReputation ?? 0);
}

export function discoveredFreelanceServices(state: GameState) {
  return freelanceServices.filter(service => freelanceServiceDiscovered(state, service.id));
}

export function freelanceOffers(state: GameState, size = 6) {
  const freelance = normalizeFreelance(state.freelance);
  const seed = Math.floor(state.activePlayMs / 30_000) + freelance.offerRotation * 97 + freelance.researchCount * 19;
  return discoveredFreelanceServices(state)
    .map(service => ({ service, score: hashString(`${seed}:${service.id}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.max(1, size))
    .map(entry => entry.service);
}

export function rotateFreelanceOffers(state: GameState): GameState {
  const freelance = normalizeFreelance(state.freelance);
  return { ...state, freelance: { ...freelance, offerRotation: freelance.offerRotation + 1 }, updatedAt: Date.now() };
}

export function researchFreelanceServices(state: GameState, discoveries = 2): GameState {
  const freelance = normalizeFreelance(state.freelance);
  const hidden = freelanceServices.filter(service => !freelanceServiceDiscovered(state, service.id));
  const ranked = hidden
    .map(service => {
      const skillGap = Math.max(0, service.requiredSkillLevel - lifeSkillLevel(state.life, service.skillId));
      const reputationGap = Math.max(0, (service.requiredReputation ?? 0) - freelance.reputation);
      return { service, score: skillGap * 100 + reputationGap * 10 + (hashString(`${freelance.researchCount}:${service.id}`) % 100) / 100 };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.max(1, discoveries))
    .map(entry => entry.service.id);

  return {
    ...state,
    freelance: {
      ...freelance,
      knownServiceIds: uniqueServiceIds([...freelance.knownServiceIds, ...ranked]),
      researchCount: freelance.researchCount + 1,
      offerRotation: freelance.offerRotation + 1,
    },
    updatedAt: Date.now(),
  };
}

export function freelancePayoutRange(state: GameState, serviceId: FreelanceServiceId) {
  const service = freelanceServices.find(candidate => candidate.id === serviceId);
  if (!service) return { low: 0, high: 0 };
  const freelance = normalizeFreelance(state.freelance);
  const skill = lifeSkillLevel(state.life, service.skillId);
  const multiplier = 1 + Math.max(0, skill - service.requiredSkillLevel) * 0.06 + Math.min(0.35, freelance.reputation * 0.004);
  return {
    low: Math.max(1, Math.round((service.basePayout - service.payoutVariance * 0.5) * multiplier)),
    high: Math.max(1, Math.round((service.basePayout + service.payoutVariance) * multiplier)),
  };
}

export function performFreelanceJob(state: GameState, serviceId: FreelanceServiceId, now = Date.now()) {
  const service = freelanceServices.find(candidate => candidate.id === serviceId);
  if (!service || !freelanceServiceUnlocked(state, serviceId, now)) {
    return { state, payout: 0, success: false, clientName: '', repeatClient: false };
  }

  const freelance = normalizeFreelance(state.freelance);
  const skill = lifeSkillLevel(state.life, service.skillId);
  const attempt = freelance.completedJobs + freelance.failedJobs + 1;
  const seed = hashString(`${attempt}:${service.id}:${freelance.offerRotation}`);
  const failureChance = skill <= service.requiredSkillLevel ? 0.08 : skill === service.requiredSkillLevel + 1 ? 0.035 : 0.012;
  const failed = (seed % 10_000) / 10_000 < failureChance;
  const matchingClients = freelance.clients.filter(client => client.serviceId === serviceId);
  const repeatChance = Math.min(0.75, 0.2 + freelance.reputation * 0.005 + (matchingClients[0]?.trust ?? 0) * 0.003);
  const repeatClient = matchingClients.length > 0 && ((seed >>> 4) % 10_000) / 10_000 < repeatChance;
  const selectedClient = repeatClient ? matchingClients[seed % matchingClients.length] : generatedClient(serviceId, attempt + seed % 997);

  const range = freelancePayoutRange(state, serviceId);
  const payoutRoll = ((seed >>> 8) % 10_000) / 10_000;
  const payout = failed ? 0 : Math.round(range.low + (range.high - range.low) * payoutRoll);
  const qualityGain = failed ? 0 : Math.min(4, 2 + Math.max(0, skill - service.requiredSkillLevel));
  const nextClient: FreelanceClient = {
    ...selectedClient,
    trust: Math.max(0, Math.min(100, selectedClient.trust + (failed ? -8 : 4 + qualityGain))),
    jobsCompleted: selectedClient.jobsCompleted + (failed ? 0 : 1),
    totalSpend: selectedClient.totalSpend + payout,
  };
  const otherClients = freelance.clients.filter(client => client.id !== selectedClient.id);
  const clients = [...otherClients, nextClient].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 80);
  const completedForService = freelance.completedByService[serviceId] ?? 0;

  const nextFreelance: FreelanceState = {
    ...freelance,
    reputation: Math.max(0, freelance.reputation + (failed ? -1 : qualityGain)),
    portfolio: freelance.portfolio + (failed ? 0 : 1),
    completedJobs: freelance.completedJobs + (failed ? 0 : 1),
    failedJobs: freelance.failedJobs + (failed ? 1 : 0),
    lifetimeRevenue: freelance.lifetimeRevenue + payout,
    repeatClients: freelance.repeatClients + (!failed && repeatClient ? 1 : 0),
    clients,
    serviceCooldownUntil: { ...freelance.serviceCooldownUntil, [serviceId]: now + service.cooldownMs },
    completedByService: { ...freelance.completedByService, [serviceId]: completedForService + (failed ? 0 : 1) },
  };

  const xp = failed ? 4 : 10 + Math.min(18, service.requiredSkillLevel * 3);
  const nextState: GameState = {
    ...state,
    cash: state.cash + payout,
    lifetimeIncome: state.lifetimeIncome + payout,
    life: state.life.enabled ? gainLifeSkillXp(state.life, service.skillId, xp) : state.life,
    freelance: nextFreelance,
    peakCash: Math.max(state.peakCash, state.cash + payout),
    updatedAt: now,
  };

  return { state: nextState, payout, success: !failed, clientName: nextClient.name, repeatClient: !failed && repeatClient };
}

export function freelanceBusinessReadiness(state: GameState, businessId: BusinessId) {
  const freelance = normalizeFreelance(state.freelance);
  const serviceIds = freelanceServices.filter(service => service.targetBusinessId === businessId).map(service => service.id);
  const completedJobs = serviceIds.reduce((total, id) => total + (freelance.completedByService[id] ?? 0), 0);
  const ready = completedJobs >= 6 && freelance.reputation >= 12;
  const discount = ready ? Math.min(0.6, 0.15 + completedJobs * 0.025 + freelance.reputation * 0.003) : 0;
  return { ready, completedJobs, reputation: freelance.reputation, discount };
}