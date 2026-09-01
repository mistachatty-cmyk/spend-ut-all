'use client';

import { badges, collectibleSets, collectibles } from '@/data/meta';
import type { MetaState } from '@/game/meta-types';

export function CollectionView({ meta, onEquipTitle, onToggleBadge }: { meta: MetaState; onEquipTitle: (title: string | null) => void; onToggleBadge: (id: string) => void }) {
  const completion = collectibles.length ? Math.round((meta.collectibles.length / collectibles.length) * 100) : 0;

  return <section className="collection-shell">
    <section className="panel collection-hero">
      <div><span className="eyebrow">LEGACY COLLECTION</span><h2>Your empire leaves artifacts behind</h2><p>Badges, titles and collectibles survive individual runs. Secret discoveries stay hidden until you trigger them.</p></div>
      <div className="collection-stats"><span><b>{meta.badges.length}</b> badges</span><span><b>{meta.collectibles.length}/{collectibles.length}</b> relics</span><span><b>{meta.completedSets.length}</b> sets</span><span><b>{completion}%</b> museum</span></div>
    </section>

    <section className="collection-grid">
      <section className="panel"><span className="eyebrow">BADGES</span><h2>Accomplishments</h2><p className="muted">Tap an earned badge to pin or unpin it. Up to three can be showcased.</p><div className="badge-grid">{badges.map((badge) => {
        const earned = meta.badges.includes(badge.id);
        const hidden = badge.hidden && !earned;
        const pinned = meta.showcaseBadges.includes(badge.id);
        return <button key={badge.id} disabled={!earned} className={`badge-card rarity-${earned ? badge.rarity : 'locked'} ${pinned ? 'pinned' : ''}`} onClick={() => onToggleBadge(badge.id)}><span className="badge-emoji">{hidden ? '❓' : earned ? badge.emoji : '🔒'}</span><b>{hidden ? '???' : badge.name}</b><small>{hidden ? 'Secret requirement' : badge.description}</small>{pinned ? <em>SHOWCASED</em> : null}</button>;
      })}</div></section>

      <aside className="side-stack"><section className="panel"><span className="eyebrow">TITLE</span><h2>{meta.equippedTitle ?? 'No title equipped'}</h2><div className="title-list"><button className={!meta.equippedTitle ? 'active' : ''} onClick={() => onEquipTitle(null)}>None</button>{meta.titles.map((title) => <button key={title} className={meta.equippedTitle === title ? 'active' : ''} onClick={() => onEquipTitle(title)}>{title}</button>)}</div></section><section className="panel"><span className="eyebrow">SHOWCASE</span><h2>{meta.showcaseBadges.length}/3 badges</h2><div className="showcase-row">{meta.showcaseBadges.map((id) => { const badge = badges.find((entry) => entry.id === id); return badge ? <span key={id} title={badge.name}>{badge.emoji}</span> : null; })}{meta.showcaseBadges.length === 0 ? <small>Pin earned badges to display them here.</small> : null}</div></section></aside>
    </section>

    <section className="panel museum-panel"><span className="eyebrow">TROPHY ROOM</span><h2>Collectibles</h2><div className="relic-grid">{collectibles.map((item) => {
      const owned = meta.collectibles.includes(item.id);
      const hidden = item.hidden && !owned;
      return <article key={item.id} className={`relic-card rarity-${owned ? item.rarity : 'locked'}`}><span>{hidden ? '❓' : owned ? item.emoji : '🔒'}</span><div><b>{hidden ? 'Unknown Relic' : item.name}</b><small>{hidden ? 'Discover it through unusual play.' : item.description}</small>{owned ? <em>{item.rarity}</em> : null}</div></article>;
    })}</div></section>

    <section className="panel"><span className="eyebrow">SETS</span><h2>Complete collections for titles</h2><div className="set-grid">{collectibleSets.map((set) => {
      const count = set.collectibleIds.filter((id) => meta.collectibles.includes(id)).length;
      const done = meta.completedSets.includes(set.id);
      return <article className={done ? 'set-card complete-set' : 'set-card'} key={set.id}><span>{set.emoji}</span><div><b>{set.name}</b><small>{set.description}</small><div className="set-progress"><i style={{ width: `${(count / set.collectibleIds.length) * 100}%` }} /></div><em>{count}/{set.collectibleIds.length}{set.titleReward ? ` · ${done ? 'Unlocked' : 'Reward'}: ${set.titleReward}` : ''}</em></div></article>;
    })}</div></section>
  </section>;
}
