'use client';

import { useState, useEffect } from 'react';
import type { GameState } from '@/game/types';
import {
  DAILY_REWARDS_TRACK,
  getDailyCheckInStatus,
  claimDailyReward,
  getInGameDayDividendStatus,
  claimInGameDayDividend,
  type ClaimResult,
} from '@/game/systems/daily-rewards';
import { money } from '@/game/format';
import { playDailyClaimSound, playCoinSound } from '@/game/systems/audio-sfx';
import { emitFloatingNumber } from '@/game/systems/floating-numbers';

interface DailyRewardsModalProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onClose: () => void;
  onOpenCards?: () => void;
}

export function DailyRewardsModal({
  state,
  onUpdateState,
  onClose,
  onOpenCards,
}: DailyRewardsModalProps) {
  const [now, setNow] = useState(() => Date.now());
  const [lastClaimResult, setLastClaimResult] = useState<ClaimResult | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const status = getDailyCheckInStatus(state.dailyRewards, now);
  const dividend = getInGameDayDividendStatus(state);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleClaim = (e: React.MouseEvent) => {
    const result = claimDailyReward(state, now);
    if (!result) return;

    playDailyClaimSound();
    setLastClaimResult(result);
    onUpdateState(result.nextState);

    // Floating number at click position
    emitFloatingNumber({
      text: `+${money(result.cashAwarded)}`,
      x: e.clientX || window.innerWidth / 2,
      y: e.clientY || window.innerHeight / 2,
      color: '#16a34a',
    });
  };

  const handleClaimDividend = (e: React.MouseEvent) => {
    const next = claimInGameDayDividend(state);
    if (next !== state) {
      playCoinSound();
      onUpdateState(next);
      emitFloatingNumber({
        text: `+${money(dividend.dividendAmount)}`,
        x: e.clientX || window.innerWidth / 2,
        y: e.clientY || window.innerHeight / 2,
        color: '#2563eb',
      });
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎁</span>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Daily In-Game Rewards</h2>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                🔥 {status.activeStreak} Day Streak
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Check in daily to claim escalating wealth caches, Fame, LOK tokens, and Titan boosts.
            </p>
          </div>
          <button
            type="button"
            className="panel-close-btn"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '999px',
              width: '32px',
              height: '32px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
            }}
          >
            ✕
          </button>
        </div>

        {/* Claim Banner / Celebration Alert */}
        {lastClaimResult ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              border: '1px solid #a7f3d0',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>✨</span>
              <div>
                <b style={{ color: '#065f46', fontSize: '1.05rem', display: 'block' }}>
                  Day {lastClaimResult.dayClaimed} Reward Claimed!
                </b>
                <span style={{ color: '#047857', fontSize: '0.9rem' }}>
                  +{money(lastClaimResult.cashAwarded)} · +{lastClaimResult.fameAwarded.toLocaleString()} Fame · +{lastClaimResult.lokAwarded} LOK · +{lastClaimResult.cardCreditsAwarded} Credits
                </span>
                {lastClaimResult.perkAwarded ? (
                  <small style={{ display: 'block', color: '#065f46', fontWeight: 700, marginTop: '2px' }}>
                    Special Perk: {lastClaimResult.perkAwarded}
                  </small>
                ) : null}
              </div>
            </div>
            <span style={{ background: '#059669', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>
              Streak: {lastClaimResult.newStreak} Days
            </span>
          </div>
        ) : null}

        {/* 7-Day Progressive Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '10px' }}>
          {DAILY_REWARDS_TRACK.map((reward) => {
            const isClaimed = status.claimedDays.includes(reward.day);
            const isReady = status.canClaim && status.currentDayInCycle === reward.day;
            const isUpcoming = reward.day > status.currentDayInCycle;

            let cardBg = '#f8fafc';
            let borderColor = '#e2e8f0';
            let titleColor = '#475569';

            if (isClaimed) {
              cardBg = '#f0fdf4';
              borderColor = '#bbf7d0';
              titleColor = '#166534';
            } else if (isReady) {
              cardBg = '#fffbeb';
              borderColor = '#f59e0b';
              titleColor = '#92400e';
            }

            return (
              <div
                key={reward.day}
                style={{
                  background: cardBg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '14px',
                  padding: '12px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: isReady ? '0 0 14px rgba(245, 158, 11, 0.3)' : 'none',
                  transform: isReady ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Day Tag */}
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: titleColor,
                    marginBottom: '4px',
                  }}
                >
                  Day {reward.day}
                </span>

                {/* Emoji Icon */}
                <div
                  style={{
                    fontSize: reward.isGrandPrize ? '28px' : '22px',
                    margin: '2px 0 6px',
                  }}
                >
                  {isClaimed ? '✅' : reward.emoji}
                </div>

                {/* Reward Preview */}
                <b style={{ fontSize: '11px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                  {money(reward.baseCash)}
                </b>
                <small style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                  +{reward.famePoints}⭐ · +{reward.lokTokens}◈
                </small>

                {/* Status Indicator */}
                <div style={{ marginTop: '8px' }}>
                  {isClaimed ? (
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#16a34a' }}>Claimed</span>
                  ) : isReady ? (
                    <span
                      style={{
                        background: '#f59e0b',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        animation: 'ready-badge-pulse 1.8s infinite',
                      }}
                    >
                      READY!
                    </span>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Claim CTA Section */}
        <div
          style={{
            background: status.canClaim ? '#ecfdf5' : '#f8fafc',
            border: `1px solid ${status.canClaim ? '#86efac' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <b style={{ fontSize: '1.1rem', color: status.canClaim ? '#15803d' : '#334155' }}>
                {status.canClaim
                  ? `Day ${status.currentDayInCycle}: ${status.currentReward.title}`
                  : `Already Claimed for Today!`}
              </b>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  background: status.canClaim ? '#bbf7d0' : '#e2e8f0',
                  color: status.canClaim ? '#166534' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {status.currentReward.badge}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              {status.canClaim
                ? status.currentReward.perkDescription || 'Includes scaled cash, Fame points, and LOK tokens.'
                : `Next daily reset in ${formatCountdown(status.secondsUntilNextReset)}. Come back tomorrow to advance your streak!`}
            </p>
          </div>

          <div>
            {status.canClaim ? (
              <button
                type="button"
                className="primary"
                onClick={handleClaim}
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                }}
              >
                <span>🎁</span> Claim Day {status.currentDayInCycle} Reward
              </button>
            ) : (
              <button
                type="button"
                disabled
                style={{
                  background: '#e2e8f0',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'not-allowed',
                }}
              >
                ✓ Claimed ({formatCountdown(status.secondsUntilNextReset)})
              </button>
            )}
          </div>
        </div>

        {/* Secondary: In-Game Day Dividend Check */}
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>☀️</span>
            <div>
              <b style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                In-Game Morning Dividend (World Day {dividend.currentInGameDay})
              </b>
              <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.84rem' }}>
                Simulated market day payouts generated from your municipal economy.
              </p>
            </div>
          </div>

          <div>
            {dividend.canClaim ? (
              <button
                type="button"
                onClick={handleClaimDividend}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>💰</span> Collect {money(dividend.dividendAmount)}
              </button>
            ) : (
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                ✓ Today's Dividend Collected
              </span>
            )}
          </div>
        </div>

        {/* Footnote stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8' }}>
          <span>Total Lifetime Check-Ins: {status.totalCheckIns}</span>
          <span>Rewards scale dynamically with your net worth</span>
        </div>
      </div>
    </div>
  );
}

export function DailyRewardsView({
  state,
  onUpdateState,
  onOpenCards,
}: {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onOpenCards?: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [lastClaimResult, setLastClaimResult] = useState<ClaimResult | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const status = getDailyCheckInStatus(state.dailyRewards, now);
  const dividend = getInGameDayDividendStatus(state);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleClaim = (e: React.MouseEvent) => {
    const result = claimDailyReward(state, now);
    if (!result) return;

    playDailyClaimSound();
    setLastClaimResult(result);
    onUpdateState(result.nextState);

    emitFloatingNumber({
      text: `+${money(result.cashAwarded)}`,
      x: e.clientX || window.innerWidth / 2,
      y: e.clientY || window.innerHeight / 2,
      color: '#16a34a',
    });
  };

  const handleClaimDividend = (e: React.MouseEvent) => {
    const next = claimInGameDayDividend(state);
    if (next !== state) {
      playCoinSound();
      onUpdateState(next);
      emitFloatingNumber({
        text: `+${money(dividend.dividendAmount)}`,
        x: e.clientX || window.innerWidth / 2,
        y: e.clientY || window.innerHeight / 2,
        color: '#2563eb',
      });
    }
  };

  return (
    <section
      className="panel daily-rewards-panel"
      style={{
        maxWidth: '1020px',
        margin: '0 auto',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRadius: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🎁</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>Daily In-Game Rewards & Streak</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.95rem' }}>
                Check in each real-world calendar day and collect in-game morning dividends to accelerate your empire.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '8px 16px',
              textAlign: 'center',
            }}
          >
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Active Streak</span>
            <b style={{ fontSize: '1.25rem', fontWeight: 900 }}>🔥 {status.activeStreak} Days</b>
          </div>
          <div
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '8px 16px',
              textAlign: 'center',
            }}
          >
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Total Checked</span>
            <b style={{ fontSize: '1.25rem', fontWeight: 900 }}>✓ {status.totalCheckIns}</b>
          </div>
        </div>
      </div>

      {/* Claim Banner / Celebration Alert */}
      {lastClaimResult ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '36px' }}>✨</span>
            <div>
              <b style={{ color: '#065f46', fontSize: '1.15rem', display: 'block' }}>
                Day {lastClaimResult.dayClaimed} Reward Claimed!
              </b>
              <span style={{ color: '#047857', fontSize: '0.95rem' }}>
                +{money(lastClaimResult.cashAwarded)} · +{lastClaimResult.fameAwarded.toLocaleString()} Fame · +{lastClaimResult.lokAwarded} LOK · +{lastClaimResult.cardCreditsAwarded} Credits
              </span>
              {lastClaimResult.perkAwarded ? (
                <small style={{ display: 'block', color: '#065f46', fontWeight: 700, marginTop: '4px' }}>
                  Perk Applied: {lastClaimResult.perkAwarded}
                </small>
              ) : null}
            </div>
          </div>
          <span style={{ background: '#059669', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '6px 14px', borderRadius: '999px' }}>
            Streak: {lastClaimResult.newStreak} Days
          </span>
        </div>
      ) : null}

      {/* 7-Day Calendar Strip */}
      <div>
        <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 800 }}>7-Day Progressive Rewards Track</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {DAILY_REWARDS_TRACK.map((reward) => {
            const isClaimed = status.claimedDays.includes(reward.day);
            const isReady = status.canClaim && status.currentDayInCycle === reward.day;

            let cardBg = '#f8fafc';
            let borderColor = '#e2e8f0';
            let titleColor = '#475569';

            if (isClaimed) {
              cardBg = '#f0fdf4';
              borderColor = '#86efac';
              titleColor = '#166534';
            } else if (isReady) {
              cardBg = '#fffbeb';
              borderColor = '#f59e0b';
              titleColor = '#92400e';
            }

            return (
              <div
                key={reward.day}
                style={{
                  background: cardBg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '16px',
                  padding: '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: isReady ? '0 0 16px rgba(245, 158, 11, 0.28)' : 'none',
                  transform: isReady ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: titleColor }}>
                  Day {reward.day}
                </span>
                <div style={{ fontSize: reward.isGrandPrize ? '32px' : '26px', margin: '4px 0 8px' }}>
                  {isClaimed ? '✅' : reward.emoji}
                </div>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>{money(reward.baseCash)}</b>
                <small style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                  +{reward.famePoints}⭐ · +{reward.lokTokens}◈
                </small>

                <div style={{ marginTop: '10px' }}>
                  {isClaimed ? (
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>Claimed</span>
                  ) : isReady ? (
                    <span
                      style={{
                        background: '#f59e0b',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        animation: 'ready-badge-pulse 1.8s infinite',
                      }}
                    >
                      READY!
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Claim Call to Action */}
      <div
        style={{
          background: status.canClaim ? '#ecfdf5' : '#f8fafc',
          border: `1px solid ${status.canClaim ? '#86efac' : '#e2e8f0'}`,
          borderRadius: '18px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ fontSize: '1.2rem', color: status.canClaim ? '#15803d' : '#334155' }}>
              {status.canClaim
                ? `Day ${status.currentDayInCycle}: ${status.currentReward.title}`
                : `Checked In for Today!`}
            </b>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                background: status.canClaim ? '#bbf7d0' : '#e2e8f0',
                color: status.canClaim ? '#166534' : '#64748b',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {status.currentReward.badge}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.92rem' }}>
            {status.canClaim
              ? status.currentReward.perkDescription || 'Includes scaled cash based on net worth, Fame points, and LOK tokens.'
              : `Next check-in resets in ${formatCountdown(status.secondsUntilNextReset)}. Check back tomorrow to keep your streak burning!`}
          </p>
        </div>

        <div>
          {status.canClaim ? (
            <button
              type="button"
              className="primary"
              onClick={handleClaim}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)',
              }}
            >
              <span>🎁</span> Claim Day {status.currentDayInCycle} Reward
            </button>
          ) : (
            <button
              type="button"
              disabled
              style={{
                background: '#e2e8f0',
                color: '#64748b',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'not-allowed',
              }}
            >
              ✓ Claimed ({formatCountdown(status.secondsUntilNextReset)})
            </button>
          )}
        </div>
      </div>

      {/* In-Game Morning Dividend */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '28px' }}>☀️</span>
          <div>
            <b style={{ fontSize: '1.05rem', color: '#1e293b' }}>
              In-Game Morning Dividend (World Day {dividend.currentInGameDay})
            </b>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              As time advances through in-game cycles, morning dividends unlock for every completed day.
            </p>
          </div>
        </div>

        <div>
          {dividend.canClaim ? (
            <button
              type="button"
              onClick={handleClaimDividend}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>💰</span> Collect {money(dividend.dividendAmount)}
            </button>
          ) : (
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
              ✓ Today's Dividend Collected
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
