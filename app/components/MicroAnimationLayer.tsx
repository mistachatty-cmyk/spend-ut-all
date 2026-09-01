'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import type { MicroMotionEvent, MicroMotionPoint, MicroMotionPreferences } from '@/game/micro-animation-types';
import { loadMicroMotionPreferences, subscribeMicroMotion, subscribeMicroMotionPreferences } from '@/game/systems/micro-animations';

type RenderedMotion = MicroMotionEvent & {
  start: MicroMotionPoint;
  end: MicroMotionPoint;
  targetColor: string | null;
};

type MotionStyle = CSSProperties & Record<'--micro-dx' | '--micro-dy' | '--micro-duration' | '--micro-delay' | '--micro-intensity', string>;

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
  useEffect(() => subscribeMicroMotion((event) => {
    const current = loadMicroMotionPreferences();
    const reduced = current.respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!current.enabled || !current.flyoutsEnabled || reduced) return;
    const target = resolveTarget(event);
    const end = target.point ?? { x:Math.max(32, window.innerWidth - 90), y:70 };
    const start = event.source ?? { x:end.x, y:Math.min(window.innerHeight - 30, end.y + 110) };
    const rendered: RenderedMotion = { ...event, start, end, targetColor:target.color };
    setMotions((items) => [...items.slice(-23), rendered]);
    const duration = event.durationMs ?? 760;
    const delay = event.delayMs ?? 0;
    window.setTimeout(() => setMotions((items) => items.filter((item) => item.id !== event.id)), duration + delay + 180);
  }), []);

  if (!prefs.enabled || !prefs.flyoutsEnabled) return null;

  return <div className={`micro-motion-layer symbol-${prefs.symbolStyle}`} aria-hidden="true">
    {motions.map((motion) => {
      const dx = motion.end.x - motion.start.x;
      const dy = motion.end.y - motion.start.y;
      const duration = motion.durationMs ?? 760;
      const delay = motion.delayMs ?? 0;
      const style: MotionStyle = {
        left:motion.start.x,
        top:motion.start.y,
        color:prefs.paletteReactive && motion.targetColor ? motion.targetColor : undefined,
        '--micro-dx':`${dx}px`,
        '--micro-dy':`${dy}px`,
        '--micro-duration':`${duration}ms`,
        '--micro-delay':`${delay}ms`,
        '--micro-intensity':String(prefs.intensity),
      };
      return <div key={motion.id} className={`micro-motion micro-${motion.tone} micro-kind-${motion.kind} ${prefs.paletteReactive ? 'palette-reactive' : ''}`} style={style}>
        {motion.symbol ? <span className="micro-symbol">{motion.symbol}</span> : null}
        <b>{motion.displayText}</b>
        <i />
      </div>;
    })}
  </div>;
}
