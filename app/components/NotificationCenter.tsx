'use client';

import { useState, useEffect, useRef } from 'react';
import type { GameState } from '@/game/types';
import {
  detectActiveReminders,
  loadNotificationPreferences,
  saveNotificationPreferences,
  subscribeNotificationPreferences,
  type NotificationReminderItem,
  type NotificationPreferences,
} from '@/game/systems/notifications';
import { playNotificationSound, playClickSound } from '@/game/systems/audio-sfx';

interface NotificationCenterProps {
  state: GameState;
  offlineAward: number;
  companionQuestReady: boolean;
  sponsorBoostReady: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenDaily: () => void;
  onSwitchView: (view: string) => void;
  onOpenCards: () => void;
  onClaimOffline: () => void;
  onActivateSponsorBoost?: () => void;
}

export function NotificationCenter({
  state,
  offlineAward,
  companionQuestReady,
  sponsorBoostReady,
  isOpen,
  onClose,
  onOpenDaily,
  onSwitchView,
  onOpenCards,
  onClaimOffline,
  onActivateSponsorBoost,
}: NotificationCenterProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => loadNotificationPreferences());
  const [activeTab, setActiveTab] = useState<'reminders' | 'settings'>('reminders');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [activeToast, setActiveToast] = useState<NotificationReminderItem | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return subscribeNotificationPreferences(setPrefs);
  }, []);

  // Detect active reminders
  const allReminders = detectActiveReminders({
    gameState: state,
    offlineAward,
    companionQuestReady,
    sponsorBoostReady,
    prefs,
  });

  const visibleReminders = allReminders.filter((r) => !dismissedIds.has(r.id));
  const visibleReminderIdsKey = visibleReminders.map((r) => r.id).join(',');

  // Check for newly arriving reminders to display toast and play chime
  useEffect(() => {
    if (!prefs.toastsEnabled) return;

    for (const reminder of visibleReminders) {
      if (!prevIdsRef.current.has(reminder.id)) {
        prevIdsRef.current.add(reminder.id);
        setActiveToast(reminder);
        if (prefs.soundEnabled) {
          playNotificationSound();
        }
        const timer = window.setTimeout(() => {
          setActiveToast((curr) => (curr?.id === reminder.id ? null : curr));
        }, 5500);
        return () => window.clearTimeout(timer);
      }
    }

    // Clean up IDs no longer present
    const currentIds = new Set(visibleReminders.map((r) => r.id));
    prevIdsRef.current = currentIds;
  }, [visibleReminderIdsKey, prefs.toastsEnabled, prefs.soundEnabled]);

  const handleAction = (reminder: NotificationReminderItem) => {
    playClickSound();
    switch (reminder.actionType) {
      case 'open-daily':
        onOpenDaily();
        onClose();
        break;
      case 'switch-view':
        if (reminder.targetView) {
          onSwitchView(reminder.targetView);
        }
        onClose();
        break;
      case 'open-cards':
        onOpenCards();
        onClose();
        break;
      case 'claim-offline':
        onClaimOffline();
        break;
      case 'dismiss':
        if (reminder.category === 'sponsor-boost' && onActivateSponsorBoost) {
          onActivateSponsorBoost();
        }
        setDismissedIds((prev) => new Set([...prev, reminder.id]));
        break;
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    saveNotificationPreferences(next);
  };

  return (
    <>
      {/* Floating Non-Intrusive Toast */}
      {activeToast && !isOpen ? (
        <div
          className="notification-toast"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.18)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '380px',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          <span style={{ fontSize: '24px' }}>{activeToast.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ display: 'block', fontSize: '13px', color: '#0f172a' }}>{activeToast.title}</b>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.3 }}>
              {activeToast.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {activeToast.actionLabel ? (
              <button
                type="button"
                onClick={() => {
                  handleAction(activeToast);
                  setActiveToast(null);
                }}
                style={{
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeToast.actionLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {/* Slide-over / Modal Notification Drawer */}
      {isOpen ? (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className="panel"
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              borderLeft: '1px solid #e2e8f0',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔔</span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Notification Reminders</h3>
                {visibleReminders.length > 0 ? (
                  <span
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '2px 7px',
                      borderRadius: '999px',
                    }}
                  >
                    {visibleReminders.length}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '999px',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            {/* Nav Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('reminders')}
                style={{
                  background: activeTab === 'reminders' ? '#f1f5f9' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activeTab === 'reminders' ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                Active Reminders ({visibleReminders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                style={{
                  background: activeTab === 'settings' ? '#f1f5f9' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activeTab === 'settings' ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                Settings & Alert Filters
              </button>
            </div>

            {/* Content Area */}
            {activeTab === 'reminders' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {visibleReminders.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 16px',
                      color: '#94a3b8',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '36px' }}>✨</span>
                    <b style={{ color: '#475569', fontSize: '15px' }}>All caught up!</b>
                    <p style={{ margin: 0, fontSize: '13px' }}>
                      No pending daily rewards, stunts, or critical alerts right now.
                    </p>
                  </div>
                ) : (
                  visibleReminders.map((reminder) => {
                    const isUrgent = reminder.priority === 'urgent';
                    const isImportant = reminder.priority === 'important';

                    return (
                      <div
                        key={reminder.id}
                        style={{
                          background: isUrgent ? '#fef2f2' : isImportant ? '#f0fdf4' : '#f8fafc',
                          border: `1px solid ${isUrgent ? '#fca5a5' : isImportant ? '#86efac' : '#e2e8f0'}`,
                          borderRadius: '14px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{reminder.emoji}</span>
                            <b style={{ fontSize: '13.5px', color: '#1e293b' }}>{reminder.title}</b>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDismiss(reminder.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            title="Dismiss reminder"
                          >
                            ✕
                          </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.4 }}>
                          {reminder.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                          {reminder.actionLabel ? (
                            <button
                              type="button"
                              onClick={() => handleAction(reminder)}
                              style={{
                                background: isUrgent ? '#dc2626' : isImportant ? '#16a34a' : '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {reminder.actionLabel} →
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Settings & Alert Preferences Tab */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', textTransform: 'uppercase' }}>
                    General Preferences
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.soundEnabled}
                        onChange={() => handleTogglePref('soundEnabled')}
                      />
                      <span>🔊 Play audio chime on notification arrival</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.toastsEnabled}
                        onChange={() => handleTogglePref('toastsEnabled')}
                      />
                      <span>💬 Show floating popup toasts on trigger</span>
                    </label>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', textTransform: 'uppercase' }}>
                    Reminder Categories
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyDailyReward}
                        onChange={() => handleTogglePref('notifyDailyReward')}
                      />
                      <span>🎁 Daily Check-In & Morning Dividends</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyPrStunt}
                        onChange={() => handleTogglePref('notifyPrStunt')}
                      />
                      <span>📢 PR Media Stunt Refresh Cooldowns</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyTownEvents}
                        onChange={() => handleTogglePref('notifyTownEvents')}
                      />
                      <span>🏛️ Town Housing & Citizen Petitions</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyCompanionQuest}
                        onChange={() => handleTogglePref('notifyCompanionQuest')}
                      />
                      <span>🐾 Pet Companion Quests</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyDebtAlerts}
                        onChange={() => handleTogglePref('notifyDebtAlerts')}
                      />
                      <span>⚠️ High Debt & Insolvency Warnings</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifySponsorBoost}
                        onChange={() => handleTogglePref('notifySponsorBoost')}
                      />
                      <span>⚡ Sponsor Multiplier Boosters</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={prefs.notifyPrayers}
                        onChange={() => handleTogglePref('notifyPrayers')}
                      />
                      <span>🕊️ Scheduled Faith & Daily Prayer Alarms</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
