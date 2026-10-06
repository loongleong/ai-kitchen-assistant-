import React from 'react';
import { FoodVisual } from './FoodVisual';

interface DishIllustrationProps {
  dishId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSteam?: boolean;
}

// Retains the existing component contract so every recipe surface shares one art direction.
export const DishIllustration: React.FC<DishIllustrationProps> = ({
  dishId, className = '', size = 'md', showSteam = true,
}) => {
  return (
    <div className={`premium-food premium-food-${size} ${dishId === 'ginger-chicken-rice-bowl' ? 'premium-food-cutout' : ''} ${className}`}>
      <FoodVisual dishId={dishId} priority={size === 'hero'} />
      <span className="premium-food-light" aria-hidden="true" />
      {showSteam && <span className="premium-food-steam" aria-hidden="true"><i /><i /></span>}
    </div>
  );
};
