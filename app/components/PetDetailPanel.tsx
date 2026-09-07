'use client';

import { createPortal } from 'react-dom';
import { allCustomizations } from '@/data/customizations';
import { affinityIcon, cardStatLabels } from '@/data/lokdex-icons';
import type { CustomizationInventory, LokPetDefinition } from '@/game/customization-types';
import type { LokDexCharacter, LokDexCollection } from '@/game/lokdex-types';
import { equipCustomization, isEquipped, saveCustomizationInventory, themeClass } from '@/game/systems/customizations';
import { lockInfo } from '@/game/systems/customization-lock';
import { PixelPetSprite } from './PixelPetSprite';

const reactionLabels: Record<string, string> = {
  'money-up': 'Money up',
  'money-down': 'Money down',
  achievement: 'Achievement',
  'bankruptcy-warning': 'Bankruptcy warning',
  purchase: 'Purchase',
  travel: 'Travel',
  coffee: 'Coffee',
  'day-night': 'Day/night cycle',
};

const advisorRoleLabels: Record<LokPetDefinition['advisorRole'], string> = {
  starter: 'Balanced starter guide',
  money: 'Money-focused advisor',
  work: 'Work & fatigue advisor',
  risk: 'Risk & volatility advisor',
  travel: 'Travel & scheduling advisor',
  general: 'General-purpose companion',
};

export function PetDetailPanel({ pet, dexEntry, inventory, onInventoryChange, collection, onToggleFavorite, wallet, onEquip, onPurchase, onClose }: {
  pet: LokPetDefinition;
  dexEntry: LokDexCharacter | null;
  inventory: CustomizationInventory;
  onInventoryChange: (inventory: CustomizationInventory) => void;
  collection: LokDexCollection;
  onToggleFavorite: (characterId: string) => void;
  wallet: { balance: number; lifetimeEarned: number };
  onEquip: (id: string) => void;
  onPurchase: (id: string, price: number) => void;
  onClose: () => void;
}) {
  const owned = inventory.ownedIds.includes(pet.id);
  const equipped = isEquipped(inventory, pet);
  const favorite = dexEntry ? collection.favoriteCharacterIds.includes(dexEntry.id) : false;
  const { lokBuyable, requirement, lifetimeRequired, lifetimeReady, canAfford } = lockInfo(pet, wallet);
  const gear = allCustomizations.filter((item) => item.kind === 'pet-accessory' && inventory.ownedIds.includes(item.id));
  const themeClasses = themeClass(inventory);

  const toggleGear = (id: string) => {
    const next = saveCustomizationInventory(equipCustomization(inventory, id));
    onInventoryChange(next);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(<div className={`pet-detail-backdrop ${themeClasses}`} role="presentation" onClick={onClose}>
    <div className={`pet-detail rarity-${pet.rarity}`} role="dialog" aria-modal="true" aria-label={`${pet.name} details`} onClick={(event) => event.stopPropagation()}>
      <button type="button" className="pet-detail-close" onClick={onClose} aria-label="Close details">×</button>

      <div className="pet-detail-head">
        <div className="pet-detail-art"><PixelPetSprite petId={pet.id} mood={owned ? 'happy' : 'idle'} silhouette={!owned} size={104} /></div>
        <div className="pet-detail-copy">
          {dexEntry ? <small className="pet-detail-dex">#{String(dexEntry.number).padStart(3, '0')} · GEN {dexEntry.generation} · {affinityIcon[dexEntry.affinity] ?? '◈'} {dexEntry.affinity}</small> : null}
          <h2>{pet.name}{dexEntry ? <button type="button" className={`pet-detail-favorite ${favorite ? 'active' : ''}`} onClick={() => onToggleFavorite(dexEntry!.id)} aria-pressed={favorite} aria-label="Toggle favorite">★</button> : null}</h2>
          <span className="pet-detail-species">{pet.species}{dexEntry ? ` · ${dexEntry.archetype}` : ''} · {pet.rarity}</span>
          <p className="pet-personality">{pet.personality}</p>
        </div>
      </div>

      {dexEntry ? <div className="pet-detail-stats">{cardStatLabels.map(({ key, label }) => <div className="pet-detail-stat" key={key}><span>{label}</span><i><b style={{ width: `${dexEntry.cardStats[key]}%` }} /></i><small>{dexEntry.cardStats[key]}</small></div>)}</div> : null}

      <div className="pet-detail-section">
        <b>Advisor role</b>
        <p>{advisorRoleLabels[pet.advisorRole]} · anchors near {pet.preferredAnchor.replace('-', ' ')}.</p>
        <div className="pet-detail-tags">{pet.reactions.map((reaction) => <em key={reaction}>{reactionLabels[reaction] ?? reaction}</em>)}</div>
      </div>

      {owned ? <div className="pet-detail-section">
        <b>Gear</b>
        {gear.length ? <div className="pet-detail-gear">{gear.map((item) => {
          const on = inventory.equipped.petAccessoryIds.includes(item.id);
          return <button type="button" key={item.id} className={on ? 'active' : ''} onClick={() => toggleGear(item.id)}>{item.emoji} {item.name}</button>;
        })}</div> : <p className="pet-muted">No gear owned yet. Visit the Gear tab to unlock companion accessories.</p>}
      </div> : null}

      <div className="pet-detail-actions">
        {equipped ? <button disabled>Equipped ✓</button> : owned ? <button onClick={() => onEquip(pet.id)}>Equip companion</button> : lokBuyable ? <button disabled={!canAfford || !lifetimeReady} onClick={() => onPurchase(pet.id, pet.lokPrice ?? 0)}>Buy · ◈ {(pet.lokPrice ?? 0).toLocaleString()}</button> : <button disabled>Locked</button>}
        {!owned && !lifetimeReady ? <small>Tier unlock: earn {lifetimeRequired.toLocaleString()} lifetime LOK ({wallet.lifetimeEarned.toLocaleString()} earned)</small> : null}
        {!owned && lifetimeReady && lokBuyable && !canAfford ? <small>Need ◈ {(pet.lokPrice ?? 0).toLocaleString()} current LOK</small> : null}
        {!owned && requirement ? <small>Unlock: {requirement}</small> : null}
      </div>
    </div>
  </div>, document.body);
}
