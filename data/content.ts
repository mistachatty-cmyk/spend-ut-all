import { Achievement, GameItem, HouseTier, Scenario, TownTier } from '@/game/types';

export const scenarios: Scenario[] = [
  { id: 'freeplay', name: 'Millionaire Sandbox', description: 'Start with $10M and grow from purchases into an empire.', startingCash: 10_000_000, targetNetWorth: 100_000_000, goalLabel: 'Reach $100M net worth' },
  { id: 'billionaire', name: 'Billionaire Run', description: 'Start with $100B. Spend it, invest it, and build something bigger.', startingCash: 100_000_000_000, targetSpent: 90_000_000_000, goalLabel: 'Spend $90B' },
  { id: 'trillionaire', name: 'Trillionaire Run', description: 'Extreme scale with megaprojects unlocked much earlier.', startingCash: 1_000_000_000_000, targetSpent: 900_000_000_000, goalLabel: 'Spend $900B' },
];

export const items: GameItem[] = [
  { id: 'coffee', name: 'Coffee', emoji: '☕', category: 'everyday', basePrice: 6, growthRate: 1, description: 'A very small dent in an enormous fortune.' },
  { id: 'phone', name: 'Flagship Phone', emoji: '📱', category: 'everyday', basePrice: 1_200, growthRate: 1.01, description: 'Buy one, or buy an unreasonable number.' },
  { id: 'gaming-pc', name: 'Gaming PC', emoji: '🖥️', category: 'everyday', basePrice: 4_000, growthRate: 1.015, description: 'Top-tier hardware.' },
  { id: 'watch', name: 'Luxury Watch', emoji: '⌚', category: 'luxury', basePrice: 35_000, growthRate: 1.02, unlockSpent: 10_000, description: 'A collectible status symbol with almost no practical effect.' },
  { id: 'supercar', name: 'Supercar', emoji: '🏎️', category: 'luxury', basePrice: 350_000, growthRate: 1.025, upkeepPerSecond: 0.08, unlockSpent: 100_000, description: 'Fast, expensive, and increasingly difficult to store.' },
  { id: 'yacht', name: 'Superyacht', emoji: '🛥️', category: 'luxury', basePrice: 180_000_000, growthRate: 1.04, upkeepPerSecond: 45, unlockSpent: 20_000_000, description: 'Floating luxury with a permanent operating bill.' },
  { id: 'private-jet', name: 'Private Jet', emoji: '✈️', category: 'luxury', basePrice: 65_000_000, growthRate: 1.035, upkeepPerSecond: 18, unlockSpent: 5_000_000, description: 'Convenience at an industrial operating cost.' },
  { id: 'starter-home', name: 'Starter Home', emoji: '🏠', category: 'property', basePrice: 450_000, growthRate: 1.04, incomePerSecond: 1.2, upkeepPerSecond: 0.12, unlockSpent: 50_000, description: 'A real asset that can appreciate into a larger property portfolio.' },
  { id: 'apartments', name: 'Apartment Building', emoji: '🏢', category: 'property', basePrice: 8_000_000, growthRate: 1.055, incomePerSecond: 28, upkeepPerSecond: 6, unlockSpent: 1_000_000, description: 'Rental cash flow and the beginning of a real-estate empire.' },
  { id: 'hotel', name: 'Luxury Hotel', emoji: '🏨', category: 'property', basePrice: 95_000_000, growthRate: 1.065, incomePerSecond: 360, upkeepPerSecond: 115, unlockSpent: 15_000_000, description: 'Hospitality, property value, and a lot of staff.' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️', category: 'business', basePrice: 650_000, growthRate: 1.06, incomePerSecond: 7, upkeepPerSecond: 2.5, unlockSpent: 250_000, description: 'An operating business with both revenue and costs.' },
  { id: 'retail-chain', name: 'Retail Chain', emoji: '🏪', category: 'business', basePrice: 4_500_000, growthRate: 1.065, incomePerSecond: 42, upkeepPerSecond: 17, unlockSpent: 750_000, description: 'Multiple locations, inventory, payroll, and brand reach.' },
  { id: 'software-company', name: 'Software Company', emoji: '💻', category: 'business', basePrice: 12_000_000, growthRate: 1.07, incomePerSecond: 95, upkeepPerSecond: 24, unlockSpent: 2_000_000, description: 'High-margin growth if you can afford the team.' },
  { id: 'factory', name: 'Factory', emoji: '🏭', category: 'business', basePrice: 85_000_000, growthRate: 1.075, incomePerSecond: 520, upkeepPerSecond: 210, unlockSpent: 12_000_000, description: 'Industrial production with heavy operating costs.' },
  { id: 'skyscraper', name: 'Skyscraper', emoji: '🏙️', category: 'property', basePrice: 700_000_000, growthRate: 1.08, incomePerSecond: 1_900, upkeepPerSecond: 450, unlockSpent: 100_000_000, description: 'A skyline-defining commercial asset.' },
  { id: 'sports-team', name: 'Pro Sports Franchise', emoji: '🏟️', category: 'business', basePrice: 6_000_000_000, growthRate: 1.1, incomePerSecond: 8_500, upkeepPerSecond: 3_000, unlockSpent: 500_000_000, description: 'Prestige, media rights, payroll, and huge operating scale.' },
  { id: 'airport', name: 'International Airport', emoji: '🛫', category: 'infrastructure', basePrice: 18_000_000_000, growthRate: 1.1, incomePerSecond: 22_000, upkeepPerSecond: 8_500, unlockSpent: 2_000_000_000, description: 'Moves people, goods, and business through your growing region.' },
  { id: 'space-program', name: 'Private Space Program', emoji: '🚀', category: 'infrastructure', basePrice: 30_000_000_000, growthRate: 1.12, incomePerSecond: 35_000, upkeepPerSecond: 18_000, unlockSpent: 3_000_000_000, description: 'The first bridge from billionaire toys to civilization-scale projects.' },
  { id: 'megacity', name: 'Megacity Development', emoji: '🌆', category: 'infrastructure', basePrice: 250_000_000_000, growthRate: 1.15, incomePerSecond: 500_000, upkeepPerSecond: 175_000, unlockSpent: 25_000_000_000, description: 'Housing, transit, utilities, business districts, and millions of residents.' },
];

export const houseTiers: HouseTier[] = [
  { level: 0, name: 'No Home', cost: 0, requiredNetWorth: 0, rooms: 0, description: 'Buy your first permanent home.' },
  { level: 1, name: 'Starter Home', cost: 250_000, requiredNetWorth: 250_000, rooms: 4, description: 'Bedroom, kitchen, bathroom, and living room.' },
  { level: 2, name: 'Modern House', cost: 2_000_000, requiredNetWorth: 3_000_000, rooms: 8, description: 'Adds office, garage, gym, and entertainment space.' },
  { level: 3, name: 'Estate', cost: 15_000_000, requiredNetWorth: 25_000_000, rooms: 16, description: 'Room for collections, staff, workshops, and guest buildings.' },
  { level: 4, name: 'Mansion Compound', cost: 120_000_000, requiredNetWorth: 250_000_000, rooms: 32, description: 'A private compound that can anchor a neighborhood.' },
  { level: 5, name: 'Town Founder Estate', cost: 1_000_000_000, requiredNetWorth: 2_500_000_000, rooms: 50, description: 'Your estate becomes the anchor for a settlement.' },
];

export const townTiers: TownTier[] = [
  { level: 0, name: 'Private Estate', cost: 0, requiredNetWorth: 0, population: 0, jobs: 0, description: 'Your property is still private land.' },
  { level: 1, name: 'Hamlet', cost: 2_000_000_000, requiredNetWorth: 5_000_000_000, population: 250, jobs: 90, description: 'A tiny settlement grows around your estate.' },
  { level: 2, name: 'Village', cost: 8_000_000_000, requiredNetWorth: 20_000_000_000, population: 2_500, jobs: 1_100, description: 'Housing, shops, roads, and local businesses take shape.' },
  { level: 3, name: 'Town', cost: 30_000_000_000, requiredNetWorth: 75_000_000_000, population: 25_000, jobs: 12_000, description: 'A functioning town with districts, services, and industry.' },
  { level: 4, name: 'Small City', cost: 120_000_000_000, requiredNetWorth: 300_000_000_000, population: 180_000, jobs: 95_000, description: 'Transit, dense development, and a diversified economy arrive.' },
  { level: 5, name: 'Metropolis', cost: 500_000_000_000, requiredNetWorth: 1_000_000_000_000, population: 2_000_000, jobs: 1_100_000, description: 'A major urban economy ready for regional expansion.' },
];

export const achievements: Achievement[] = [
  { id: 'first-million-spent', name: 'Big Spender', description: 'Spend $1M in a run.', emoji: '💸', kind: 'spent', threshold: 1_000_000 },
  { id: 'billion-spent', name: 'Money Furnace', description: 'Spend $1B in a run.', emoji: '🔥', kind: 'spent', threshold: 1_000_000_000 },
  { id: 'income-1k', name: 'Cashflow', description: 'Earn $1K per second.', emoji: '📈', kind: 'income', threshold: 1_000 },
  { id: 'income-100k', name: 'Economic Engine', description: 'Earn $100K per second.', emoji: '⚙️', kind: 'income', threshold: 100_000 },
  { id: 'house-estate', name: 'Home Empire', description: 'Reach house level 5.', emoji: '🏰', kind: 'house', threshold: 5 },
  { id: 'found-town', name: 'Founder', description: 'Build your first hamlet.', emoji: '🏘️', kind: 'town', threshold: 1 },
  { id: 'metropolis', name: 'City Maker', description: 'Reach metropolis level.', emoji: '🌇', kind: 'town', threshold: 5 },
  { id: 'collector', name: 'Collector', description: 'Own 100 total items.', emoji: '📦', kind: 'collection', threshold: 100 },
];
