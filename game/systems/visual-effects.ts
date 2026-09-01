import type { MicroMotionLevel } from '../micro-animation-types';
import { loadMicroMotionPreferences, microMotionProfile } from './micro-animations';

/**
 * Shared presentation budget for themes, card reveals, companions and future particle systems.
 * Components may use fewer effects than the budget, but should not exceed it without an explicit user action.
 */
export type VisualEffectsBudget = {
  level: MicroMotionLevel;
  name: string;
  animated: boolean;
  allowContinuousAmbientMotion: boolean;
  particleBudget: number;
  burstBudget: number;
  glowScale: number;
  animationScale: number;
};

export function visualEffectsBudget(level?: MicroMotionLevel): VisualEffectsBudget {
  const selected = level ?? loadMicroMotionPreferences().amplificationLevel;
  const profile = microMotionProfile(selected);
  return {
    level: profile.level,
    name: profile.name,
    animated: profile.level >= 2,
    allowContinuousAmbientMotion: profile.level >= 3,
    particleBudget: [0,0,2,8,20,40][profile.level],
    burstBudget: [0,0,1,2,4,8][profile.level],
    glowScale: profile.glow,
    animationScale: profile.scale,
  };
}

export function shouldAnimateAmbientEffects(level?: MicroMotionLevel) {
  return visualEffectsBudget(level).allowContinuousAmbientMotion;
}
