import React from 'react';
import { Recipe } from '../types';
import { DishIllustration } from './DishIllustration';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string, e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div 
      onClick={() => onSelect(recipe)}
      className="group relative bg-white rounded-3xl p-4 border border-[#183B2B]/8 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
    >
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 bg-slate-900">
        <DishIllustration dishId={recipe.id} className="w-full h-full" />
        
        {/* Match Percentage Visual Floating Badge */}
        <div className="absolute top-3 left-3 bg-[#183B2B]/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>{recipe.matchScore}% Match</span>
        </div>

        {/* Save button */}
        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(recipe.id, e)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#183B2B] hover:bg-white hover:text-[#E86C38] transition-colors shadow-xs cursor-pointer"
            aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill={isSaved ? '#E86C38' : 'none'} 
              stroke={isSaved ? '#E86C38' : 'currentColor'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}

        {/* Quick prep tag overlay at bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 drop-shadow-sm font-medium">
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">{recipe.cuisine}</span>
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Recipe Title */}
          <h3 className="font-semibold text-lg text-[#1C2520] group-hover:text-[#183B2B] transition-colors leading-snug mb-1.5">
            {recipe.name}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-[#1C2520]/70 mb-3">
            <span className="flex items-center gap-1 font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {recipe.timeMinutes} min
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-semibold text-[#183B2B]">
              RM{recipe.estimatedCostRM.toFixed(2)}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{recipe.servings} servings</span>
          </div>

          {/* Compatibility Breakdown Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#1C2520]/65 text-[11px] truncate max-w-[190px]">
                {recipe.matchReason.split('·')[0]}
              </span>
              <span className="text-[#183B2B] font-semibold text-[11px]">{recipe.matchScore}%</span>
            </div>
            <div className="w-full bg-[#EAF2EC] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#183B2B] h-full rounded-full transition-all duration-500" 
                style={{ width: `${recipe.matchScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Footer: Calories Most Prominent Metric + Action */}
        <div className="pt-3 border-t border-[#183B2B]/6 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#1C2520]/60 block leading-none mb-1">Energy</span>
            <span className="text-base font-bold text-[#183B2B] tabular-nums tracking-tight">
              {recipe.calories} <span className="text-xs font-normal text-[#1C2520]/70">kcal</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#1C2520]/60 block leading-none mb-1">Protein</span>
            <span className="text-xs font-semibold text-[#1C2520]/85 tabular-nums">
              {recipe.protein}g
            </span>
          </div>

          <button 
            className="px-3.5 py-1.5 rounded-xl bg-[#EAF2EC] text-[#183B2B] text-xs font-semibold hover:bg-[#183B2B] hover:text-white transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recipe);
            }}
          >
            View Meal
          </button>
        </div>
      </div>
    </div>
  );
};
