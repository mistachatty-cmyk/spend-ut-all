import type {
  LokDexAffinity,
  LokDexArchetype,
  LokDexCardVariant,
} from "./lokdex-types";

export type CardShopProductKind = "pack" | "deck-kit";
export type CardShopReleaseType = "core" | "capsule" | "event" | "collector";

export type CardPackGuarantee = {
  minRarity?: "uncommon" | "rare" | "epic" | "legendary";
  affinity?: LokDexAffinity[];
  archetype?: LokDexArchetype[];
  variantBoost?: number;
  editionChance?: number;
};

export type CardShopProduct = {
  id: string;
  kind: CardShopProductKind;
  name: string;
  emoji: string;
  description: string;
  priceCredits: number;
  cardCount: number;
  accent: string;
  releaseId: string;
  releaseType: CardShopReleaseType;
  guarantee?: CardPackGuarantee;
  fixedCharacterIds?: string[];
  editionPoolIds?: string[];
  deckBlueprintId?: string;
  featured?: boolean;
};

export type CardDeckBlueprint = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  style: string;
  recommendedAffinities: LokDexAffinity[];
  recommendedArchetypes: LokDexArchetype[];
  targetSize: number;
};

export type CardShopPull = {
  instanceId: string;
  characterId: string;
  editionId?: string;
  releaseId?: string;
  variant: LokDexCardVariant;
  rarity: string;
  isNewCharacter: boolean;
};

export type CardCreditRewardSource =
  | "activity"
  | "day-end"
  | "income-milestone"
  | "world-event"
  | "companion-gift"
  | "companion-quest";

export type CardCreditReward = {
  id: string;
  amount: number;
  source: CardCreditRewardSource;
  label: string;
  companionId?: string;
  awardedAt: number;
};

export type CardGameplayLedger = {
  runId: string;
  lastGameDay: number;
  activitiesProcessed: number;
  timeEventsProcessed: number;
  marketEventsProcessed: number;
  incomeTierProcessed: number;
  lastCompanionGiftDay: number;
};

export type CompanionQuestKind =
  | "earn"
  | "activities"
  | "spend"
  | "businesses"
  | "days";
export type CompanionQuestBonus = "cash" | "business-boost" | "card-pack";

export type CompanionQuest = {
  id: string;
  runId: string;
  companionId: string;
  title: string;
  description: string;
  kind: CompanionQuestKind;
  startValue: number;
  target: number;
  credits: number;
  cashBonus: number;
  createdAt: number;
};

export type CompanionQuestSnapshot = CompanionQuest & {
  progress: number;
  complete: boolean;
};

export type CardShopState = {
  version: number;
  credits: number;
  lifetimeCreditsEarned: number;
  lifetimeCreditsSpent: number;
  packsOpened: number;
  cardsPulled: number;
  cardsRecycled: number;
  creditsFromRecycling: number;
  creditsFromCollectionRewards: number;
  creditsFromGameplay: number;
  creditsFromCompanions: number;
  cardPackVouchers: number;
  claimedCollectionMilestones: number[];
  ownedDeckBlueprintIds: string[];
  lastFreePackAt: number;
  freePacksClaimed: number;
  starterGrantClaimed: boolean;
  recentPulls: CardShopPull[];
  recentCreditRewards: CardCreditReward[];
  gameplayLedgers: CardGameplayLedger[];
  activeCompanionQuest: CompanionQuest | null;
  completedCompanionQuestIds: string[];
};
