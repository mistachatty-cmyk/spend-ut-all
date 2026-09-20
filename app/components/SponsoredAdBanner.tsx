'use client';

import { useEffect, useRef, useState } from 'react';

interface SponsoredAdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'sticky';
  className?: string;
}

export function SponsoredAdBanner({
  slotId = '1234567890',
  format = 'horizontal',
  className = '',
}: SponsoredAdBannerProps) {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const adRef = useRef<HTMLModElement | null>(null);
  const adsenseClient = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID : undefined;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('spend_it_all_hide_ads');
      if (saved === 'true') {
        setAdsEnabled(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!adsEnabled || !adsenseClient) return;
    try {
      // @ts-expect-error Google adsbygoogle global array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [adsEnabled, adsenseClient]);

  if (!adsEnabled) return null;

  return (
    <aside
      className={`sponsored-ad-wrapper format-${format} ${className}`}
      aria-label="Advertisement"
      style={{
        margin: format === 'sticky' ? '0' : '16px auto',
        maxWidth: format === 'rectangle' ? '336px' : '728px',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px dashed #cbd5e1',
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
        padding: '6px 8px 10px',
        position: format === 'sticky' ? 'sticky' : 'relative',
        bottom: format === 'sticky' ? '0' : undefined,
        zIndex: format === 'sticky' ? 40 : undefined,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        style={{
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          marginBottom: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        <span>ADVERTISEMENT · GOOGLE ADSENSE READY</span>
        <button
          onClick={() => {
            setAdsEnabled(false);
            try {
              localStorage.setItem('spend_it_all_hide_ads', 'true');
            } catch {}
          }}
          title="Dismiss ad for this session"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '9px',
            color: '#94a3b8',
            padding: '2px 4px',
          }}
        >
          ✕ Hide
        </button>
      </div>

      {adsenseClient ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: format === 'rectangle' ? '250px' : '90px',
            width: '100%',
          }}
          data-ad-client={adsenseClient}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: format === 'rectangle' ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            minHeight: format === 'rectangle' ? '220px' : '68px',
            background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.6) 100%)',
            borderRadius: '6px',
            gap: '12px',
          }}
        >
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              💼 Ready for AdSense Monetization
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              High-RPM slot for browser game players. Add your AdSense Publisher ID in Settings or <code style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>NEXT_PUBLIC_ADSENSE_CLIENT_ID</code>.
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              background: '#3b82f6',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            Google AdSlot #{slotId.slice(-4)}
          </div>
        </div>
      )}
    </aside>
  );
}
