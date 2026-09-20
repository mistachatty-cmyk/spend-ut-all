import type { Metadata, Viewport } from 'next';
import { AdvancedInterfaceControl } from '@/app/components/AdvancedInterfaceControl';
import { CardDistrictLink } from '@/app/components/CardDistrictLink';
import { DiscoveryNotifier } from '@/app/components/DiscoveryNotifier';
import { MicroAnimationLayer } from '@/app/components/MicroAnimationLayer';
import { StarterCompanionPrompt } from '@/app/components/StarterCompanionPrompt';
import './globals.css';
import './empire.css';
import './collection.css';
import './businesses.css';
import './money.css';
import './achievements.css';
import './time.css';
import './life-rpg.css';
import './settings.css';
import './custom-scenarios.css';
import './customizations.css';
import './pixel-pets.css';
import './looper-animations.css';
import './looper-hd.css';
import './looper-character-motion.css';
import './looper-signature-fx.css';
import './looper-vector-runtime.css';
import './looper-showcase.css';
import './looper-card-art.css';
import './lokdex.css';
import './card-shop.css';
import './card-releases.css';
import './card-universe-exchange.css';
import './micro-animations.css';
import './town-community.css';
import './fame-view.css';
import './effects-levels.css';
import './debt.css';
import './game-shell.css';
import './card-access.css';
import './card-district-access.css';
import './advanced-interface.css';
import './purchase-visuals.css';
import './pixel-purchase-integrations.css';
import './purchase-visual-integrations.css';
import './interface-style-deck.css';
import './rich-people.css';

export const metadata: Metadata = {
  title: 'Spend It All – Spend Billionaire Money & Wealth Simulator',
  description: 'Spend billionaire fortunes or climb from $0 in this incremental economy and life simulation game featuring customizable avatars, sim needs & routines, interior furnishings, relationships, and vehicles.',
  keywords: [
    'spend it all',
    'spend bill gates money',
    'spend elon musk money',
    'spend jeff bezos money',
    'spend billionaire fortune',
    'wealth simulator',
    'billionaire simulator',
    'incremental game',
    'browser game',
    'idle game',
    'time spender game',
    'business tycoon',
    'rich simulator',
  ],
  authors: [{ name: 'Spend It All Studios' }],
  openGraph: {
    type: 'website',
    title: 'Spend It All – Spend Billionaire Money & Wealth Simulator',
    description: 'Spend Bill Gates, Elon Musk, and Jeff Bezos fortunes or build an empire from $0 in this interactive incremental wealth simulator and time spender game.',
    siteName: 'Spend It All',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spend It All – Spend Billionaire Money & Wealth Simulator',
    description: 'Spend billionaire fortunes or climb from $0 in this incremental economy and life simulation game featuring customizable avatars, sim needs & routines, interior furnishings, relationships, and vehicles.',
  },
  other: {
    'application-name': 'Spend It All',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f4f5f7',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['WebApplication', 'VideoGame'],
  name: 'Spend It All',
  alternateName: 'Spend Billionaire Money & Wealth Simulator',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  genre: ['Simulation', 'Incremental', 'Idle', 'Tycoon', 'Time Spender'],
  description: 'Spend Bill Gates, Elon Musk, and Jeff Bezos fortunes or build an empire from $0 in this interactive incremental wealth simulator and time spender game.',
  inLanguage: 'en',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: 'Spend It All Studios',
  },
  playMode: 'SinglePlayer',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" data-effects-level="1" data-interface-mode="simple" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {adsenseClient ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <CardDistrictLink />
        <StarterCompanionPrompt />
        {children}
        <AdvancedInterfaceControl />
        <DiscoveryNotifier />
        <MicroAnimationLayer />
      </body>
    </html>
  );
}
