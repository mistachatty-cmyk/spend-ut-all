/**
 * Forbes List — optional rivalry add-on.
 *
 * Off by default. When enabled, a roster of oligarchs, entrepreneurs and
 * other famous rich people compounds their own net worth in the background
 * while the player plays, so the Forbes rank in FameView is a live race
 * instead of a static scoreboard. Turning it off (or never turning it on)
 * costs nothing — `advanceForbesList` is a no-op unless `enabled` is true.
 */

export type ForbesRivalCategory =
  | 'tech'
  | 'finance'
  | 'luxury'
  | 'industrial'
  | 'media'
  | 'crypto'
  | 'royalty'
  | 'wildcard';

export type ForbesRivalDef = {
  id: string;
  name: string;
  title: string;
  domain: string;
  emoji: string;
  badgeColor: string;
  category: ForbesRivalCategory;
  baseNetWorth: number;
  /** Fractional compounding growth applied per real-time minute of play. */
  growthPerMinute: number;
  /** Amplitude of the random walk applied on top of the drift, per minute. */
  volatility: number;
  /** Net worth never drifts below this fraction of baseNetWorth. */
  floorRatio: number;
  overtakenQuote: string;
  overtookBackQuote: string;
  fictional?: boolean;
};

export const FORBES_RIVALS: ForbesRivalDef[] = [
  // --- The established titans (also referenced by the legacy static FORBES_TITANS list) ---
  { id: 'elon-musk-rival', name: 'Elon Musk', title: 'Starship Fleet & Mars Visionary', domain: 'Aerospace / EV / AI', emoji: '🚀', badgeColor: '#ec4899', category: 'tech', baseNetWorth: 1_000_000_000_000, growthPerMinute: 0.0021, volatility: 0.05, floorRatio: 0.35, overtakenQuote: '"Interesting. I\'ll just tweet about it and recover by lunch."', overtookBackQuote: 'Elon Musk reclaims the top spot after a midnight rocket launch sends the stock soaring.' },
  { id: 'jeff-bezos-rival', name: 'Jeff Bezos', title: 'Orbital Manufacturing & Global Logistics', domain: 'E-commerce / Aerospace', emoji: '📦', badgeColor: '#f59e0b', category: 'industrial', baseNetWorth: 500_000_000_000, growthPerMinute: 0.0015, volatility: 0.04, floorRatio: 0.4, overtakenQuote: '"Day 1 mentality. We\'ll ship past you by next quarter."', overtookBackQuote: 'Jeff Bezos retakes a spot on Prime Day logistics volume alone.' },
  { id: 'bill-gates-rival', name: 'Bill Gates', title: 'Planetary Philanthropy & Clean Energy', domain: 'Software / Philanthropy', emoji: '💉', badgeColor: '#0284c7', category: 'tech', baseNetWorth: 300_000_000_000, growthPerMinute: 0.0009, volatility: 0.02, floorRatio: 0.55, overtakenQuote: '"Patience compounds. I\'ll be back on top eventually."', overtookBackQuote: 'Bill Gates edges back ahead as a decades-old software royalty check clears.' },
  { id: 'bernard-arnault-rival', name: 'Bernard Arnault', title: 'Haute Horlogerie & Luxury Dynasty', domain: 'Luxury Goods', emoji: '💎', badgeColor: '#8b5cf6', category: 'luxury', baseNetWorth: 215_000_000_000, growthPerMinute: 0.0013, volatility: 0.045, floorRatio: 0.4, overtakenQuote: '"People will still drink Dom Pérignon after you\'ve bankrupted yourself."', overtookBackQuote: 'Bernard Arnault surges past on a blowout luxury-goods quarter.' },
  { id: 'mark-zuckerberg-rival', name: 'Mark Zuckerberg', title: 'Social Graph & AI Superclusters', domain: 'Social Media / AI', emoji: '🕶️', badgeColor: '#3b82f6', category: 'tech', baseNetWorth: 195_000_000_000, growthPerMinute: 0.0019, volatility: 0.06, floorRatio: 0.3, overtakenQuote: '"Move fast. I\'ll build past you."', overtookBackQuote: 'Mark Zuckerberg jumps back ahead after an AI model release pops the stock.' },
  { id: 'larry-ellison-rival', name: 'Larry Ellison', title: 'Cloud Infrastructure & Hawaiian Havens', domain: 'Enterprise Software', emoji: '⛵', badgeColor: '#06b6d4', category: 'tech', baseNetWorth: 175_000_000_000, growthPerMinute: 0.0014, volatility: 0.05, floorRatio: 0.4, overtakenQuote: '"I had all the disadvantages required for success. You have none of mine."', overtookBackQuote: 'Larry Ellison retakes the lead on a cloud-contract renewal spree.' },
  { id: 'warren-buffett-rival', name: 'Warren Buffett', title: 'The Oracle of Compounding', domain: 'Value Investing', emoji: '📈', badgeColor: '#10b981', category: 'finance', baseNetWorth: 145_000_000_000, growthPerMinute: 0.0007, volatility: 0.015, floorRatio: 0.65, overtakenQuote: '"Rule No. 1: never lose money. Rule No. 2: see Rule No. 1."', overtookBackQuote: 'Warren Buffett grinds back ahead through pure, boring compound interest.' },
  { id: 'jensen-huang-rival', name: 'Jensen Huang', title: 'Accelerated Silicon Architecture', domain: 'AI Compute / GPUs', emoji: '🧥', badgeColor: '#84cc16', category: 'tech', baseNetWorth: 130_000_000_000, growthPerMinute: 0.0024, volatility: 0.07, floorRatio: 0.3, overtakenQuote: '"The more you buy, the more I save. The more I save, the more I lap you."', overtookBackQuote: 'Jensen Huang leapfrogs back ahead on a new GPU architecture reveal.' },
  { id: 'steve-ballmer-rival', name: 'Steve Ballmer', title: 'Courtside Energy & Tech Holdings', domain: 'Sports / Tech Holdings', emoji: '🏀', badgeColor: '#f97316', category: 'media', baseNetWorth: 125_000_000_000, growthPerMinute: 0.0011, volatility: 0.04, floorRatio: 0.45, overtakenQuote: '"DEVELOPERS! DEVELOPERS! I will be back, and LOUDER."', overtookBackQuote: 'Steve Ballmer roars back ahead on a league broadcast-rights windfall.' },
  { id: 'larry-page-rival', name: 'Larry Page', title: 'Planetary Algorithmic Index', domain: 'Search / Alphabet', emoji: '🔍', badgeColor: '#2563eb', category: 'tech', baseNetWorth: 120_000_000_000, growthPerMinute: 0.0016, volatility: 0.045, floorRatio: 0.4, overtakenQuote: '"Google it. The answer is I\'m not done yet."', overtookBackQuote: 'Larry Page climbs back as an ad-revenue quarter beats every estimate.' },

  // --- The wider field (real-world entrepreneurs & oligarchs not yet represented) ---
  { id: 'sergey-brin-rival', name: 'Sergey Brin', title: 'Co-Founder & Moonshot Backer', domain: 'Search / Deep Tech', emoji: '🛰️', badgeColor: '#1d4ed8', category: 'tech', baseNetWorth: 115_000_000_000, growthPerMinute: 0.0016, volatility: 0.045, floorRatio: 0.4, overtakenQuote: '"Moonshots take time. Don\'t get comfortable."', overtookBackQuote: 'Sergey Brin edges ahead on a quiet deep-tech stake revaluation.' },
  { id: 'mukesh-ambani-rival', name: 'Mukesh Ambani', title: 'Conglomerate Sovereign of Reliance', domain: 'Telecom / Petrochemicals / Retail', emoji: '🏭', badgeColor: '#dc2626', category: 'industrial', baseNetWorth: 115_000_000_000, growthPerMinute: 0.0017, volatility: 0.04, floorRatio: 0.45, overtakenQuote: '"India has a billion more customers than you have dollars."', overtookBackQuote: 'Mukesh Ambani surges back on a telecom subscriber record.' },
  { id: 'carlos-slim-rival', name: 'Carlos Slim Helú', title: 'Telecom & Infrastructure Patriarch', domain: 'Telecom / Real Estate', emoji: '📡', badgeColor: '#991b1b', category: 'industrial', baseNetWorth: 100_000_000_000, growthPerMinute: 0.0012, volatility: 0.03, floorRatio: 0.5, overtakenQuote: '"A low price today is a fortune tomorrow."', overtookBackQuote: 'Carlos Slim reclaims ground on a telecom-infrastructure buyout.' },
  { id: 'bettencourt-meyers-rival', name: 'Françoise Bettencourt Meyers', title: "L'Oréal Beauty Dynasty Heiress", domain: 'Cosmetics / Luxury', emoji: '💄', badgeColor: '#be185d', category: 'luxury', baseNetWorth: 95_000_000_000, growthPerMinute: 0.0013, volatility: 0.035, floorRatio: 0.5, overtakenQuote: '"Beauty compounds quietly. So does my fortune."', overtookBackQuote: "Françoise Bettencourt Meyers climbs back on a global cosmetics launch." },
  { id: 'michael-bloomberg-rival', name: 'Michael Bloomberg', title: 'Financial Media Terminal Magnate', domain: 'Financial Data / Media', emoji: '📊', badgeColor: '#0f172a', category: 'media', baseNetWorth: 90_000_000_000, growthPerMinute: 0.0012, volatility: 0.03, floorRatio: 0.5, overtakenQuote: '"Every trading desk on Earth still pays me rent."', overtookBackQuote: 'Michael Bloomberg surges on renewed terminal subscriptions.' },
  { id: 'rupert-murdoch-rival', name: 'Rupert Murdoch', title: 'Global Media Empire Chairman', domain: 'News / Broadcast', emoji: '📰', badgeColor: '#78350f', category: 'media', baseNetWorth: 85_000_000_000, growthPerMinute: 0.0008, volatility: 0.03, floorRatio: 0.45, overtakenQuote: '"The headlines will outlast your spending spree."', overtookBackQuote: 'Rupert Murdoch edges back ahead on a cable-rights renewal.' },
  { id: 'gautam-adani-rival', name: 'Gautam Adani', title: 'Ports, Power & Infrastructure Baron', domain: 'Infrastructure / Energy', emoji: '⚡', badgeColor: '#16a34a', category: 'industrial', baseNetWorth: 90_000_000_000, growthPerMinute: 0.002, volatility: 0.09, floorRatio: 0.25, overtakenQuote: '"Infrastructure moves slow. My comebacks don\'t."', overtookBackQuote: 'Gautam Adani rockets back after a port-expansion announcement.' },
  { id: 'mackenzie-scott-rival', name: 'MacKenzie Scott', title: 'Philanthropic Capital Allocator', domain: 'Philanthropy / Index Holdings', emoji: '🎗️', badgeColor: '#0d9488', category: 'finance', baseNetWorth: 45_000_000_000, growthPerMinute: 0.001, volatility: 0.03, floorRatio: 0.5, overtakenQuote: '"I give mine away faster than you can spend yours."', overtookBackQuote: "MacKenzie Scott's index holdings quietly compound back into the lead pack." },
  { id: 'zhang-yiming-rival', name: 'Zhang Yiming', title: 'Short-Form Attention Algorithm Architect', domain: 'Social Media / AI', emoji: '📱', badgeColor: '#000000', category: 'tech', baseNetWorth: 55_000_000_000, growthPerMinute: 0.002, volatility: 0.08, floorRatio: 0.3, overtakenQuote: '"The algorithm already knows you\'ll lose this spot."', overtookBackQuote: 'Zhang Yiming surges back on a record global user-growth report.' },
  { id: 'phil-knight-rival', name: 'Phil Knight', title: 'Swoosh Sportswear Founder', domain: 'Apparel / Sports', emoji: '👟', badgeColor: '#f97316', category: 'luxury', baseNetWorth: 40_000_000_000, growthPerMinute: 0.0009, volatility: 0.03, floorRatio: 0.5, overtakenQuote: '"Just do it — win it back, I mean."', overtookBackQuote: 'Phil Knight climbs back on a blockbuster sneaker drop.' },
  { id: 'jim-walton-rival', name: 'Jim Walton', title: 'Retail Dynasty Heir', domain: 'Retail / Banking', emoji: '🛒', badgeColor: '#2563eb', category: 'industrial', baseNetWorth: 100_000_000_000, growthPerMinute: 0.0008, volatility: 0.02, floorRatio: 0.55, overtakenQuote: '"Everyday low prices. Everyday high patience."', overtookBackQuote: 'Jim Walton edges back ahead on a quiet retail dividend.' },
  { id: 'charles-koch-rival', name: 'Charles Koch', title: 'Industrial Conglomerate Chairman', domain: 'Industrial / Energy', emoji: '🏗️', badgeColor: '#57534e', category: 'industrial', baseNetWorth: 65_000_000_000, growthPerMinute: 0.0009, volatility: 0.025, floorRatio: 0.5, overtakenQuote: '"Markets reward patience. I have an abundance of it."', overtookBackQuote: 'Charles Koch climbs back on a diversified industrial rebound.' },
  { id: 'michael-dell-rival', name: 'Michael Dell', title: 'Enterprise Hardware Pioneer', domain: 'Computing Hardware', emoji: '🖥️', badgeColor: '#4338ca', category: 'tech', baseNetWorth: 70_000_000_000, growthPerMinute: 0.0013, volatility: 0.04, floorRatio: 0.45, overtakenQuote: '"I built an empire from a dorm room. I can rebuild a lead."', overtookBackQuote: 'Michael Dell surges back on an enterprise hardware upgrade cycle.' },
  { id: 'cz-rival', name: 'Changpeng "CZ" Zhao', title: 'Crypto Exchange Architect', domain: 'Cryptocurrency', emoji: '🪙', badgeColor: '#eab308', category: 'crypto', baseNetWorth: 35_000_000_000, growthPerMinute: 0.0026, volatility: 0.14, floorRatio: 0.15, overtakenQuote: '"Funds are safu. My rank, less so — for now."', overtookBackQuote: 'A crypto rally sends CZ rocketing back up the board overnight.' },

  // --- Wildcard rivals invented for this game's universe ---
  { id: 'magnus-veldt', name: 'Magnus Veldt', title: 'Supertanker Shipping Oligarch', domain: 'Global Freight & Shipping', emoji: '🚢', badgeColor: '#0891b2', category: 'wildcard', baseNetWorth: 60_000_000_000, growthPerMinute: 0.0015, volatility: 0.05, floorRatio: 0.4, overtakenQuote: '"Every container on Earth still pays me a toll."', overtookBackQuote: 'Magnus Veldt surges back after cornering a key shipping lane.', fictional: true },
  { id: 'seraphine-okonkwo-lindqvist', name: 'Seraphine Okonkwo-Lindqvist', title: 'Green-Energy Empress', domain: 'Renewable Energy Grids', emoji: '🌿', badgeColor: '#15803d', category: 'wildcard', baseNetWorth: 48_000_000_000, growthPerMinute: 0.0018, volatility: 0.06, floorRatio: 0.35, overtakenQuote: '"Clean power compounds. So does clean profit."', overtookBackQuote: 'Seraphine Okonkwo-Lindqvist climbs back on a continental grid contract.', fictional: true },
  { id: 'dmitri-voss', name: 'Dmitri Voss', title: 'Orbital Mining Baron', domain: 'Asteroid & Orbital Resources', emoji: '☄️', badgeColor: '#7c2d12', category: 'wildcard', baseNetWorth: 52_000_000_000, growthPerMinute: 0.0022, volatility: 0.1, floorRatio: 0.25, overtakenQuote: '"You\'re still mining Earth. I\'m mining the sky."', overtookBackQuote: 'Dmitri Voss rockets back up after a successful orbital ore haul.', fictional: true },
];

