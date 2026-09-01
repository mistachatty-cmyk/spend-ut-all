'use client';

import { useEffect, useMemo, useState } from 'react';
import { cardDeckBlueprints, cardShopProducts } from '@/data/card-shop';
import { lokDexEditionById, lokDexReleaseById } from '@/data/lokdex-editions';
import { lokDexEntries } from '@/data/lokdex';
import type { CustomizationInventory } from '@/game/customization-types';
import type { LokDexCollection } from '@/game/lokdex-types';
import {
  applyCardCollectionMilestones,
  claimFreeCardPack,
  createCardShopState,
  ensureCardShopStarterGrant,
  freePackReady,
  freePackRemainingMs,
  loadCardShopState,
  purchaseCardProduct,
  recycleDuplicateCard,
  saveCardShopState,
} from '@/game/systems/card-shop';
import {
  createLokDexCollection,
  loadLokDexCollection,
  saveLokDexCollection,
  syncCompanionsToLokDex,
} from '@/game/systems/lokdex';
import { emitMicroMotion } from '@/game/systems/micro-animations';
import type { CardShopPull, CardShopState } from '@/game/card-shop-types';
import { useCountedNumber } from '@/app/hooks/useMicroMotion';
import { PixelPetSprite } from './PixelPetSprite';

const affinityEmoji: Record<string,string> = { coin:'🪙', work:'🧰', tech:'💾', nature:'🌿', market:'📈', risk:'⚠️', travel:'✈️', cosmic:'🪐', mystery:'❓' };

