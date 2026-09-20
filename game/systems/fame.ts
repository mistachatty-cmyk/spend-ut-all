export type FameTier = {
  level: number;
  name: string;
  minPoints: number;
  emoji: string;
  title: string;
  perkDescription: string;
  incomeBonusPct: number;
  immigrationBonusPct: number;
};

export const FAME_TIERS: FameTier[] = [
  {
    level: 0,
    name: 'Unknown Citizen',
    minPoints: 0,
    emoji: '👤',
    title: 'Private Individual',
    perkDescription: 'No public profile or media recognition yet.',
    incomeBonusPct: 0,
    immigrationBonusPct: 0,
  },
  {
    level: 1,
    name: 'Local Phenomenon',
    minPoints: 100,
    emoji: '📢',
    title: 'Hometown Notable',
    perkDescription: '+2% business revenue · +5% town immigration rate.',
    incomeBonusPct: 0.02,
    immigrationBonusPct: 0.05,
  },
  {
    level: 2,
    name: 'Rising Tycoon',
    minPoints: 500,
    emoji: '📰',
    title: 'Press Darling',
    perkDescription: '+5% business revenue · +15% town immigration · PR Campaigns unlocked.',
    incomeBonusPct: 0.05,
    immigrationBonusPct: 0.15,
  },
  {
    level: 3,
    name: 'National Celebrity',
    minPoints: 2_500,
    emoji: '📺',
    title: 'Household Name',
    perkDescription: '+10% business revenue · +30% town immigration · Forbes Top 100 contender.',
    incomeBonusPct: 0.1,
    immigrationBonusPct: 0.3,
  },
  {
    level: 4,
    name: 'International Mogul',
    minPoints: 15_000,
    emoji: '🌐',
    title: 'Global Influencer',
    perkDescription: '+18% business revenue · +50% town immigration · High-net-worth tourist influx.',
    incomeBonusPct: 0.18,
    immigrationBonusPct: 0.5,
  },
  {
    level: 5,
    name: 'Cultural Icon',
    minPoints: 75_000,
    emoji: '👑',
    title: 'Living Legend',
    perkDescription: '+28% business revenue · +80% town immigration · TIME Person of the Year unlocked.',
    incomeBonusPct: 0.28,
    immigrationBonusPct: 0.8,
  },
  {
    level: 6,
    name: 'Planetary Titan',
    minPoints: 250_000,
    emoji: '🪐',
    title: 'Civilization Figurehead',
    perkDescription: '+40% business revenue · +120% town immigration · Supreme Forbes #1 ranking.',
    incomeBonusPct: 0.4,
    immigrationBonusPct: 1.2,
  },
];

export type PRAction = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  minTier: number;
  fameReward: number;
  cooldownMs: number;
  townGoodwillReward: number;
};

export const PR_ACTIONS: PRAction[] = [
  {
    id: 'viral-post',
    name: 'Viral Social Commentary',
    emoji: '📱',
    description: 'Post an unconventional visionary take to ignite social media algorithms.',
    cost: 5_000,
    minTier: 1,
    fameReward: 35,
    cooldownMs: 45_000,
    townGoodwillReward: 1,
  },
  {
    id: 'podcast-appearance',
    name: '3-Hour Deep-Dive Podcast',
    emoji: '🎙️',
    description: 'Appear on the world’s most listened-to longform podcast to unpack your philosophy.',
    cost: 75_000,
    minTier: 2,
    fameReward: 220,
    cooldownMs: 90_000,
    townGoodwillReward: 3,
  },
  {
    id: 'charity-gala',
    name: 'Black-Tie Philanthropy Gala',
    emoji: '🍾',
    description: 'Host high-society philanthropists, match civic donations, and fund civic arts.',
    cost: 500_000,
    minTier: 2,
    fameReward: 950,
    cooldownMs: 150_000,
    townGoodwillReward: 8,
  },
  {
    id: 'super-bowl-ad',
    name: 'Prime-Time Super Bowl Commercial',
    emoji: '🏈',
    description: 'Broadcast a 60-second cinematic masterclass during the championship game.',
    cost: 7_500_000,
    minTier: 3,
    fameReward: 5_200,
    cooldownMs: 240_000,
    townGoodwillReward: 10,
  },
  {
    id: 'met-gala-host',
    name: 'Chair the Metropolitan Gala',
    emoji: '✨',
    description: 'Lead the red carpet in custom haute couture, dominating global fashion culture.',
    cost: 35_000_000,
    minTier: 4,
    fameReward: 18_000,
    cooldownMs: 360_000,
    townGoodwillReward: 12,
  },
  {
    id: 'davos-keynote',
    name: 'Global Economic Forum Keynote',
    emoji: '🏔️',
    description: 'Address prime ministers, central bankers, and world leaders on the future of humanity.',
    cost: 150_000_000,
    minTier: 5,
    fameReward: 55_000,
    cooldownMs: 600_000,
    townGoodwillReward: 15,
  },
];

