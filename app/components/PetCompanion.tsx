'use client';

import { useEffect, useMemo, useState } from 'react';
import { customizationById, lokPets } from '@/data/customizations';
import type { CustomizationInventory, PetMood } from '@/game/customization-types';
import { bankruptcySecondsRemaining } from '@/game/systems/risk';
import type { GameState } from '@/game/types';
import { money } from '@/game/format';

const PET_ADVICE_KEY = 'spend-it-all-pet-advice-v1';

function petStatus(state: GameState, income: number): { mood: PetMood; message: string } {
  const countdown = bankruptcySecondsRemaining(state);
  const activity = state.time.activeActivity?.id ?? null;
  const hour = Math.floor((state.time.gameMinute % 1440) / 60);

  if (countdown) return { mood: 'worried', message: `${countdown}s to bankruptcy. Find positive cash flow fast.` };
  if (state.cash < 0) return { mood: 'worried', message: `Debt is at ${money(Math.abs(state.cash))}. Your counter is moving the wrong way.` };
  if (income < 0) return { mood: 'worried', message: `Costs are beating income by ${money(Math.abs(income))}/sec.` };
  if (activity === 'regional-flight' || activity === 'long-haul-flight') return { mood: 'traveling', message: activity === 'long-haul-flight' ? 'Long-haul day. I’ll watch the empire while the time zones move underneath us.' : 'Regional flight in progress. Next market, next opportunity.' };
  if (activity === 'espresso-break') return { mood: 'excited', message: 'Espresso acquired. Tiny cup, extremely serious business.' };
  if (activity === 'sleep' || activity === 'power-nap') return { mood: 'sleepy', message: activity === 'sleep' ? 'Eight hours invested in tomorrow’s productivity.' : 'Power nap mode. Wake me when the counter moves.' };
  if (activity === 'shift-cafe') return { mood: 'happy', message: 'Part-time café shift in progress. Small money still counts.' };
  if (activity === 'shift-warehouse') return { mood: 'happy', message: 'Full warehouse shift. Eight game-hours going straight into the climb.' };
  if (activity === 'freelance-block') return { mood: 'happy', message: 'Freelance block active. Two focused hours can beat a whole idle day.' };
  if (activity === 'client-meeting') return { mood: 'excited', message: 'Client meeting. Time to make ninety minutes expensive.' };
  if (state.time.jetLag >= 45) return { mood: 'sleepy', message: 'Jet lag is getting heavy. Rest or a short recovery activity could help.' };
  if (state.time.fatigue >= 70) return { mood: 'sleepy', message: 'Long day. Your fatigue is high enough to hurt efficiency.' };
  if (state.activeEventId) return { mood: 'excited', message: 'Market event is live. Watch the revenue and cost multipliers before making a big move.' };
  if (hour >= 22 || hour < 5) return { mood: 'sleepy', message: 'It’s late in the game world. Some industries may be closed even if the empire is awake.' };
  if (income >= 1_000_000) return { mood: 'excited', message: `The counter is flying at ${money(income)}/sec.` };
  if (state.regionLevel >= 5) return { mood: 'celebrating', message: 'Planetary scale. I knew this office was getting suspiciously large.' };
  if (state.townLevel >= 5) return { mood: 'happy', message: 'Metropolis online. The city is officially part of the machine now.' };
  if (state.activePlayMs < 60_000) return { mood: 'idle', message: 'I’ll keep an eye on the counters while you build.' };
  return { mood: 'happy', message: income > 0 ? 'Positive cash flow. Keep the machine healthy.' : 'Ready when you are.' };
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
  const status = petStatus(state, income);
  const accessories = inventory.equipped.petAccessoryIds.map((id) => customizationById(id)).filter(Boolean);

  return <aside className={`pet-companion mood-${status.mood}`} aria-label={`${pet.name} companion`}>
    <div className="pet-avatar" aria-hidden="true"><span>{pet.emoji ?? '✨'}</span>{accessories.length ? <div className="pet-accessories">{accessories.map((item) => <i key={item!.id}>{item!.emoji}</i>)}</div> : null}</div>
    <div className="pet-copy"><div><b>{pet.name}</b><small>{status.mood}</small></div>{advice ? <p>{status.message}</p> : <p className="pet-muted">Advice muted. I’m just hanging out.</p>}</div>
    <button type="button" onClick={toggleAdvice}>{advice ? 'Mute tips' : 'Enable tips'}</button>
  </aside>;
}
