'use client';

import { useState } from 'react';
import type { GameState } from '@/game/types';
import type { CivicFocus, WorldScale } from '@/game/world-types';
import { townBuildings } from '@/data/town-content';
import { cityEconomySnapshot } from '@/game/systems/city-economy';
import {
  canFoundSatelliteCity, canFundWorldProject, chooseCivicFocus, claimWorldMilestone,
  civicFocuses, developSatelliteCity, establishWorldOutpost, expeditionDestinations, foundSatelliteCity,
  fundWorldProject, milestoneAvailable, normalizeWorld, satelliteCitySnapshot, satelliteCityUpgradeCost, worldMilestones, worldProjects, worldScale,
} from '@/game/systems/world';

const zooms: { id: WorldScale; label: string; icon: string }[] = [
  { id: 'town', label: 'Town', icon: '🏘️' }, { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'civilization', label: 'Civ', icon: '🏛️' }, { id: 'country', label: 'Country', icon: '🗺️' },
  { id: 'empire', label: 'Empire', icon: '👑' }, { id: 'planet', label: 'Planet', icon: '🌎' },
  { id: 'universe', label: 'Universe', icon: '🪐' },
];
const scaleOrder = zooms.map(z => z.id);
const districtLayout = [
  { id: 'hideout', name: 'Your Hideout', icon: '🏠', built: true, description: 'The place your journey began.' },
  { id: 'sound-booth', name: 'Sound Booth', icon: '🎵', built: false, description: 'Music and live events.' },
  { id: 'lokpet-sanctuary', name: 'Lokpet Sanctuary', icon: '🐾', built: false, description: 'Companion care and training.' },
  { id: 'card-quarter', name: 'Card Quarter', icon: '🃏', built: false, description: 'Collecting and the card shop.' },
  { id: 'garden', name: 'Community Garden', icon: '🌱', built: false, description: 'A green heart for the town.' },
  { id: 'workshop', name: 'Maker Workshop', icon: '🛠️', built: false, description: 'Skills and local craft.' },
  { id: 'commons', name: 'The Commons', icon: '🎪', built: false, description: 'Festivals and resident gatherings.' },
] as const;

