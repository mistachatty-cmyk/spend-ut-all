'use client';

import { useId } from 'react';
import { looperHdRecipeById, type LooperHdRecipe } from '@/data/looper-hd-recipes';
import type { PetMood } from '@/game/customization-types';

export function LooperProductionSprite({ petId, mood='idle', size=64, animated=true, silhouette=false }: { petId:string; mood?:PetMood; size?:number; animated?:boolean; silhouette?:boolean }) {
  const recipe=looperHdRecipeById(petId);
  const uid=useId().replace(/:/g,'');
  if(!recipe) return null;
  const gid=`lp${uid}`;
  return <span className={`looper-hd looper-hd-${recipe.kind} looper-hd-${mood} ${animated?'looper-hd-animated':'looper-hd-static'} ${silhouette?'looper-hd-silhouette':''}`} data-looper-hd={recipe.name} style={{width:size,height:size}} aria-hidden="true">
    <svg viewBox="0 0 96 96" focusable="false">
      <defs>
        <linearGradient id={`${gid}body`} x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stopColor={recipe.light}/><stop offset=".46" stopColor={recipe.base}/><stop offset="1" stopColor={recipe.dark}/></linearGradient>
        <radialGradient id={`${gid}aura`}><stop offset="0" stopColor={recipe.glow} stopOpacity=".55"/><stop offset="1" stopColor={recipe.glow} stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse className="looper-hd-aura" cx="48" cy="77" rx="36" ry="12" fill={`url(#${gid}aura)`}/>
      <ellipse cx="48" cy="80" rx="27" ry="5" fill="#071018" opacity=".25"/>
      {body(recipe,`url(#${gid}body)`)}
      {face(recipe,mood)}
      {motif(recipe)}
      {moodFx(recipe,mood)}
    </svg>
  </span>;
}

const stroke=(r:LooperHdRecipe)=>({stroke:r.dark,strokeWidth:2.4,strokeLinejoin:'round' as const,strokeLinecap:'round' as const});

