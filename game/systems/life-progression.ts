import {
  homeFurnishings,
  housingOptions,
  lifeBackgrounds,
  relationshipContacts,
  simActions,
  skillLevelThresholds,
  vehicleDefinitions,
} from '@/data/life-progression';
import type { GameState } from '../types';
import type {
  HomeFurnishing,
  HousingDefinition,
  LifeBackgroundId,
  LifeRpgState,
  LifeSkillId,
  LifeStatId,
  LifeStats,
  RelationshipContactId,
  RelationshipContactState,
  RelationshipInteractionType,
  SimActionDefinition,
  SimMoodInfo,
  SimMoodTier,
  SimNeedId,
  SimNeeds,
  VehicleDefinition,
} from '../life-types';
import { playAchievementSound, playClickSound, playCoinSound, playPurchaseSound } from './audio-sfx';

const baseStats: LifeStats = { grit: 5, focus: 5, people: 5, knowledge: 5, adaptability: 5 };
const primaryStatBySkill: Record<LifeSkillId, LifeStatId> = {
  'general-labor': 'grit',
  hospitality: 'people',
  sales: 'people',
  creative: 'focus',
  technology: 'knowledge',
  finance: 'knowledge',
  management: 'adaptability',
  trades: 'grit',
  media: 'focus',
  'real-estate': 'knowledge',
};

const defaultNeeds: SimNeeds = {
  energy: 85,
  hunger: 80,
  health: 90,
  happiness: 85,
  social: 75,
};

function createInitialContacts(): Record<RelationshipContactId, RelationshipContactState> {
  const map = {} as Record<RelationshipContactId, RelationshipContactState>;
  for (const c of relationshipContacts) {
    map[c.id] = {
      id: c.id,
      affinity: 10,
      level: 'acquaintance',
      lastInteractedGameMinute: 0,
      giftsGiven: 0,
      isDatingOrPartner: false,
    };
  }
  return map;
}

export function createLifeRpgState(
  enabled = true,
  currentGameMinute = 0,
  dayLengthMinutes = 1440,
): LifeRpgState {
  return {
    enabled,
    backgroundId: null,
    stats: { ...baseStats },
    skillXp: {
      'general-labor': 0,
      hospitality: 0,
      sales: 0,
      creative: 0,
      technology: 0,
      finance: 0,
      management: 0,
      trades: 0,
      media: 0,
      'real-estate': 0,
    },
    housingId: 'stay-with-someone',
    ownedHousingIds: [],
    lastHousingChargeDay: Math.floor(currentGameMinute / Math.max(1, dayLengthMinutes)),
    housingArrears: 0,
    lifetimeHousingCost: 0,
    needs: { ...defaultNeeds },
    furnishingIds: [],
    contacts: createInitialContacts(),
    equippedVehicleId: 'metro-transit',
    ownedVehicleIds: ['metro-transit'],
    lifeLog: [
      {
        id: 'log-start',
        gameMinute: currentGameMinute,
        timestamp: Date.now(),
        title: 'Arrived in the Metro',
        description: 'Began fresh life simulation in the city with big ambitions and zero safety net.',
        emoji: '🏙️',
        category: 'milestone',
      },
    ],
    lastNeedDecayGameMinute: currentGameMinute,
  };
}

