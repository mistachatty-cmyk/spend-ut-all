import type { CustomizationDefinition, LokPetDefinition } from '@/game/customization-types';

export const customizationCatalog: CustomizationDefinition[] = [
  { id: 'theme-classic-ledger', kind: 'theme', name: 'Classic Ledger', emoji: '📒', description: 'The clean original Spend It All presentation.', rarity: 'common', acquisition: ['starter'], previewKey: 'classic-ledger' },
  { id: 'theme-midnight', kind: 'theme', name: 'Midnight', emoji: '🌙', description: 'A dark, low-glare empire dashboard.', rarity: 'common', acquisition: ['starter'], previewKey: 'midnight' },
  { id: 'theme-cozy-cafe', kind: 'theme', name: 'Cozy Café', emoji: '☕', description: 'Warm paper, coffee-shop surfaces, and softer motion.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 45, previewKey: 'cozy-cafe' },
  { id: 'theme-executive-glass', kind: 'theme', name: 'Executive Glass', emoji: '🏙️', description: 'Dark glass panels and restrained executive styling.', rarity: 'rare', acquisition: ['lok'], lokPrice: 90, previewKey: 'executive-glass' },
  { id: 'theme-market-terminal', kind: 'theme', name: 'Market Terminal', emoji: '📈', description: 'Dense terminal-inspired surfaces for finance-heavy runs.', rarity: 'rare', acquisition: ['lok'], lokPrice: 120, previewKey: 'market-terminal' },
  { id: 'theme-lunar-office', kind: 'theme', name: 'Lunar Office', emoji: '🌕', description: 'A late-game lunar command treatment earned through planetary progression.', rarity: 'legendary', acquisition: ['scenario'], requirementId: 'region-planetary', previewKey: 'lunar-office' },

  { id: 'hud-default', kind: 'hud', name: 'Classic HUD', emoji: '🧭', description: 'The standard money, LOK, time, and world counters.', rarity: 'common', acquisition: ['starter'] },
  { id: 'hud-compact', kind: 'hud', name: 'Compact Mobile HUD', emoji: '📱', description: 'A tighter HUD treatment for smaller screens.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 35 },

  { id: 'counter-smooth', kind: 'money-counter', name: 'Smooth Roller', emoji: '💵', description: 'The standard animated money counter.', rarity: 'common', acquisition: ['starter'], previewKey: 'smooth' },
  { id: 'counter-flip', kind: 'money-counter', name: 'Flip Board', emoji: '🔢', description: 'Mechanical split-flap inspired money presentation.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 30, previewKey: 'flip' },
  { id: 'counter-terminal', kind: 'money-counter', name: 'Terminal Digits', emoji: '🖥️', description: 'Compact monospaced financial terminal digits.', rarity: 'rare', acquisition: ['lok'], lokPrice: 65, previewKey: 'terminal' },
  { id: 'counter-gold', kind: 'money-counter', name: 'Golden Fortune', emoji: '✨', description: 'A premium gold treatment for very large balances.', rarity: 'epic', acquisition: ['lok'], lokPrice: 140, previewKey: 'gold' },
  { id: 'counter-spendutall', kind: 'money-counter', name: 'SPENDUTALL Singularity', emoji: '🌀', description: 'A mythic counter treatment awarded for the SPENDUTALL super achievement.', rarity: 'mythic', acquisition: ['achievement'], requirementId: 'spendutall-super', previewKey: 'singularity' },

  { id: 'effect-phoenix', kind: 'effect', name: 'Phoenix Recovery', emoji: '🔥', description: 'A recovery flourish earned by resurrecting an empire from extreme debt.', rarity: 'legendary', acquisition: ['achievement'], requirementId: 'debt-billion-comeback' },
  { id: 'frame-bootstrapped', kind: 'profile-frame', name: 'Bootstrapped', emoji: '🧗', description: 'A self-made profile frame earned from nothing.', rarity: 'rare', acquisition: ['achievement'], requirementId: 'nothing-millionaire' },

  { id: 'accessory-coffee-mug', kind: 'pet-accessory', name: 'Tiny Coffee Mug', emoji: '☕', description: 'A tiny companion mug for long economy sessions.', rarity: 'common', acquisition: ['lok'], lokPrice: 15 },
  { id: 'accessory-crown', kind: 'pet-accessory', name: 'Mini Crown', emoji: '👑', description: 'A ridiculous tiny crown for your equipped LOK Pet.', rarity: 'rare', acquisition: ['lok'], lokPrice: 45 },
];

export const lokPets: LokPetDefinition[] = [
  { id: 'pet-lok-slime', kind: 'pet', name: 'LOK Slime', emoji: '🟢', description: 'The starter LOK mascot. It reacts to money, time, and milestones.', rarity: 'common', acquisition: ['starter'], species: 'LOK slime', personality: 'Curious, bouncy, and fascinated by counters.', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','bankruptcy-warning','purchase','day-night'] },
  { id: 'pet-coin-cat', kind: 'pet', name: 'Coin Cat', emoji: '🐈', description: 'Curls up beside the balance and paws at fast-moving digits.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 30, species: 'cat', personality: 'Sleepy until the balance starts moving.', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','purchase','day-night'] },
  { id: 'pet-espresso-bot', kind: 'pet', name: 'Espresso Bot', emoji: '🤖', description: 'A tiny coffee robot that loves work blocks, coffee, and late sessions.', rarity: 'rare', acquisition: ['lok'], lokPrice: 75, species: 'coffee robot', personality: 'Over-caffeinated, punctual, and encouraging.', preferredAnchor: 'sidebar', reactions: ['money-up','achievement','purchase','travel','coffee','day-night'] },
  { id: 'pet-wolf-pup', kind: 'pet', name: 'Wolf Pup', emoji: '🐺', description: 'A permanent companion for mastering high-risk Wolf Boss play.', rarity: 'legendary', acquisition: ['achievement'], requirementId: 'wolf-risk-billionaire', species: 'wolf', personality: 'Confident, intense, and thrilled by risky recoveries.', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','bankruptcy-warning','purchase'] },
  { id: 'pet-moon-gecko', kind: 'pet', name: 'Moon Gecko', emoji: '🦎', description: 'A lunar companion earned at planetary economic scale.', rarity: 'legendary', acquisition: ['scenario'], requirementId: 'region-planetary', species: 'moon gecko', personality: 'Calm, observant, and happiest during late-game expansion.', preferredAnchor: 'room', reactions: ['achievement','travel','day-night','money-up'] },
];

export const allCustomizations: CustomizationDefinition[] = [...customizationCatalog, ...lokPets];

export function customizationById(id: string | null | undefined) {
  return id ? allCustomizations.find((entry) => entry.id === id) ?? null : null;
}
