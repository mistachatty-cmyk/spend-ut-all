'use client';

import { useMemo, useState } from 'react';
import { looperHdRecipes } from '@/data/looper-hd-recipes';
import { forgeLooper } from '@/integrations/lok/collectibles/looper-forge';
import type { PetMood } from '@/game/customization-types';
import { LooperProductionSprite } from './LooperProductionSprite';

const moods: Array<{id:PetMood;label:string}> = [
  {id:'idle',label:'Idle'},
  {id:'happy',label:'Happy'},
  {id:'excited',label:'Notice'},
  {id:'worried',label:'Worried'},
  {id:'sleepy',label:'Sleep'},
  {id:'traveling',label:'Travel'},
  {id:'celebrating',label:'Celebrate'},
];

export function LooperProductionLab() {
  const [mood,setMood] = useState<PetMood>('idle');
  const [seed,setSeed] = useState('firstlight-preview');
  const forged = useMemo(() => forgeLooper(seed || 'firstlight-preview',1),[seed]);

  return <main className="looper-lab-shell">
    <header className="looper-lab-hero">
      <div><span className="eyebrow">LOOPER PRODUCTION LAB</span><h1>Canonical Firstlight animation check</h1><p>This is a development surface for verifying the same Production renderer used by live companions, starter selection, LOKDEX and cards.</p></div>
      <a href="/">Back to Spend It All</a>
    </header>

    <nav className="looper-lab-moods" aria-label="Looper animation state">{moods.map((entry)=><button key={entry.id} type="button" className={mood===entry.id?'active':''} onClick={()=>setMood(entry.id)}>{entry.label}</button>)}</nav>

    <section className="looper-lab-grid">{looperHdRecipes.map((recipe,index)=><article key={recipe.name}>
      <div className="looper-lab-art"><LooperProductionSprite petId={recipe.ids[0]} recipeOverride={recipe} mood={mood} size={116} animated /></div>
      <small>#{String(index+1).padStart(3,'0')}</small><b>{recipe.name}</b><span>{recipe.kind} · {recipe.motif}</span>
    </article>)}</section>

    <section className="looper-forge-panel">
      <div><span className="eyebrow">LOCAL LOOPER FORGE</span><h2>Deterministic generated collectible preview</h2><p>The Forge uses no paid API at runtime. A seed creates a stable blueprint, production recipe and animation manifest.</p><label>Seed<input value={seed} onChange={(event)=>setSeed(event.target.value)} placeholder="enter a seed" /></label></div>
      <div className="looper-forge-preview"><LooperProductionSprite petId={forged.id} recipeOverride={forged.recipe} mood={mood} size={154} animated/><b>{forged.recipe.name}</b><small>{forged.blueprint.rarity} · {forged.blueprint.temperament}</small><code>{forged.id}</code></div>
      <dl><div><dt>Species</dt><dd>{forged.blueprint.species}</dd></div><div><dt>Body</dt><dd>{forged.blueprint.body}</dd></div><div><dt>Eyes</dt><dd>{forged.blueprint.eyes}</dd></div><div><dt>Pattern</dt><dd>{forged.blueprint.pattern}</dd></div><div><dt>Palette</dt><dd>{forged.blueprint.palette}</dd></div><div><dt>Aura</dt><dd>{forged.blueprint.aura ?? 'none'}</dd></div><div><dt>Mutation</dt><dd>{forged.blueprint.mutation ?? 'none'}</dd></div></dl>
    </section>
  </main>;
}
