import React, { useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, Clock3, Flame, Leaf, Play, Sparkles, Utensils, Wallet, X } from 'lucide-react';
import { Recipe, UserKitchenProfile } from '../types';
import { FoodVisual } from './FoodVisual';
import { useNativeModal } from './DesignUI';
import { CookingQueryFilters } from '../lib/cookingFlow';
import { equipmentCompatibility } from '../data/equipmentCatalog';
import { estimateRecipePricing } from '../lib/pricing';
import { useRecipeData } from './RecipeDataContext';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onStartCooking: (recipe: Recipe, isHealthierMode: boolean) => void;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  userProfile: UserKitchenProfile;
  queryContext?: CookingQueryFilters | null;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onStartCooking,
  isSaved,
  onToggleSave,
  userProfile,
  queryContext = null
}) => {
  const [healthierMode, setHealthierMode] = useState(queryContext?.healthyMode ?? false);
  const [activeSubstituteId, setActiveSubstituteId] = useState<string | null>(null);
  const dialogRef = useNativeModal();

  const displayCalories = healthierMode ? recipe.healthierVariant.calories : recipe.calories;
  const displayProtein = healthierMode ? recipe.healthierVariant.protein : recipe.protein;
  const displayCarbs = healthierMode ? recipe.healthierVariant.carbs : recipe.carbs;
  const displayFat = healthierMode ? recipe.healthierVariant.fat : recipe.fat;
  const displayFibre = healthierMode ? recipe.healthierVariant.fibre : recipe.fibre;

  const alreadyHaveIngredients = recipe.ingredients.filter(i => i.have);
  const needToBuyIngredients = recipe.ingredients.filter(i => !i.have);

  const reducedMotion = useReducedMotion();
  const pantryKnown = queryContext?.stage !== 'early';
  const kitchenTools = queryContext?.equipment ?? userProfile.equipment;
  const mealBudget = queryContext?.budgetRM ?? userProfile.typicalBudgetRM;
  const toolFit = equipmentCompatibility(recipe.requiredEquipment,kitchenTools,recipe.equipmentRequirements);
  const missingEquipment = toolFit.missing;
  const preferredCuisine = userProfile.favoriteCuisines.some(cuisine => cuisine.toLowerCase() === recipe.cuisine.toLowerCase());
  const pricingData = useRecipeData();
  const pricing = estimateRecipePricing(recipe,{...pricingData,budgetRM:mealBudget,pantryKnown});
  const budgetFits = pricing.budgetShortfallRM === 0;
  const transition = { duration: reducedMotion ? 0 : 0.24 };

  return (
    <LazyMotion features={domAnimation}>
    <dialog ref={dialogRef} className="premium-detail-overlay premium-theme rd-overlay savor-design" aria-labelledby="rd-title" onCancel={event=>{event.preventDefault();onClose()}}>
      <div className="rd-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rd-topbar">
          <button type="button" className="rd-back" onClick={onClose}>← Back to your matches</button>
          <button type="button" className="rd-close" onClick={onClose} aria-label="Close recipe details"><X size={18} /></button>
        </div>

        <div className="rd-scroll">
          <section className="rd-hero" aria-labelledby="rd-title">
            <div className="rd-food-stage"><FoodVisual recipe={recipe} priority/><span className="rd-photo-badge"><Sparkles size={14}/>{pantryKnown?recipe.matchScore+(queryContext?.stage==='refined'?'% PANTRY MATCH':'% RECIPE MATCH'):'YOUR KITCHEN PICK'}</span><span className="rd-photo-caption">A LITTLE HEAT. A LOT OF HAPPINESS.</span></div>
            <div className="rd-hero-copy">
              <p className="rd-eyebrow">{recipe.cuisine} · SIMPLE, SATISFYING, YOURS</p><h1 id="rd-title">{recipe.name}</h1><p className="rd-tagline">{recipe.tagline}</p>
              <div className="rd-price-numbers"><div><small>Estimated meal cost</small><strong>RM{pricing.estimatedMealCostRM.toFixed(2)}</strong></div><div><small>Additional shopping required</small><strong>{!pantryKnown?'Not assessed':pricing.additionalShoppingCostRM===null?pricing.knownAdditionalShoppingCostRM>0?'At least RM'+pricing.knownAdditionalShoppingCostRM.toFixed(2):'Unavailable':'RM'+pricing.additionalShoppingCostRM.toFixed(2)}</strong></div><div><small>{budgetFits?'Remaining budget':'Over budget by'}</small><strong>RM{(budgetFits?pricing.remainingBudgetRM!:pricing.budgetShortfallRM).toFixed(2)}</strong></div></div>
              <div className="rd-recipe-meta"><span><Clock3 size={16}/>{recipe.timeMinutes} min</span><span><Flame size={16}/><m.span key={displayCalories} initial={{opacity:reducedMotion?1:0}} animate={{opacity:1}} transition={transition}>{displayCalories}</m.span> kcal</span><span><Utensils size={16}/>{recipe.servings} servings</span></div>
              <p className="rd-hero-readiness"><Check size={15}/>{pantryKnown?alreadyHaveIngredients.length+' of '+recipe.ingredients.length+' ingredients ready':'Pantry not checked yet. Review the ingredients below.'}</p>
              <div className="rd-hero-actions"><button type="button" className="rd-primary" onClick={()=>onStartCooking(recipe,healthierMode)}>Start Cooking <ArrowUpRight size={17}/></button><button type="button" className="rd-save" aria-pressed={isSaved} onClick={()=>onToggleSave(recipe.id)}><Bookmark size={16} fill={isSaved?'currentColor':'none'}/>{isSaved?'Saved to your recipes':'Save for another day'}</button></div>
              <span className="rd-hero-footnote">{pricing.mealMethod==='legacy-recipe-fallback'?'Fallback recipe estimate':'Ingredient estimate'} · calories per serving · {healthierMode?'Healthier version selected':'Original version'}</span>
            </div>
          </section>

          <div className="rd-content">
            <section className="rd-reasoning" aria-labelledby="rd-reason-title">
              <div className="rd-section-intro"><p className="rd-eyebrow">01 / The kitchen fit</p><h2 id="rd-reason-title">Why SavorAI picked this for you</h2><p className="rd-match-reason">{recipe.matchReason}</p></div>
              <ul className="rd-reason-list">
                <li><Check size={15} aria-hidden="true" /><span><strong>{pantryKnown ? `${alreadyHaveIngredients.length} / ${recipe.ingredients.length} ingredients ready` : `Portioned for ${recipe.servings} servings`}</strong><small>{pantryKnown ? queryContext?.stage === 'refined' ? 'Based on the ingredient list you supplied' : 'Based on this recipe’s pantry inventory' : 'Check the recipe ingredients before you begin'}</small></span></li>
                <li className={budgetFits ? '' : 'rd-reason-caution'}>{budgetFits ? <Check size={15} aria-hidden="true" /> : <Wallet size={15} aria-hidden="true" />}<span><strong>{budgetFits ? queryContext ? 'Fits your selected budget' : 'Fits your usual budget' : queryContext ? 'Above your selected budget' : 'Above your usual budget'}</strong><small>Estimated meal cost RM{pricing.estimatedMealCostRM.toFixed(2)} · {budgetFits ? `Remaining budget RM${pricing.remainingBudgetRM!.toFixed(2)}` : `Over budget by RM${pricing.budgetShortfallRM.toFixed(2)}`} {pricing.mealMethod === 'legacy-recipe-fallback' && '· Fallback recipe estimate'}</small></span></li>
                <li className={missingEquipment.length ? 'rd-reason-caution' : ''}>{missingEquipment.length ? <Utensils size={15} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}<span><strong>{missingEquipment.length ? `${recipe.requiredEquipment.length - missingEquipment.length} / ${recipe.requiredEquipment.length} tools available` : 'Uses equipment you own'}</strong><small>{missingEquipment.length ? `Still needed: ${missingEquipment.join(', ')}` : 'Your kitchen is ready'}</small></span></li>
                <li><Clock3 size={15} aria-hidden="true" /><span><strong>Ready in {recipe.timeMinutes} minutes</strong><small>Recipe’s estimated cooking time</small></span></li>
                {preferredCuisine && <li><Check size={15} aria-hidden="true" /><span><strong>Matches your preferred cuisine</strong><small>{recipe.cuisine} is in your kitchen profile</small></span></li>}
              </ul>
            </section>

            <section className="rd-inventory-section" aria-labelledby="rd-inventory-title">
              <div className="rd-section-heading"><div><p className="rd-eyebrow">02 / Before you begin</p><h2 id="rd-inventory-title">{pantryKnown ? 'A look inside your kitchen.' : 'Your recipe ingredients.'}</h2></div><span>{recipe.ingredients.length} ingredients · {recipe.servings} servings</span></div>
              <div className={`rd-inventory ${!pantryKnown ? 'rd-inventory-unchecked' : ''}`}>
                {pantryKnown && <div className="rd-have">
                  <div className="rd-inventory-heading"><Check size={17} aria-hidden="true" /><h3>You already have</h3><span>{alreadyHaveIngredients.length.toString().padStart(2, '0')}</span></div>
                  <ul className="rd-ingredient-list">{alreadyHaveIngredients.map(item => <li key={item.id}><Check size={13} aria-hidden="true" /><span>{item.name}</span><small>{item.amount}</small></li>)}</ul>
                  {alreadyHaveIngredients.length === 0 && <p className="rd-inventory-empty">Your ingredient list is below.</p>}
                </div>}
                <div className="rd-need">
                  <div className="rd-inventory-heading"><span className="rd-need-symbol">+</span><h3>{pantryKnown ? 'You still need' : 'Recipe checklist'}</h3><span>{needToBuyIngredients.length.toString().padStart(2, '0')}</span></div>
                  {!pantryKnown && <p className="rd-missing-total">Pantry not checked yet. Review these ingredients and quantities.</p>}
                  {pantryKnown && <p className="rd-missing-total">Additional shopping required <strong>{pricing.additionalShoppingCostRM === null ? pricing.knownAdditionalShoppingCostRM > 0 ? `At least RM${pricing.knownAdditionalShoppingCostRM.toFixed(2)}` : 'Estimate unavailable' : `RM${pricing.additionalShoppingCostRM.toFixed(2)}`}</strong>{pricing.shoppingMethod === 'incomplete' ? ' · Some items unpriced' : pricing.shoppingMethod === 'legacy-item-fallback' || pricing.shoppingMethod === 'mixed' ? ' · Fallback item estimates' : ''}</p>}
                  {needToBuyIngredients.length === 0 ? <p className="rd-inventory-empty"><Check size={16} aria-hidden="true" />You have everything required for this dish!</p> : (
                    <div className="rd-missing-list">{needToBuyIngredients.map(item => (
                      <div className="rd-missing-item" key={item.id}>
                        <div className="rd-missing-item-heading"><div><strong>{item.name}</strong><small>{item.amount}</small></div>{pantryKnown && item.estCostIfMissing !== undefined && <span>≈ RM{item.estCostIfMissing.toFixed(2)}</span>}</div>
                        {item.substitute && <>
                          <button type="button" className="rd-substitute-button" onClick={() => setActiveSubstituteId(activeSubstituteId === item.id ? null : item.id)} aria-expanded={activeSubstituteId === item.id} aria-controls={`rd-substitute-${item.id}`}><span>{activeSubstituteId === item.id ? 'Hide substitute' : 'Find substitute'}</span><ChevronDown size={14} aria-hidden="true" className={activeSubstituteId === item.id ? 'rd-chevron-open' : ''} /></button>
                          <AnimatePresence initial={false}>{activeSubstituteId === item.id && <m.div id={`rd-substitute-${item.id}`} className="rd-substitute" initial={{ height: reducedMotion ? 'auto' : 0, opacity: reducedMotion ? 1 : 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: reducedMotion ? 'auto' : 0, opacity: reducedMotion ? 1 : 0 }} transition={transition}><div className="rd-substitute-inner"><p>Suggested replacement</p><div><span>{item.name}</span><ArrowRight size={16} aria-hidden="true" /><strong>{item.substitute}</strong></div>{item.substituteNote && <small>{item.substituteNote}</small>}</div></m.div>}</AnimatePresence>
                        </>}
                      </div>
                    ))}</div>
                  )}
                </div>
              </div>
            </section>

            <section className={`rd-healthier ${healthierMode ? 'rd-healthier-active' : ''}`} aria-labelledby="rd-healthier-title">
              <div className="rd-section-heading"><div><p className="rd-eyebrow"><Leaf size={13} aria-hidden="true" />03 / A little lighter</p><h2 id="rd-healthier-title">Same comfort. A lighter version.</h2><p className="rd-section-description">A lighter version is available, with the adjustments below.</p></div><span className="rd-version-status" aria-live="polite">{healthierMode ? 'Healthier version selected' : 'Original version selected'}</span></div>
              <div className="rd-transformation">
                <div className={`rd-version rd-original ${!healthierMode ? 'rd-version-selected' : ''}`}><span>Original</span><div><strong>{recipe.calories}</strong><small>kcal</small></div><p>Classic recipe</p></div>
                <div className="rd-transform-action"><button type="button" className="rd-health-toggle" onClick={() => setHealthierMode(!healthierMode)} aria-pressed={healthierMode}><Leaf size={16} aria-hidden="true" /><span>{healthierMode ? 'Healthier Mode Active' : 'Make it healthier'}</span><ArrowRight size={16} aria-hidden="true" /></button><small>{healthierMode ? 'Return to original' : `${recipe.calories - recipe.healthierVariant.calories} fewer kcal per serving`}</small></div>
                <div className={`rd-version rd-lighter ${healthierMode ? 'rd-version-selected' : ''}`}><span>Healthier{healthierMode && <Check size={13} aria-hidden="true" />}</span><div><strong>{recipe.healthierVariant.calories}</strong><small>kcal</small></div><p>With the suggested adjustments</p></div>
              </div>
              <m.div className="rd-adjustments" key={healthierMode ? 'selected' : 'preview'} initial={{ opacity: reducedMotion ? 1 : 0.6 }} animate={{ opacity: 1 }} transition={transition}>
                <h3>{healthierMode ? 'Suggested healthier modifications applied' : 'What changes in the lighter version'}</h3>
                <ul>{recipe.healthierVariant.modifications.map((mod, idx) => <li key={idx}><Check size={13} aria-hidden="true" /><span>{mod}</span></li>)}</ul>
                {recipe.healthierVariant.swaps.length > 0 && <div className="rd-health-swaps">{recipe.healthierVariant.swaps.map((swap, idx) => <div key={idx}><span>{swap.original}</span><ArrowRight size={14} aria-hidden="true" /><div><strong>{swap.replacement}</strong><small>{swap.note}</small></div></div>)}</div>}
              </m.div>
            </section>

            <section className="rd-nutrition" aria-labelledby="rd-nutrition-title">
              <div className="rd-section-heading"><div><p className="rd-eyebrow">04 / The nourishment</p><h2 id="rd-nutrition-title">Nutritional profile</h2></div><span>Per serving · {healthierMode ? 'Healthier' : 'Original'} version</span></div>
              <div className="rd-nutrition-values" aria-live="polite">
                <div className="rd-calorie-value"><span><Flame size={14} aria-hidden="true" /> Energy</span><div><m.strong key={displayCalories} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} transition={transition}>{displayCalories}</m.strong><small>kcal</small></div>{healthierMode && <p>Reduced from {recipe.calories} kcal</p>}</div>
                <dl className="rd-macros"><div><dt>Protein</dt><dd>{displayProtein}<small>g</small></dd></div><div><dt>Carbs</dt><dd>{displayCarbs}<small>g</small></dd></div><div><dt>Fat</dt><dd>{displayFat}<small>g</small></dd></div><div><dt>Fibre</dt><dd>{displayFibre}<small>g</small></dd></div></dl>
              </div>
              <p className="rd-nutrition-note">Estimated per serving based on the recipe ingredients.</p>
            </section>

            <section className="rd-equipment" aria-labelledby="rd-equipment-title"><div><p className="rd-eyebrow">05 / The tools</p><h2 id="rd-equipment-title">{missingEquipment.length === 0 ? 'Your kitchen is ready.' : 'Your kitchen checklist.'}</h2></div><div className="rd-equipment-items">{recipe.requiredEquipment.map(tool => {
              const fit = toolFit.checks.find(check=>check.label === tool);
              const userHasIt = fit?.compatible;
              return <span key={tool} className={userHasIt ? '' : 'rd-tool-missing'}>{userHasIt ? <Check size={13} aria-hidden="true" /> : <Utensils size={13} aria-hidden="true" />}{tool}<small>{userHasIt ? fit!.ownedTools.includes(tool) ? 'In your kitchen' : `${fit!.ownedTools.join(', ')} works` : 'Needed'}</small></span>;
            })}</div></section>
            <div className="rd-end-note"><ArrowDown size={14} aria-hidden="true" />Your ingredients, your pace. Let’s get cooking.</div>
          </div>
        </div>

        <div className="rd-actions">
          <div><strong>{healthierMode ? 'Healthier version ready' : 'Ready to cook?'}</strong><span>{recipe.timeMinutes} min · {recipe.servings} servings · {displayCalories} kcal per serving</span></div>
          <div><button type="button" className="rd-back" onClick={onClose}>Back</button><button type="button" className="rd-primary" onClick={() => onStartCooking(recipe, healthierMode)}><Play size={14} aria-hidden="true" /><span>Start Cooking Now</span><ArrowUpRight size={16} aria-hidden="true" /></button></div>
        </div>
      </div>
    </dialog>
    </LazyMotion>
  );
};
