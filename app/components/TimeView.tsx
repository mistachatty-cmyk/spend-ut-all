'use client';

import { activities, timeEvents } from '@/data/activities';
import type { GameState } from '@/game/types';
import { activityAvailable, gameClockLabel, gameDay } from '@/game/systems/time-simulation';

export function TimeView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const active = state.time.activeActivity ? activities.find((entry) => entry.id === state.time.activeActivity?.id) : null;
  const lastEvent = timeEvents.find((entry) => entry.id === state.time.lastEventId);

  const patchSettings = (patch: Partial<GameState['time']['settings']>) => setState((current) => current ? { ...current, time: { ...current.time, settings: { ...current.time.settings, ...patch } } } : current);
  const patchDisplay = (patch: Partial<GameState['time']['display']>) => setState((current) => current ? { ...current, time: { ...current.time, display: { ...current.time.display, ...patch } } } : current);
  const start = (id: string) => setState((current) => {
    if (!current || current.time.activeActivity) return current;
    const activity = activities.find((entry) => entry.id === id);
    if (!activity || !activityAvailable(current.time, activity) || current.cash < (activity.cost ?? 0)) return current;
    const duration = current.time.settings.activityTimeCosts ? activity.durationMinutes : 0;
    return { ...current, cash: current.cash - (activity.cost ?? 0), time: { ...current.time, activeActivity: { id, startedAtGameMinute: current.time.gameMinute, endsAtGameMinute: current.time.gameMinute + duration } } };
  });

  return <section className="time-shell">
    <section className="panel time-hero"><div><span className="eyebrow">TIME & SCHEDULE</span><h2>Day {gameDay(state.time)} · {gameClockLabel(state.time)}</h2><p>Time can be a real constraint, a light flavor system, or completely disabled. Activities consume schedule time, industries can have availability windows, and travel can create fatigue or jet lag.</p></div><div className="time-status"><span>Fatigue <b>{Math.round(state.time.fatigue)}%</b></span><span>Jet lag <b>{Math.round(state.time.jetLag)}%</b></span></div></section>

    {active ? <section className="panel active-activity"><span className="eyebrow">CURRENT ACTIVITY</span><h2>{active.emoji} {active.name}</h2><p>{active.description}</p><b>{Math.max(0, Math.ceil((state.time.activeActivity!.endsAtGameMinute - state.time.gameMinute) / 60))} in-game hours remaining</b></section> : null}
    {lastEvent ? <section className="panel time-event"><span>{lastEvent.emoji}</span><div><span className="eyebrow">RECENT TIME EVENT</span><b>{lastEvent.name}</b><small>{lastEvent.description}</small></div></section> : null}

    <section className="time-grid">
      <section className="panel"><span className="eyebrow">ACTIVITIES</span><h2>Spend your day</h2><div className="activity-grid">{activities.map((activity) => { const available = activityAvailable(state.time, activity); return <article key={activity.id} className={`activity-card ${available ? '' : 'unavailable'}`}><span>{activity.emoji}</span><div><b>{activity.name}</b><small>{activity.description}</small><em>{activity.durationMinutes >= 60 ? `${activity.durationMinutes / 60}h` : `${activity.durationMinutes}m`} {activity.partTime ? '· Part-time' : ''} {activity.income ? `· +$${activity.income.toLocaleString()}` : ''} {activity.cost ? `· -$${activity.cost.toLocaleString()}` : ''}</em></div><button disabled={!available || !!active || state.cash < (activity.cost ?? 0)} onClick={() => start(activity.id)}>{available ? 'Start' : 'Unavailable now'}</button></article>; })}</div></section>

      <aside className="panel time-controls"><span className="eyebrow">TWEAKABLES</span><h2>Time rules</h2>
        <label><input type="checkbox" checked={state.time.settings.enabled} onChange={(e) => patchSettings({ enabled: e.target.checked })}/> Time simulation</label>
        <label><input type="checkbox" checked={state.time.settings.activityTimeCosts} onChange={(e) => patchSettings({ activityTimeCosts: e.target.checked })}/> Activities consume time</label>
        <label><input type="checkbox" checked={state.time.settings.availabilityWindows} onChange={(e) => patchSettings({ availabilityWindows: e.target.checked })}/> Industry availability</label>
        <label><input type="checkbox" checked={state.time.settings.randomTimeEvents} onChange={(e) => patchSettings({ randomTimeEvents: e.target.checked })}/> Random time events</label>
        <label><input type="checkbox" checked={state.time.settings.travelFatigue} onChange={(e) => patchSettings({ travelFatigue: e.target.checked })}/> Travel fatigue</label>
        <label><input type="checkbox" checked={state.time.settings.jetLag} onChange={(e) => patchSettings({ jetLag: e.target.checked })}/> Jet lag</label>
        <label>Game minutes per real minute<input type="range" min="1" max="240" value={state.time.settings.timeScale} onChange={(e) => patchSettings({ timeScale: Number(e.target.value) })}/><b>{state.time.settings.timeScale}×</b></label>
        <hr/><span className="eyebrow">COUNTERS</span>
        <label><input type="checkbox" checked={state.time.display.enabled} onChange={(e) => patchDisplay({ enabled: e.target.checked })}/> Run clock</label>
        <label><input type="checkbox" checked={state.time.display.showGameDay} onChange={(e) => patchDisplay({ showGameDay: e.target.checked })}/> Day counter</label>
        <label><input type="checkbox" checked={state.time.display.showMilliseconds} onChange={(e) => patchDisplay({ showMilliseconds: e.target.checked })}/> Milliseconds</label>
        <label><input type="checkbox" checked={state.time.display.showSeconds} onChange={(e) => patchDisplay({ showSeconds: e.target.checked })}/> Seconds</label>
        <label><input type="checkbox" checked={state.time.display.showMinutes} onChange={(e) => patchDisplay({ showMinutes: e.target.checked })}/> Minutes</label>
        <label><input type="checkbox" checked={state.time.display.showHours} onChange={(e) => patchDisplay({ showHours: e.target.checked })}/> Hours</label>
        <label><input type="checkbox" checked={state.time.display.showDays} onChange={(e) => patchDisplay({ showDays: e.target.checked })}/> Days</label>
      </aside>
    </section>
  </section>;
}
