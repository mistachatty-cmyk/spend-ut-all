'use client';

import React, { useState } from 'react';
import type { GameState } from '@/game/types';
import {
  ReligionState,
  getReligionDefinition,
  performPrayer,
  fulfillCharityDesire,
  updateScheduledPrayerTime,
  togglePrayerEnabled,
  saveUserStudyNote,
  deleteUserStudyNote,
  ScheduledPrayer,
} from '@/game/systems/religion';
import { playPrayerBellSound, playClickSound, playCoinSound } from '@/game/systems/audio-sfx';
import { money } from '@/game/format';

interface ReligionViewProps {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
}

type SubTab = 'sanctuary' | 'prayers' | 'scriptures' | 'study';

export function ReligionView({ state, setState }: ReligionViewProps) {
  const religion = state.religion;
  const [activeTab, setActiveTab] = useState<SubTab>('sanctuary');
  const [activePrayerModal, setActivePrayerModal] = useState<ScheduledPrayer | null>(null);
  const [scriptureTopicFilter, setScriptureTopicFilter] = useState<string>('all');
  const [scriptureSearchQuery, setScriptureSearchQuery] = useState<string>('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteRef, setNewNoteRef] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [journalMessage, setJournalMessage] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission;
      }
    } catch {
      return 'denied';
    }
    return 'default';
  });

  if (!religion) {
    return (
      <section className="religion-view-container">
        <div className="religion-empty-card">
          <span style={{ fontSize: '40px' }}>🕊️</span>
          <h3>Faith & Religion Pathway</h3>
          <p>
            You did not select a religious pathway when starting this match. You can adopt a tradition now
            to unlock sacred scriptures, daily prayer alarms, moral desires, and reputable study archives.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="primary"
              onClick={() => {
                playClickSound();
                setState((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    religion: {
                      religionId: 'christianity',
                      serenity: 50,
                      totalPrayersCompleted: 0,
                      totalCharityGiven: 0,
                      scheduledPrayers: getReligionDefinition('christianity').defaultPrayers.map((p) => ({
                        ...p,
                        scheduledTime: p.standardTime,
                        completedToday: false,
                      })),
                      desires: getReligionDefinition('christianity').initialDesires,
                      studyNotes: getReligionDefinition('christianity').scholarlyStudyNotes,
                      notificationsEnabled: true,
                      chimeSoundEnabled: true,
                    },
                  };
                });
              }}
            >
              ✝️ Christianity
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                playClickSound();
                setState((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    religion: {
                      religionId: 'islam',
                      serenity: 50,
                      totalPrayersCompleted: 0,
                      totalCharityGiven: 0,
                      scheduledPrayers: getReligionDefinition('islam').defaultPrayers.map((p) => ({
                        ...p,
                        scheduledTime: p.standardTime,
                        completedToday: false,
                      })),
                      desires: getReligionDefinition('islam').initialDesires,
                      studyNotes: getReligionDefinition('islam').scholarlyStudyNotes,
                      notificationsEnabled: true,
                      chimeSoundEnabled: true,
                    },
                  };
                });
              }}
            >
              ☪️ Islam
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                playClickSound();
                setState((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    religion: {
                      religionId: 'judaism',
                      serenity: 50,
                      totalPrayersCompleted: 0,
                      totalCharityGiven: 0,
                      scheduledPrayers: getReligionDefinition('judaism').defaultPrayers.map((p) => ({
                        ...p,
                        scheduledTime: p.standardTime,
                        completedToday: false,
                      })),
                      desires: getReligionDefinition('judaism').initialDesires,
                      studyNotes: getReligionDefinition('judaism').scholarlyStudyNotes,
                      notificationsEnabled: true,
                      chimeSoundEnabled: true,
                    },
                  };
                });
              }}
            >
              ✡️ Judaism
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                playClickSound();
                setState((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    religion: {
                      religionId: 'interfaith',
                      serenity: 50,
                      totalPrayersCompleted: 0,
                      totalCharityGiven: 0,
                      scheduledPrayers: getReligionDefinition('interfaith').defaultPrayers.map((p) => ({
                        ...p,
                        scheduledTime: p.standardTime,
                        completedToday: false,
                      })),
                      desires: getReligionDefinition('interfaith').initialDesires,
                      studyNotes: getReligionDefinition('interfaith').scholarlyStudyNotes,
                      notificationsEnabled: true,
                      chimeSoundEnabled: true,
                    },
                  };
                });
              }}
            >
              🕊️ Interfaith / Universal
            </button>
          </div>
        </div>
      </section>
    );
  }

  const def = getReligionDefinition(religion.religionId);

  const requestBrowserNotificationPermission = async () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        if (perm === 'granted') {
          new Notification(`🕊️ ${def.name} Reminders Active`, {
            body: 'Scheduled prayer and contemplation reminders will notify you at your decided times.',
            icon: '/favicon.ico',
          });
        }
      }
    } catch {
      setPermissionStatus('denied');
    }
  };

  const handlePerformPrayer = (prayer: ScheduledPrayer) => {
    playPrayerBellSound();
    const result = performPrayer(religion, prayer.id);
    setState((prev) => {
      if (!prev || !prev.religion) return prev;
      return {
        ...prev,
        religion: result.nextState,
      };
    });
    setActivePrayerModal(null);
  };

  const handleCharityAction = (desireId: string, cost: number) => {
    if (state.cash < cost) {
      setJournalMessage(`Offering requires ${money(cost)} in cash. Acquire funds through business or earnings.`);
      return;
    }
    playCoinSound();
    playPrayerBellSound();
    const result = fulfillCharityDesire(religion, desireId, cost);
    setJournalMessage(result.message);
    setState((prev) => {
      if (!prev || !prev.religion) return prev;
      return {
        ...prev,
        cash: prev.cash - cost,
        religion: result.nextState,
      };
    });
  };

  const handleTimeChange = (prayerId: string, newTime: string) => {
    const nextRel = updateScheduledPrayerTime(religion, prayerId, newTime);
    setState((prev) => (prev ? { ...prev, religion: nextRel } : prev));
  };

  const handleTogglePrayer = (prayerId: string) => {
    playClickSound();
    const nextRel = togglePrayerEnabled(religion, prayerId);
    setState((prev) => (prev ? { ...prev, religion: nextRel } : prev));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    playClickSound();
    const nextRel = saveUserStudyNote(religion, {
      title: newNoteTitle,
      passageRef: newNoteRef,
      content: newNoteContent,
    });
    setState((prev) => (prev ? { ...prev, religion: nextRel } : prev));
    setNewNoteTitle('');
    setNewNoteRef('');
    setNewNoteContent('');
    setJournalMessage('Note saved to your reflection journal! (+5% Serenity)');
    setTimeout(() => setJournalMessage(null), 4000);
  };

  const handleDeleteNote = (noteId: string) => {
    playClickSound();
    const nextRel = deleteUserStudyNote(religion, noteId);
    setState((prev) => (prev ? { ...prev, religion: nextRel } : prev));
  };

  const filteredScriptures = def.inGameScriptures.filter((s) => {
    const matchesTopic = scriptureTopicFilter === 'all' || s.topic === scriptureTopicFilter;
    const matchesQuery =
      !scriptureSearchQuery.trim() ||
      s.title.toLowerCase().includes(scriptureSearchQuery.toLowerCase()) ||
      s.reference.toLowerCase().includes(scriptureSearchQuery.toLowerCase()) ||
      s.text.toLowerCase().includes(scriptureSearchQuery.toLowerCase());
    return matchesTopic && matchesQuery;
  });

  return (
    <div className="religion-panel-root">
      {/* Header Banner */}
      <section className="religion-header-banner">
        <div className="banner-left">
          <span className="religion-emblem-large">{def.emblem}</span>
          <div>
            <div className="banner-eyebrow">{def.tradition.toUpperCase()}</div>
            <h2 className="banner-title">{def.name} Spiritual Sanctuary</h2>
            <p className="banner-subtitle">
              {def.sacredTextName} · {def.tagline}
            </p>
          </div>
        </div>

        <div className="banner-serenity-box">
          <div className="serenity-label-row">
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Spiritual Serenity & Soul Peace
            </span>
            <strong style={{ fontSize: '14px', color: '#059669' }}>{religion.serenity}%</strong>
          </div>
          <div className="serenity-track">
            <div
              className="serenity-fill"
              style={{
                width: `${religion.serenity}%`,
                background:
                  religion.serenity > 75
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : religion.serenity > 40
                    ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
              }}
            />
          </div>
          <div className="serenity-stats-row">
            <span>📿 Prayers: {religion.totalPrayersCompleted}</span>
            <span>🤲 Charity: {money(religion.totalCharityGiven)}</span>
          </div>
        </div>
      </section>

      {/* Navigation Subtabs */}
      <nav className="religion-subtabs">
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'sanctuary' ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setActiveTab('sanctuary');
          }}
        >
          🏛️ Sanctuary & Moral Desires
        </button>
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'prayers' ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setActiveTab('prayers');
          }}
        >
          ⏰ Daily Prayers & Decided Schedule
        </button>
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'scriptures' ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setActiveTab('scriptures');
          }}
        >
          📖 Sacred Religious Texts ({def.inGameScriptures.length})
        </button>
        <button
          type="button"
          className={`subtab-btn ${activeTab === 'study' ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setActiveTab('study');
          }}
        >
          🔬 Reputable Study Archives & Notes ({def.reputableStudyLinks.length})
        </button>
      </nav>

      {/* TAB 1: SANCTUARY & MORAL DESIRES */}
      {activeTab === 'sanctuary' && (
        <div className="tab-content-grid">
          <div className="content-card">
            <div className="card-header-bar">
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                🌟 Needed Moral Desires & Pillars of Stewardship
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Fulfill spiritual duties to build inner peace and community blessings
              </span>
            </div>

            <div className="desires-list">
              {religion.desires.map((desire) => {
                const percent = Math.min(100, Math.round((desire.currentProgress / desire.targetGoal) * 100));
                return (
                  <div key={desire.id} className={`desire-card ${desire.isFulfilled ? 'fulfilled' : ''}`}>
                    <div className="desire-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '15px', color: '#0f172a' }}>{desire.name}</strong>
                          {desire.isFulfilled ? (
                            <span className="badge-fulfilled">Fulfilled ✓</span>
                          ) : (
                            <span className="badge-category">{desire.category.toUpperCase()}</span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>
                          {desire.description}
                        </p>
                        <small style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                          Scriptural anchor: <i>{desire.scriptureAnchor}</i>
                        </small>
                      </div>

                      {desire.actionLabel && (
                        <button
                          type="button"
                          className="desire-action-btn"
                          disabled={desire.actionCostCash ? state.cash < desire.actionCostCash : false}
                          onClick={() => {
                            if (desire.actionCostCash) {
                              handleCharityAction(desire.id, desire.actionCostCash);
                            } else {
                              playPrayerBellSound();
                              setState((prev) => {
                                if (!prev || !prev.religion) return prev;
                                return {
                                  ...prev,
                                  religion: {
                                    ...prev.religion,
                                    serenity: Math.min(100, prev.religion.serenity + 15),
                                    desires: prev.religion.desires.map((d) =>
                                      d.id === desire.id
                                        ? { ...d, currentProgress: d.targetGoal, isFulfilled: true }
                                        : d
                                    ),
                                  },
                                };
                              });
                            }
                          }}
                        >
                          {desire.actionLabel}
                        </button>
                      )}
                    </div>

                    <div className="desire-progress-wrap">
                      <div className="desire-progress-track">
                        <div className="desire-progress-fill" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="desire-progress-label">
                        {desire.currentProgress.toLocaleString()} / {desire.targetGoal.toLocaleString()} {desire.unit} ({percent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="content-card">
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#0f172a' }}>
              📜 Core Teachings on Wealth & Purpose
            </h4>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              {def.teachingsOnWealth}
            </p>
            <div className="spiritual-bonus-box">
              <strong>Serenity Blessings:</strong>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#166534' }}>
                <li>+15% resistance against market panic and economic crashes</li>
                <li>Community admiration elevates Town & Civic goodwill</li>
                <li>Reduces debt stress penalties during high-interest periods</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRAYERS & DECIDED SCHEDULE */}
      {activeTab === 'prayers' && (
        <div className="tab-content-grid">
          <div className="content-card">
            <div className="card-header-bar">
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  ⏰ Scheduled Prayers & Decided Notification Times
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Set your decided times. The in-game bell and notifications will alert you when it is time to pray.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="test-chime-btn"
                  onClick={() => playPrayerBellSound()}
                  title="Test Sacred Bell Chime"
                >
                  🔔 Test Sacred Bell
                </button>
                {permissionStatus !== 'granted' && (
                  <button
                    type="button"
                    className="browser-alert-btn"
                    onClick={requestBrowserNotificationPermission}
                  >
                    Enable Browser Alerts
                  </button>
                )}
              </div>
            </div>

            <div className="prayers-list">
              {religion.scheduledPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className={`prayer-card-item ${prayer.completedToday ? 'completed' : ''} ${
                    !prayer.enabled ? 'disabled' : ''
                  }`}
                >
                  <div className="prayer-item-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="prayer-toggle-label">
                        <input
                          type="checkbox"
                          checked={prayer.enabled}
                          onChange={() => handleTogglePrayer(prayer.id)}
                        />
                      </label>
                      <div>
                        <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                          {prayer.name} {prayer.arabicOrNativeName ? `· ${prayer.arabicOrNativeName}` : ''}
                        </strong>
                        <span className="prayer-window-badge">{prayer.windowLabel}</span>
                      </div>
                    </div>

                    <p className="prayer-scripture-snippet">
                      &ldquo;{prayer.scriptureText.slice(0, 110)}...&rdquo;
                    </p>
                  </div>

                  <div className="prayer-item-right">
                    <div className="time-decide-box">
                      <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        Your Decided Time:
                      </label>
                      <input
                        type="time"
                        value={prayer.scheduledTime}
                        onChange={(e) => handleTimeChange(prayer.id, e.target.value)}
                        className="prayer-time-field"
                      />
                    </div>

                    <button
                      type="button"
                      className={`pray-now-btn ${prayer.completedToday ? 'done' : ''}`}
                      onClick={() => {
                        playClickSound();
                        setActivePrayerModal(prayer);
                      }}
                    >
                      {prayer.completedToday ? '✓ Prayed Today' : '📿 Pray Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IN-GAME RELIGIOUS TEXT (SCRIPTURES) */}
      {activeTab === 'scriptures' && (
        <div className="tab-content-grid">
          <div className="content-card">
            <div className="scripture-filter-bar">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Passages' },
                  { id: 'Wealth & Stewardship', label: '💰 Wealth & Stewardship' },
                  { id: 'Charity & Mercy', label: '🤲 Charity & Mercy' },
                  { id: 'Honesty & Labor', label: '⚖️ Honesty & Labor' },
                  { id: 'Peace & Contentment', label: '🕊️ Peace & Contentment' },
                  { id: 'Universal Justice', label: '🌍 Universal Justice' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`topic-pill ${scriptureTopicFilter === cat.id ? 'selected' : ''}`}
                    onClick={() => {
                      playClickSound();
                      setScriptureTopicFilter(cat.id);
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search sacred passages or verse numbers..."
                value={scriptureSearchQuery}
                onChange={(e) => setScriptureSearchQuery(e.target.value)}
                className="scripture-search-input"
              />
            </div>

            <div className="scriptures-container">
              {filteredScriptures.map((scrip) => (
                <article key={scrip.id} className="scripture-article">
                  <div className="scripture-header">
                    <div>
                      <span className="scripture-ref">{scrip.reference}</span>
                      <h4 className="scripture-title">{scrip.title}</h4>
                    </div>
                    <span className="scripture-topic-tag">{scrip.topic}</span>
                  </div>

                  {scrip.originalOrPhonetic && (
                    <div className="scripture-original-box">{scrip.originalOrPhonetic}</div>
                  )}

                  <blockquote className="scripture-body-text">{scrip.text}</blockquote>

                  <div className="scripture-footer">
                    <span style={{ fontSize: '12px', color: '#475569' }}>
                      <b>Spiritual Principle:</b> {scrip.themeSummary}
                    </span>
                    <button
                      type="button"
                      className="copy-to-notes-btn"
                      onClick={() => {
                        playClickSound();
                        setActiveTab('study');
                        setNewNoteTitle(`Reflection on ${scrip.title}`);
                        setNewNoteRef(scrip.reference);
                        setNewNoteContent(
                          `Studying ${scrip.reference}:\n"${scrip.text}"\n\nPersonal Application in Empire:`
                        );
                      }}
                    >
                      ✍️ Add to Study Journal
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPUTABLE STUDY ARCHIVES & NOTES */}
      {activeTab === 'study' && (
        <div className="study-tab-layout">
          {/* Reputable External Archives */}
          <div className="content-card">
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>
              🌐 Reputable World Scripture Archives for Study
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b' }}>
              These recognized, non-commercial, world-standard digital repositories provide deep academic translations,
              original ancient languages, concordance lexicons, and commentaries.
            </p>

            <div className="study-links-grid">
              {def.reputableStudyLinks.map((link) => (
                <div key={link.id} className="study-link-card">
                  <div className="link-card-top">
                    <span className="link-badge">{link.badge}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-external-btn"
                    >
                      Open Repository ↗
                    </a>
                  </div>

                  <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px', color: '#0f172a' }}>
                    {link.name}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    {link.description}
                  </p>

                  <div className="link-rec-chapters">
                    <small style={{ fontWeight: 700, color: '#334155' }}>Recommended Chapters:</small>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {link.recommendedChapters.map((ch, idx) => (
                        <span key={idx} className="rec-chapter-chip">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="authority-note">
                    <small><b>Authority:</b> {link.authorityNotes}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Notes & Personal Reflection Journal */}
          <div className="content-card">
            <div className="card-header-bar">
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                  ✍️ Study Notes & Personal Contemplation Journal
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Record your insights, theological study notes, and spiritual reflections on wealth and work.
                </span>
              </div>
            </div>

            {journalMessage && (
              <div className="journal-success-banner">{journalMessage}</div>
            )}

            {/* Note creation form */}
            <form onSubmit={handleAddNote} className="new-note-form">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Note Title (e.g., Reflections on Stewardship & Zakat)"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  style={{ flex: 2, minWidth: '220px' }}
                  className="note-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Passage Ref (e.g. Luke 12:15 or Surah 57:7)"
                  value={newNoteRef}
                  onChange={(e) => setNewNoteRef(e.target.value)}
                  style={{ flex: 1, minWidth: '160px' }}
                  className="note-input"
                />
              </div>

              <textarea
                placeholder="Write your study notes, personal reflections, ethical questions, or prayer intentions..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={4}
                className="note-textarea"
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  💾 Save Study Note
                </button>
              </div>
            </form>

            {/* List of study notes */}
            <div className="study-notes-list">
              {religion.studyNotes.map((note) => (
                <div key={note.id} className={`study-note-item ${note.isUserNote ? 'user-note' : 'scholarly-note'}`}>
                  <div className="note-header">
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{note.title}</strong>
                      <span className="note-ref-badge">{note.passageRef}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <small style={{ color: '#64748b', fontSize: '11px' }}>{note.authorOrSource}</small>
                      {note.isUserNote && (
                        <button
                          type="button"
                          className="delete-note-btn"
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete note"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="note-body-content">{note.content}</p>

                  <div className="note-footer">
                    <small style={{ color: '#94a3b8', fontSize: '10px' }}>
                      {new Date(note.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRAYER CONTEMPLATION MODAL */}
      {activePrayerModal && (
        <div className="religion-modal-backdrop" onClick={() => setActivePrayerModal(null)}>
          <div className="prayer-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <span style={{ fontSize: '28px' }}>{def.emblem}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                  {activePrayerModal.name}
                </h3>
                <small style={{ color: '#64748b' }}>
                  {activePrayerModal.arabicOrNativeName ? `${activePrayerModal.arabicOrNativeName} · ` : ''}
                  Window: {activePrayerModal.windowLabel} · Decided Time: {activePrayerModal.scheduledTime}
                </small>
              </div>
              <button
                type="button"
                className="religion-modal-close"
                onClick={() => setActivePrayerModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="prayer-sacred-box">
              <p className="prayer-original-text">&ldquo;{activePrayerModal.scriptureText}&rdquo;</p>
              <div className="prayer-translation-box">
                <small><b>Meaning & Significance:</b></small>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#334155' }}>
                  {activePrayerModal.englishTranslation}
                </p>
              </div>
            </div>

            <div className="prayer-guidance-callout">
              <span style={{ fontSize: '18px' }}>🧘</span>
              <div>
                <strong style={{ fontSize: '12px', color: '#166534', display: 'block' }}>
                  Contemplation & Spiritual Focus:
                </strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#15803d' }}>
                  {activePrayerModal.guidance}
                </p>
              </div>
            </div>

            <div className="prayer-modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setActivePrayerModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => handlePerformPrayer(activePrayerModal)}
              >
                🕊️ Complete Prayer & Contemplate (+15% Serenity)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