export function normalizeLifeRpg(
  input: Partial<LifeRpgState> | null | undefined,
  currentGameMinute = 0,
  dayLengthMinutes = 1440,
): LifeRpgState {
  const base = createLifeRpgState(true, currentGameMinute, dayLengthMinutes);
  if (!input) return base;

  const skillXp = { ...base.skillXp, ...(input.skillXp ?? {}) };
  for (const key of Object.keys(skillXp) as LifeSkillId[]) {
    skillXp[key] = Math.max(0, Number(skillXp[key]) || 0);
  }

  const stats = { ...base.stats, ...(input.stats ?? {}) };
  for (const key of Object.keys(stats) as Array<keyof LifeStats>) {
    stats[key] = Math.max(1, Math.min(20, Number(stats[key]) || 5));
  }

  const housingId = housingOptions.some((entry) => entry.id === input.housingId)
    ? input.housingId!
    : base.housingId;

  const needs: SimNeeds = {
    energy: Math.max(0, Math.min(100, Number(input.needs?.energy ?? defaultNeeds.energy))),
    hunger: Math.max(0, Math.min(100, Number(input.needs?.hunger ?? defaultNeeds.hunger))),
    health: Math.max(0, Math.min(100, Number(input.needs?.health ?? defaultNeeds.health))),
    happiness: Math.max(0, Math.min(100, Number(input.needs?.happiness ?? defaultNeeds.happiness))),
    social: Math.max(0, Math.min(100, Number(input.needs?.social ?? defaultNeeds.social))),
  };

  const initialContacts = createInitialContacts();
  const contacts = { ...initialContacts };
  if (input.contacts) {
    for (const [id, c] of Object.entries(input.contacts)) {
      const contactId = id as RelationshipContactId;
      if (contacts[contactId]) {
        contacts[contactId] = {
          ...contacts[contactId],
          ...c,
          affinity: Math.max(0, Math.min(100, Number(c.affinity) || 0)),
        };
      }
    }
  }

  const furnishingIds = Array.from(new Set(input.furnishingIds ?? []));
  const ownedVehicleIds = Array.from(new Set(input.ownedVehicleIds?.length ? input.ownedVehicleIds : ['metro-transit']));
  const equippedVehicleId = input.equippedVehicleId && ownedVehicleIds.includes(input.equippedVehicleId)
    ? input.equippedVehicleId
    : ownedVehicleIds[0] ?? 'metro-transit';

  return {
    ...base,
    ...input,
    enabled: input.enabled !== undefined ? !!input.enabled : true,
    backgroundId: input.backgroundId ?? null,
    stats,
    skillXp,
    housingId,
    ownedHousingIds: Array.from(new Set(input.ownedHousingIds ?? [])),
    lastHousingChargeDay: Math.max(
      0,
      Math.floor(input.lastHousingChargeDay ?? base.lastHousingChargeDay),
    ),
    housingArrears: Math.max(0, input.housingArrears ?? 0),
    lifetimeHousingCost: Math.max(0, input.lifetimeHousingCost ?? 0),
    needs,
    furnishingIds,
    contacts,
    equippedVehicleId,
    ownedVehicleIds,
    lifeLog: input.lifeLog?.length ? input.lifeLog : base.lifeLog,
    lastNeedDecayGameMinute: Number(input.lastNeedDecayGameMinute) || currentGameMinute,
  };
}

export function getSimMood(lifeInput: LifeRpgState | undefined): SimMoodInfo {
  const life = normalizeLifeRpg(lifeInput);
  const n = life.needs;
  // Weighted score: Energy 25%, Hunger 20%, Health 20%, Happiness 20%, Social 15%
  const score = Math.round(
    n.energy * 0.25 +
    n.hunger * 0.20 +
    n.health * 0.20 +
    n.happiness * 0.20 +
    n.social * 0.15
  );

  if (score >= 88) {
    return {
      tier: 'ecstatic',
      score,
      label: 'Ecstatic & Thriving',
      emoji: '✨',
      color: '#10b981',
      bonusXpMultiplier: 1.25,
      incomeMultiplier: 1.15,
      description: 'Your vitals are in prime shape! Skills grow +25% faster and productivity is peaked.',
    };
  }
  if (score >= 72) {
    return {
      tier: 'inspired',
      score,
      label: 'Inspired & Focused',
      emoji: '💡',
      color: '#3b82f6',
      bonusXpMultiplier: 1.12,
      incomeMultiplier: 1.08,
      description: 'Great mood and clear focus. +12% Skill XP and +8% Career earnings.',
    };
  }
  if (score >= 48) {
    return {
      tier: 'content',
      score,
      label: 'Content & Balanced',
      emoji: '😊',
      color: '#64748b',
      bonusXpMultiplier: 1.0,
      incomeMultiplier: 1.0,
      description: 'Baseline equilibrium. Everything running normally.',
    };
  }
  if (score >= 25) {
    return {
      tier: 'strained',
      score,
      label: 'Fatigued & Stressed',
      emoji: '😓',
      color: '#f59e0b',
      bonusXpMultiplier: 0.85,
      incomeMultiplier: 0.90,
      description: 'Low vitals are taking a toll. Eat, rest or engage in recreation to recover.',
    };
  }
  return {
    tier: 'exhausted',
    score,
    label: 'Burnout & Depleted',
    emoji: '😫',
    color: '#ef4444',
    bonusXpMultiplier: 0.65,
    incomeMultiplier: 0.75,
    description: 'Critical exhaustion! Take immediate rest, food, or medical care to avoid collapse.',
  };
}