export type ForbesRankEvent = {
  id: string;
  rivalId: string;
  rivalName: string;
  kind: 'overtook' | 'overtakenBy' | 'newLeader';
  rank: number;
  timestamp: number;
  message: string;
};

export type ForbesRivalRuntime = {
  netWorth: number;
};

export type ForbesListState = {
  enabled: boolean;
  startedAt: number;
  rivals: Record<string, ForbesRivalRuntime>;
  playerRank: number;
  bestPlayerRank: number;
  events: ForbesRankEvent[];
  everOvertakenIds: string[];
  reachedNumberOneAt: number | null;
};

const MAX_EVENTS = 20;

export function createForbesListState(now = Date.now()): ForbesListState {
  const rivals: Record<string, ForbesRivalRuntime> = {};
  for (const rival of FORBES_RIVALS) rivals[rival.id] = { netWorth: rival.baseNetWorth };
  return {
    enabled: false,
    startedAt: now,
    rivals,
    playerRank: FORBES_RIVALS.length + 1,
    bestPlayerRank: FORBES_RIVALS.length + 1,
    events: [],
    everOvertakenIds: [],
    reachedNumberOneAt: null,
  };
}

function finite(value: unknown, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

export function normalizeForbesListState(input?: Partial<ForbesListState> | null, now = Date.now()): ForbesListState {
  const base = createForbesListState(now);
  const rivals: Record<string, ForbesRivalRuntime> = {};
  for (const rival of FORBES_RIVALS) {
    const saved = input?.rivals?.[rival.id];
    const netWorth = Math.max(rival.baseNetWorth * rival.floorRatio, finite(saved?.netWorth, rival.baseNetWorth));
    rivals[rival.id] = { netWorth };
  }
  return {
    ...base,
    enabled: input?.enabled ?? base.enabled,
    startedAt: finite(input?.startedAt, base.startedAt) || now,
    rivals,
    playerRank: Math.max(1, Math.floor(finite(input?.playerRank, base.playerRank))),
    bestPlayerRank: Math.max(1, Math.floor(finite(input?.bestPlayerRank, base.bestPlayerRank))),
    events: Array.isArray(input?.events) ? input!.events.slice(0, MAX_EVENTS) : [],
    everOvertakenIds: Array.isArray(input?.everOvertakenIds) ? [...new Set(input!.everOvertakenIds.filter((id) => typeof id === 'string'))] : [],
    reachedNumberOneAt: input?.reachedNumberOneAt == null ? null : finite(input.reachedNumberOneAt),
  };
}

function rivalById(id: string) {
  return FORBES_RIVALS.find((r) => r.id === id);
}

export type ForbesStanding = {
  id: string;
  rank: number;
  name: string;
  netWorth: number;
  emoji: string;
  badgeColor: string;
  title: string;
  domain: string;
  fictional: boolean;
  isPlayer: boolean;
};

export function computeForbesStandings(forbesList: ForbesListState, playerNetWorth: number, playerName: string): ForbesStanding[] {
  const rivalEntries: ForbesStanding[] = FORBES_RIVALS.map((def) => ({
    id: def.id,
    rank: 0,
    name: def.name,
    netWorth: forbesList.rivals[def.id]?.netWorth ?? def.baseNetWorth,
    emoji: def.emoji,
    badgeColor: def.badgeColor,
    title: def.title,
    domain: def.domain,
    fictional: !!def.fictional,
    isPlayer: false,
  }));
  const playerEntry: ForbesStanding = {
    id: '__player__',
    rank: 0,
    name: playerName,
    netWorth: playerNetWorth,
    emoji: '⭐',
    badgeColor: '#059669',
    title: 'Your Fortune',
    domain: 'You',
    fictional: false,
    isPlayer: true,
  };
  return [...rivalEntries, playerEntry]
    .sort((a, b) => b.netWorth - a.netWorth)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

/**
 * Advances every rival's net worth by `deltaMs` of real play time, then
 * recomputes the player's rank and records overtake events. No-ops when the
 * add-on isn't enabled, so leaving it off never costs a tick.
 */
export function advanceForbesList(forbesList: ForbesListState, deltaMs: number, playerNetWorth: number, now = Date.now()): ForbesListState {
  if (!forbesList.enabled || deltaMs <= 0) return forbesList;
  const minutes = deltaMs / 60_000;

  const rivals: Record<string, ForbesRivalRuntime> = {};
  for (const def of FORBES_RIVALS) {
    const prev = forbesList.rivals[def.id]?.netWorth ?? def.baseNetWorth;
    const drift = prev * def.growthPerMinute * minutes;
    const jitter = prev * def.volatility * (Math.random() - 0.5) * Math.sqrt(Math.max(minutes, 0));
    const next = Math.max(def.baseNetWorth * def.floorRatio, prev + drift + jitter);
    rivals[def.id] = { netWorth: next };
  }

  const standings = computeForbesStandings({ ...forbesList, rivals }, playerNetWorth, 'you');
  const playerStanding = standings.find((s) => s.isPlayer)!;
  const nextRank = playerStanding.rank;
  const prevRank = forbesList.playerRank;

  const events: ForbesRankEvent[] = [];
  if (nextRank < prevRank) {
    // Player climbed — find who they just passed (the rival now directly behind them).
    const passed = standings.find((s) => !s.isPlayer && s.rank === nextRank + 1);
    if (passed) {
      const def = rivalById(passed.id);
      events.push({
        id: `overtook-${passed.id}-${now}`,
        rivalId: passed.id,
        rivalName: passed.name,
        kind: nextRank === 1 ? 'newLeader' : 'overtook',
        rank: nextRank,
        timestamp: now,
        message: nextRank === 1
          ? `You just became the #1 fortune on the Forbes List, overtaking ${passed.name}.`
          : `You overtook ${passed.name} — now ranked #${nextRank} on the Forbes List.${def ? ` "${def.overtakenQuote}"` : ''}`,
      });
    }
  } else if (nextRank > prevRank) {
    // Player slipped — find who just passed them.
    const passer = standings.find((s) => !s.isPlayer && s.rank === nextRank);
    if (passer) {
      const def = rivalById(passer.id);
      events.push({
        id: `overtakenby-${passer.id}-${now}`,
        rivalId: passer.id,
        rivalName: passer.name,
        kind: 'overtakenBy',
        rank: nextRank,
        timestamp: now,
        message: `${passer.name} overtook you — you've slipped to #${nextRank}.${def ? ` ${def.overtookBackQuote}` : ''}`,
      });
    }
  }

  const everOvertakenIds = new Set(forbesList.everOvertakenIds);
  if (nextRank < prevRank) {
    for (const s of standings) {
      if (!s.isPlayer && s.rank > nextRank) everOvertakenIds.add(s.id);
    }
  }

  return {
    ...forbesList,
    rivals,
    playerRank: nextRank,
    bestPlayerRank: Math.min(forbesList.bestPlayerRank, nextRank),
    events: [...events, ...forbesList.events].slice(0, MAX_EVENTS),
    everOvertakenIds: Array.from(everOvertakenIds),
    reachedNumberOneAt: forbesList.reachedNumberOneAt ?? (nextRank === 1 ? now : null),
  };
}
