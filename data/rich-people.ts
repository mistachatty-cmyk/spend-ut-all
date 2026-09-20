import type { ScenarioId } from '@/game/types';

export interface RichPersonProfile {
  id: ScenarioId;
  name: string;
  moniker: string;
  fortuneFormatted: string;
  startingCash: number;
  category: 'prime' | 'modern' | 'historic' | 'scale';
  isPrime: boolean;
  portraitUrl: string;
  fallbackSeedUrl: string;
  badge: string;
  badgeColor: string;
  accentGradient: string;
  signatureAsset: string;
  quote: string;
  description: string;
  initials?: string;
  iconEmoji?: string;
}

export function generateRichPersonSvg(profile: {
  name: string;
  initials: string;
  badgeColor: string;
  badge: string;
  iconEmoji: string;
  quote: string;
  category: string;
}): string {
  const { name, initials, badgeColor, iconEmoji } = profile;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="${badgeColor}" stop-opacity="0.85" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="50%">
        <stop offset="0%" stop-color="${badgeColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${badgeColor}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <clipPath id="circleClip">
        <circle cx="200" cy="200" r="190" />
      </clipPath>
    </defs>
    <rect width="400" height="400" fill="#090d16" />
    <g clip-path="url(#circleClip)">
      <rect width="400" height="400" fill="url(#bgGrad)" />
      <circle cx="200" cy="160" r="160" fill="url(#glow)" />
      <!-- Stylized silhouette bust -->
      <path d="M70 400 C70 290 140 250 200 250 C260 250 330 290 330 400 Z" fill="url(#suitGrad)" />
      <!-- Collar / shirt -->
      <polygon points="175,250 200,300 225,250" fill="#f8fafc" />
      <!-- Head silhouette -->
      <ellipse cx="200" cy="165" rx="58" ry="72" fill="#e2e8f0" />
      <!-- Shadow on jawline -->
      <path d="M150 180 C170 230 230 230 250 180 C240 215 160 215 150 180 Z" fill="#cbd5e1" opacity="0.7" />
      <!-- Badge ring & Monogram -->
      <circle cx="200" cy="165" r="46" fill="rgba(15, 23, 42, 0.75)" stroke="${badgeColor}" stroke-width="3" />
      <text x="200" y="177" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" letter-spacing="1">${initials}</text>
      <!-- Signature Icon Floating Medal -->
      <circle cx="310" cy="90" r="38" fill="#0f172a" stroke="${badgeColor}" stroke-width="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
      <text x="310" y="103" text-anchor="middle" font-size="34">${iconEmoji}</text>
    </g>
    <!-- Outer rim -->
    <circle cx="200" cy="200" r="190" fill="none" stroke="${badgeColor}" stroke-width="4" stroke-opacity="0.6" />
    <!-- Name banner at bottom -->
    <rect x="40" y="335" width="320" height="46" rx="23" fill="rgba(15, 23, 42, 0.92)" stroke="${badgeColor}" stroke-width="2" />
    <text x="200" y="364" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" letter-spacing="0.5">${name}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const RICH_PEOPLE_CATALOG: RichPersonProfile[] = [
  // --- THE THREE PRIME TITANS (FEATURED) ---
  {
    id: 'elon-prime',
    name: 'Elon Musk',
    moniker: 'The 1st Trillionaire ($1T Peak)',
    fortuneFormatted: '$1,000,000,000,000',
    startingCash: 1_000_000_000_000,
    category: 'prime',
    isPrime: true,
    initials: 'EM',
    iconEmoji: '🚀',
    portraitUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Elon Musk',
      initials: 'EM',
      badgeColor: '#ec4899',
      badge: '⚡ 1ST TRILLIONAIRE',
      iconEmoji: '🚀',
      quote: 'I would like to die on Mars.',
      category: 'prime',
    }),
    badge: '⚡ 1ST TRILLIONAIRE',
    badgeColor: '#ec4899',
    accentGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
    signatureAsset: 'Starship Mars Fleet & Lunar Outpost',
    quote: '“I would like to die on Mars. Just not on impact.”',
    description: 'Start with $1 Trillion. Relive the historic moment when Tesla, SpaceX, and xAI valuations peaked. Spend every cent on interplanetary colonization and clean energy!',
  },
  {
    id: 'bezos-prime',
    name: 'Jeff Bezos',
    moniker: 'Amazon Monopoly Peak ($500B)',
    fortuneFormatted: '$500,000,000,000',
    startingCash: 500_000_000_000,
    category: 'prime',
    isPrime: true,
    initials: 'JB',
    iconEmoji: '📦',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Jeff Bezos',
      initials: 'JB',
      badgeColor: '#f59e0b',
      badge: '⚡ $500B ZENITH',
      iconEmoji: '📦',
      quote: 'Work hard, have fun, make history.',
      category: 'prime',
    }),
    badge: '⚡ $500B ZENITH',
    badgeColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
    signatureAsset: 'O’Neill Space Cylinders & 417ft Koru Yacht',
    quote: '“If you double the number of experiments you do per year, you double your inventiveness.”',
    description: 'Start with $500 Billion. The absolute zenith of global e-commerce and AWS cloud infrastructure. Spend half a trillion on orbital space colonies and oceanic estates!',
  },
  {
    id: 'gates-prime',
    name: 'Bill Gates',
    moniker: 'Dot-Com Hegemon Peak ($300B)',
    fortuneFormatted: '$300,000,000,000',
    startingCash: 300_000_000_000,
    category: 'prime',
    isPrime: true,
    initials: 'BG',
    iconEmoji: '💻',
    portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Bill Gates',
      initials: 'BG',
      badgeColor: '#0284c7',
      badge: '⚡ $300B HEGEMON',
      iconEmoji: '💻',
      quote: 'Patience is a key element of success.',
      category: 'prime',
    }),
    badge: '⚡ $300B HEGEMON',
    badgeColor: '#0284c7',
    accentGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
    signatureAsset: 'Molten-Salt Nuclear Array & Global Vaccines',
    quote: '“Patience is a key element of success.”',
    description: 'Start with $300 Billion (1999 peak inflation-adjusted). Microsoft commanded 95% of personal computing. Spend it all eradicating polio and pioneering nuclear reactors!',
  },

  // --- MODERN BILLIONAIRES (SUB-MENU) ---
  {
    id: 'buffett',
    name: 'Warren Buffett',
    moniker: 'The Oracle of Omaha',
    fortuneFormatted: '$145,000,000,000',
    startingCash: 145_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'WB',
    iconEmoji: '📈',
    portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Warren Buffett',
      initials: 'WB',
      badgeColor: '#10b981',
      badge: '🏛️ VALUE ORACLE',
      iconEmoji: '📈',
      quote: 'Never lose money.',
      category: 'modern',
    }),
    badge: '🏛️ VALUE ORACLE',
    badgeColor: '#10b981',
    accentGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)',
    signatureAsset: 'BNSF Transcontinental Railway & Berkshire Vault',
    quote: '“Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.”',
    description: 'Start with $145 Billion. Compounded over seven decades of disciplined investing. Spend his cash hoard on national infrastructure and philanthropic pledges!',
  },
  {
    id: 'arnault',
    name: 'Bernard Arnault',
    moniker: 'Emperor of Global Luxury',
    fortuneFormatted: '$210,000,000,000',
    startingCash: 210_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'BA',
    iconEmoji: '💎',
    portraitUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Bernard Arnault',
      initials: 'BA',
      badgeColor: '#8b5cf6',
      badge: '💎 LUXURY EMPEROR',
      iconEmoji: '💎',
      quote: 'People will still drink Dom Pérignon.',
      category: 'modern',
    }),
    badge: '💎 LUXURY EMPEROR',
    badgeColor: '#8b5cf6',
    accentGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)',
    signatureAsset: 'LVMH Fashion Houses & Parisian Chateau Estates',
    quote: '“Can you say that in twenty years people will still use the iPhone? Maybe not. But people will still drink Dom Pérignon.”',
    description: 'Start with $210 Billion. Architect of LVMH, Dior, and Tiffany. Spend his opulent European fortune on Renaissance art and luxury megayachts!',
  },
  {
    id: 'zuckerberg',
    name: 'Mark Zuckerberg',
    moniker: 'Metaverse & AI Sovereign',
    fortuneFormatted: '$180,000,000,000',
    startingCash: 180_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'MZ',
    iconEmoji: '🌐',
    portraitUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Mark Zuckerberg',
      initials: 'MZ',
      badgeColor: '#3b82f6',
      badge: '🌐 METAVERSE ARCHITECT',
      iconEmoji: '🌐',
      quote: 'Move fast and build things.',
      category: 'modern',
    }),
    badge: '🌐 METAVERSE ARCHITECT',
    badgeColor: '#3b82f6',
    accentGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
    signatureAsset: 'Kauai Ranch Compound & GPU Superclusters',
    quote: '“Move fast and build things that connect every human on earth.”',
    description: 'Start with $180 Billion. From Harvard dorm rooms to connecting 3 billion people. Spend his Silicon Valley fortune on Kauai underground compounds and VR metaverses!',
  },
  {
    id: 'ellison',
    name: 'Larry Ellison',
    moniker: 'Swashbuckling Cloud & Island Mogul',
    fortuneFormatted: '$175,000,000,000',
    startingCash: 175_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'LE',
    iconEmoji: '🏝️',
    portraitUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Larry Ellison',
      initials: 'LE',
      badgeColor: '#06b6d4',
      badge: '🏝️ ISLAND KING',
      iconEmoji: '🏝️',
      quote: 'I had all the disadvantages required for success.',
      category: 'modern',
    }),
    badge: '🏝️ ISLAND KING',
    badgeColor: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 116, 144, 0.12) 100%)',
    signatureAsset: '98% of Lanai Hawaiian Island & Rising Sun Yacht',
    quote: '“I have had all the disadvantages required for success.”',
    description: 'Start with $175 Billion. Co-founder of Oracle who bought almost an entire Hawaiian island. Spend his adventurous fortune on America’s Cup racing catamarans and private resorts!',
  },
  {
    id: 'huang',
    name: 'Jensen Huang',
    moniker: 'AI Compute & GPU Titan',
    fortuneFormatted: '$130,000,000,000',
    startingCash: 130_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'JH',
    iconEmoji: '🤖',
    portraitUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Jensen Huang',
      initials: 'JH',
      badgeColor: '#84cc16',
      badge: '🤖 AI COMPUTE TITAN',
      iconEmoji: '🤖',
      quote: 'Software is eating the world, but AI is eating software.',
      category: 'modern',
    }),
    badge: '🤖 AI COMPUTE TITAN',
    badgeColor: '#84cc16',
    accentGradient: 'linear-gradient(135deg, rgba(132, 204, 22, 0.12) 0%, rgba(101, 163, 13, 0.12) 100%)',
    signatureAsset: 'Blackwell AI Superclusters & Silicon Foundries',
    quote: '“Software is eating the world, but AI is going to eat software.”',
    description: 'Start with $130 Billion. The leader in the signature black leather jacket who turned graphics chips into the silicon engine of artificial intelligence!',
  },
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    moniker: 'Silicon Valley Visionary',
    fortuneFormatted: '$100,000,000,000',
    startingCash: 100_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'SJ',
    iconEmoji: '🍎',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Steve Jobs',
      initials: 'SJ',
      badgeColor: '#64748b',
      badge: '🍎 DESIGN ICON',
      iconEmoji: '🍎',
      quote: 'Design is how it works.',
      category: 'modern',
    }),
    badge: '🍎 DESIGN ICON',
    badgeColor: '#64748b',
    accentGradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.12) 0%, rgba(71, 85, 105, 0.12) 100%)',
    signatureAsset: 'Minimalist Superyacht Venus & Apple Park Ring',
    quote: '“Design is not just what it looks like and feels like. Design is how it works.”',
    description: 'Start with $100 Billion equivalent tech legacy. The icon who married liberal arts with cutting-edge technology. Spend on minimalist architecture and artistic monuments!',
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk (Standard)',
    moniker: 'Space & EV Pioneer',
    fortuneFormatted: '$250,000,000,000',
    startingCash: 250_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'EM',
    iconEmoji: '🚀',
    portraitUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Elon Musk',
      initials: 'EM',
      badgeColor: '#ec4899',
      badge: '🚀 EV & MARS',
      iconEmoji: '🚀',
      quote: 'Make life multiplanetary.',
      category: 'modern',
    }),
    badge: '🚀 EV & MARS',
    badgeColor: '#ec4899',
    accentGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
    signatureAsset: 'Orbital Satellites & Gigafactories',
    quote: '“When something is important enough, you do it even if the odds are not in your favor.”',
    description: 'Spend $250 Billion of the modern EV and rocketry pioneer’s wealth.',
  },
  {
    id: 'jeff-bezos',
    name: 'Jeff Bezos (Standard)',
    moniker: 'Logistics Emperor',
    fortuneFormatted: '$200,000,000,000',
    startingCash: 200_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'JB',
    iconEmoji: '📦',
    portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Jeff Bezos',
      initials: 'JB',
      badgeColor: '#f59e0b',
      badge: '📦 CLOUD & ROCKETS',
      iconEmoji: '📦',
      quote: 'Work hard, have fun, make history.',
      category: 'modern',
    }),
    badge: '📦 CLOUD & ROCKETS',
    badgeColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
    signatureAsset: 'Blue Origin Rocket Launchers & 10,000-Year Clock',
    quote: '“Work hard, have fun, make history.”',
    description: 'Spend $200 Billion on private aerospace, mansions, and mega-yachts.',
  },
  {
    id: 'bill-gates',
    name: 'Bill Gates (Standard)',
    moniker: 'Software & Philanthropy Titan',
    fortuneFormatted: '$140,000,000,000',
    startingCash: 140_000_000_000,
    category: 'modern',
    isPrime: false,
    initials: 'BG',
    iconEmoji: '💻',
    portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Bill Gates',
      initials: 'BG',
      badgeColor: '#0284c7',
      badge: '💻 GLOBAL HEALTH',
      iconEmoji: '💻',
      quote: 'Patience is key.',
      category: 'modern',
    }),
    badge: '💻 GLOBAL HEALTH',
    badgeColor: '#0284c7',
    accentGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
    signatureAsset: 'Farmland Portfolio & Disease Eradication Foundation',
    quote: '“To create a new standard, it takes something that’s not just a little bit different; it has to be something that’s really new.”',
    description: 'Spend $140 Billion on global healthcare, clean water, and green energy.',
  },

  // --- HISTORIC WEALTH TITANS (SUB-MENU) ---
  {
    id: 'rockefeller',
    name: 'John D. Rockefeller',
    moniker: 'Standard Oil Sovereign',
    fortuneFormatted: '$420,000,000,000',
    startingCash: 420_000_000_000,
    category: 'historic',
    isPrime: false,
    initials: 'JDR',
    iconEmoji: '🛢️',
    portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'John D. Rockefeller',
      initials: 'JDR',
      badgeColor: '#b45309',
      badge: '🛢️ 1ST BILLIONAIRE',
      iconEmoji: '🛢️',
      quote: 'I believe the power to make money is a gift.',
      category: 'historic',
    }),
    badge: '🛢️ 1ST MODERN BILLIONAIRE',
    badgeColor: '#b45309',
    accentGradient: 'linear-gradient(135deg, rgba(180, 83, 9, 0.15) 0%, rgba(146, 64, 14, 0.15) 100%)',
    signatureAsset: 'Standard Oil Refineries & Rockefeller Center',
    quote: '“I believe the power to make money is a gift from God.”',
    description: 'Start with $420 Billion (inflation-adjusted peak). Built Standard Oil to refine 90% of America’s petroleum before establishing the modern philanthropic foundation!',
  },
  {
    id: 'mansa-musa',
    name: 'Mansa Musa',
    moniker: 'The Emperor of Gold (Mali Empire)',
    fortuneFormatted: '$400,000,000,000',
    startingCash: 400_000_000_000,
    category: 'historic',
    isPrime: false,
    initials: 'MM',
    iconEmoji: '👑',
    portraitUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Mansa Musa',
      initials: 'MM',
      badgeColor: '#eab308',
      badge: '👑 RICHEST IN HISTORY',
      iconEmoji: '👑',
      quote: 'Ruler of the gold-rich kingdoms of West Africa.',
      category: 'historic',
    }),
    badge: '👑 RICHEST IN HISTORY',
    badgeColor: '#eab308',
    accentGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(202, 138, 4, 0.18) 100%)',
    signatureAsset: 'Pure 24k Gold Reserves & University of Sankore',
    quote: '“Ruler of the gold-rich kingdoms of West Africa whose generosity depressed Mediterranean economies for a decade.”',
    description: 'Start with $400 Billion in pure gold reserves. The 14th-century ruler whose pilgrimage to Mecca carried tens of thousands of pounds of gold that transformed world trade!',
  },

  // --- PURE WEALTH SCALING (SUB-MENU) ---
  {
    id: 'trillionaire',
    name: 'Trillionaire Sandbox',
    moniker: 'Civilization-Scale Wealth',
    fortuneFormatted: '$1,000,000,000,000',
    startingCash: 1_000_000_000_000,
    category: 'scale',
    isPrime: false,
    initials: '1T',
    iconEmoji: '🌌',
    portraitUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Trillionaire Sandbox',
      initials: '1T',
      badgeColor: '#ec4899',
      badge: '🌌 TRILLION EMPIRE',
      iconEmoji: '🌌',
      quote: 'One trillion dollars.',
      category: 'scale',
    }),
    badge: '🌌 TRILLION EMPIRE',
    badgeColor: '#ec4899',
    accentGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
    signatureAsset: 'Orbital Cities, Fusion Grids & Megacities',
    quote: '“One trillion dollars is enough to construct humanity’s first off-world colonies.”',
    description: 'Open sandbox starting with $1,000,000,000,000 with civilization-scale infrastructure unlocked early.',
  },
  {
    id: 'billionaire',
    name: 'Billionaire Sandbox',
    moniker: 'Classic $100B Wealth Run',
    fortuneFormatted: '$100,000,000,000',
    startingCash: 100_000_000_000,
    category: 'scale',
    isPrime: false,
    initials: '100B',
    iconEmoji: '💰',
    portraitUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=480&q=80',
    fallbackSeedUrl: generateRichPersonSvg({
      name: 'Billionaire Sandbox',
      initials: '100B',
      badgeColor: '#10b981',
      badge: '💰 $100B CLASSIC',
      iconEmoji: '💰',
      quote: 'Spend it and build an empire.',
      category: 'scale',
    }),
    badge: '💰 $100B CLASSIC',
    badgeColor: '#10b981',
    accentGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)',
    signatureAsset: 'Skyscrapers, Pro Sports Teams & Banks',
    quote: '“Spend it, invest it, and build a multi-generational corporate dynasty.”',
    description: 'Start with $100 Billion cash and build an empire across property, industry, and high finance.',
  },
];

export const PRIME_TITANS = RICH_PEOPLE_CATALOG.filter((p) => p.isPrime);
export const OTHER_RICH_PEOPLE = RICH_PEOPLE_CATALOG.filter((p) => !p.isPrime);

export function getRichPersonProfile(id: ScenarioId): RichPersonProfile | undefined {
  return RICH_PEOPLE_CATALOG.find((p) => p.id === id);
}
