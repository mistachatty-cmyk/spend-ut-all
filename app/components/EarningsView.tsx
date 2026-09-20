'use client';

import { useState } from 'react';
import { CareerView } from './CareerView';
import { EducationView } from './EducationView';
import { FreelanceView } from './FreelanceView';
import { LifeRpgView } from './LifeRpgView';
import { TimeView } from './TimeView';
import { PurchaseVisual } from './PurchaseVisual';
import { activeEarnings, incomeStreams } from '@/data/earnings';
import { lifeSkills } from '@/data/life-progression';
import { investments } from '@/data/investments';
import { activeEarningUnlocked, buyIncomeStream, performActiveEarning } from '@/game/earning-actions';
import { executeInvestment, investmentUnlocked } from '@/game/investment-actions';
import { money } from '@/game/format';
import { netWorth } from '@/game/engine';
import { canUnlockIncomeStream, incomeStreamUnitCost, incomeStreamsPerSecond } from '@/game/systems/earnings';
import { lifeSkillLevel } from '@/game/systems/life-progression';
import { emitMicroMotion } from '@/game/systems/micro-animations';
import { playCoinSound, playPurchaseSound, playClickSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';
import { SponsoredAdBanner } from './SponsoredAdBanner';
import type { GameState } from '@/game/types';

function skillName(id?: string) {
  return lifeSkills.find(skill => skill.id === id)?.name ?? id ?? '';
}

export function EarningsView({
  state,
  setState,
}: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [lastResult, setLastResult] = useState('');
  const passive = incomeStreamsPerSecond(state);
  const worth = netWorth(state);

  return (
    <section className="earnings-shell">
      <section className="panel earnings-hero">
        <div>
          <span className="eyebrow">WAYS TO EARN</span>
          <h2>Start with nothing. Build toward everything.</h2>
          <p>
            Quick work grows into skills, credentials, a rotating career market, freelance clients, recurring income, companies and eventually civilization-scale deals.
          </p>
        </div>
        <div><b>{money(passive)}/s</b><span>earnings-stream income</span></div>
      </section>

      <LifeRpgView state={state} setState={setState} />
      <EducationView state={state} setState={setState} />
      <CareerView state={state} setState={setState} />
      <FreelanceView state={state} setState={setState} />

      <section className="panel">
        <span className="eyebrow">ACTIVE EARNINGS</span>
        <h2>Make money right now</h2>
        <p className="muted">
          The first options require no cash, so a bad run never becomes an economic soft-lock. In Life RPG mode, doing work also builds relevant skill XP and more specialized opportunities unlock as you improve.
        </p>
        <div className="earning-grid">
          {activeEarnings.map(earning => {
            const unlocked = activeEarningUnlocked(state, earning.id);
            const skillLocked = state.life.enabled
              && earning.requiredSkillId
              && lifeSkillLevel(state.life, earning.requiredSkillId) < (earning.requiredSkillLevel ?? 0);
            return (
              <button
                key={earning.id}
                disabled={!unlocked || state.runStatus !== 'active'}
                onClick={event => {
                  const sourceElement = event.currentTarget;
                  setState(current => {
                    if (!current) return current;
                    const next = performActiveEarning(current, earning);
                    const delta = next.cash - current.cash;
                    if (delta > 0) {
                      playCoinSound();
                      emitFloatingNumber({
                        text: `+${money(delta)}`,
                        x: event.clientX,
                        y: event.clientY,
                        color: '#16a34a',
                      });
                      emitMicroMotion({ target:'cash', amount:delta, displayText:`+${money(delta)}`, symbol:earning.emoji, tone:'positive', kind:'currency', sourceElement });
                    }
                    return next;
                  });
                }}
              >
                <PurchaseVisual id={earning.id} name={earning.name} emoji={earning.emoji} family="income" value={earning.payout} imageSrc={earning.imageUrl} compact locked={!unlocked} />
                <div>
                  <b>{earning.name}</b>
                  <small>{earning.description}</small>
                  {state.life.enabled && earning.rewardSkillId ? (
                    <small className="earning-skill-note">+{earning.rewardSkillXp ?? 0} {skillName(earning.rewardSkillId)} XP</small>
                  ) : null}
                  {skillLocked ? (
                    <small className="earning-lock-note">Requires {skillName(earning.requiredSkillId)} Lv {earning.requiredSkillLevel}</small>
                  ) : null}
                </div>
                <em>+{money(earning.payout)}</em>
              </button>
            );
          })}
        </div>
      </section>

      <TimeView state={state} setState={setState} />

      <section className="panel">
        <span className="eyebrow">PASSIVE & SIDE INCOME</span>
        <h2>Build the money machine earlier</h2>
        <p className="muted">
          The ladder begins with small, plausible operations before vending, property and institutional-scale assets.
        </p>
        <div className="stream-grid">
          {incomeStreams.map(stream => {
            const owned = state.incomeStreams?.[stream.id] ?? 0;
            const cost = incomeStreamUnitCost(state, stream);
            const unlocked = canUnlockIncomeStream(state, stream);
            const skillLocked = state.life.enabled
              && stream.requiredSkillId
              && lifeSkillLevel(state.life, stream.requiredSkillId) < (stream.requiredSkillLevel ?? 0);
            return (
              <article key={stream.id}>
                <PurchaseVisual id={stream.id} name={stream.name} emoji={stream.emoji} family="income" value={stream.baseCost} imageSrc={stream.imageUrl} compact locked={!unlocked} />
                <div>
                  <b>{stream.name}</b>
                  <small>{stream.description}</small>
                  <em>Owned {owned} · +{money(stream.incomePerSecond * owned)}/s</em>
                  {skillLocked ? (
                    <small className="earning-lock-note">Requires {skillName(stream.requiredSkillId)} Lv {stream.requiredSkillLevel}</small>
                  ) : null}
                </div>
                <button
                  disabled={!unlocked || state.cash < cost || state.runStatus !== 'active'}
                  onClick={event => {
                    const sourceElement = event.currentTarget;
                    playPurchaseSound();
                    emitFloatingNumber({
                      text: `-${money(cost)}`,
                      x: event.clientX,
                      y: event.clientY,
                      color: '#e11d48',
                    });
                    emitMicroMotion({
                      target: 'cash',
                      amount: -cost,
                      displayText: `-${money(cost)}`,
                      symbol: stream.emoji,
                      tone: 'negative',
                      kind: 'currency',
                      sourceElement,
                    });
                    setState(current => current ? buyIncomeStream(current, stream) : current);
                  }}
                >
                  Buy · {money(cost)}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <SponsoredAdBanner slotId="7849102486" format="horizontal" />

      <section className="panel investment-panel">
        <span className="eyebrow">OPTIONAL INVESTING</span>
        <h2>Risk can make the counter flip direction</h2>
        {lastResult ? <div className="investment-result">{lastResult}</div> : null}
        <div className="investment-grid">
          {investments.map(investment => {
            const unlocked = investmentUnlocked(state, investment);
            return (
              <article key={investment.id}>
                <span>{investment.emoji}</span>
                <div><b>{investment.name}</b><small>{investment.description}</small></div>
                <div>
                  {[0.1, 0.25, 0.5].map(fraction => (
                    <button
                      key={fraction}
                      disabled={!unlocked || state.runStatus !== 'active'}
                      onClick={event => {
                        const sourceElement = event.currentTarget;
                        setState(current => {
                          if (!current) return current;
                          const result = executeInvestment(current, investment, fraction, worth);
                          if (!result.stake) {
                            playClickSound();
                            setLastResult(`Need at least ${money(investment.minimumStake)} available.`);
                            return current;
                          }
                          if (result.delta >= 0) {
                            playCoinSound();
                            emitFloatingNumber({
                              text: `+${money(result.delta)}`,
                              x: event.clientX,
                              y: event.clientY,
                              color: '#16a34a',
                            });
                            emitMicroMotion({
                              target: 'cash',
                              amount: result.delta,
                              displayText: `+${money(result.delta)}`,
                              symbol: '📈',
                              tone: 'positive',
                              kind: 'currency',
                              sourceElement,
                            });
                          } else {
                            playPurchaseSound();
                            emitFloatingNumber({
                              text: `${money(result.delta)}`,
                              x: event.clientX,
                              y: event.clientY,
                              color: '#e11d48',
                            });
                            emitMicroMotion({
                              target: 'cash',
                              amount: result.delta,
                              displayText: `${money(result.delta)}`,
                              symbol: '📉',
                              tone: 'negative',
                              kind: 'currency',
                              sourceElement,
                            });
                          }
                          setLastResult(`${investment.name}: ${result.delta >= 0 ? '+' : ''}${money(result.delta)}.`);
                          return result.state;
                        });
                      }}
                    >
                      {Math.round(fraction * 100)}%
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}