function body(r:LooperHdRecipe,fill:string){
  const s=stroke(r);
  if(r.kind==='slime') return <g className="looper-hd-body"><path d="M19 66c0-18 7-31 20-38 3-9 9-16 17-21-1 8 4 11 9 16 9 9 14 21 12 36-1 15-10 23-24 24H38c-13 0-20-6-19-17Z" fill={fill} {...s}/><circle cx="27" cy="70" r="8" fill={r.base} {...s}/><circle cx="69" cy="70" r="8" fill={r.base} {...s}/><path d="M31 35c9-10 19-13 29-9" fill="none" stroke={r.light} strokeWidth="4" opacity=".65"/><rect x="15" y="24" width="7" height="7" fill={r.accent} opacity=".85"/><rect x="69" y="19" width="9" height="9" fill={r.accent} opacity=".75"/></g>;
  if(r.kind==='bot') return <g className="looper-hd-body"><rect x="22" y="24" width="52" height="37" rx="14" fill={fill} {...s}/><rect x="29" y="30" width="38" height="23" rx="8" fill="#0b1521" stroke={r.dark} strokeWidth="2"/><rect x="31" y="59" width="34" height="23" rx="8" fill={fill} {...s}/><rect x="39" y="64" width="18" height="9" rx="2" fill="#14496a"/><path d="M29 67 17 73m50-6 12 6M39 80l-4 7m22-7 4 7" fill="none" {...s}/><circle cx="17" cy="73" r="4" fill={r.base} {...s}/><circle cx="79" cy="73" r="4" fill={r.base} {...s}/><path d="M48 24v-8" {...s}/><ellipse className="looper-hd-steam" cx="48" cy="12" rx="6" ry="8" fill={r.light} opacity=".8"/></g>;
  if(r.kind==='mammal'){
    const cat=r.motif==='coin'; const mouse=r.motif==='clock'; const wolf=r.motif==='wolf'; const raccoon=r.motif==='scrap'; const badger=r.motif==='brick'; const otter=r.motif==='ripple'; const ferret=r.motif==='wire';
    return <g className="looper-hd-body"><ellipse cx="49" cy="61" rx={ferret?30:25} ry={ferret?14:20} fill={fill} {...s}/><circle cx={ferret?29:39} cy="39" r={ferret?14:19} fill={fill} {...s}/><path d={mouse?'M26 28c-9-13-18 1-8 9m34-9c8-13 18 1 8 9':cat||wolf?'M26 29 28 13 39 28m12 0 13-15 3 20':raccoon||badger?'M24 30 20 18l14 9m18 0 14-9-4 14':'M27 28c-7-10-14-2-9 7m32-7c7-10 14-2 9 7'} fill={cat||wolf||raccoon||badger?r.dark:'none'} stroke={r.dark} strokeWidth="2.4" strokeLinejoin="round"/><path className="looper-hd-tail" d={otter||ferret?'M67 62c24 1 26-13 13-18':'M66 62c20 3 25-15 11-20'} fill="none" stroke={r.dark} strokeWidth={otter||ferret?10:8} strokeLinecap="round"/><path className="looper-hd-tail" d={otter||ferret?'M67 62c24 1 26-13 13-18':'M66 62c20 3 25-15 11-20'} fill="none" stroke={r.base} strokeWidth={otter||ferret?6:4} strokeLinecap="round"/><path d="M34 74l-5 9m21-8 2 9" fill="none" {...s}/>{raccoon?<path d="M26 39c8-7 18-7 26 0-7 8-19 8-26 0Z" fill={r.dark} opacity=".75"/>:null}{badger?<path d="M31 24 38 56" stroke={r.light} strokeWidth="7" opacity=".7"/>:null}</g>;
  }
  if(r.kind==='bird') return <g className="looper-hd-body"><ellipse cx="49" cy="58" rx="24" ry="24" fill={fill} {...s}/><circle cx="43" cy="36" r="17" fill={fill} {...s}/><path className="looper-hd-wing" d="M55 49c18 0 25 11 18 22-8-1-15-6-20-15Z" fill={r.dark} {...s}/><path d="m27 36-11 5 11 5Z" fill={r.accent} {...s}/><path d="M61 70 79 81 66 59" fill={r.dark} {...s}/><path d="M34 77v9m18-9v9" fill="none" {...s}/></g>;
  if(r.kind==='reptile') return <g className="looper-hd-body"><ellipse cx="45" cy="60" rx="27" ry="18" fill={fill} {...s}/><circle cx="31" cy="43" r="16" fill={fill} {...s}/><path className="looper-hd-tail" d="M64 61c22 0 24-20 11-22" fill="none" stroke={r.dark} strokeWidth="9" strokeLinecap="round"/><path className="looper-hd-tail" d="M64 61c22 0 24-20 11-22" fill="none" stroke={r.base} strokeWidth="5" strokeLinecap="round"/><path d="M28 74l-7 8m29-7 7 8" fill="none" {...s}/>{r.motif==='leaf'?<><path d="M28 31c7-9 14-11 22-8-4 8-10 12-19 13Z" fill={r.accent} {...s}/><path d="M41 50c7 2 12 7 15 14" fill="none" stroke={r.accent} strokeWidth="2"/></>:null}</g>;
  if(r.kind==='puffer') return <g className="looper-hd-body"><path d="M22 54 12 46l12-2-3-11 10 5 4-12 9 9 8-10 5 12 12-5-2 12 13 2-10 8 10 8-13 2 2 12-12-5-6 11-8-10-10 9-3-12-12 4 4-11-12-3Z" fill={r.dark}/><ellipse cx="48" cy="55" rx="28" ry="24" fill={fill} {...s}/><path d="m20 54-10 6 11 6m56-12 10 6-11 6" fill={r.base} {...s}/></g>;
  if(r.kind==='moth') return <g className="looper-hd-body"><ellipse className="looper-hd-wing" cx="30" cy="52" rx="22" ry="25" fill={r.base} {...s}/><ellipse className="looper-hd-wing" cx="66" cy="52" rx="22" ry="25" fill={r.light} {...s}/><ellipse cx="48" cy="58" rx="9" ry="22" fill={r.dark} {...s}/><circle cx="48" cy="37" r="10" fill={fill} {...s}/><path d="M43 29 35 18m18 11 8-11" fill="none" {...s}/><circle cx="35" cy="18" r="2" fill={r.accent}/><circle cx="61" cy="18" r="2" fill={r.accent}/></g>;
  if(r.kind==='jelly') return <g className="looper-hd-body"><path d="M22 53c1-22 12-32 26-32s25 10 26 32Z" fill={fill} {...s}/><path d="M26 53c0 17 7 20 8 29m8-29c-1 17 4 21 4 31m8-31c1 15 7 18 8 29m8-29c0 10 6 13 8 19" fill="none" {...s}/><path d="M27 45c12 5 29 5 42 0" fill="none" stroke={r.light} strokeWidth="3" opacity=".65"/></g>;
  if(r.kind==='owl') return <g className="looper-hd-body"><ellipse cx="48" cy="57" rx="25" ry="28" fill={fill} {...s}/><path d="M28 37 19 24l17 7m32 6 9-13-17 7" fill={r.dark} {...s}/><circle cx="38" cy="43" r="12" fill={r.light} {...s}/><circle cx="58" cy="43" r="12" fill={r.light} {...s}/><circle cx="38" cy="43" r="5" fill={r.dark}/><circle cx="58" cy="43" r="5" fill={r.dark}/><circle cx="36" cy="41" r="1.5" fill="#fff"/><circle cx="56" cy="41" r="1.5" fill="#fff"/><path d="M48 52 43 57h10Z" fill={r.accent}/><path d="M32 66c8 8 24 8 32 0" fill="none" stroke={r.dark} strokeWidth="2"/></g>;
  if(r.kind==='cobra') return <g className="looper-hd-body"><path d="M48 79c-22 0-25-15-8-21 13-5 18-13 10-22" fill="none" stroke={r.dark} strokeWidth="15" strokeLinecap="round"/><path d="M48 79c-22 0-25-15-8-21 13-5 18-13 10-22" fill="none" stroke={r.base} strokeWidth="9" strokeLinecap="round"/><path d="M48 18c-19 6-24 22-14 36 5-6 10-9 14-9s9 3 14 9c10-14 5-30-14-36Z" fill={fill} {...s}/><path className="looper-hd-glint" d="M37 25 56 48" stroke="#fff" strokeWidth="3" opacity=".65"/></g>;
  if(r.kind==='stag') return <g className="looper-hd-body"><ellipse cx="49" cy="60" rx="26" ry="18" fill={fill} {...s}/><circle cx="34" cy="41" r="14" fill={fill} {...s}/><path d="M27 31 20 18m9 9-13-3m24 5 8-15m-5 10 12-5" fill="none" {...s}/><path d="M32 74 29 87m17-13-2 13m14-13 4 13" fill="none" {...s}/></g>;
  if(r.kind==='sprite') return <g className="looper-hd-body"><circle cx="48" cy="51" r="23" fill={fill} {...s}/><path d="m48 15 5 9 10-6-2 11 12 1-8 8 9 7-11 2 5 11-11-4-1 12-8-8-8 8-1-12-11 4 5-11-11-2 9-7-8-8 12-1-2-11 10 6Z" fill={r.accent} opacity=".25"/><rect className="looper-hd-shard" x="19" y="25" width="7" height="7" transform="rotate(18 22 28)" fill={r.light}/><rect className="looper-hd-shard" x="72" y="63" width="8" height="8" transform="rotate(35 76 67)" fill={r.accent}/></g>;
  if(r.kind==='cricket') return <g className="looper-hd-body"><ellipse cx="48" cy="58" rx="15" ry="22" fill={fill} {...s}/><circle cx="48" cy="35" r="13" fill={fill} {...s}/><path d="M37 53 20 42m19 21-22 9m42-19 17-11m-19 21 22 9M43 24 33 13m20 11 10-11" fill="none" {...s}/><path className="looper-hd-wing" d="M41 49 25 31c-5 15 0 24 15 27m15-9 16-18c5 15 0 24-15 27" fill={r.light} opacity=".55" {...s}/></g>;
  return null;
}

