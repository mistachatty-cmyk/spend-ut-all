import type { HousingDefinition, LifeBackgroundId, LifeSkillId, LifeStatId } from '@/game/life-types';

export type LifeSkillDefinition = {
  id: LifeSkillId;
  name: string;
  emoji: string;
  description: string;
  examples: string;
};

export type LifeBackgroundDefinition = {
  id: LifeBackgroundId;
  name: string;
  emoji: string;
  description: string;
  statBonuses: Partial<Record<LifeStatId, number>>;
  startingSkillXp: Partial<Record<LifeSkillId, number>>;
};

export const lifeSkills: LifeSkillDefinition[] = [
  { id:'general-labor', name:'General Work', emoji:'🧰', description:'Reliability, physical work, temp jobs and basic service work.', examples:'odd jobs · shifts · moving · cleaning' },
  { id:'hospitality', name:'Hospitality', emoji:'☕', description:'Food, service, guest experience and customer-facing operations.', examples:'cafés · food carts · restaurants · hotels' },
  { id:'sales', name:'Sales', emoji:'🤝', description:'Negotiation, persuasion, pricing and closing deals.', examples:'reselling · commissions · retail · brokerage' },
  { id:'creative', name:'Creative', emoji:'🎨', description:'Design, visual production, content and creative client work.', examples:'design gigs · branding · media · agencies' },
  { id:'technology', name:'Technology', emoji:'💻', description:'Software, IT support, automation and digital products.', examples:'tech support · coding · SaaS · software firms' },
  { id:'finance', name:'Finance', emoji:'📊', description:'Bookkeeping, analysis, investing and capital management.', examples:'bookkeeping · investing · funds · banking' },
  { id:'management', name:'Management', emoji:'📋', description:'Planning, hiring, operations, leadership and scaling teams.', examples:'supervision · consulting · company growth' },
  { id:'trades', name:'Trades', emoji:'🔧', description:'Repair, maintenance, equipment, vehicles and hands-on services.', examples:'repairs · detailing · lawn care · contracting' },
  { id:'media', name:'Media', emoji:'🎙️', description:'Audience growth, publishing, advertising and production.', examples:'creator work · ad pages · production · media companies' },
  { id:'real-estate', name:'Real Estate', emoji:'🏠', description:'Housing, property operations, leasing and deal analysis.', examples:'property services · rentals · development' },
];

export const lifeBackgrounds: LifeBackgroundDefinition[] = [
  { id:'blank-slate', name:'Blank Slate', emoji:'🌱', description:'No assumptions. Balanced stats and no preloaded specialty.', statBonuses:{}, startingSkillXp:{} },
  { id:'grinder', name:'Reliable Grinder', emoji:'🧤', description:'You already know how to show up, work hard and keep going.', statBonuses:{grit:2,adaptability:1}, startingSkillXp:{'general-labor':80,hospitality:25} },
  { id:'people-person', name:'People Person', emoji:'🗣️', description:'Comfortable talking to customers, coworkers and strangers.', statBonuses:{people:2,adaptability:1}, startingSkillXp:{sales:70,hospitality:45} },
  { id:'maker', name:'Hands-On Maker', emoji:'🛠️', description:'You learn by fixing, building and taking things apart.', statBonuses:{grit:1,focus:1,knowledge:1}, startingSkillXp:{trades:80,'general-labor':35} },
  { id:'creative-starter', name:'Creative Starter', emoji:'✏️', description:'You already have an eye for making things look and feel better.', statBonuses:{focus:1,people:1,adaptability:1}, startingSkillXp:{creative:80,media:35} },
  { id:'digital-native', name:'Digital Native', emoji:'⌨️', description:'Comfortable learning tools, software and online workflows.', statBonuses:{knowledge:2,focus:1}, startingSkillXp:{technology:80,finance:25} },
];

export const housingOptions: HousingDefinition[] = [
  { id:'stay-with-someone', name:'Stay With Someone', emoji:'🛋️', kind:'informal', description:'Crash with family or a friend. Free, but not very stable or private.', upfrontCost:0, dailyCost:0, stability:1, focusBonus:0, recoveryBonus:-3 },
  { id:'shelter', name:'Temporary Shelter', emoji:'🛏️', kind:'temporary', description:'Emergency housing with no upfront cost and very limited comfort.', upfrontCost:0, dailyCost:0, stability:1, focusBonus:-2, recoveryBonus:-5 },
  { id:'motel', name:'Budget Motel', emoji:'🏨', kind:'temporary', description:'Flexible nightly housing. Expensive over time, but no lease commitment.', upfrontCost:85, dailyCost:85, stability:2, focusBonus:0, recoveryBonus:0 },
  { id:'room-rental', name:'Rent a Room', emoji:'🚪', kind:'rent', description:'A private room in someone else’s home or shared unit.', upfrontCost:700, dailyCost:23, stability:3, focusBonus:2, recoveryBonus:2 },
  { id:'shared-apartment', name:'Shared Apartment', emoji:'🏢', kind:'lease', description:'Split rent and utilities with roommates.', upfrontCost:950, dailyCost:32, stability:4, focusBonus:3, recoveryBonus:3 },
  { id:'studio-lease', name:'Studio Lease', emoji:'🏙️', kind:'lease', description:'A small place of your own with predictable monthly costs.', upfrontCost:1_400, dailyCost:47, stability:5, focusBonus:5, recoveryBonus:5 },
  { id:'one-bedroom', name:'One-Bedroom Lease', emoji:'🗝️', kind:'lease', description:'More space and privacy, with a higher recurring cost.', upfrontCost:1_800, dailyCost:60, stability:6, focusBonus:6, recoveryBonus:6 },
  { id:'small-house-rental', name:'Small House Rental', emoji:'🏡', kind:'rent', description:'A full small home without the capital required to buy.', upfrontCost:2_200, dailyCost:73, stability:7, focusBonus:7, recoveryBonus:7 },
  { id:'starter-condo', name:'Starter Condo', emoji:'🏘️', kind:'owned', description:'Buy a modest condo. It becomes an owned life asset instead of only a monthly expense.', upfrontCost:180_000, dailyCost:12, purchasePrice:180_000, stability:8, focusBonus:8, recoveryBonus:8 },
  { id:'starter-house', name:'Starter House', emoji:'🏠', kind:'owned', description:'A practical first home with ongoing tax, insurance and maintenance costs.', upfrontCost:300_000, dailyCost:16, purchasePrice:300_000, stability:9, focusBonus:9, recoveryBonus:9 },
  { id:'townhome', name:'Townhome', emoji:'🏘️', kind:'owned', description:'A larger owned residence with more space and carrying cost.', upfrontCost:420_000, dailyCost:20, purchasePrice:420_000, stability:10, focusBonus:10, recoveryBonus:10 },
];

export const skillLevelThresholds = [0, 60, 160, 320, 560, 900, 1_350, 1_900, 2_600, 3_450, 4_500];
