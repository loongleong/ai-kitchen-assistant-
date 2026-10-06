import React, { useState } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { FoodVisual } from './FoodVisual';
import { DesignHeading } from './DesignUI';
import { ArrowRight, Bookmark } from 'lucide-react';

interface SavedScreenProps {
  allRecipes: Recipe[];
  savedRecipeIds: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (recipeId: string) => void;
  onCookCollection: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  allRecipes,
  savedRecipeIds,
  onSelectRecipe,
  onToggleSave,
  onCookCollection
}) => {
  const [activeTab, setActiveTab] = useState<'favourites' | 'recentlyCooked' | 'wantToTry'>('favourites');

  // Filter recipes based on saved ids or curated sets
  const savedRecipes = allRecipes.filter(r => savedRecipeIds.includes(r.id));
  const recentlyCookedRecipes = allRecipes.slice(0, 3);
  const wantToTryRecipes = allRecipes.filter(r => !savedRecipeIds.includes(r.id)).slice(0, 4);

  const currentDisplayList = 
    activeTab === 'favourites' ? (savedRecipes.length > 0 ? savedRecipes : allRecipes.slice(0, 4)) :
    activeTab === 'recentlyCooked' ? recentlyCookedRecipes :
    wantToTryRecipes;


  const collection = allRecipes.filter(recipe=>recipe.estimatedCostRM<=15 && recipe.timeMinutes<=25);
  const averageCost = collection.length ? collection.reduce((sum,recipe)=>sum+recipe.estimatedCostRM,0)/collection.length : 0;
  const averageCalories = collection.length ? Math.round(collection.reduce((sum,recipe)=>sum+recipe.calories,0)/collection.length) : 0;
  return <section className="design-page saved-library">
    <DesignHeading eyebrow="GOOD MEALS, WORTH KEEPING" title="Your next favourites." description="A personal collection of meals worth coming back to."/>
    <div className="library-feature">
      <div className="library-copy"><span className="eyebrow">THE WEEKNIGHT EDIT</span><h2>A little time.<br/><em>A very good meal.</em></h2><p>Explore fast meals under RM15, ready in 25 minutes or less. Your kitchen tools will shape the final matches.</p>
        <div className="library-metrics"><div><strong>{collection.length}</strong><small>recipes in the edit</small></div><div><strong>RM{averageCost.toFixed(2)}</strong><small>average meal estimate</small></div><div><strong>{averageCalories}</strong><small>average kcal per serving</small></div></div>
        <button className="action" onClick={onCookCollection}>Explore Collection<ArrowRight size={17}/></button><small className="library-footnote">Recipe fallback estimates · servings vary by recipe</small>
      </div>
      <button className="library-photo" aria-label="View Ginger Chicken Rice Bowl" onClick={()=>{const recipe=allRecipes.find(item=>item.id==='ginger-chicken-rice-bowl');if(recipe)onSelectRecipe(recipe)}}><FoodVisual dishId="ginger-chicken-rice-bowl" priority/><span>A meal worth coming back to.</span></button>
    </div>
    <div className="library-tabs" role="group" aria-label="Recipe library view">
      {([{id:'favourites',label:'Favourites ('+savedRecipes.length+')'},{id:'recentlyCooked',label:'Recently cooked'},{id:'wantToTry',label:'Want to try ('+wantToTryRecipes.length+')'}] as const).map(tab=><button key={tab.id} aria-pressed={activeTab===tab.id} onClick={()=>setActiveTab(tab.id)}>{tab.label}</button>)}
    </div>
    {activeTab==='favourites' && savedRecipes.length===0 && <div className="library-empty"><Bookmark size={24}/><div><h2>Your collection starts with a favourite.</h2><p>Save a recipe to keep it here. Explore these curated suggestions while you find your first.</p></div></div>}
    {activeTab==='recentlyCooked' && <p className="library-note">Curated preview · cooking history is not yet tracked.</p>}
    <div className="recipe-grid">{currentDisplayList.map(recipe=><RecipeCard key={recipe.id} recipe={recipe} pantryKnown={false} onSelect={onSelectRecipe} isSaved={savedRecipeIds.includes(recipe.id)} onToggleSave={(id,event)=>{event.stopPropagation();onToggleSave(id)}}/>)}</div>
  </section>;
};
