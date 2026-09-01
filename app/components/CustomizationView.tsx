'use client';

import { useMemo, useState } from 'react';
import { allCustomizations } from '@/data/customizations';
import type { CustomizationInventory, CustomizationKind } from '@/game/customization-types';
import { equipCustomization, grantCustomization, isEquipped, saveCustomizationInventory } from '@/game/systems/customizations';
import type { GameState } from '@/game/types';
import { lokRuntime } from '@/integrations/lok/runtime';
import { CardShopView } from './CardShopView';
import { LokDexPanel } from './LokDexPanel';
import { PixelPetSprite } from './PixelPetSprite';

type CustomizationTab = CustomizationKind | 'card-shop';

const tabs: Array<{ id: CustomizationTab; label: string }> = [
  { id: 'theme', label: 'Themes' },
  { id: 'money-counter', label: 'Counters' },
  { id: 'background', label: 'Backgrounds' },
  { id: 'hud', label: 'HUDs' },
  { id: 'effect', label: 'Effects' },
  { id: 'pet', label: 'Companions' },
  { id: 'pet-accessory', label: 'Gear' },
  { id: 'title-style', label: 'Titles' },
  { id: 'profile-frame', label: 'Frames' },
  { id: 'card-shop', label: 'Cards 🃏' },
];

const requirementNames: Record<string, string> = {
  'wolf-risk-billionaire': 'Wolf With No Net achievement',
  'spendutall-super': 'SPENDUTALL super achievement',
  'debt-billion-comeback': 'Resurrected Empire achievement',
  'nothing-millionaire': 'Self-Made Millionaire achievement',
  'region-planetary': 'Planetary Economy progression',
};

const tabHelp: Partial<Record<CustomizationTab, string>> = {
  theme: 'Themes change the full game atmosphere from quiet ledger styles to animated extreme environments. Higher tiers ask for lifetime LOK earned, but that requirement never consumes extra tokens.',
  'money-counter': 'Change how the primary balance is presented without changing its value.',
  background: 'Layer a lightweight environment treatment underneath your active theme.',
  hud: 'Choose how dense or stylized the heads-up display feels.',
  effect: 'Presentation-only feedback for purchases, milestones and reward moments.',
  pet: 'Curated LOK companions can sit in the game HUD and react to play.',
  'pet-accessory': 'Small cosmetic gear for the currently equipped companion.',
  'title-style': 'Style the title and identity treatment used around the game shell.',
  'profile-frame': 'Decorative identity frames for collection/profile presentation.',
  'card-shop': 'Collect LOKDEX cards and packs. This remains collection-focused; no battle system is required.',
};

