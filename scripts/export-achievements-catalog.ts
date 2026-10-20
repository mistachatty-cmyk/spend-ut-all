/**
 * Writes this game's achievement catalog as the JSON the GSix hub's
 * Achievements page renders against (`apps/hub/lib/achievements/catalog-spendutall.json`
 * in the Gsixhub repo), so the hub can show achievements a player has not
 * unlocked yet.
 *
 *   npx tsx scripts/export-achievements-catalog.ts <output.json>
 *
 * Re-run and copy the file whenever achievements are added or reworded.
 * Unlocks themselves are reported separately, see app/hooks/useLokAchievementSync.ts.
 */
import { writeFileSync } from 'node:fs';
import { achievementCategoryMeta, achievements } from '../data/achievement-catalog';

const LOK_APP_KEY = 'spendutall';

const categories = Object.entries(achievementCategoryMeta).map(([id, meta]) => ({ id, label: meta.name }));
const knownCategories = new Set(categories.map((category) => category.id));

const catalog = {
  appKey: LOK_APP_KEY,
  name: 'Spend It All',
  categories,
  achievements: achievements.map((achievement) => ({
    id: achievement.id,
    category: achievement.category && knownCategories.has(achievement.category) ? achievement.category : 'wealth',
    name: achievement.name,
    description: achievement.description,
    icon: achievement.emoji,
    points: achievement.points,
    hidden: achievement.hidden ? true : undefined,
    subgroup: achievement.subgroup,
  })),
};

const out = process.argv[2];
if (!out) throw new Error('usage: export-achievements-catalog.ts <output.json>');
writeFileSync(out, `${JSON.stringify(catalog, null, 1)}\n`);
console.log(`wrote ${catalog.achievements.length} achievements in ${catalog.categories.length} categories to ${out}`);
