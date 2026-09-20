'use client';

import { useEffect, useState } from 'react';
import { playCoinSound, playPurchaseSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';

interface SponsorBoostBarProps {
  boostRemainingSeconds: number;
  onActivateBoost: (addedMinutes: number) => void;
}

export function SponsorBoostBar({
  boostRemainingSeconds,
  onActivateBoost,
}: SponsorBoostBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [simulatingAd, setSimulatingAd] = useState(false);
  const [adSecondsRemaining, setAdSecondsRemaining] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simulatingAd && adSecondsRemaining > 0) {
      timer = setTimeout(() => {
        setAdSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (simulatingAd && adSecondsRemaining === 0) {
      setSimulatingAd(false);
      setModalOpen(false);
      playCoinSound();
      onActivateBoost(15);
      emitFloatingNumber({
        text: '⚡ 2× REWARDED SPONSOR BOOST ACTIVATED!',
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 200,
        y: 160,
        color: '#f59e0b',
      });
    }
    return () => clearTimeout(timer);
  }, [simulatingAd, adSecondsRemaining, onActivateBoost]);

  const handleStartReward = () => {
    setSimulatingAd(true);
    setAdSecondsRemaining(5);
  };

  const minutes = Math.floor(boostRemainingSeconds / 60);
  const seconds = boostRemainingSeconds % 60;

  return (
    <>
      <div
        className="sponsor-boost-pill"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: boostRemainingSeconds > 0
            ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
            : 'rgba(241, 245, 249, 0.8)',
          border: boostRemainingSeconds > 0 ? '1px solid #f59e0b' : '1px solid #cbd5e1',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: boostRemainingSeconds > 0 ? '0 0 10px rgba(245, 158, 11, 0.25)' : 'none',
        }}
        onClick={() => {
          playPurchaseSound();
          setModalOpen(true);
        }}
        title="Rewarded Ad: Double your business & passive cash income"
      >
        <span style={{ fontSize: '14px' }}>⚡</span>
        {boostRemainingSeconds > 0 ? (
          <span style={{ fontWeight: 700, color: '#92400e' }}>
            2× Boost Active · {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        ) : (
          <span style={{ fontWeight: 600, color: '#475569' }}>
            Get 2× Production Boost (Free)
          </span>
        )}
      </div>

      {modalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => {
            if (!simulatingAd) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
              color: '#0f172a',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚡</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>
              Rewarded Sponsor Power-Up
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 18px' }}>
              Support the game! View a brief sponsor presentation to immediately receive a <b>2× production multiplier</b> on all passive streams and business profits for 15 minutes.
            </p>

            {simulatingAd ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '2px dashed #3b82f6',
                  borderRadius: '12px',
                  padding: '28px 16px',
                  margin: '16px 0',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d4ed8' }}>
                  📺 Playing Sponsor Clip...
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#3b82f6', margin: '12px 0' }}>
                  {adSecondsRemaining}s
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Reward unlocks automatically when the timer reaches 0.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f1f5f9',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => setModalOpen(false)}
                >
                  Maybe Later
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1.4,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  }}
                  onClick={handleStartReward}
                >
                  Watch (5s) · Claim 2×
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
