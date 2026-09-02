'use client';

import { careerJobs } from '@/data/careers';
import { educationPrograms } from '@/data/education';
import { lifeSkills } from '@/data/life-progression';
import { money } from '@/game/format';
import {
  applyForCareer,
  careerBoardJobs,
  careerDailyPay,
  careerJobUnlocked,
  currentCareerJob,
  discoveredCareerJobs,
  leaveCareer,
  normalizeCareer,
  promoteCareer,
  requestCareerRaise,
  researchCareers,
  rotateCareerBoard,
} from '@/game/systems/careers';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import type { GameState } from '@/game/types';

export function CareerView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const career = normalizeCareer(state.career);
  const current = currentCareerJob(state);
  const pay = careerDailyPay(state);
  const openings = careerBoardJobs(state, 12);
  const discovered = discoveredCareerJobs(state);
  const undiscoveredCount = Math.max(0, careerJobs.length - discovered.length);

  if (!state.life.enabled) return null;

  const renderJob = (job: (typeof careerJobs)[number]) => {
    const unlocked = careerJobUnlocked(state, job.id);
    const skill = job.requiredSkillId ? lifeSkills.find(candidate => candidate.id === job.requiredSkillId) : null;
    const level = job.requiredSkillId ? lifeSkillLevel(state.life, job.requiredSkillId) : 0;
    const qualification = job.qualification;
    const credential = qualification?.credentialId
      ? educationPrograms.find(program => program.id === qualification.credentialId)?.name
      : null;

    return (
      <article key={job.id} className={career.jobId === job.id ? 'selected' : ''}>
        <header>
          <span>{job.emoji}</span>
          <div>
            <b>{job.name}</b>
            <small>{job.trackId.toUpperCase()}</small>
          </div>
          <em>{money(job.payPerDay)}/day</em>
        </header>
        <p>{job.description}</p>
        <small>
          {skill ? `${skill.name} Lv ${level}/${job.requiredSkillLevel ?? 0}` : 'Open entry'}
          {job.requiredReputation ? ` · Rep ${career.careerReputation}/${job.requiredReputation}` : ''}
        </small>
        {qualification ? (
          <small className="earning-skill-note">
            Qualify via {credential ?? 'credential'} OR {qualification.experienceDays}d experience OR {skill?.name ?? 'skill'} Lv {qualification.alternativeSkillLevel}
          </small>
        ) : null}
        <button
          type="button"
          disabled={!unlocked || career.jobId === job.id}
          onClick={() => setState(previous => previous ? applyForCareer(previous, job.id) : previous)}
        >
          {career.jobId === job.id ? 'Current job' : unlocked ? 'Apply' : 'Locked'}
        </button>
      </article>
    );
  };

  return (
    <section className="panel career-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CAREER</span>
          <h2>{current ? `${current.emoji} ${current.name}` : 'Find stable work'}</h2>
        </div>
        <span>Rep {career.careerReputation} · XP {career.experienceDays}d</span>
      </div>

      {current ? (
        <>
          <p className="muted">
            {current.description} · <b>{money(pay)}/game day</b>. Performance {Math.round(career.performance)}/100 · {career.daysInCurrentJob} days in role.
          </p>
          <div className="career-current-actions">
            {current.nextJobId ? (
              <button
                type="button"
                disabled={!careerJobUnlocked(state, current.nextJobId) || career.performance < 65}
                onClick={() => setState(previous => previous ? promoteCareer(previous) : previous)}
              >
                Seek promotion
              </button>
            ) : null}
            <button
              type="button"
              disabled={career.daysInCurrentJob < 10 || career.performance < 70}
              onClick={() => setState(previous => previous ? requestCareerRaise(previous) : previous)}
            >
              Ask for raise
            </button>
            <button type="button" onClick={() => setState(previous => previous ? leaveCareer(previous) : previous)}>
              Quit
            </button>
          </div>
          <small className="muted">
            Raise ×{career.raiseMultiplier.toFixed(2)} · Raises {career.raises} · Promotions {career.promotions}
          </small>
        </>
      ) : (
        <>
          <p className="muted">
            The job market is broader than a single ladder. Skills reveal nearby career paths automatically, while career research permanently uncovers additional possibilities.
          </p>
          <small className="muted">
            Jobs held {career.jobsHeld} · Quits {career.voluntaryQuits} · Layoffs {career.layoffs} · Fired {career.fired} · Unemployed {career.unemploymentDays}d
          </small>
        </>
      )}

      <div className="career-market-toolbar">
        <div>
          <span className="eyebrow">JOB MARKET</span>
          <b>{openings.length} current openings · {discovered.length}/{careerJobs.length} careers known</b>
          <small>
            Openings rotate. Research reveals three careers closest to your current skills and reputation. {undiscoveredCount ? `${undiscoveredCount} remain undiscovered.` : 'You have discovered the full career catalog.'}
          </small>
        </div>
        <div className="career-current-actions">
          <button type="button" onClick={() => setState(previous => previous ? rotateCareerBoard(previous) : previous)}>
            Cycle openings
          </button>
          <button type="button" onClick={() => setState(previous => previous ? researchCareers(previous, 3) : previous)}>
            Research careers
          </button>
        </div>
      </div>

      <div className="career-grid">{openings.map(renderJob)}</div>

      <details className="career-directory">
        <summary>Career directory · {discovered.length} discovered</summary>
        <p className="muted">
          The directory keeps every career you have learned about even when no opening is currently on the board. New skill levels can reveal jobs without spending money.
        </p>
        <div className="career-directory-list">
          {discovered
            .slice()
            .sort((a, b) => a.trackId.localeCompare(b.trackId) || a.payPerDay - b.payPerDay)
            .map(job => (
              <div key={job.id} className="career-directory-row">
                <span>{job.emoji}</span>
                <div><b>{job.name}</b><small>{job.trackId}</small></div>
                <strong>{money(job.payPerDay)}/day</strong>
              </div>
            ))}
        </div>
      </details>
    </section>
  );
}