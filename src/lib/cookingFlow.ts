import { Recipe, UserKitchenProfile } from '../types';
import { cuisineMatches, NO_CUISINE_PREFERENCE } from '../data/cuisineCatalog';
import { equipmentCompatibility, normalizeEquipment } from '../data/equipmentCatalog';
import { estimateRecipePricing, getEstimatedMealCostRM, roundMoney, type PricingContext } from './pricing';
import { ingredientPricingMetadata } from '../data/ingredientCatalog';
export { roundMoney } from './pricing';

export interface CookingQueryFilters {
  cuisine: string;
  budgetRM: number;
  servings: number;
  ingredients: string[];
  equipment: string[];
  maxTimeMinutes: number;
  healthyMode: boolean;
  healthPriority: string;
  stage?: 'early' | 'refined';
}

export interface CookingFlowDraft {
  phase: 'setup' | 'refine';
  step: number;
  filters: CookingQueryFilters;
}

export const createCookingDraft = (profile: UserKitchenProfile): CookingFlowDraft => ({
  phase: 'setup', step: 1,
  filters: {
    cuisine: NO_CUISINE_PREFERENCE, budgetRM: Math.max(1, profile.typicalBudgetRM || 15),
    servings: profile.householdSize || 2,
    ingredients: ['Chicken breast', 'Eggs', 'Rice', 'Tomato', 'Garlic'],
    equipment: normalizeEquipment(profile.equipment), maxTimeMinutes: 30,
    healthyMode: false, healthPriority: 'No preference'
  }
});

export const isValidBudget = (value: number) => Number.isFinite(value) && value >= 1;
export const ownsEquipment = (required: string[], owned: string[]) => equipmentCompatibility(required,owned).compatible;

const normalize = (value: string) => value.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\b(eggs|tomatoes|noodles|potatoes|carrots|onions|cloves)\b/g, word => ({ eggs:'egg', tomatoes:'tomato', noodles:'noodle', potatoes:'potato', carrots:'carrot', onions:'onion', cloves:'clove' }[word]!)).replace(/\s+/g, ' ').trim();
const equivalents: Record<string,string[]> = {
  'Cooked jasmine rice':['rice','jasmine rice'], 'Jasmine rice':['rice','jasmine rice'],
  'Cold leftover rice':['rice','leftover rice'], 'Cooked rice':['rice'], 'Cold cooked rice':['rice'],
  'Ripe tomatoes (diced)':['tomato'], 'Ripe red tomatoes':['tomato'],
  'Garlic cloves (minced)':['garlic'], 'Garlic cloves':['garlic'], 'Garlic (lots, minced)':['garlic'],
  'Chicken breast or thigh':['chicken','chicken breast','chicken thigh'], 'Chicken thigh or breast':['chicken','chicken breast','chicken thigh'],
  'Chicken breast cutlets':['chicken','chicken breast'], 'Chicken breast (diced)':['chicken','chicken breast'], 'Chicken breast (sliced)':['chicken','chicken breast'],
  'Chicken breast':['chicken','chicken breast'], 'Fresh ginger (julienned)':['ginger'],
  'Egg (soft-boiled or fried)':['egg'], 'Eggs (beaten)':['egg'], 'Eggs (lightly beaten)':['egg'], 'Eggs (fried sunny-side up)':['egg'],
  'Cucumber slices':['cucumber'], 'Yellow onion (sliced)':['onion','yellow onion'],
  'Spring onion':['spring onion','scallion'], 'Spring onions (a bunch)':['spring onion','scallion'],
  'Wheat noodles or instant ramen':['noodle','wheat noodle','instant ramen','ramen'],
  'Fresh lime / calamansi':['lime','calamansi'], 'Italian herbs / oregano':['italian herbs','oregano'],
  'Dashi broth or chicken broth':['dashi broth','chicken broth'], 'Red chilli / bird’s eye chilli':['chilli','red chilli'],
  'Potato or carrot':['potato','carrot'], 'Aged Kimchi (chopped)':['kimchi'],
  'Pasta (penne or fettuccine)':['pasta','penne','fettuccine'], 'Heavy cooking cream':['heavy cream','cooking cream','cream'],
  'Japanese curry roux cube':['japanese curry roux','curry roux','japanese curry cube'], 'Turmeric powder':['turmeric','turmeric powder']
};
// Compound ingredients need both constituents, unless the exact item was entered.
const compounds: Record<string,string[][]> = {
  'Garlic & ginger paste':[['garlic'],['ginger']], 'Garlic & yellow onion':[['garlic'],['onion','yellow onion']],
  'Onion & garlic':[['onion','yellow onion'],['garlic']],
  'Soy sauce & dark soy':[['soy sauce'],['dark soy','dark soy sauce']],
  'Soy sauce & pinch of sugar':[['soy sauce'],['sugar']],
  'Dark & sweet soy sauce (Kicap Manis)':[['dark soy','dark soy sauce'],['sweet soy sauce','kicap manis']]
};

