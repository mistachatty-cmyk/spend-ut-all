'use client';

import { educationPrograms } from '@/data/education';
import { lifeSkills } from '@/data/life-progression';
import { money } from '@/game/format';
import {
  canEnroll,
  canManualStudy,
  enrollEducation,
  manualStudyCooldownMs,
  manualStudySession,
  normalizeEducation,
} from '@/game/systems/education';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import type { GameState } from '@/game/types';

export function EducationView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  if (!state.life.enabled) return null;

  const education = normalizeEducation(state.education);
  const active = educationPrograms.find(program => program.id === education.activeCredentialId);
  const now = Date.now();
  const manualReady = canManualStudy(state, now);
  const cooldown = manualStudyCooldownMs(state, now);

  return (
    <section className="panel education-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">EDUCATION & CREDENTIALS</span>
          <h2>Prove what you know</h2>
        </div>
        <span>{education.credentials.length} credentials · {money(education.lifetimeTuition)} invested</span>
      </div>

      <p className="muted">
        Self-learning remains free. Credentials are optional proof for career advancement and later business/licensing paths—not a replacement for skills.
      </p>

      {active ? (
        <div className="education-progress-card">
          <div>
            <span>{active.emoji}</span>
            <div>
              <small>{state.time.settings.enabled ? 'SIMULATED STUDY' : 'CLASSIC TIME STUDY'}</small>
              <b>{active.name}</b>
              <em>{education.studyDaysRemaining} study day{education.studyDaysRemaining === 1 ? '' : 's'} remaining</em>
            </div>
          </div>
          {!state.time.settings.enabled ? (
            <button
              type="button"
              disabled={!manualReady}
              onClick={() => setState(previous => previous ? manualStudySession(previous) : previous)}
            >
              {manualReady ? 'Complete study session' : `Study again in ${Math.ceil(cooldown / 1000)}s`}
            </button>
          ) : (
            <small>Program advances as game days pass.</small>
          )}
        </div>
      ) : null}

      <div className="career-grid">
        {educationPrograms.map(program => {
          const owned = education.credentials.includes(program.id);
          const skill = lifeSkills.find(candidate => candidate.id === program.skillId);
          const level = lifeSkillLevel(state.life, program.skillId);
          const available = canEnroll(state, program.id);

          return (
            <article key={program.id} className={owned ? 'selected' : ''}>
              <header>
                <span>{program.emoji}</span>
                <div><b>{program.name}</b><small>{skill?.name} PATH</small></div>
                <em>{money(program.cost)}</em>
              </header>
              <p>{program.description}</p>
              <small>{skill?.name} Lv {level}/{program.requiredSkillLevel} · {program.studyDays}d · +{program.skillXp} XP</small>
              <button
                type="button"
                disabled={owned || Boolean(education.activeCredentialId) || !available}
                onClick={() => setState(previous => previous ? enrollEducation(previous, program.id) : previous)}
              >
                {owned
                  ? 'Earned'
                  : education.activeCredentialId
                    ? 'Program in progress'
                    : available
                      ? 'Enroll'
                      : 'Requirements unmet'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}