export type CelebrityImmigrant = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  requiredFame: number;
  quote: string;
  perkDescription: string;
  cashBonusPerSecond: number;
  happinessBonus: number;
};

export const CELEBRITY_IMMIGRANTS: CelebrityImmigrant[] = [
  {
    id: 'indie-rockstar',
    name: 'Jaxson Vance',
    role: 'Grammy-Winning Rocker',
    emoji: '🎸',
    requiredFame: 500,
    quote: 'This town has raw sonic energy you cannot find in Los Angeles.',
    perkDescription: 'Local music scene boosts tourism spending +$35/sec & town goodwill +2%.',
    cashBonusPerSecond: 35,
    happinessBonus: 2,
  },
  {
    id: 'tech-visionary',
    name: 'Dr. Elena Rostova',
    role: 'AI Research Pioneer',
    emoji: '💻',
    requiredFame: 2_500,
    quote: 'I moved my entire neural architecture lab here because of the visionary leadership.',
    perkDescription: 'Brings high-tech research jobs +$250/sec & boosts business demand +5%.',
    cashBonusPerSecond: 250,
    happinessBonus: 3,
  },
  {
    id: 'f1-champion',
    name: 'Mateo Rossi',
    role: 'World Grand Prix Champion',
    emoji: '🏎️',
    requiredFame: 15_000,
    quote: 'The roads around your estate are pure adrenaline. I built my garage right here.',
    perkDescription: 'Hosts town motor festivals +$1,800/sec & +4% happiness.',
    cashBonusPerSecond: 1_800,
    happinessBonus: 4,
  },
  {
    id: 'oscar-actress',
    name: 'Seraphina Dubois',
    role: 'Academy Award-Winning A-Lister',
    emoji: '🎭',
    requiredFame: 50_000,
    quote: 'I built my private sanctuary here. Film crews now shoot prestige features in our downtown.',
    perkDescription: 'Film productions pour +$12,000/sec & massive cultural clout.',
    cashBonusPerSecond: 12_000,
    happinessBonus: 5,
  },
  {
    id: 'space-architect',
    name: 'Kaelen Thorne',
    role: 'Orbital Habitat Designer',
    emoji: '🛰️',
    requiredFame: 150_000,
    quote: 'Your city is the launchpad for civilization beyond Earth.',
    perkDescription: 'Pioneers aerospace testing +$85,000/sec & permanent +8% happiness.',
    cashBonusPerSecond: 85_000,
    happinessBonus: 8,
  },
];

export type MagazineCover = {
  id: string;
  publication: string;
  requiredFame: number;
  coverTitle: string;
  subheadline: string;
  badge: string;
  borderColor: string;
  accentColor: string;
};

