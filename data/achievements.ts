import type { Achievement, AchievementCategory } from '@/game/types';

export const achievementCategoryMeta: Record<AchievementCategory, { name: string; emoji: string; description: string }> = {
  wealth: { name: 'Wealth', emoji: '💰', description: 'Grow from pocket change into absurd levels of net worth.' },
  speedrunner: { name: 'Speedrunner', emoji: '⏱️', description: 'Hit major milestones before the clock gets away from you.' },
  'wolf-boss': { name: 'Wolf Boss', emoji: '🐺', description: 'Aggressive dealmaking, businesses, cashflow, and market dominance.' },
  comeback: { name: 'Comebacks', emoji: '🦅', description: 'Fall into trouble, survive, and claw your way back.' },
  spending: { name: 'Spending', emoji: '💸', description: 'Burn through fortunes at increasingly ridiculous scale.' },
  income: { name: 'Income', emoji: '📈', description: 'Make the live money counter move faster and faster.' },
  business: { name: 'Business', emoji: '🏢', description: 'Found companies, diversify, and build a conglomerate.' },
  empire: { name: 'Empire', emoji: '🌍', description: 'Turn property and companies into cities, regions, and worlds.' },
  collection: { name: 'Collection', emoji: '🏆', description: 'Own absurd quantities and complete unusual ownership feats.' },
  risk: { name: 'Risk', emoji: '⚠️', description: 'Achievements that only count when failure is actually possible.' },
  scenario: { name: 'Scenario', emoji: '🎯', description: 'Complete specific challenge modes and special run conditions.' },
  secret: { name: 'Secrets', emoji: '❓', description: 'Hidden accomplishments for behavior the game did not expect.' },
};

