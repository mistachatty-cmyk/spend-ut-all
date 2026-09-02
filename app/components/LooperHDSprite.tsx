'use client';

import { useId } from 'react';
import { looperHdRecipeById, type LooperHdRecipe } from '@/data/looper-hd-recipes';
import type { PetMood } from '@/game/customization-types';

export function LooperHDSprite({ petId, mood='idle', size=64, animated=true, silhouette=false }: { petId:string; mood?:PetMood; size?:number; animated?:boolean; silhouette?:boolean }) {
  const recipe = looperHdRecipeById(petId);
  const uid = useId().replace(/:/g,'');
  if (!recipe) return null;
  const cls = `looper-hd looper-hd-${recipe.kind} looper-hd-${mood} ${animated ? 'looper-hd-animated' : 'looper-hd-static'} ${silhouette ? 'looper-hd-silhouette' : ''}`;
  const gid = `g${uid}`;
  return <span className={cls} data-looper-hd={recipe.name} style={{width:size,height:size}} aria-hidden="true">
    <svg viewBox="0 0 96 96" role="img" focusable="false">
      <defs>
        <linearGradient id={`${gid}body`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={recipe.light}/><stop offset=".48" stopColor={recipe.base}/><stop offset="1" stopColor={recipe.dark}/></linearGradient>
        <radialGradient id={`${gid}glow`}><stop offset="0" stopColor={recipe.glow} stopOpacity=".8"/><stop offset="1" stopColor={recipe.glow} stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse className="looper-hd-aura" cx="48" cy="78" rx="34" ry="10" fill={`url(#${gid}glow)`}/>
      <ellipse className="looper-hd-shadow" cx="48" cy="79" rx="26" ry="6" fill="#05070b" opacity=".32"/>
      {renderKind(recipe, gid)}
      {renderFace(recipe, mood)}
      {renderMotif(recipe, mood)}
      {renderMoodFx(recipe, mood)}
    </svg>
  </span>;
}

function commonStroke(r:LooperHdRecipe){ return {stroke:r.dark, strokeWidth:2.4, strokeLinejoin:'round' as const, strokeLinecap:'round' as const}; }

function renderKind(r:LooperHdRecipe,gid:string){
  const fill=`url(#${gid}body)`; const s=commonStroke(r);
  switch(r.kind){
    case 'slime': return <g className="looper-hd-body"><path d="M21 66C19 49 24 35 37 29c3-10 11-18 18-21-2 8 5 10 10 15 9 8 13 21 11 36 7 13 2 22-12 24H35C25 81 20 75 21 66Z" fill={fill} {...s}/><circle cx="26" cy="70" r="8" fill={r.base} {...s}/><circle cx="70" cy="70" r="8" fill={r.base} {...s}/><path d="M30 34c8-11 19-15 30-11" fill="none" stroke={r.light} strokeWidth="4" opacity=".65"/><rect x="58" y="22" width="7" height="7" rx="1" fill={r.accent} opacity=".9"/></g>;
    case 'bot': return <g className="looper-hd-body"><rect x="24" y="25" width="48" height="35" rx="14" fill={fill} {...s}/><rect x="31" y="31" width="34" height="22" rx="7" fill="#111826" stroke={r.dark} strokeWidth="2"/><rect x="32" y="59" width="32" height="22" rx="8" fill={fill} {...s}/><rect x="39" y="63" width="18" height="10" rx="2" fill="#163d59"/><path d="M28 66 17 71m51-5 11 5M38 80l-3 7m23-7 3 7" fill="none" {...s}/><circle cx="19" cy="72" r="4" fill={r.base} {...s}/><circle cx="77" cy="72" r="4" fill={r.base} {...s}/><path d="M48 25v-8" {...s}/><ellipse className="looper-hd-steam" cx="49" cy="14" rx="5" ry="8" fill={r.light} opacity=".75"/></g>;
    case 'bird': return <g className="looper-hd-body"><ellipse cx="49" cy="57" rx="24" ry="25" fill={fill} {...s}/><circle cx="45" cy="35" r="17" fill={fill} {...s}/><path className="looper-hd-wing" d="M56 48c18 1 24 12 18 22-9-1-15-6-20-14Z" fill={r.dark} {...s}/><path d="M29 65 18 76m41-10 10 12" fill="none" {...s}/><path d="m27 35-11 5 11 5Z" fill={r.accent} {...s}/><path d="M61 70 78 80 65 59" fill={r.dark} {...s}/></g>;
    case 'reptile': return <g className="looper-hd-body"><ellipse cx="45" cy="59" rx="26" ry="19" fill={fill} {...s}/><circle cx="31" cy="43" r="16" fill={fill} {...s}/><path className="looper-hd-tail" d="M64 61c22 0 23-20 11-22 9 9 2 15-7 14" fill="none" stroke={r.dark} strokeWidth="9" strokeLinecap="round"/><path className="looper-hd-tail" d="M64 61c22 0 23-20 11-22" fill="none" stroke={r.base} strokeWidth="5" strokeLinecap="round"/><path d="M29 73l-8 8m29-7 7 8" fill="none" {...s}/>{r.motif==='leaf'?<path d="M31 30c6-8 12-10 19-8-3 8-8 12-17 13Z" fill={r.accent} {...s}/>:null}</g>;
    case 'puffer': return <g className="looper-hd-body"><path d="M22 53 14 45l11-1-3-11 10 5 4-12 8 9 8-10 5 12 12-5-2 12 13 1-9 9 9 8-13 1 2 12-12-5-6 11-7-10-10 9-3-12-11 4 3-11-12-3Z" fill={r.dark} opacity=".9"/><ellipse cx="48" cy="55" rx="28" ry="24" fill={fill} {...s}/><path d="m20 54-10 6 11 6m56-12 10 6-11 6" fill={r.base} {...s}/></g>;
    case 'moth': return <g className="looper-hd-body"><ellipse className="looper-hd-wing left" cx="31" cy="52" rx="22" ry="25" fill={r.base} {...s}/><ellipse className="looper-hd-wing right" cx="65" cy="52" rx="22" ry="25" fill={r.light} {...s}/><ellipse cx="48" cy="58" rx="9" ry="22" fill={r.dark} {...s}/><circle cx="48" cy="37" r="10" fill={fill} {...s}/><path d="M43 29 35 18m18 11 8-11" fill="none" {...s}/><circle cx="35" cy="18" r="2" fill={r.accent}/><circle cx="61" cy="18" r="2" fill={r.accent}/></g>;
    case 'jelly': return <g className="looper-hd-body"><path d="M22 53c1-22 12-32 26-32s25 10 26 32Z" fill={fill} {...s}/><path d="M26 53c0 17 7 20 8 29m8-29c-1 17 4 21 4 31m8-31c1 15 7 18 8 29m8-29c0 10 6 13 8 19" fill="none" {...s}/><path d="M27 45c12 5 29 5 42 0" fill="none" stroke={r.light} strokeWidth="3" opacity=".65"/></g>;
    case 'owl': return <g className="looper-hd-body"><ellipse cx="48" cy="57" rx="25" ry="28" fill={fill} {...s}/><path d="M28 37 19 24l17 7m32 6 9-13-17 7" fill={r.dark} {...s}/><circle cx="38" cy="43" r="12" fill={r.light} {...s}/><circle cx="58" cy="43" r="12" fill={r.light} {...s}/><path d="M48 52 43 57h10Z" fill={r.accent}/><path d="M32 66c8 8 24 8 32 0" fill="none" stroke={r.dark} strokeWidth="2"/></g>;
    case 'cobra': return <g className="looper-hd-body"><path d="M48 79c-22 0-25-15-8-21 13-5 18-13 10-22" fill="none" stroke={r.dark} strokeWidth="15" strokeLinecap="round"/><path d="M48 79c-22 0-25-15-8-21 13-5 18-13 10-22" fill="none" stroke={r.base} strokeWidth="9" strokeLinecap="round"/><path d="M48 18c-19 6-24 22-14 36 5-6 10-9 14-9s9 3 14 9c10-14 5-30-14-36Z" fill={fill} {...s}/><path d="M38 28 29 35m29-7 9 7" stroke={r.light} strokeWidth="3" opacity=".7"/></g>;
    case 'stag': return <g className="looper-hd-body"><ellipse cx="49" cy="60" rx="26" ry="18" fill={fill} {...s}/><circle cx="34" cy="41" r="14" fill={fill} {...s}/><path d="M27 31 20 18m9 9-13-3m24 5 8-15m-5 10 12-5" fill="none" {...s}/><path d="M32 74 29 87m17-13-2 13m14-13 4 13" fill="none" {...s}/></g>;
    case 'sprite': return <g className="looper-hd-body"><circle cx="48" cy="51" r="23" fill={fill} {...s}/><path d="m48 15 5 9 10-6-2 11 12 1-8 8 9 7-11 2 5 11-11-4-1 12-8-8-8 8-1-12-11 4 5-11-11-2 9-7-8-8 12-1-2-11 10 6Z" fill={r.accent} opacity=".25"/><rect className="looper-hd-shard" x="19" y="25" width="7" height="7" transform="rotate(18 22 28)" fill={r.light}/><rect className="looper-hd-shard" x="72" y="63" width="8" height="8" transform="rotate(35 76 67)" fill={r.accent}/></g>;
    case 'cricket': return <g className="looper-hd-body"><ellipse cx="48" cy="58" rx="15" ry="22" fill={fill} {...s}/><circle cx="48" cy="35" r="13" fill={fill} {...s}/><path d="M37 53 20 42m19 21-22 9m42-19 17-11m-19 21 22 9M43 24 33 13m20 11 10-11" fill="none" {...s}/><path className="looper-hd-wing" d="M41 49 25 31c-5 15 0 24 15 27m15-9 16-18c5 15 0 24-15 27" fill={r.light} opacity=".55" {...s}/></g>;
    default: return null;
  }
}

function renderFace(r:LooperHdRecipe,mood:PetMood){
  const sleepy=mood==='sleepy'; const happy=mood==='happy'||mood==='celebrating'; const worried=mood==='worried';
  const y=r.kind==='bird'?39:r.kind==='bot'?42:r.kind==='cobra'?35:r.kind==='stag'?41:r.kind==='reptile'?43:r.kind==='moth'?38:r.kind==='jelly'?45:r.kind==='owl'?43:r.kind==='sprite'?48:r.kind==='cricket'?35:48;
  if(r.kind==='owl') return null;
  if(sleepy) return <g className="looper-hd-face"><path d={`M34 ${y}q5 4 10 0M52 ${y}q5 4 10 0`} fill="none" stroke={r.dark} strokeWidth="2.6" strokeLinecap="round"/><path d={`M44 ${y+10}q4 2 8 0`} fill="none" stroke={r.dark} strokeWidth="2"/></g>;
  return <g className="looper-hd-face"><ellipse cx="38" cy={y} rx={happy?4:5} ry={happy?3:6} fill={r.dark}/><ellipse cx="58" cy={y} rx={happy?4:5} ry={happy?3:6} fill={r.dark}/>{!happy?<><circle cx="36.5" cy={y-2} r="1.6" fill="#fff"/><circle cx="56.5" cy={y-2} r="1.6" fill="#fff"/></>:null}<path d={worried?`M42 ${y+12}q6-6 12 0`:`M42 ${y+9}q6 7 12 0`} fill="none" stroke={r.dark} strokeWidth="2.4" strokeLinecap="round"/></g>;
}

function renderMotif(r:LooperHdRecipe,mood:PetMood){
  const s=commonStroke(r);
  switch(r.motif){
    case 'coin': return <g className="looper-hd-motif"><circle cx="73" cy="25" r="8" fill={r.accent} {...s}/><path d="m73 20 3 5-3 5-3-5Z" fill={r.light}/></g>;
    case 'coffee': return <g className="looper-hd-motif"><path d="M69 59h12v9c0 6-12 6-12 0Z" fill={r.light} {...s}/><path d="M81 61c7 0 7 7 0 7" fill="none" {...s}/><path className="looper-hd-steam" d="M72 55c-4-5 4-7 0-12m6 12c-4-5 4-7 0-12" fill="none" stroke={r.light} strokeWidth="2"/></g>;
    case 'clock': return <g className="looper-hd-motif"><circle cx="73" cy="25" r="8" fill={r.light} {...s}/><path d="M73 20v6l4 2" fill="none" stroke={r.dark} strokeWidth="2"/></g>;
    case 'wire': return <path className="looper-hd-motif" d="M66 48c15-7 20 3 16 10" fill="none" stroke={r.accent} strokeWidth="2" strokeDasharray="3 2"/>;
    case 'signal': return <g className="looper-hd-motif" fill="none" stroke={r.accent} strokeWidth="2"><path className="looper-hd-signal" d="M75 36q12 12 0 24"/><path className="looper-hd-signal" d="M80 31q19 17 0 34" opacity=".6"/></g>;
    case 'orbit': return <ellipse className="looper-hd-orbit" cx="48" cy="54" rx="38" ry="14" fill="none" stroke={r.accent} strokeWidth="1.8"/ >;
    case 'glass': return <path className="looper-hd-glint" d="M37 25 55 50" stroke="#fff" strokeWidth="3" opacity=".7"/>;
    case 'spark': return <path className="looper-hd-spark" d="m76 30-5 10h7l-8 13" fill="none" stroke={r.accent} strokeWidth="3"/>;
    case 'brick': return <g opacity=".7"><rect x="65" y="67" width="12" height="8" fill={r.accent} {...s}/><rect x="53" y="75" width="12" height="8" fill={r.accent} {...s}/><rect x="66" y="76" width="12" height="8" fill={r.accent} {...s}/></g>;
    case 'chime': return <g className="looper-hd-motif"><path d="M73 50c0-8 10-8 10 0l2 9H71Z" fill={r.accent} {...s}/><circle cx="78" cy="61" r="2" fill={r.dark}/></g>;
    case 'moon': return <path className="looper-hd-motif" d="M71 24c-7 2-8 12 0 15-12 2-17-13 0-15Z" fill={r.accent}/>;
    case 'void': return <circle className="looper-hd-orbit" cx="48" cy="51" r="32" fill="none" stroke={r.accent} strokeWidth="1.5" strokeDasharray="3 6"/>;
    default: return null;
  }
}

function renderMoodFx(r:LooperHdRecipe,mood:PetMood){
  if(mood==='celebrating') return <g className="looper-hd-celebration" fill={r.accent}><path d="m16 21 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="m78 19 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/><circle cx="82" cy="52" r="3"/><circle cx="14" cy="55" r="2"/></g>;
  if(mood==='excited') return <g className="looper-hd-notice"><path d="M82 11v12" stroke={r.accent} strokeWidth="4" strokeLinecap="round"/><circle cx="82" cy="29" r="2.5" fill={r.accent}/></g>;
  if(mood==='worried') return <g className="looper-hd-worry" fill={r.accent}><path d="M78 19c6 7 5 12 0 12s-6-5 0-12Z"/></g>;
  if(mood==='sleepy') return <g className="looper-hd-sleep" fill={r.accent}><text x="70" y="25" fontSize="13" fontWeight="900">Z</text><text x="79" y="16" fontSize="9" fontWeight="900">Z</text></g>;
  if(mood==='traveling') return <g className="looper-hd-travel" stroke={r.accent} strokeWidth="2"><path d="M6 43h13M3 50h12M7 57h10"/></g>;
  return null;
}
