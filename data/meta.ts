import type { BadgeDefinition, CollectibleDefinition, CollectibleSetDefinition } from '@/game/meta-types';

export const badges: BadgeDefinition[] = [
  { id: 'first-million', name: 'Big Spender', emoji: '💸', description: 'Spend $1M in a single run.', rarity: 'common', titleReward: 'Big Spender' },
  { id: 'billion-burner', name: 'Money Furnace', emoji: '🔥', description: 'Spend $1B in a single run.', rarity: 'uncommon', titleReward: 'Money Furnace' },
  { id: 'trillion-burner', name: 'Capital Singularity', emoji: '🕳️', description: 'Spend $1T in a single run.', rarity: 'legendary', titleReward: 'Capital Singularity' },
  { id: 'spend-it-all-legacy', name: 'Spend It All', emoji: '🚀', description: 'Spend the fixed $2T game benchmark in a single run.', rarity: 'mythic', titleReward: 'Spend It All' },
  { id: 'spendutall-legacy', name: 'SPENDUTALL', emoji: '♾️', description: 'Spend $200T in one run — one hundred times the $2T benchmark.', rarity: 'secret', hidden: true, titleReward: 'SPENDUTALL' },
  { id: 'speedrunner-legacy', name: 'Millionaire Any%', emoji: '🏃', description: 'Reach $1M from nothing in under ten minutes.', rarity: 'legendary', titleReward: 'Speedrunner' },
  { id: 'wolf-boss-legacy', name: 'Wolf Boss', emoji: '🐺', description: 'Reach the Wolf With No Net achievement.', rarity: 'mythic', titleReward: 'Wolf Boss' },
  { id: 'comeback-legacy', name: 'Resurrected Empire', emoji: '🦅', description: 'Recover from at least $1B of debt in Risk Mode.', rarity: 'mythic', titleReward: 'Comeback King' },
  { id: 'cashflow-king', name: 'Cashflow King', emoji: '📈', description: 'Reach $100K/sec net income.', rarity: 'rare', titleReward: 'Cashflow King' },
  { id: 'city-founder', name: 'City Founder', emoji: '🏙️', description: 'Grow your settlement into a Metropolis.', rarity: 'epic', titleReward: 'City Founder' },
  { id: 'planetary', name: 'Planetary Capitalist', emoji: '🌍', description: 'Reach Planetary Economy influence.', rarity: 'mythic', titleReward: 'Planetary Capitalist' },
  { id: 'collector-100', name: 'Collector', emoji: '📦', description: 'Own 100 total marketplace items at once.', rarity: 'uncommon', titleReward: 'Collector' },
  { id: 'scenario-finisher', name: 'Mission Accomplished', emoji: '✅', description: 'Complete any scenario objective.', rarity: 'rare', titleReward: 'Scenario Breaker' },
  { id: 'self-made-millionaire', name: 'Self-Made Millionaire', emoji: '🧗', description: 'Start with $0 and build a $1M net worth.', rarity: 'epic', titleReward: 'Self-Made' },
  { id: 'self-made-billionaire', name: 'Zero to Billion', emoji: '🚀', description: 'Start with $0 and build a $1B net worth.', rarity: 'legendary', titleReward: 'Zero to Billion' },
  { id: 'wealth-10x', name: 'Tenfold', emoji: '✖️', description: 'Complete the 10× Wealth challenge.', rarity: 'uncommon', titleReward: 'Tenfold' },
  { id: 'wealth-100x', name: 'Centuple', emoji: '💯', description: 'Complete the 100× Wealth challenge.', rarity: 'rare', titleReward: '100× Builder' },
  { id: 'wealth-1000x', name: 'Thousandfold', emoji: '⚡', description: 'Complete the 1,000× Wealth challenge.', rarity: 'epic', titleReward: '1,000× Builder' },
  { id: 'never-sell', name: 'Never Sell', emoji: '💎', description: 'Reach $1M from nothing without selling a marketplace item.', rarity: 'secret', hidden: true, titleReward: 'Diamond Grip' },
  { id: 'yacht-before-house', name: 'Priorities', emoji: '🛥️', description: 'Own a Superyacht before upgrading your permanent home.', rarity: 'secret', hidden: true, titleReward: 'Questionable Priorities' },
  { id: 'pc-404', name: 'Not Found', emoji: '404', description: 'Own at least 404 Gaming PCs.', rarity: 'secret', hidden: true, titleReward: 'Error 404' },
];

