import type { LifeSkillId } from './life-types';

export type CareerTrackId = 'service'|'logistics'|'trades'|'creative'|'sales'|'technology'|'finance'|'property';
export type EmploymentStatus = 'unemployed'|'employed';

export type CareerJobDefinition = {
  id:string;
  trackId:CareerTrackId;
  name:string;
  emoji:string;
  description:string;
  payPerDay:number;
  requiredSkillId?:LifeSkillId;
  requiredSkillLevel?:number;
  requiredReputation?:number;
  nextJobId?:string;
};

export type CareerState = {
  status:EmploymentStatus;
  jobId:string|null;
  careerReputation:number;
  experienceDays:number;
  applications:number;
  promotions:number;
  lastPayday:number;
  lifetimeWages:number;
};