'use client';

import { useEffect, useMemo, useState } from 'react';
import { customizationById, lokPets } from '@/data/customizations';
import type { CustomizationInventory, LokPetDefinition, PetMood } from '@/game/customization-types';
import { getActiveMarketEvent } from '@/game/systems/market-events';
import { bankruptcySecondsRemaining } from '@/game/systems/risk';
import type { GameState } from '@/game/types';
import { money } from '@/game/format';
import { PixelPetSprite } from './PixelPetSprite';

const PET_ADVICE_KEY = 'spend-it-all-pet-advice-v1';

type AdvisorRole = LokPetDefinition['advisorRole'];

function petStatus(state: GameState, income: number, role: AdvisorRole): { mood: PetMood; message: string } {
  const countdown = bankruptcySecondsRemaining(state);
  const activity = state.time.activeActivity?.id ?? null;
  const hour = Math.floor((state.time.gameMinute % 1440) / 60);
  const event = getActiveMarketEvent(state);

  if (countdown) return { mood: 'worried', message: `${countdown}s to bankruptcy. Find positive cash flow fast.` };
  if (state.cash < 0) return { mood: 'worried', message: `Debt is at ${money(Math.abs(state.cash))}. Your counter is moving the wrong way.` };
  if (income < 0) return { mood: 'worried', message: `Costs are beating income by ${money(Math.abs(income))}/sec.` };
  if (event) return { mood: event.incomeMultiplier >= 1 ? 'excited' : 'worried', message: `${event.emoji} ${event.name}: ${event.description} Revenue ×${event.incomeMultiplier.toFixed(2)}, costs ×${event.upkeepMultiplier.toFixed(2)}.` };
  if (activity === 'regional-flight' || activity === 'long-haul-flight') return { mood: 'traveling', message: activity === 'long-haul-flight' ? 'Long-haul day. I’ll watch the empire while the time zones move underneath us.' : 'Regional flight in progress. Next market, next opportunity.' };
  if (activity === 'espresso-break') return { mood: 'excited', message: 'Espresso acquired. Tiny cup, extremely serious business.' };
  if (activity === 'sleep' || activity === 'power-nap') return { mood: 'sleepy', message: activity === 'sleep' ? 'Eight hours invested in tomorrow’s productivity.' : 'Power nap mode. Wake me when the counter moves.' };
  if (state.time.jetLag >= 45) return { mood: 'sleepy', message: 'Jet lag is getting heavy. Rest or a short recovery activity could help.' };
  if (state.time.fatigue >= 70) return { mood: 'sleepy', message: 'Long day. Your fatigue is high enough to hurt efficiency.' };
  if (state.regionLevel >= 5) return { mood: 'celebrating', message: 'Planetary scale. Also: the Cards & LOKDEX district is always open.' };
  if (state.townLevel >= 5) return { mood: 'happy', message: 'Metropolis online. The city is officially part of the machine now.' };
  if (income >= 1_000_000) return { mood: 'excited', message: `The counter is flying at ${money(income)}/sec.` };
  if (hour >= 22 || hour < 5) return { mood: 'sleepy', message: 'It’s late in the game world. Some industries may be closed even if the empire is awake.' };

  const tipCycle = Math.floor((state.activePlayMs ?? 0) / 45_000) % 6;
  if (role === 'money' && tipCycle % 2 === 0) return { mood: 'happy', message: income > 0 ? `Money check: ${money(state.cash)} cash and ${money(income)}/sec net flow. I’ll flag when the balance starts working against you.` : 'Money check: no passive flow yet. Earn first, then prioritize assets that create repeatable cash flow.' };
  if (role === 'work' && tipCycle % 2 === 0) return { mood: 'happy', message: state.time.fatigue > 45 ? `Work check: fatigue is ${Math.round(state.time.fatigue)}%. A recovery block may be worth more than forcing another shift.` : 'Work check: your schedule is healthy. Active earning blocks are strongest before fatigue starts stacking.' };
  if (tipCycle === 0) return { mood: 'idle', message: 'Cards & LOKDEX is available anytime. Packs, binder, and collection live there.' };
  if (tipCycle === 1) return { mood: 'happy', message: 'LOK is cosmetic currency. Spend it on themes, counters, effects, companions, and gear without changing economic power.' };
  if (tipCycle === 2) return { mood: 'happy', message: income > 0 ? `Positive cash flow at ${money(income)}/sec. Keep the machine healthy.` : 'No passive income yet. Earn, buy cash-flow assets, then let the economy start working for you.' };
  if (tipCycle === 3) return { mood: 'idle', message: 'World events can swing revenue and costs. I’ll call out the important ones when they happen.' };
  if (tipCycle === 4) return { mood: 'happy', message: 'Your Card Shop collection is persistent. You can visit it without abandoning the current run.' };
  return { mood: 'idle', message: role === 'starter' ? 'Balanced guide active: I’ll watch milestones, debt, fatigue, world events, and side districts.' : 'I’ll keep an eye on the parts of the economy I’m best at.' };
}

export function PetCompanion({ state, income, inventory }: { state: GameState; income: number; inventory: CustomizationInventory }) {
  const [advice, setAdvice] = useState(true);
  useEffect(() => {
    try { const value = localStorage.getItem(PET_ADVICE_KEY); if (value !== null) setAdvice(value !== '0'); } catch {}
  }, []);
  const toggleAdvice = () => setAdvice((current) => {
    const next = !current;
    try { localStorage.setItem(PET_ADVICE_KEY, next ? '1' : '0'); } catch {}
    return next;
  });

  const pet = useMemo(() => lokPets.find((entry) => entry.id === inventory.equipped.petId) ?? lokPets[0], [inventory.equipped.petId]);
  const status = petStatus(state, income, pet.advisorRole);
  const accessories = inventory.equipped.petAccessoryIds.map((id) => customizationById(id)).filter(Boolean);

  return <aside className={`pet-companion mood-${status.mood}`} aria-label={`${pet.name} companion`}>
    <div className="pet-avatar" aria-hidden="true"><PixelPetSprite petId={pet.id} mood={status.mood} size={30} />{accessories.length ? <div className="pet-accessories">{accessories.map((item) => <i key={item!.id}>{item!.emoji}</i>)}</div> : null}</div>
    <div className="pet-copy"><div><b>{pet.name}</b><small>{status.mood}</small></div>{advice ? <p>{status.message}</p> : <p className="pet-muted">Advice muted. I’m just hanging out.</p>}</div>
    <button type="button" onClick={toggleAdvice}>{advice ? 'Mute tips' : 'Enable tips'}</button>
  </aside>;
}
