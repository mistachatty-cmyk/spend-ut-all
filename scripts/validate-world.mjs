import assert from 'node:assert/strict';
import {
  createWorldState, normalizeWorld, chooseCivicFocus, fundWorldProject,
  foundSatelliteCity, developSatelliteCity, satelliteCitySnapshot,
  claimWorldMilestone, establishWorldOutpost, worldScale,
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
for (const id of ['sound-booth', 'garden', 'card-quarter']) state = fundWorldProject(state, id);
assert.equal(state.cityEconomy.communityGoodwill, 60);
state = claimWorldMilestone(state, 'civilization');
assert.equal(worldScale(state), 'civilization');
const duplicate = foundSatelliteCity(state, 'Capital', 'builder');
assert.equal(duplicate, state);
state = foundSatelliteCity(state, 'Harbor', 'commerce');
assert.equal(state.world.cities.length, 1);
const before = state.world.cities[0].level;
state = developSatelliteCity(state, state.world.cities[0].id);
assert.equal(state.world.cities[0].level, before + 1);
const city = satelliteCitySnapshot(state.world.cities[0], 1e9, 1440);
assert.ok(city.population <= city.capacity);
state = claimWorldMilestone(state, 'country');
state = claimWorldMilestone(state, 'empire');
assert.equal(claimWorldMilestone(state, 'planet'), state, 'regional rail required');
state = fundWorldProject(state, 'regional-rail');
state = claimWorldMilestone(state, 'planet');
assert.equal(worldScale(state), 'planet');
assert.equal(establishWorldOutpost(state, 'Velvet Rain'), state, 'observatory required');
state = fundWorldProject(state, 'orbital-observatory');
state = establishWorldOutpost(state, 'Velvet Rain');
assert.equal(worldScale(state), 'universe');
assert.equal(establishWorldOutpost(state, 'Velvet Rain'), state, 'outpost cannot be claimed twice');
assert.equal(fundWorldProject({ ...state, cash: 0 }, 'workshop').cash, 0);
console.log('World progression gates and save defaults pass.');
