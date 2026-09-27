import type { GameState } from '../types';
import type { CivicFocus, WorldMilestone, WorldPlanet, WorldProjectId, WorldScale, WorldState } from '../world-types';

export const civicFocuses: { id: CivicFocus; name: string; icon: string; description: string }[] = [
  { id: 'creative', name: 'Creative', icon: '🎨', description: 'Music, festivals, galleries and distinctive streets.' },
  { id: 'builder', name: 'Builder', icon: '🏗️', description: 'Infrastructure, industry and reliable connections.' },
  { id: 'scholar', name: 'Scholar', icon: '📚', description: 'Research, education and a living archive.' },
  { id: 'care', name: 'Care', icon: '🌿', description: 'Health, parks and strong neighborhoods.' },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Expeditions, discovery and new frontiers.' },
  { id: 'commerce', name: 'Commerce', icon: '🏪', description: 'Markets, trade and bustling business districts.' },
];

export const worldProjects: { id: WorldProjectId; name: string; icon: string; cost: number; description: string; requirement: string; available: (state: GameState) => boolean; goodwill: number }[] = [
  { id: 'sound-booth', name: 'Sound Booth', icon: '🎵', cost: 12_000, description: 'Open a music venue and gathering place.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 3 },
  { id: 'lokpet-sanctuary', name: 'Lokpet Sanctuary', icon: '🐾', cost: 18_000, description: 'Give companions a home and a place to train.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 3 },
  { id: 'card-quarter', name: 'Card Quarter', icon: '🃏', cost: 22_000, description: 'Make a collector street around the card shop.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 2 },
  { id: 'garden', name: 'Community Garden', icon: '🌱', cost: 8_000, description: 'Grow a public green space with the residents.', requirement: 'Found a town', available: s => s.cityEconomy.founded, goodwill: 5 },
  { id: 'workshop', name: 'Maker Workshop', icon: '🛠️', cost: 35_000, description: 'Turn skills and local ideas into a maker district.', requirement: 'Build a town hall', available: s => (s.cityEconomy.buildings['town-hall'] ?? 0) > 0, goodwill: 2 },
  { id: 'commons', name: 'The Commons', icon: '🎪', cost: 50_000, description: 'A central space for resident events and festivals.', requirement: 'Build a central park', available: s => (s.cityEconomy.buildings['central-park'] ?? 0) > 0, goodwill: 5 },
  { id: 'regional-rail', name: 'Regional Rail', icon: '🚆', cost: 2_000_000_000_000, description: 'Connect the capital to your other cities.', requirement: 'Metro Region and a second city', available: s => s.regionLevel >= 1 && (s.world?.cities.length ?? 0) > 0, goodwill: 4 },
  { id: 'civic-archive', name: 'Civic Archive', icon: '🏛️', cost: 500_000_000, description: 'Preserve the civilization’s history and culture.', requirement: 'Civilization charter', available: s => (s.world?.milestones.includes('civilization') ?? false), goodwill: 3 },
  { id: 'orbital-observatory', name: 'Orbital Observatory', icon: '🔭', cost: 8_000_000_000_000, description: 'Survey nearby worlds before an expedition.', requirement: 'Planet stewardship', available: s => (s.world?.milestones.includes('planet') ?? false), goodwill: 2 },
];

export const worldMilestones: { id: WorldMilestone; name: string; icon: string; cost: number; requirement: string; description: string }[] = [
  { id: 'civilization', name: 'Civilization Charter', icon: '🏛️', cost: 1_000_000_000, requirement: 'Small City, 3 civic projects, and a cultural focus', description: 'Give your society a lasting identity and record its history.' },
  { id: 'country', name: 'Country Charter', icon: '🗺️', cost: 50_000_000_000_000, requirement: 'National Power, a linked city, and a civilization', description: 'Unite your capital and satellite cities under one country.' },
  { id: 'empire', name: 'Empire Accord', icon: '👑', cost: 250_000_000_000_000, requirement: 'Global Network and a country', description: 'Connect regions through diplomacy, trade and cultural reach.' },
  { id: 'planet', name: 'Planet Stewardship', icon: '🌎', cost: 1_500_000_000_000_000, requirement: 'Planetary Economy, an empire, and a regional rail', description: 'Coordinate your home world as a planetary civilization.' },
];

export function createWorldState(): WorldState { return { focus: null, projects: [], milestones: [], cities: [], planets: [] }; }

export function normalizeWorld(input: Partial<WorldState> | null | undefined): WorldState {
  const base = createWorldState();
  const focuses = civicFocuses.map(f => f.id);
  const projects = worldProjects.map(p => p.id);
  const milestones = worldMilestones.map(m => m.id);
  const cleanName = (name: unknown) => typeof name === 'string' ? name.trim().slice(0, 32) : '';
  return {
    focus: input?.focus && focuses.includes(input.focus) ? input.focus : null,
    projects: [...new Set((Array.isArray(input?.projects) ? input.projects : []).filter(id => projects.includes(id)))],
    milestones: [...new Set((Array.isArray(input?.milestones) ? input.milestones : []).filter(id => milestones.includes(id)))],
    cities: (Array.isArray(input?.cities) ? input.cities : []).filter(c => c && cleanName(c.name) && focuses.includes(c.specialty)).slice(0, 12).map((c, i) => ({ id: `city-${i + 1}`, name: cleanName(c.name), specialty: c.specialty, foundedAt: Number.isFinite(c.foundedAt) ? c.foundedAt : 0, foundedAtGameMinute: Number.isFinite(c.foundedAtGameMinute) ? c.foundedAtGameMinute : 0, level: Number.isFinite(c.level) ? Math.max(1, Math.min(4, Math.floor(c.level))) : 1 })),
    planets: (Array.isArray(input?.planets) ? input.planets : []).filter(p => p && cleanName(p.name)).slice(0, 8).map((p, i) => ({ id: `planet-${i + 1}`, name: cleanName(p.name), biome: typeof p.biome === 'string' ? p.biome.slice(0, 24) : 'Unknown', foundedAt: Number.isFinite(p.foundedAt) ? p.foundedAt : 0 })),
  };
}

export function worldScale(state: GameState): WorldScale {
  const w = normalizeWorld(state.world);
  if (w.planets.length) return 'universe';
  if (w.milestones.includes('planet')) return 'planet';
  if (w.milestones.includes('empire')) return 'empire';
  if (w.milestones.includes('country')) return 'country';
  if (w.milestones.includes('civilization')) return 'civilization';
  if (state.townLevel >= 4) return 'city';
  return 'town';
}

export function chooseCivicFocus(state: GameState, focus: CivicFocus): GameState {
  if (!state.cityEconomy.founded || state.runStatus !== 'active' || !civicFocuses.some(f => f.id === focus)) return state;
  return { ...state, world: { ...normalizeWorld(state.world), focus }, updatedAt: Date.now() };
}

export function canFundWorldProject(state: GameState, id: WorldProjectId): boolean {
  const project = worldProjects.find(p => p.id === id);
  return !!project && state.runStatus === 'active' && !normalizeWorld(state.world).projects.includes(id) && project.available(state) && state.cash >= project.cost;
}

export function fundWorldProject(state: GameState, id: WorldProjectId): GameState {
  if (!canFundWorldProject(state, id)) return state;
  const project = worldProjects.find(p => p.id === id)!;
  const world = normalizeWorld(state.world);
  return { ...state, cash: state.cash - project.cost, totalSpent: state.totalSpent + project.cost,
    lowestCash: Math.min(state.lowestCash, state.cash - project.cost),
    cityEconomy: { ...state.cityEconomy, communityGoodwill: Math.min(100, state.cityEconomy.communityGoodwill + project.goodwill) },
    world: { ...world, projects: [...world.projects, id] }, updatedAt: Date.now() };
}

export function canFoundSatelliteCity(state: GameState): boolean {
  const world = normalizeWorld(state.world);
  return state.runStatus === 'active' && state.townLevel >= 5 && state.regionLevel >= 1 && world.cities.length < 12 && state.cash >= 750_000_000_000 * (world.cities.length + 1);
}

export function foundSatelliteCity(state: GameState, name: string, specialty: CivicFocus): GameState {
  const cleaned = name.trim().slice(0, 32);
  if (!canFoundSatelliteCity(state) || !cleaned || !civicFocuses.some(f => f.id === specialty)) return state;
  const world = normalizeWorld(state.world);
  if (cleaned.toLowerCase() === state.cityEconomy.townName.toLowerCase() || world.cities.some(c => c.name.toLowerCase() === cleaned.toLowerCase())) return state;
  const cost = 750_000_000_000 * (world.cities.length + 1);
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost, lowestCash: Math.min(state.lowestCash, state.cash - cost),
    world: { ...world, cities: [...world.cities, { id: `city-${world.cities.length + 1}`, name: cleaned, specialty, foundedAt: Date.now(), foundedAtGameMinute: state.time.gameMinute, level: 1 }] }, updatedAt: Date.now() };
}

export function satelliteCityUpgradeCost(level: number): number { return 400_000_000_000 * Math.pow(4, level - 1); }

export function developSatelliteCity(state: GameState, id: string): GameState {
  const world = normalizeWorld(state.world);
  const city = world.cities.find(c => c.id === id);
  if (!city || city.level >= 4 || state.runStatus !== 'active' || state.cash < satelliteCityUpgradeCost(city.level)) return state;
  const cost = satelliteCityUpgradeCost(city.level);
  return { ...state, cash: state.cash - cost, totalSpent: state.totalSpent + cost,
    lowestCash: Math.min(state.lowestCash, state.cash - cost),
    world: { ...world, cities: world.cities.map(c => c.id === id ? { ...c, level: c.level + 1 } : c) }, updatedAt: Date.now() };
}

export function satelliteCitySnapshot(city: WorldState['cities'][number], gameMinute: number, dayLengthMinutes: number) {
  const elapsedDays = Math.max(0, (gameMinute - city.foundedAtGameMinute) / Math.max(1, dayLengthMinutes));
  const capacity = [0, 15_000, 100_000, 600_000, 2_500_000][city.level];
  const population = Math.min(capacity, Math.floor(capacity * (0.18 + 0.82 * (1 - Math.exp(-elapsedDays / 12)))));
  return { population, capacity, jobs: Math.floor(population * (city.specialty === 'commerce' || city.specialty === 'builder' ? 0.58 : 0.48)) };
}

export function milestoneAvailable(state: GameState, id: WorldMilestone): boolean {
  const world = normalizeWorld(state.world);
  if (state.runStatus !== 'active' || !state.cityEconomy.founded || world.milestones.includes(id)) return false;
  switch (id) {
    case 'civilization': return state.townLevel >= 4 && !!world.focus && world.projects.length >= 3;
    case 'country': return state.regionLevel >= 3 && world.cities.length >= 1 && world.milestones.includes('civilization');
    case 'empire': return state.regionLevel >= 4 && world.milestones.includes('country');
    case 'planet': return state.regionLevel >= 5 && world.milestones.includes('empire') && world.projects.includes('regional-rail');
  }
}

export function claimWorldMilestone(state: GameState, id: WorldMilestone): GameState {
  const milestone = worldMilestones.find(m => m.id === id);
  if (!milestone || !milestoneAvailable(state, id) || state.cash < milestone.cost) return state;
  const world = normalizeWorld(state.world);
  return { ...state, cash: state.cash - milestone.cost, totalSpent: state.totalSpent + milestone.cost,
    lowestCash: Math.min(state.lowestCash, state.cash - milestone.cost),
    world: { ...world, milestones: [...world.milestones, id] }, updatedAt: Date.now() };
}

export const expeditionDestinations: { name: string; biome: string; icon: string; cost: number; description: string }[] = [
  { name: 'Velvet Rain', biome: 'Storm ocean', icon: '🌧️', cost: 3_000_000_000_000_000, description: 'An ocean world where rain shapes its music.' },
  { name: 'Bloom-616', biome: 'Living forest', icon: '🌺', cost: 5_000_000_000_000_000, description: 'A garden world with growing cities and unusual Lokpets.' },
  { name: 'The Ledger Moon', biome: 'Crystal desert', icon: '🌙', cost: 8_000_000_000_000_000, description: 'A moon of mineral cities and trade routes.' },
];

export function establishWorldOutpost(state: GameState, name: string): GameState {
  const world = normalizeWorld(state.world);
  const destination = expeditionDestinations.find(d => d.name === name);
  if (!destination || state.runStatus !== 'active' || !world.milestones.includes('planet') || !world.projects.includes('orbital-observatory') || world.planets.some(p => p.name === name) || state.cash < destination.cost) return state;
  const planet: WorldPlanet = { id: `planet-${world.planets.length + 1}`, name, biome: destination.biome, foundedAt: Date.now() };
  return { ...state, cash: state.cash - destination.cost, totalSpent: state.totalSpent + destination.cost,
    lowestCash: Math.min(state.lowestCash, state.cash - destination.cost), world: { ...world, planets: [...world.planets, planet] }, updatedAt: Date.now() };
}
