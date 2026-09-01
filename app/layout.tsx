import type { Metadata } from 'next';
import { DiscoveryNotifier } from '@/app/components/DiscoveryNotifier';
import { MicroAnimationLayer } from '@/app/components/MicroAnimationLayer';
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
import './lokdex.css';
import './card-shop.css';
import './card-releases.css';
import './micro-animations.css';
import './debt.css';

export const metadata: Metadata = {
  title: 'Spend It All',
  description: 'A wealth, business, building, and economy incremental sandbox.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<DiscoveryNotifier /><MicroAnimationLayer /></body></html>;
}
