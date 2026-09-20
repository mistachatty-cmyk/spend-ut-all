'use client';

import { useEffect, useState } from 'react';
import { subscribeFloatingNumbers, type FloatingNumberItem } from '@/game/systems/floating-numbers';

export function FloatingNumbersOverlay() {
  const [items, setItems] = useState<FloatingNumberItem[]>([]);

  useEffect(() => {
    return subscribeFloatingNumbers((newItem) => {
      setItems((current) => [...current.slice(-15), newItem]);
      setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== newItem.id));
      }, 1200);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {items.map((item) => {
        const isPositive = item.type === 'income' || item.type === 'lok' || item.type === 'card' || item.type === 'relic';
        const color =
          item.type === 'lok'
            ? '#a855f7'
            : item.type === 'card'
            ? '#06b6d4'
            : item.type === 'relic'
            ? '#f59e0b'
            : isPositive
            ? '#22c55e'
            : '#ef4444';

        return (
          <div
            key={item.id}
            className="floater-item"
            style={{
              position: 'absolute',
              left: item.x ?? '50%',
              top: item.y ?? '140px',
              transform: 'translate(-50%, -50%)',
              color,
              fontWeight: 800,
              fontSize: '15px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
              whiteSpace: 'nowrap',
              animation: 'floaterAscend 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
}
