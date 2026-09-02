'use client';

import { activities, timeEvents } from '@/data/activities';
import { lifeSkills } from '@/data/life-progression';
import type { ActivityCategory } from '@/game/time-types';
import type { GameState } from '@/game/types';
import { activityAvailable, gameClockLabel, gameDay } from '@/game/systems/time-simulation';

const groups: Array<{id:ActivityCategory;label:string;hint:string}> = [
  {id:'work',label:'Quick Work',hint:'Earn now'},
  {id:'learning',label:'Learn Skills',hint:'Invest time, often for free'},
  {id:'business',label:'Business',hint:'Higher-value scheduled work'},
  {id:'recovery',label:'Recovery',hint:'Manage fatigue'},
  {id:'travel',label:'Travel',hint:'Reach other markets'},
];

export function TimeView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const active = state.time.activeActivity ? activities.find((entry) => entry.id === state.time.activeActivity?.id) : null;
  const lastEvent = timeEvents.find((entry) => entry.id === state.time.lastEventId);

  const start = (id: string) => setState((current) => {
    if (!current || current.time.activeActivity) return current;
    const activity = activities.find((entry) => entry.id === id);
    if (!activity || !activityAvailable(current.time, activity) || current.cash < (activity.cost ?? 0)) return current;
    const duration = current.time.settings.enabled && current.time.settings.activityTimeCosts ? activity.durationMinutes : 0;
    return { ...current, cash: current.cash - (activity.cost ?? 0), totalSpent:current.totalSpent+(activity.cost ?? 0), time: { ...current.time, activeActivity: { id, startedAtGameMinute: current.time.gameMinute, endsAtGameMinute: current.time.gameMinute + duration } }, updatedAt:Date.now() };
  });

  return <section className="time-shell">
    <section className="panel time-hero"><div><span className="eyebrow">TIME, WORK & LEARNING</span><h2>{state.time.settings.enabled ? `Day ${gameDay(state.time)} · ${gameClockLabel(state.time)}` : 'Classic time · activities complete immediately'}</h2><p>Use your day to work, learn skills, recover or travel. Time rules now live in Settings so this screen stays focused on choices instead of configuration.</p></div><div className="time-status"><span>Fatigue <b>{Math.round(state.time.fatigue)}%</b></span><span>Jet lag <b>{Math.round(state.time.jetLag)}%</b></span><span>Mode <b>{state.time.settings.enabled?'Simulated':'Classic'}</b></span></div></section>

    {active ? <section className="panel active-activity"><span className="eyebrow">CURRENT ACTIVITY</span><h2>{active.emoji} {active.name}</h2><p>{active.description}</p><b>{state.time.settings.enabled ? `${Math.max(0, Math.ceil((state.time.activeActivity!.endsAtGameMinute - state.time.gameMinute) / 60))} in-game hours remaining` : 'Completing now…'}</b></section> : null}
    {lastEvent ? <section className="panel time-event"><span>{lastEvent.emoji}</span><div><span className="eyebrow">RECENT TIME EVENT</span><b>{lastEvent.name}</b><small>{lastEvent.description}</small></div></section> : null}

    <section className="time-activity-groups">{groups.map((group)=>{
      const entries=activities.filter((entry)=>entry.category===group.id);
      if (!entries.length) return null;
      return <section className="panel time-activity-group" key={group.id}><div className="section-heading"><div><span className="eyebrow">{group.label.toUpperCase()}</span><h2>{group.hint}</h2></div>{group.id==='learning' && !state.life.enabled ? <span>Enable Life RPG above to retain skill XP</span> : null}</div><div className="activity-grid">{entries.map((activity) => {
        const available = activityAvailable(state.time, activity);
        const skill = activity.skillId ? lifeSkills.find((entry)=>entry.id===activity.skillId) : null;
        return <article key={activity.id} className={`activity-card ${available ? '' : 'unavailable'}`}><span>{activity.emoji}</span><div><b>{activity.name}</b><small>{activity.description}</small><em>{activity.durationMinutes >= 60 ? `${activity.durationMinutes / 60}h` : `${activity.durationMinutes}m`} {activity.partTime ? '· Flexible' : ''} {activity.income ? `· +$${activity.income.toLocaleString()}` : ''} {activity.cost ? `· -$${activity.cost.toLocaleString()}` : ''}</em>{skill && activity.skillXp ? <strong className="activity-skill-xp">+{activity.skillXp} {skill.name} XP</strong> : null}</div><button disabled={!available || !!active || state.cash < (activity.cost ?? 0)} onClick={() => start(activity.id)}>{available ? group.id==='learning' ? 'Study' : 'Start' : 'Unavailable now'}</button></article>;
      })}</div></section>;
    })}</section>

    <section className="panel time-settings-link"><div><span className="eyebrow">TIME RULES</span><b>{state.time.settings.enabled?'Simulated time is active':'Classic time is active'}</b><small>Change activity duration, availability windows, random schedule events, travel fatigue, jet lag and clock speed from Settings → Time.</small></div></section>
  </section>;
}
