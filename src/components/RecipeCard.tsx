import React from 'react';
import { ArrowUpRight, Bookmark, Clock3 } from 'lucide-react';
import { Recipe } from '../types';
import { getEstimatedMealCostRM } from '../lib/pricing';
import { FoodVisual } from './FoodVisual';
interface RecipeCardProps {recipe:Recipe;onSelect:(recipe:Recipe)=>void;isSaved?:boolean;nutritionVariant?:'standard'|'healthier';pantryKnown?:boolean;matchLabel?:string;onToggleSave?:(recipeId:string,event:React.MouseEvent)=>void}
export const RecipeCard:React.FC<RecipeCardProps>=({recipe,onSelect,isSaved=false,onToggleSave,nutritionVariant='standard',pantryKnown=true,matchLabel='recipe match'})=>{
  const open=(event:React.MouseEvent)=>{event.stopPropagation();onSelect(recipe)};
  const nutrition=nutritionVariant==='healthier'?recipe.healthierVariant:recipe;
  return <article className="gallery-card" onClick={()=>onSelect(recipe)}>
    <div className="gallery-card-visual"><button type="button" className="gallery-photo-link" aria-label={'View Meal: '+recipe.name} onClick={open}><FoodVisual recipe={recipe}/></button>{onToggleSave&&<button type="button" className="gallery-save" aria-label={(isSaved?'Unsave ':'Save ')+recipe.name} aria-pressed={isSaved} onClick={event=>{event.stopPropagation();onToggleSave(recipe.id,event)}}><Bookmark size={18} fill={isSaved?'currentColor':'none'}/></button>}{pantryKnown&&<span className="gallery-card-match">{recipe.matchScore}% {matchLabel}</span>}</div>
    <div className="gallery-card-copy"><span className="eyebrow">{recipe.cuisine} · {recipe.difficulty}</span><h3><button type="button" onClick={open}>{recipe.name}</button></h3>
    <div className="gallery-card-bottom"><div><small>Estimated meal cost</small><strong title={recipe.pricing?.mealMethod==='ingredient-prices'?'Ingredient estimate':'Fallback recipe estimate'}>RM{getEstimatedMealCostRM(recipe).toFixed(2)}</strong></div><span><Clock3 size={14}/>{recipe.timeMinutes} min</span><button type="button" className="gallery-open" aria-label={'Open '+recipe.name} onClick={open}><ArrowUpRight size={19}/></button></div>
    <p className="gallery-card-nutrition">{recipe.servings} servings · {nutrition.calories} kcal · {nutrition.protein}g protein{nutritionVariant==='healthier'?' · Lighter version':''}</p>{pantryKnown&&<p className="gallery-card-caveat">{recipe.matchReason.split('·')[0]}</p>}
    </div>
  </article>;
};