export function homeComfortScore(lifeInput: LifeRpgState | undefined): number {
  const life = normalizeLifeRpg(lifeInput);
  const housing = currentHousing(life);
  const base = housing.stability * 10;
  const furnishingsBonus = life.furnishingIds.reduce((sum, id) => {
    const f = homeFurnishings.find((entry) => entry.id === id);
    return sum + (f?.focusBonus ?? 0) + (f?.dailyHappinessBonus ?? 0);
  }, 0);
  return Math.min(100, Math.round(base + furnishingsBonus));
}

export function canPerformSimAction(state: GameState, actionId: string): { can: boolean; reason?: string } {
  const life = normalizeLifeRpg(state.life);
  const action = simActions.find((a) => a.id === actionId);
  if (!action) return { can: false, reason: 'Action not found' };

  if (state.cash < action.cost) {
    return { can: false, reason: `Need $${action.cost.toLocaleString()} cash` };
  }

  if (action.requiresFurnishingId && !life.furnishingIds.includes(action.requiresFurnishingId)) {
    const f = homeFurnishings.find((item) => item.id === action.requiresFurnishingId);
    return { can: false, reason: `Requires home furnishing: ${f?.name ?? 'Upgrade'}` };
  }

  return { can: true };
}

export function performSimAction(state: GameState, actionId: string): { state: GameState; message: string } {
  const check = canPerformSimAction(state, actionId);
  if (!check.can) return { state, message: check.reason ?? 'Cannot perform' };

  const action = simActions.find((a) => a.id === actionId)!;
  let life = normalizeLifeRpg(state.life);
  const housing = currentHousing(life);

  // Apply mattress/bed multiplier if rest
  let energyDelta = action.needsImpact.energy ?? 0;
  if (energyDelta > 0 && life.furnishingIds.includes('orthopedic-mattress')) {
    energyDelta = Math.round(energyDelta * 1.35);
  }
  if (energyDelta > 0 && housing.recoveryBonus > 0) {
    energyDelta += Math.round(housing.recoveryBonus * 1.5);
  }

  const nextNeeds: SimNeeds = {
    energy: Math.max(0, Math.min(100, life.needs.energy + energyDelta)),
    hunger: Math.max(0, Math.min(100, life.needs.hunger + (action.needsImpact.hunger ?? 0))),
    health: Math.max(0, Math.min(100, life.needs.health + (action.needsImpact.health ?? 0))),
    happiness: Math.max(0, Math.min(100, life.needs.happiness + (action.needsImpact.happiness ?? 0))),
    social: Math.max(0, Math.min(100, life.needs.social + (action.needsImpact.social ?? 0))),
  };

  // Skill XP rewards
  if (action.skillXpImpact) {
    for (const [skillKey, xpVal] of Object.entries(action.skillXpImpact)) {
      if (xpVal && xpVal > 0) {
        life = gainLifeSkillXp(life, skillKey as LifeSkillId, xpVal);
      }
    }
  }

  // Life log entry
  const newLogEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gameMinute: state.time.gameMinute,
    timestamp: Date.now(),
    title: action.name,
    description: action.description,
    emoji: action.emoji,
    category: (action.category === 'rest' ? 'wellness' : action.category === 'dining' ? 'wellness' : action.category === 'fitness' ? 'wellness' : 'milestone') as any,
  };

  life = {
    ...life,
    needs: nextNeeds,
    lifeLog: [newLogEntry, ...life.lifeLog].slice(0, 40),
  };

  // Advance time if time simulation is active
  let nextTime = state.time;
  if (state.time.settings.enabled && action.durationMinutes > 0) {
    nextTime = {
      ...state.time,
      gameMinute: state.time.gameMinute + action.durationMinutes,
    };
  }

  // Sound effects
  if (action.cost > 0) {
    playPurchaseSound();
  } else if (action.category === 'rest') {
    playClickSound();
  } else {
    playCoinSound();
  }

  // Fame reward if applicable
  let nextFame = state.fame;
  if (action.fameReward && state.fame) {
    nextFame = {
      ...state.fame,
      points: state.fame.points + action.fameReward,
      totalEarned: state.fame.totalEarned + action.fameReward,
    };
  }

  const nextState: GameState = {
    ...state,
    cash: state.cash - action.cost,
    totalSpent: state.totalSpent + action.cost,
    time: nextTime,
    life,
    fame: nextFame,
    updatedAt: Date.now(),
  };

  return {
    state: nextState,
    message: `${action.emoji} ${action.name} completed!`,
  };
}

