'use client';

import { useMemo, useState } from 'react';
import { allCustomizations } from '@/data/customizations';
import type { CustomizationInventory, CustomizationKind } from '@/game/customization-types';
import { equipCustomization, grantCustomization, isEquipped, saveCustomizationInventory } from '@/game/systems/customizations';
import type { GameState } from '@/game/types';
import { lokRuntime } from '@/integrations/lok/runtime';

const tabs: Array<{ id: 'all' | CustomizationKind; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'theme', label: 'Themes' },
  { id: 'money-counter', label: 'Counters' },
  { id: 'pet', label: 'LOK Pets' },
  { id: 'pet-accessory', label: 'Pet Gear' },
  { id: 'hud', label: 'HUDs' },
  { id: 'effect', label: 'Effects' },
  { id: 'profile-frame', label: 'Profile' },
];

const requirementNames: Record<string, string> = {
  'wolf-risk-billionaire': 'Wolf With No Net achievement',
  'spendutall-super': 'SPENDUTALL super achievement',
  'debt-billion-comeback': 'Resurrected Empire achievement',
  'nothing-millionaire': 'Self-Made Millionaire achievement',
  'region-planetary': 'Planetary Economy progression',
};

export function CustomizationView({ state, setState, inventory, onInventoryChange }: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
  inventory: CustomizationInventory;
  onInventoryChange: (inventory: CustomizationInventory) => void;
}) {
  const [tab, setTab] = useState<'all' | CustomizationKind>('all');
  const [message, setMessage] = useState('');
  const visible = useMemo(() => allCustomizations.filter((item) => tab === 'all' || item.kind === tab), [tab]);

  const equip = (id: string) => {
    const next = saveCustomizationInventory(equipCustomization(inventory, id));
    onInventoryChange(next);
    const item = allCustomizations.find((entry) => entry.id === id);
    if (item) setMessage(`${item.name} equipped.`);
  };

  const purchase = (id: string, price: number) => {
    const result = lokRuntime.spend(price);
    if (!result.success) {
      setMessage(`You need ◈ ${price.toLocaleString()} LOK for that.`);
      return;
    }
    const next = saveCustomizationInventory(grantCustomization(inventory, id, 'lok'));
    onInventoryChange(next);
    setState((current) => current ? { ...current, lokTokens: result.wallet.balance, lokProgressMs: result.wallet.progressMs, updatedAt: Date.now() } : current);
    const item = allCustomizations.find((entry) => entry.id === id);
    setMessage(`${item?.name ?? 'Customization'} added to your permanent local collection.`);
  };

  return <section className="customization-shell">
    <section className="panel customization-hero">
      <div><span className="eyebrow">LOK CUSTOMIZATION LAB</span><h2>Make the empire yours</h2><p>Themes, counters, companions and cosmetic rewards live outside individual runs. LOK purchases are cosmetic only and stay with this local profile.</p></div>
      <div className="lok-store-balance"><small>Persistent wallet</small><b>◈ {state.lokTokens.toLocaleString()}</b><span>+1 every 10 seconds active</span></div>
    </section>

    <nav className="customization-tabs">{tabs.map((entry) => <button key={entry.id} className={tab === entry.id ? 'active' : ''} onClick={() => setTab(entry.id)}>{entry.label}</button>)}</nav>
    {message ? <div className="customization-message" aria-live="polite">{message}</div> : null}

    <section className="customization-grid">{visible.map((item) => {
      const owned = inventory.ownedIds.includes(item.id);
      const equipped = isEquipped(inventory, item);
      const lokBuyable = item.acquisition.includes('lok') && typeof item.lokPrice === 'number';
      const requirement = item.requirementId ? requirementNames[item.requirementId] ?? item.requirementId : null;
      return <article className={`customization-card rarity-${item.rarity} ${equipped ? 'equipped' : ''}`} key={item.id}>
        <div className="customization-icon">{item.emoji ?? '✨'}</div>
        <div className="customization-copy"><div className="customization-title"><h3>{item.name}</h3><span>{item.rarity}</span></div><p>{item.description}</p>
          <div className="customization-tags"><span>{item.kind.replace('-', ' ')}</span>{item.acquisition.map((method) => <span key={method}>{method.replace('-', ' ')}</span>)}</div>
          {item.kind === 'pet' && 'personality' in item ? <small className="pet-personality">{String(item.personality)}</small> : null}
        </div>
        <div className="customization-action">
          {equipped ? <button disabled>Equipped ✓</button> : owned ? <button onClick={() => equip(item.id)}>{item.kind === 'pet-accessory' ? 'Toggle Gear' : 'Equip'}</button> : lokBuyable ? <button disabled={state.lokTokens < (item.lokPrice ?? 0)} onClick={() => purchase(item.id, item.lokPrice ?? 0)}>Buy · ◈ {(item.lokPrice ?? 0).toLocaleString()}</button> : <button disabled>Locked</button>}
          {!owned && requirement ? <small>Unlock: {requirement}</small> : null}
          {!owned && item.acquisition.includes('lok-pass') ? <small>Future LOK Pass item</small> : null}
        </div>
      </article>;
    })}</section>
  </section>;
}
