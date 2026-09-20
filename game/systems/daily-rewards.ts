import type { GameState } from '../types';
import { leveragedNetWorth } from '../debt-runtime';
import { addFame } from '../fame-actions';

export interface DailyCheckInState {
  streak: number; // consecutive active days (1..7, then cycles)
  totalCheckIns: number; // lifetime total check-ins claimed
  lastCheckInDate: string; // ISO date format "YYYY-MM-DD"
  lastCheckInTimestamp: number;
  claimedDaysInCycle: number[]; // e.g. [1, 2, 3]
  cycleCount: number; // how many 7-day cycles completed
  lastInGameDayClaimed?: number; // tracks in-game day dividends
}

export interface DailyRewardDefinition {
  day: number;
  title: string;
  emoji: string;
  badge: string;
  baseCash: number;
  netWorthPct: number; // e.g. 0.02 = 2% of player net worth
  famePoints: number;
  lokTokens: number;
  cardCredits: number;
  perkDescription?: string;
  isGrandPrize?: boolean;
}

export const DAILY_REWARDS_TRACK: DailyRewardDefinition[] = [
  {
    day: 1,
    title: 'Seed Venture Grant',
    emoji: '🌱',
    badge: 'Day 1 Starter',
    baseCash: 50_000,
    netWorthPct: 0.01,
    famePoints: 100,
    lokTokens: 5,
    cardCredits: 5,
    perkDescription: 'Kickstart your daily streak with fresh venture capital.',
  },
  {
    day: 2,
    title: 'Executive Cash Influx',
    emoji: '💼',
    badge: 'Day 2 Tycoon',
    baseCash: 150_000,
    netWorthPct: 0.02,
    famePoints: 250,
    lokTokens: 10,
    cardCredits: 10,
    perkDescription: 'Corporate advisory dividends deposited directly into cash reserves.',
  },
  {
    day: 3,
    title: 'Market Insider Vault',
    emoji: '📊',
    badge: 'Day 3 Whisperer',
    baseCash: 500_000,
    netWorthPct: 0.035,
    famePoints: 600,
    lokTokens: 20,
    cardCredits: 15,
    perkDescription: 'Hedge fund intelligence yield with bonus LOK tokens.',
  },
  {
    day: 4,
    title: 'Venture Capitalist Cache',
    emoji: '🚀',
    badge: 'Day 4 Syndicate',
    baseCash: 1_500_000,
    netWorthPct: 0.05,
    famePoints: 1_200,
    lokTokens: 35,
    cardCredits: 25,
    perkDescription: 'Private equity syndicate profits accelerating empire expansion.',
  },
  {
    day: 5,
    title: 'Sovereign Wealth Endowment',
    emoji: '👑',
    badge: 'Day 5 Sovereign',
    baseCash: 5_000_000,
    netWorthPct: 0.075,
    famePoints: 2_500,
    lokTokens: 50,
    cardCredits: 40,
    perkDescription: 'Grants a free 60-minute 2× Revenue Multiplier booster!',
  },
  {
    day: 6,
    title: 'Municipal Megaproject Grant',
    emoji: '🏛️',
    badge: 'Day 6 Conglomerate',
    baseCash: 15_000_000,
    netWorthPct: 0.10,
    famePoints: 5_000,
    lokTokens: 75,
    cardCredits: 60,
    perkDescription: 'Boosts Town Goodwill by +15 and attracts +150 new citizens!',
  },
  {
    day: 7,
    title: 'Planetary Titan Grand Cache',
    emoji: '🪐',
    badge: 'Day 7 Titan',
    baseCash: 50_000_000,
    netWorthPct: 0.15,
    famePoints: 15_000,
    lokTokens: 150,
    cardCredits: 100,
    perkDescription: 'Legendary milestone: Massive wealth influx + 2 Legacy Relics bonus!',
    isGrandPrize: true,
  },
];

export function getLocalDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayDateString(todayStr: string): string {
  const [y, m, d] = todayStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  dt.setDate(dt.getDate() - 1);
  return getLocalDateString(dt);
}

