import type { GameState } from '../types';
import type { CivicFocus, DiplomacyPartner, WorldEventChoice, WorldMilestone, WorldPlanet, WorldPolicyId, WorldProjectId, WorldResourceId, WorldScale, WorldState } from '../world-types';

export const civicFocuses: { id: CivicFocus; name: string; icon: string; description: string }[] = [
  { id: 'creative', name: 'Creative', icon: '🎨', description: 'Music, festivals, galleries and distinctive streets.' },
  { id: 'builder', name: 'Builder', icon: '🏗️', description: 'Infrastructure, industry and reliable connections.' },
  { id: 'scholar', name: 'Scholar', icon: '📚', description: 'Research, education and a living archive.' },
  { id: 'care', name: 'Care', icon: '🌿', description: 'Health, parks and strong neighborhoods.' },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Expeditions, discovery and new frontiers.' },
  { id: 'commerce', name: 'Commerce', icon: '🏪', description: 'Markets, trade and bustling business districts.' },
];

export const worldResourceInfo: Record<WorldResourceId, { name: string; icon: string; description: string }> = {
  culture: { name: 'Culture', icon: '✦', description: 'Earned through art, events and creative civic work.' },
  knowledge: { name: 'Knowledge', icon: '◈', description: 'Earned through schools, archives and discovery.' },
  care: { name: 'Care', icon: '♥', description: 'Earned through gardens, services and support.' },
  influence: { name: 'Influence', icon: '⌁', description: 'Earned through cities, compacts and charters.' },
  discovery: { name: 'Discovery', icon: '✧', description: 'Earned through exploration and planetary work.' },
};

