import { useState } from 'react';
import { FOOD_VISUALS } from '../data/foodVisuals';
import type { Recipe } from '../types';

interface Props {
  recipe?: Pick<Recipe,'id'|'name'>;
  dishId?: string;
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/** Shared photography contract; unavailable artwork never impersonates another recipe. */
export function FoodVisual({recipe,dishId,src,alt,className='',priority=false,width=768,height=768}:Props) {
  const asset = FOOD_VISUALS[recipe?.id ?? dishId ?? ''];
  const source = src ?? (asset ? `/images/${asset.file}.webp` : undefined);
  const [failedSource,setFailedSource] = useState<string>();
  const description = alt ?? asset?.alt ?? recipe?.name ?? 'Food inspiration';
  return <div className={`food-visual ${className}`}>
    {source && failedSource !== source ? <img src={source} alt={description} width={width} height={height}
      loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" draggable={false}
      onError={()=>setFailedSource(source)} /> : <div className="food-visual-fallback" role="img" aria-label={description}><span>FROM YOUR KITCHEN</span><strong>{recipe?.name ?? description}</strong><small>A delicious possibility.</small></div>}
  </div>;
}
