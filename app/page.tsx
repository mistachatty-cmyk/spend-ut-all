"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dismissGsixVisitTheme, useGsixVisitTheme } from "@/app/hooks/useGsixVisitTheme";
import { visitThemeStyle } from "@/game/systems/gsixVisitTheme";
import { AchievementsView } from "@/app/components/AchievementsView";
import { BusinessView } from "@/app/components/BusinessView";
import { CollectionView } from "@/app/components/CollectionView";
import { CustomScenarioBuilder } from "@/app/components/CustomScenarioBuilder";
import { CustomizationView } from "@/app/components/CustomizationView";
import { DebtView } from "@/app/components/DebtView";
import { EarningsView } from "@/app/components/EarningsView";
import { ExecutiveDeckView } from "@/app/components/ExecutiveDeckView";
import { FamilyOfficeView } from "@/app/components/FamilyOfficeView";
import { FloatingNumbersOverlay } from "@/app/components/FloatingNumbersOverlay";
import { PersistentFollowHud } from "@/app/components/PersistentFollowHud";
import { GameOverView } from "@/app/components/GameOverView";
import { LeaderboardView } from "@/app/components/LeaderboardView";
import { MarketWeatherBanner } from "@/app/components/MarketWeatherBanner";
import { MoneyCounter } from "@/app/components/MoneyCounter";
import { PetCompanion } from "@/app/components/PetCompanion";
import { SettingsView } from "@/app/components/SettingsView";
import { SponsoredAdBanner } from "@/app/components/SponsoredAdBanner";
import { SponsorBoostBar } from "@/app/components/SponsorBoostBar";
import {
  playClickSound,
  playCoinSound,
  playPurchaseSound,
  playAchievementSound,
  playPrayerBellSound,
  toggleAudioMute,
  getAudioSettings,
  type AudioSettings,
} from "@/game/systems/audio-sfx";
import { ReligionFrontPageSection } from "@/app/components/ReligionFrontPageSection";
import { ReligionView } from "@/app/components/ReligionView";
import { ReligionId, getReligionDefinition } from "@/game/systems/religion";
import { emitFloatingNumber } from "@/game/systems/floating-numbers";
import { achievements } from "@/data/achievement-catalog";
import { TownCommunityView } from "@/app/components/TownCommunityView";
import { ItemPhotoModal } from "@/app/components/ItemPhotoModal";
import { RoyaltyFreeLibraryModal } from "@/app/components/RoyaltyFreeLibraryModal";
import { HouseVisualBanner } from "@/app/components/HouseVisualBanner";
import { PurchaseVisual } from "@/app/components/PurchaseVisual";
import { RichPeopleSelector } from "@/app/components/RichPeopleSelector";
import {
  getRichPersonProfile,
  PRIME_TITANS,
  OTHER_RICH_PEOPLE,
} from "@/data/rich-people";
import {
  getPurchaseVisual,
  type PurchaseVisualItem,
} from "@/data/purchase-visuals";
import {
  loadHudPreferences,
  saveHudPreferences,
  subscribeHudPreferences,
  type HudPreferences,
} from "@/game/systems/hud-preferences";
import {
  citySpecializations,
  empireUpgrades,
  houseTiers,
  items,
  regionTiers,
  scenarios,
  townTiers,
} from "@/data/content";
import {
  activeMarketEvent,
  applyOfflineProgress,
  buyItem,
  buyUpgrade,
  canBuyItem,
  canBuyUpgrade,
  chooseCitySpecialization,
  grossIncomePerSecond,
  holdingsValue,
  itemBulkPrice,
  maxAffordableQuantity,
  newCustomGame,
  newGame,
  passiveCashPerSecond,
  scenarioGoalLabel,
  scenarioIsFreeMode,
  totalOwned,
  upkeepPerSecond,
  upgradeCost,
  upgradeHouse,
  upgradeRegion,
  upgradeTown,
  upgradesValue,
} from "@/game/engine";
import {
  advanceWithDebt,
  canSellItemWithDebt,
  leveragedNetWorth,
  scenarioProgressWithDebt,
  sellItemWithDebt,
} from "@/game/debt-runtime";
import { isItemPledged, normalizeDebtState } from "@/game/systems/debt";
import {
  companionQuestSnapshot,
  ensureCompanionQuest,
  claimCompanionQuest,
  syncBaseGameCardRewards,
} from "@/game/systems/card-rewards";
import {
  createCardShopState,
  ensureCardShopStarterGrant,
  loadCardShopState,
  saveCardShopState,
} from "@/game/systems/card-shop";
import { emitMicroMotion } from "@/game/systems/micro-animations";
import {
  createMetaState,
  equipTitle,
  normalizeMetaState,
  syncMetaProgression,
  toggleShowcaseBadge,
} from "@/game/systems/meta-progression";
import {
  addRunResult,
  createRunResult,
  LEADERBOARD_KEY,
  normalizeRunHistory,
} from "@/game/systems/leaderboard";
import {
  createCustomizationInventory,
  equipCustomization,
  loadCustomizationInventory,
  moneyCounterClass,
  saveCustomizationInventory,
  syncCustomizationUnlocks,
  themeClass,
} from "@/game/systems/customizations";
import type { RunResult } from "@/game/run-types";
import { money } from "@/game/format";
import type { MetaState } from "@/game/meta-types";
import type { CustomizationInventory } from "@/game/customization-types";
import type {
  CardShopState,
  CompanionQuestBonus,
} from "@/game/card-shop-types";
import { FinancialMode, GameState, ScenarioId } from "@/game/types";
import { DailyRewardsModal, DailyRewardsView } from "@/app/components/DailyRewardsModal";
import { NotificationCenter } from "@/app/components/NotificationCenter";
import { getDailyCheckInStatus } from "@/game/systems/daily-rewards";
import { detectActiveReminders, loadNotificationPreferences } from "@/game/systems/notifications";

const SAVE_KEY = "spend-it-all-v1";
const META_KEY = "spend-it-all-meta-v1";
type View =
  | "market"
  | "earnings"
  | "businesses"
  | "empire"
  | "town"
  | "religion"
  | "daily"
  | "debt"
  | "achievements"
  | "collection"
  | "familyOffice"
  | "deck"
  | "leaderboard"
  | "customize"
  | "settings";

const EMPIRE_UPGRADE_IMAGES: Record<string, string> = {
  operations: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80',
  automation: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640&q=80',
  brand: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=640&q=80',
  logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=640&q=80',
  'ai-economy': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80',
  'global-trade': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80',
};

