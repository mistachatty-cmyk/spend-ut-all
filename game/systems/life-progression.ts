import { housingOptions, lifeBackgrounds, skillLevelThresholds } from '@/data/life-progression';
import type { GameState } from '../types';
import type { HousingDefinition, LifeBackgroundId, LifeRpgState, LifeSkillId, LifeStats } from '../life-types';

const baseStats: LifeStats = { grit:5, focus:5, people:5, knowledge:5, adaptability:5 };

export function createLifeRpgState(enabled = false, currentGameMinute = 0, dayLengthMinutes = 1440): LifeRpgState {
  return {
    enabled,
    backgroundId:null,
    stats:{...baseStats},
    skillXp:{
      'general-labor':0,
      hospitality:0,
      sales:0,
      creative:0,
      technology:0,
      finance:0,
      management:0,
      trades:0,
      media:0,
      'real-estate':0,
    },
    housingId:'stay-with-someone',
    ownedHousingIds:[],
    lastHousingChargeDay:Math.floor(currentGameMinute / Math.max(1, dayLengthMinutes)),
    housingArrears:0,
    lifetimeHousingCost:0,
  };
}

export function normalizeLifeRpg(input: Partial<LifeRpgState> | null | undefined, currentGameMinute = 0, dayLengthMinutes = 1440): LifeRpgState {
  const base = createLifeRpgState(false,currentGameMinute,dayLengthMinutes);
  if (!input) return base;
  const skillXp = { ...base.skillXp, ...(input.skillXp ?? {}) };
  for (const key of Object.keys(skillXp) as LifeSkillId[]) skillXp[key] = Math.max(0, Number(skillXp[key]) || 0);
  const stats = { ...base.stats, ...(input.stats ?? {}) };
  for (const key of Object.keys(stats) as Array<keyof LifeStats>) stats[key] = Math.max(1, Math.min(20, Number(stats[key]) || 5));
  const housingId = housingOptions.some((entry)=>entry.id===input.housingId) ? input.housingId! : base.housingId;
  return {
    ...base,
    ...input,
    enabled:!!input.enabled,
    backgroundId:input.backgroundId ?? null,
    stats,
    skillXp,
    housingId,
    ownedHousingIds:Array.from(new Set(input.ownedHousingIds ?? [])),
    lastHousingChargeDay:Math.max(0,Math.floor(input.lastHousingChargeDay ?? base.lastHousingChargeDay)),
    housingArrears:Math.max(0,input.housingArrears ?? 0),
    lifetimeHousingCost:Math.max(0,input.lifetimeHousingCost ?? 0),
  };
}

export function lifeSkillLevel(life: LifeRpgState | undefined, skillId: LifeSkillId) {
  const xp = life?.skillXp?.[skillId] ?? 0;
  let level = 0;
  for (let i=0;i<skillLevelThresholds.length;i+=1) if (xp >= skillLevelThresholds[i]) level=i;
  return Math.min(10,level);
}

export function lifeSkillProgress(life: LifeRpgState | undefined, skillId: LifeSkillId) {
  const xp = life?.skillXp?.[skillId] ?? 0;
  const level = lifeSkillLevel(life,skillId);
  const current = skillLevelThresholds[level] ?? skillLevelThresholds[skillLevelThresholds.length-1];
  const next = skillLevelThresholds[Math.min(skillLevelThresholds.length-1,level+1)] ?? current;
  const progress = next <= current ? 1 : Math.max(0,Math.min(1,(xp-current)/(next-current)));
  return {xp,level,current,next,progress};
}

export function gainLifeSkillXp(lifeInput: LifeRpgState | undefined, skillId: LifeSkillId, amount: number) {
  const life = normalizeLifeRpg(lifeInput);
  if (!life.enabled || amount <= 0) return life;
  return { ...life, skillXp:{...life.skillXp,[skillId]:life.skillXp[skillId]+amount} };
}