export const ingredientAvailable = (name: string, pantry: string[]) => {
  const owned = new Set(pantry.map(normalize));
  if (owned.has(normalize(name))) return true;
  if (compounds[name]) return compounds[name].every(group => group.some(item => owned.has(normalize(item))));
  if (name === 'Soy sauce / Salt') return owned.has('soy sauce') || owned.has('salt');
  return (equivalents[name] || [name]).some(item => owned.has(normalize(item)));
};

const scaleAmount = (amount: string, factor: number) => factor === 1 ? amount : amount.replace(/\d+(?:\.\d+)?(?:\/\d+)?/g, token => {
  const parts = token.split('/').map(Number);
  const value = parts.length === 2 ? parts[0] / parts[1] : parts[0];
  return String(Math.round(value * factor * 100) / 100);
});

// Query-specific copies leave the source recipes and all per-serving nutrition intact.
export const prepareQueryRecipe = (recipe: Recipe, filters: CookingQueryFilters, pricingContext:PricingContext = {}): Recipe => {
  if (!filters.stage) return recipe;
  const factor = filters.servings / recipe.servings;
  const pantryIngredients = recipe.ingredients.map(item => ({...item,have:filters.stage === 'refined' && ingredientAvailable(item.name,filters.ingredients)}));
  const pricing = estimateRecipePricing({...recipe,ingredients:pantryIngredients}, {...pricingContext,servings:filters.servings,pantryKnown:filters.stage === 'refined',budgetRM:filters.budgetRM});
  const ingredients = pantryIngredients.map(item => ({ ...item,
    amount: scaleAmount(item.amount, factor),
    pricingQuantities:ingredientPricingMetadata(item)?.map(used => ({...used,value:used.value * factor})),
    estCostIfMissing: item.estCostIfMissing === undefined ? undefined : roundMoney(item.estCostIfMissing * factor)
  }));
  const have = ingredients.filter(item => item.have).length;
  return { ...recipe, servings: filters.servings,
    estimatedCostRM: pricing.estimatedMealCostRM, pricing,
    pricingFallback:recipe.pricingFallback ?? {estimatedMealCostRM:recipe.estimatedCostRM,servings:recipe.servings,source:'legacy-recipe-estimate'}, ingredients,
    matchScore: filters.stage === 'refined' ? Math.round(have / ingredients.length * 100) : 0,
    matchReason: filters.stage === 'early'
      ? `Fits your kitchen equipment · Estimated for ${filters.servings} servings · Pantry not checked yet`
      : `${have}/${ingredients.length} ingredients from your list · Fits your selected equipment · Estimated for ${filters.servings} servings`,
    // The ingredient list is the portion reference; cooking actions and timers are unchanged.
    steps: factor === 1 ? recipe.steps : recipe.steps.map(step => ({ ...step, instruction: `${step.instruction} For ${filters.servings} servings, use the scaled quantities in your ingredient list.` }))
  };
};

export const recommendationRank = (recipe: Recipe, filters: CookingQueryFilters | null) => {
  if (!filters?.stage) return recipe.matchScore;
  if (filters.stage === 'early') return 100 - recipe.timeMinutes / 2 - getEstimatedMealCostRM(recipe) / 10;
  const nutrition = filters.healthyMode ? recipe.healthierVariant : recipe;
  let healthBonus = 0;
  if (filters.healthPriority === 'Lower calorie') healthBonus = Math.max(0, (900 - nutrition.calories) / 40);
  if (filters.healthPriority === 'Higher protein') healthBonus = nutrition.protein / 2;
  if (filters.healthPriority === 'Higher fibre') healthBonus = nutrition.fibre * 3;
  if (filters.healthPriority === 'Balanced meals') healthBonus = nutrition.protein / 8 + nutrition.fibre - nutrition.fat / 15;
  if (filters.healthPriority === 'Lower sugar') healthBonus = recipe.healthierVariant.modifications.filter(change => /sugar|sweetener|sweet soy|mirin/i.test(change)).length * 3;
  // The displayed pantry percentage is never blended with these ranking preferences.
  return recipe.matchScore + healthBonus;
};

export const eligibleQueryRecipe = (recipe: Recipe, filters: CookingQueryFilters) =>
  cuisineMatches(recipe,filters.cuisine) &&
  getEstimatedMealCostRM(recipe) <= filters.budgetRM &&
  equipmentCompatibility(recipe.requiredEquipment, filters.equipment, recipe.equipmentRequirements).compatible &&
  (filters.stage === 'early' || filters.maxTimeMinutes >= 90 || recipe.timeMinutes <= filters.maxTimeMinutes);
