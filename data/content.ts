import { GameItem, HouseTier, Scenario } from '@/game/types';

export const scenarios: Scenario[] = [
  { id: 'freeplay', name: 'Millionaire Sandbox', description: 'Start with $10M and grow from purchases into an empire.', startingCash: 10_000_000 },
  { id: 'billionaire', name: 'Billionaire Run', description: 'Start with $100B. Spend it, invest it, and build something bigger.', startingCash: 100_000_000_000 },
  { id: 'trillionaire', name: 'Trillionaire Run', description: 'Extreme scale with megaprojects unlocked much earlier.', startingCash: 1_000_000_000_000 },
];

export const items: GameItem[] = [
  { id: 'coffee', name: 'Coffee', emoji: '☕', category: 'everyday', basePrice: 6, growthRate: 1, description: 'A very small dent in an enormous fortune.' },
  { id: 'phone', name: 'Flagship Phone', emoji: '📱', category: 'everyday', basePrice: 1_200, growthRate: 1.01, description: 'Buy one, or buy an unreasonable number.' },
  { id: 'gaming-pc', name: 'Gaming PC', emoji: '🖥️', category: 'everyday', basePrice: 4_000, growthRate: 1.015, description: 'Top-tier hardware.' },
  { id: 'supercar', name: 'Supercar', emoji: '🏎️', category: 'luxury', basePrice: 350_000, growthRate: 1.025, upkeepPerSecond: 0.08, unlockSpent: 100_000, description: 'Fast, expensive, and increasingly difficult to store.' },
  { id: 'private-jet', name: 'Private Jet', emoji: '✈️', category: 'luxury', basePrice: 65_000_000, growthRate: 1.035, upkeepPerSecond: 18, unlockSpent: 5_000_000, description: 'Convenience at an industrial operating cost.' },
  { id: 'starter-home', name: 'Starter Home', emoji: '🏠', category: 'property', basePrice: 450_000, growthRate: 1.04, incomePerSecond: 1.2, upkeepPerSecond: 0.12, unlockSpent: 50_000, description: 'A real asset that can appreciate into a larger property portfolio.' },
  { id: 'apartments', name: 'Apartment Building', emoji: '🏢', category: 'property', basePrice: 8_000_000, growthRate: 1.055, incomePerSecond: 28, upkeepPerSecond: 6, unlockSpent: 1_000_000, description: 'Rental cash flow and the beginning of a real-estate empire.' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️', category: 'business', basePrice: 650_000, growthRate: 1.06, incomePerSecond: 7, upkeepPerSecond: 2.5, unlockSpent: 250_000, description: 'An operating business with both revenue and costs.' },
  { id: 'software-company', name: 'Software Company', emoji: '💻', category: 'business', basePrice: 12_000_000, growthRate: 1.07, incomePerSecond: 95, upkeepPerSecond: 24, unlockSpent: 2_000_000, description: 'High-margin growth if you can afford the team.' },
  { id: 'skyscraper', name: 'Skyscraper', emoji: '🏙️', category: 'property', basePrice: 700_000_000, growthRate: 1.08, incomePerSecond: 1_900, upkeepPerSecond: 450, unlockSpent: 100_000_000, description: 'A skyline-defining commercial asset.' },
  { id: 'sports-team', name: 'Pro Sports Franchise', emoji: '🏟️', category: 'business', basePrice: 6_000_000_000, growthRate: 1.1, incomePerSecond: 8_500, upkeepPerSecond: 3_000, unlockSpent: 500_000_000, description: 'Prestige, media rights, payroll, and huge operating scale.' },
  { id: 'space-program', name: 'Private Space Program', emoji: '🚀', category: 'infrastructure', basePrice: 30_000_000_000, growthRate: 1.12, incomePerSecond: 35_000, upkeepPerSecond: 18_000, unlockSpent: 3_000_000_000, description: 'The first bridge from billionaire toys to civilization-scale projects.' },
  { id: 'megacity', name: 'Megacity Development', emoji: '🌆', category: 'infrastructure', basePrice: 250_000_000_000, growthRate: 1.15, incomePerSecond: 500_000, upkeepPerSecond: 175_000, unlockSpent: 25_000_000_000, description: 'Housing, transit, utilities, business districts, and millions of residents.' },
];

export const houseTiers: HouseTier[] = [
  { level: 0, name: 'No Home', cost: 0, requiredNetWorth: 0, rooms: 0, description: 'Buy your first permanent home.' },
  { level: 1, name: 'Starter Home', cost: 250_000, requiredNetWorth: 250_000, rooms: 4, description: 'Bedroom, kitchen, bathroom, and living room.' },
  { level: 2, name: 'Modern House', cost: 2_000_000, requiredNetWorth: 3_000_000, rooms: 8, description: 'Adds office, garage, gym, and entertainment space.' },
  { level: 3, name: 'Estate', cost: 15_000_000, requiredNetWorth: 25_000_000, rooms: 16, description: 'Room for collections, staff, workshops, and guest buildings.' },
  { level: 4, name: 'Mansion Compound', cost: 120_000_000, requiredNetWorth: 250_000_000, rooms: 32, description: 'A private compound that can anchor a neighborhood.' },
  { level: 5, name: 'Town Founder Estate', cost: 1_000_000_000, requiredNetWorth: 2_500_000_000, rooms: 50, description: 'Unlocks the future town-building layer.' },
];
