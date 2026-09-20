import type { GameState } from '../types';
import { getDailyCheckInStatus, getInGameDayDividendStatus } from './daily-rewards';
import { PR_ACTIONS } from './fame';
import { debtSummary, normalizeDebtState } from './debt';

export type ReminderCategory =
  | 'daily-reward'
  | 'pr-stunt'
  | 'town-events'
  | 'offline-earnings'
  | 'companion-quest'
  | 'debt-warning'
  | 'sponsor-boost'
  | 'prayer-alarm';

export interface NotificationReminderItem {
  id: string;
  category: ReminderCategory;
  title: string;
  description: string;
  emoji: string;
  priority: 'info' | 'important' | 'urgent';
  actionLabel?: string;
  targetView?: string;
  actionType: 'open-daily' | 'switch-view' | 'open-cards' | 'dismiss' | 'claim-offline';
  timestamp: number;
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  toastsEnabled: boolean;
  notifyDailyReward: boolean;
  notifyPrStunt: boolean;
  notifyTownEvents: boolean;
  notifyCompanionQuest: boolean;
  notifyDebtAlerts: boolean;
  notifySponsorBoost: boolean;
  notifyPrayers: boolean;
}

export const NOTIFICATION_PREFS_KEY = 'spend-it-all-notification-prefs-v1';

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  soundEnabled: true,
  toastsEnabled: true,
  notifyDailyReward: true,
  notifyPrStunt: true,
  notifyTownEvents: true,
  notifyCompanionQuest: true,
  notifyDebtAlerts: true,
  notifySponsorBoost: true,
  notifyPrayers: true,
};

const PREFS_EVENT = 'spend-it-all-notification-prefs-changed';

export function loadNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_NOTIFICATION_PREFS };
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: prefs }));
  } catch {
    // Ignore storage quota errors
  }
}

export function subscribeNotificationPreferences(
  listener: (prefs: NotificationPreferences) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<NotificationPreferences>;
    if (custom.detail) listener(custom.detail);
  };
  window.addEventListener(PREFS_EVENT, handler);
  return () => window.removeEventListener(PREFS_EVENT, handler);
}

