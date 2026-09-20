// Card District Synergy Passives ("Executive Display Deck")

export interface DeckSynergies {
  revenueMultiplier: number;
  workMultiplier: number;
  businessMultiplier: number;
  holdingsDiscount: number;
}

const DECK_KEY = 'sia_executive_card_deck_v1';

export function loadExecutiveDeck(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DECK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export function saveExecutiveDeck(deck: string[]): string[] {
  const cleaned = deck.slice(0, 3);
  if (typeof window !== 'undefined') {
    localStorage.setItem(DECK_KEY, JSON.stringify(cleaned));
  }
  return cleaned;
}

export function slotCardIntoDeck(cardId: string, slotIndex: number): string[] {
  const current = loadExecutiveDeck();
  const next = [...current];
  // Remove card if it was already in another slot
  const existingIdx = next.indexOf(cardId);
  if (existingIdx !== -1) {
    next.splice(existingIdx, 1);
  }
  next[slotIndex] = cardId;
  return saveExecutiveDeck(next.filter(Boolean));
}

export function removeCardFromDeck(slotIndex: number): string[] {
  const current = loadExecutiveDeck();
  const next = [...current];
  next.splice(slotIndex, 1);
  return saveExecutiveDeck(next);
}

/**
 * Returns synergy multipliers based on cards slotted in the Executive Deck
 */
export function calculateDeckSynergies(deck: string[]): DeckSynergies {
  let revenueBonus = 0;
  let workBonus = 0;
  let businessBonus = 0;
  let discountBonus = 0;

  for (const cardId of deck) {
    if (!cardId) continue;
    const lower = cardId.toLowerCase();
    if (lower.includes('slime') || lower.includes('001')) {
      revenueBonus += 0.04; // +4% global revenue
    } else if (lower.includes('cat') || lower.includes('raccoon') || lower.includes('otter') || lower.includes('004') || lower.includes('002') || lower.includes('006')) {
      workBonus += 0.08; // +8% work/freelance payout
    } else if (lower.includes('bot') || lower.includes('robot') || lower.includes('espresso') || lower.includes('008')) {
      businessBonus += 0.06; // +6% business efficiency
    } else if (lower.includes('wolf') || lower.includes('badger') || lower.includes('017') || lower.includes('014')) {
      discountBonus += 0.04; // -4% asset prices
    } else if (lower.includes('moon') || lower.includes('owl') || lower.includes('singularity') || lower.includes('021') || lower.includes('023') || lower.includes('024')) {
      revenueBonus += 0.08; // +8% celestial prestige revenue
    } else {
      revenueBonus += 0.03; // generic card bonus
    }
  }

  return {
    revenueMultiplier: 1 + revenueBonus,
    workMultiplier: 1 + workBonus,
    businessMultiplier: 1 + businessBonus,
    holdingsDiscount: Math.max(0.75, 1 - discountBonus),
  };
}
