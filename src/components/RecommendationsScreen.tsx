import React, { useState, useMemo } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { RecipeCard } from './RecipeCard';
import { CookingQueryFilters, isValidBudget, prepareQueryRecipe, recommendationRank } from '../lib/cookingFlow';
import { cuisineMatches, cuisineRecipeCount, NO_CUISINE_PREFERENCE } from '../data/cuisineCatalog';
import { equipmentCompatibility } from '../data/equipmentCatalog';
import { estimateRecipePricing, getEstimatedMealCostRM } from '../lib/pricing';
import { useRecipeData } from './RecipeDataContext';
import { CuisineSelector } from './CuisineSelector';
import { FoodVisual } from './FoodVisual';
import { ArrowUpRight, Bookmark, Check, Clock3, Flame, Leaf, Sparkles, Utensils, Wallet } from 'lucide-react';

// Every explanation uses the current query; pantry claims start after refinement.
const RecommendationHero = ({ recipe, userProfile, activeFilters, maxCost, maxTime, selectedCuisine, isSaved, onSelect, onToggleSave, onModify }: {
  recipe: Recipe; userProfile: UserKitchenProfile; activeFilters: CookingQueryFilters | null;
  maxCost: number; maxTime: number; selectedCuisine: string; isSaved: boolean;
  onSelect: (recipe: Recipe) => void; onToggleSave: (id: string) => void; onModify: () => void;
}) => {
  const isEarly = activeFilters?.stage === 'early';
  const pricingData = useRecipeData();
  const pricing = estimateRecipePricing(recipe,{...pricingData,budgetRM:maxCost,pantryKnown:!isEarly});
  const nutrition = activeFilters?.healthyMode ? recipe.healthierVariant : recipe;
  const readyIngredients = recipe.ingredients.filter(ingredient => ingredient.have);
  const missingIngredients = recipe.ingredients.filter(ingredient => !ingredient.have);
  const kitchenTools = activeFilters?.equipment ?? userProfile.equipment;
  const toolFit = equipmentCompatibility(recipe.requiredEquipment,kitchenTools,recipe.equipmentRequirements);
  const compatibleTools = [...new Set(toolFit.checks.filter(check=>check.compatible).flatMap(check=>check.ownedTools))];
  const missingTools = toolFit.missing;
  const preferredCuisine = userProfile.favoriteCuisines.some(cuisine => cuisine.toLowerCase() === recipe.cuisine.toLowerCase());
  const explanations = [
    ...(isEarly ? [`Portioned for your ${recipe.servings} servings`] : [`${readyIngredients.length} of ${recipe.ingredients.length} ingredients from your list`]),
    `Estimated meal cost RM${pricing.estimatedMealCostRM.toFixed(2)} · ${pricing.budgetShortfallRM ? `Over budget by RM${pricing.budgetShortfallRM.toFixed(2)}` : `Remaining budget RM${pricing.remainingBudgetRM!.toFixed(2)}`}`,
    missingTools.length === 0 ? `Uses your ${compatibleTools.join(', ').toLowerCase()}` : `${compatibleTools.length} of ${recipe.requiredEquipment.length} kitchen tools available`,
    maxTime < 90 ? `Ready within your ${maxTime}-minute target` : `Ready in ${recipe.timeMinutes} minutes`,
    selectedCuisine !== 'All' && selectedCuisine !== 'No preference'
      ? `Matches your ${selectedCuisine} cuisine selection`
      : preferredCuisine ? `Matches your ${recipe.cuisine} food preference` : `${recipe.cuisine} cooking · ${recipe.difficulty.toLowerCase()} friendly`
  ];
  if (pricing.mealMethod === 'legacy-recipe-fallback') explanations.push('Meal price uses the existing recipe estimate · Verified ingredient pricing is not connected yet');
  if (!isEarly && activeFilters?.stage === 'refined' && activeFilters.healthPriority !== 'No preference') {
    const priority = activeFilters.healthPriority;
    explanations.push(priority === 'Higher protein' ? `${nutrition.protein}g protein per serving · Your higher-protein preference`
      : priority === 'Higher fibre' ? `${nutrition.fibre}g fibre per serving · Your higher-fibre preference`
      : priority === 'Lower calorie' ? `${nutrition.calories} kcal per serving · Your lower-calorie preference`
      : priority === 'Lower sugar' ? 'Lower-sugar preference · Review the suggested swaps in each recipe'
      : 'Balanced meals preference · Review the nutrition for your needs');
  }

  return <article className="gallery-feature" aria-labelledby="recs-best-title">
    <div className="gallery-feature-visual"><button className="gallery-photo-link" type="button" aria-label={'View recipe: '+recipe.name} onClick={()=>onSelect(recipe)}><FoodVisual recipe={recipe} priority/></button><span className="gallery-best-label"><Sparkles size={14}/>YOUR BEST MATCH</span><span className="gallery-photo-note">GOOD FOOD STARTS RIGHT HERE</span>{!isEarly&&<span className="gallery-pantry-hud"><small>{activeFilters?.stage==='refined'?'Pantry match':'Recipe match'}</small><strong>{recipe.matchScore}<span>%</span></strong></span>}</div>
    <div className="gallery-feature-copy"><span className="eyebrow">{recipe.cuisine} KITCHEN <span className="gallery-tiny-dot"/> {recipe.difficulty}</span><h2 id="recs-best-title"><button type="button" onClick={()=>onSelect(recipe)}>{recipe.name}</button></h2><p>{isEarly?'Big flavour. Within budget. Made for the tools you already own.':recipe.tagline}</p>
      <div className="gallery-facts"><div><span>Estimated meal cost</span><strong>RM{pricing.estimatedMealCostRM.toFixed(2)}</strong></div><div><span><Clock3 size={13}/>Cook time</span><strong>{recipe.timeMinutes}<small> min</small></strong></div><div><span>Serves</span><strong>{recipe.servings}</strong></div></div>
      <div className="gallery-budget-note">{pricing.budgetShortfallRM?<>Over budget by <strong>RM{pricing.budgetShortfallRM.toFixed(2)}</strong></>:<>Remaining budget <strong>RM{pricing.remainingBudgetRM!.toFixed(2)}</strong></>}</div>
      {!isEarly&&<div className="refined-breakdown"><div><span>Additional shopping required</span><strong>{pricing.additionalShoppingCostRM===null?pricing.knownAdditionalShoppingCostRM>0?'At least RM'+pricing.knownAdditionalShoppingCostRM.toFixed(2):'Estimate unavailable':'RM'+pricing.additionalShoppingCostRM.toFixed(2)}</strong></div><div><span>Calories per serving</span><strong>{nutrition.calories} kcal</strong></div><div><span>Ingredients available</span><strong>{readyIngredients.length} / {recipe.ingredients.length}</strong></div><div><span>Still to gather</span><strong>{missingIngredients.length} ingredients</strong></div><small>{pricing.shoppingMethod==='incomplete'?'Some shopping items are unpriced.':pricing.shoppingMethod==='legacy-item-fallback'||pricing.shoppingMethod==='mixed'?'Includes fallback item estimates.':'Shopping estimate.'}</small></div>}
      <div className="gallery-tools"><span>{missingTools.length?'TOOLS NEEDED':'WORKS WITH YOUR'}</span><div>{toolFit.checks.map(fit=><span key={fit.label}>{fit.compatible&&<Check size={13}/>} {fit.compatible?fit.ownedTools.join(' / '):fit.label}</span>)}</div>{missingTools.length>0&&<small>Still needed: {missingTools.join(', ')}</small>}</div>
      <details className="gallery-reasoning"><summary>Why this matches your kitchen <Sparkles size={14}/></summary><ul>{explanations.map(reason=><li key={reason}><Check size={14}/><span>{reason}</span></li>)}</ul>{!isEarly&&missingIngredients.length>0&&<p>Still needed: {missingIngredients.map(item=>item.name).join(', ')}</p>}</details>
      <div className="gallery-feature-actions"><button type="button" className="gallery-primary" onClick={()=>onSelect(recipe)}>View Recipe & Cook<ArrowUpRight size={19}/></button><button type="button" className="gallery-save-text" aria-pressed={isSaved} onClick={()=>onToggleSave(recipe.id)}><Bookmark size={18} fill={isSaved?'currentColor':'none'}/>{isSaved?'Saved':'Save recipe'}</button></div>
      <span className="gallery-estimate-note">{isEarly?'Pantry not checked yet · ':''}{pricing.mealMethod==='legacy-recipe-fallback'?'Fallback recipe estimate':'Estimated from ingredient prices'} · meal cost is separate from shopping</span><button type="button" className="text-button" onClick={onModify}>Modify Inputs</button>
    </div>
  </article>;
};

