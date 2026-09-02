import type { EducationDefinition } from '@/game/education-types';
export const educationPrograms:EducationDefinition[]=[
{id:'food-handler',name:'Food Handler Certificate',emoji:'🍽️',description:'Low-cost service credential for food and hospitality roles.',skillId:'hospitality',requiredSkillLevel:0,cost:18,studyDays:1,skillXp:25},
{id:'customer-service',name:'Customer Service Certificate',emoji:'🎧',description:'Communication and service fundamentals.',skillId:'hospitality',requiredSkillLevel:1,cost:45,studyDays:2,skillXp:45},
{id:'forklift',name:'Forklift Certification',emoji:'🏗️',description:'Practical warehouse credential for logistics advancement.',skillId:'general-labor',requiredSkillLevel:1,cost:85,studyDays:2,skillXp:50},
{id:'trade-certificate',name:'Trade Certificate',emoji:'🧰',description:'Structured technical training for skilled field work.',skillId:'trades',requiredSkillLevel:2,cost:650,studyDays:12,skillXp:180},
{id:'design-portfolio',name:'Professional Design Portfolio',emoji:'🖼️',description:'Build a reviewed portfolio proving creative capability.',skillId:'creative',requiredSkillLevel:2,cost:120,studyDays:5,skillXp:100},
{id:'it-support',name:'IT Support Certificate',emoji:'🖥️',description:'Entry professional credential for technical support work.',skillId:'technology',requiredSkillLevel:2,cost:280,studyDays:7,skillXp:140},
{id:'bookkeeping',name:'Bookkeeping Certificate',emoji:'🧮',description:'Practical accounting and reconciliation credential.',skillId:'finance',requiredSkillLevel:2,cost:240,studyDays:7,skillXp:140},
{id:'sales-certificate',name:'Professional Sales Certificate',emoji:'🤝',description:'Prospecting, qualification and account fundamentals.',skillId:'sales',requiredSkillLevel:2,cost:180,studyDays:5,skillXp:110},
{id:'property-certificate',name:'Property Operations Certificate',emoji:'🔑',description:'Leasing, tenant and property operations training.',skillId:'real-estate',requiredSkillLevel:2,cost:320,studyDays:8,skillXp:150},
{id:'management-certificate',name:'Frontline Management Certificate',emoji:'📋',description:'Scheduling, coaching and basic operating management.',skillId:'management',requiredSkillLevel:2,cost:350,studyDays:8,skillXp:150},
];