function face(r:LooperHdRecipe,mood:PetMood){
  if(r.kind==='owl') return null;
  const y=r.kind==='bird'?38:r.kind==='bot'?41:r.kind==='cobra'?34:r.kind==='stag'?40:r.kind==='reptile'?42:r.kind==='moth'?37:r.kind==='jelly'?44:r.kind==='sprite'?48:r.kind==='cricket'?35:r.kind==='slime'?51:40;
  const sleepy=mood==='sleepy'; const happy=mood==='happy'||mood==='celebrating'; const worried=mood==='worried';
  if(sleepy) return <g className="looper-hd-face"><path d={`M34 ${y}q5 4 10 0M52 ${y}q5 4 10 0`} fill="none" stroke={r.dark} strokeWidth="2.6" strokeLinecap="round"/><path d={`M44 ${y+10}q4 2 8 0`} fill="none" stroke={r.dark} strokeWidth="2"/></g>;
  return <g className="looper-hd-face"><ellipse cx="38" cy={y} rx={happy?4:5} ry={happy?3:6} fill={r.dark}/><ellipse cx="58" cy={y} rx={happy?4:5} ry={happy?3:6} fill={r.dark}/>{!happy?<><circle cx="36.5" cy={y-2} r="1.6" fill="#fff"/><circle cx="56.5" cy={y-2} r="1.6" fill="#fff"/></>:null}<path d={worried?`M42 ${y+12}q6-6 12 0`:`M42 ${y+9}q6 7 12 0`} fill="none" stroke={r.dark} strokeWidth="2.4" strokeLinecap="round"/></g>;
}