interface RecommendationsScreenProps {
  recipes: Recipe[];
  userProfile: UserKitchenProfile;
  activeFilters: CookingQueryFilters | null;
  onSelectRecipe: (recipe: Recipe, context?: CookingQueryFilters | null) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
  onBackToCook: (filters: CookingQueryFilters | null) => void;
  onRefine: (filters: CookingQueryFilters | null) => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  recipes,
  userProfile,
  activeFilters,
  onSelectRecipe,
  savedRecipeIds,
  onToggleSave,
  onBackToCook,
  onRefine
}) => {
  const pricingData = useRecipeData();
  // Sidebar filter states
  const [selectedCuisine, setSelectedCuisine] = useState<string>(activeFilters?.cuisine || NO_CUISINE_PREFERENCE);
  const [maxCost, setMaxCost] = useState<number>(activeFilters?.budgetRM || userProfile.typicalBudgetRM || 15);
  const [maxTime, setMaxTime] = useState<number>(activeFilters?.maxTimeMinutes || 30);
  const [maxCalories, setMaxCalories] = useState<number>(900);
  const [missingFilter, setMissingFilter] = useState<'all' | '0' | '1'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'cost' | 'calories'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [costInput, setCostInput] = useState(String(activeFilters?.budgetRM || userProfile.typicalBudgetRM || 15));
  const isEarly = activeFilters?.stage === 'early';
  const costValid = costInput.trim() !== '' && isValidBudget(Number(costInput));
  const currentFilters = activeFilters ? { ...activeFilters, cuisine: selectedCuisine, budgetRM: maxCost, maxTimeMinutes: maxTime } : null;
  const selectRecipe = (recipe: Recipe) => onSelectRecipe(recipe, currentFilters?.stage ? currentFilters : null);
  const modifyInputs = () => onBackToCook(currentFilters);
  const resetFilters = () => {
    setSelectedCuisine(activeFilters?.cuisine || NO_CUISINE_PREFERENCE);
    const budget = activeFilters?.budgetRM || userProfile.typicalBudgetRM || 15;
    setMaxCost(budget); setCostInput(String(budget));
    setMaxTime(activeFilters?.maxTimeMinutes || 30);
    setMaxCalories(900); setMissingFilter('all'); setSearchQuery('');
  };

  // Filter and sort the 12 recipes
  const filteredRecipes = useMemo(() => {
    return recipes.map(recipe => activeFilters ? prepareQueryRecipe(recipe, activeFilters,pricingData) : recipe)
      .filter((r) => {
        if (!costValid) return false;
        if (!equipmentCompatibility(r.requiredEquipment,activeFilters?.equipment ?? userProfile.equipment,r.equipmentRequirements).compatible) return false;
        // Cuisine filter
        if (!cuisineMatches(r,selectedCuisine)) {
          return false;
        }
        // Max cost
        if (getEstimatedMealCostRM(r) > maxCost) {
          return false;
        }
        // Max time
        if (maxTime < 90 && r.timeMinutes > maxTime) {
          return false;
        }
        // Max calories
        if (maxCalories < 900 && (activeFilters?.healthyMode ? r.healthierVariant.calories : r.calories) > maxCalories) {
          return false;
        }
        // Missing ingredients
        const missingCount = r.ingredients.filter(i => !i.have).length;
        if (!isEarly && missingFilter === '0' && missingCount > 0) return false;
        if (!isEarly && missingFilter === '1' && missingCount > 1) return false;

        // Search query
        if (searchQuery.trim() && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cost') return getEstimatedMealCostRM(a) - getEstimatedMealCostRM(b);
        if (sortBy === 'calories') return activeFilters?.healthyMode ? a.healthierVariant.calories - b.healthierVariant.calories : a.calories - b.calories;
        return recommendationRank(b, activeFilters) - recommendationRank(a, activeFilters);
      });
  }, [recipes, activeFilters, pricingData, userProfile.equipment, costValid, isEarly, selectedCuisine, maxCost, maxTime, maxCalories, missingFilter, sortBy, searchQuery]);

  // Keep one dominant best match while the alternatives remain freely sortable.
  const bestMatchRecipe = filteredRecipes.reduce<Recipe | undefined>(
    (best, recipe) => !best || recommendationRank(recipe, activeFilters) > recommendationRank(best, activeFilters) ? recipe : best,
    undefined
  );

  return <section className="design-page early-gallery" aria-labelledby="gallery-title">
    <header className="gallery-header"><div><button type="button" className="back-link" onClick={modifyInputs}>← Modify Kitchen Inputs</button><span className="eyebrow"><Sparkles size={14}/>YOUR KITCHEN. A WORLD OF POSSIBILITIES.</span><h1 id="gallery-title" aria-label={isEarly?"Meals that already fit your kitchen.":"Made for your kind of day."}>{isEarly?<>Meals that already{' '}<br className="gallery-title-break"/>fit your kitchen</>:<>Made for your{' '}<br className="gallery-title-break"/>kind of day</>}<span>.</span></h1><p>{isEarly?'Based on your cuisine, budget and equipment, here are meals SavorAI thinks could work well for you.':'Your ingredients, your time, your kitchen. Find your next favourite.'}</p></div>
    <div className="gallery-brief"><span>YOUR RECIPE FOR A GOOD MEAL</span><div><strong>{selectedCuisine}</strong><i/>RM{maxCost.toFixed(2)} budget<i/>{activeFilters?.servings??userProfile.householdSize} people</div><small><Check size={13}/>{(activeFilters?.equipment??userProfile.equipment).length} kitchen tools selected</small>{!isEarly&&activeFilters?.stage==='refined'&&<p className="gallery-card-caveat">{maxTime>=90?'No rush':maxTime+' min available'} · {activeFilters.ingredients.length} ingredients selected · {activeFilters.healthPriority}</p>}</div></header>
    {bestMatchRecipe&&<RecommendationHero recipe={bestMatchRecipe} userProfile={userProfile} activeFilters={currentFilters} maxCost={maxCost} maxTime={maxTime} selectedCuisine={selectedCuisine} onSelect={selectRecipe} isSaved={savedRecipeIds.includes(bestMatchRecipe.id)} onToggleSave={onToggleSave} onModify={modifyInputs}/>}
    <details className="gallery-filter-drawer"><summary>Adjust recommendation filters <span>{filteredRecipes.length} results</span></summary>
        <div className="gallery-filters premium-panel rounded-3xl p-6 border premium-border shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b premium-border">
            <h3 className="font-bold text-sm premium-ink">Filters</h3>
            <span className="text-xs premium-muted">{filteredRecipes.length} results</span>
            <button type="button" className="text-button" onClick={resetFilters}>Reset all filters</button>
          </div>

          {/* Quick Search */}
          <div>
            <label className="text-xs font-semibold premium-muted block mb-1.5">Search meal name</label>
            <input
              type="text"
              aria-label="Search meal name" placeholder="e.g. Teriyaki, Ginger, Fried rice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border premium-border text-xs premium-ink focus:outline-none premium-focus-border"
            />
          </div>

          {/* Cuisine Selector */}
          <div>
            <label className="text-xs font-semibold premium-muted block mb-2">Cuisine</label>
            <CuisineSelector selected={selectedCuisine} onSelect={setSelectedCuisine} variant="rail" />
          </div>

          {/* Max Cost Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold premium-muted">Max Estimated Meal Cost</span>
              <span className="font-bold premium-ink">RM{maxCost}</span>
            </div>
            <input
              aria-label="Max estimated cost" type="number" inputMode="decimal"
              min="1" step="0.01"
              value={costInput}
              aria-invalid={!costValid}
              onChange={(e) => { setCostInput(e.target.value); const value = Number(e.target.value); if (e.target.value.trim() && isValidBudget(value)) setMaxCost(value); }}
              className="w-full px-3 py-2 rounded-xl border premium-border premium-ink"
            />
            <div className="flex justify-between text-[10px] premium-faint mt-1">
              <span>{costValid ? 'Minimum RM1 · No upper limit' : 'Enter RM1 or more'}</span>
            </div>
          </div>

          {/* Max Time Filter */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold premium-muted">Max Prep & Cook Time</span>
              <span className="font-bold premium-ink">{maxTime >= 90 ? 'Any' : `${maxTime} min`}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 90].map((t) => (
                <button
                  key={t}
                  onClick={() => setMaxTime(t)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                    maxTime === t
                      ? 'premium-solid text-white premium-border'
                      : 'premium-inset premium-ink premium-border premium-hover-border'
                  }`}
                >
                  {t === 90 ? 'Any' : `<${t}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Calories Cap */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold premium-muted">Max Calories</span>
              <span className="font-bold premium-ink">{maxCalories >= 900 ? 'Any' : `${maxCalories} kcal`}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[500, 600, 900].map((cal) => (
                <button
                  key={cal}
                  onClick={() => setMaxCalories(cal)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                    maxCalories === cal
                      ? 'premium-solid text-white premium-border'
                      : 'premium-inset premium-ink premium-border premium-hover-border'
                  }`}
                >
                  {cal === 900 ? 'Any' : `<${cal}`}
                </button>
              ))}
            </div>
          </div>

          {/* Missing Ingredients Filter */}
          {!isEarly && <div>
            <label className="text-xs font-semibold premium-muted block mb-2">Missing Ingredients</label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Any (Show all matches)' },
                { id: '0', label: '0 missing (100% in kitchen)' },
                { id: '1', label: 'At most 1 missing item' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMissingFilter(opt.id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    missingFilter === opt.id
                      ? 'premium-tint font-bold premium-ink'
                      : 'premium-muted premium-hover-surface'
                  }`}
                >
                  <span>{opt.label}</span>
                  {missingFilter === opt.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>}
        </div>


    </details>
    <div className="gallery-grid-heading"><div><span className="eyebrow">A LITTLE MORE INSPIRATION</span><h2>More meals to fall for.</h2><p>More meals to explore for your kitchen. A few new favourites, perhaps.</p></div><label className="gallery-sort">Sort meals<select aria-label="Sort meals" value={sortBy} onChange={event=>setSortBy(event.target.value as 'match'|'cost'|'calories')}><option value="match">Best match</option><option value="cost">Lowest estimated meal cost</option><option value="calories">Lowest calories</option></select></label></div>
    {filteredRecipes.length===0?<div className="gallery-empty"><Sparkles size={24}/><h2>{cuisineRecipeCount(recipes,selectedCuisine)===0?'No '+selectedCuisine+' recipes in the current catalog':'No meals match all strict criteria'}</h2><p>{cuisineRecipeCount(recipes,selectedCuisine)===0?'Choose a cuisine with recipes or No preference. Your selection is supported, but no recipes for it have been added yet.':'Try a larger budget, more cooking time, or different kitchen tools.'}</p><button type="button" className="gallery-primary" onClick={activeFilters?.stage?modifyInputs:resetFilters}>{activeFilters?.stage?'Modify my inputs':'Reset all filters'} <ArrowUpRight size={17}/></button></div>:filteredRecipes.length===1?<p className="gallery-card-caveat">Your Best Match is the only meal that fits these criteria. Adjust the filters to explore more possibilities.</p>:<div className="gallery-grid">{filteredRecipes.filter(recipe=>recipe.id!==bestMatchRecipe?.id).map(recipe=><RecipeCard key={recipe.id} recipe={recipe} onSelect={selectRecipe} pantryKnown={!isEarly} matchLabel={activeFilters?.stage==='refined'?'pantry match':'recipe match'} nutritionVariant={activeFilters?.healthyMode?'healthier':'standard'} isSaved={savedRecipeIds.includes(recipe.id)} onToggleSave={(id,event)=>{event.stopPropagation();onToggleSave(id)}}/>)}</div>}
    {isEarly&&<aside className="gallery-refine"><div className="gallery-refine-icon"><Sparkles size={26}/></div><div><span className="eyebrow">LET’S MAKE IT MORE YOU</span><h2>Still deciding?</h2><p>Tell us what’s in your fridge and how much time you have.</p></div><button type="button" className="gallery-primary" onClick={()=>onRefine(currentFilters)}>Help me narrow it down <ArrowUpRight size={18}/></button></aside>}
    <p className="gallery-disclaimer">Meal estimates describe quantities used. Shopping totals are separate. Current fallback estimates are not live grocery prices.</p>
  </section>;
};
