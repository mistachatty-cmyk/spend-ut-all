import { achievementCategoryMeta, achievements as coreAchievements } from './achievements';
import { debtAchievements } from './debt-achievements';
import { timeAchievements } from './time-achievements';
import { townAchievements } from './town-achievements';

export { achievementCategoryMeta };
export const achievements = [...coreAchievements, ...timeAchievements, ...debtAchievements, ...townAchievements];
