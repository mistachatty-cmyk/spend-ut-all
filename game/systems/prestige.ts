// Generational Legacy / Prestige ("Family Office") System

export interface PrestigePerks {
  gildedHeritage: number; // +5% global revenue per level (max 10)
  trustFund: number;      // +$15,000 starting cash on every future run per level (max 10)
  negotiator: number;     // -3% purchase discount on all items per level (max 10)
  masterOfCoin: number;   // +15% LOK token yield from achievements per level (max 10)
  endowmentVault: number; // +2 hours offline progress duration per level (max 10)
}

export interface PrestigeState {
  dynastyLevel: number;
  dynastyName: string;
  relics: number;
  lifetimeRelics: number;
  timesPrestiged: number;
  perks: PrestigePerks;
}

const PRESTIGE_KEY = 'sia_dynasty_prestige_v1';

export const DYNASTY_TITLES = [
  'First-Generation Founder',
  'Private Wealth Syndicate',
  'Sovereign Family Office',
  'High-Society Dynasty',
  'Planetary Trust & Endowment',
  'Galactic Financial Hegemony',
];

export function getDefaultPrestigeState(): PrestigeState {
  return {
    dynastyLevel: 0,
    dynastyName: 'House of Capital',
    relics: 0,
    lifetimeRelics: 0,
    timesPrestiged: 0,
    perks: {
      gildedHeritage: 0,
      trustFund: 0,
      negotiator: 0,
      masterOfCoin: 0,
      endowmentVault: 0,
    },
  };
}

export function loadPrestigeState(): PrestigeState {
  if (typeof window === 'undefined') return getDefaultPrestigeState();
  try {
    const raw = localStorage.getItem(PRESTIGE_KEY);
    if (!raw) return getDefaultPrestigeState();
    const parsed = JSON.parse(raw);
    return {
      dynastyLevel: Number(parsed.dynastyLevel ?? 0),
      dynastyName: typeof parsed.dynastyName === 'string' ? parsed.dynastyName : 'House of Capital',
      relics: Number(parsed.relics ?? 0),
      lifetimeRelics: Number(parsed.lifetimeRelics ?? 0),
      timesPrestiged: Number(parsed.timesPrestiged ?? 0),
      perks: {
        gildedHeritage: Number(parsed.perks?.gildedHeritage ?? 0),
        trustFund: Number(parsed.perks?.trustFund ?? 0),
        negotiator: Number(parsed.perks?.negotiator ?? 0),
        masterOfCoin: Number(parsed.perks?.masterOfCoin ?? 0),
        endowmentVault: Number(parsed.perks?.endowmentVault ?? 0),
      },
    };
  } catch {
    return getDefaultPrestigeState();
  }
}

export function savePrestigeState(state: PrestigeState): PrestigeState {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRESTIGE_KEY, JSON.stringify(state));
  }
  return state;
}

/**
 * Calculate how many Legacy Relics can be banked from a given net worth
 * Threshold: minimum $500,000 net worth to establish/expand the Family Office
 */
export function calculateRelicsToEarn(netWorth: number): number {
  if (netWorth < 500000) return 0;
  return Math.floor(Math.sqrt((netWorth - 400000) / 40000));
}

export function getPerkCost(currentLevel: number): number {
  return Math.max(1, (currentLevel + 1) * 2);
}

export function upgradePrestigePerk(state: PrestigeState, perkKey: keyof PrestigePerks): { state: PrestigeState; success: boolean } {
  const currentLevel = state.perks[perkKey];
  if (currentLevel >= 10) return { state, success: false };
  const cost = getPerkCost(currentLevel);
  if (state.relics < cost) return { state, success: false };

  const nextState: PrestigeState = {
    ...state,
    relics: state.relics - cost,
    perks: {
      ...state.perks,
      [perkKey]: currentLevel + 1,
    },
  };
  savePrestigeState(nextState);
  return { state: nextState, success: true };
}

export function executeFamilyOfficeAscension(state: PrestigeState, netWorth: number): { state: PrestigeState; relicsEarned: number } {
  const relicsEarned = calculateRelicsToEarn(netWorth);
  if (relicsEarned <= 0) return { state, relicsEarned: 0 };

  const nextState: PrestigeState = {
    ...state,
    dynastyLevel: state.dynastyLevel + 1,
    relics: state.relics + relicsEarned,
    lifetimeRelics: state.lifetimeRelics + relicsEarned,
    timesPrestiged: state.timesPrestiged + 1,
  };
  savePrestigeState(nextState);
  return { state: nextState, relicsEarned };
}

export function getPrestigeMultiplier(perks: PrestigePerks): number {
  return 1 + (perks.gildedHeritage * 0.05); // +5% per level
}

export function getPrestigeStartingCash(perks: PrestigePerks): number {
  return perks.trustFund * 15000; // +$15,000 per level
}

export function getPrestigeDiscount(perks: PrestigePerks): number {
  return Math.max(0.70, 1 - (perks.negotiator * 0.03)); // -3% per level up to 30%
}
