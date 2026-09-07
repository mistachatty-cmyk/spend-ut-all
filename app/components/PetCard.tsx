'use client';

import { cardStatLabels, affinityIcon } from '@/data/lokdex-icons';
import type { CustomizationDefinition, LokPetDefinition } from '@/game/customization-types';
import type { LokDexCharacter } from '@/game/lokdex-types';
import { PixelPetSprite } from './PixelPetSprite';

export function PetCard({ pet, dexEntry, owned, equipped, favorite, copies, equippedAccessories, lokBuyable, requirement, lifetimeRequired, lifetimeReady, canAfford, wallet, onEquip, onPurchase, onOpenDetail }: {
  pet: LokPetDefinition;
  dexEntry: LokDexCharacter | null;
  owned: boolean;
  equipped: boolean;
  favorite: boolean;
  copies: number;
  equippedAccessories: CustomizationDefinition[];
  lokBuyable: boolean;
  requirement: string | null;
  lifetimeRequired: number;
  lifetimeReady: boolean;
  canAfford: boolean;
  wallet: { balance: number; lifetimeEarned: number };
  onEquip: () => void;
  onPurchase: () => void;
  onOpenDetail: () => void;
}) {
  return <article className={`pet-card rarity-${pet.rarity} ${equipped ? 'equipped' : ''} ${!lifetimeReady ? 'tier-locked' : ''}`}>
    <div className="pet-card-head">
      {dexEntry ? <span className="pet-card-dex">#{String(dexEntry.number).padStart(3, '0')}</span> : null}
      {dexEntry ? <span className="pet-card-affinity" title={dexEntry.affinity}>{affinityIcon[dexEntry.affinity] ?? '◈'}</span> : null}
      {favorite ? <span className="pet-card-favorite" aria-label="Favorite">★</span> : null}
    </div>
    <div className="pet-card-art"><PixelPetSprite petId={pet.id} mood={owned ? 'happy' : 'idle'} silhouette={!owned} size={72} /></div>
    <div className="pet-card-copy">
      <h3>{pet.name}</h3>
      <span className="pet-card-species">{pet.species}</span>
      <div className="pet-card-tags"><em>{pet.rarity}</em>{dexEntry ? <em>{dexEntry.archetype}</em> : null}<em>{pet.advisorRole}</em>{copies > 0 ? <em>×{copies}</em> : null}</div>
      <small className="pet-personality">{pet.personality}</small>
    </div>
    {dexEntry ? <div className="pet-card-stats">{cardStatLabels.map(({ key, label }) => <div className="pet-card-stat" key={key}><span>{label}</span><i><b style={{ width: `${dexEntry.cardStats[key]}%` }} /></i></div>)}</div> : null}
    {equippedAccessories.length ? <div className="pet-card-gear">{equippedAccessories.map((item) => <span key={item.id} title={item.name}>{item.emoji}</span>)}</div> : null}
    <div className="pet-card-actions">
      <button type="button" className="pet-card-details" onClick={onOpenDetail}>Details</button>
      {equipped ? <button disabled>Equipped ✓</button> : owned ? <button onClick={onEquip}>Equip</button> : lokBuyable ? <button disabled={!canAfford || !lifetimeReady} onClick={onPurchase}>Buy · ◈ {(pet.lokPrice ?? 0).toLocaleString()}</button> : <button disabled>Locked</button>}
      {!owned && !lifetimeReady ? <small>Tier unlock: earn {lifetimeRequired.toLocaleString()} lifetime LOK ({wallet.lifetimeEarned.toLocaleString()} earned)</small> : null}
      {!owned && lifetimeReady && lokBuyable && !canAfford ? <small>Need ◈ {(pet.lokPrice ?? 0).toLocaleString()} current LOK</small> : null}
      {!owned && requirement ? <small>Unlock: {requirement}</small> : null}
    </div>
  </article>;
}
