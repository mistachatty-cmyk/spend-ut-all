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
import './settings.css';
import './custom-scenarios.css';
import './customizations.css';
import './pixel-pets.css';
import './looper-animations.css';
import './looper-showcase.css';
import './lokdex.css';
import './card-shop.css';
import './card-releases.css';
import './micro-animations.css';
import './effects-levels.css';
import './debt.css';
import './game-shell.css';
import './card-access.css';
import './card-district-access.css';
import './advanced-interface.css';

export const metadata: Metadata = {
  title: 'Spend It All',
  description: 'A wealth, business, building, and economy incremental sandbox.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f4f5f7',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-effects-level="1" data-interface-mode="simple"><body><CardDistrictLink /><StarterCompanionPrompt />{children}<AdvancedInterfaceControl /><DiscoveryNotifier /><MicroAnimationLayer /></body></html>;
}
