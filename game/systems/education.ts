import { educationPrograms } from '@/data/education';
import type { CredentialId, EducationState } from '../education-types';
import type { GameState } from '../types';
import { gainLifeSkillXp, lifeSkillLevel } from './life-progression';

const CLASSIC_STUDY_COOLDOWN_MS = 8_000;

export function createEducationState(): EducationState {
  return {
    credentials: [],
    activeCredentialId: null,
    studyDaysRemaining: 0,
    lifetimeTuition: 0,
    completedPrograms: 0,
    manualStudyAvailableAt: 0,
  };
}

export function normalizeEducation(input?: Partial<EducationState> | null): EducationState {
  return {
    ...createEducationState(),
    ...input,
    credentials: Array.from(new Set(input?.credentials ?? [])),
    studyDaysRemaining: Math.max(0, input?.studyDaysRemaining ?? 0),
    lifetimeTuition: Math.max(0, input?.lifetimeTuition ?? 0),
    completedPrograms: Math.max(0, input?.completedPrograms ?? 0),
    manualStudyAvailableAt: Math.max(0, input?.manualStudyAvailableAt ?? 0),
  };
}

export function canEnroll(state: GameState, id: CredentialId) {
  const education = normalizeEducation(state.education);
  const program = educationPrograms.find(candidate => candidate.id === id);
  return Boolean(
    program
    && !education.activeCredentialId
    && !education.credentials.includes(id)
    && state.cash >= program.cost
    && lifeSkillLevel(state.life, program.skillId) >= program.requiredSkillLevel,
  );
}

export function enrollEducation(state: GameState, id: CredentialId): GameState {
  if (!canEnroll(state, id)) return state;
  const program = educationPrograms.find(candidate => candidate.id === id)!;
  const education = normalizeEducation(state.education);
  return {
    ...state,
    cash: state.cash - program.cost,
    totalSpent: state.totalSpent + program.cost,
    education: {
      ...education,
      activeCredentialId: id,
      studyDaysRemaining: program.studyDays,
      lifetimeTuition: education.lifetimeTuition + program.cost,
      manualStudyAvailableAt: 0,
    },
    updatedAt: Date.now(),
  };
}

function completeEducation(state: GameState, education: EducationState): GameState {
  if (!education.activeCredentialId) return { ...state, education };
  const program = educationPrograms.find(candidate => candidate.id === education.activeCredentialId);
  if (!program) {
    return {
      ...state,
      education: { ...education, activeCredentialId: null, studyDaysRemaining: 0, manualStudyAvailableAt: 0 },
    };
  }

  const credentials = education.credentials.includes(program.id)
    ? education.credentials
    : [...education.credentials, program.id];
  return {
    ...state,
    life: gainLifeSkillXp(state.life, program.skillId, program.skillXp),
    education: {
      ...education,
      credentials,
      activeCredentialId: null,
      studyDaysRemaining: 0,
      completedPrograms: education.completedPrograms + 1,
      manualStudyAvailableAt: 0,
    },
    updatedAt: Date.now(),
  };
}

export function advanceEducation(state: GameState, previousMinute: number, nextMinute: number): GameState {
  const education = normalizeEducation(state.education);
  if (!state.time.settings.enabled || !education.activeCredentialId) return { ...state, education };

  const dayLength = Math.max(1, state.time.settings.dayLengthMinutes);
  const elapsedDays = Math.max(
    0,
    Math.floor(nextMinute / dayLength) - Math.floor(previousMinute / dayLength),
  );
  if (!elapsedDays) return { ...state, education };

  const remaining = Math.max(0, education.studyDaysRemaining - elapsedDays);
  if (remaining > 0) return { ...state, education: { ...education, studyDaysRemaining: remaining } };
  return completeEducation(state, { ...education, studyDaysRemaining: 0 });
}

export function canManualStudy(state: GameState, now = Date.now()) {
  const education = normalizeEducation(state.education);
  return Boolean(
    !state.time.settings.enabled
    && education.activeCredentialId
    && education.studyDaysRemaining > 0
    && now >= education.manualStudyAvailableAt,
  );
}

export function manualStudySession(state: GameState, now = Date.now()): GameState {
  if (!canManualStudy(state, now)) return state;
  const education = normalizeEducation(state.education);
  const remaining = Math.max(0, education.studyDaysRemaining - 1);
  const nextEducation = {
    ...education,
    studyDaysRemaining: remaining,
    manualStudyAvailableAt: now + CLASSIC_STUDY_COOLDOWN_MS,
  };
  if (remaining > 0) return { ...state, education: nextEducation, updatedAt: now };
  return completeEducation(state, nextEducation);
}

export function manualStudyCooldownMs(state: GameState, now = Date.now()) {
  return Math.max(0, normalizeEducation(state.education).manualStudyAvailableAt - now);
}

export function hasCredential(state: Pick<GameState, 'education'>, id: CredentialId) {
  return normalizeEducation(state.education).credentials.includes(id);
}