export const achievements: Achievement[] = [
  // WEALTH — personal milestones
  { id: 'first-dollar', name: 'First Dollar', description: 'Get your cash balance above $0.', emoji: '🪙', kind: 'cash', threshold: 1, category: 'wealth', subgroup: 'First Steps', points: 5 },
  { id: 'first-hundred', name: 'Pocket Money', description: 'Reach $100 cash.', emoji: '💵', kind: 'cash', threshold: 100, category: 'wealth', subgroup: 'First Steps', points: 5 },
  { id: 'first-thousand', name: 'Four Figures', description: 'Reach $1,000 net worth.', emoji: '💳', kind: 'netWorth', threshold: 1_000, category: 'wealth', subgroup: 'First Steps', points: 10 },
  { id: 'ten-thousand', name: 'Five Figures', description: 'Reach $10,000 net worth.', emoji: '🧾', kind: 'netWorth', threshold: 10_000, category: 'wealth', subgroup: 'Climbing', points: 10 },
  { id: 'hundred-thousand', name: 'Six Figures', description: 'Reach $100,000 net worth.', emoji: '💼', kind: 'netWorth', threshold: 100_000, category: 'wealth', subgroup: 'Climbing', points: 15 },
  { id: 'millionaire', name: 'Millionaire', description: 'Reach $1M net worth.', emoji: '💎', kind: 'netWorth', threshold: 1_000_000, category: 'wealth', subgroup: 'Major Milestones', points: 25 },
  { id: 'ten-million', name: 'Eight Figures', description: 'Reach $10M net worth.', emoji: '🏦', kind: 'netWorth', threshold: 10_000_000, category: 'wealth', subgroup: 'Major Milestones', points: 30 },
  { id: 'hundred-million', name: 'Nine Figures', description: 'Reach $100M net worth.', emoji: '🦈', kind: 'netWorth', threshold: 100_000_000, category: 'wealth', subgroup: 'Major Milestones', points: 40 },
  { id: 'billionaire-worth', name: 'Billionaire', description: 'Reach $1B net worth.', emoji: '👑', kind: 'netWorth', threshold: 1_000_000_000, category: 'wealth', subgroup: 'Titans', points: 60 },
  { id: 'trillionaire-worth', name: 'Trillionaire', description: 'Reach $1T net worth.', emoji: '🌐', kind: 'netWorth', threshold: 1_000_000_000_000, category: 'wealth', subgroup: 'Titans', points: 100 },
  { id: 'quadrillionaire', name: 'Quadrillionaire', description: 'Reach $1Q net worth.', emoji: '🌌', kind: 'netWorth', threshold: 1_000_000_000_000_000, category: 'wealth', subgroup: 'Impossible Money', points: 250, super: true },

  // START FROM NOTHING — scenario subgroup
  { id: 'nothing-millionaire', name: 'Self-Made Millionaire', description: 'Start with absolutely nothing and reach $1M net worth.', emoji: '🧗', kind: 'combo', threshold: 1, condition: 'nothing-millionaire', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 75 },
  { id: 'nothing-billionaire', name: 'Zero to Billion', description: 'Reach $1B net worth in Start From Nothing.', emoji: '🚀', kind: 'combo', threshold: 1, condition: 'nothing-billionaire', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 150 },
  { id: 'nothing-trillionaire', name: 'From Nothing to Everything', description: 'Reach $1T net worth in Start From Nothing.', emoji: '🌠', kind: 'combo', threshold: 1, condition: 'nothing-trillionaire', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 300, super: true },
  { id: 'nothing-business', name: 'Worker to Owner', description: 'Found your first managed company after starting from $0.', emoji: '🧑‍💼', kind: 'combo', threshold: 1, condition: 'nothing-first-business', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 30 },
  { id: 'nothing-home', name: 'Keys From Nothing', description: 'Buy your first permanent home after starting from $0.', emoji: '🔑', kind: 'combo', threshold: 1, condition: 'nothing-first-home', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 30 },
  { id: 'nothing-town', name: 'Build a Community', description: 'Create a Hamlet after starting from $0.', emoji: '🏘️', kind: 'combo', threshold: 1, condition: 'nothing-town', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 60 },
  { id: 'nothing-metropolis', name: 'Built This City', description: 'Reach Metropolis after starting with nothing.', emoji: '🌇', kind: 'combo', threshold: 1, condition: 'nothing-metropolis', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 100 },
  { id: 'nothing-planetary', name: 'Zero to Planetary', description: 'Reach a Planetary Economy from a $0 start.', emoji: '🌍', kind: 'combo', threshold: 1, condition: 'nothing-planetary', category: 'scenario', subgroup: 'Start From Nothing', scenarioOnly: ['nothing'], points: 500, super: true },

  // MULTIPLIER SCENARIOS
  { id: 'ten-x-win', name: '10×', description: 'Complete the 10× Wealth challenge.', emoji: '✖️', kind: 'combo', threshold: 1, condition: 'ten-x-win', category: 'scenario', subgroup: 'Wealth Multipliers', scenarioOnly: ['ten-x'], points: 50 },
  { id: 'hundred-x-win', name: '100×', description: 'Complete the 100× Wealth challenge.', emoji: '💯', kind: 'combo', threshold: 1, condition: 'hundred-x-win', category: 'scenario', subgroup: 'Wealth Multipliers', scenarioOnly: ['hundred-x'], points: 100 },
  { id: 'thousand-x-win', name: '1,000×', description: 'Complete the 1,000× Wealth challenge.', emoji: '⚡', kind: 'combo', threshold: 1, condition: 'thousand-x-win', category: 'scenario', subgroup: 'Wealth Multipliers', scenarioOnly: ['thousand-x'], points: 200 },
  { id: 'risk-100x-win', name: '100× With Teeth', description: 'Complete the 100× challenge with Risk Mode enabled.', emoji: '🦷', kind: 'combo', threshold: 1, condition: 'risk-100x-win', category: 'risk', subgroup: 'Risk Scenarios', scenarioOnly: ['hundred-x'], points: 175 },
  { id: 'risk-1000x-win', name: '1,000× on the Edge', description: 'Complete the 1,000× challenge with Risk Mode enabled.', emoji: '🧨', kind: 'combo', threshold: 1, condition: 'risk-1000x-win', category: 'risk', subgroup: 'Risk Scenarios', scenarioOnly: ['thousand-x'], points: 350, super: true },

  // SPEEDRUNNER
  { id: 'nothing-million-speed-10m', name: 'Millionaire Any%', description: 'Reach $1M from nothing in under 10 minutes.', emoji: '🏃', kind: 'combo', threshold: 1, condition: 'nothing-million-speed-10m', category: 'speedrunner', subgroup: 'Millionaire Splits', scenarioOnly: ['nothing'], points: 100 },
  { id: 'nothing-million-speed-5m', name: 'Fast Money', description: 'Reach $1M from nothing in under 5 minutes.', emoji: '⚡', kind: 'combo', threshold: 1, condition: 'nothing-million-speed-5m', category: 'speedrunner', subgroup: 'Millionaire Splits', scenarioOnly: ['nothing'], points: 175 },
  { id: 'nothing-million-speed-2m', name: 'Blink and You Missed It', description: 'Reach $1M from nothing in under 2 minutes.', emoji: '💫', kind: 'combo', threshold: 1, condition: 'nothing-million-speed-2m', category: 'speedrunner', subgroup: 'Millionaire Splits', scenarioOnly: ['nothing'], points: 300, super: true },
  { id: 'billion-speed-30m', name: 'Billionaire Sprint', description: 'Reach $1B net worth within 30 minutes of starting a run.', emoji: '🚄', kind: 'combo', threshold: 1, condition: 'billion-speed-30m', category: 'speedrunner', subgroup: 'Empire Splits', points: 160 },
  { id: 'town-speed-15m', name: 'Instant Mayor', description: 'Build a Hamlet within 15 minutes.', emoji: '🏘️', kind: 'combo', threshold: 1, condition: 'town-speed-15m', category: 'speedrunner', subgroup: 'Empire Splits', points: 120 },
  { id: 'metropolis-speed-60m', name: 'City in an Hour', description: 'Reach Metropolis within one hour.', emoji: '🌆', kind: 'combo', threshold: 1, condition: 'metropolis-speed-60m', category: 'speedrunner', subgroup: 'Empire Splits', points: 250 },

  // WOLF BOSS
  { id: 'wolf-first-billion', name: 'Wolf at the Door', description: 'Reach $1B net worth while owning at least one managed business.', emoji: '🐺', kind: 'combo', threshold: 1, condition: 'wolf-first-billion', category: 'wolf-boss', subgroup: 'Deal Maker', points: 100 },
  { id: 'wolf-three-businesses', name: 'Pack Leader', description: 'Own at least 3 managed businesses and $100M net worth.', emoji: '🐺', kind: 'combo', threshold: 1, condition: 'wolf-three-businesses', category: 'wolf-boss', subgroup: 'Deal Maker', points: 125 },
  { id: 'wolf-million-income', name: 'The Floor Is Roaring', description: 'Own a managed business and reach $1M/sec net income.', emoji: '📞', kind: 'combo', threshold: 1, condition: 'wolf-million-income', category: 'wolf-boss', subgroup: 'Cashflow Boss', points: 150 },
  { id: 'wolf-market-master', name: 'Market Alpha', description: 'Own all managed business types and reach $10B net worth.', emoji: '📊', kind: 'combo', threshold: 1, condition: 'wolf-market-master', category: 'wolf-boss', subgroup: 'Cashflow Boss', points: 250 },
  { id: 'wolf-risk-billionaire', name: 'Wolf With No Net', description: 'Reach $1B net worth with Risk Mode on and at least 3 managed businesses.', emoji: '🌑', kind: 'combo', threshold: 1, condition: 'wolf-risk-billionaire', category: 'wolf-boss', subgroup: 'Predator Tier', points: 350, super: true },

  // COMEBACKS
  { id: 'debt-comeback', name: 'Back in the Black', description: 'Go into debt in Risk Mode and recover to positive cash.', emoji: '🩹', kind: 'combo', threshold: 1, condition: 'debt-comeback', category: 'comeback', subgroup: 'Debt Recovery', points: 50 },
  { id: 'debt-10k-comeback', name: 'Bruised, Not Broken', description: 'Recover after falling at least $10K into debt.', emoji: '🛟', kind: 'combo', threshold: 1, condition: 'debt-10k-comeback', category: 'comeback', subgroup: 'Debt Recovery', points: 75 },
  { id: 'deep-debt-comeback', name: 'Impossible Comeback', description: 'Recover after falling at least $1M into debt.', emoji: '🦅', kind: 'combo', threshold: 1, condition: 'deep-debt-comeback', category: 'comeback', subgroup: 'Deep Water', points: 125 },
  { id: 'debt-100m-comeback', name: 'Too Big to Stay Down', description: 'Recover after falling at least $100M into debt.', emoji: '🏗️', kind: 'combo', threshold: 1, condition: 'debt-100m-comeback', category: 'comeback', subgroup: 'Deep Water', points: 225 },
  { id: 'debt-billion-comeback', name: 'Resurrected Empire', description: 'Recover after falling at least $1B into debt.', emoji: '🔥', kind: 'combo', threshold: 1, condition: 'debt-billion-comeback', category: 'comeback', subgroup: 'Legendary Recoveries', points: 400, super: true },
  { id: 'near-bankruptcy-comeback', name: 'Saved at the Bell', description: 'Trigger a bankruptcy countdown and recover before the timer reaches zero.', emoji: '🔔', kind: 'combo', threshold: 1, condition: 'near-bankruptcy-comeback', category: 'comeback', subgroup: 'Legendary Recoveries', points: 300, super: true },

  // SPENDING
  { id: 'first-million-spent', name: 'Big Spender', description: 'Spend $1M in a run.', emoji: '💸', kind: 'spent', threshold: 1_000_000, category: 'spending', subgroup: 'Burn Rate', points: 20 },
  { id: 'billion-spent', name: 'Money Furnace', description: 'Spend $1B in a run.', emoji: '🔥', kind: 'spent', threshold: 1_000_000_000, category: 'spending', subgroup: 'Burn Rate', points: 50 },
  { id: 'trillion-spent', name: 'Capital Singularity', description: 'Spend $1T in a run.', emoji: '🌀', kind: 'spent', threshold: 1_000_000_000_000, category: 'spending', subgroup: 'Burn Rate', points: 100 },
  { id: 'spend-elon-benchmark', name: 'Spend It All', description: 'Spend at least the game’s fixed $2T Elon Benchmark in a single run.', emoji: '🚀', kind: 'combo', threshold: 1, condition: 'spend-elon-benchmark', category: 'spending', subgroup: 'Game Namesakes', points: 250, super: true },
  { id: 'spendutall-super', name: 'SPENDUTALL', description: 'Spend 100× the $2T benchmark: $200T in a single run.', emoji: '♾️', kind: 'combo', threshold: 1, condition: 'spendutall-super', category: 'spending', subgroup: 'Game Namesakes', points: 1000, super: true },

  // INCOME
  { id: 'earned-1m', name: 'Earned, Not Given', description: 'Generate $1M of lifetime income in one run.', emoji: '🛠️', kind: 'lifetimeIncome', threshold: 1_000_000, category: 'income', subgroup: 'Lifetime Earnings', points: 25 },
  { id: 'earned-1b', name: 'Income Empire', description: 'Generate $1B of lifetime income.', emoji: '🏭', kind: 'lifetimeIncome', threshold: 1_000_000_000, category: 'income', subgroup: 'Lifetime Earnings', points: 50 },
  { id: 'earned-1t', name: 'Economic Gravity', description: 'Generate $1T of lifetime income.', emoji: '🪐', kind: 'lifetimeIncome', threshold: 1_000_000_000_000, category: 'income', subgroup: 'Lifetime Earnings', points: 100 },
  { id: 'income-1', name: 'Money While You Watch', description: 'Reach $1 per second.', emoji: '⏱️', kind: 'income', threshold: 1, category: 'income', subgroup: 'Per Second', points: 5 },
  { id: 'income-100', name: 'Bills Covered', description: 'Reach $100 per second.', emoji: '📬', kind: 'income', threshold: 100, category: 'income', subgroup: 'Per Second', points: 10 },
  { id: 'income-1k', name: 'Cashflow', description: 'Earn $1K per second.', emoji: '📈', kind: 'income', threshold: 1_000, category: 'income', subgroup: 'Per Second', points: 20 },
  { id: 'income-100k', name: 'Economic Engine', description: 'Earn $100K per second.', emoji: '⚙️', kind: 'income', threshold: 100_000, category: 'income', subgroup: 'Per Second', points: 30 },
  { id: 'income-1m', name: 'Million a Second', description: 'Earn $1M per second.', emoji: '💵', kind: 'income', threshold: 1_000_000, category: 'income', subgroup: 'Per Second', points: 50 },
  { id: 'income-10m', name: 'Money Machine', description: 'Earn $10M per second.', emoji: '💰', kind: 'income', threshold: 10_000_000, category: 'income', subgroup: 'Per Second', points: 75 },
  { id: 'income-1b', name: 'Billion-Second Economy', description: 'Earn $1B per second.', emoji: '🌊', kind: 'income', threshold: 1_000_000_000, category: 'income', subgroup: 'Per Second', points: 150, super: true },
  { id: 'positive-million-income', name: 'Counter Blur', description: 'Have positive cash while earning at least $1M every second.', emoji: '💨', kind: 'combo', threshold: 1, condition: 'positive-million-income', category: 'income', subgroup: 'Flow Combos', points: 80 },

  // BUSINESS
  { id: 'first-stream', name: 'First Passive Dollar', description: 'Own your first passive income stream.', emoji: '🪴', kind: 'incomeStreams', threshold: 1, category: 'business', subgroup: 'Passive Income', points: 10 },
  { id: 'ten-streams', name: 'Income Stack', description: 'Own 10 passive income streams.', emoji: '🧱', kind: 'incomeStreams', threshold: 10, category: 'business', subgroup: 'Passive Income', points: 20 },
  { id: 'hundred-streams', name: 'Income Web', description: 'Own 100 passive income streams.', emoji: '🕸️', kind: 'incomeStreams', threshold: 100, category: 'business', subgroup: 'Passive Income', points: 40 },
  { id: 'first-company', name: 'Founder CEO', description: 'Found your first managed company.', emoji: '🏢', kind: 'businesses', threshold: 1, category: 'business', subgroup: 'Company Builder', points: 25 },
  { id: 'three-companies', name: 'Serial Founder', description: 'Own 3 managed companies.', emoji: '🧠', kind: 'businesses', threshold: 3, category: 'business', subgroup: 'Company Builder', points: 50 },
  { id: 'all-companies', name: 'Conglomerate', description: 'Found every managed business type.', emoji: '🏛️', kind: 'combo', threshold: 1, condition: 'all-businesses', category: 'business', subgroup: 'Company Builder', points: 100 },
  { id: 'diversified', name: 'Three-Legged Empire', description: 'Own a marketplace asset, a passive income stream, and a managed business.', emoji: '🔺', kind: 'combo', threshold: 1, condition: 'diversified', category: 'business', subgroup: 'Diversification', points: 50 },

  // EMPIRE
  { id: 'house-estate', name: 'Home Empire', description: 'Reach house level 5.', emoji: '🏰', kind: 'house', threshold: 5, category: 'empire', subgroup: 'Property to Power', points: 50 },
  { id: 'found-town', name: 'Founder', description: 'Build your first hamlet.', emoji: '🏘️', kind: 'town', threshold: 1, category: 'empire', subgroup: 'Cities', points: 60 },
  { id: 'metropolis', name: 'City Maker', description: 'Reach metropolis level.', emoji: '🌇', kind: 'town', threshold: 5, category: 'empire', subgroup: 'Cities', points: 120 },
  { id: 'regional-power', name: 'Regional Power', description: 'Build a metro region.', emoji: '🗺️', kind: 'region', threshold: 1, category: 'empire', subgroup: 'Regions', points: 150 },
  { id: 'planetary', name: 'Planetary Economy', description: 'Reach planetary economic scale.', emoji: '🌍', kind: 'region', threshold: 5, category: 'empire', subgroup: 'Regions', points: 400, super: true },
  { id: 'moon-metropolis', name: 'Grounded in Space', description: 'Own a Lunar Colony while maintaining a Metropolis.', emoji: '🌕', kind: 'combo', threshold: 1, condition: 'moon-and-metropolis', category: 'empire', subgroup: 'Off-World', points: 250 },
  { id: 'all-upgrades-max', name: 'Fully Operational', description: 'Max every empire upgrade.', emoji: '🟣', kind: 'combo', threshold: 1, condition: 'all-upgrades-max', category: 'empire', subgroup: 'Optimization', points: 250 },
  { id: 'planetary-from-nothing', name: 'Civilization From Zero', description: 'Reach Planetary Economy in Start From Nothing.', emoji: '🌎', kind: 'combo', threshold: 1, condition: 'planetary-from-nothing', category: 'empire', subgroup: 'Off-World', scenarioOnly: ['nothing'], points: 600, super: true },

  // COLLECTION
  { id: 'collector', name: 'Collector', description: 'Own 100 total marketplace items.', emoji: '📦', kind: 'collection', threshold: 100, category: 'collection', subgroup: 'Quantity', points: 20 },
  { id: 'collector-1k', name: 'Storage Problem', description: 'Own 1,000 total marketplace items.', emoji: '🏚️', kind: 'collection', threshold: 1_000, category: 'collection', subgroup: 'Quantity', points: 40 },
  { id: 'mega-collector', name: 'Warehouse Required', description: 'Own 10,000 total marketplace items.', emoji: '🏗️', kind: 'collection', threshold: 10_000, category: 'collection', subgroup: 'Quantity', points: 80 },
  { id: 'coffee-million', name: 'Caffeine Singularity', description: 'Own 1,000,000 coffees at once.', emoji: '☕', kind: 'combo', threshold: 1, condition: 'coffee-million', category: 'collection', subgroup: 'Absurd Ownership', points: 200, super: true },
  { id: 'one-of-everything', name: 'One of Everything', description: 'Own at least one of every marketplace item.', emoji: '🛒', kind: 'combo', threshold: 1, condition: 'one-of-everything', category: 'collection', subgroup: 'Completionist', points: 175 },
  { id: 'collector-cashflow', name: 'Everything Everywhere', description: 'Own 1,000 items while earning at least $100K per second.', emoji: '🧺', kind: 'combo', threshold: 1, condition: 'collector-cashflow', category: 'collection', subgroup: 'Completionist', points: 100 },

  // RISK
  { id: 'risk-millionaire', name: 'Danger Millionaire', description: 'Reach $1M net worth with Risk Mode enabled.', emoji: '⚠️', kind: 'combo', threshold: 1, condition: 'risk-millionaire', category: 'risk', subgroup: 'Risk Wealth', points: 75 },
  { id: 'no-sales-millionaire', name: 'Never Sell', description: 'Reach $1M from nothing without selling a marketplace item.', emoji: '💎', kind: 'combo', threshold: 1, condition: 'no-sales-millionaire', category: 'risk', subgroup: 'Restrictions', scenarioOnly: ['nothing'], points: 100 },
  { id: 'no-sales-billionaire', name: 'Diamond Empire', description: 'Reach $1B from nothing without ever selling a marketplace item.', emoji: '💠', kind: 'combo', threshold: 1, condition: 'no-sales-billionaire', category: 'risk', subgroup: 'Restrictions', scenarioOnly: ['nothing'], points: 250 },
  { id: 'nothing-no-passive-millionaire', name: 'Hands-On Millionaire', description: 'Reach $1M from nothing without buying any passive income stream.', emoji: '👐', kind: 'combo', threshold: 1, condition: 'nothing-no-passive-millionaire', category: 'risk', subgroup: 'Restrictions', scenarioOnly: ['nothing'], points: 175 },
  { id: 'nothing-active-100k', name: 'Built by Hand', description: 'Generate $100K lifetime income from a $0 start before owning a passive income stream.', emoji: '🔨', kind: 'combo', threshold: 1, condition: 'nothing-active-100k', category: 'risk', subgroup: 'Restrictions', scenarioOnly: ['nothing'], points: 100 },

  // SECRETS
  { id: 'exact-zero', name: 'Zeroed Out', description: 'Get your cash balance within one cent of exactly $0.', emoji: '0️⃣', kind: 'combo', threshold: 1, condition: 'exact-zero', category: 'secret', subgroup: 'Odd Behavior', hidden: true, points: 50 },
];
