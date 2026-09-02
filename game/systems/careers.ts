import { careerJobs, starterCareerJobIds } from '@/data/careers';
import type { CareerJobDefinition, CareerState } from '../career-types';
import type { GameState } from '../types';
import { hasCredential } from './education';
import { gainLifeSkillXp, lifeSkillLevel } from './life-progression';

const validJobIds = new Set(careerJobs.map(job => job.id));
const CLASSIC_SHIFT_COOLDOWN_MS = 15_000;

function uniqueValidJobIds(ids: string[] = []) {
  return [...new Set([...starterCareerJobIds, ...ids.filter(id => validJobIds.has(id))])];
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function boardDay(state: GameState) {
  const dayLength = Math.max(1, state.time.settings.dayLengthMinutes);
  return Math.floor(state.time.gameMinute / dayLength);
}

export function createCareerState(): CareerState {
  return {
    status: 'unemployed',
    jobId: null,
    careerReputation: 0,
    experienceDays: 0,
    applications: 0,
    promotions: 0,
    lastPayday: 0,
    lifetimeWages: 0,
    performance: 50,
    raiseMultiplier: 1,
    raises: 0,
    daysInCurrentJob: 0,
    jobsHeld: 0,
    voluntaryQuits: 0,
    layoffs: 0,
    fired: 0,
    unemploymentDays: 0,
    knownJobIds: [...starterCareerJobIds],
    jobResearches: 0,
    boardRotation: 0,
    manualShifts: 0,
    manualShiftAvailableAt: 0,
  };
}

export function normalizeCareer(input?: Partial<CareerState> | null): CareerState {
  const base = createCareerState();
  return {
    ...base,
    ...input,
    careerReputation: Math.max(0, input?.careerReputation ?? 0),
    experienceDays: Math.max(0, input?.experienceDays ?? 0),
    applications: Math.max(0, input?.applications ?? 0),
    promotions: Math.max(0, input?.promotions ?? 0),
    lifetimeWages: Math.max(0, input?.lifetimeWages ?? 0),
    performance: Math.max(0, Math.min(100, input?.performance ?? 50)),
    raiseMultiplier: Math.max(1, input?.raiseMultiplier ?? 1),
    raises: Math.max(0, input?.raises ?? 0),
    daysInCurrentJob: Math.max(0, input?.daysInCurrentJob ?? 0),
    jobsHeld: Math.max(0, input?.jobsHeld ?? 0),
    voluntaryQuits: Math.max(0, input?.voluntaryQuits ?? 0),
    layoffs: Math.max(0, input?.layoffs ?? 0),
    fired: Math.max(0, input?.fired ?? 0),
    unemploymentDays: Math.max(0, input?.unemploymentDays ?? 0),
    knownJobIds: uniqueValidJobIds(input?.knownJobIds),
    jobResearches: Math.max(0, input?.jobResearches ?? 0),
    boardRotation: Math.max(0, input?.boardRotation ?? 0),
    manualShifts: Math.max(0, input?.manualShifts ?? 0),
    manualShiftAvailableAt: Math.max(0, input?.manualShiftAvailableAt ?? 0),
  };
}

export function currentCareerJob(state: Pick<GameState, 'career'>) {
  const career = normalizeCareer(state.career);
  return careerJobs.find(job => job.id === career.jobId) ?? null;
}

export function careerQualificationMet(state: GameState, jobId: string) {
  const job = careerJobs.find(candidate => candidate.id === jobId);
  if (!job?.qualification) return true;

  const qualification = job.qualification;
  const career = normalizeCareer(state.career);
  const skill = lifeSkillLevel(state.life, job.requiredSkillId ?? 'general-labor');
  const credential = Boolean(qualification.credentialId && hasCredential(state, qualification.credentialId));
  const experienced = career.experienceDays >= (qualification.experienceDays ?? Number.POSITIVE_INFINITY);
  const selfTaught = skill >= (qualification.alternativeSkillLevel ?? Number.POSITIVE_INFINITY);
  return credential || experienced || selfTaught;
}

export function careerJobUnlocked(state: GameState, jobId: string) {
  const job = careerJobs.find(candidate => candidate.id === jobId);
  if (!job) return false;
  if (!state.life.enabled) return true;

  const career = normalizeCareer(state.career);
  return (
    lifeSkillLevel(state.life, job.requiredSkillId ?? 'general-labor') >= (job.requiredSkillLevel ?? 0)
    && career.careerReputation >= (job.requiredReputation ?? 0)
    && careerQualificationMet(state, jobId)
  );
}

export function careerJobDiscovered(state: GameState, jobId: string) {
  const job = careerJobs.find(candidate => candidate.id === jobId);
  if (!job) return false;
  if (!state.life.enabled || job.alwaysVisible) return true;

  const career = normalizeCareer(state.career);
  if (career.jobId === jobId || career.knownJobIds.includes(jobId)) return true;

  const skill = lifeSkillLevel(state.life, job.requiredSkillId ?? 'general-labor');
  const requiredSkill = job.requiredSkillLevel ?? 0;
  const nearSkillGate = skill >= Math.max(1, requiredSkill - 1);
  const nearReputationGate = career.careerReputation >= Math.max(0, (job.requiredReputation ?? 0) - 5);
  const credentialRoute = Boolean(job.qualification?.credentialId && hasCredential(state, job.qualification.credentialId));
  return (nearSkillGate && nearReputationGate) || credentialRoute;
}

export function discoveredCareerJobs(state: GameState) {
  return careerJobs.filter(job => careerJobDiscovered(state, job.id));
}

export function careerBoardJobs(state: GameState, size = 12): CareerJobDefinition[] {
  const career = normalizeCareer(state.career);
  const seed = boardDay(state) * 31 + career.boardRotation * 131 + career.jobResearches * 17;
  const discovered = discoveredCareerJobs(state);

  const ranked = discovered
    .map(job => ({ job, score: hashString(`${seed}:${job.id}`) / Math.max(1, job.marketWeight ?? 1) }))
    .sort((a, b) => a.score - b.score)
    .map(entry => entry.job);

  const current = career.jobId ? careerJobs.find(job => job.id === career.jobId) : null;
  const result = ranked.slice(0, Math.max(1, size));
  if (current && !result.some(job => job.id === current.id)) result[result.length - 1] = current;
  return result;
}

export function rotateCareerBoard(state: GameState): GameState {
  const career = normalizeCareer(state.career);
  return { ...state, career: { ...career, boardRotation: career.boardRotation + 1 }, updatedAt: Date.now() };
}

export function researchCareers(state: GameState, discoveries = 3): GameState {
  const career = normalizeCareer(state.career);
  const hidden = careerJobs.filter(job => !careerJobDiscovered(state, job.id));
  if (!hidden.length) {
    return {
      ...state,
      career: { ...career, jobResearches: career.jobResearches + 1, boardRotation: career.boardRotation + 1 },
      updatedAt: Date.now(),
    };
  }

  const ranked = hidden
    .map(job => {
      const skill = lifeSkillLevel(state.life, job.requiredSkillId ?? 'general-labor');
      const skillGap = Math.max(0, (job.requiredSkillLevel ?? 0) - skill);
      const reputationGap = Math.max(0, (job.requiredReputation ?? 0) - career.careerReputation);
      const discoveryFit = skillGap * 100 + reputationGap * 4;
      const tieBreak = hashString(`${career.jobResearches}:${job.id}`) % 100;
      return { job, score: discoveryFit + tieBreak / 100 };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.max(1, discoveries))
    .map(entry => entry.job.id);

  return {
    ...state,
    career: {
      ...career,
      knownJobIds: uniqueValidJobIds([...career.knownJobIds, ...ranked]),
      jobResearches: career.jobResearches + 1,
      boardRotation: career.boardRotation + 1,
    },
    updatedAt: Date.now(),
  };
}

export function applyForCareer(state: GameState, jobId: string): GameState {
  if (!careerJobUnlocked(state, jobId)) return state;
  const career = normalizeCareer(state.career);
  return {
    ...state,
    career: {
      ...career,
      status: 'employed',
      jobId,
      applications: career.applications + 1,
      lastPayday: Math.floor(state.time.gameMinute / Math.max(1, state.time.settings.dayLengthMinutes)),
      performance: 50,
      raiseMultiplier: 1,
      daysInCurrentJob: 0,
      jobsHeld: career.jobsHeld + (career.jobId === jobId ? 0 : 1),
      knownJobIds: uniqueValidJobIds([...career.knownJobIds, jobId]),
      manualShiftAvailableAt: 0,
    },
    updatedAt: Date.now(),
  };
}

export function leaveCareer(state: GameState): GameState {
  const career = normalizeCareer(state.career);
  return {
    ...state,
    career: {
      ...career,
      status: 'unemployed',
      jobId: null,
      performance: 50,
      raiseMultiplier: 1,
      daysInCurrentJob: 0,
      voluntaryQuits: career.voluntaryQuits + 1,
      manualShiftAvailableAt: 0,
    },
    updatedAt: Date.now(),
  };
}

export function promoteCareer(state: GameState): GameState {
  const career = normalizeCareer(state.career);
  const current = careerJobs.find(job => job.id === career.jobId);
  if (!current?.nextJobId || !careerJobUnlocked(state, current.nextJobId) || career.performance < 65) return state;

  return {
    ...state,
    career: {
      ...career,
      jobId: current.nextJobId,
      promotions: career.promotions + 1,
      raiseMultiplier: 1,
      daysInCurrentJob: 0,
      performance: Math.max(55, career.performance - 10),
      knownJobIds: uniqueValidJobIds([...career.knownJobIds, current.nextJobId]),
      manualShiftAvailableAt: 0,
    },
    updatedAt: Date.now(),
  };
}

export function requestCareerRaise(state: GameState): GameState {
  const career = normalizeCareer(state.career);
  if (career.status !== 'employed' || career.daysInCurrentJob < 10 || career.performance < 70) return state;
  const bump = career.performance >= 90 ? 0.12 : career.performance >= 80 ? 0.08 : 0.05;
  return {
    ...state,
    career: {
      ...career,
      raiseMultiplier: career.raiseMultiplier * (1 + bump),
      raises: career.raises + 1,
      performance: Math.max(50, career.performance - 12),
    },
    updatedAt: Date.now(),
  };
}

export function careerDailyPay(state: GameState) {
  const career = normalizeCareer(state.career);
  const job = careerJobs.find(candidate => candidate.id === career.jobId);
  return job ? job.payPerDay * career.raiseMultiplier : 0;
}

export function canManualCareerShift(state: GameState, now = Date.now()) {
  const career = normalizeCareer(state.career);
  return Boolean(
    !state.time.settings.enabled
    && career.status === 'employed'
    && career.jobId
    && now >= career.manualShiftAvailableAt,
  );
}

export function manualCareerShiftCooldownMs(state: GameState, now = Date.now()) {
  return Math.max(0, normalizeCareer(state.career).manualShiftAvailableAt - now);
}

export function performManualCareerShift(state: GameState, now = Date.now()): GameState {
  if (!canManualCareerShift(state, now)) return state;
  const career = normalizeCareer(state.career);
  const job = careerJobs.find(candidate => candidate.id === career.jobId);
  if (!job) return state;

  const wages = job.payPerDay * career.raiseMultiplier;
  const skillId = job.requiredSkillId ?? 'general-labor';
  const skillLevel = lifeSkillLevel(state.life, skillId);
  const performanceGain = skillLevel >= (job.requiredSkillLevel ?? 0) + 2 ? 2 : 1;
  const life = state.life.enabled ? gainLifeSkillXp(state.life, skillId, 12) : state.life;
  const nextCash = state.cash + wages;

  return {
    ...state,
    cash: nextCash,
    lifetimeIncome: state.lifetimeIncome + wages,
    peakCash: Math.max(state.peakCash, nextCash),
    life,
    career: {
      ...career,
      lifetimeWages: career.lifetimeWages + wages,
      experienceDays: career.experienceDays + 1,
      daysInCurrentJob: career.daysInCurrentJob + 1,
      careerReputation: career.careerReputation + 1,
      performance: Math.min(100, career.performance + performanceGain),
      manualShifts: career.manualShifts + 1,
      manualShiftAvailableAt: now + CLASSIC_SHIFT_COOLDOWN_MS,
    },
    updatedAt: now,
  };
}

export function advanceCareerPay(state: GameState, _previousGameMinute: number, nextGameMinute: number): GameState {
  const career = normalizeCareer(state.career);
  if (!state.time.settings.enabled) return { ...state, career };

  const dayLength = Math.max(1, state.time.settings.dayLengthMinutes);
  const currentDay = Math.floor(nextGameMinute / dayLength);
  const dueDays = Math.max(0, currentDay - career.lastPayday);
  if (!dueDays) return { ...state, career };

  if (career.status !== 'employed' || !career.jobId) {
    return { ...state, career: { ...career, lastPayday: currentDay, unemploymentDays: career.unemploymentDays + dueDays } };
  }

  const job = careerJobs.find(candidate => candidate.id === career.jobId);
  if (!job) return { ...state, career: { ...career, status: 'unemployed', jobId: null, lastPayday: currentDay } };

  const skillLevel = lifeSkillLevel(state.life, job.requiredSkillId ?? 'general-labor');
  const performanceGain = skillLevel >= (job.requiredSkillLevel ?? 0) + 2 ? 2 : 1;
  const performance = Math.max(0, Math.min(100, career.performance + dueDays * performanceGain));
  const wages = job.payPerDay * career.raiseMultiplier * dueDays;

  let nextCareer: CareerState = {
    ...career,
    lastPayday: currentDay,
    lifetimeWages: career.lifetimeWages + wages,
    experienceDays: career.experienceDays + dueDays,
    daysInCurrentJob: career.daysInCurrentJob + dueDays,
    careerReputation: career.careerReputation + dueDays,
    performance,
  };

  if (nextCareer.daysInCurrentJob >= 7 && nextCareer.performance < 20) {
    nextCareer = {
      ...nextCareer,
      status: 'unemployed',
      jobId: null,
      fired: nextCareer.fired + 1,
      careerReputation: Math.max(0, nextCareer.careerReputation - 5),
      daysInCurrentJob: 0,
      raiseMultiplier: 1,
    };
  } else if (nextCareer.daysInCurrentJob >= 30 && (currentDay + nextCareer.jobsHeld * 7) % 97 === 0) {
    nextCareer = {
      ...nextCareer,
      status: 'unemployed',
      jobId: null,
      layoffs: nextCareer.layoffs + 1,
      daysInCurrentJob: 0,
      raiseMultiplier: 1,
    };
  }

  return {
    ...state,
    cash: state.cash + wages,
    lifetimeIncome: state.lifetimeIncome + wages,
    career: nextCareer,
  };
}