// Writes this game's LokDex card catalog as the JSON the GSix hub's LokDex
// renders against (apps/hub/lib/lokdex/catalog-spendutall.json in the Gsixhub
// repo), and copies the Firstlight artwork next to it.
//
//   node --experimental-strip-types scripts/export-lokdex-catalog.mjs <hub-app-dir>
//
// Re-run and commit the output in Gsixhub whenever cards are added.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { lokDexEntries } from '../data/lokdex.ts';
import { lokDexEditions } from '../data/lokdex-editions.ts';

const hubDir = process.argv[2];
if (!hubDir) throw new Error('usage: export-lokdex-catalog.mjs <path to Gsixhub/apps/hub>');

const NAMESPACE = 'g6.spend-it-all';
const portableId = (nativeId) => `${NAMESPACE}:${nativeId.replace(/:/g, '-')}`;
const AFFINITY_ACCENT = {
  coin: '#f0c950', work: '#ffa94d', tech: '#4de1ff', nature: '#66d98f', market: '#ff7a9c',
  risk: '#ff5d5d', travel: '#7aa7ff', cosmic: '#b58bff', mystery: '#e9d8ff',
};
const artDir = join(hubDir, 'public', 'lokdex', 'spendutall');
mkdirSync(artDir, { recursive: true });

const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const numberOf = (entry) => String(entry.number).padStart(3, '0');

const cards = lokDexEntries.map((entry) => {
  const folder = `${numberOf(entry)}-${slugOf(entry.name)}`;
  copyFileSync(join('public', 'assets', 'loopers', 'g1', folder, 'master.svg'), join(artDir, `${numberOf(entry)}.svg`));
  return {
    id: portableId(entry.id),
    number: `SIA-G${entry.generation}-${numberOf(entry)}`,
    name: entry.name,
    subtitle: entry.species,
    description: entry.description,
    rarity: entry.rarity,
    kind: 'character',
    set: entry.setId,
    tags: [entry.affinity, entry.archetype],
    accent: AFFINITY_ACCENT[entry.affinity],
    art: `/lokdex/spendutall/${numberOf(entry)}.svg`,
  };
});

const byNative = new Map(lokDexEntries.map((entry) => [entry.id, entry]));
for (const [index, edition] of lokDexEditions.entries()) {
  const base = byNative.get(edition.baseCharacterId);
  cards.push({
    id: portableId(edition.id),
    number: `SIA-ED-${String(index + 1).padStart(3, '0')}`,
    name: edition.name,
    subtitle: base ? `${base.name} edition` : 'Edition',
    description: edition.description,
    rarity: edition.rarityOverride ?? base?.rarity ?? 'rare',
    kind: 'edition',
    set: edition.releaseId,
    tags: edition.tags.slice(0, 2),
    accent: base ? AFFINITY_ACCENT[base.affinity] : undefined,
    art: base ? `/lokdex/spendutall/${numberOf(base)}.svg` : undefined,
  });
}

const catalog = {
  appKey: 'spendutall',
  name: 'Spend It All',
  sets: [
    { id: 'lok-gen1-firstlight', name: 'Firstlight (Gen 1)' },
    { id: 'lok-capsule-spinbot-boardroom', name: "Spinbot's Boardroom Breakout" },
  ],
  cards,
};
writeFileSync(join(hubDir, 'lib', 'lokdex', 'catalog-spendutall.json'), `${JSON.stringify(catalog, null, 1)}\n`);
console.log(`wrote ${cards.length} cards`);
