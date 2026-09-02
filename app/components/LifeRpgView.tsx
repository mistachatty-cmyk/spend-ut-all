'use client';

import { housingOptions, lifeBackgrounds, lifeSkills } from '@/data/life-progression';
import { money } from '@/game/format';
import { chooseLifeBackground, currentHousing, enableLifeRpg, lifeSkillProgress, lifeSkillXpMultiplier, moveToHousing } from '@/game/systems/life-progression';
import type { GameState } from '@/game/types';

const statLabels = [
  ['grit','Grit','Work stamina & hands-on learning'],
  ['focus','Focus','Creative practice & concentration'],
  ['people','People','Sales, service & communication'],
  ['knowledge','Knowledge','Tech, finance & property learning'],
  ['adaptability','Adaptability','Helps learning across every path'],
] as const;

export function LifeRpgView({ state, setState }: { state: GameState; setState: React.Dispatch<React.SetStateAction<GameState | null>> }) {
  const life = state.life;
  if (!life.enabled) {
    const returning=!!life.backgroundId || Object.values(life.skillXp).some((xp)=>xp>0);
    return <section className="panel life-rpg-optin">
      <div><span className="eyebrow">OPTIONAL LIFE / RPG LAYER</span><h2>{returning?'Resume your character build':'Turn the climb into a character build'}</h2><p>Enable skills, starting background, personal stats and realistic housing choices. Skills can unlock work, passive income and businesses. Leave it off and the core economy keeps its normal unlock rules.{returning?' Your existing RPG progress is preserved while paused.':''}</p></div>
      <button className="primary" type="button" onClick={() => setState((current) => current ? { ...current, life: enableLifeRpg(current.life,current.time.gameMinute,current.time.settings.dayLengthMinutes), updatedAt:Date.now() } : current)}>{returning?'Resume Life RPG':'Enable Life RPG'}</button>
    </section>;
  }

  const housing = currentHousing(life);
  return <section className="life-rpg-shell">
    {!life.backgroundId ? <section className="panel life-background-panel">
      <span className="eyebrow">STARTING BACKGROUND</span><h2>What do you already know?</h2><p className="muted">This is a one-time starting identity, not a class lock. It gives small stat and skill head starts; every skill can still be learned during the run.</p>
      <div className="life-background-grid">{lifeBackgrounds.map((entry)=><button type="button" key={entry.id} onClick={() => setState((current)=>current ? {...current,life:chooseLifeBackground(current.life,entry.id),updatedAt:Date.now()} : current)}><span>{entry.emoji}</span><b>{entry.name}</b><small>{entry.description}</small><em>{Object.entries(entry.startingSkillXp).map(([id,xp])=>`${lifeSkills.find((s)=>s.id===id)?.name ?? id} +${xp} XP`).join(' · ') || 'Balanced start'}</em></button>)}</div>
    </section> : null}

    <section className="panel life-profile-panel">
      <div className="life-profile-head"><div><span className="eyebrow">YOUR BUILD</span><h2>{lifeBackgrounds.find((entry)=>entry.id===life.backgroundId)?.name ?? 'Building your path'}</h2><small className="life-profile-note">Stats and housing now slightly influence how quickly related skills grow.</small></div><div className="life-profile-actions"><span className="life-housing-chip">{housing.emoji} {housing.name}</span><button type="button" className="life-pause-button" onClick={()=>setState((current)=>current?{...current,life:{...current.life,enabled:false},updatedAt:Date.now()}:current)}>Pause RPG layer</button></div></div>
      <div className="life-stat-grid">{statLabels.map(([id,label,hint])=><div key={id}><span>{label}</span><b>{life.stats[id]}</b><small>{hint}</small></div>)}</div>
    </section>

    <section className="panel life-skills-panel">
      <div className="section-heading"><div><span className="eyebrow">SKILLS</span><h2>Learn in your own time</h2></div><span>Study sessions are in Time & Schedule</span></div>
      <div className="life-skill-grid">{lifeSkills.map((skill)=>{const progress=lifeSkillProgress(life,skill.id);const rate=lifeSkillXpMultiplier(life,skill.id);return <article key={skill.id}><header><span>{skill.emoji}</span><div><b>{skill.name}</b><small>{skill.description}</small></div><em>Lv {progress.level}</em></header><div className="life-xp-bar"><i><span style={{width:`${Math.round(progress.progress*100)}%`}} /></i><small>{Math.round(progress.xp).toLocaleString()} XP{progress.level<10 ? ` · ${Math.max(0,progress.next-progress.xp).toFixed(0)} to next` : ' · MAX'} · learning ×{rate.toFixed(2)}</small></div><p>{skill.examples}</p></article>})}</div>
    </section>

    <section className="panel life-housing-panel">
      <div className="section-heading"><div><span className="eyebrow">HOUSING</span><h2>Where are you staying?</h2></div><span>{life.housingArrears > 0 ? `Arrears ${money(life.housingArrears)}` : `${money(housing.dailyCost)}/day`}</span></div>
      <p className="muted">Stay with someone, use temporary housing, rent, lease or buy. Better housing can improve focus/recovery; recurring costs advance with simulated game days. Classic/non-time play is not quietly charged while the clock is disabled.</p>
      {life.housingArrears>0 ? <div className="housing-arrears">Housing arrears: <b>{money(life.housingArrears)}</b>. Later debt/credit integration can turn this into late fees, eviction risk and repayment choices.</div> : null}
      <div className="housing-option-grid">{housingOptions.map((entry)=>{
        const selected=life.housingId===entry.id;
        const owned=life.ownedHousingIds.includes(entry.id);
        const upfront=owned && entry.kind==='owned' ? 0 : entry.upfrontCost;
        return <article key={entry.id} className={selected?'selected':''}><header><span>{entry.emoji}</span><div><b>{entry.name}</b><small>{entry.kind.toUpperCase()}</small></div>{selected?<em>Current</em>:null}</header><p>{entry.description}</p><div className="housing-numbers"><span>Move-in <b>{owned?'Owned':money(upfront)}</b></span><span>Daily <b>{money(entry.dailyCost)}</b></span><span>≈ Monthly <b>{money(entry.dailyCost*30)}</b></span><span>Stability <b>{entry.stability}/10</b></span><span>Focus <b>{entry.focusBonus>=0?'+':''}{entry.focusBonus}</b></span><span>Recovery <b>{entry.recoveryBonus>=0?'+':''}{entry.recoveryBonus}</b></span></div><button type="button" disabled={selected || state.cash<upfront} onClick={()=>setState((current)=>current ? moveToHousing(current,entry.id) : current)}>{selected?'Current housing':owned?'Move back in':entry.kind==='owned'?`Buy · ${money(upfront)}`:upfront?`Move · ${money(upfront)}`:'Move here'}</button></article>})}</div>
    </section>
  </section>;
}