export function WorldAtlasView({ state, setState, onOpenTown, money }: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
  onOpenTown: () => void;
  money: (amount: number) => string;
}) {
  const [zoom, setZoom] = useState<WorldScale>('town');
  const [cityName, setCityName] = useState('');
  const [cityFocus, setCityFocus] = useState<CivicFocus>('creative');
  const [notice, setNotice] = useState('');
  const world = normalizeWorld(state.world);
  const current = worldScale(state);
  const currentIndex = scaleOrder.indexOf(current);
  const activeIndex = scaleOrder.indexOf(zoom);
  const unlocked = activeIndex <= currentIndex;
  const snapshot = cityEconomySnapshot(state.cityEconomy, state.businesses, state.townLevel);
  const civicBuildings = townBuildings.filter(b => (state.cityEconomy.buildings[b.id] ?? 0) > 0);
  const nextMilestone = worldMilestones.find(m => !world.milestones.includes(m.id));
  const submitCity = (event: React.FormEvent) => {
    event.preventDefault();
    if (foundSatelliteCity(state, cityName, cityFocus) === state) { setNotice('Choose a unique city name and meet the region and funding requirements.'); return; }
    setState(current => current ? foundSatelliteCity(current, cityName, cityFocus) : current);
    setCityName('');
    setNotice(`${cityName.trim()} has joined your network.`);
  };

  return <main className="world-atlas">
    <header className="world-hero">
      <div><span className="world-kicker">SPEND IT ALL / WORLD ATLAS</span>
        <h1>From one home to a universe.</h1>
        <p>Grow your settlement, define its culture, connect cities, and eventually lead a planet. Your town buildings and regional upgrades shape the map.</p>
      </div>
      <div className="world-hero-stat"><span>CURRENT REACH</span><strong>{current}</strong><small>{state.cityEconomy.founded ? state.cityEconomy.townName : 'Uncharted Settlement'}</small></div>
    </header>

    <nav className="world-zoom" aria-label="World scale">
      {zooms.map((entry, i) => <button key={entry.id} type="button" className={`${zoom === entry.id ? 'selected' : ''} ${i <= currentIndex ? 'reached' : ''}`} aria-current={zoom === entry.id ? 'step' : undefined} onClick={() => setZoom(entry.id)}>
        <span>{entry.icon}</span><b>{entry.label}</b><small>{i <= currentIndex ? 'Reached' : 'Future'}</small>
      </button>)}
    </nav>

    <section className="world-main-grid">
      <div className="world-map-panel">
        <div className="world-panel-heading"><span>{zooms[activeIndex].icon} {zooms[activeIndex].label} view</span><span>{unlocked ? 'ACTIVE SCALE' : 'PREVIEW'}</span></div>
        {(zoom === 'town' || zoom === 'city') && <>
          <div className="world-town-map" aria-label="Town district map">
            {districtLayout.map(d => {
              const open = d.built || world.projects.includes(d.id as typeof world.projects[number]);
              return <div key={d.id} className={`world-map-lot ${open ? 'open' : 'planned'}`}><span>{d.icon}</span><b>{d.name}</b><small>{open ? d.description : 'Available to build'}</small></div>;
            })}
            {civicBuildings.slice(0, 8).map(b => <div key={b.id} className="world-map-lot open civic"><span>{b.emoji}</span><b>{b.name}</b><small>×{state.cityEconomy.buildings[b.id]} built in Town</small></div>)}
          </div>
          <div className="world-map-footer"><span>👥 {snapshot.population.toLocaleString()} residents</span><span>🏘️ {civicBuildings.length} building types</span><span>♥ {Math.round(snapshot.happiness)} happiness</span></div>
        </>}
        {zoom === 'civilization' && <div className="world-diagram"><div className="world-orb civ">🏛️</div><h2>{world.focus ? `${civicFocuses.find(f => f.id === world.focus)?.name} Civilization` : 'A civilization takes shape'}</h2><p>Choose what your people value. The focus colors your future cities and remains editable as the society evolves.</p><div className="world-chip-row">{world.projects.slice(0, 6).map(id => <span key={id}>{worldProjects.find(p => p.id === id)?.icon} {worldProjects.find(p => p.id === id)?.name}</span>)}</div></div>}
        {(zoom === 'country' || zoom === 'empire') && <div className="world-diagram"><div className="world-orb globe">🌐</div><h2>{zoom === 'country' ? 'A connected country' : 'A network across the globe'}</h2><p>{state.cityEconomy.townName} is your capital. Found satellite cities and connect them with regional rail; each city has its own specialty.</p><div className="world-network"><span>★ {state.cityEconomy.townName}</span>{world.cities.map(c => <span key={c.id}>↗ {c.name} · {civicFocuses.find(f => f.id === c.specialty)?.name}</span>)}</div></div>}
        {(zoom === 'planet' || zoom === 'universe') && <div className="world-diagram cosmic"><div className="world-orb planet">{zoom === 'planet' ? '🌎' : '🪐'}</div><h2>{zoom === 'planet' ? 'Your home world' : 'A growing star map'}</h2><p>{zoom === 'planet' ? 'Steward the connected civilization across continents and prepare an observatory.' : 'Expeditions open distinct worlds. Each outpost will grow through the same settlement loop in future expansions.'}</p><div className="world-chip-row"><span>🌎 Home world</span>{world.planets.map(p => <span key={p.id}>🪐 {p.name} · {p.biome}</span>)}</div></div>}
      </div>
      <aside className="world-side">
        <div className="world-card"><span className="world-kicker">YOUR NEXT HORIZON</span><h2>{nextMilestone?.name ?? (world.planets.length ? 'Grow the constellation' : 'First expedition')}</h2><p>{nextMilestone?.requirement ?? 'Build an orbital observatory, then establish an outpost.'}</p><div className="world-progress"><span style={{ width: `${((currentIndex + 1) / scaleOrder.length) * 100}%` }} /></div><small>{currentIndex + 1} of {scaleOrder.length} scales reached</small></div>
        <div className="world-card"><span className="world-kicker">CONNECTED TO YOUR GAME</span><h2>Make the map grow</h2><p>Town buildings appear as new lots. Local projects spend game cash and increase community goodwill. Regional tiers open new cities and charters.</p><div className="world-side-actions"><button type="button" onClick={onOpenTown}>Open Town & Community →</button><a href="/cards">Visit Card Shop →</a></div></div>
      </aside>
    </section>

    <section className="world-actions">
      <div className="world-section-title"><span className="world-kicker">01 / LOCAL DEVELOPMENT</span><h2>Build places with a purpose</h2><p>Each project adds a district to the atlas and supports the town’s goodwill.</p></div>
      {!state.cityEconomy.founded && <div className="world-callout">Found your settlement in Town & Community to start construction. <button type="button" onClick={onOpenTown}>Go to Town →</button></div>}
      <div className="world-project-grid">{worldProjects.map(p => {
        const done = world.projects.includes(p.id);
        const available = p.available(state);
        return <article key={p.id} className={`world-project ${done ? 'complete' : ''}`}><span className="world-project-icon">{p.icon}</span><h3>{p.name}</h3><p>{p.description}</p><small>{done ? `Built · +${p.goodwill} goodwill` : available ? `+${p.goodwill} goodwill` : p.requirement}</small><button type="button" disabled={done || !canFundWorldProject(state, p.id)} onClick={() => setState(s => s ? fundWorldProject(s, p.id) : s)}>{done ? 'Built ✓' : `Fund · ${money(p.cost)}`}</button></article>;
      })}</div>
    </section>

    <section className="world-actions"><div className="world-section-title"><span className="world-kicker">02 / CIVILIZATION IDENTITY</span><h2>What will your people be known for?</h2><p>Choose a focus once the town is founded. You can change it later; city specialties stay with each founded city.</p></div><div className="world-focus-grid">{civicFocuses.map(f => <button type="button" key={f.id} disabled={!state.cityEconomy.founded || state.runStatus !== 'active'} className={world.focus === f.id ? 'chosen' : ''} onClick={() => setState(s => s ? chooseCivicFocus(s, f.id) : s)}><span>{f.icon}</span><b>{f.name}</b><small>{f.description}</small></button>)}</div></section>

    <section className="world-actions"><div className="world-section-title"><span className="world-kicker">03 / EXPANSION</span><h2>Link cities, then reach the stars</h2></div><div className="world-expansion-grid">
      <div className="world-card"><h3>Found a satellite city</h3><p>Unlocks at Metropolis and Metro Region. The capital remains tied to your existing Town & Community economy. Satellite cities grow over game days and can be developed through four tiers.</p><div className="world-network"><span>★ {state.cityEconomy.townName}</span></div><div className="world-city-list">{world.cities.map(c => {
        const city = satelliteCitySnapshot(c, state.time.gameMinute, state.time.settings.dayLengthMinutes);
        const cost = satelliteCityUpgradeCost(c.level);
        return <div key={c.id}><div><b>{c.name} · Tier {c.level}</b><small>{c.specialty} · {city.population.toLocaleString()} / {city.capacity.toLocaleString()} residents · {city.jobs.toLocaleString()} jobs</small></div><button type="button" disabled={c.level >= 4 || state.cash < cost || state.runStatus !== 'active'} onClick={() => setState(s => s ? developSatelliteCity(s, c.id) : s)}>{c.level >= 4 ? 'Max tier' : `Develop · ${money(cost)}`}</button></div>;
      })}</div><form onSubmit={submitCity}><label htmlFor="atlas-city-name">New city name</label><input id="atlas-city-name" value={cityName} onChange={e => setCityName(e.target.value)} maxLength={32} placeholder="Name your new city" required /><label htmlFor="atlas-city-focus">City specialty</label><select id="atlas-city-focus" value={cityFocus} onChange={e => setCityFocus(e.target.value as CivicFocus)}>{civicFocuses.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select><button type="submit" disabled={!canFoundSatelliteCity(state)}>Found city · {money(750_000_000_000 * (world.cities.length + 1))}</button></form>{notice && <p role="status">{notice}</p>}</div>
      <div className="world-card"><h3>Charters & stewardship</h3><div className="world-milestones">{worldMilestones.map(m => <div key={m.id}><span>{m.icon}</span><div><b>{m.name}</b><small>{world.milestones.includes(m.id) ? m.description : m.requirement}</small></div><button type="button" disabled={world.milestones.includes(m.id) || !milestoneAvailable(state, m.id) || state.cash < m.cost} onClick={() => setState(s => s ? claimWorldMilestone(s, m.id) : s)}>{world.milestones.includes(m.id) ? 'Established ✓' : money(m.cost)}</button></div>)}</div></div>
      <div className="world-card"><h3>Planetary expeditions</h3><p>After planet stewardship, fund an observatory and establish outposts on nearby worlds.</p><div className="world-milestones">{expeditionDestinations.map(d => <div key={d.name}><span>{d.icon}</span><div><b>{d.name}</b><small>{d.biome} · {d.description}</small></div><button type="button" disabled={!world.milestones.includes('planet') || !world.projects.includes('orbital-observatory') || world.planets.some(p => p.name === d.name) || state.cash < d.cost || state.runStatus !== 'active'} onClick={() => setState(s => s ? establishWorldOutpost(s, d.name) : s)}>{world.planets.some(p => p.name === d.name) ? 'Outpost ✓' : money(d.cost)}</button></div>)}</div></div>
    </div></section>
  </main>;
}
