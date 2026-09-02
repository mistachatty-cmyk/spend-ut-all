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
};
