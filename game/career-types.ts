import type { LifeSkillId } from './life-types';
import type { CredentialId } from './education-types';

export type CareerTrackId = 'service'|'logistics'|'trades'|'creative'|'sales'|'technology'|'finance'|'property';
export type EmploymentStatus = 'unemployed'|'employed';
export type CareerQualification = { credentialId?:CredentialId; experienceDays?:number; alternativeSkillLevel?:number; };
export type CareerJobDefinition = {
  id:string; trackId:CareerTrackId; name:string; emoji:string; description:string; payPerDay:number;
  requiredSkillId?:LifeSkillId; requiredSkillLevel?:number; requiredReputation?:number; nextJobId?:string; qualification?:CareerQualification;
};
export type CareerState = {
  status:EmploymentStatus; jobId:string|null; careerReputation:number; experienceDays:number; applications:number; promotions:number;
  lastPayday:number; lifetimeWages:number; performance:number; raiseMultiplier:number; raises:number; daysInCurrentJob:number; jobsHeld:number;
  voluntaryQuits:number; layoffs:number; fired:number; unemploymentDays:number;
};