export function canBuyHomeFurnishing(state: GameState, furnishingId: string): boolean {
  const life = normalizeLifeRpg(state.life);
  const f = homeFurnishings.find((entry) => entry.id === furnishingId);
  if (!f) return false;
  if (life.furnishingIds.includes(furnishingId)) return false;
  return state.cash >= f.price;
}

export function buyHomeFurnishing(state: GameState, furnishingId: string): GameState {
  if (!canBuyHomeFurnishing(state, furnishingId)) return state;
  const f = homeFurnishings.find((entry) => entry.id === furnishingId)!;
  const life = normalizeLifeRpg(state.life);

  const nextFurnishings = [...life.furnishingIds, furnishingId];
  const nextLog = [
    {
      id: `furnish-${Date.now()}`,
      gameMinute: state.time.gameMinute,
      timestamp: Date.now(),
      title: `Installed ${f.name}`,
      description: `Upgraded home interior. ${f.perkSummary}.`,
      emoji: f.emoji,
      category: 'housing' as const,
    },
    ...life.lifeLog,
  ].slice(0, 40);

  playPurchaseSound();

  return {
    ...state,
    cash: state.cash - f.price,
    totalSpent: state.totalSpent + f.price,
    life: {
      ...life,
      furnishingIds: nextFurnishings,
      lifeLog: nextLog,
    },
    updatedAt: Date.now(),
  };
}

export function canInteractContact(
  state: GameState,
  contactId: RelationshipContactId,
  interaction: RelationshipInteractionType,
): { can: boolean; cost: number; reason?: string } {
  const life = normalizeLifeRpg(state.life);
  const contact = life.contacts[contactId];
  if (!contact) return { can: false, cost: 0, reason: 'Contact not found' };

  let cost = 0;
  if (interaction === 'coffee') cost = 14;
  if (interaction === 'dinner') cost = 68;
  if (interaction === 'gift') cost = 135;
  if (interaction === 'collaborate') cost = 0;

  if (state.cash < cost) {
    return { can: false, cost, reason: `Need $${cost} for this interaction` };
  }

  if (interaction === 'collaborate' && contact.affinity < 50) {
    return { can: false, cost, reason: 'Requires at least Friend status (50+ affinity) to collaborate' };
  }

  return { can: true, cost };
}