export function normalizeDailyCheckInState(raw?: Partial<DailyCheckInState> | null): DailyCheckInState {
  return {
    streak: Math.max(0, Math.floor(raw?.streak ?? 0)),
    totalCheckIns: Math.max(0, Math.floor(raw?.totalCheckIns ?? 0)),
    lastCheckInDate: typeof raw?.lastCheckInDate === 'string' ? raw.lastCheckInDate : '',
    lastCheckInTimestamp: Number.isFinite(raw?.lastCheckInTimestamp) ? (raw!.lastCheckInTimestamp as number) : 0,
    claimedDaysInCycle: Array.isArray(raw?.claimedDaysInCycle)
      ? raw!.claimedDaysInCycle.filter((d) => typeof d === 'number' && d >= 1 && d <= 7)
      : [],
    cycleCount: Math.max(0, Math.floor(raw?.cycleCount ?? 0)),
    lastInGameDayClaimed: typeof raw?.lastInGameDayClaimed === 'number' ? raw.lastInGameDayClaimed : 0,
  };
}

export interface DailyCheckInStatus {
  canClaim: boolean;
  currentDayInCycle: number; // 1 to 7
  activeStreak: number;
  totalCheckIns: number;
  alreadyClaimedToday: boolean;
  secondsUntilNextReset: number;
  todayDateStr: string;
  claimedDays: number[];
  currentReward: DailyRewardDefinition;
}

export function getDailyCheckInStatus(state?: DailyCheckInState | null, now = Date.now()): DailyCheckInStatus {
  const normalized = normalizeDailyCheckInState(state);
  const nowDate = new Date(now);
  const todayStr = getLocalDateString(nowDate);
  const yesterdayStr = getYesterdayDateString(todayStr);

  // Midnight of next day
  const tomorrowMidnight = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1, 0, 0, 0, 0);
  const secondsUntilNextReset = Math.max(0, Math.ceil((tomorrowMidnight.getTime() - now) / 1000));

  const alreadyClaimedToday = normalized.lastCheckInDate === todayStr;

  let activeStreak = normalized.streak;
  let currentDayInCycle = 1;

  if (alreadyClaimedToday) {
    // Current day is what was claimed today
    currentDayInCycle = ((activeStreak - 1) % 7) + 1;
    const currentReward = DAILY_REWARDS_TRACK[currentDayInCycle - 1] || DAILY_REWARDS_TRACK[0];
    return {
      canClaim: false,
      currentDayInCycle,
      activeStreak,
      totalCheckIns: normalized.totalCheckIns,
      alreadyClaimedToday: true,
      secondsUntilNextReset,
      todayDateStr: todayStr,
      claimedDays: normalized.claimedDaysInCycle,
      currentReward,
    };
  }

  // Not yet claimed today
  if (!normalized.lastCheckInDate) {
    // First time playing
    activeStreak = 0;
    currentDayInCycle = 1;
  } else if (normalized.lastCheckInDate === yesterdayStr) {
    // Consecutive day check-in: streak continues
    currentDayInCycle = (normalized.streak % 7) + 1;
  } else {
    // Missed a day: start new cycle
    activeStreak = 0;
    currentDayInCycle = 1;
  }

  const currentReward = DAILY_REWARDS_TRACK[currentDayInCycle - 1] || DAILY_REWARDS_TRACK[0];

  return {
    canClaim: true,
    currentDayInCycle,
    activeStreak,
    totalCheckIns: normalized.totalCheckIns,
    alreadyClaimedToday: false,
    secondsUntilNextReset,
    todayDateStr: todayStr,
    claimedDays: normalized.claimedDaysInCycle,
    currentReward,
  };
}

export interface ClaimResult {
  nextState: GameState;
  cashAwarded: number;
  fameAwarded: number;
  lokAwarded: number;
  cardCreditsAwarded: number;
  perkAwarded?: string;
  dayClaimed: number;
  newStreak: number;
}

