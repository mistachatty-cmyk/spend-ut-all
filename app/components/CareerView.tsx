'use client';
import { careerJobs } from '@/data/careers';
import { lifeSkills } from '@/data/life-progression';
import { applyForCareer, careerJobUnlocked, currentCareerJob, leaveCareer, normalizeCareer, promoteCareer } from '@/game/systems/careers';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import { money } from '@/game/format';
import type { GameState } from '@/game/types';

export function CareerView({state,setState}:{state:GameState;setState:React.Dispatch<React.SetStateAction<GameState|null>>}){
 const career=normalizeCareer(state.career), current=currentCareerJob(state);
 if(!state.life.enabled)return null;
 return <section className="panel career-panel"><div className="section-heading"><div><span className="eyebrow">CAREER</span><h2>{current?`${current.emoji} ${current.name}`:'Find stable work'}</h2></div><span>Reputation {career.careerReputation} · Experience {career.experienceDays}d</span></div>
 {current?<><p className="muted">{current.description} · {money(current.payPerDay)}/game day. Wages arrive as simulated days pass.</p><div className="career-current-actions">{current.nextJobId?<button type="button" disabled={!careerJobUnlocked(state,current.nextJobId)} onClick={()=>setState(s=>s?promoteCareer(s):s)}>Seek promotion</button>:null}<button type="button" onClick={()=>setState(s=>s?leaveCareer(s):s)}>Leave job</button></div></>:<p className="muted">Apply for entry work now. Better roles unlock from skill levels and career reputation rather than simply buying access.</p>}
 <div className="career-grid">{careerJobs.map(job=>{const unlocked=careerJobUnlocked(state,job.id);const skill=job.requiredSkillId?lifeSkills.find(s=>s.id===job.requiredSkillId):null;const level=job.requiredSkillId?lifeSkillLevel(state.life,job.requiredSkillId):0;return <article key={job.id} className={career.jobId===job.id?'selected':''}><header><span>{job.emoji}</span><div><b>{job.name}</b><small>{job.trackId.toUpperCase()}</small></div><em>{money(job.payPerDay)}/day</em></header><p>{job.description}</p><small>{skill?`${skill.name} Lv ${level}/${job.requiredSkillLevel??0}`:'Open entry'}{job.requiredReputation?` · Rep ${career.careerReputation}/${job.requiredReputation}`:''}</small><button type="button" disabled={!unlocked||career.jobId===job.id} onClick={()=>setState(s=>s?applyForCareer(s,job.id):s)}>{career.jobId===job.id?'Current job':unlocked?'Apply':'Locked'}</button></article>})}</div></section>;
}