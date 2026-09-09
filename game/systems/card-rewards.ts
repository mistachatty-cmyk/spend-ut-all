import { lokPets } from "@/data/customizations";
import type {
  CardCreditReward,
  CardCreditRewardSource,
  CardGameplayLedger,
  CardShopState,
  CompanionQuest,
  CompanionQuestBonus,
  CompanionQuestKind,
  CompanionQuestSnapshot,
} from "../card-shop-types";
import type { LokPetDefinition } from "../customization-types";
import type { GameState } from "../types";
import { gameDay } from "./time-simulation";
import {
  ensureCardShopStarterGrant,
  normalizeCardShopState,
} from "./card-shop";

const INCOME_MILESTONES = [
  100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
  1_000_000_000,
];

function deterministicNumber(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function businessCount(state: GameState) {
  return Object.values(state.businesses ?? {}).filter(
    (business) => business.founded,
  ).length;
}

function totalOwned(state: GameState) {
  return Object.values(state.owned ?? {}).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
}

function incomeTier(income: number) {
  return INCOME_MILESTONES.filter((milestone) => income >= milestone).length;
}

function rewardTotal(rewards: CardCreditReward[]) {
  return rewards.reduce((sum, reward) => sum + reward.amount, 0);
}

export function grantCardCredits(
  input: CardShopState,
  amount: number,
  source: CardCreditRewardSource,
  label: string,
  id: string,
  companionId?: string,
) {
  const shop = ensureCardShopStarterGrant(input);
  if (shop.recentCreditRewards.some((reward) => reward.id === id)) return shop;
  const safeAmount = Math.max(0, Math.floor(amount));
  if (!safeAmount) return shop;
  const reward: CardCreditReward = {
    id,
    amount: safeAmount,
    source,
    label,
    companionId,
    awardedAt: Date.now(),
  };
  const companionReward =
    source === "companion-gift" || source === "companion-quest";
  return normalizeCardShopState({
    ...shop,
    credits: shop.credits + safeAmount,
    lifetimeCreditsEarned: shop.lifetimeCreditsEarned + safeAmount,
    creditsFromGameplay:
      shop.creditsFromGameplay + (companionReward ? 0 : safeAmount),
    creditsFromCompanions:
      shop.creditsFromCompanions + (companionReward ? safeAmount : 0),
    recentCreditRewards: [reward, ...shop.recentCreditRewards].slice(0, 16),
  });
}

function defaultLedger(state: GameState): CardGameplayLedger {
  return {
    runId: String(state.createdAt),
    lastGameDay: 1,
    activitiesProcessed: 0,
    timeEventsProcessed: 0,
    marketEventsProcessed: 0,
    incomeTierProcessed: 0,
    lastCompanionGiftDay: 1,
  };
}

export function syncBaseGameCardRewards(
  input: CardShopState,
  state: GameState,
  companionId: string,
) {
  let shop = ensureCardShopStarterGrant(input);
  const runId = String(state.createdAt);
  const savedLedger = shop.gameplayLedgers.find(
    (entry) => entry.runId === runId,
  );
  const ledger = savedLedger ?? defaultLedger(state);
  const rewards: CardCreditReward[] = [];
  const add = (
    amount: number,
    source: CardCreditRewardSource,
    label: string,
    id: string,
    rewardCompanionId?: string,
  ) => {
    const before = shop.credits;
    shop = grantCardCredits(shop, amount, source, label, id, rewardCompanionId);
    if (shop.credits > before) rewards.push(shop.recentCreditRewards[0]);
  };

  const activityDelta = Math.max(
    0,
    state.cardGameplay.activitiesCompleted - ledger.activitiesProcessed,
  );
  if (activityDelta)
    add(
      activityDelta * 8,
      "activity",
      `${activityDelta} completed ${activityDelta === 1 ? "activity" : "activities"}`,
      `${runId}:activities:${state.cardGameplay.activitiesCompleted}`,
    );

  const timeEventDelta = Math.max(
    0,
    state.cardGameplay.timeEventsEncountered - ledger.timeEventsProcessed,
  );
  const marketEventDelta = Math.max(
    0,
    state.cardGameplay.marketEventsEncountered - ledger.marketEventsProcessed,
  );
  const eventDelta = timeEventDelta + marketEventDelta;
  if (eventDelta)
    add(
      eventDelta * 12,
      "world-event",
      `${eventDelta} city ${eventDelta === 1 ? "event" : "events"} experienced`,
      `${runId}:events:${state.cardGameplay.timeEventsEncountered}:${state.cardGameplay.marketEventsEncountered}`,
    );

  const nextIncomeTier = incomeTier(state.lifetimeIncome);
  for (
    let tier = ledger.incomeTierProcessed;
    tier < nextIncomeTier;
    tier += 1
  ) {
    const milestone = INCOME_MILESTONES[tier];
    add(
      18 + tier * 7,
      "income-milestone",
      `$${milestone.toLocaleString()} earned in this run`,
      `${runId}:income:${milestone}`,
    );
  }

  const today = gameDay(state.time);
  for (let day = Math.max(2, ledger.lastGameDay + 1); day <= today; day += 1) {
    add(
      18 + Math.min(32, day * 2),
      "day-end",
      `Day ${day - 1} wrap-up`,
      `${runId}:day:${day - 1}`,
    );
    const giftRoll = deterministicNumber(`${runId}:${companionId}:${day}`);
    if (giftRoll % 3 === 0) {
      const pet =
        lokPets.find((entry) => entry.id === companionId) ?? lokPets[0];
      const amount = 24 + (giftRoll % 4) * 8;
      add(
        amount,
        "companion-gift",
        `${pet.name} found a few Card Credits`,
        `${runId}:gift:${companionId}:${day}`,
        companionId,
      );
    }
  }

  const nextLedger: CardGameplayLedger = {
    runId,
    lastGameDay: Math.max(ledger.lastGameDay, today),
    activitiesProcessed: Math.max(
      ledger.activitiesProcessed,
      state.cardGameplay.activitiesCompleted,
    ),
    timeEventsProcessed: Math.max(
      ledger.timeEventsProcessed,
      state.cardGameplay.timeEventsEncountered,
    ),
    marketEventsProcessed: Math.max(
      ledger.marketEventsProcessed,
      state.cardGameplay.marketEventsEncountered,
    ),
    incomeTierProcessed: Math.max(ledger.incomeTierProcessed, nextIncomeTier),
    lastCompanionGiftDay: Math.max(ledger.lastCompanionGiftDay, today),
  };
  const ledgers = [
    ...shop.gameplayLedgers.filter((entry) => entry.runId !== runId),
    nextLedger,
  ].slice(-8);
  shop = normalizeCardShopState({ ...shop, gameplayLedgers: ledgers });
  const ledgerChanged =
    !savedLedger ||
    nextLedger.lastGameDay !== ledger.lastGameDay ||
    nextLedger.activitiesProcessed !== ledger.activitiesProcessed ||
    nextLedger.timeEventsProcessed !== ledger.timeEventsProcessed ||
    nextLedger.marketEventsProcessed !== ledger.marketEventsProcessed ||
    nextLedger.incomeTierProcessed !== ledger.incomeTierProcessed;
  return {
    shop,
    rewards,
    creditsAwarded: rewardTotal(rewards),
    changed: ledgerChanged || rewards.length > 0,
  };
}

function questMetric(state: GameState, kind: CompanionQuestKind) {
  if (kind === "earn") return state.lifetimeIncome;
  if (kind === "activities") return state.cardGameplay.activitiesCompleted;
  if (kind === "spend") return state.totalSpent;
  if (kind === "businesses") return businessCount(state);
  return gameDay(state.time);
}

function questKindFor(
  pet: LokPetDefinition,
  sequence: number,
): CompanionQuestKind {
  if (pet.advisorRole === "money") return sequence % 2 ? "spend" : "earn";
  if (pet.advisorRole === "work") return "activities";
  if (pet.advisorRole === "risk") return sequence % 2 ? "businesses" : "spend";
  if (pet.advisorRole === "travel") return "days";
  return (["earn", "activities", "businesses"] as const)[sequence % 3];
}

function createCompanionQuest(
  shop: CardShopState,
  state: GameState,
  companionId: string,
): CompanionQuest {
  const pet = lokPets.find((entry) => entry.id === companionId) ?? lokPets[0];
  const sequence = shop.completedCompanionQuestIds.length;
  const kind = questKindFor(pet, sequence);
  const startValue = questMetric(state, kind);
  const delta =
    kind === "earn"
      ? Math.max(
          100,
          Math.min(
            10_000_000,
            Math.ceil(Math.max(100, state.lifetimeIncome * 0.2) / 10) * 10,
          ),
        )
      : kind === "spend"
        ? Math.max(
            75,
            Math.min(
              10_000_000,
              Math.ceil(Math.max(75, state.totalSpent * 0.12) / 5) * 5,
            ),
          )
        : kind === "activities"
          ? 3
          : kind === "businesses"
            ? 1
            : 2;
  const copy = {
    earn: [
      "Build the Pot",
      `Earn $${delta.toLocaleString()} through normal play.`,
    ],
    activities: ["Put in the Work", `Complete ${delta} scheduled activities.`],
    spend: [
      "Keep It Moving",
      `Spend $${delta.toLocaleString()} anywhere in the city.`,
    ],
    businesses: [
      "Open the Doors",
      `Found ${delta} new ${delta === 1 ? "business" : "businesses"}.`,
    ],
    days: [
      "Stay the Course",
      `Reach ${delta} more in-game ${delta === 1 ? "day" : "days"}.`,
    ],
  }[kind];
  const credits = 55 + Math.min(45, sequence * 3);
  const cashBonus = Math.max(
    75,
    Math.min(
      50_000_000,
      Math.round(Math.max(75, state.cash * 0.08, state.lifetimeIncome * 0.025)),
    ),
  );
  return {
    id: `${state.createdAt}:${companionId}:${sequence + 1}`,
    runId: String(state.createdAt),
    companionId,
    title: `${pet.name}: ${copy[0]}`,
    description: copy[1],
    kind,
    startValue,
    target: delta,
    credits,
    cashBonus,
    createdAt: Date.now(),
  };
}

export function ensureCompanionQuest(
  input: CardShopState,
  state: GameState,
  companionId: string,
) {
  const shop = ensureCardShopStarterGrant(input);
  const active = shop.activeCompanionQuest;
  if (
    active?.runId === String(state.createdAt) &&
    active.companionId === companionId
  )
    return shop;
  return normalizeCardShopState({
    ...shop,
    activeCompanionQuest: createCompanionQuest(shop, state, companionId),
  });
}

export function companionQuestSnapshot(
  input: CardShopState,
  state: GameState,
): CompanionQuestSnapshot | null {
  const quest = input.activeCompanionQuest;
  if (!quest || quest.runId !== String(state.createdAt)) return null;
  const progress = Math.max(
    0,
    questMetric(state, quest.kind) - quest.startValue,
  );
  return {
    ...quest,
    progress: Math.min(quest.target, progress),
    complete: progress >= quest.target,
  };
}

export function claimCompanionQuest(
  input: CardShopState,
  state: GameState,
  bonus: CompanionQuestBonus,
) {
  const snapshot = companionQuestSnapshot(input, state);
  if (
    !snapshot?.complete ||
    input.completedCompanionQuestIds.includes(snapshot.id)
  )
    return { success: false as const, shop: input, state };
  const pet =
    lokPets.find((entry) => entry.id === snapshot.companionId) ?? lokPets[0];
  let shop = grantCardCredits(
    input,
    snapshot.credits,
    "companion-quest",
    `${pet.name} quest completed`,
    `quest:${snapshot.id}`,
    snapshot.companionId,
  );
  let nextState = state;
  if (bonus === "cash")
    nextState = {
      ...state,
      cash: state.cash + snapshot.cashBonus,
      lifetimeIncome: state.lifetimeIncome + snapshot.cashBonus,
      peakCash: Math.max(state.peakCash, state.cash + snapshot.cashBonus),
      updatedAt: Date.now(),
    };
  if (bonus === "business-boost")
    nextState = {
      ...state,
      cardGameplay: {
        ...state.cardGameplay,
        businessBoostMultiplier: 1.25,
        businessBoostUntilGameMinute:
          Math.max(
            state.cardGameplay.businessBoostUntilGameMinute,
            state.time.gameMinute,
          ) + state.time.settings.dayLengthMinutes,
      },
      updatedAt: Date.now(),
    };
  if (bonus === "card-pack")
    shop = normalizeCardShopState({
      ...shop,
      cardPackVouchers: shop.cardPackVouchers + 1,
    });
  shop = normalizeCardShopState({
    ...shop,
    activeCompanionQuest: null,
    completedCompanionQuestIds: [
      ...shop.completedCompanionQuestIds,
      snapshot.id,
    ].slice(-80),
  });
  return {
    success: true as const,
    shop,
    state: nextState,
    creditsAwarded: snapshot.credits,
    cashAwarded: bonus === "cash" ? snapshot.cashBonus : 0,
  };
}

export function cardCreditEarningSummary() {
  return [
    "8 CC per completed activity",
    "12 CC per world or city event",
    "Day-end stipend that grows to 50 CC",
    "Income milestone rewards",
    "Occasional deterministic companion gifts",
    "Companion quests with a choice bonus",
  ];
}

export function companionForId(companionId: string) {
  return lokPets.find((entry) => entry.id === companionId) ?? lokPets[0];
}

export function ownedItemCount(state: GameState) {
  return totalOwned(state);
}