export const MAGAZINE_COVERS: MagazineCover[] = [
  {
    id: 'forbes-30',
    publication: 'FORBES',
    requiredFame: 500,
    coverTitle: 'THE RISING TYCOON',
    subheadline: 'How an audacious builder is rewriting the playbook from zero to millions.',
    badge: '30 UNDER 30 SPECIAL',
    borderColor: '#2563eb',
    accentColor: '#1d4ed8',
  },
  {
    id: 'gq-style',
    publication: 'GQ ICONS',
    requiredFame: 2_500,
    coverTitle: 'STYLE, POWER & CASH',
    subheadline: 'Inside the luxury compounds, supercars, and high-velocity daily routine.',
    badge: 'MAN OF THE YEAR',
    borderColor: '#7c3aed',
    accentColor: '#6d28d9',
  },
  {
    id: 'bloomberg-markets',
    publication: 'BLOOMBERG MARKETS',
    requiredFame: 15_000,
    coverTitle: 'THE BILLION-DOLLAR BALANCE SHEET',
    subheadline: 'Dominating private equity, municipal development, and commercial frontiers.',
    badge: 'MARKET MAKER',
    borderColor: '#059669',
    accentColor: '#047857',
  },
  {
    id: 'wired-future',
    publication: 'WIRED',
    requiredFame: 50_000,
    coverTitle: 'ENGINEERING UTOPIA',
    subheadline: 'Building cities, orbital space arrays, and automated industrial networks.',
    badge: 'NEXT 100 YEARS',
    borderColor: '#dc2626',
    accentColor: '#b91c1c',
  },
  {
    id: 'time-person',
    publication: 'TIME',
    requiredFame: 150_000,
    coverTitle: 'PERSON OF THE YEAR',
    subheadline: 'For reshaping culture, capital, and the destiny of humanity.',
    badge: 'WORLD EDITION',
    borderColor: '#b91c1c',
    accentColor: '#991b1b',
  },
];

export type ForbesTitan = {
  rank: number;
  name: string;
  netWorth: number;
  famePoints: number;
  title: string;
  emoji: string;
};

export const FORBES_TITANS: ForbesTitan[] = [
  { rank: 1, name: 'Elon Musk (Peak)', netWorth: 1_000_000_000_000, famePoints: 280_000, title: 'Starship Fleet & Mars Visionary', emoji: '🚀' },
  { rank: 2, name: 'Jeff Bezos (Century)', netWorth: 500_000_000_000, famePoints: 210_000, title: 'Orbital Manufacturing & Global Logistics', emoji: '📦' },
  { rank: 3, name: 'Bill Gates (Prime)', netWorth: 300_000_000_000, famePoints: 175_000, title: 'Planetary Philanthropy & Clean Energy', emoji: '💉' },
  { rank: 4, name: 'Bernard Arnault', netWorth: 215_000_000_000, famePoints: 120_000, title: 'Haute Horlogerie & Luxury Dynasty', emoji: '💎' },
  { rank: 5, name: 'Mark Zuckerberg', netWorth: 195_000_000_000, famePoints: 110_000, title: 'Social Graph & AI Superclusters', emoji: '🕶️' },
  { rank: 6, name: 'Larry Ellison', netWorth: 175_000_000_000, famePoints: 85_000, title: 'Cloud Infrastructure & Hawaiian Havens', emoji: '⛵' },
  { rank: 7, name: 'Warren Buffett', netWorth: 145_000_000_000, famePoints: 95_000, title: 'The Oracle of Compounding', emoji: '📈' },
  { rank: 8, name: 'Jensen Huang', netWorth: 130_000_000_000, famePoints: 80_000, title: 'Accelerated Silicon Architecture', emoji: '🧥' },
  { rank: 9, name: 'Steve Ballmer', netWorth: 125_000_000_000, famePoints: 60_000, title: 'Courtside Energy & Tech Holdings', emoji: '🏀' },
  { rank: 10, name: 'Larry Page', netWorth: 120_000_000_000, famePoints: 55_000, title: 'Planetary Algorithmic Index', emoji: '🔍' },
];

export type FameState = {
  points: number;
  totalEarned: number;
  prCooldowns: Record<string, number>;
  unlockedCovers: string[];
  celebrityResidents: string[];
  touristVisitorCount: number;
  lifetimeTourismRevenue: number;
};

export function createFameState(): FameState {
  return {
    points: 0,
    totalEarned: 0,
    prCooldowns: {},
    unlockedCovers: [],
    celebrityResidents: [],
    touristVisitorCount: 0,
    lifetimeTourismRevenue: 0,
  };
}

