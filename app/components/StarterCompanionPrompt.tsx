'use client';

import { useEffect, useState } from 'react';
import { lokPets } from '@/data/customizations';
import { equipCustomization, grantCustomization, loadCustomizationInventory, saveCustomizationInventory } from '@/game/systems/customizations';
import { PixelPetSprite } from './PixelPetSprite';

const SAVE_KEY = 'spend-it-all-v1';
const STARTER_COMPANION_KEY = 'spend-it-all-starter-companion-v1';
const choices = [
  { id: 'pet-lok-slime', benefit: 'Balanced guide', detail: 'General economy, milestone, risk and progression reminders.' },
  { id: 'pet-coin-cat', benefit: 'Money watcher', detail: 'Focuses more often on balances, purchases, cash flow and value.' },
  { id: 'pet-espresso-bot', benefit: 'Work coach', detail: 'Focuses more often on active earning, time, fatigue and work blocks.' },
] as const;

export function StarterCompanionPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        if (localStorage.getItem(STARTER_COMPANION_KEY)) return setOpen(false);
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return setOpen(false);
        const save = JSON.parse(raw) as { started?: boolean };
        setOpen(!!save.started);
      } catch { setOpen(false); }
    };
    check();
    const timer = window.setInterval(check, 700);
    return () => window.clearInterval(timer);
  }, []);

  if (!open) return null;

  const choose = (id: string) => {
    let inventory = loadCustomizationInventory();
    if (!inventory.ownedIds.includes(id)) inventory = grantCustomization(inventory, id, 'starter');
    inventory = equipCustomization(inventory, id);
    saveCustomizationInventory(inventory);
    localStorage.setItem(STARTER_COMPANION_KEY, id);
    setOpen(false);
    window.location.reload();
  };

  return <div className="starter-companion-backdrop" role="dialog" aria-modal="true" aria-labelledby="starter-companion-title">
    <section className="starter-companion-panel">
      <span className="eyebrow">YOUR FIRST LOK COMPANION</span>
      <h2 id="starter-companion-title">Pick who starts the climb with you</h2>
      <p>Choose one starter companion. Their benefit is guidance and personality—not extra money or economic power. You can collect and switch companions later.</p>
      <div className="starter-companion-grid">
        {choices.map((choice) => {
          const pet = lokPets.find((entry) => entry.id === choice.id);
          if (!pet) return null;
          return <button type="button" key={choice.id} onClick={() => choose(choice.id)}>
            <span className="starter-companion-sprite"><PixelPetSprite petId={pet.id} mood="happy" size={64} /></span>
            <span className="starter-companion-name">{pet.name}</span>
            <strong>{choice.benefit}</strong>
            <small>{choice.detail}</small>
            <em>{pet.personality}</em>
          </button>;
        })}
      </div>
      <small className="starter-companion-note">This choice is permanent only as your free starter grant. You can equip another owned companion anytime from Style → Companions.</small>
    </section>
  </div>;
}
