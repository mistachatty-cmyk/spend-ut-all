'use client';

import { useState } from 'react';
import { lokPacks, type LokPackDef } from '@/data/lokpacks';
import type { CustomizationInventory, LokPetDefinition } from '@/game/customization-types';
import { saveCustomizationInventory } from '@/game/systems/customizations';
import { grantLokPack, openLokPack } from '@/game/systems/lokpacks';
import type { GameState } from '@/game/types';
import { lokRuntime } from '@/integrations/lok/runtime';
import { PixelPetSprite } from './PixelPetSprite';

type Reveal = { packName: string; pet: LokPetDefinition; duplicate: boolean };

/**
 * LokPacks are sealed companion packs bought with LOK or earned from unlocks.
 * Kept visually apart from the Card Credit card packs, which give LokDex cards.
 */
export function LokPackShelf({ inventory, onInventoryChange, setState }: {
  inventory: CustomizationInventory;
  onInventoryChange: (inventory: CustomizationInventory) => void;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}) {
  const [message, setMessage] = useState('');
  const [reveal, setReveal] = useState<Reveal | null>(null);

  const buy = (pack: LokPackDef) => {
    const result = lokRuntime.spend(pack.lokPrice);
    if (!result.success) {
      setMessage(`You need ◈ ${pack.lokPrice.toLocaleString()} LOK for ${pack.name}.`);
      return;
    }
    onInventoryChange(saveCustomizationInventory(grantLokPack(inventory, pack.id)));
    setState((current) => current ? { ...current, lokTokens: result.wallet.balance, lokProgressMs: result.wallet.progressMs, updatedAt: Date.now() } : current);
    setMessage(`${pack.name} added to your sealed LokPacks.`);
  };

  const open = (pack: LokPackDef) => {
    const result = openLokPack(inventory, pack.id, lokRuntime.snapshot().lifetimeEarned);
    if (!result.pet) {
      setMessage(`No LokPet is eligible from ${pack.name} yet. Earn more lifetime LOK and try again.`);
      return;
    }
    onInventoryChange(saveCustomizationInventory(result.inventory));
    setReveal({ packName: pack.name, pet: result.pet, duplicate: result.duplicate });
    setMessage('');
  };

  return <section className="panel lokpack-shelf" aria-label="LokPacks">
    <div className="lokpack-shelf-head">
      <span className="eyebrow">LOKPACKS · COMPANIONS</span>
      <p>Sealed packs that hold one LokPet each. Card packs in the Cards tab give LokDex cards instead.</p>
    </div>
    {message ? <div className="customization-message" aria-live="polite">{message}</div> : null}
    <div className="lokpack-grid">{lokPacks.map((pack) => {
      const sealed = inventory.sealedLokPacks[pack.id] ?? 0;
      const affordable = lokRuntime.snapshot().balance >= pack.lokPrice;
      return <article className="lokpack-card" key={pack.id}>
        <div className="lokpack-icon" aria-hidden="true">{pack.emoji}</div>
        <div className="lokpack-copy"><h3>{pack.name}</h3><p>{pack.description}</p><small>Sealed: {sealed}</small></div>
        <div className="lokpack-actions">
          <button disabled={!affordable} onClick={() => buy(pack)}>Buy · ◈ {pack.lokPrice.toLocaleString()}</button>
          <button disabled={sealed < 1} onClick={() => open(pack)}>Open</button>
        </div>
      </article>;
    })}</div>
    {reveal ? <div className="lokpack-reveal" role="status">
      <PixelPetSprite petId={reveal.pet.id} mood="excited" size={64} />
      <div>
        <small>{reveal.packName} opened</small>
        <h3>{reveal.pet.name}</h3>
        <p>{reveal.duplicate ? 'Already in your collection. The pack was still opened.' : `New companion · ${reveal.pet.rarity}`}</p>
      </div>
      <button onClick={() => setReveal(null)}>Close</button>
    </div> : null}
  </section>;
}