export function interactContact(
  state: GameState,
  contactId: RelationshipContactId,
  interaction: RelationshipInteractionType,
): { state: GameState; message: string } {
  const check = canInteractContact(state, contactId, interaction);
  if (!check.can) return { state, message: check.reason ?? 'Cannot interact' };

  const life = normalizeLifeRpg(state.life);
  const contactDef = relationshipContacts.find((c) => c.id === contactId)!;
  const currentContact = life.contacts[contactId];

  let affinityGain = 5;
  let socialGain = 8;
  let happinessGain = 6;
  let xpGain = 0;

  if (interaction === 'coffee') {
    affinityGain = 14;
    socialGain = 20;
    happinessGain = 12;
    xpGain = 15;
  } else if (interaction === 'dinner') {
    affinityGain = 24;
    socialGain = 32;
    happinessGain = 25;
    xpGain = 30;
  } else if (interaction === 'gift') {
    affinityGain = 35;
    socialGain = 25;
    happinessGain = 30;
  } else if (interaction === 'collaborate') {
    affinityGain = 18;
    socialGain = 25;
    happinessGain = 20;
    xpGain = 50;
  }

  const nextAffinity = Math.min(100, currentContact.affinity + affinityGain);
  let nextLevel = currentContact.level;
  if (nextAffinity >= 85) nextLevel = 'partner';
  else if (nextAffinity >= 60) nextLevel = 'confidant';
  else if (nextAffinity >= 30) nextLevel = 'friend';
  else nextLevel = 'acquaintance';

  const leveledUp = nextLevel !== currentContact.level;
  if (leveledUp) {
    playAchievementSound();
  } else if (check.cost > 0) {
    playPurchaseSound();
  } else {
    playClickSound();
  }

  const updatedContact: RelationshipContactState = {
    ...currentContact,
    affinity: nextAffinity,
    level: nextLevel,
    lastInteractedGameMinute: state.time.gameMinute,
    giftsGiven: currentContact.giftsGiven + (interaction === 'gift' ? 1 : 0),
  };

  const updatedNeeds: SimNeeds = {
    ...life.needs,
    social: Math.min(100, life.needs.social + socialGain),
    happiness: Math.min(100, life.needs.happiness + happinessGain),
  };

  let updatedLife = {
    ...life,
    needs: updatedNeeds,
    contacts: {
      ...life.contacts,
      [contactId]: updatedContact,
    },
  };

  if (xpGain > 0 && contactDef.primarySkill) {
    updatedLife = gainLifeSkillXp(updatedLife, contactDef.primarySkill, xpGain);
  }

  const nextLog = [
    {
      id: `rel-${Date.now()}`,
      gameMinute: state.time.gameMinute,
      timestamp: Date.now(),
      title: `${interaction.toUpperCase()}: ${contactDef.name}`,
      description: leveledUp
        ? `Bond deepened! Reached ${nextLevel.toUpperCase()} with ${contactDef.name}.`
        : `Spent quality time with ${contactDef.name}. Affinity reached ${nextAffinity}%.`,
      emoji: contactDef.emoji,
      category: 'relationship' as const,
    },
    ...updatedLife.lifeLog,
  ].slice(0, 40);

  updatedLife.lifeLog = nextLog;

  const nextState: GameState = {
    ...state,
    cash: state.cash - check.cost,
    totalSpent: state.totalSpent + check.cost,
    life: updatedLife,
    updatedAt: Date.now(),
  };

  return {
    state: nextState,
    message: leveledUp
      ? `🎉 Reached ${nextLevel.toUpperCase()} with ${contactDef.name}!`
      : `Connected with ${contactDef.name} (+${affinityGain}% affinity)`,
  };
}

export function canBuyVehicle(state: GameState, vehicleId: string): boolean {
  const life = normalizeLifeRpg(state.life);
  const v = vehicleDefinitions.find((entry) => entry.id === vehicleId);
  if (!v) return false;
  if (life.ownedVehicleIds.includes(vehicleId)) return false;
  return state.cash >= v.price;
}

export function buyVehicle(state: GameState, vehicleId: string): GameState {
  if (!canBuyVehicle(state, vehicleId)) return state;
  const v = vehicleDefinitions.find((entry) => entry.id === vehicleId)!;
  const life = normalizeLifeRpg(state.life);

  playPurchaseSound();

  const nextOwned = [...life.ownedVehicleIds, vehicleId];
  const nextLog = [
    {
      id: `veh-${Date.now()}`,
      gameMinute: state.time.gameMinute,
      timestamp: Date.now(),
      title: `Acquired ${v.name}`,
      description: `New wheels in the garage! ${v.description}`,
      emoji: v.emoji,
      category: 'milestone' as const,
    },
    ...life.lifeLog,
  ].slice(0, 40);

  return {
    ...state,
    cash: state.cash - v.price,
    totalSpent: state.totalSpent + v.price,
    life: {
      ...life,
      ownedVehicleIds: nextOwned,
      equippedVehicleId: vehicleId,
      lifeLog: nextLog,
    },
    updatedAt: Date.now(),
  };
}

export function equipVehicle(state: GameState, vehicleId: string): GameState {
  const life = normalizeLifeRpg(state.life);
  if (!life.ownedVehicleIds.includes(vehicleId)) return state;
  playClickSound();
  return {
    ...state,
    life: {
      ...life,
      equippedVehicleId: vehicleId,
    },
    updatedAt: Date.now(),
  };
}

export function lifeSkillLevel(life: LifeRpgState | undefined, skillId: LifeSkillId) {
  const xp = life?.skillXp?.[skillId] ?? 0;
  let level = 0;
  for (let i = 0; i < skillLevelThresholds.length; i += 1) {
    if (xp >= skillLevelThresholds[i]) level = i;
  }
  return Math.min(10, level);
}

