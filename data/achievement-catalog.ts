import { achievementCategoryMeta, achievements as coreAchievements } from './achievements';
import { timeAchievements } from './time-achievements';

export { achievementCategoryMeta };
export const achievements = [...coreAchievements, ...timeAchievements];
