// Daily Economic News & Market Weather System

export interface MarketWeather {
  id: string;
  name: string;
  emoji: string;
  headline: string;
  summary: string;
  incomeMultiplier: number;
  purchaseDiscount: number; // e.g. 0.92 = 8% discount
  categoryBonus?: 'everyday' | 'luxury' | 'property' | 'business' | 'infrastructure';
  categoryMultiplier?: number;
  freelanceMultiplier?: number;
  debtInterestDiscount?: number; // e.g. 0.50 = 50% discount
}

export const MARKET_WEATHER_CONDITIONS: MarketWeather[] = [
  {
    id: 'bull-market',
    name: 'Historic Bull Run',
    emoji: '🐂',
    headline: 'Global markets surge as capital confidence breaks multi-decade records.',
    summary: '+25% revenue across the entire empire and 5% discount on all assets.',
    incomeMultiplier: 1.25,
    purchaseDiscount: 0.95,
  },
  {
    id: 'tech-rally',
    name: 'Silicon & AI Rally',
    emoji: '⚡',
    headline: 'Machine learning infrastructure and tech conglomerates drive massive trading volumes.',
    summary: '+20% global income, with +25% bonus yields specifically for businesses.',
    incomeMultiplier: 1.20,
    purchaseDiscount: 1.0,
    categoryBonus: 'business',
    categoryMultiplier: 1.25,
  },
  {
    id: 'rate-cut',
    name: 'Central Bank Easing',
    emoji: '🏛️',
    headline: 'Federal benchmark rates trimmed, unleashing cheap credit and liquidity.',
    summary: 'Debt interest cut by 50%; -8% purchase discount on all holdings.',
    incomeMultiplier: 1.05,
    purchaseDiscount: 0.92,
    debtInterestDiscount: 0.50,
  },
  {
    id: 'green-subsidy',
    name: 'Infrastructure & Clean Tech Push',
    emoji: '🌱',
    headline: 'Subsidies and municipal clean energy grants launch nationwide.',
    summary: '+35% revenue for Infrastructure holdings and +10% global yield.',
    incomeMultiplier: 1.10,
    purchaseDiscount: 0.94,
    categoryBonus: 'infrastructure',
    categoryMultiplier: 1.35,
  },
  {
    id: 'consumer-frenzy',
    name: 'Consumer Frenzy',
    emoji: '🛍️',
    headline: 'Holiday shopping and retail foot traffic shatter annual projections.',
    summary: '+30% income on Everyday holdings and +12% global cash flow.',
    incomeMultiplier: 1.12,
    purchaseDiscount: 1.0,
    categoryBonus: 'everyday',
    categoryMultiplier: 1.30,
  },
  {
    id: 'high-society-gala',
    name: 'Luxury Auction Gala',
    emoji: '💎',
    headline: 'Private collectors compete aggressively for prestigious trophies and luxury estates.',
    summary: '+28% prestige yields on Luxury assets and -5% acquisition fees.',
    incomeMultiplier: 1.10,
    purchaseDiscount: 0.95,
    categoryBonus: 'luxury',
    categoryMultiplier: 1.28,
  },
  {
    id: 'creative-renaissance',
    name: 'Creative Renaissance',
    emoji: '🎨',
    headline: 'Independent consulting, digital production, and freelance work see unprecedented demand.',
    summary: '+50% payouts on active work, gigs, and freelance contracts.',
    incomeMultiplier: 1.08,
    purchaseDiscount: 1.0,
    freelanceMultiplier: 1.50,
  },
  {
    id: 'venture-boom',
    name: 'Venture Liquidity Wave',
    emoji: '🚀',
    headline: 'Early-stage syndicates deploy reserve dry powder across innovative ventures.',
    summary: '+18% revenue and +15% faster market turnaround.',
    incomeMultiplier: 1.18,
    purchaseDiscount: 0.96,
  },
];

/**
 * Get deterministic daily market weather based on the current in-game day
 */
export function getMarketWeatherForDay(gameDay: number): MarketWeather {
  const safeDay = Math.max(1, Math.floor(gameDay));
  const index = (safeDay - 1) % MARKET_WEATHER_CONDITIONS.length;
  return MARKET_WEATHER_CONDITIONS[index];
}

/**
 * Calculate modified price considering current market weather
 */
export function applyWeatherPriceDiscount(basePrice: number, weather: MarketWeather): number {
  return Math.round(basePrice * weather.purchaseDiscount);
}