export function lifeSkillProgress(life: LifeRpgState | undefined, skillId: LifeSkillId) {
  const xp = life?.skillXp?.[skillId] ?? 0;
  const level = lifeSkillLevel(life, skillId);
  const current = skillLevelThresholds[level] ?? skillLevelThresholds[skillLevelThresholds.length - 1];
  const next = skillLevelThresholds[Math.min(skillLevelThresholds.length - 1, level + 1)] ?? current;
  const progress = next <= current ? 1 : Math.max(0, Math.min(1, (xp - current) / (next - current)));
  return { xp, level, current, next, progress };
}

export function lifeSkillXpMultiplier(lifeInput: LifeRpgState | undefined, skillId: LifeSkillId) {
  const life = normalizeLifeRpg(lifeInput);
  if (!life.enabled) return 1;
  const primary = life.stats[primaryStatBySkill[skillId]] ?? 5;
  const adaptability = life.stats.adaptability ?? 5;
  const housing = currentHousing(life);
  const mood = getSimMood(life);

  const statBoost = (primary - 5) * 0.025 + (adaptability - 5) * 0.008;
  const housingBoost = Math.max(-0.05, Math.min(0.1, housing.focusBonus * 0.01));

  let furnishingsBoost = 0;
  if (life.furnishingIds.includes('pro-workstation') && ['technology', 'creative', 'finance'].includes(skillId)) {
    furnishingsBoost += 0.25;
  }

  return Math.max(0.65, Math.min(2.5, (1 + statBoost + housingBoost + furnishingsBoost) * mood.bonusXpMultiplier));
}

export function gainLifeSkillXp(lifeInput: LifeRpgState | undefined, skillId: LifeSkillId, amount: number) {
  const life = normalizeLifeRpg(lifeInput);
  if (!life.enabled || amount <= 0) return life;
  const adjusted = amount * lifeSkillXpMultiplier(life, skillId);
  return {
    ...life,
    skillXp: {
      ...life.skillXp,
      [skillId]: life.skillXp[skillId] + adjusted,
    },
  };
}

export function chooseLifeBackground(lifeInput: LifeRpgState | undefined, id: LifeBackgroundId) {
  const life = normalizeLifeRpg(lifeInput);
  if (life.backgroundId) return life;
  const background = lifeBackgrounds.find((entry) => entry.id === id);
  if (!background) return life;
  const stats = { ...life.stats };
  for (const [key, value] of Object.entries(background.statBonuses)) {
    stats[key as keyof LifeStats] = Math.min(20, stats[key as keyof LifeStats] + (value ?? 0));
  }
  const skillXp = { ...life.skillXp };
  for (const [key, value] of Object.entries(background.startingSkillXp)) {
    skillXp[key as LifeSkillId] += value ?? 0;
  }
  return { ...life, enabled: true, backgroundId: id, stats, skillXp };
}

export function enableLifeRpg(lifeInput: LifeRpgState | undefined, currentGameMinute = 0, dayLengthMinutes = 1440) {
  const life = normalizeLifeRpg(lifeInput, currentGameMinute, dayLengthMinutes);
  return {
    ...life,
    enabled: true,
    lastHousingChargeDay: Math.floor(currentGameMinute / Math.max(1, dayLengthMinutes)),
  };
}

export function currentHousing(lifeInput: LifeRpgState | undefined): HousingDefinition {
  const life = normalizeLifeRpg(lifeInput);
  return housingOptions.find((entry) => entry.id === life.housingId) ?? housingOptions[0];
}

export function housingAssetValue(lifeInput: LifeRpgState | undefined) {
  const life = normalizeLifeRpg(lifeInput);
  return life.ownedHousingIds.reduce(
    (sum, id) => sum + (housingOptions.find((entry) => entry.id === id)?.purchasePrice ?? 0),
    0,
  );
}

