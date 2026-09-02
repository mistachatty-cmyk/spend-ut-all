import type { PetMood } from '@/game/customization-types';

export type LooperReactionEvent =
  | 'run-start'
  | 'cash-gain'
  | 'cash-loss'
  | 'lok-gain'
  | 'purchase'
  | 'achievement'
  | 'world-event-good'
  | 'world-event-bad'
  | 'debt-warning'
  | 'card-discovery'
  | 'travel'
  | 'idle-long';

export type LooperReaction = {
  mood: PetMood;
  holdMs: number;
  priority: number;
};

const reactions: Record<LooperReactionEvent, LooperReaction> = {
  'run-start': { mood:'happy', holdMs:2200, priority:2 },
  'cash-gain': { mood:'happy', holdMs:1200, priority:1 },
  'cash-loss': { mood:'worried', holdMs:1800, priority:2 },
  'lok-gain': { mood:'excited', holdMs:1500, priority:1 },
  'purchase': { mood:'happy', holdMs:1400, priority:1 },
  'achievement': { mood:'celebrating', holdMs:3200, priority:4 },
  'world-event-good': { mood:'excited', holdMs:2600, priority:3 },
  'world-event-bad': { mood:'worried', holdMs:3000, priority:3 },
  'debt-warning': { mood:'worried', holdMs:3600, priority:4 },
  'card-discovery': { mood:'celebrating', holdMs:3000, priority:4 },
  'travel': { mood:'traveling', holdMs:2400, priority:2 },
  'idle-long': { mood:'sleepy', holdMs:5000, priority:0 },
};

export function looperReaction(event: LooperReactionEvent): LooperReaction {
  return reactions[event];
}

export function chooseLooperReaction(current: LooperReaction | null, incoming: LooperReactionEvent) {
  const next = reactions[incoming];
  if (!current || next.priority >= current.priority) return next;
  return current;
}
