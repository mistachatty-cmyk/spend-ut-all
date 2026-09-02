import type { PetMood } from './customization-types';

export type LooperProductionState = 'idle' | 'happy' | 'excited' | 'worried' | 'sleepy' | 'traveling' | 'celebrating';
export type LooperMotionSignature = 'squash' | 'coin' | 'servo' | 'tick' | 'flutter' | 'spark' | 'crawl' | 'slink' | 'signal' | 'float' | 'orbit' | 'coil' | 'ripple' | 'chime' | 'shadow' | 'stomp' | 'timeslip' | 'lunar' | 'void';

export type LooperProductionAnimation = {
  state: LooperProductionState;
  fps: number;
  loop: boolean;
  minEffectsLevel: number;
  signature: LooperMotionSignature;
};

export type LooperProductionManifest = {
  schemaVersion: 1;
  characterId: string;
  aliases: string[];
  artStandard: 'production-hd';
  fallback: 'classic-pixel';
  portraitSafeArea: number;
  animations: Record<LooperProductionState, LooperProductionAnimation>;
};

export const LOOPER_PRODUCTION_STATES: LooperProductionState[] = ['idle','happy','excited','worried','sleepy','traveling','celebrating'];

export function moodToProductionState(mood: PetMood): LooperProductionState {
  return mood;
}

export function productionAnimations(signature: LooperMotionSignature): LooperProductionManifest['animations'] {
  return {
    idle: { state:'idle', fps:6, loop:true, minEffectsLevel:2, signature },
    happy: { state:'happy', fps:8, loop:true, minEffectsLevel:2, signature },
    excited: { state:'excited', fps:9, loop:true, minEffectsLevel:2, signature },
    worried: { state:'worried', fps:8, loop:true, minEffectsLevel:2, signature },
    sleepy: { state:'sleepy', fps:4, loop:true, minEffectsLevel:2, signature },
    traveling: { state:'traveling', fps:9, loop:true, minEffectsLevel:2, signature },
    celebrating: { state:'celebrating', fps:10, loop:true, minEffectsLevel:2, signature },
  };
}