export function moveToHousing(state: GameState, housingId: string): GameState {
  const life = normalizeLifeRpg(state.life, state.time.gameMinute, state.time.settings.dayLengthMinutes);
  if (!life.enabled) return state;
  const housing = housingOptions.find((entry) => entry.id === housingId);
  if (!housing) return state;
  const alreadyOwned = housing.kind === 'owned' && life.ownedHousingIds.includes(housing.id);
  const upfront = alreadyOwned ? 0 : housing.upfrontCost;
  if (state.cash < upfront) return state;
  const ownedHousingIds = alreadyOwned || housing.kind !== 'owned'
    ? life.ownedHousingIds
    : [...life.ownedHousingIds, housing.id];

  playPurchaseSound();

  const nextLog = [
    {
      id: `house-${Date.now()}`,
      gameMinute: state.time.gameMinute,
      timestamp: Date.now(),
      title: `Relocated to ${housing.name}`,
      description: `Moved into ${housing.kind} residence. Daily carrying cost: $${housing.dailyCost}.`,
      emoji: housing.emoji,
      category: 'housing' as const,
    },
    ...life.lifeLog,
  ].slice(0, 40);

  return {
    ...state,
    cash: state.cash - upfront,
    totalSpent: state.totalSpent + upfront,
    life: {
      ...life,
      housingId: housing.id,
      ownedHousingIds,
      lastHousingChargeDay: Math.floor(state.time.gameMinute / Math.max(1, state.time.settings.dayLengthMinutes)),
      lifetimeHousingCost: life.lifetimeHousingCost + upfront,
      lifeLog: nextLog,
    },
    updatedAt: Date.now(),
  };
}

export function advanceLifeHousingCosts(
  state: GameState,
  previousGameMinute: number,
  nextGameMinute: number,
): GameState {
  const dayLength = Math.max(1, state.time.settings.dayLengthMinutes);
  const life = normalizeLifeRpg(state.life, previousGameMinute, dayLength);
  if (!life.enabled) return { ...state, life };
  const currentDay = Math.floor(nextGameMinute / dayLength);
  const dueDays = Math.max(0, currentDay - life.lastHousingChargeDay);
  if (!dueDays) return { ...state, life };
  const housing = currentHousing(life);
  const due = housing.dailyCost * dueDays;
  const available = Math.max(0, state.cash);
  const paid = Math.min(available, due);
  const arrears = life.housingArrears + (due - paid);
  return {
    ...state,
    cash: state.cash - paid,
    totalSpent: state.totalSpent + paid,
    life: {
      ...life,
      lastHousingChargeDay: currentDay,
      housingArrears: arrears,
      lifetimeHousingCost: life.lifetimeHousingCost + paid,
    },
  };
}

export function advanceLifeNeeds(
  state: GameState,
  previousGameMinute: number,
  nextGameMinute: number,
): GameState {
  const elapsedMinutes = Math.max(0, nextGameMinute - previousGameMinute);
  if (elapsedMinutes <= 0) return state;

  const life = normalizeLifeRpg(state.life);
  const hours = elapsedMinutes / 60;

  // Natural Sim decay rates per simulated hour:
  // Hunger: -2.5 / hr
  // Energy: -2.0 / hr
  // Happiness: -0.8 / hr
  // Social: -0.6 / hr
  const hungerDecay = hours * 2.5;
  const energyDecay = hours * 2.0;
  const happinessDecay = hours * 0.8;
  const socialDecay = hours * 0.6;

  // Passive benefits from furnishings per hour
  let passiveHappinessBonus = 0;
  let passiveHealthBonus = 0;
  if (life.furnishingIds.includes('botanical-oasis')) passiveHappinessBonus += 0.4 * hours;
  if (life.furnishingIds.includes('hi-fi-audio')) passiveHappinessBonus += 0.5 * hours;
  if (life.furnishingIds.includes('sauna-jacuzzi')) {
    passiveHealthBonus += 0.8 * hours;
    passiveHappinessBonus += 0.8 * hours;
  }

  const nextNeeds: SimNeeds = {
    energy: Math.max(5, Math.min(100, life.needs.energy - energyDecay)),
    hunger: Math.max(5, Math.min(100, life.needs.hunger - hungerDecay)),
    health: Math.max(5, Math.min(100, life.needs.health + passiveHealthBonus)),
    happiness: Math.max(5, Math.min(100, life.needs.happiness - happinessDecay + passiveHappinessBonus)),
    social: Math.max(5, Math.min(100, life.needs.social - socialDecay)),
  };

  return {
    ...state,
    life: {
      ...life,
      needs: nextNeeds,
      lastNeedDecayGameMinute: nextGameMinute,
    },
  };
}

export function lifeMeetsSkill(state: Pick<GameState, 'life'>, skillId?: LifeSkillId, requiredLevel = 0) {
  if (!skillId || requiredLevel <= 0) return true;
  const life = normalizeLifeRpg(state.life);
  if (!life.enabled) return true;
  return lifeSkillLevel(life, skillId) >= requiredLevel;
}