export function normalizeFameState(fame?: Partial<FameState>): FameState {
  return {
    points: Math.max(0, fame?.points ?? 0),
    totalEarned: Math.max(0, fame?.totalEarned ?? 0),
    prCooldowns: { ...(fame?.prCooldowns ?? {}) },
    unlockedCovers: Array.isArray(fame?.unlockedCovers) ? [...fame.unlockedCovers] : [],
    celebrityResidents: Array.isArray(fame?.celebrityResidents) ? [...fame.celebrityResidents] : [],
    touristVisitorCount: Math.max(0, fame?.touristVisitorCount ?? 0),
    lifetimeTourismRevenue: Math.max(0, fame?.lifetimeTourismRevenue ?? 0),
  };
}

export function getFameTier(points: number): FameTier {
  for (let i = FAME_TIERS.length - 1; i >= 0; i--) {
    if (points >= FAME_TIERS[i].minPoints) {
      return FAME_TIERS[i];
    }
  }
  return FAME_TIERS[0];
}

export function getNextFameTier(points: number): FameTier | null {
  const current = getFameTier(points);
  const nextIdx = current.level + 1;
  return nextIdx < FAME_TIERS.length ? FAME_TIERS[nextIdx] : null;
}

/**
 * Calculates fame points awarded when purchasing an item from the marketplace.
 * High-value items, sports teams, supercars, mansions, and space assets award significant fame.
 */
export function calculateItemFameReward(item: { id: string; category?: string; basePrice: number }): number {
  const price = item.basePrice;
  if (price < 1_000) return 0;
  if (item.category === 'luxury') {
    // Luxury items scale fame aggressively: $250k car -> 15 fame, $10M jet -> 250 fame, $100M yacht -> 1,500 fame
    return Math.max(2, Math.round(Math.pow(price / 15_000, 0.65)));
  }
  if (item.category === 'infrastructure') {
    // Mega space & energy assets
    return Math.max(5, Math.round(Math.pow(price / 50_000, 0.62)));
  }
  if (item.category === 'property' || item.category === 'business') {
    return Math.max(1, Math.round(Math.pow(price / 100_000, 0.58)));
  }
  return Math.max(0, Math.round(Math.pow(price / 250_000, 0.5)));
}

/**
 * Calculates current town tourism revenue based on town population and fame.
 */
export function calculateTownTourismSnapshot(famePoints: number, townPopulation: number, townHappiness: number) {
  if (townPopulation < 10) {
    return {
      touristsPerDay: 0,
      tourismRevenuePerSec: 0,
      attractionRating: 'Quiet Outpost',
    };
  }

  const fameFactor = Math.log10(Math.max(10, famePoints + 10)); // 1 to 5.5
  const happinessMultiplier = Math.max(0.5, townHappiness / 100);
  const touristsPerDay = Math.round(townPopulation * 0.12 * fameFactor * happinessMultiplier);
  const tourismRevenuePerSec = Math.round(touristsPerDay * 0.45);

  let attractionRating = 'Local Curiosity';
  if (famePoints >= 100_000) attractionRating = 'World Cultural Wonder 🌟';
  else if (famePoints >= 25_000) attractionRating = 'International Hotspot ✈️';
  else if (famePoints >= 5_000) attractionRating = 'National Destination 🏖️';
  else if (famePoints >= 500) attractionRating = 'Regional Tourism Magnet 🏛️';

  return {
    touristsPerDay,
    tourismRevenuePerSec,
    attractionRating,
  };
}

/**
 * Calculates player rank on the Forbes Titan Leaderboard.
 */
export function calculateForbesRank(playerNetWorth: number, playerFame: number): { rank: number; aheadOf: string; behind: string } {
  const all = [...FORBES_TITANS];
  let rank = 1;
  for (const titan of all) {
    if (playerNetWorth < titan.netWorth) {
      rank++;
    }
  }

  const behind = rank > 1 ? FORBES_TITANS[rank - 2]?.name || 'Elon Musk' : 'None (You are #1!)';
  const aheadOf = rank <= FORBES_TITANS.length ? FORBES_TITANS[rank - 1]?.name || 'Steve Ballmer' : 'The Rest of the World';

  return { rank, aheadOf, behind };
}
