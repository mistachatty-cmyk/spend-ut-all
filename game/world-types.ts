export type WorldScale = 'town' | 'city' | 'civilization' | 'country' | 'empire' | 'planet' | 'universe';
export type CivicFocus = 'creative' | 'builder' | 'scholar' | 'care' | 'explorer' | 'commerce';
export type WorldProjectId = 'sound-booth' | 'lokpet-sanctuary' | 'card-quarter' | 'garden' | 'workshop' | 'commons' | 'regional-rail' | 'civic-archive' | 'orbital-observatory';
export type WorldMilestone = 'civilization' | 'country' | 'empire' | 'planet';
export type SatelliteCity = { id: string; name: string; specialty: CivicFocus; foundedAt: number; foundedAtGameMinute: number; level: number };
export type WorldPlanet = { id: string; name: string; biome: string; foundedAt: number };
export type WorldState = {
  focus: CivicFocus | null;
  projects: WorldProjectId[];
  milestones: WorldMilestone[];
  cities: SatelliteCity[];
  planets: WorldPlanet[];
};
