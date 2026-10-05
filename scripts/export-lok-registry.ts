/**
 * Publisher for the LOK Card Universe (see Lok-EcoSystsem/LokToken EcoSystem/
 * LOK_PLATFORMS.md). Maps the Firstlight LOKdex onto the shared SDK's
 * `PublishCard` shape -- each card's pixel-grid sprite is its art recipe, so
 * every other LOK game redraws the real model. The SDK builds the SQL.
 *
 *   npx tsx scripts/export-lok-registry.ts <outDir>
 *
 * The SDK is vendored at lib/lok-universe (sync it from Lok-EcoSystsem/universe-sdk).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildCardsSql, type PublishCard } from '../lib/lok-universe/src/publish';
import type { PlatformManifest } from '../lib/lok-universe/src/types';
import { lokDexEntries } from '../data/lokdex';
import { lokDexReleases } from '../data/lokdex-editions';
import { pixelPetSprites } from '../data/pixel-pet-sprites';
import { pixelPetSpritesWave2 } from '../data/pixel-pet-sprites-wave2';
import { pixelPetSpritesWave3 } from '../data/pixel-pet-sprites-wave3';

const platform = JSON.parse(readFileSync(new URL('../lok.universe.json', import.meta.url), 'utf8')) as PlatformManifest;
const sprites = [...pixelPetSprites, ...pixelPetSpritesWave2, ...pixelPetSpritesWave3];

const cards: PublishCard[] = lokDexEntries.map((entry) => {
  const sprite = sprites.find((candidate) => candidate.aliases?.includes(entry.id) || candidate.petId === entry.companionCustomizationId);
  return {
    slug: entry.id.replace(/:/g, '-'),
    name: entry.name,
    description: entry.description,
    rarity: entry.rarity,
    setId: entry.setId,
    setName: lokDexReleases.find((release) => release.id === entry.setId)?.name ?? entry.setId,
    cardNumber: String(entry.number).padStart(3, '0'),
    tags: entry.tags,
    role: 'companion',
    acquisition: entry.acquisition,
    art: sprite ? { kind: 'pixel-grid', grid: sprite.grid, palette: sprite.palette, motion: sprite.animation.idle } : null,
    metadata: { species: entry.species, generation: entry.generation, powerProfile: { ...entry.cardStats } },
  };
});

const outDir = process.argv[2] ?? '.';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'spendutall.cards.sql'), buildCardsSql(platform, cards));
console.log(`${cards.length} cards (${cards.filter((card) => !card.art).length} without art) -> ${outDir}`);