export function chooseLifeBackground(lifeInput: LifeRpgState | undefined, id: LifeBackgroundId) {
  const life=normalizeLifeRpg(lifeInput);
  if (life.backgroundId) return life;
  const background=lifeBackgrounds.find((entry)=>entry.id===id);
  if (!background) return life;
  const stats={...life.stats};
  for (const [key,value] of Object.entries(background.statBonuses)) stats[key as keyof LifeStats]=Math.min(20,stats[key as keyof LifeStats]+(value ?? 0));
  const skillXp={...life.skillXp};
  for (const [key,value] of Object.entries(background.startingSkillXp)) skillXp[key as LifeSkillId]+=value ?? 0;
  return {...life,enabled:true,backgroundId:id,stats,skillXp};
}

export function enableLifeRpg(lifeInput: LifeRpgState | undefined, currentGameMinute = 0, dayLengthMinutes = 1440) {
  const life=normalizeLifeRpg(lifeInput,currentGameMinute,dayLengthMinutes);
  return {...life,enabled:true,lastHousingChargeDay:Math.floor(currentGameMinute/Math.max(1,dayLengthMinutes))};
}

export function currentHousing(lifeInput: LifeRpgState | undefined): HousingDefinition {
  const life=normalizeLifeRpg(lifeInput);
  return housingOptions.find((entry)=>entry.id===life.housingId) ?? housingOptions[0];
}

export function housingAssetValue(lifeInput: LifeRpgState | undefined) {
  const life=normalizeLifeRpg(lifeInput);
  return life.ownedHousingIds.reduce((sum,id)=>sum+(housingOptions.find((entry)=>entry.id===id)?.purchasePrice ?? 0),0);
}

export function moveToHousing(state: GameState, housingId: string): GameState {
  const life=normalizeLifeRpg(state.life,state.time.gameMinute,state.time.settings.dayLengthMinutes);
  if (!life.enabled) return state;
  const housing=housingOptions.find((entry)=>entry.id===housingId);
  if (!housing) return state;
  const alreadyOwned=housing.kind==='owned' && life.ownedHousingIds.includes(housing.id);
  const upfront=alreadyOwned ? 0 : housing.upfrontCost;
  if (state.cash < upfront) return state;
  const ownedHousingIds=alreadyOwned || housing.kind!=='owned' ? life.ownedHousingIds : [...life.ownedHousingIds,housing.id];
  return {
    ...state,
    cash:state.cash-upfront,
    totalSpent:state.totalSpent+upfront,
    life:{...life,housingId:housing.id,ownedHousingIds,lastHousingChargeDay:Math.floor(state.time.gameMinute/Math.max(1,state.time.settings.dayLengthMinutes)),lifetimeHousingCost:life.lifetimeHousingCost+upfront},
    updatedAt:Date.now(),
  };
}

export function advanceLifeHousingCosts(state: GameState, previousGameMinute: number, nextGameMinute: number): GameState {
  const dayLength=Math.max(1,state.time.settings.dayLengthMinutes);
  const life=normalizeLifeRpg(state.life,previousGameMinute,dayLength);
  if (!life.enabled) return {...state,life};
  const currentDay=Math.floor(nextGameMinute/dayLength);
  const dueDays=Math.max(0,currentDay-life.lastHousingChargeDay);
  if (!dueDays) return {...state,life};
  const housing=currentHousing(life);
  const due=housing.dailyCost*dueDays;
  const available=Math.max(0,state.cash);
  const paid=Math.min(available,due);
  const arrears=life.housingArrears+(due-paid);
  return {
    ...state,
    cash:state.cash-paid,
    totalSpent:state.totalSpent+paid,
    life:{...life,lastHousingChargeDay:currentDay,housingArrears:arrears,lifetimeHousingCost:life.lifetimeHousingCost+paid},
  };
}

export function lifeMeetsSkill(state: Pick<GameState,'life'>, skillId?: LifeSkillId, requiredLevel = 0) {
  if (!skillId || requiredLevel <= 0) return true;
  const life=normalizeLifeRpg(state.life);
  if (!life.enabled) return true;
  return lifeSkillLevel(life,skillId) >= requiredLevel;
}
