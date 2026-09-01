import type { CardDeckBlueprint, CardShopProduct } from '@/game/card-shop-types';

export const cardDeckBlueprints: CardDeckBlueprint[] = [
  { id:'deck-cashflow', name:'Cashflow Crew', emoji:'💵', description:'A collection build centered on coin affinity, collectors, and dependable economic characters.', style:'Steady value and collection pressure', recommendedAffinities:['coin'], recommendedArchetypes:['collector','builder'], targetSize:12 },
  { id:'deck-hustle', name:'Hustle Shift', emoji:'🧰', description:'Work-heavy characters built around activity, timing, and high-hustle personalities.', style:'Fast active-play tempo', recommendedAffinities:['work','tech'], recommendedArchetypes:['builder','engineer'], targetSize:12 },
  { id:'deck-market', name:'Market Mischief', emoji:'📈', description:'Market and risk characters for a future volatile, trick-heavy card strategy.', style:'Volatility, luck, and disruption', recommendedAffinities:['market','risk'], recommendedArchetypes:['trickster','scout'], targetSize:12 },
  { id:'deck-cosmic', name:'Cosmic Expansion', emoji:'🪐', description:'Travel and cosmic characters aimed at late-game exploration and rare collection builds.', style:'Late-game scaling and discovery', recommendedAffinities:['travel','cosmic'], recommendedArchetypes:['scout','mystic'], targetSize:12 },
];

export const cardShopProducts: CardShopProduct[] = [
  { id:'pack-street', kind:'pack', name:'Street Pack', emoji:'🛍️', description:'Five Gen 1 cards with one guaranteed Uncommon or better.', priceCredits:100, cardCount:5, accent:'starter', guarantee:{ minRarity:'uncommon' }, featured:true },
  { id:'pack-hustle', kind:'pack', name:'Hustle Pack', emoji:'⚡', description:'Six cards biased toward Work and Tech, with one guaranteed Rare or better.', priceCredits:225, cardCount:6, accent:'work', guarantee:{ minRarity:'rare', affinity:['work','tech'] } },
  { id:'pack-market', kind:'pack', name:'Risk & Market Pack', emoji:'📊', description:'Six cards biased toward Market and Risk characters. Rare+ guaranteed.', priceCredits:250, cardCount:6, accent:'risk', guarantee:{ minRarity:'rare', affinity:['market','risk'] } },
  { id:'pack-cosmic', kind:'pack', name:'Cosmic Pack', emoji:'🌌', description:'Six cards biased toward Travel and Cosmic characters. Rare+ guaranteed.', priceCredits:300, cardCount:6, accent:'cosmic', guarantee:{ minRarity:'rare', affinity:['travel','cosmic'] } },
  { id:'pack-holo-vault', kind:'pack', name:'Holo Vault', emoji:'💿', description:'Five cards with much higher foil, holo, glitch, and gold variant odds.', priceCredits:400, cardCount:5, accent:'holo', guarantee:{ minRarity:'uncommon', variantBoost:3.5 }, featured:true },
  { id:'pack-origin-box', kind:'pack', name:'Origin Collector Box', emoji:'📦', description:'Twelve Gen 1 cards with one guaranteed Epic or better.', priceCredits:600, cardCount:12, accent:'origin', guarantee:{ minRarity:'epic' } },

  { id:'kit-cashflow', kind:'deck-kit', name:'Cashflow Crew Kit', emoji:'💵', description:'Unlocks the Cashflow Crew blueprint and opens eight Coin/Collector-focused cards.', priceCredits:500, cardCount:8, accent:'coin', guarantee:{ minRarity:'rare', affinity:['coin'], archetype:['collector','builder'] }, deckBlueprintId:'deck-cashflow' },
  { id:'kit-hustle', kind:'deck-kit', name:'Hustle Shift Kit', emoji:'🧰', description:'Unlocks the Hustle Shift blueprint and opens eight Work/Tech cards.', priceCredits:525, cardCount:8, accent:'work', guarantee:{ minRarity:'rare', affinity:['work','tech'], archetype:['builder','engineer'] }, deckBlueprintId:'deck-hustle' },
  { id:'kit-market', kind:'deck-kit', name:'Market Mischief Kit', emoji:'🐍', description:'Unlocks Market Mischief and opens eight Market/Risk cards.', priceCredits:575, cardCount:8, accent:'risk', guarantee:{ minRarity:'rare', affinity:['market','risk'], archetype:['trickster','scout'] }, deckBlueprintId:'deck-market' },
  { id:'kit-cosmic', kind:'deck-kit', name:'Cosmic Expansion Kit', emoji:'🛰️', description:'Unlocks Cosmic Expansion and opens eight Travel/Cosmic cards.', priceCredits:650, cardCount:8, accent:'cosmic', guarantee:{ minRarity:'rare', affinity:['travel','cosmic'], archetype:['scout','mystic'] }, deckBlueprintId:'deck-cosmic' },
];

export const CARD_SHOP_FREE_PACK_COOLDOWN_MS = 20 * 60_000;
export const CARD_SHOP_STARTER_CREDITS = 350;
