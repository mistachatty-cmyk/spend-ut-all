'use client';

import { useState } from 'react';
import { freelanceServices } from '@/data/freelance';
import { lifeSkills } from '@/data/life-progression';
import { money } from '@/game/format';
import {
  freelanceOffers,
  freelancePayoutRange,
  freelanceServiceUnlocked,
  normalizeFreelance,
  performFreelanceJob,
  researchFreelanceServices,
  rotateFreelanceOffers,
} from '@/game/systems/freelance';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import { emitMicroMotion } from '@/game/systems/micro-animations';
import type { GameState } from '@/game/types';

export function FreelanceView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [lastResult, setLastResult] = useState('');
  const freelance = normalizeFreelance(state.freelance);
  const offers = freelanceOffers(state, 6);
  const now = Date.now();

  if (!state.life.enabled) return null;

  return (
    <section className="panel freelance-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">INDEPENDENT WORK</span>
          <h2>Turn skills into clients</h2>
        </div>
        <span>Rep {freelance.reputation} · Portfolio {freelance.portfolio}</span>
      </div>

      <p className="muted">
        Freelance contracts bridge quick work and business ownership. Better skills improve pricing, good work builds repeat clients, and several service paths feed directly into future businesses.
      </p>

      <div className="freelance-stat-strip">
        <div><span>Completed</span><b>{freelance.completedJobs}</b></div>
        <div><span>Repeat work</span><b>{freelance.repeatClients}</b></div>
        <div><span>Clients</span><b>{freelance.clients.length}</b></div>
        <div><span>Revenue</span><b>{money(freelance.lifetimeRevenue)}</b></div>
      </div>

      {lastResult ? <div className="investment-result">{lastResult}</div> : null}

      <div className="career-market-toolbar">
        <div>
          <span className="eyebrow">CLIENT BOARD</span>
          <b>{offers.length} contracts in this cycle</b>
          <small>Skills automatically expose nearby work. Research can uncover a service before you naturally encounter it.</small>
        </div>
        <div className="career-current-actions">
          <button type="button" onClick={() => setState(previous => previous ? rotateFreelanceOffers(previous) : previous)}>
            Cycle contracts
          </button>
          <button type="button" onClick={() => setState(previous => previous ? researchFreelanceServices(previous, 2) : previous)}>
            Research work
          </button>
        </div>
      </div>

      <div className="freelance-grid">
        {offers.map(service => {
          const skill = lifeSkills.find(candidate => candidate.id === service.skillId);
          const level = lifeSkillLevel(state.life, service.skillId);
          const unlocked = freelanceServiceUnlocked(state, service.id, now);
          const range = freelancePayoutRange(state, service.id);
          const cooldown = Math.max(0, (freelance.serviceCooldownUntil[service.id] ?? 0) - now);

          return (
            <article key={service.id}>
              <header>
                <span>{service.emoji}</span>
                <div><b>{service.name}</b><small>{skill?.name ?? service.skillId}</small></div>
                <em>{money(range.low)}–{money(range.high)}</em>
              </header>
              <p>{service.description}</p>
              <small>
                {skill?.name} Lv {level}/{service.requiredSkillLevel}
                {service.requiredReputation ? ` · Rep ${freelance.reputation}/${service.requiredReputation}` : ''}
              </small>
              <button
                type="button"
                disabled={!unlocked}
                onClick={event => {
                  const sourceElement = event.currentTarget;
                  setState(previous => {
                    if (!previous) return previous;
                    const result = performFreelanceJob(previous, service.id);
                    if (result.success && result.payout > 0) {
                      emitMicroMotion({ target:'cash', amount:result.payout, displayText:`+${money(result.payout)}`, symbol:service.emoji, tone:'positive', kind:'currency', sourceElement });
                      setLastResult(`${result.repeatClient ? 'Repeat client' : 'New client'} · ${result.clientName} paid ${money(result.payout)}.`);
                    } else if (result.state !== previous) {
                      setLastResult(`${result.clientName || 'The client'} was not satisfied. No payout this time, but you gained experience.`);
                    }
                    return result.state;
                  });
                }}
              >
                {cooldown > 0 ? `Available in ${Math.ceil(cooldown / 1000)}s` : unlocked ? 'Take contract' : 'Build skill / reputation'}
              </button>
            </article>
          );
        })}
      </div>

      {freelance.clients.length ? (
        <details className="career-directory">
          <summary>Client book · {freelance.clients.length} relationships</summary>
          <div className="career-directory-list">
            {freelance.clients.slice(0, 12).map(client => {
              const service = freelanceServices.find(candidate => candidate.id === client.serviceId);
              return (
                <div key={client.id} className="career-directory-row">
                  <span>{service?.emoji ?? '🤝'}</span>
                  <div><b>{client.name}</b><small>Trust {Math.round(client.trust)} · {client.jobsCompleted} jobs</small></div>
                  <strong>{money(client.totalSpend)}</strong>
                </div>
              );
            })}
          </div>
        </details>
      ) : null}
    </section>
  );
}