export function detectActiveReminders(params: {
  gameState: GameState;
  offlineAward: number;
  companionQuestReady: boolean;
  sponsorBoostReady: boolean;
  prefs: NotificationPreferences;
  now?: number;
}): NotificationReminderItem[] {
  const { gameState, offlineAward, companionQuestReady, sponsorBoostReady, prefs } = params;
  const now = params.now ?? Date.now();
  const reminders: NotificationReminderItem[] = [];

  // 1. Daily Check-In Reward
  if (prefs.notifyDailyReward) {
    const dailyStatus = getDailyCheckInStatus(gameState.dailyRewards, now);
    if (dailyStatus.canClaim) {
      reminders.push({
        id: 'daily-reward-claimable',
        category: 'daily-reward',
        title: 'Daily Reward Ready!',
        description: `Day ${dailyStatus.currentDayInCycle} reward (${dailyStatus.currentReward.badge}) is waiting to be claimed!`,
        emoji: '🎁',
        priority: 'important',
        actionLabel: 'Claim Reward',
        actionType: 'open-daily',
        timestamp: now,
      });
    }

    const dividendStatus = getInGameDayDividendStatus(gameState);
    if (dividendStatus.canClaim) {
      reminders.push({
        id: 'ingame-dividend-claimable',
        category: 'daily-reward',
        title: `Day ${dividendStatus.currentInGameDay} Morning Dividend`,
        description: `Municipal morning dividend of $${dividendStatus.dividendAmount.toLocaleString()} is ready.`,
        emoji: '☀️',
        priority: 'info',
        actionLabel: 'Collect',
        actionType: 'open-daily',
        timestamp: now,
      });
    }
  }

  // 2. Offline Earnings
  if (offlineAward > 0) {
    reminders.push({
      id: 'offline-earnings-ready',
      category: 'offline-earnings',
      title: 'Offline Earnings Accumulated',
      description: `Your empire produced $${Math.round(offlineAward).toLocaleString()} while you were away.`,
      emoji: '💰',
      priority: 'important',
      actionLabel: 'Claim Yield',
      actionType: 'claim-offline',
      timestamp: now,
    });
  }

  // 3. PR Media Stunt Cooldown
  if (prefs.notifyPrStunt && gameState.fame) {
    const anyPrReady = PR_ACTIONS.some((action) => {
      const cd = gameState.fame?.prCooldowns?.[action.id] ?? 0;
      return now >= cd;
    });
    if (anyPrReady) {
      reminders.push({
        id: 'pr-stunt-ready',
        category: 'pr-stunt',
        title: 'PR Campaign Ready',
        description: 'The global news cycle has refreshed. Launch a high-profile PR stunt to gain Fame.',
        emoji: '📢',
        priority: 'info',
        actionLabel: 'Launch PR',
        targetView: 'town',
        actionType: 'switch-view',
        timestamp: now,
      });
    }
  }

  // 4. Town Housing Bottleneck & Petitions
  if (prefs.notifyTownEvents && gameState.cityEconomy?.founded) {
    const pop = gameState.cityEconomy.population ?? 0;
    const units = gameState.cityEconomy.housingUnits ?? 0;
    if (pop >= units && units > 0) {
      reminders.push({
        id: 'town-housing-full',
        category: 'town-events',
        title: 'Town Housing Capacity Full',
        description: 'Immigrants are being turned away. Build residential districts to resume growth.',
        emoji: '🏘️',
        priority: 'important',
        actionLabel: 'Expand Town',
        targetView: 'town',
        actionType: 'switch-view',
        timestamp: now,
      });
    }

    if ((gameState.cityEconomy.petitions?.length ?? 0) > 0) {
      reminders.push({
        id: 'town-petition-pending',
        category: 'town-events',
        title: 'Citizen Petition Pending',
        description: `${gameState.cityEconomy.petitions.length} municipal petition awaiting mayoral decision.`,
        emoji: '📜',
        priority: 'info',
        actionLabel: 'Review Petitions',
        targetView: 'town',
        actionType: 'switch-view',
        timestamp: now,
      });
    }
  }

  // 5. Companion Quest
  if (prefs.notifyCompanionQuest && companionQuestReady) {
    reminders.push({
      id: 'companion-quest-ready',
      category: 'companion-quest',
      title: 'Pet Companion Quest Complete',
      description: 'Your companion has finished their objective. Collect Card Credits now.',
      emoji: '🐾',
      priority: 'info',
      actionLabel: 'Collect Credits',
      actionType: 'open-cards',
      timestamp: now,
    });
  }

  // 6. Sponsor Multiplier Boost
  if (prefs.notifySponsorBoost && sponsorBoostReady) {
    reminders.push({
      id: 'sponsor-boost-available',
      category: 'sponsor-boost',
      title: 'Free 2× Sponsor Boost Ready',
      description: 'Free revenue doubler is off cooldown and ready to activate.',
      emoji: '⚡',
      priority: 'info',
      actionLabel: 'Activate Boost',
      actionType: 'dismiss',
      timestamp: now,
    });
  }

  // 7. Financial & Debt Warnings
  if (prefs.notifyDebtAlerts && gameState.debt?.enabled) {
    const debt = normalizeDebtState(gameState.debt);
    const summary = debtSummary(debt);
    if (summary.defaultedDebt > 0 || summary.activeCourtCases > 0) {
      reminders.push({
        id: 'debt-critical-alert',
        category: 'debt-warning',
        title: 'Creditor Default / Court Action',
        description: 'Defaulted obligations or legal proceedings detected. Resolve immediately.',
        emoji: '⚖️',
        priority: 'urgent',
        actionLabel: 'Debt Terminal',
        targetView: 'debt',
        actionType: 'switch-view',
        timestamp: now,
      });
    } else if (summary.totalDebt > 100_000 && summary.totalDebt > gameState.cash * 2) {
      reminders.push({
        id: 'debt-high-leverage',
        category: 'debt-warning',
        title: 'High Leverage Warning',
        description: `Total debt ($${Math.round(summary.totalDebt).toLocaleString()}) heavily exceeds cash reserves. Reduce borrowing.`,
        emoji: '⚠️',
        priority: 'important',
        actionLabel: 'Debt Terminal',
        targetView: 'debt',
        actionType: 'switch-view',
        timestamp: now,
      });
    }
  }

  // 8. Scheduled Faith & Daily Prayers
  if (gameState.religion && (prefs.notifyPrayers ?? true)) {
    const date = new Date(now);
    const currentTotalMin = date.getHours() * 60 + date.getMinutes();

    for (const prayer of gameState.religion.scheduledPrayers) {
      if (!prayer.enabled || prayer.completedToday) continue;
      const parts = prayer.scheduledTime.split(':').map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) continue;
      const prayerTotalMin = parts[0] * 60 + parts[1];

      // If within 60 minutes after scheduled time
      if (currentTotalMin >= prayerTotalMin && currentTotalMin <= prayerTotalMin + 60) {
        reminders.push({
          id: `prayer-${prayer.id}`,
          category: 'prayer-alarm',
          title: `Time for ${prayer.name}`,
          description: `Your decided prayer time is ${prayer.scheduledTime}. Take a quiet moment for reflection and prayer.`,
          emoji: '🕊️',
          priority: 'important',
          actionLabel: 'Open Sanctuary',
          targetView: 'religion',
          actionType: 'switch-view',
          timestamp: now,
        });
      }
    }
  }

  return reminders;
}