export function CustomizationView({ state, setState, inventory, onInventoryChange }: {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
  inventory: CustomizationInventory;
  onInventoryChange: (inventory: CustomizationInventory) => void;
}) {
  const [tab, setTab] = useState<CustomizationTab>('theme');
  const [message, setMessage] = useState('');
  const wallet = lokRuntime.snapshot();
  const visible = useMemo(() => tab === 'card-shop' ? [] : allCustomizations.filter((item) => item.kind === tab).sort((a,b) => (a.lokPrice ?? 0) - (b.lokPrice ?? 0)), [tab]);

  const equip = (id: string) => {
    const next = saveCustomizationInventory(equipCustomization(inventory, id));
    onInventoryChange(next);
    const item = allCustomizations.find((entry) => entry.id === id);
    if (item) setMessage(`${item.name} equipped.`);
  };

  const purchase = (id: string, price: number) => {
    const item = allCustomizations.find((entry) => entry.id === id);
    const lifetimeRequired = item?.lokLifetimeRequired ?? 0;
    const currentWallet = lokRuntime.snapshot();
    if (currentWallet.lifetimeEarned < lifetimeRequired) {
      setMessage(`Earn ${lifetimeRequired.toLocaleString()} lifetime LOK to unlock this tier. You are at ${currentWallet.lifetimeEarned.toLocaleString()}.`);
      return;
    }
    const result = lokRuntime.spend(price);
    if (!result.success) {
      setMessage(`You need ◈ ${price.toLocaleString()} LOK for that.`);
      return;
    }
    const next = saveCustomizationInventory(grantCustomization(inventory, id, 'lok'));
    onInventoryChange(next);
    setState((current) => current ? { ...current, lokTokens: result.wallet.balance, lokProgressMs: result.wallet.progressMs, updatedAt: Date.now() } : current);
    setMessage(`${item?.name ?? 'Customization'} added to your permanent local collection.`);
  };

  return <section className="customization-shell">
    <section className="panel customization-hero">
      <div><span className="eyebrow">LOK CUSTOMIZATION DISTRICT</span><h2>Make the empire yours</h2><p>Cosmetics stay separate from economic power. Start with inexpensive visual changes, then unlock more expressive tiers by simply playing and earning LOK over time.</p></div>
      <div className="lok-store-balance"><small>Persistent LOK wallet</small><b>◈ {wallet.balance.toLocaleString()}</b><span>{wallet.lifetimeEarned.toLocaleString()} lifetime earned · +1 / 10s active</span></div>
    </section>

    <nav className="customization-tabs">{tabs.map((entry) => <button key={entry.id} className={tab === entry.id ? 'active' : ''} onClick={() => setTab(entry.id)}>{entry.label}</button>)}</nav>
    <div className="customization-context"><b>{tabs.find((entry) => entry.id === tab)?.label}</b><span>{tabHelp[tab]}</span></div>

    {tab === 'card-shop' ? <CardShopView inventory={inventory} /> : <>
      {message ? <div className="customization-message" aria-live="polite">{message}</div> : null}
      {tab === 'pet' ? <LokDexPanel inventory={inventory} /> : null}
      <section className={`customization-grid customization-grid-${tab}`}>{visible.map((item) => {
        const owned = inventory.ownedIds.includes(item.id);
        const equipped = isEquipped(inventory, item);
        const lokBuyable = item.acquisition.includes('lok') && typeof item.lokPrice === 'number';
        const requirement = item.requirementId ? requirementNames[item.requirementId] ?? item.requirementId : null;
        const lifetimeRequired = item.lokLifetimeRequired ?? 0;
        const lifetimeReady = wallet.lifetimeEarned >= lifetimeRequired;
        const canAfford = wallet.balance >= (item.lokPrice ?? 0);
        return <article className={`customization-card rarity-${item.rarity} ${equipped ? 'equipped' : ''} ${!lifetimeReady ? 'tier-locked' : ''}`} key={item.id}>
          <div className="customization-icon">{item.kind === 'pet' ? <PixelPetSprite petId={item.id} mood={owned ? 'happy' : 'idle'} silhouette={!owned} size={48} /> : item.emoji ?? '✨'}</div>
          <div className="customization-copy"><div className="customization-title"><h3>{item.name}</h3><span>{item.rarity}</span></div><p>{item.description}</p>
            <div className="customization-tags"><span>{item.kind === 'pet' ? 'companion' : item.kind === 'pet-accessory' ? 'companion gear' : item.kind.replace('-', ' ')}</span>{lifetimeRequired > 0 ? <span>{lifetimeRequired} lifetime LOK</span> : null}</div>
            {item.kind === 'pet' && 'personality' in item ? <small className="pet-personality">{String(item.personality)}</small> : null}
          </div>
          <div className="customization-action">
            {equipped ? <button disabled>Equipped ✓</button> : owned ? <button onClick={() => equip(item.id)}>{item.kind === 'pet-accessory' ? 'Toggle Gear' : 'Equip'}</button> : lokBuyable ? <button disabled={!canAfford || !lifetimeReady} onClick={() => purchase(item.id, item.lokPrice ?? 0)}>Buy · ◈ {(item.lokPrice ?? 0).toLocaleString()}</button> : <button disabled>Locked</button>}
            {!owned && !lifetimeReady ? <small>Tier unlock: earn {lifetimeRequired.toLocaleString()} lifetime LOK ({wallet.lifetimeEarned.toLocaleString()} earned)</small> : null}
            {!owned && lifetimeReady && lokBuyable && !canAfford ? <small>Need ◈ {(item.lokPrice ?? 0).toLocaleString()} current LOK</small> : null}
            {!owned && requirement ? <small>Unlock: {requirement}</small> : null}
          </div>
        </article>;
      })}</section>
    </>}
  </section>;
}