export default function Home() {
  const [state, setState] = useState<GameState | null>(null);
  const visitTheme = useGsixVisitTheme();
  const [meta, setMeta] = useState<MetaState>(createMetaState());
  const [metaLoaded, setMetaLoaded] = useState(false);
  const [customization, setCustomization] = useState<CustomizationInventory>(
    createCustomizationInventory(),
  );
  const [customizationLoaded, setCustomizationLoaded] = useState(false);
  const [cardShop, setCardShop] = useState<CardShopState>(() =>
    ensureCardShopStarterGrant(createCardShopState()),
  );
  const [cardShopLoaded, setCardShopLoaded] = useState(false);
  const cardShopRef = useRef(cardShop);
  cardShopRef.current = cardShop;
  const [scenarioId, setScenarioId] = useState<ScenarioId>("nothing");
  const [mode, setMode] = useState<FinancialMode>("simple");
  const [riskMode, setRiskMode] = useState(false);
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<View>("market");
  const [offlineAward, setOfflineAward] = useState(0);
  const [customBuilderOpen, setCustomBuilderOpen] = useState(false);
  const [inMainMenu, setInMainMenu] = useState(false);
  const [scenarioFilter, setScenarioFilter] = useState<"all" | "rich" | "prime" | "build">("all");
  const [sponsorBoostUntil, setSponsorBoostUntil] = useState(0);
  const [dailyRewardsModalOpen, setDailyRewardsModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [nowTime, setNowTime] = useState(() => Date.now());
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => getAudioSettings());
  const [hudPrefs, setHudPrefs] = useState<HudPreferences>(() => loadHudPreferences());
  const [selectedVisual, setSelectedVisual] = useState<PurchaseVisualItem | null>(null);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [selectedReligionId, setSelectedReligionId] = useState<ReligionId | null>("christianity");
  const [customPrayerTimes, setCustomPrayerTimes] = useState<Record<string, string>>({});
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

  useEffect(() => subscribeHudPreferences(setHudPrefs), []);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sponsorBoostRemainingSeconds = Math.max(0, Math.ceil((sponsorBoostUntil - nowTime) / 1000));

  const handleActivateSponsorBoost = (addedMinutes: number) => {
    const nextBoostUntil = Math.max(Date.now(), sponsorBoostUntil) + addedMinutes * 60 * 1000;
    setSponsorBoostUntil(nextBoostUntil);
    setState((current) => {
      if (!current) return current;
      return {
        ...current,
        cardGameplay: {
          ...current.cardGameplay,
          businessBoostUntilGameMinute: current.time.gameMinute + addedMinutes * 4,
          businessBoostMultiplier: 2,
        },
      };
    });
  };
  const recordedWin = useRef<number | null>(null);
  const rewardGameDay = Math.floor(
    (state?.time.gameMinute ?? 0) /
      (state?.time.settings.dayLengthMinutes ?? 1440),
  );
  const rewardIncomeTier = Math.floor(
    Math.log10(Math.max(1, state?.lifetimeIncome ?? 0)),
  );

  useEffect(() => {
    const rawMeta = localStorage.getItem(META_KEY);
    if (rawMeta) {
      try {
        setMeta(normalizeMetaState(JSON.parse(rawMeta)));
      } catch {
        localStorage.removeItem(META_KEY);
      }
    }
    setMetaLoaded(true);
    setCustomization(loadCustomizationInventory());
    setCustomizationLoaded(true);
    setCardShop(ensureCardShopStarterGrant(loadCardShopState()));
    setCardShopLoaded(true);
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const restored = applyOfflineProgress(JSON.parse(raw));
      setOfflineAward(restored.lastOfflineIncome);
      setState(restored);
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }, []);

  useEffect(() => {
    if (state) localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    if (metaLoaded) localStorage.setItem(META_KEY, JSON.stringify(meta));
  }, [meta, metaLoaded]);
  useEffect(() => {
    if (customizationLoaded) saveCustomizationInventory(customization);
  }, [customization, customizationLoaded]);
  useEffect(() => {
    if (cardShopLoaded) saveCardShopState(cardShop);
  }, [cardShop, cardShopLoaded]);
  useEffect(() => {
    if (!state?.started || !cardShopLoaded || !customizationLoaded) return;
    const currentShop = cardShopRef.current;
    const companionId = customization.equipped.petId ?? "pet-lok-slime";
    const synced = syncBaseGameCardRewards(currentShop, state, companionId);
    const withQuest = ensureCompanionQuest(synced.shop, state, companionId);
    if (synced.changed || withQuest !== currentShop) setCardShop(withQuest);
    for (const reward of synced.rewards) {
      emitMicroMotion({
        target: "card-credits",
        amount: reward.amount,
        displayText: `+◫ ${reward.amount}`,
        symbol: reward.source === "companion-gift" ? "🐾" : "◫",
        tone: "reward",
        kind: "reward",
      });
    }
  }, [
    state?.createdAt,
    rewardIncomeTier,
    rewardGameDay,
    state?.cardGameplay.activitiesCompleted,
    state?.cardGameplay.timeEventsEncountered,
    state?.cardGameplay.marketEventsEncountered,
    customization.equipped.petId,
    customizationLoaded,
    cardShopLoaded,
  ]);
  useEffect(() => {
    if (!state || !metaLoaded) return;
    setMeta((current) => {
      const next = syncMetaProgression(current, state, {
        netWorth: leveragedNetWorth(state),
        incomePerSecond: passiveCashPerSecond(state),
        totalOwned: totalOwned(state),
        scenarioComplete: scenarioProgressWithDebt(state) >= 1,
      });
      if (
        next.badges.length === current.badges.length &&
        next.collectibles.length === current.collectibles.length &&
        next.titles.length === current.titles.length &&
        next.completedSets.length === current.completedSets.length &&
        next.scenariosCompleted.length === current.scenariosCompleted.length &&
        next.discoveries.length === current.discoveries.length
      ) {
        return current;
      }
      return next;
    });
  }, [state, metaLoaded]);
  useEffect(() => {
    if (!state || !customizationLoaded) return;
    setCustomization((current) => {
      const next = syncCustomizationUnlocks(current, state);
      if (next.ownedIds.length === current.ownedIds.length) return current;
      return saveCustomizationInventory(next);
    });
  }, [state?.regionLevel, state?.runAchievements, customizationLoaded]);
  useEffect(() => {
    if (
      !state?.started ||
      state.runStatus !== "active" ||
      recordedWin.current === state.createdAt ||
      scenarioIsFreeMode(state) ||
      scenarioProgressWithDebt(state) < 1
    )
      return;
    let history: RunResult[] = [];
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) {
      try {
        history = normalizeRunHistory(JSON.parse(raw));
      } catch {
        history = [];
      }
    }
    localStorage.setItem(
      LEADERBOARD_KEY,
      JSON.stringify(addRunResult(history, createRunResult(state, true))),
    );
    recordedWin.current = state.createdAt;
  }, [state]);
  useEffect(() => {
    if (!state?.started || state.runStatus !== "active") return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - last, 5_000);
      last = now;
      setState((current) =>
        current ? advanceWithDebt(current, delta) : current,
      );
    }, 250);
    return () => window.clearInterval(timer);
  }, [state?.started, state?.runStatus]);

  useEffect(() => {
    if (!state?.religion || !state.religion.notificationsEnabled) return;
    const interval = window.setInterval(() => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todayKey = `${now.toDateString()}_${currentHHMM}`;

      for (const prayer of state.religion?.scheduledPrayers ?? []) {
        if (!prayer.enabled || prayer.completedToday) continue;
        if (prayer.scheduledTime === currentHHMM) {
          const prayerKey = `${prayer.id}_${todayKey}`;
          if (!notifiedPrayersRef.current.has(prayerKey)) {
            notifiedPrayersRef.current.add(prayerKey);
            if (state.religion?.chimeSoundEnabled) {
              playPrayerBellSound();
            }
            try {
              if (typeof window !== "undefined" && "Notification" in window && Notification?.permission === "granted") {
                new Notification(`🕊️ Prayer Time: ${prayer.name}`, {
                  body: `It is your decided time (${prayer.scheduledTime}) for ${prayer.name}. Take a quiet moment for contemplation.`,
                  icon: "/favicon.ico",
                });
              }
            } catch {
              // Notification restricted in iframe
            }
          }
        }
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [state?.religion]);

  const visibleItems = useMemo(
    () =>
      items.filter((item) => category === "all" || item.category === category),
    [category],
  );

  const filteredScenarios = useMemo(() => {
    if (scenarioFilter === "rich") {
      return scenarios.filter((s) =>
        ["bill-gates", "elon-musk", "jeff-bezos", "billionaire", "trillionaire", "elon-prime", "bezos-prime", "gates-prime"].includes(s.id),
      );
    }
    if (scenarioFilter === "prime") {
      return scenarios.filter((s) =>
        ["elon-prime", "bezos-prime", "gates-prime"].includes(s.id),
      );
    }
    if (scenarioFilter === "build") {
      return scenarios.filter((s) =>
        ["nothing", "ten-x", "hundred-x", "thousand-x", "freeplay"].includes(s.id),
      );
    }
    return scenarios;
  }, [scenarioFilter]);

  if (!state?.started || inMainMenu)
    return (
      <main className={visitTheme ? "menu-shell gsix-visit-theme" : "menu-shell"} style={visitTheme ? visitThemeStyle(visitTheme) : undefined}>
        {visitTheme && (
          <p className="gsix-visit-note gsix-visit-note-menu">
            Wearing your GSix theme ·
            <button type="button" onClick={dismissGsixVisitTheme}>Use my Spend It All look</button>
          </p>
        )}
        {customBuilderOpen ? (
          <CustomScenarioBuilder
            onClose={() => setCustomBuilderOpen(false)}
            onStart={(custom) => {
              setOfflineAward(0);
              setView(custom.startingCash === 0 ? "earnings" : "market");
              recordedWin.current = null;
              setCustomBuilderOpen(false);
              setInMainMenu(false);
              setState(newCustomGame(custom, selectedReligionId, customPrayerTimes));
            }}
          />
        ) : (
          <section className="hero-card">
            {state?.started ? (
              <div className="resume-run-card">
                <div>
                  <span className="eyebrow">SAVED RUN IN PROGRESS</span>
                  <h3>Active {state.rules.presetId.toUpperCase()} Empire</h3>
                  <p>Current balance: <b>{money(state.cash)}</b> · Net worth: <b>{money(leveragedNetWorth(state))}</b> · Day {Math.floor((state.time.gameMinute ?? 0) / (state.time.settings?.dayLengthMinutes ?? 1440)) + 1}</p>
                </div>
                <button
                  className="primary"
                  style={{ width: "auto", padding: "12px 24px", fontSize: "15px" }}
                  onClick={() => {
                    playClickSound();
                    setInMainMenu(false);
                  }}
                >
                  ▶ Resume Active Run
                </button>
              </div>
            ) : null}
            <div className="eyebrow">ECONOMIC EMPIRE SANDBOX · LOK READY</div>
            <h1>Spend It All</h1>
            <p className="lead">
              Start from absolutely nothing, multiply a small fortune 10× to
              1,000×, play with no finish line, or spend the vast wealth of real-world billionaires.
              Speedrunner, Wolf Boss, Comeback, Risk, Empire and hidden
              achievements track how you built it.
            </p>

            <div className="mode-row" style={{ marginBottom: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className={scenarioFilter === "rich" ? "pill selected" : "pill"}
                onClick={() => {
                  playClickSound();
                  setScenarioFilter("rich");
                }}
              >
                💰 Spend Fortunes of The Rich ({PRIME_TITANS.length + OTHER_RICH_PEOPLE.length})
              </button>
              <button
                type="button"
                className={scenarioFilter === "prime" ? "pill selected" : "pill"}
                onClick={() => {
                  playClickSound();
                  setScenarioFilter("prime");
                }}
              >
                ⚡ Prime Titans Peak (3)
              </button>
              <button
                type="button"
                className={scenarioFilter === "build" ? "pill selected" : "pill"}
                onClick={() => {
                  playClickSound();
                  setScenarioFilter("build");
                }}
              >
                📈 Build Empire From $0 (5)
              </button>
              <button
                type="button"
                className={scenarioFilter === "all" ? "pill selected" : "pill"}
                onClick={() => {
                  playClickSound();
                  setScenarioFilter("all");
                }}
              >
                🌐 All Scenarios ({scenarios.length})
              </button>
            </div>

            {scenarioFilter === "rich" || scenarioFilter === "prime" ? (
              <RichPeopleSelector
                selectedScenarioId={scenarioId}
                onSelectScenario={(id) => setScenarioId(id)}
                playClickSound={playClickSound}
              />
            ) : scenarioFilter === "build" ? (
              <div className="choice-grid">
                {scenarios
                  .filter((s) =>
                    ["nothing", "ten-x", "hundred-x", "thousand-x", "freeplay"].includes(s.id),
                  )
                  .map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      className={`choice ${scenarioId === scenario.id ? "selected" : ""}`}
                      onClick={() => {
                        playClickSound();
                        setScenarioId(scenario.id);
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#059669",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "10px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        📈 Empire Progression
                      </span>
                      <strong>{scenario.name}</strong>
                      <span>{scenario.description}</span>
                      <b>{money(scenario.startingCash)}</b>
                      <small>{scenario.goalLabel}</small>
                    </button>
                  ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
                <RichPeopleSelector
                  selectedScenarioId={scenarioId}
                  onSelectScenario={(id) => setScenarioId(id)}
                  playClickSound={playClickSound}
                />
                <div
                  style={{
                    paddingTop: "20px",
                    borderTop: "1px solid #e2e8f0",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>📈</span> Build From Scratch & Multipliers (5)
                    </h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Start at $0 or multiply initial capital
                    </span>
                  </div>
                  <div className="choice-grid">
                    {scenarios
                      .filter((s) =>
                        ["nothing", "ten-x", "hundred-x", "thousand-x", "freeplay"].includes(s.id),
                      )
                      .map((scenario) => (
                        <button
                          key={scenario.id}
                          type="button"
                          className={`choice ${scenarioId === scenario.id ? "selected" : ""}`}
                          onClick={() => {
                            playClickSound();
                            setScenarioId(scenario.id);
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#059669",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontSize: "10px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}
                          >
                            📈 Empire Progression
                          </span>
                          <strong>{scenario.name}</strong>
                          <span>{scenario.description}</span>
                          <b>{money(scenario.startingCash)}</b>
                          <small>{scenario.goalLabel}</small>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <SponsoredAdBanner slotId="7849102480" format="horizontal" />
            <div className="custom-launch">
              <div>
                <b>🧬 Custom Challenge Lab</b>
                <span>
                  Choose the starting cash, finish line, Risk Mode, economy
                  modifiers, time rules and restrictions—or import a friend’s
                  SIA challenge code.
                </span>
              </div>
              <button
                className="secondary"
                onClick={() => setCustomBuilderOpen(true)}
              >
                Build Custom Scenario
              </button>
            </div>
            <div className="mode-row">
              <button
                className={mode === "simple" ? "pill selected" : "pill"}
                onClick={() => setMode("simple")}
              >
                Simple Financials
              </button>
              <button
                className={mode === "advanced" ? "pill selected" : "pill"}
                onClick={() => setMode("advanced")}
              >
                Advanced Financials
              </button>
            </div>
            <label className="risk-toggle">
              <input
                type="checkbox"
                checked={riskMode}
                onChange={(event) => setRiskMode(event.target.checked)}
              />
              <div>
                <b>Optional Risk Mode</b>
                <small>
                  Allows bounded overspending, debt interest, risky investments,
                  a bankruptcy countdown and true comeback achievements.
                </small>
              </div>
            </label>

            <ReligionFrontPageSection
              selectedReligionId={selectedReligionId}
              onSelectReligion={setSelectedReligionId}
              customPrayerTimes={customPrayerTimes}
              onUpdatePrayerTime={(prayerId, time) => {
                setCustomPrayerTimes((prev) => ({ ...prev, [prayerId]: time }));
              }}
              playClickSound={playClickSound}
            />

            <button
              className="primary"
              onClick={() => {
                playClickSound();
                setOfflineAward(0);
                setView(scenarioId === "nothing" ? "earnings" : "market");
                recordedWin.current = null;
                setInMainMenu(false);
                setState(newGame(scenarioId, mode, riskMode, selectedReligionId, customPrayerTimes));
              }}
            >
              Start Scenario: {scenarios.find((s) => s.id === scenarioId)?.name ?? scenarioId}
            </button>
            <p className="micro">
              Start From Nothing begins at exactly $0, so your first move is
              earning. LOK, cosmetics, pets and Legacy Collection persist across
              every mode.
            </p>
          </section>
        )}
      </main>
    );

  if (state.runStatus === "bankrupt")
    return (
      <GameOverView
        state={state}
        onRestart={() => {
          localStorage.removeItem(SAVE_KEY);
          setState(null);
          setOfflineAward(0);
        }}
      />
    );

  const income = passiveCashPerSecond(state),
    gross = grossIncomePerSecond(state),
    upkeep = upkeepPerSecond(state),
    worth = leveragedNetWorth(state),
    holdings = holdingsValue(state),
    upgradeValue = upgradesValue(state);
  const progress = scenarioProgressWithDebt(state),
    freeMode = scenarioIsFreeMode(state),
    won = !freeMode && progress >= 1,
    goalLabel = scenarioGoalLabel(state);
  const currentHouse = houseTiers.find(
      (tier) => tier.level === state.houseLevel,
    )!,
    nextHouse = houseTiers.find((tier) => tier.level === state.houseLevel + 1);
  const currentTown =
      townTiers.find((tier) => tier.level === state.townLevel) ?? townTiers[0],
    nextTown = townTiers.find((tier) => tier.level === state.townLevel + 1);
  const currentRegion =
      regionTiers.find((tier) => tier.level === state.regionLevel) ??
      regionTiers[0],
    nextRegion = regionTiers.find(
      (tier) => tier.level === state.regionLevel + 1,
    );
  const ownedCount = totalOwned(state),
    event = activeMarketEvent(state),
    specialization = citySpecializations.find(
      (entry) => entry.id === state.citySpecialization,
    );
  const achievementCount = Object.keys(state.runAchievements ?? {}).length;
  const companionId = customization.equipped.petId ?? "pet-lok-slime";
  const companionQuest = companionQuestSnapshot(cardShop, state);
  const claimQuest = (bonus: CompanionQuestBonus) => {
    const result = claimCompanionQuest(cardShop, state, bonus);
    if (!result.success) return;
    setState(result.state);
    setCardShop(ensureCompanionQuest(result.shop, result.state, companionId));
    emitMicroMotion({
      target: "card-credits",
      amount: result.creditsAwarded,
      displayText: `+◫ ${result.creditsAwarded}`,
      symbol: "🐾",
      tone: "reward",
      kind: "reward",
    });
  };
  const dailyStatus = getDailyCheckInStatus(state?.dailyRewards, nowTime);
  const activeReminders = state
    ? detectActiveReminders({
        gameState: state,
        offlineAward,
        companionQuestReady: Boolean(companionQuest?.complete),
        sponsorBoostReady: sponsorBoostRemainingSeconds === 0,
        prefs: loadNotificationPreferences(),
        now: nowTime,
      })
    : [];
  const debtState = normalizeDebtState(state.debt);
  const darkTheme = [
    "theme-midnight",
    "theme-executive-glass",
    "theme-market-terminal",
    "theme-lunar-office",
  ].includes(customization.equipped.themeId ?? "");
  const appClass = visitTheme
    ? `app midnight gsix-visit-theme ${moneyCounterClass(customization)}`
    : `app ${darkTheme ? "midnight " : ""}${themeClass(customization)} ${moneyCounterClass(customization)}`;

  const handleBuy = (item: (typeof items)[number], q: number, e?: React.MouseEvent) => {
    const o = state.owned[item.id] ?? 0;
    const cost = itemBulkPrice(item, o, q, state);
    setState((s) => {
      if (!s) return s;
      const next = buyItem(s, item, q);
      if (next !== s) {
        playPurchaseSound();
        if (e) {
          emitFloatingNumber({
            text: `-${money(cost)}`,
            x: e.clientX,
            y: e.clientY,
            color: '#dc2626',
          });
        }
      }
      return next;
    });
  };

  const handleSell = (item: (typeof items)[number], q: number, e?: React.MouseEvent) => {
    const o = state.owned[item.id] ?? 0;
    const n = Math.min(Math.max(0, q), o);
    const refund = itemBulkPrice(item, o - n, n, state) * 0.7;
    setState((s) => {
      if (!s) return s;
      const next = sellItemWithDebt(s, item, q);
      if (next !== s) {
        playCoinSound();
        if (e) {
          emitFloatingNumber({
            text: `+${money(refund)}`,
            x: e.clientX,
            y: e.clientY,
            color: '#16a34a',
          });
        }
      }
      return next;
    });
  };

  return (
    <main className={appClass} style={visitTheme ? visitThemeStyle(visitTheme) : undefined}>
      <FloatingNumbersOverlay />
      <PersistentFollowHud
        state={state}
        income={income}
        worth={worth}
        cardCredits={cardShop.credits}
        activeTab={view}
        onTabChange={setView}
      />
      <header className="topbar">
        <div>
          {visitTheme && (
            <p className="gsix-visit-note">
              Wearing your GSix theme ·
              <button type="button" onClick={dismissGsixVisitTheme}>Use my Spend It All look</button>
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <button
              type="button"
              className="main-menu-btn"
              title="Return to Main Menu"
              onClick={() => {
                playClickSound();
                setInMainMenu(true);
              }}
            >
              ‹ Main Menu
            </button>
            <button
              type="button"
              className="audio-quick-btn"
              title={audioSettings.muted ? "Sound Effects Muted (Click to Unmute)" : "Sound Effects Active (Click to Mute)"}
              onClick={() => {
                const next = toggleAudioMute();
                setAudioSettings(next);
                if (!next.muted) playCoinSound();
              }}
            >
              {audioSettings.muted ? "🔇" : "🔊"}
            </button>
            <button
              type="button"
              className="header-action-badge-btn"
              onClick={() => {
                playClickSound();
                setDailyRewardsModalOpen(true);
              }}
              title="Daily In-Game Rewards & Streak Check-In"
            >
              <span>🎁</span>
              <span>Daily Rewards</span>
              {dailyStatus.canClaim ? (
                <span className="header-badge-count ready-glow">CLAIM</span>
              ) : (
                <span style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 800 }}>D{dailyStatus.currentDayInCycle}</span>
              )}
            </button>
            <button
              type="button"
              className="header-action-badge-btn"
              onClick={() => {
                playClickSound();
                setNotificationsOpen(true);
              }}
              title="Notification Reminders & In-Game Alerts"
            >
              <span>🔔</span>
              <span>Reminders</span>
              {activeReminders.length > 0 ? (
                <span className="header-badge-count">{activeReminders.length}</span>
              ) : null}
            </button>
            <span className="eyebrow" style={{ margin: 0 }}>
              SPEND IT ALL {state.riskMode ? "· RISK MODE" : ""} ·{" "}
              {state.rules.presetId.toUpperCase()}{" "}
              {state.customScenario
                ? `· ${state.customScenario.name.toUpperCase()}`
                : ""}{" "}
              {meta.equippedTitle ? `· ${meta.equippedTitle.toUpperCase()}` : ""}
            </span>
            {(() => {
              const richPerson = getRichPersonProfile(state.scenarioId);
              if (!richPerson) return null;
              return (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "3px 10px 3px 6px",
                    borderRadius: "999px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    fontSize: "11.5px",
                    margin: "0 4px",
                  }}
                  title={richPerson.quote}
                >
                  <img
                    src={richPerson.portraitUrl}
                    alt={richPerson.name}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== richPerson.fallbackSeedUrl) {
                        target.src = richPerson.fallbackSeedUrl;
                      }
                    }}
                  />
                  <strong style={{ color: "#0f172a" }}>{richPerson.name}</strong>
                  <span style={{ color: richPerson.badgeColor, fontWeight: 800, fontSize: "10px" }}>
                    {richPerson.badge}
                  </span>
                </div>
              );
            })()}
            <SponsorBoostBar
              boostRemainingSeconds={sponsorBoostRemainingSeconds}
              onActivateBoost={handleActivateSponsorBoost}
            />
          </div>
          <MoneyCounter state={state} income={income} />
        </div>
        <div className="top-stats">
          <div>
            <span>Net worth</span>
            <b>{money(worth)}</b>
          </div>
          <div>
            <span>Spent</span>
            <b>{money(state.totalSpent)}</b>
          </div>
          <div>
            <span>Achievements</span>
            <b>
              {achievementCount}/{achievements.length}
            </b>
          </div>
          <a className="card-credit-counter" href="/cards">
            <span>Card Credits</span>
            <b data-motion-target="card-credits">
              ◫ {Math.floor(cardShop.credits).toLocaleString()}
            </b>
            <small>Open card district →</small>
          </a>
          <div>
            <span>LOK</span>
            <b>◈ {state.lokTokens.toLocaleString()}</b>
            <small>
              +1 in{" "}
              {Math.max(1, Math.ceil((10_000 - state.lokProgressMs) / 1000))}s
            </small>
          </div>
        </div>
      </header>
      <MarketWeatherBanner gameDay={Math.floor((state.time?.gameMinute ?? 0) / (state.time?.settings?.dayLengthMinutes ?? 1440)) + 1} />
      <PetCompanion
        state={state}
        income={income}
        inventory={customization}
        quest={companionQuest}
        onClaimQuest={claimQuest}
      />
      {offlineAward > 0 ? (
        <button className="offline-banner" onClick={() => setOfflineAward(0)}>
          Welcome back — your empire earned <b>{money(offlineAward)}</b> while
          away. <span>Dismiss</span>
        </button>
      ) : null}
      {event ? (
        <section className="event-strip">
          <span className="event-emoji">{event.emoji}</span>
          <div>
            <span className="eyebrow">LIVE MARKET EVENT</span>
            <b>{event.name}</b>
            <small>{event.description}</small>
          </div>
          <div className="event-numbers">
            <span>Revenue ×{event.incomeMultiplier.toFixed(2)}</span>
            <span>Costs ×{event.upkeepMultiplier.toFixed(2)}</span>
            <small>
              {Math.max(0, Math.ceil((state.eventEndsAt - Date.now()) / 1000))}s
              left
            </small>
          </div>
        </section>
      ) : null}
      <section className={`goal-strip ${won ? "won" : ""}`}>
        <div>
          <span className="eyebrow">SCENARIO GOAL</span>
          <b>
            {freeMode
              ? "Free Mode ∞ — no finish line"
              : won
                ? "Goal complete ✓ — saved to leaderboard"
                : goalLabel}
          </b>
        </div>
        <div className="goal-progress">
          <span style={{ width: `${freeMode ? 100 : progress * 100}%` }} />
        </div>
        <small>{freeMode ? "∞" : `${Math.round(progress * 100)}%`}</small>
      </section>
      <nav className="view-tabs">
        <button
          className={view === "market" ? "active" : ""}
          onClick={() => { playClickSound(); setView("market"); }}
        >
          Marketplace
        </button>
        <button
          className={view === "earnings" ? "active" : ""}
          onClick={() => { playClickSound(); setView("earnings"); }}
        >
          Earn
        </button>
        <button
          className={view === "businesses" ? "active" : ""}
          onClick={() => { playClickSound(); setView("businesses"); }}
        >
          Businesses
        </button>
        <button
          className={view === "empire" ? "active" : ""}
          onClick={() => { playClickSound(); setView("empire"); }}
        >
          Empire
        </button>
        <button
          className={view === "town" ? "active" : ""}
          onClick={() => { playClickSound(); setView("town"); }}
        >
          Town & Community 🏘️
          {state.cityEconomy?.population > 0 ? (
            <span style={{ marginLeft: "5px", fontSize: "0.8em", opacity: 0.9 }}>
              ({Math.round(state.cityEconomy.population).toLocaleString()})
            </span>
          ) : null}
        </button>
        <button
          className={view === "daily" ? "active" : ""}
          onClick={() => { playClickSound(); setView("daily"); }}
        >
          Daily Rewards 🎁
          {dailyStatus.canClaim ? (
            <span style={{ marginLeft: "5px", color: "#16a34a", fontWeight: 900 }}>•</span>
          ) : null}
        </button>
        <button
          className={view === "religion" ? "active" : ""}
          onClick={() => { playClickSound(); setView("religion"); }}
        >
          {state.religion
            ? `${getReligionDefinition(state.religion.religionId).emblem} Faith & Sanctuary`
            : "🕊️ Faith & Religion"}
        </button>
        <button
          className={view === "familyOffice" ? "active" : ""}
          onClick={() => { playClickSound(); setView("familyOffice"); }}
        >
          Prestige 🏛
        </button>
        <button
          className={view === "deck" ? "active" : ""}
          onClick={() => { playClickSound(); setView("deck"); }}
        >
          Card Deck 🎴
        </button>
        <button
          className={view === "debt" ? "active" : ""}
          onClick={() => { playClickSound(); setView("debt"); }}
        >
          Debt & Court ⚖
        </button>
        <button
          className={view === "achievements" ? "active" : ""}
          onClick={() => { playClickSound(); setView("achievements"); }}
        >
          Achievements · {achievementCount}
        </button>
        <button
          className={view === "collection" ? "active" : ""}
          onClick={() => { playClickSound(); setView("collection"); }}
        >
          Collection · {meta.collectibles.length}
        </button>
        <button
          className={view === "leaderboard" ? "active" : ""}
          onClick={() => { playClickSound(); setView("leaderboard"); }}
        >
          Leaderboard
        </button>
        <button
          className={view === "customize" ? "active" : ""}
          onClick={() => { playClickSound(); setView("customize"); }}
        >
          Customize ◈
        </button>
        <button
          className={view === "settings" ? "active" : ""}
          onClick={() => { playClickSound(); setView("settings"); }}
        >
          Settings ⚙
        </button>
      </nav>

      {view === "familyOffice" ? (
        <FamilyOfficeView
          state={state}
          onPrestige={() => {
            setState((curr) => curr ? newGame(curr.scenarioId, curr.mode, curr.riskMode) : null);
            setView("market");
          }}
        />
      ) : null}
      {view === "daily" ? (
        <DailyRewardsView
          state={state}
          onUpdateState={(s) => setState(s)}
          onOpenCards={() => setView("deck")}
        />
      ) : null}
      {view === "religion" ? (
        <ReligionView state={state} setState={setState} />
      ) : null}
      {view === "deck" ? <ExecutiveDeckView meta={meta} /> : null}
      {view === "achievements" ? <AchievementsView state={state} /> : null}
      {view === "collection" ? (
        <CollectionView
          meta={meta}
          onEquipTitle={(title) =>
            setMeta((current) => equipTitle(current, title))
          }
          onToggleBadge={(id) =>
            setMeta((current) => toggleShowcaseBadge(current, id))
          }
        />
      ) : null}
      {view === "leaderboard" ? <LeaderboardView /> : null}
      {view === "customize" ? (
        <CustomizationView
          state={state}
          setState={setState}
          inventory={customization}
          onInventoryChange={setCustomization}
        />
      ) : null}
      {view === "debt" ? <DebtView state={state} setState={setState} /> : null}
      {view === "settings" ? (
        <SettingsView state={state} setState={setState} />
      ) : null}
      {view === "earnings" ? (
        <EarningsView state={state} setState={setState} />
      ) : null}
      {view === "businesses" ? (
        <BusinessView state={state} setState={setState} />
      ) : null}
      {view === "town" ? (
        <TownCommunityView state={state} setState={setState} money={money} />
      ) : null}
      {view === "market" ? (
        <>
          <nav className="tabs">
            {[
              "all",
              "everyday",
              "luxury",
              "property",
              "business",
              "infrastructure",
            ].map((entry) => (
              <button
                key={entry}
                className={category === entry ? "active" : ""}
                onClick={() => setCategory(entry)}
              >
                {entry}
              </button>
            ))}
          </nav>
          <SponsoredAdBanner slotId="7849102481" format="horizontal" />
          <section className="dashboard-grid">
            <section className="catalog panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MARKETPLACE</span>
                  <h2>Buy the world</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <div className="photo-mode-controls">
                    <button
                      type="button"
                      className={`photo-toggle-btn ${hudPrefs.showItemPhotos ? "active" : ""}`}
                      onClick={() => {
                        playClickSound();
                        const next = saveHudPreferences({
                          ...hudPrefs,
                          showItemPhotos: !hudPrefs.showItemPhotos,
                        });
                        setHudPrefs(next);
                      }}
                      title="Toggle between high-res photo cards and compact list mode"
                    >
                      {hudPrefs.showItemPhotos ? "🖼️ Photo Cards: ON" : "📋 Compact Mode"}
                    </button>
                    <button
                      type="button"
                      className="photo-library-info-btn"
                      onClick={() => {
                        playClickSound();
                        setLibraryModalOpen(true);
                      }}
                      title="Learn about royalty-free photo sources, licenses, and customization"
                    >
                      <span>ℹ️</span>
                      <span>Royalty-Free Photos</span>
                    </button>
                  </div>
                  <span>
                    {state.riskMode
                      ? "Credit enabled · bankruptcy possible"
                      : state.mode === "advanced"
                        ? "Revenue + upkeep active"
                        : "Simple economy"}
                  </span>
                </div>
              </div>
              <div className="item-list">
                {visibleItems.map((item) => {
                  const owned = state.owned[item.id] ?? 0,
                    unlocked = state.totalSpent >= (item.unlockSpent ?? 0),
                    price = itemBulkPrice(item, owned, 1, state),
                    maxQty = maxAffordableQuantity(state, item),
                    pledged = isItemPledged(debtState, item.id);
                  const visual = getPurchaseVisual(item.id);
                  const cardTierClass =
                    visual
                      ? hudPrefs.itemPhotoEscalation
                        ? `has-photo tier-${visual.tier}`
                        : "has-photo"
                      : "";

                  return (
                    <article
                      className={`item-card ${!unlocked ? "locked" : ""} ${cardTierClass}`}
                      key={item.id}
                    >
                      <PurchaseVisual
                        id={item.id}
                        name={item.name}
                        emoji={item.emoji}
                        family={item.category === 'business' ? 'business' : item.category === 'property' ? 'property' : item.category === 'luxury' ? 'luxury' : 'everyday'}
                        value={price}
                        imageSrc={visual?.imageUrl}
                        imageAlt={visual?.name ?? item.name}
                        locked={!unlocked}
                      />

                      <div
                        className="item-copy"
                        style={visual ? { padding: "12px 14px" } : undefined}
                      >
                        <div className="item-title">
                          <h3>
                            {item.name}
                          </h3>
                          <span>
                            Owned {owned.toLocaleString()}
                            {pledged ? " · 🔒 pledged" : ""}
                          </span>
                        </div>
                        <p>{item.description}</p>

                        {hudPrefs.visualArtMode === "photo" && visual && Object.keys(visual.specs).length > 0 ? (
                          <div className="item-photo-specs-strip">
                            {Object.entries(visual.specs).slice(0, 3).map(([k, v]) => (
                              <span className="item-photo-spec-pill" key={k}>
                                <b>{k.replace(/([A-Z])/g, " $1").trim()}:</b> {v}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="item-meta">
                          <b>{money(price)}</b>
                          {item.incomePerSecond ? (
                            <span>+{money(item.incomePerSecond)}/sec ea.</span>
                          ) : null}
                          {state.mode === "advanced" && item.upkeepPerSecond ? (
                            <span className="negative">
                              -{money(item.upkeepPerSecond)}/sec upkeep
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="buy-stack"
                        style={hudPrefs.showItemPhotos && visual ? { padding: "0 14px 14px 14px" } : undefined}
                      >
                        {unlocked ? (
                          <>
                            <button
                              disabled={!canBuyItem(state, item, 1)}
                              onClick={(e) => handleBuy(item, 1, e)}
                            >
                              Buy
                            </button>
                            <button
                              disabled={!canBuyItem(state, item, 10)}
                              onClick={(e) => handleBuy(item, 10, e)}
                            >
                              ×10
                            </button>
                            <button
                              disabled={!canBuyItem(state, item, 100)}
                              onClick={(e) => handleBuy(item, 100, e)}
                            >
                              ×100
                            </button>
                            <button
                              disabled={maxQty < 1}
                              onClick={(e) =>
                                handleBuy(item, maxAffordableQuantity(state, item), e)
                              }
                            >
                              MAX
                            </button>
                            <button
                              className="sell"
                              disabled={!canSellItemWithDebt(state, item)}
                              onClick={(e) => handleSell(item, 1, e)}
                            >
                              {pledged
                                ? "Pledged"
                                : state.scenarioId === "custom" &&
                                    state.customScenario &&
                                    !state.customScenario.restrictions
                                      .sellingEnabled
                                  ? "No Sell"
                                  : "Sell"}
                            </button>
                          </>
                        ) : (
                          <span>
                            Unlock after {money(item.unlockSpent ?? 0)} spent
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            <aside className="side-stack">
              <FinancialPanel
                state={state}
                gross={gross}
                upkeep={upkeep}
                income={income}
                holdings={holdings}
                upgradeValue={upgradeValue}
                ownedCount={ownedCount}
                onMode={() =>
                  setState((s) =>
                    s &&
                    !(
                      s.scenarioId === "custom" && s.customScenario?.rulesLocked
                    )
                      ? {
                          ...s,
                          mode: s.mode === "simple" ? "advanced" : "simple",
                        }
                      : s,
                  )
                }
              />
              <ProgressPanels
                state={state}
                currentHouse={currentHouse}
                nextHouse={nextHouse}
                currentTown={currentTown}
                nextTown={nextTown}
                currentRegion={currentRegion}
                nextRegion={nextRegion}
                setState={setState}
                onOpenTown={() => setView("town")}
                showPhotos={hudPrefs.showItemPhotos}
                onInspectVisual={setSelectedVisual}
              />
              <SponsoredAdBanner slotId="7849102482" format="rectangle" />
            </aside>
          </section>
        </>
      ) : null}
      {view === "empire" ? (
        <section className="empire-grid">
          <section className="panel empire-main">
            <span className="eyebrow">EMPIRE UPGRADES</span>
            <h2>Make everything you own stronger</h2>
            <p className="muted">
              Upgrades affect your whole economy and become increasingly
              expensive.
            </p>
            <div className="upgrade-grid">
              {empireUpgrades.map((upgrade) => {
                const level = state.upgrades[upgrade.id] ?? 0,
                  locked =
                    state.townLevel < (upgrade.requiredTownLevel ?? 0) ||
                    state.regionLevel < (upgrade.requiredRegionLevel ?? 0);
                return (
                  <article
                    className={`upgrade-card ${locked ? "locked" : ""}`}
                    key={upgrade.id}
                  >
                    <PurchaseVisual id={upgrade.id} name={upgrade.name} emoji={upgrade.emoji} family="upgrade" value={upgrade.baseCost} imageSrc={EMPIRE_UPGRADE_IMAGES[upgrade.id]} compact locked={locked} />
                    <div>
                      <div className="item-title">
                        <h3>{upgrade.name}</h3>
                        <span>
                          Lv {level}/{upgrade.maxLevel}
                        </span>
                      </div>
                      <p>{upgrade.description}</p>
                      <div className="upgrade-effects">
                        {upgrade.incomeMultiplierPerLevel ? (
                          <span>
                            +
                            {Math.round(upgrade.incomeMultiplierPerLevel * 100)}
                            % revenue/lvl
                          </span>
                        ) : null}
                        {upgrade.upkeepReductionPerLevel ? (
                          <span>
                            -{Math.round(upgrade.upkeepReductionPerLevel * 100)}
                            % costs/lvl
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <button
                      disabled={!canBuyUpgrade(state, upgrade)}
                      onClick={(e) => {
                        const cost = upgradeCost(state, upgrade);
                        setState((s) => {
                          if (!s) return s;
                          const next = buyUpgrade(s, upgrade);
                          if (next !== s) {
                            playPurchaseSound();
                            emitFloatingNumber({
                              text: `-${money(cost)}`,
                              x: e.clientX,
                              y: e.clientY,
                              color: '#dc2626',
                            });
                          }
                          return next;
                        });
                      }}
                    >
                      {level >= upgrade.maxLevel
                        ? "MAXED"
                        : locked
                          ? "LOCKED"
                          : `Upgrade · ${money(upgradeCost(state, upgrade))}`}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
          <aside className="side-stack">
            {state.townLevel >= 4 ? (
              <section className="panel">
                <span className="eyebrow">CITY SPECIALIZATION</span>
                <h2>
                  {specialization
                    ? `${specialization.emoji} ${specialization.name}`
                    : "Choose your city identity"}
                </h2>
                {specialization ? (
                  <p>{specialization.description}</p>
                ) : (
                  <div className="specialization-list">
                    {citySpecializations.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() =>
                          setState((s) =>
                            s ? chooseCitySpecialization(s, spec.id) : s,
                          )
                        }
                      >
                        <span>{spec.emoji}</span>
                        <div>
                          <b>{spec.name}</b>
                          <small>{spec.description}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ) : null}
            <ProgressPanels
              state={state}
              currentHouse={currentHouse}
              nextHouse={nextHouse}
              currentTown={currentTown}
              nextTown={nextTown}
              currentRegion={currentRegion}
              nextRegion={nextRegion}
              setState={setState}
              onOpenTown={() => setView("town")}
              showPhotos={hudPrefs.showItemPhotos}
              onInspectVisual={setSelectedVisual}
            />
            <section className="panel">
              <span className="eyebrow">ACHIEVEMENT VAULT</span>
              <h2>
                {achievementCount}/{achievements.length} unlocked
              </h2>
              <p>
                Speedrunner, Wolf Boss, Comeback, Risk, Scenario and Super
                achievements now live in their own grouped vault.
              </p>
              <button
                className="secondary"
                onClick={() => setView("achievements")}
              >
                Open Achievement Vault
              </button>
            </section>
          </aside>
        </section>
      ) : null}
      <SponsoredAdBanner slotId="7849102485" format="horizontal" />
      <footer className="game-footer">
        <button
          onClick={() =>
            setCustomization((current) =>
              saveCustomizationInventory(
                equipCustomization(
                  current,
                  darkTheme ? "theme-classic-ledger" : "theme-midnight",
                ),
              ),
            )
          }
        >
          Toggle {darkTheme ? "Classic" : "Midnight"}
        </button>
        <button className="secondary" onClick={() => setView("customize")}>
          Customize ◈
        </button>
        <button className="secondary" onClick={() => setView("debt")}>
          Debt & Court ⚖
        </button>
        <button className="secondary" onClick={() => setView("settings")}>
          Game Rules ⚙
        </button>
        <button
          className="danger"
          onClick={() => {
            localStorage.removeItem(SAVE_KEY);
            setState(null);
            setOfflineAward(0);
          }}
        >
          Reset Run
        </button>
      </footer>

      {dailyRewardsModalOpen ? (
        <DailyRewardsModal
          state={state}
          onUpdateState={(s) => setState(s)}
          onClose={() => setDailyRewardsModalOpen(false)}
          onOpenCards={() => setView("deck")}
        />
      ) : null}

      <NotificationCenter
        state={state}
        offlineAward={offlineAward}
        companionQuestReady={Boolean(companionQuest?.complete)}
        sponsorBoostReady={sponsorBoostRemainingSeconds === 0}
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onOpenDaily={() => setDailyRewardsModalOpen(true)}
        onSwitchView={(v) => setView(v as View)}
        onOpenCards={() => setView("deck")}
        onClaimOffline={() => {
          setState((curr) => {
            if (!curr) return curr;
            const updated = {
              ...curr,
              cash: curr.cash + offlineAward,
              lifetimeIncome: curr.lifetimeIncome + offlineAward,
              updatedAt: Date.now(),
            };
            setOfflineAward(0);
            return updated;
          });
        }}
        onActivateSponsorBoost={() => handleActivateSponsorBoost(15)}
      />
      <ItemPhotoModal visual={selectedVisual} onClose={() => setSelectedVisual(null)} />
      <RoyaltyFreeLibraryModal
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        hudPrefs={hudPrefs}
        onUpdateHudPrefs={(patch) => {
          const next = saveHudPreferences({ ...hudPrefs, ...patch });
          setHudPrefs(next);
        }}
      />
    </main>
  );
}

function FinancialPanel({
  state,
  gross,
  upkeep,
  income,
  holdings,
  upgradeValue,
  ownedCount,
  onMode,
}: {
  state: GameState;
  gross: number;
  upkeep: number;
  income: number;
  holdings: number;
  upgradeValue: number;
  ownedCount: number;
  onMode: () => void;
}) {
  const locked =
    state.scenarioId === "custom" && !!state.customScenario?.rulesLocked;
  return (
    <section className="panel finance-panel">
      <span className="eyebrow">FINANCIAL DASHBOARD</span>
      <h2>{state.mode === "simple" ? "Simple view" : "Advanced view"}</h2>
      <div className="finance-grid">
        <span>
          Cash <b>{money(state.cash)}</b>
        </span>
        <span>
          Assets <b>{money(holdings)}</b>
        </span>
        <span>
          Upgrades <b>{money(upgradeValue)}</b>
        </span>
        <span>
          Gross income <b>{money(gross)}/s</b>
        </span>
        <span>
          Operating cost{" "}
          <b>
            {state.mode === "advanced" || state.riskMode
              ? `${money(upkeep)}/s`
              : "Hidden"}
          </b>
        </span>
        <span>
          Net income{" "}
          <b className={income >= 0 ? "positive" : "negative"}>
            {money(income)}/s
          </b>
        </span>
        <span>
          Items owned <b>{ownedCount.toLocaleString()}</b>
        </span>
        <span>
          Sold <b>{money(state.totalSold)}</b>
        </span>
      </div>
      <button className="secondary" disabled={locked} onClick={onMode}>
        {locked
          ? "Financial mode locked by challenge"
          : `Switch to ${state.mode === "simple" ? "Advanced" : "Simple"}`}
      </button>
    </section>
  );
}

function ProgressPanels({
  state,
  currentHouse,
  nextHouse,
  currentTown,
  nextTown,
  currentRegion,
  nextRegion,
  setState,
  onOpenTown,
  showPhotos,
  onInspectVisual,
}: {
  state: GameState;
  currentHouse: (typeof houseTiers)[number];
  nextHouse: (typeof houseTiers)[number] | undefined;
  currentTown: (typeof townTiers)[number];
  nextTown: (typeof townTiers)[number] | undefined;
  currentRegion: (typeof regionTiers)[number];
  nextRegion: (typeof regionTiers)[number] | undefined;
  setState: React.Dispatch<React.SetStateAction<GameState | null>>;
  onOpenTown?: () => void;
  showPhotos?: boolean;
  onInspectVisual?: (visual: PurchaseVisualItem) => void;
}) {
  const price = state.rules.economy.purchasePriceMultiplier;
  return (
    <>
      <section className="panel compact-progress">
        <span className="eyebrow">TOWN & SETTLEMENT</span>
        <h2>{state.cityEconomy?.townName || currentTown.name}</h2>
        <p>
          {state.cityEconomy?.founded
            ? `${Math.round(state.cityEconomy.population).toLocaleString()} residents · ${state.cityEconomy.communityGoodwill}% goodwill`
            : "Claim territory and welcome immigrants"}
        </p>
        {onOpenTown && (
          <button
            className="secondary"
            style={{ width: "100%", marginTop: "6px", fontWeight: 700 }}
            onClick={onOpenTown}
          >
            {state.cityEconomy?.founded ? "Open Town Hub 🏘️ →" : "Found Settlement 🏛️ →"}
          </button>
        )}
      </section>
      <section className="panel compact-progress">
        <span className="eyebrow">HOME</span>
        <h2>{currentHouse.name}</h2>
        <p>
          {currentHouse.rooms} rooms · Level {currentHouse.level}
        </p>
        {showPhotos && onInspectVisual ? (
          <HouseVisualBanner
            currentHouse={currentHouse}
            nextHouse={nextHouse}
            onInspect={onInspectVisual}
            showPhotos={showPhotos}
          />
        ) : null}
        {nextHouse ? (
          <button
            className="primary"
            onClick={() => setState((s) => (s ? upgradeHouse(s) : s))}
          >
            Upgrade · {money(nextHouse.cost * price)}
          </button>
        ) : (
          <div className="complete">Estate complete</div>
        )}
      </section>
      {state.houseLevel >= 5 ? (
        <section className="panel compact-progress">
          <span className="eyebrow">CITY</span>
          <h2>{currentTown.name}</h2>
          <p>
            {currentTown.population.toLocaleString()} population ·{" "}
            {currentTown.jobs.toLocaleString()} base jobs
          </p>
          {nextTown ? (
            <button
              className="primary"
              onClick={() => setState((s) => (s ? upgradeTown(s) : s))}
            >
              Expand · {money(nextTown.cost * price)}
            </button>
          ) : (
            <div className="complete">Metropolis complete</div>
          )}
        </section>
      ) : null}
      {state.townLevel >= 5 ? (
        <section className="panel compact-progress region-panel">
          <span className="eyebrow">REGIONAL POWER</span>
          <h2>{currentRegion.name}</h2>
          <p>
            {currentRegion.population.toLocaleString()} people influenced ·{" "}
            {currentRegion.economy} economy
          </p>
          {nextRegion ? (
            <>
              <small>
                Next: {nextRegion.name} · requires{" "}
                {money(nextRegion.requiredNetWorth)} net worth
              </small>
              <button
                className="primary"
                onClick={() => setState((s) => (s ? upgradeRegion(s) : s))}
              >
                Expand Influence · {money(nextRegion.cost * price)}
              </button>
            </>
          ) : (
            <div className="complete">Planetary economic scale reached 🌍</div>
          )}
        </section>
      ) : null}
    </>
  );
}