export const worldProjects: { id: WorldProjectId; name: string; icon: string; cost: number; description: string; requirement: string; available: (state: GameState) => boolean; goodwill: number; reward: Partial<Record<WorldResourceId, number>> }[] = [
  { id: 'sound-booth', name: 'Sound Booth', icon: '🎵', cost: 12_000, description: 'Open a music venue and gathering place.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 3, reward: { culture: 4 } },
  { id: 'lokpet-sanctuary', name: 'Lokpet Sanctuary', icon: '🐾', cost: 18_000, description: 'Give companions a home and a place to train.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 3, reward: { care: 4, discovery: 1 } },
  { id: 'card-quarter', name: 'Card Quarter', icon: '🃏', cost: 22_000, description: 'Make a collector street around the card shop.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 2, reward: { culture: 2, influence: 1 } },
  { id: 'garden', name: 'Community Garden', icon: '🌱', cost: 8_000, description: 'Grow a public green space with the residents.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 5, reward: { care: 5 } },
  { id: 'workshop', name: 'Maker Workshop', icon: '🛠️', cost: 35_000, description: 'Turn skills and local ideas into a maker district.', requirement: 'Build a town hall', available: s => (s.cityEconomy.buildings['town-hall'] ?? 0) > 0, goodwill: 2, reward: { knowledge: 3, culture: 1 } },
  { id: 'commons', name: 'The Commons', icon: '🎪', cost: 50_000, description: 'A central space for resident events and festivals.', requirement: 'Build a central park', available: s => (s.cityEconomy.buildings['central-park'] ?? 0) > 0, goodwill: 5, reward: { culture: 2, care: 2 } },
  { id: 'regional-rail', name: 'Regional Rail', icon: '🚆', cost: 2_000_000_000_000, description: 'Connect the capital to your other cities.', requirement: 'Metro Region and a second city', available: s => s.regionLevel >= 1 && (s.world?.cities.length ?? 0) > 0, goodwill: 4, reward: { influence: 8, knowledge: 2 } },
  { id: 'civic-archive', name: 'Civic Archive', icon: '🏛️', cost: 500_000_000, description: 'Preserve the civilization’s history and culture.', requirement: 'Civilization charter', available: s => (s.world?.milestones.includes('civilization') ?? false), goodwill: 3, reward: { knowledge: 8, culture: 4 } },
  { id: 'orbital-observatory', name: 'Orbital Observatory', icon: '🔭', cost: 8_000_000_000_000, description: 'Survey nearby worlds before an expedition.', requirement: 'Planet stewardship', available: s => (s.world?.milestones.includes('planet') ?? false), goodwill: 2, reward: { discovery: 12, knowledge: 5 } },
];

export const worldPolicies: { id: WorldPolicyId; name: string; icon: string; description: string; requirement: (s: GameState) => boolean; upkeep: number; effect: Partial<Record<WorldResourceId, number>> }[] = [
  { id: 'open-studios', name: 'Open Studios', icon: '🎭', description: 'Make creative spaces accessible across the capital.', requirement: s => !!s.world?.focus, upkeep: 0, effect: { culture: 1 } },
  { id: 'green-covenant', name: 'Green Covenant', icon: '🌿', description: 'Protect public land and restore local ecology.', requirement: s => (s.world?.projects.includes('garden') ?? false), upkeep: 0, effect: { care: 1 } },
  { id: 'learning-guarantee', name: 'Learning Guarantee', icon: '📖', description: 'Fund universal access to civic knowledge.', requirement: s => (s.cityEconomy.buildings['schoolhouse-library'] ?? 0) > 0, upkeep: 0, effect: { knowledge: 1 } },
  { id: 'trade-compact', name: 'Trade Compact', icon: '🤝', description: 'Build a trusted network for exchange and partnerships.', requirement: s => (s.world?.milestones.includes('country') ?? false), upkeep: 0, effect: { influence: 1 } },
  { id: 'frontier-charter', name: 'Frontier Charter', icon: '🛰️', description: 'Prioritize exploration, scouting and new connections.', requirement: s => (s.world?.milestones.includes('planet') ?? false), upkeep: 0, effect: { discovery: 1 } },
  { id: 'public-works', name: 'Public Works', icon: '⚒️', description: 'Coordinate big projects across every linked city.', requirement: s => (s.world?.cities.length ?? 0) >= 2, upkeep: 0, effect: { influence: 1, care: 1 } },
];

export const diplomacyPartners: Omit<DiplomacyPartner, 'trust' | 'compact'>[] = [
  { id: 'aurelian-freeports', name: 'Aurelian Freeports', icon: '⚓', specialty: 'commerce' },
  { id: 'meridian-assembly', name: 'Meridian Assembly', icon: '🏛️', specialty: 'scholar' },
  { id: 'verdant-collective', name: 'Verdant Collective', icon: '🌿', specialty: 'care' },
  { id: 'orbit-makers', name: 'Orbit Makers Guild', icon: '🛠️', specialty: 'builder' },
];

export const worldMilestones: { id: WorldMilestone; name: string; icon: string; cost: number; requirement: string; description: string; resources: Partial<Record<WorldResourceId, number>> }[] = [
  { id: 'civilization', name: 'Civilization Charter', icon: '🏛️', cost: 1_000_000_000, requirement: 'Small City, 3 civic projects, a focus, 5 Culture and 5 Care', description: 'Give your society a lasting identity and record its history.', resources: { culture: 5, care: 5 } },
  { id: 'country', name: 'Country Charter', icon: '🗺️', cost: 50_000_000_000_000, requirement: 'National Power, a linked city, a civilization and 10 Influence', description: 'Unite your capital and satellite cities under one country.', resources: { influence: 10 } },
  { id: 'empire', name: 'Empire Accord', icon: '👑', cost: 250_000_000_000_000, requirement: 'Global Network, a country, two diplomatic compacts and a Maker Workshop', description: 'Connect regions through diplomacy, trade and cultural reach.', resources: { influence: 2, knowledge: 3 } },
  { id: 'planet', name: 'Planet Stewardship', icon: '🌎', cost: 1_500_000_000_000_000, requirement: 'Planetary Economy, empire, rail, a Lokpet Sanctuary and Discovery', description: 'Coordinate your home world as a planetary civilization.', resources: { discovery: 1, care: 6 } },
];

const emptyResources = (): Record<WorldResourceId, number> => ({ culture: 0, knowledge: 0, care: 0, influence: 0, discovery: 0 });
const resourceIds = Object.keys(worldResourceInfo) as WorldResourceId[];
const validFocus = (value: unknown): value is CivicFocus => civicFocuses.some(f => f.id === value);
const validPolicy = (value: unknown): value is WorldPolicyId => worldPolicies.some(p => p.id === value);
const cleanName = (name: unknown) => typeof name === 'string' ? name.trim().slice(0, 32) : '';

export function createWorldState(): WorldState { return { focus: null, projects: [], milestones: [], cities: [], planets: [], policies: [], resources: emptyResources(), diplomacy: diplomacyPartners.map(p => ({ ...p, trust: 0, compact: false })), resolvedEventIds: [] }; }

export function normalizeWorld(input: Partial<WorldState> | null | undefined): WorldState {
  const projectIds = new Set(worldProjects.map(p => p.id));
  const milestoneIds = new Set(worldMilestones.map(m => m.id));
  const diplomacyById = new Map((Array.isArray(input?.diplomacy) ? input.diplomacy : []).filter(Boolean).map(p => [p.id, p]));
  const resources = emptyResources();
  for (const id of resourceIds) resources[id] = Math.max(0, Math.floor(Number(input?.resources?.[id]) || 0));
  return {
    focus: validFocus(input?.focus) ? input!.focus : null,
    projects: [...new Set((Array.isArray(input?.projects) ? input.projects : []).filter(id => projectIds.has(id)))],
    milestones: [...new Set((Array.isArray(input?.milestones) ? input.milestones : []).filter(id => milestoneIds.has(id)))],
    cities: (Array.isArray(input?.cities) ? input.cities : []).filter(c => c && cleanName(c.name) && validFocus(c.specialty)).slice(0, 12).map((c, i) => ({ id: `city-${i + 1}`, name: cleanName(c.name), specialty: c.specialty, foundedAt: Number.isFinite(c.foundedAt) ? c.foundedAt : 0, foundedAtGameMinute: Number.isFinite(c.foundedAtGameMinute) ? c.foundedAtGameMinute : 0, level: Number.isFinite(c.level) ? Math.max(1, Math.min(4, Math.floor(c.level))) : 1, projects: Array.isArray(c.projects) ? [...new Set(c.projects.filter(x => typeof x === 'string').slice(0, 6))] : [] })),
    planets: (Array.isArray(input?.planets) ? input.planets : []).filter(p => p && cleanName(p.name)).slice(0, 8).map((p, i) => ({ id: `planet-${i + 1}`, name: cleanName(p.name), biome: typeof p.biome === 'string' ? p.biome.slice(0, 24) : 'Unknown', foundedAt: Number.isFinite(p.foundedAt) ? p.foundedAt : 0, level: Number.isFinite(p.level) ? Math.max(1, Math.min(4, Math.floor(p.level))) : 1, traits: Array.isArray(p.traits) ? p.traits.filter(x => typeof x === 'string').slice(0, 4) : [], stability: Math.max(0, Math.min(100, Math.floor(Number(p.stability) || 55))) })),
    policies: [...new Set((Array.isArray(input?.policies) ? input.policies : []).filter(validPolicy))], resources,
    diplomacy: diplomacyPartners.map(p => { const old = diplomacyById.get(p.id); return { ...p, trust: Math.max(0, Math.min(100, Math.floor(Number(old?.trust) || 0))), compact: Boolean(old?.compact) }; }),
    resolvedEventIds: [...new Set((Array.isArray(input?.resolvedEventIds) ? input.resolvedEventIds : []).filter(x => typeof x === 'string').slice(-40))],
  };
}

function changeResources(world: WorldState, rewards: Partial<Record<WorldResourceId, number>>, multiplier = 1): WorldState { const resources = { ...world.resources }; for (const id of resourceIds) resources[id] += Math.max(0, Math.floor((rewards[id] ?? 0) * multiplier)); return { ...world, resources }; }
function canAffordResources(world: WorldState, costs: Partial<Record<WorldResourceId, number>>) { return resourceIds.every(id => world.resources[id] >= (costs[id] ?? 0)); }
function spendResources(world: WorldState, costs: Partial<Record<WorldResourceId, number>>) { const resources = { ...world.resources }; for (const id of resourceIds) resources[id] -= costs[id] ?? 0; return { ...world, resources }; }

export function worldScale(state: GameState): WorldScale { const w = normalizeWorld(state.world); if (w.planets.length) return 'universe'; if (w.milestones.includes('planet')) return 'planet'; if (w.milestones.includes('empire')) return 'empire'; if (w.milestones.includes('country')) return 'country'; if (w.milestones.includes('civilization')) return 'civilization'; if (state.townLevel >= 4) return 'city'; return 'town'; }
export function chooseCivicFocus(state: GameState, focus: CivicFocus): GameState { if (!state.cityEconomy.founded || state.runStatus !== 'active' || !validFocus(focus)) return state; return { ...state, world: { ...normalizeWorld(state.world), focus }, updatedAt: Date.now() }; }
export function canFundWorldProject(state: GameState, id: WorldProjectId): boolean { const p = worldProjects.find(x => x.id === id); const w = normalizeWorld(state.world); return !!p && state.runStatus === 'active' && !w.projects.includes(id) && p.available(state) && state.cash >= p.cost; }
export function fundWorldProject(state: GameState, id: WorldProjectId): GameState { if (!canFundWorldProject(state, id)) return state; const p = worldProjects.find(x => x.id === id)!; const w = changeResources(normalizeWorld(state.world), p.reward); return { ...state, cash: state.cash - p.cost, totalSpent: state.totalSpent + p.cost, lowestCash: Math.min(state.lowestCash, state.cash - p.cost), cityEconomy: { ...state.cityEconomy, communityGoodwill: Math.min(100, state.cityEconomy.communityGoodwill + p.goodwill) }, world: { ...w, projects: [...w.projects, id] }, updatedAt: Date.now() }; }

export function toggleWorldPolicy(state: GameState, id: WorldPolicyId): GameState { const policy = worldPolicies.find(x => x.id === id); const w = normalizeWorld(state.world); if (!policy || state.runStatus !== 'active' || !policy.requirement(state)) return state; return { ...state, world: { ...w, policies: w.policies.includes(id) ? w.policies.filter(x => x !== id) : [...w.policies, id] }, updatedAt: Date.now() }; }
export function canFoundSatelliteCity(state: GameState): boolean { const w = normalizeWorld(state.world); return state.runStatus === 'active' && state.townLevel >= 5 && state.regionLevel >= 1 && w.cities.length < 12 && state.cash >= 750_000_000_000 * (w.cities.length + 1); }
export function foundSatelliteCity(state: GameState, name: string, specialty: CivicFocus): GameState { const cleaned = cleanName(name); if (!canFoundSatelliteCity(state) || !cleaned || !validFocus(specialty)) return state; const w = normalizeWorld(state.world); if (cleaned.toLowerCase() === state.cityEconomy.townName.toLowerCase() || w.cities.some(c => c.name.toLowerCase() === cleaned.toLowerCase())) return state; const cost = 750_000_000_000 * (w.cities.length + 1); return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, lowestCash: Math.min(state.lowestCash, state.cash - cost), world: changeResources({ ...w, cities: [...w.cities, { id: `city-${w.cities.length + 1}`, name: cleaned, specialty, foundedAt: Date.now(), foundedAtGameMinute: state.time.gameMinute, level: 1, projects: [] }] }, { influence: 3 }), updatedAt: Date.now() }; }
export function satelliteCityUpgradeCost(level: number): number { return 400_000_000_000 * Math.pow(4, level - 1); }
export function developSatelliteCity(state: GameState, id: string): GameState { const w = normalizeWorld(state.world); const city = w.cities.find(c => c.id === id); if (!city || city.level >= 4 || state.runStatus !== 'active' || state.cash < satelliteCityUpgradeCost(city.level)) return state; const cost = satelliteCityUpgradeCost(city.level); return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, lowestCash: Math.min(state.lowestCash, state.cash - cost), world: changeResources({ ...w, cities: w.cities.map(c => c.id === id ? { ...c, level: c.level + 1 } : c) }, { influence: 2, care: 1 }), updatedAt: Date.now() }; }
export function satelliteCitySnapshot(city: WorldState['cities'][number], gameMinute: number, dayLengthMinutes: number) { const days = Math.max(0, (gameMinute - city.foundedAtGameMinute) / Math.max(1, dayLengthMinutes)); const capacity = [0, 15_000, 100_000, 600_000, 2_500_000][city.level]; const population = Math.min(capacity, Math.floor(capacity * (0.18 + 0.82 * (1 - Math.exp(-days / 12))))); return { population, capacity, jobs: Math.floor(population * (city.specialty === 'commerce' || city.specialty === 'builder' ? .58 : .48)), prosperity: Math.min(100, 35 + city.level * 12 + city.projects.length * 5) }; }

export function openCityInitiative(state: GameState, cityId: string, initiative: string): GameState { const w = normalizeWorld(state.world); const city = w.cities.find(c => c.id === cityId); const cost = 150_000_000_000 * (city?.projects.length ?? 0 + 1); if (!city || city.projects.includes(initiative) || city.projects.length >= 6 || state.cash < cost || state.runStatus !== 'active') return state; return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, lowestCash: Math.min(state.lowestCash, state.cash - cost), world: changeResources({ ...w, cities: w.cities.map(c => c.id === cityId ? { ...c, projects: [...c.projects, initiative] } : c) }, { culture: 1, care: 1, influence: 1 }), updatedAt: Date.now() }; }

export function formDiplomaticCompact(state: GameState, partnerId: string): GameState { const w = normalizeWorld(state.world); const partner = w.diplomacy.find(x => x.id === partnerId); if (!partner || partner.compact || !w.milestones.includes('country') || partner.trust < 60 || w.resources.influence < 4 || state.runStatus !== 'active') return state; const next = spendResources(w, { influence: 4 }); return { ...state, world: { ...next, diplomacy: next.diplomacy.map(x => x.id === partnerId ? { ...x, compact: true } : x) }, updatedAt: Date.now() }; }
export function buildDiplomaticTrust(state: GameState, partnerId: string): GameState { const w = normalizeWorld(state.world); const partner = w.diplomacy.find(x => x.id === partnerId); if (!partner || partner.trust >= 100 || state.cash < 250_000_000 || state.runStatus !== 'active') return state; return { ...state, cash: state.cash - 250_000_000, totalSpent: state.totalSpent + 250_000_000, lowestCash: Math.min(state.lowestCash, state.cash - 250_000_000), world: changeResources({ ...w, diplomacy: w.diplomacy.map(x => x.id === partnerId ? { ...x, trust: Math.min(100, x.trust + 20) } : x) }, { influence: 1 }), updatedAt: Date.now() }; }

export function milestoneAvailable(state: GameState, id: WorldMilestone): boolean { const w = normalizeWorld(state.world); if (state.runStatus !== 'active' || !state.cityEconomy.founded || w.milestones.includes(id)) return false; const milestone = worldMilestones.find(x => x.id === id); if (!milestone || !canAffordResources(w, milestone.resources)) return false; switch (id) { case 'civilization': return state.townLevel >= 4 && !!w.focus && w.projects.length >= 3; case 'country': return state.regionLevel >= 3 && w.cities.length >= 1 && w.milestones.includes('civilization'); case 'empire': return state.regionLevel >= 4 && w.milestones.includes('country') && w.diplomacy.filter(x => x.compact).length >= 2; case 'planet': return state.regionLevel >= 5 && w.milestones.includes('empire') && w.projects.includes('regional-rail'); } }
export function claimWorldMilestone(state: GameState, id: WorldMilestone): GameState { const m = worldMilestones.find(x => x.id === id); if (!m || !milestoneAvailable(state, id) || state.cash < m.cost) return state; const w = spendResources(normalizeWorld(state.world), m.resources); return { ...state, cash: state.cash - m.cost, totalSpent: state.totalSpent + m.cost, lowestCash: Math.min(state.lowestCash, state.cash - m.cost), world: { ...w, milestones: [...w.milestones, id] }, updatedAt: Date.now() }; }

export const expeditionDestinations: { name: string; biome: string; icon: string; cost: number; description: string; traits: string[] }[] = [
  { name: 'Velvet Rain', biome: 'Storm ocean', icon: '🌧️', cost: 3_000_000_000_000_000, description: 'An ocean world where rain shapes its music.', traits: ['Tide choirs', 'Storm glass'] },
  { name: 'Bloom-616', biome: 'Living forest', icon: '🌺', cost: 5_000_000_000_000_000, description: 'A garden world with growing cities and unusual Lokpets.', traits: ['Root transit', 'Bio-lumens'] },
  { name: 'The Ledger Moon', biome: 'Crystal desert', icon: '🌙', cost: 8_000_000_000_000_000, description: 'A moon of mineral cities and trade routes.', traits: ['Crystal ports', 'Silent markets'] },
];
export function establishWorldOutpost(state: GameState, name: string): GameState { const w = normalizeWorld(state.world); const d = expeditionDestinations.find(x => x.name === name); if (!d || state.runStatus !== 'active' || !w.milestones.includes('planet') || !w.projects.includes('orbital-observatory') || w.planets.some(p => p.name === name) || state.cash < d.cost) return state; const planet: WorldPlanet = { id: `planet-${w.planets.length + 1}`, name, biome: d.biome, foundedAt: Date.now(), level: 1, traits: d.traits, stability: 55 }; return { ...state, cash: state.cash - d.cost, totalSpent: state.totalSpent + d.cost, lowestCash: Math.min(state.lowestCash, state.cash - d.cost), world: changeResources({ ...w, planets: [...w.planets, planet] }, { discovery: 5, influence: 3 }), updatedAt: Date.now() }; }
export function planetaryUpgradeCost(level: number): number { return 2_000_000_000_000_000 * Math.pow(3, level - 1); }
export function developPlanet(state: GameState, planetId: string): GameState { const w = normalizeWorld(state.world); const planet = w.planets.find(p => p.id === planetId); const cost = planetaryUpgradeCost(planet?.level ?? 1); if (!planet || planet.level >= 4 || state.runStatus !== 'active' || state.cash < cost) return state; return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, lowestCash: Math.min(state.lowestCash, state.cash - cost), world: changeResources({ ...w, planets: w.planets.map(p => p.id === planetId ? { ...p, level: p.level + 1, stability: Math.min(100, p.stability + 10) } : p) }, { discovery: 3, care: 2 }), updatedAt: Date.now() }; }

