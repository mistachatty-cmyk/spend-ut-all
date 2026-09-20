'use client';

import { useState, useEffect } from 'react';
import type { MetaState } from '@/game/meta-types';
import {
  loadExecutiveDeck,
  slotCardIntoDeck,
  removeCardFromDeck,
  calculateDeckSynergies,
  type DeckSynergies,
} from '@/game/systems/card-synergies';
import { playClickSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';

export function ExecutiveDeckView({
  meta,
}: {
  meta: MetaState;
}) {
  const [deck, setDeck] = useState<string[]>([]);
  const [synergies, setSynergies] = useState<DeckSynergies>({
    revenueMultiplier: 1,
    workMultiplier: 1,
    businessMultiplier: 1,
    holdingsDiscount: 1,
  });

  useEffect(() => {
    const loaded = loadExecutiveDeck();
    setDeck(loaded);
    setSynergies(calculateDeckSynergies(loaded));
  }, []);

  const handleSlot = (cardId: string, slotIndex: number) => {
    const next = slotCardIntoDeck(cardId, slotIndex);
    setDeck(next);
    setSynergies(calculateDeckSynergies(next));
    playClickSound();
    emitFloatingNumber('🎴 Deck Slotted', 'card');
  };

  const handleRemove = (slotIndex: number) => {
    const next = removeCardFromDeck(slotIndex);
    setDeck(next);
    setSynergies(calculateDeckSynergies(next));
    playClickSound();
  };

  const collectibles = meta.collectibles ?? [];

  return (
    <section className="executive-deck-panel panel" style={{ padding: '20px', borderRadius: '18px', marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="eyebrow" style={{ color: '#06b6d4', fontWeight: 900 }}>COLLECTION SYNERGY · EXECUTIVE DISPLAY DECK</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '20px' }}>Executive Showcase (3 Card Slots)</h3>
          <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: '13px' }}>
            Slot your prized collected cards into the executive showcase to activate permanent empire synergy passives.
          </p>
        </div>

        {/* Active Synergies Badge */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {synergies.revenueMultiplier > 1 && (
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(34,197,94,0.12)', color: '#16a34a', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(34,197,94,0.25)' }}>
              +{Math.round((synergies.revenueMultiplier - 1) * 100)}% Revenue
            </span>
          )}
          {synergies.workMultiplier > 1 && (
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(6,182,212,0.12)', color: '#0891b2', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(6,182,212,0.25)' }}>
              +{Math.round((synergies.workMultiplier - 1) * 100)}% Work Payouts
            </span>
          )}
          {synergies.businessMultiplier > 1 && (
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(168,85,247,0.12)', color: '#9333ea', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(168,85,247,0.25)' }}>
              +{Math.round((synergies.businessMultiplier - 1) * 100)}% Business Speed
            </span>
          )}
          {synergies.holdingsDiscount < 1 && (
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(245,158,11,0.12)', color: '#d97706', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.25)' }}>
              -{Math.round((1 - synergies.holdingsDiscount) * 100)}% Asset Prices
            </span>
          )}
        </div>
      </div>

      {/* 3 Showcase Slots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '16px 0' }}>
        {[0, 1, 2].map((slotIdx) => {
          const cardId = deck[slotIdx];
          return (
            <div
              key={slotIdx}
              style={{
                border: cardId ? '1px solid rgba(6, 182, 212, 0.4)' : '1px dashed rgba(127,127,127,0.3)',
                borderRadius: '14px',
                padding: '14px',
                background: cardId ? 'rgba(6, 182, 212, 0.04)' : 'rgba(127,127,127,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '110px',
                position: 'relative',
              }}
            >
              <small style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '4px' }}>
                Slot {slotIdx + 1}
              </small>
              {cardId ? (
                <>
                  <b style={{ fontSize: '14px', margin: '2px 0' }}>🎴 {cardId.replace('lokdex:', '').replace('g1:', '#')}</b>
                  <small style={{ color: '#0891b2', fontSize: '11px', fontWeight: 700 }}>Active Synergy</small>
                  <button
                    type="button"
                    onClick={() => handleRemove(slotIdx)}
                    style={{
                      marginTop: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(127,127,127,0.3)',
                      borderRadius: '8px',
                      fontSize: '10px',
                      padding: '3px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Empty Deck Slot</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Slottable Cards */}
      {collectibles.length > 0 ? (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#6b7280', marginBottom: '8px' }}>
            Click an owned card to slot into your showcase:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
            {collectibles.map((card: any) => {
              const isSlotted = deck.includes(card.id);
              const emptySlot = [0, 1, 2].find((i) => !deck[i]) ?? 0;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSlot(card.id, emptySlot)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: isSlotted ? '1px solid #06b6d4' : '1px solid rgba(127,127,127,0.2)',
                    background: isSlotted ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.04)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>🎴</span>
                  <span>{card.name}</span>
                  {isSlotted && <span style={{ color: '#06b6d4' }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#9ca3af' }}>
          Acquire cards from the Card District to unlock executive deck synergies!
        </p>
      )}
    </section>
  );
}
