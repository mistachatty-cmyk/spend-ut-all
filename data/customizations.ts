import type { CustomizationDefinition, LokPetDefinition } from '@/game/customization-types';

export const customizationCatalog: CustomizationDefinition[] = [
  { id: 'theme-classic-ledger', kind: 'theme', name: 'Classic Ledger', emoji: '📒', description: 'The clean original Spend It All presentation.', rarity: 'common', acquisition: ['starter'], previewKey: 'classic-ledger' },
  { id: 'theme-midnight', kind: 'theme', name: 'Midnight', emoji: '🌙', description: 'A dark, low-glare empire dashboard.', rarity: 'common', acquisition: ['starter'], previewKey: 'midnight' },
  { id: 'theme-cozy-cafe', kind: 'theme', name: 'Cozy Café', emoji: '☕', description: 'Warm paper, coffee-shop surfaces, and softer motion.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 45, previewKey: 'cozy-cafe' },
  { id: 'theme-executive-glass', kind: 'theme', name: 'Executive Glass', emoji: '🏙️', description: 'Dark glass panels and restrained executive styling.', rarity: 'rare', acquisition: ['lok'], lokPrice: 90, previewKey: 'executive-glass' },
  { id: 'theme-market-terminal', kind: 'theme', name: 'Market Terminal', emoji: '📈', description: 'Dense terminal-inspired surfaces for finance-heavy runs.', rarity: 'rare', acquisition: ['lok'], lokPrice: 120, previewKey: 'market-terminal' },
  { id: 'theme-pixel-office', kind: 'theme', name: 'Pixel Office', emoji: '🕹️', description: 'A crisp retro office treatment that pairs naturally with pixel LOK Pets.', rarity: 'rare', acquisition: ['lok'], lokPrice: 110, previewKey: 'pixel-office' },
  { id: 'theme-neon-pulse', kind: 'theme', name: 'Neon Pulse', emoji: '💜', description: 'Animated neon edge lighting with a restrained moving glow.', rarity: 'epic', acquisition: ['lok'], lokPrice: 160, previewKey: 'neon-pulse' },
  { id: 'theme-aurora-ledger', kind: 'theme', name: 'Aurora Ledger', emoji: '🌌', description: 'A slow animated aurora washes behind the financial dashboard without hurting readability.', rarity: 'epic', acquisition: ['lok'], lokPrice: 185, previewKey: 'aurora-ledger' },
  { id: 'theme-lunar-office', kind: 'theme', name: 'Lunar Office', emoji: '🌕', description: 'A late-game lunar command treatment earned through planetary progression.', rarity: 'legendary', acquisition: ['scenario'], requirementId: 'region-planetary', previewKey: 'lunar-office' },

  { id: 'hud-default', kind: 'hud', name: 'Classic HUD', emoji: '🧭', description: 'The standard money, LOK, time, and world counters.', rarity: 'common', acquisition: ['starter'] },
  { id: 'hud-pocket', kind: 'hud', name: 'Pocket HUD', emoji: '📱', description: 'A compact mobile-first identity for players who prefer less visual chrome.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 25, previewKey: 'pocket' },
  { id: 'hud-boardroom', kind: 'hud', name: 'Boardroom HUD', emoji: '💼', description: 'Executive labels and tighter dashboard presentation for empire builders.', rarity: 'rare', acquisition: ['lok'], lokPrice: 70, previewKey: 'boardroom' },

  { id: 'counter-smooth', kind: 'money-counter', name: 'Smooth Roller', emoji: '💵', description: 'The standard animated money counter.', rarity: 'common', acquisition: ['starter'], previewKey: 'smooth' },
  { id: 'counter-flip', kind: 'money-counter', name: 'Flip Board', emoji: '🔢', description: 'Mechanical split-flap inspired money presentation.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 30, previewKey: 'flip' },
  { id: 'counter-terminal', kind: 'money-counter', name: 'Terminal Digits', emoji: '🖥️', description: 'Compact monospaced financial terminal digits.', rarity: 'rare', acquisition: ['lok'], lokPrice: 65, previewKey: 'terminal' },
  { id: 'counter-neon', kind: 'money-counter', name: 'Neon Meter', emoji: '💡', description: 'A softly pulsing luminous balance designed for dark themes.', rarity: 'rare', acquisition: ['lok'], lokPrice: 80, previewKey: 'neon' },
  { id: 'counter-hologram', kind: 'money-counter', name: 'Hologram Ledger', emoji: '🫧', description: 'An animated scan-line and shimmer treatment for the main wealth counter.', rarity: 'epic', acquisition: ['lok'], lokPrice: 125, previewKey: 'hologram' },
  { id: 'counter-gold', kind: 'money-counter', name: 'Golden Fortune', emoji: '✨', description: 'A premium gold treatment for very large balances.', rarity: 'epic', acquisition: ['lok'], lokPrice: 140, previewKey: 'gold' },
  { id: 'counter-spendutall', kind: 'money-counter', name: 'SPENDUTALL Singularity', emoji: '🌀', description: 'A mythic counter treatment awarded for the SPENDUTALL super achievement.', rarity: 'mythic', acquisition: ['achievement'], requirementId: 'spendutall-super', previewKey: 'singularity' },

  { id: 'background-grid-paper', kind: 'background', name: 'Grid Paper', emoji: '🗒️', description: 'A subtle accounting-grid texture behind your empire.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 20, previewKey: 'grid-paper' },
  { id: 'background-city-lights', kind: 'background', name: 'City Lights', emoji: '🌃', description: 'A restrained skyline glow that gives the dashboard late-night city energy.', rarity: 'rare', acquisition: ['lok'], lokPrice: 55, previewKey: 'city-lights' },
  { id: 'background-orbital', kind: 'background', name: 'Orbital Window', emoji: '🪐', description: 'A soft orbital horizon treatment for late-game dreamers.', rarity: 'epic', acquisition: ['lok'], lokPrice: 105, previewKey: 'orbital' },

  { id: 'frame-bootstrapped', kind: 'profile-frame', name: 'Bootstrapped', emoji: '🧗', description: 'A self-made profile frame earned from nothing.', rarity: 'rare', acquisition: ['achievement'], requirementId: 'nothing-millionaire' },
  { id: 'frame-clean-line', kind: 'profile-frame', name: 'Clean Line', emoji: '▣', description: 'A simple permanent collection frame for a polished identity.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 20, previewKey: 'clean-line' },
  { id: 'frame-gold-corner', kind: 'profile-frame', name: 'Gold Corners', emoji: '🔶', description: 'Small gold corner marks for a premium profile treatment.', rarity: 'rare', acquisition: ['lok'], lokPrice: 60, previewKey: 'gold-corner' },

  { id: 'title-clean', kind: 'title-style', name: 'Clean Title', emoji: 'Aa', description: 'A restrained title treatment for player titles and collection labels.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 15, previewKey: 'clean' },
  { id: 'title-terminal', kind: 'title-style', name: 'Terminal Title', emoji: '>_', description: 'Monospaced terminal styling for your equipped title.', rarity: 'rare', acquisition: ['lok'], lokPrice: 35, previewKey: 'terminal' },
  { id: 'title-luxury', kind: 'title-style', name: 'Luxury Title', emoji: '✦', description: 'A high-contrast luxury title treatment with subtle letter spacing.', rarity: 'rare', acquisition: ['lok'], lokPrice: 50, previewKey: 'luxury' },

  { id: 'effect-phoenix', kind: 'effect', name: 'Phoenix Recovery', emoji: '🔥', description: 'A recovery flourish earned by resurrecting an empire from extreme debt.', rarity: 'legendary', acquisition: ['achievement'], requirementId: 'debt-billion-comeback' },
  { id: 'effect-coin-pop', kind: 'effect', name: 'Coin Pop', emoji: '🪙', description: 'A lightweight celebratory identity for purchases and money moments.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 25, previewKey: 'coin-pop' },
  { id: 'effect-confetti-lite', kind: 'effect', name: 'Confetti Lite', emoji: '🎉', description: 'A restrained celebration style for milestones without overwhelming the screen.', rarity: 'rare', acquisition: ['lok'], lokPrice: 45, previewKey: 'confetti-lite' },

  { id: 'accessory-coffee-mug', kind: 'pet-accessory', name: 'Tiny Coffee Mug', emoji: '☕', description: 'A tiny companion mug for long economy sessions.', rarity: 'common', acquisition: ['lok'], lokPrice: 15 },
  { id: 'accessory-headphones', kind: 'pet-accessory', name: 'Pixel Headphones', emoji: '🎧', description: 'Tiny headphones for companions that look especially good in Pixel Office.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 25 },
  { id: 'accessory-tie', kind: 'pet-accessory', name: 'Tiny Power Tie', emoji: '👔', description: 'Boardroom-ready companion gear for serious imaginary meetings.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 20 },
  { id: 'accessory-sunglasses', kind: 'pet-accessory', name: 'Deal Shades', emoji: '😎', description: 'Tiny shades for companions who just closed a very unnecessary deal.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 25 },
  { id: 'accessory-glow-orb', kind: 'pet-accessory', name: 'Glow Orb', emoji: '🔮', description: 'A small luminous companion trinket with no economic effect.', rarity: 'rare', acquisition: ['lok'], lokPrice: 40 },
  { id: 'accessory-crown', kind: 'pet-accessory', name: 'Mini Crown', emoji: '👑', description: 'A ridiculous tiny crown for your equipped LOK Pet.', rarity: 'rare', acquisition: ['lok'], lokPrice: 45 },
];

export const lokPets: LokPetDefinition[] = [
  { id: 'pet-lok-slime', dexCharacterId: 'lokdex:g1:001', kind: 'pet', name: 'LOK Slime', emoji: '🟢', description: 'A companion form inspired by LOKdex #001. It reacts to money, time, and milestones.', rarity: 'common', acquisition: ['starter'], species: 'LOK slime', personality: 'Curious, bouncy, and fascinated by counters.', advisorRole: 'starter', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','bankruptcy-warning','purchase','day-night'] },
  { id: 'pet-coin-cat', dexCharacterId: 'lokdex:g1:004', kind: 'pet', name: 'Coin Cat', emoji: '🐈', description: 'A companion form inspired by LOKdex Coin Cat. Curls up beside the balance and paws at fast-moving digits.', rarity: 'uncommon', acquisition: ['lok'], lokPrice: 30, species: 'cat', personality: 'Sleepy until the balance starts moving.', advisorRole: 'money', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','purchase','day-night'] },
  { id: 'pet-espresso-bot', dexCharacterId: 'lokdex:g1:008', kind: 'pet', name: 'Espresso Bot', emoji: '🤖', description: 'A companion form inspired by the LOKdex character. Loves work blocks, coffee, and late sessions.', rarity: 'rare', acquisition: ['lok'], lokPrice: 75, species: 'coffee robot', personality: 'Over-caffeinated, punctual, and encouraging.', advisorRole: 'work', preferredAnchor: 'sidebar', reactions: ['money-up','achievement','purchase','travel','coffee','day-night'] },
  { id: 'pet-wolf-pup', dexCharacterId: 'lokdex:g1:017', kind: 'pet', name: 'Wolf Pup', emoji: '🐺', description: 'A companion form inspired by LOKdex Wolf Pup, reserved for mastering high-risk Wolf Boss play.', rarity: 'legendary', acquisition: ['achievement'], requirementId: 'wolf-risk-billionaire', species: 'wolf', personality: 'Confident, intense, and thrilled by risky recoveries.', advisorRole: 'risk', preferredAnchor: 'money-counter', reactions: ['money-up','money-down','achievement','bankruptcy-warning','purchase'] },
  { id: 'pet-moon-gecko', dexCharacterId: 'lokdex:g1:023', kind: 'pet', name: 'Moon Gecko', emoji: '🦎', description: 'A companion form inspired by the lunar LOKdex character and earned at planetary economic scale.', rarity: 'legendary', acquisition: ['scenario'], requirementId: 'region-planetary', species: 'moon gecko', personality: 'Calm, observant, and happiest during late-game expansion.', advisorRole: 'travel', preferredAnchor: 'room', reactions: ['achievement','travel','day-night','money-up'] },
];

export const allCustomizations: CustomizationDefinition[] = [...customizationCatalog, ...lokPets];

export function customizationById(id: string | null | undefined) {
  return id ? allCustomizations.find((entry) => entry.id === id) ?? null : null;
}