function timeLabel(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  return minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

export function CardShopView({ inventory }: { inventory: CustomizationInventory }) {
  const [shop, setShop] = useState<CardShopState>(() => ensureCardShopStarterGrant(createCardShopState()));
  const [collection, setCollection] = useState<LokDexCollection>(() => createLokDexCollection());
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<'packs'|'decks'|'binder'|'recycle'>('packs');
  const [message, setMessage] = useState('Welcome to the Card Shop. Your first 350 Card Credits are on the house.');
  const [lastPulls, setLastPulls] = useState<CardShopPull[]>([]);
  const [now, setNow] = useState(0);
  const displayedCredits = useCountedNumber(shop.credits, 620);

  useEffect(() => {
    const synced = syncCompanionsToLokDex(loadLokDexCollection(), inventory);
    const starter = ensureCardShopStarterGrant(loadCardShopState());
    const milestone = applyCardCollectionMilestones(starter, synced);
    setCollection(saveLokDexCollection(synced));
    setShop(saveCardShopState(milestone.shop));
    if (milestone.creditsAwarded) setMessage(`Collection milestone reached · +${milestone.creditsAwarded} Card Credits.`);
    setNow(Date.now());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveCardShopState(shop);
    saveLokDexCollection(collection);
  }, [shop, collection, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const synced = syncCompanionsToLokDex(collection, inventory);
    if (synced.cards.length !== collection.cards.length || synced.discoveredIds.length !== collection.discoveredIds.length) {
      const milestone = applyCardCollectionMilestones(shop, synced);
      setCollection(synced);
      setShop(milestone.shop);
      if (milestone.creditsAwarded) {
        emitMicroMotion({ target:'card-credits', amount:milestone.creditsAwarded, displayText:`+◫ ${milestone.creditsAwarded}`, symbol:'◫', tone:'reward', kind:'reward' });
        setMessage(`Collection milestone reached · +${milestone.creditsAwarded} Card Credits.`);
      }
    }
  }, [inventory.ownedIds, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [loaded]);

  const discovered = collection.discoveredIds.length;
  const uniqueCharacters = new Set(collection.cards.map((card) => card.characterId)).size;
  const duplicateGroups = useMemo(() => lokDexEntries.map((character) => ({ character, cards:collection.cards.filter((card) => card.characterId === character.id) })).filter((entry) => entry.cards.length > 1), [collection.cards]);
  const ready = loaded && freePackReady(shop, now);
  const remaining = loaded ? freePackRemainingMs(shop, now) : 0;

  const openProduct = (id: string, sourceElement?: HTMLElement | null) => {
    const product = cardShopProducts.find((entry) => entry.id === id);
    const result = purchaseCardProduct(shop, collection, id);
    if (!result.success || !product) { setMessage('Not enough Card Credits yet. Open the free pack or recycle duplicates.'); return; }
    emitMicroMotion({ target:'card-credits', amount:-product.priceCredits, displayText:`-◫ ${product.priceCredits}`, symbol:'◫', tone:'negative', kind:'purchase', sourceElement });
    const bonus = (result.discoveryBonus ?? 0) + (result.milestoneBonus ?? 0);
    if (bonus) emitMicroMotion({ target:'card-credits', amount:bonus, displayText:`+◫ ${bonus}`, symbol:'◫', tone:'reward', kind:'reward', sourceElement, delayMs:260 });
    setShop(result.shop);
    setCollection(result.collection);
    setLastPulls(result.pulls);
    const newCount = result.pulls.filter((pull) => pull.isNewCharacter).length;
    setMessage(`${result.pulls.length} cards opened${newCount ? ` · ${newCount} new LOKdex discover${newCount === 1 ? 'y' : 'ies'}` : ''}${bonus ? ` · +${bonus} bonus credits` : ''}.`);
  };

  const claimFree = (sourceElement?: HTMLElement | null) => {
    const result = claimFreeCardPack(shop, collection, now || Date.now());
    if (!result.success) return;
    if (result.milestoneBonus) emitMicroMotion({ target:'card-credits', amount:result.milestoneBonus, displayText:`+◫ ${result.milestoneBonus}`, symbol:'◫', tone:'reward', kind:'reward', sourceElement });
    setShop(result.shop);
    setCollection(result.collection);
    setLastPulls(result.pulls);
    setMessage(`Free Firstlight sample opened${result.milestoneBonus ? ` · collection milestone +${result.milestoneBonus} credits` : ''}.`);
  };

  const recycle = (characterId: string, sourceElement?: HTMLElement | null) => {
    const result = recycleDuplicateCard(shop, collection, characterId);
    if (!result.success) return;
    emitMicroMotion({ target:'card-credits', amount:result.creditsGained, displayText:`+◫ ${result.creditsGained}`, symbol:'♻', tone:'positive', kind:'card', sourceElement });
    setShop(result.shop);
    setCollection(result.collection);
    setMessage(`Duplicate recycled for +${result.creditsGained} Card Credits.`);
  };

  const deckProgress = (blueprintId: string) => {
    const blueprint = cardDeckBlueprints.find((entry) => entry.id === blueprintId)!;
    const matching = collection.cards.filter((card) => {
      const character = lokDexEntries.find((entry) => entry.id === card.characterId);
      return !!character && (blueprint.recommendedAffinities.includes(character.affinity) || blueprint.recommendedArchetypes.includes(character.archetype));
    }).length;
    return Math.min(blueprint.targetSize, matching);
  };

  return <section className="card-shop-shell">
    <section className="panel card-shop-hero">
      <div><span className="eyebrow">LOKDEX CARD DISTRICT</span><h2>Card Shop</h2><p>The base collection belongs to the LOKverse first. Firstlight introduces the broad world; themed capsules such as Spinbot’s Boardroom Breakout are special releases that remix familiar characters instead of defining every LOK character around the economy game.</p></div>
      <div className="card-wallet"><small>CARD CREDITS</small><b data-motion-target="card-credits">◫ {Math.floor(displayedCredits).toLocaleString()}</b><span>{discovered}/{lokDexEntries.length} discovered · {collection.cards.length} cards</span></div>
    </section>

    <section className="panel free-pack-strip">
      <div><span className="free-pack-icon">🎁</span><div><b>Free Firstlight Sample</b><small>3 cards · Uncommon+ final slot · refreshes every 20 minutes</small></div></div>
      <button disabled={!ready} onClick={(event) => claimFree(event.currentTarget)}>{!loaded ? 'Loading…' : ready ? 'Open Free Pack' : `Ready in ${timeLabel(remaining)}`}</button>
    </section>

    <nav className="card-shop-tabs">
      <button className={tab === 'packs' ? 'active' : ''} onClick={() => setTab('packs')}>Packs & Capsules</button>
      <button className={tab === 'decks' ? 'active' : ''} onClick={() => setTab('decks')}>Deck Builds</button>
      <button className={tab === 'binder' ? 'active' : ''} onClick={() => setTab('binder')}>Binder · {uniqueCharacters}</button>
      <button className={tab === 'recycle' ? 'active' : ''} onClick={() => setTab('recycle')}>Duplicates · {duplicateGroups.length}</button>
    </nav>

    {message ? <div className="card-shop-message" aria-live="polite">{message}</div> : null}

    {lastPulls.length ? <section className="panel pull-reveal"><div className="section-heading"><div><span className="eyebrow">LATEST OPENING</span><h3>Your pulls</h3></div><button onClick={() => setLastPulls([])}>Clear</button></div><div className="pull-grid">{lastPulls.map((pull) => {
      const character = lokDexEntries.find((entry) => entry.id === pull.characterId);
      if (!character) return null;
      const edition = lokDexEditionById(pull.editionId);
      return <article className={`pulled-card rarity-${pull.rarity} variant-${pull.variant} ${edition ? 'edition-card' : ''}`} key={pull.instanceId}><small>#{String(character.number).padStart(3,'0')} · {pull.variant}{edition ? ' · EDITION' : ''}</small><div className="card-looper-art"><PixelPetSprite petId={character.id} mood={pull.isNewCharacter ? 'celebrating' : 'happy'} size={76}/></div><b>{edition?.name ?? character.name}</b><em>{pull.rarity}{pull.isNewCharacter ? ' · NEW' : ''}</em>{edition ? <strong>{character.name} edition</strong> : null}</article>;
    })}</div></section> : null}

    {tab === 'packs' ? <><section className="card-product-grid">{cardShopProducts.filter((product) => product.kind === 'pack').map((product) => {
      const release = lokDexReleaseById(product.releaseId);
      return <article className={`panel card-product accent-${product.accent} release-${product.releaseType}`} key={product.id}><div className="pack-art">{product.emoji}</div><div><div className="product-title"><h3>{product.name}</h3>{product.featured ? <span>FEATURED</span> : null}</div><small className="release-label">{release?.subtitle ?? product.releaseType}</small><p>{product.description}</p><div className="product-tags"><span>{product.cardCount} cards</span><span>{product.releaseType}</span>{product.guarantee?.minRarity ? <span>{product.guarantee.minRarity}+ guarantee</span> : null}{product.guarantee?.variantBoost ? <span>{product.guarantee.variantBoost}× finish odds</span> : null}{product.guarantee?.editionChance ? <span>{Math.round(product.guarantee.editionChance * 100)}% edition chance</span> : null}</div></div><button disabled={!loaded || shop.credits < product.priceCredits} onClick={(event) => openProduct(product.id, event.currentTarget)}>◫ {product.priceCredits}</button></article>;
    })}</section>
      <section className="panel pack-rules"><span className="eyebrow">PACK RULES</span><h3>Core characters, editions, and finishes are different things</h3><p>Firstlight is the broad Gen 1 world. Special capsules can introduce named editions—alternate creative versions of an existing character—while foil, holo, negative, glitch, gold, and event are card finishes that can appear on either base art or an edition. Earn-only and secret characters remain excluded from normal random packs.</p><small>Randomized packs currently use local Card Credits only. They are not sold for real money or purchased LOK.</small></section></> : null}

    {tab === 'decks' ? <section className="deck-build-grid">{cardDeckBlueprints.map((deck) => {
      const owned = shop.ownedDeckBlueprintIds.includes(deck.id);
      const progress = deckProgress(deck.id);
      const kit = cardShopProducts.find((product) => product.deckBlueprintId === deck.id);
      return <article className={`panel deck-build-card ${owned ? 'owned' : ''}`} key={deck.id}><div className="deck-build-head"><span>{deck.emoji}</span><div><small>{owned ? 'BLUEPRINT OWNED' : 'DECK KIT'}</small><h3>{deck.name}</h3></div></div><p>{deck.description}</p><div className="deck-style">{deck.style}</div><div className="deck-progress"><span><i style={{width:`${(progress/deck.targetSize)*100}%`}} /></span><b>{progress}/{deck.targetSize} matching cards</b></div><div className="product-tags">{deck.recommendedAffinities.map((affinity) => <span key={affinity}>{affinityEmoji[affinity]} {affinity}</span>)}</div>{!owned && kit ? <button disabled={!loaded || shop.credits < kit.priceCredits} onClick={(event) => openProduct(kit.id, event.currentTarget)}>Buy deck kit · ◫ {kit.priceCredits}</button> : <button disabled>{owned ? 'Build available for future card play' : 'Kit unavailable'}</button>}</article>;
    })}</section> : null}

    {tab === 'binder' ? <section className="binder-grid">{lokDexEntries.map((character) => {
      const cards = collection.cards.filter((card) => card.characterId === character.id);
      const owned = cards.length > 0;
      const editionCount = new Set(cards.map((card) => card.editionId).filter(Boolean)).size;
      const bestVariant = cards.map((card) => card.variant).sort((a,b) => ['standard','foil','holo','negative','glitch','gold','event'].indexOf(b) - ['standard','foil','holo','negative','glitch','gold','event'].indexOf(a))[0];
      return <article className={`binder-card rarity-${character.rarity} ${owned ? 'owned' : 'locked'}`} key={character.id}><div className="binder-number">#{String(character.number).padStart(3,'0')}</div><div className="binder-looper-art"><PixelPetSprite petId={character.id} mood="idle" silhouette={!owned} size={66}/></div><b>{owned ? character.name : '???'}</b><small>{owned ? `${character.rarity} · ${affinityEmoji[character.affinity]} ${character.affinity}` : character.discoveryHint}</small><em>{owned ? `${cards.length} cop${cards.length === 1 ? 'y' : 'ies'}${editionCount ? ` · ${editionCount} edition${editionCount === 1 ? '' : 's'}` : ''}${bestVariant && bestVariant !== 'standard' ? ` · best ${bestVariant}` : ''}` : 'undiscovered'}</em></article>;
    })}</section> : null}

    {tab === 'recycle' ? <section className="panel recycle-panel"><div className="section-heading"><div><span className="eyebrow">CARD RECYCLER</span><h3>Duplicates become Card Credits</h3></div><span>We protect your last copy automatically.</span></div>{duplicateGroups.length ? <div className="recycle-list">{duplicateGroups.map(({character,cards}) => <article key={character.id}><PixelPetSprite petId={character.id} mood="idle" size={38}/><div><b>{character.name}</b><small>{cards.length} copies · {character.rarity}</small></div><button onClick={(event) => recycle(character.id, event.currentTarget)}>Recycle one duplicate</button></article>)}</div> : <div className="empty-card-shop">No duplicate characters yet. Your last copy of every character is protected.</div>}</section> : null}

    <section className="panel card-economy-stats"><span><small>Packs opened</small><b>{shop.packsOpened}</b></span><span><small>Cards pulled</small><b>{shop.cardsPulled}</b></span><span><small>Free packs</small><b>{shop.freePacksClaimed}</b></span><span><small>Credits spent</small><b>◫ {Math.floor(shop.lifetimeCreditsSpent).toLocaleString()}</b></span><span><small>Duplicates recycled</small><b>{shop.cardsRecycled}</b></span><span><small>Binder rewards</small><b>◫ {Math.floor(shop.creditsFromCollectionRewards).toLocaleString()}</b></span></section>
  </section>;
}
