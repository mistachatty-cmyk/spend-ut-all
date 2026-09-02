'use client';

import { looperVectorAssetById } from '@/data/looper-vector-assets';
import type { PetMood } from '@/game/customization-types';
import { LooperProductionSprite } from './LooperProductionSprite';

export function LooperVectorRuntimeSprite({ petId, mood='idle', size=64, animated=true, silhouette=false }: { petId:string; mood?:PetMood; size?:number; animated?:boolean; silhouette?:boolean }) {
  const asset = looperVectorAssetById(petId);
  if (!asset) return <LooperProductionSprite petId={petId} mood={mood} size={size} animated={animated} silhouette={silhouette}/>;

  return <span
    className={`looper-vector-runtime looper-vector-${mood} ${animated ? 'looper-vector-animated' : 'looper-vector-static'} ${silhouette ? 'looper-vector-silhouette' : ''}`}
    data-looper-vector={asset.name}
    data-looper-motion={animated ? 'animated' : 'static'}
    style={{ width:size, height:size }}
    aria-hidden="true"
  >
    <img src={asset.master} alt="" draggable={false}/>
    <span className="looper-vector-overlay" aria-hidden="true">
      <i className="looper-vector-coin"/><i className="looper-vector-steam steam-a"/><i className="looper-vector-steam steam-b"/><i className="looper-vector-spark spark-a"/><i className="looper-vector-spark spark-b"/>
    </span>
  </span>;
}
