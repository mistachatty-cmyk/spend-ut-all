import assert from 'node:assert/strict';
import {
  createWorldState, normalizeWorld, chooseCivicFocus, fundWorldProject,
  foundSatelliteCity, developSatelliteCity, satelliteCitySnapshot,
  claimWorldMilestone, establishWorldOutpost, worldScale, toggleWorldPolicy, buildDiplomaticTrust, formDiplomaticCompact, developPlanet, openCityInitiative, currentWorldEvent, resolveWorldEvent, worldIncomeMultiplier,
} from '../game/systems/world.ts';

const base = {
  cash: 1e18, totalSpent: 0, lowestCash: 1e18, runStatus: 'active',
  cityEconomy: { founded: true, townName: 'Capital', buildings: { 'town-hall': 1, 'central-park': 1 }, communityGoodwill: 50 },
  townLevel: 5, regionLevel: 5, time: { gameMinute: 100, settings: { dayLengthMinutes: 1440 } },
  world: createWorldState(),
};
assert.deepEqual(normalizeWorld(undefined), createWorldState());
assert.equal(normalizeWorld({ projects: ['garden', 'garden', 'unknown'] }).projects.length, 1);
assert.equal(claimWorldMilestone(base, 'planet'), base, 'planet cannot skip earlier charters');
let state = chooseCivicFocus(base, 'creative');
for (const id of ['sound-booth', 'garden', 'card-quarter', 'workshop', 'lokpet-sanctuary']) state = fundWorldProject(state, id);
assert.equal(state.cityEconomy.communityGoodwill, 65);
assert.equal(state.world.resources.culture, 7);
state = toggleWorldPolicy(state, 'open-studios');
assert.ok(state.world.policies.includes('open-studios'));
assert.ok(worldIncomeMultiplier(state) > 1);
state = claimWorldMilestone(state, 'civilization');
assert.equal(worldScale(state), 'civilization');
const duplicate = foundSatelliteCity(state, 'Capital', 'builder');
assert.equal(duplicate, state);
state = foundSatelliteCity(state, 'Harbor', 'commerce');
assert.equal(state.world.cities.length, 1);
const before = state.world.cities[0].level;
state = developSatelliteCity(state, state.world.cities[0].id);
assert.equal(state.world.cities[0].level, before + 1);
state = developSatelliteCity(state, state.world.cities[0].id);
state = developSatelliteCity(state, state.world.cities[0].id);
const city = satelliteCitySnapshot(state.world.cities[0], 1e9, 1440);
assert.ok(city.population <= city.capacity);
state = claimWorldMilestone(state, 'country');
assert.equal(claimWorldMilestone(state, 'empire'), state, 'empire needs diplomatic compacts');
for (const partner of state.world.diplomacy.slice(0, 2)) { for (let i = 0; i < 6; i++) state = buildDiplomaticTrust(state, partner.id); state = formDiplomaticCompact(state, partner.id); }
assert.equal(state.world.diplomacy.filter(p => p.compact).length, 2);
state = claimWorldMilestone(state, 'empire');
assert.equal(claimWorldMilestone(state, 'planet'), state, 'regional rail required');
state = fundWorldProject(state, 'regional-rail');
state = claimWorldMilestone(state, 'planet');
assert.equal(worldScale(state), 'planet');
assert.equal(establishWorldOutpost(state, 'Velvet Rain'), state, 'observatory required');
state = fundWorldProject(state, 'orbital-observatory');
state = establishWorldOutpost(state, 'Velvet Rain');
assert.equal(worldScale(state), 'universe');
const planetBefore = state.world.planets[0].level; state = developPlanet(state, state.world.planets[0].id); assert.equal(state.world.planets[0].level, planetBefore + 1);
state = openCityInitiative(state, state.world.cities[0].id, 'Night market'); assert.ok(state.world.cities[0].projects.includes('Night market'));
const event = currentWorldEvent(state); if (event) { state = resolveWorldEvent(state, 'balance'); assert.ok(state.world.resolvedEventIds.includes(event.instanceId)); }
assert.equal(establishWorldOutpost(state, 'Velvet Rain'), state, 'outpost cannot be claimed twice');
assert.equal(fundWorldProject({ ...state, cash: 0 }, 'workshop').cash, 0);
console.log('World progression gates and save defaults pass.');
