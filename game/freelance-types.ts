import type { BusinessId } from './business-types';
import type { LifeSkillId } from './life-types';

export type FreelanceServiceId =
  | 'odd-jobs'
  | 'cleaning-gig'
  | 'yard-gig'
  | 'delivery-gig'
  | 'moving-help'
  | 'detailing-job'
  | 'food-pop-up'
  | 'repair-call'
  | 'design-commission'
  | 'photo-gig'
  | 'video-edit'
  | 'social-content'
  | 'tech-help'
  | 'website-build'
  | 'bookkeeping-client'
  | 'sales-referral'
  | 'property-turnover'
  | 'event-service'
  | 'resale-scout';

export type FreelanceServiceDefinition = {
  id: FreelanceServiceId;
  name: string;
  emoji: string;
  description: string;
  skillId: LifeSkillId;
  requiredSkillLevel: number;
  requiredReputation?: number;
  basePayout: number;
  payoutVariance: number;
  cooldownMs: number;
  targetBusinessId?: BusinessId;
  alwaysVisible?: boolean;
};

export type FreelanceClient = {
  id: string;
  name: string;
  serviceId: FreelanceServiceId;
  trust: number;
  jobsCompleted: number;
  totalSpend: number;
};

export type FreelanceState = {
  reputation: number;
  portfolio: number;
  completedJobs: number;
  failedJobs: number;
  lifetimeRevenue: number;
  repeatClients: number;
  knownServiceIds: FreelanceServiceId[];
  researchCount: number;
  offerRotation: number;
  clients: FreelanceClient[];
  serviceCooldownUntil: Partial<Record<FreelanceServiceId, number>>;
  completedByService: Partial<Record<FreelanceServiceId, number>>;
};