export function claimDailyReward(gameState: GameState, now = Date.now()): ClaimResult | null {
  const status = getDailyCheckInStatus(gameState.dailyRewards, now);
  if (!status.canClaim) return null;

  const reward = status.currentReward;
  const netWorth = leveragedNetWorth(gameState);

  // Scaled cash award: at least baseCash, or percentage of net worth
  const scaledCash = Math.max(reward.baseCash, Math.round(netWorth * reward.netWorthPct));
  const newStreak = status.activeStreak + 1;
  const dayClaimed = status.currentDayInCycle;

  let claimedDaysInCycle = [...(gameState.dailyRewards?.claimedDaysInCycle ?? [])];
  if (dayClaimed === 1 || claimedDaysInCycle.includes(dayClaimed)) {
    claimedDaysInCycle = [dayClaimed];
  } else {
    claimedDaysInCycle.push(dayClaimed);
  }

  let cycleCount = gameState.dailyRewards?.cycleCount ?? 0;
  if (dayClaimed === 7) {
    cycleCount += 1;
  }

  const nextDailyState: DailyCheckInState = {
    streak: newStreak,
    totalCheckIns: (gameState.dailyRewards?.totalCheckIns ?? 0) + 1,
    lastCheckInDate: status.todayDateStr,
    lastCheckInTimestamp: now,
    claimedDaysInCycle,
    cycleCount,
    lastInGameDayClaimed: gameState.dailyRewards?.lastInGameDayClaimed ?? 0,
  };

  // Base state modifications
  let updatedState: GameState = {
    ...gameState,
    cash: gameState.cash + scaledCash,
    lifetimeIncome: gameState.lifetimeIncome + scaledCash,
    lokTokens: gameState.lokTokens + reward.lokTokens,
    dailyRewards: nextDailyState,
    updatedAt: now,
  };

  // Special Day 5 perk: 60-minute 2x sponsor boost
  if (reward.day === 5) {
    updatedState = {
      ...updatedState,
      cardGameplay: {
        ...updatedState.cardGameplay,
        businessBoostUntilGameMinute: updatedState.time.gameMinute + 60 * 4,
        businessBoostMultiplier: 2,
      },
    };
  }

  // Special Day 6 perk: Town Goodwill & Citizens
  if (reward.day === 6 && updatedState.cityEconomy?.founded) {
    const currentGoodwill = updatedState.cityEconomy.communityGoodwill ?? 50;
    const currentPop = updatedState.cityEconomy.population ?? 0;
    const currentUnits = updatedState.cityEconomy.housingUnits ?? 100;
    updatedState = {
      ...updatedState,
      cityEconomy: {
        ...updatedState.cityEconomy,
        communityGoodwill: Math.min(100, currentGoodwill + 15),
        population: currentPop + 150,
        housingUnits: Math.max(currentUnits, currentPop + 150),
      },
    };
  }

  // Add Fame points
  updatedState = addFame(updatedState, reward.famePoints, now);

  return {
    nextState: updatedState,
    cashAwarded: scaledCash,
    fameAwarded: reward.famePoints,
    lokAwarded: reward.lokTokens,
    cardCreditsAwarded: reward.cardCredits,
    perkAwarded: reward.perkDescription,
    dayClaimed,
    newStreak,
  };
}

/**
 * In-Game Day Dividend:
 * Whenever an in-game day finishes (tracked via state.time.gameMinute),
 * an in-game morning dividend is available.
 */
export function getInGameDayDividendStatus(gameState: GameState): {
  canClaim: boolean;
  currentInGameDay: number;
  dividendAmount: number;
} {
  const dayLength = gameState.time?.settings?.dayLengthMinutes ?? 1440;
  const currentInGameDay = Math.floor((gameState.time?.gameMinute ?? 0) / dayLength) + 1;
  const lastClaimed = gameState.dailyRewards?.lastInGameDayClaimed ?? 0;

  const canClaim = currentInGameDay > lastClaimed && currentInGameDay > 1;
  const netWorth = leveragedNetWorth(gameState);
  const dividendAmount = Math.max(10_000, Math.round(netWorth * 0.005));

  return {
    canClaim,
    currentInGameDay,
    dividendAmount,
  };
}

export function claimInGameDayDividend(gameState: GameState): GameState {
  const status = getInGameDayDividendStatus(gameState);
  if (!status.canClaim) return gameState;

  return {
    ...gameState,
    cash: gameState.cash + status.dividendAmount,
    lifetimeIncome: gameState.lifetimeIncome + status.dividendAmount,
    dailyRewards: {
      ...normalizeDailyCheckInState(gameState.dailyRewards),
      lastInGameDayClaimed: status.currentInGameDay,
    },
    updatedAt: Date.now(),
  };
}
