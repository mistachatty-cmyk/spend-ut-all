import type { ActivityDefinition, TimeEvent } from '@/game/time-types';

export const activities: ActivityDefinition[] = [
  { id: 'microtask-block', name: 'Online Microtask Block', emoji: '📱', category: 'work', durationMinutes: 45, description: 'Knock out simple online tasks for a little cash without needing startup money.', income: 18, partTime: true, industry: 'gig', fatigueDelta: 2, skillId:'general-labor', skillXp:8 },
  { id: 'neighborhood-help', name: 'Neighborhood Help', emoji: '🧹', category: 'work', durationMinutes: 90, description: 'Help with moving, cleanup, errands or basic chores.', income: 45, partTime: true, industry: 'local-service', fatigueDelta: 5, skillId:'general-labor', skillXp:12 },
  { id: 'pet-sitting-block', name: 'Pet Sitting / Dog Walk', emoji: '🐕', category: 'work', durationMinutes: 90, description: 'A low-barrier local gig with almost no startup cost.', income: 40, partTime: true, industry: 'local-service', fatigueDelta: 4, skillId:'hospitality', skillXp:10 },
  { id: 'yard-work-block', name: 'Yard Work Block', emoji: '🌿', category: 'work', durationMinutes: 120, description: 'Do basic mowing, cleanup or outdoor labor for quick cash.', income: 75, partTime: true, industry: 'trades', fatigueDelta: 10, skillId:'trades', skillXp:14 },
  { id: 'shift-cafe', name: 'Part-Time Café Shift', emoji: '☕', category: 'work', durationMinutes: 240, description: 'Work a four-hour shift for reliable early cash.', income: 120, partTime: true, availability: { startHour: 6, endHour: 22, weekdays: [1,2,3,4,5,6] }, industry: 'hospitality', fatigueDelta: 12, skillId:'hospitality', skillXp:18 },
  { id: 'delivery-block', name: 'Delivery Block', emoji: '🚲', category: 'work', durationMinutes: 180, description: 'Run a focused delivery block for flexible cash.', income: 105, partTime: true, industry: 'logistics', fatigueDelta: 10, skillId:'general-labor', skillXp:14 },
  { id: 'shift-warehouse', name: 'Warehouse Shift', emoji: '📦', category: 'work', durationMinutes: 480, description: 'Put in a full eight-hour shift.', income: 320, availability: { startHour: 5, endHour: 23 }, industry: 'logistics', fatigueDelta: 24, skillId:'general-labor', skillXp:28 },
  { id: 'freelance-design-block', name: 'Creative Freelance Block', emoji: '🎨', category: 'work', durationMinutes: 120, description: 'Two focused hours of visual or creative client work.', income: 300, partTime: true, industry: 'creative', fatigueDelta: 7, skillId:'creative', skillXp:20 },
  { id: 'freelance-block', name: 'Tech Freelance Block', emoji: '💻', category: 'work', durationMinutes: 120, description: 'Two focused hours of contract technical work.', income: 450, partTime: true, industry: 'technology', fatigueDelta: 8, skillId:'technology', skillXp:22 },
  { id: 'sales-shift', name: 'Commission Sales Block', emoji: '🤝', category: 'work', durationMinutes: 180, description: 'Spend a few hours prospecting and closing smaller deals.', income: 380, partTime: true, industry: 'sales', fatigueDelta: 9, skillId:'sales', skillXp:22 },
  { id: 'client-meeting', name: 'Major Client Meeting', emoji: '📋', category: 'business', durationMinutes: 90, description: 'Spend time closing a higher-value deal.', income: 2500, availability: { startHour: 8, endHour: 18, weekdays: [1,2,3,4,5] }, industry: 'business', fatigueDelta: 6, skillId:'management', skillXp:24 },

  { id: 'study-work-basics', name: 'Free Work Basics Course', emoji: '📚', category: 'learning', durationMinutes: 60, description: 'Use free online resources to improve reliability, workplace habits and basic job readiness.', cost:0, fatigueDelta:2, skillId:'general-labor', skillXp:24 },
  { id: 'study-hospitality', name: 'Hospitality Practice', emoji: '☕', category: 'learning', durationMinutes: 75, description: 'Practice service flow, customer handling and food-service basics.', cost:0, fatigueDelta:2, skillId:'hospitality', skillXp:24 },
  { id: 'study-sales', name: 'Sales Practice', emoji: '🗣️', category: 'learning', durationMinutes: 75, description: 'Practice discovery questions, pricing, negotiation and closing.', cost:0, fatigueDelta:2, skillId:'sales', skillXp:24 },
  { id: 'study-creative', name: 'Creative Practice Session', emoji: '✏️', category: 'learning', durationMinutes: 90, description: 'Practice design, editing, visual problem solving or content creation.', cost:0, fatigueDelta:3, skillId:'creative', skillXp:28 },
  { id: 'study-technology', name: 'Coding / Tech Study', emoji: '⌨️', category: 'learning', durationMinutes: 90, description: 'Learn software, automation, troubleshooting or programming with free resources.', cost:0, fatigueDelta:3, skillId:'technology', skillXp:28 },
  { id: 'study-finance', name: 'Finance Study Session', emoji: '📊', category: 'learning', durationMinutes: 90, description: 'Learn budgeting, bookkeeping, valuation and financial analysis.', cost:0, fatigueDelta:3, skillId:'finance', skillXp:28 },
  { id: 'study-management', name: 'Management Study Session', emoji: '📋', category: 'learning', durationMinutes: 90, description: 'Study planning, leadership, hiring and business operations.', cost:0, fatigueDelta:3, skillId:'management', skillXp:28 },
  { id: 'study-trades', name: 'DIY / Trades Practice', emoji: '🔧', category: 'learning', durationMinutes: 90, description: 'Practice repair, tools, maintenance and hands-on work.', cost:5, fatigueDelta:5, skillId:'trades', skillXp:28 },
  { id: 'study-media', name: 'Media Practice Session', emoji: '🎙️', category: 'learning', durationMinutes: 90, description: 'Practice shooting, editing, publishing, audience growth and ad basics.', cost:0, fatigueDelta:3, skillId:'media', skillXp:28 },
  { id: 'study-real-estate', name: 'Real Estate Study', emoji: '🏠', category: 'learning', durationMinutes: 90, description: 'Learn leases, property math, maintenance and deal analysis.', cost:0, fatigueDelta:3, skillId:'real-estate', skillXp:28 },

  { id: 'regional-flight', name: 'Regional Flight', emoji: '✈️', category: 'travel', durationMinutes: 240, description: 'Fly four hours to another business market.', cost: 450, fatigueDelta: 8, jetLagDelta: 8 },
  { id: 'long-haul-flight', name: 'Long-Haul Flight', emoji: '🛫', category: 'travel', durationMinutes: 720, description: 'Cross multiple time zones for international business.', cost: 3200, fatigueDelta: 18, jetLagDelta: 28 },
  { id: 'sleep', name: 'Sleep', emoji: '😴', category: 'recovery', durationMinutes: 480, description: 'Recover with eight hours of sleep.', fatigueDelta: -55, jetLagDelta: -12 },
  { id: 'power-nap', name: 'Power Nap', emoji: '🛋️', category: 'recovery', durationMinutes: 30, description: 'Trade half an hour for a quick recovery boost.', fatigueDelta: -12, jetLagDelta: -2 },
  { id: 'espresso-break', name: 'Espresso Break', emoji: '☕', category: 'recovery', durationMinutes: 10, description: 'A short caffeine stop that temporarily cuts fatigue.', cost: 6, fatigueDelta: -10 },
];

export const timeEvents: TimeEvent[] = [
  { id: 'flight-delay', name: 'Flight Delay', emoji: '🕓', description: 'A delay eats into your schedule and leaves you more tired.', durationMinutes: 90, fatigueDelta: 6 },
  { id: 'red-eye', name: 'Rough Red-Eye', emoji: '🌙', description: 'The overnight leg hits harder than expected.', durationMinutes: 0, fatigueDelta: 10, jetLagDelta: 12 },
  { id: 'walk-in-client', name: 'Unexpected Client', emoji: '🤝', description: 'A surprise opportunity appears in your schedule.', durationMinutes: 45, incomeMultiplier: 1.25 },
  { id: 'quiet-day', name: 'Quiet Industry Day', emoji: '📉', description: 'Demand is unusually slow today.', durationMinutes: 0, incomeMultiplier: 0.85 },
];
