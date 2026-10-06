import type { Recipe } from '../types';
import { RECIPES } from '../data/recipes';
import { findCuisine } from '../data/cuisineCatalog';
import { normalizeEquipment } from '../data/equipmentCatalog';
import { findIngredient, ingredientPricingMetadata } from '../data/ingredientCatalog';
import { estimateRecipePricing, type PricingContext } from './pricing';

// A future recipe API adapter returns this existing product model. No components
// know its endpoints or provider-specific response shape.
export interface RecipeSource { id:string; listRecipes():Promise<Recipe[]> }
export const LOCAL_RECIPE_SOURCE:RecipeSource = {id:'savorai-local',async listRecipes(){return RECIPES;}};
const normalizeRecipe = (recipe:Recipe, providerId:string, pricing:PricingContext = {}):Recipe => {
  const cuisine = findCuisine(recipe.cuisine);
  if (!cuisine) throw new Error(`Unknown cuisine for recipe ${recipe.id}: ${recipe.cuisine}`);
  if (!recipe.id || !recipe.ingredients.length || !Number.isFinite(recipe.servings) || recipe.servings <= 0) throw new Error('Recipe needs an ID, ingredients and positive servings');
  const local = providerId === LOCAL_RECIPE_SOURCE.id;
  if (local && (!Number.isFinite(recipe.estimatedCostRM) || recipe.estimatedCostRM < 0)) throw new Error('Invalid local recipe cost fallback');
  const normalized:Recipe = {
    ...recipe,cuisine:cuisine.name,requiredEquipment:normalizeEquipment(recipe.requiredEquipment),
    source:{providerId,recipeId:recipe.id,url:recipe.source?.url},
    // Provider/LLM totals cannot become ingredient prices or approved fallbacks.
    pricingFallback:local ? {estimatedMealCostRM:recipe.estimatedCostRM,servings:recipe.servings,source:'legacy-recipe-estimate'} : undefined,
    estimatedCostRM:local ? recipe.estimatedCostRM : 0,
    ingredients:recipe.ingredients.map(item => ({...item,ingredientId:item.ingredientId ?? findIngredient(item.name)?.id,
      pricingQuantities:ingredientPricingMetadata(item),estCostIfMissing:local ? item.estCostIfMissing : undefined}))
  };
  const quote = estimateRecipePricing(normalized,pricing);
  if (!local && quote.mealMethod !== 'ingredient-prices') throw new Error(`Recipe ${recipe.id} needs verified ingredient pricing before recommendations`);
  return {...normalized,pricing:quote,estimatedCostRM:quote.estimatedMealCostRM};
};
export const LOCAL_RECIPE_CATALOG = RECIPES.map(recipe => normalizeRecipe(recipe,LOCAL_RECIPE_SOURCE.id));
export const loadRecipeCatalog = async (source:RecipeSource = LOCAL_RECIPE_SOURCE, pricing:PricingContext = {}):Promise<Recipe[]> => {
  const recipes = await source.listRecipes();
  if (new Set(recipes.map(recipe => recipe.id)).size !== recipes.length) throw new Error('Recipe source returned duplicate IDs');
  return recipes.map(recipe => normalizeRecipe(recipe,source.id,pricing));
};
