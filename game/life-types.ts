export type LifeSkillId =
  | 'general-labor'
  | 'hospitality'
  | 'sales'
  | 'creative'
  | 'technology'
  | 'finance'
  | 'management'
  | 'trades'
  | 'media'
  | 'real-estate';

export type LifeStatId = 'grit' | 'focus' | 'people' | 'knowledge' | 'adaptability';

export type LifeBackgroundId =
  | 'blank-slate'
  | 'grinder'
  | 'people-person'
  | 'maker'
  | 'creative-starter'
  | 'digital-native';

export type HousingKind = 'informal' | 'temporary' | 'rent' | 'lease' | 'owned';

export type HousingDefinition = {
  id: string;
  name: string;
  emoji: string;
  kind: HousingKind;
  description: string;
  upfrontCost: number;
  dailyCost: number;
  purchasePrice?: number;
  stability: number;
  focusBonus: number;
  recoveryBonus: number;
};

export type LifeSkillProgress = Record<LifeSkillId, number>;
export type LifeStats = Record<LifeStatId, number>;

export type SimNeedId = 'energy' | 'hunger' | 'health' | 'happiness' | 'social';
export type SimNeeds = Record<SimNeedId, number>;

export type SimMoodTier = 'ecstatic' | 'inspired' | 'content' | 'strained' | 'exhausted';

export type SimMoodInfo = {
  tier: SimMoodTier;
  score: number;
  label: string;
  emoji: string;
  color: string;
  bonusXpMultiplier: number;
  incomeMultiplier: number;
  description: string;
};

export type SimActionCategory = 'rest' | 'dining' | 'fitness' | 'leisure';

export type SimActionDefinition = {
  id: string;
  name: string;
  emoji: string;
  category: SimActionCategory;
  description: string;
  cost: number;
  durationMinutes: number;
  requiresFurnishingId?: string;
  needsImpact: Partial<SimNeeds>;
  skillXpImpact?: Partial<Record<LifeSkillId, number>>;
  fameReward?: number;
};

export type HomeFurnishingCategory = 'bed' | 'kitchen' | 'workstation' | 'wellness' | 'entertainment' | 'luxury';

export type HomeFurnishing = {
  id: string;
  name: string;
  emoji: string;
  category: HomeFurnishingCategory;
  price: number;
  description: string;
  perkSummary: string;
  energyBonus: number;
  focusBonus: number;
  dailyHappinessBonus: number;
  dailyHealthBonus: number;
  dailyFameBonus: number;
};

export type RelationshipContactId =
  | 'maya-tech'
  | 'leo-fitness'
  | 'sophie-creative'
  | 'marcus-broker'
  | 'elena-realtor'
  | 'alex-romance';

export type RelationshipLevel = 'stranger' | 'acquaintance' | 'friend' | 'confidant' | 'partner';

export type RelationshipContactDefinition = {
  id: RelationshipContactId;
  name: string;
  role: string;
  emoji: string;
  avatarColor: string;
  bio: string;
  favoriteGift: string;
  perkDescription: string;
  primarySkill: LifeSkillId;
};

export type RelationshipContactState = {
  id: RelationshipContactId;
  affinity: number; // 0 - 100
  level: RelationshipLevel;
  lastInteractedGameMinute: number;
  giftsGiven: number;
  isDatingOrPartner?: boolean;
};

export type RelationshipInteractionType = 'text' | 'coffee' | 'dinner' | 'gift' | 'collaborate';

export type VehicleDefinition = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  dailyMaintenance: number;
  description: string;
  prestigeScore: number;
  healthBonus: number;
  socialBonus: number;
  transitSpeedMultiplier: number;
};

export type SimLifeLogEntry = {
  id: string;
  gameMinute: number;
  timestamp: number;
  title: string;
  description: string;
  emoji: string;
  category: 'milestone' | 'career' | 'housing' | 'relationship' | 'achievement' | 'wellness';
};

export type LifeRpgState = {
  enabled: boolean;
  backgroundId: LifeBackgroundId | null;
  stats: LifeStats;
  skillXp: LifeSkillProgress;
  housingId: string;
  ownedHousingIds: string[];
  lastHousingChargeDay: number;
  housingArrears: number;
  lifetimeHousingCost: number;
  needs: SimNeeds;
  furnishingIds: string[];
  contacts: Record<RelationshipContactId, RelationshipContactState>;
  equippedVehicleId: string | null;
  ownedVehicleIds: string[];
  lifeLog: SimLifeLogEntry[];
  lastNeedDecayGameMinute: number;
};