export const collectibles: CollectibleDefinition[] = [
  { id: 'first-coffee-receipt', name: 'The First Receipt', emoji: '🧾', description: 'A tiny receipt from the beginning of an absurd financial journey.', rarity: 'common', setId: 'humble-beginnings' },
  { id: 'diamond-coffee-cup', name: 'Diamond Coffee Cup', emoji: '☕', description: 'Awarded for owning 1,000 coffees. Economically indefensible.', rarity: 'epic', setId: 'humble-beginnings' },
  { id: '404-trophy', name: 'Error 404 Trophy', emoji: '💻', description: 'A glitched trophy discovered after accumulating 404 Gaming PCs.', rarity: 'secret', setId: 'oddities', hidden: true },
  { id: 'first-supercar-key', name: 'Carbon-Fiber Key', emoji: '🔑', description: 'The key from your first supercar.', rarity: 'uncommon', setId: 'transport-legends' },
  { id: 'jet-tail-number', name: 'Private Jet Tail Plate', emoji: '✈️', description: 'A polished plate commemorating your first private aircraft.', rarity: 'rare', setId: 'transport-legends' },
  { id: 'yacht-bell', name: 'Superyacht Bell', emoji: '🔔', description: 'A brass bell from your first floating palace.', rarity: 'rare', setId: 'transport-legends' },
  { id: 'city-key', name: 'Key to the Metropolis', emoji: '🗝️', description: 'Presented when your settlement becomes a full Metropolis.', rarity: 'legendary', setId: 'empire-relics' },
  { id: 'planetary-globe', name: 'Obsidian World Globe', emoji: '🌐', description: 'A symbolic globe from the moment your economy became planetary.', rarity: 'mythic', setId: 'empire-relics' },
  { id: 'moon-dust-vial', name: 'Moon Dust Vial', emoji: '🌕', description: 'A sealed vial from your first Lunar Colony.', rarity: 'mythic', setId: 'empire-relics' },
  { id: 'zero-balance-coin', name: 'Zero Dollar Coin', emoji: '🪙', description: 'A useless coin for somehow getting your cash balance extremely close to zero.', rarity: 'secret', setId: 'oddities', hidden: true },
  { id: 'questionable-priorities-plaque', name: 'Questionable Priorities Plaque', emoji: '🏆', description: 'Own a Superyacht before owning a permanent home.', rarity: 'secret', setId: 'oddities', hidden: true },
];

export const collectibleSets: CollectibleSetDefinition[] = [
  { id: 'humble-beginnings', name: 'Humble Beginnings', emoji: '☕', description: 'Artifacts proving even planetary empires started small.', collectibleIds: ['first-coffee-receipt','diamond-coffee-cup'], titleReward: 'Humble Billionaire' },
  { id: 'transport-legends', name: 'Transport Legends', emoji: '🏁', description: 'Collect relics from absurd personal transportation.', collectibleIds: ['first-supercar-key','jet-tail-number','yacht-bell'], titleReward: 'Jet Set' },
  { id: 'empire-relics', name: 'Empire Relics', emoji: '👑', description: 'Physical symbols of civilization-scale economic expansion.', collectibleIds: ['city-key','planetary-globe','moon-dust-vial'], titleReward: 'Keeper of Empires' },
  { id: 'oddities', name: 'Economic Oddities', emoji: '❓', description: 'Things the game never expected a reasonable person to do.', collectibleIds: ['404-trophy','zero-balance-coin','questionable-priorities-plaque'], titleReward: 'Economic Menace' },
];
