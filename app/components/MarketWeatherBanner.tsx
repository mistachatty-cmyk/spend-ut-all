'use client';

import { useState } from 'react';
import { getMarketWeatherForDay } from '@/game/systems/market-weather';
import { playWeatherSound } from '@/game/systems/audio-sfx';

export function MarketWeatherBanner({
  gameDay,
}: {
  gameDay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const weather = getMarketWeatherForDay(gameDay);

  const handleClick = () => {
    setExpanded(!expanded);
    playWeatherSound();
  };

  return (
    <aside
      className="market-weather-strip"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      style={{
        margin: '8px var(--shell-gutter, clamp(16px, 3.2vw, 42px)) 0',
        padding: '8px 14px',
        borderRadius: '13px',
        background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.08), rgba(59, 130, 246, 0.04))',
        border: '1px solid rgba(14, 165, 233, 0.22)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title="Click to view full economic forecast"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '18px' }}>{weather.emoji}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0284c7', fontWeight: 900 }}>
              MARKET WEATHER · DAY {Math.max(1, Math.floor(gameDay))}
            </span>
            <b style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>{weather.name}</b>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', background: 'rgba(14, 165, 233, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
            {weather.summary}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid rgba(14, 165, 233, 0.15)', fontSize: '12px', color: '#64748b' }}>
          <p style={{ margin: 0, lineHeight: 1.4 }}>
            <b>Economic Brief:</b> {weather.headline}
          </p>
        </div>
      )}
    </aside>
  );
}
