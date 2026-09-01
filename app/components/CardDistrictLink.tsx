'use client';

import { usePathname } from 'next/navigation';

export function CardDistrictLink() {
  const pathname = usePathname();
  if (pathname?.startsWith('/cards')) return null;

  return <aside className="card-district-link" aria-label="Card Shop access">
    <a href="/cards">
      <span className="card-district-icon">🃏</span>
      <span className="card-district-copy"><b>Cards & LOKDEX</b><small>Shop · packs · binder · collection</small></span>
      <span className="card-district-enter">Enter →</span>
    </a>
  </aside>;
}
