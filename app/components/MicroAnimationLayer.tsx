'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import type { MicroMotionEvent, MicroMotionPoint, MicroMotionPreferences } from '@/game/micro-animation-types';
import { loadMicroMotionPreferences, microMotionProfile, subscribeMicroMotion, subscribeMicroMotionPreferences } from '@/game/systems/micro-animations';

type RenderedMotion = MicroMotionEvent & {
  start: MicroMotionPoint;
  end: MicroMotionPoint;
  targetColor: string | null;
};

type MotionStyle = CSSProperties & Record<'--micro-dx' | '--micro-dy' | '--micro-duration' | '--micro-delay' | '--micro-intensity' | '--micro-scale' | '--micro-glow-size' | '--micro-echo-duration', string>;

function resolveTarget(event: MicroMotionEvent) {
  if (typeof document === 'undefined') return { point:null as MicroMotionPoint | null, color:null as string | null };
  const target = document.querySelector<HTMLElement>(`[data-motion-target="${event.target}"]`);
  if (!target) return { point:null, color:null };
  const rect = target.getBoundingClientRect();
  return {
    point:{ x:rect.left + rect.width / 2, y:rect.top + rect.height / 2 },
    color:typeof window !== 'undefined' ? window.getComputedStyle(target).color : null,
  };
}

export function MicroAnimationLayer() {
  const [prefs, setPrefs] = useState<MicroMotionPreferences>(() => loadMicroMotionPreferences());
  const [motions, setMotions] = useState<RenderedMotion[]>([]);

  useEffect(() => subscribeMicroMotionPreferences(setPrefs), []);
  useEffect(() => {
    const profile = microMotionProfile(prefs.amplificationLevel);
    document.documentElement.dataset.effectsLevel = String(profile.level);
    document.documentElement.dataset.effectsName = profile.name.toLowerCase();
  }, [prefs.amplificationLevel]);
  useEffect(() => subscribeMicroMotion((event) => {
    const current = loadMicroMotionPreferences();
    const profile = microMotionProfile(current.amplificationLevel);
    const reduced = current.respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!current.enabled || !current.flyoutsEnabled || profile.level === 0 || reduced) return;
    const target = resolveTarget(event);
    const end = target.point ?? { x:Math.max(32, window.innerWidth - 90), y:70 };
    const fallbackStart = profile.moving ? { x:end.x, y:Math.min(window.innerHeight - 30, end.y + 110) } : end;
    const start = event.source ?? fallbackStart;
    const rendered: RenderedMotion = { ...event, start, end, targetColor:target.color };
    setMotions((items) => [...items.slice(-(Math.max(1, profile.maxConcurrent) - 1)), rendered]);
    const duration = (event.durationMs ?? 760) * profile.durationScale;
    const delay = event.delayMs ?? 0;
    window.setTimeout(() => setMotions((items) => items.filter((item) => item.id !== event.id)), duration + delay + 220);
  }), []);

  const profile = microMotionProfile(prefs.amplificationLevel);
  if (!prefs.enabled || !prefs.flyoutsEnabled || profile.level === 0) return null;

  return <div className={`micro-motion-layer symbol-${prefs.symbolStyle} amplification-${profile.level} ${profile.moving ? 'motion-moving' : 'motion-static'}`} aria-hidden="true">
    {motions.map((motion) => {
      const dx = profile.moving ? motion.end.x - motion.start.x : 0;
      const dy = profile.moving ? motion.end.y - motion.start.y : 0;
      const duration = (motion.durationMs ?? 760) * profile.durationScale;
      const delay = motion.delayMs ?? 0;
      const style: MotionStyle = {
        left:profile.moving ? motion.start.x : motion.end.x,
        top:profile.moving ? motion.start.y : motion.end.y,
        color:prefs.paletteReactive && motion.targetColor ? motion.targetColor : undefined,
        '--micro-dx':`${dx}px`,
        '--micro-dy':`${dy}px`,
        '--micro-duration':`${duration}ms`,
        '--micro-delay':`${delay}ms`,
        '--micro-intensity':String(prefs.intensity),
        '--micro-scale':String(profile.scale),
        '--micro-glow-size':`${14 * profile.glow}px`,
        '--micro-echo-duration':`${duration * .75}ms`,
      };
      return <div key={motion.id} className={`micro-motion micro-${motion.tone} micro-kind-${motion.kind} ${prefs.paletteReactive ? 'palette-reactive' : ''}`} style={style}>
        {Array.from({ length:profile.echoes }).map((_, index) => <span className="micro-echo" key={`echo-${index}`} style={{ animationDelay:`${80 + index * 70}ms` }} />)}
        {motion.symbol ? <span className="micro-symbol">{motion.symbol}</span> : null}
        <b>{motion.displayText}</b>
        <span className="micro-particles">{Array.from({ length:profile.particles }).map((_, index) => <i key={index} style={{ transform:`rotate(${index * (360 / Math.max(1, profile.particles))}deg) translateY(-${7 + (index % 3) * 4}px)` }} />)}</span>
      </div>;
    })}
  </div>;
}
