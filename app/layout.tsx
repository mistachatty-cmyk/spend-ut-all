import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spend It All',
  description: 'A wealth, business, building, and economy incremental sandbox.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
