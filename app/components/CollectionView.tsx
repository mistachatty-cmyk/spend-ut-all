'use client';

import { badges, collectibleSets, collectibles } from '@/data/meta';
import { money } from '@/game/format';
import type { MetaState } from '@/game/meta-types';
import { nextTrophyRoomTier, trophyRoomProgress, trophyRoomTier } from '@/game/systems/trophy-room';

export function CollectionView({ meta, onEquipTitle, onToggleBadge }: { meta: MetaState; onEquipTitle: (title: string | null) => void; onToggleBadge: (id: string) => void }) {
  const completion = collectibles.length ? Math.round((meta.collectibles.length / collectibles.length) * 100) : 0;
  const room = trophyRoomTier(meta);
  const nextRoom = nextTrophyRoomTier(meta);
  const roomProgress = trophyRoomProgress(meta);

  return <section className="collection-shell">
    <section className="panel collection-hero">
      <div><span className="eyebrow">LEGACY COLLECTION</span><h2>Your empire leaves artifacts behind</h2><p>Badges, titles and collectibles survive individual runs. Secret discoveries stay hidden until you trigger them.</p></div>
      <div className="collection-stats"><span><b>{meta.badges.length}</b> badges</span><span><b>{meta.collectibles.length}/{collectibles.length}</b> relics</span><span><b>{meta.completedSets.length}</b> sets</span><span><b>{completion}%</b> museum</span></div>
    </section>

    <section className="panel trophy-room-card">
      <div className="trophy-room-icon">{room.emoji}</div>
      <div className="trophy-room-copy"><span className="eyebrow">TROPHY ROOM · LEVEL {room.level}</span><h2>{room.name}</h2><p>{room.description}</p><small>{room.capacityLabel}</small></div>
      <div className="trophy-room-next">{nextRoom ? <><span>Next: {nextRoom.name}</span><div className="set-progress"><i style={{ width: `${roomProgress * 100}%` }} /></div><small>{meta.collectibles.length}/{nextRoom.requiredCollectibles} relics · {meta.completedSets.length}/{nextRoom.requiredSets} sets</small></> : <div className="complete">Maximum archive tier reached</div>}</div>
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

    <section className="panel museum-panel"><span className="eyebrow">{room.name.toUpperCase()}</span><h2>Collectibles & provenance</h2><div className="relic-grid">{collectibles.map((item) => {
      const owned = meta.collectibles.includes(item.id);
      const hidden = item.hidden && !owned;
      const discovery = meta.discoveries.find((entry) => entry.kind === 'collectible' && entry.id === item.id);
      return <article key={item.id} className={`relic-card rarity-${owned ? item.rarity : 'locked'}`}><span>{hidden ? '❓' : owned ? item.emoji : '🔒'}</span><div><b>{hidden ? 'Unknown Relic' : item.name}</b><small>{hidden ? 'Discover it through unusual play.' : item.description}</small>{owned ? <em>{item.rarity}</em> : null}{owned && discovery ? <div className="provenance"><strong>PROVENANCE</strong><small>Found {new Date(discovery.discoveredAt).toLocaleDateString()} · {discovery.scenarioId}</small>{discovery.snapshot ? <small>{money(discovery.snapshot.cash)} cash · {money(discovery.snapshot.totalSpent)} spent · City Lv {discovery.snapshot.townLevel} · Region Lv {discovery.snapshot.regionLevel}</small> : <small>Legacy artifact discovered before provenance tracking.</small>}</div> : null}</div></article>;
    })}</div></section>

    <section className="panel"><span className="eyebrow">SETS</span><h2>Complete collections for titles</h2><div className="set-grid">{collectibleSets.map((set) => {
      const count = set.collectibleIds.filter((id) => meta.collectibles.includes(id)).length;
      const done = meta.completedSets.includes(set.id);
      return <article className={done ? 'set-card complete-set' : 'set-card'} key={set.id}><span>{set.emoji}</span><div><b>{set.name}</b><small>{set.description}</small><div className="set-progress"><i style={{ width: `${(count / set.collectibleIds.length) * 100}%` }} /></div><em>{count}/{set.collectibleIds.length}{set.titleReward ? ` · ${done ? 'Unlocked' : 'Reward'}: ${set.titleReward}` : ''}</em></div></article>;
    })}</div></section>

    <section className="panel discovery-log"><span className="eyebrow">DISCOVERY LOG</span><h2>Your empire's weird little history</h2><div className="discovery-feed">{meta.discoveries.slice(0, 12).map((entry) => {
      const definition = entry.kind === 'badge' ? badges.find((item) => item.id === entry.id) : entry.kind === 'collectible' ? collectibles.find((item) => item.id === entry.id) : collectibleSets.find((item) => item.id === entry.id);
      return <article key={`${entry.kind}-${entry.id}`}><span>{definition?.emoji ?? '✨'}</span><div><b>{definition?.name ?? entry.id}</b><small>{entry.kind} · {new Date(entry.discoveredAt).toLocaleString()} · {entry.scenarioId}</small></div></article>;
    })}{meta.discoveries.length === 0 ? <p className="muted">Your first discovery will appear here.</p> : null}</div></section>
  </section>;
}