function motif(r:LooperHdRecipe){
  const s=stroke(r);
  if(r.motif==='coin') return <g><circle cx="72" cy="26" r="8" fill={r.accent} {...s}/><path d="m72 21 3 5-3 5-3-5Z" fill={r.light}/><circle cx="49" cy="63" r="6" fill={r.accent} {...s}/></g>;
  if(r.motif==='coffee') return <g><path d="M69 59h12v9c0 6-12 6-12 0Z" fill={r.light} {...s}/><path d="M81 61c7 0 7 7 0 7" fill="none" {...s}/><path className="looper-hd-steam" d="M72 55c-4-5 4-7 0-12m6 12c-4-5 4-7 0-12" fill="none" stroke={r.light} strokeWidth="2"/></g>;
  if(r.motif==='clock') return <g><circle cx="73" cy="26" r="8" fill={r.light} {...s}/><path d="M73 21v6l4 2" fill="none" stroke={r.dark} strokeWidth="2"/></g>;
  if(r.motif==='wire') return <path d="M65 49c17-8 22 2 17 11" fill="none" stroke={r.accent} strokeWidth="2" strokeDasharray="3 2"/>;
  if(r.motif==='signal') return <g fill="none" stroke={r.accent} strokeWidth="2"><path className="looper-hd-signal" d="M76 36q12 12 0 24"/><path className="looper-hd-signal" d="M81 31q19 17 0 34" opacity=".55"/></g>;
  if(r.motif==='orbit') return <ellipse className="looper-hd-orbit" cx="48" cy="54" rx="38" ry="14" fill="none" stroke={r.accent} strokeWidth="1.8"/>;
  if(r.motif==='spark') return <path className="looper-hd-spark" d="m76 29-5 10h7l-8 13" fill="none" stroke={r.accent} strokeWidth="3"/>;
  if(r.motif==='brick') return <g opacity=".75"><rect x="65" y="67" width="12" height="8" fill={r.accent} {...s}/><rect x="53" y="75" width="12" height="8" fill={r.accent} {...s}/><rect x="66" y="76" width="12" height="8" fill={r.accent} {...s}/></g>;
  if(r.motif==='chime') return <g><path d="M73 50c0-8 10-8 10 0l2 9H71Z" fill={r.accent} {...s}/><circle cx="78" cy="61" r="2" fill={r.dark}/></g>;
  if(r.motif==='moon'||r.motif==='lunar') return <path d="M72 23c-8 2-9 13 0 16-13 2-18-14 0-16Z" fill={r.accent}/>;
  if(r.motif==='void') return <circle className="looper-hd-orbit" cx="48" cy="51" r="32" fill="none" stroke={r.accent} strokeWidth="1.5" strokeDasharray="3 6"/>;
  if(r.motif==='scrap') return <g fill={r.accent}><rect x="69" y="23" width="6" height="5"/><circle cx="78" cy="33" r="3"/><path d="m68 39 6-2 2 6-6 2Z"/></g>;
  if(r.motif==='ripple') return <g fill="none" stroke={r.accent} strokeWidth="1.5" opacity=".8"><ellipse cx="52" cy="78" rx="24" ry="5"/><ellipse cx="52" cy="78" rx="31" ry="8"/></g>;
  if(r.motif==='shadow') return <path d="M75 20c8 5 8 14 0 19-3-8-3-12 0-19Z" fill={r.accent} opacity=".45"/>;
  if(r.motif==='tower') return <g fill={r.accent} opacity=".7"><rect x="16" y="18" width="5" height="12"/><rect x="76" y="15" width="5" height="15"/></g>;
  return null;
}

function moodFx(r:LooperHdRecipe,mood:PetMood){
  if(mood==='celebrating') return <g className="looper-hd-celebration" fill={r.accent}><path d="m16 21 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="m78 19 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/><circle cx="82" cy="52" r="3"/><circle cx="14" cy="55" r="2"/></g>;
  if(mood==='excited') return <g className="looper-hd-notice"><path d="M82 11v12" stroke={r.accent} strokeWidth="4" strokeLinecap="round"/><circle cx="82" cy="29" r="2.5" fill={r.accent}/></g>;
  if(mood==='worried') return <path className="looper-hd-worry" d="M78 19c6 7 5 12 0 12s-6-5 0-12Z" fill={r.accent}/>;
  if(mood==='sleepy') return <g className="looper-hd-sleep" fill={r.accent}><text x="70" y="25" fontSize="13" fontWeight="900">Z</text><text x="79" y="16" fontSize="9" fontWeight="900">Z</text></g>;
  if(mood==='traveling') return <g className="looper-hd-travel" stroke={r.accent} strokeWidth="2"><path d="M6 43h13M3 50h12M7 57h10"/></g>;
  return null;
}