const worldEvents = [
  { id: 'city-chorus', title: 'The City Chorus', icon: '🎶', requirement: (s: GameState) => (s.world?.projects.includes('sound-booth') ?? false), text: 'Performers ask whether the city should host a public night of music and street art.' },
  { id: 'garden-water', title: 'Garden Water Table', icon: '💧', requirement: (s: GameState) => (s.world?.projects.includes('garden') ?? false), text: 'The garden guild finds a way to restore a dry neighborhood.' },
  { id: 'rail-summit', title: 'Rail Summit', icon: '🚆', requirement: (s: GameState) => (s.world?.projects.includes('regional-rail') ?? false), text: 'Connected cities want a shared schedule and a new exchange route.' },
  { id: 'star-pulse', title: 'A Pulse Beyond Orbit', icon: '✦', requirement: (s: GameState) => (s.world?.milestones.includes('planet') ?? false), text: 'The observatory detects a repeating pulse from the dark beyond your home world.' },
] as const;
export function currentWorldEvent(state: GameState) { const w = normalizeWorld(state.world); const usable = worldEvents.filter(e => e.requirement(state) && !w.resolvedEventIds.includes(`${e.id}-${Math.floor(state.time.gameMinute / Math.max(1, state.time.settings.dayLengthMinutes))}`)); if (!usable.length) return null; const day = Math.floor(state.time.gameMinute / Math.max(1, state.time.settings.dayLengthMinutes)); return { ...usable[day % usable.length], instanceId: `${usable[day % usable.length].id}-${day}` }; }
export function resolveWorldEvent(state: GameState, choice: WorldEventChoice): GameState { const event = currentWorldEvent(state); if (!event || state.runStatus !== 'active') return state; const w = normalizeWorld(state.world); const rewards = choice === 'support' ? { care: 3, culture: 1 } : choice === 'balance' ? { knowledge: 2, influence: 2 } : { discovery: 2, influence: 2 }; const goodwill = choice === 'support' ? 4 : choice === 'balance' ? 2 : 0; return { ...state, cityEconomy: { ...state.cityEconomy, communityGoodwill: Math.min(100, state.cityEconomy.communityGoodwill + goodwill) }, world: changeResources({ ...w, resolvedEventIds: [...w.resolvedEventIds, event.instanceId].slice(-40) }, rewards), updatedAt: Date.now() }; }
export function worldIncomeMultiplier(state: GameState) { const w = normalizeWorld(state.world); let multiplier = 1 + w.cities.reduce((sum, city) => sum + city.level * .006, 0) + w.planets.reduce((sum, planet) => sum + planet.level * .01, 0); for (const policy of worldPolicies) if (w.policies.includes(policy.id)) multiplier += policy.id === 'trade-compact' ? .025 : .01; return Math.min(1.35, multiplier); }
