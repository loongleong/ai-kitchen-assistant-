import type { Recipe } from '../types';
import { ingredientPricingMetadata } from '../data/ingredientCatalog';

export const QUANTITY_UNITS = ['g','kg','ml','l','piece','cup','tbsp','tsp','clove','stalk','bowl','block','portion','slice'] as const;
export type QuantityUnit = typeof QUANTITY_UNITS[number];
export interface IngredientQuantity { ingredientId:string; value:number; unit:QuantityUnit }
export interface PriceLocation { country:'MY'; state?:string; district?:string; premiseCode?:number }
export interface IngredientPrice {
  ingredientId:string; name:string; unit:QuantityUnit; priceRM:number;
  priceBasis:{quantity:number; purchaseKind:'loose'|'pack'};
  source:{kind:'pricecatcher'|'verified-manual'; reference:string};
  updatedAt:string; locationScope:PriceLocation;
}
export interface RecipePricingFallback { estimatedMealCostRM:number; servings:number; source:'legacy-recipe-estimate' }
export interface RecipePricing {
  estimatedMealCostRM:number;
  additionalShoppingCostRM:number|null;
  knownAdditionalShoppingCostRM:number;
  remainingBudgetRM:number|null;
  budgetShortfallRM:number;
  mealMethod:'ingredient-prices'|'legacy-recipe-fallback';
  shoppingMethod:'ingredient-prices'|'legacy-item-fallback'|'mixed'|'not-needed'|'incomplete'|'pantry-unknown';
  unpricedIngredientIds:string[];
  sourceReferences:string[];
}
export interface PricingContext { servings?:number; pantryKnown?:boolean; budgetRM?:number; prices?:readonly IngredientPrice[]; location?:PriceLocation }
export interface IngredientPriceSource { id:string; loadPrices(request:{ingredientIds:string[];location:PriceLocation}):Promise<IngredientPrice[]> }
// Empty until a verified source is connected. No fake observations, dates or live prices.
export const INGREDIENT_PRICES: readonly IngredientPrice[] = [];
export const roundMoney = (value:number) => Math.round((value + Number.EPSILON) * 100) / 100;
const dimensions:Partial<Record<QuantityUnit,{kind:string;factor:number}>> = {
  g:{kind:'mass',factor:1}, kg:{kind:'mass',factor:1000}, ml:{kind:'volume',factor:1}, l:{kind:'volume',factor:1000},
  tsp:{kind:'volume',factor:5}, tbsp:{kind:'volume',factor:15}
};
export const convertQuantity = (value:number, from:QuantityUnit, to:QuantityUnit):number|null => {
  if (!Number.isFinite(value) || value < 0) return null;
  if (from === to) return value;
  const a = dimensions[from], b = dimensions[to];
  // Cups/bowls/pieces never acquire guessed weights or densities.
  return a && b && a.kind === b.kind ? value * a.factor / b.factor : null;
};
export const validIngredientPrice = (price:IngredientPrice) => !!price.ingredientId && !!price.name && !!price.source.reference &&
  (price.source.kind === 'pricecatcher' || price.source.kind === 'verified-manual') &&
  Number.isFinite(price.priceRM) && price.priceRM >= 0 && Number.isFinite(price.priceBasis.quantity) && price.priceBasis.quantity > 0 &&
  QUANTITY_UNITS.includes(price.unit) && ['loose','pack'].includes(price.priceBasis.purchaseKind) && price.locationScope.country === 'MY' && !Number.isNaN(Date.parse(price.updatedAt));
const locationFits = (scope:PriceLocation, selected?:PriceLocation) => ['state','district','premiseCode'].every(key => {
  const field = key as 'state'|'district'|'premiseCode';
  return scope[field] === undefined || (selected?.[field] !== undefined && String(scope[field]).toLowerCase() === String(selected[field]).toLowerCase());
});
const selectPrice = (quantity:IngredientQuantity, context:PricingContext) => (context.prices ?? INGREDIENT_PRICES)
  .filter(price => validIngredientPrice(price) && price.ingredientId === quantity.ingredientId && locationFits(price.locationScope,context.location) && convertQuantity(quantity.value,quantity.unit,price.unit) !== null)
  .sort((a,b) => ['state','district','premiseCode'].filter(key=>b.locationScope[key as keyof PriceLocation] !== undefined).length - ['state','district','premiseCode'].filter(key=>a.locationScope[key as keyof PriceLocation] !== undefined).length || Date.parse(b.updatedAt)-Date.parse(a.updatedAt))[0];

export const estimateRecipePricing = (recipe:Recipe, context:PricingContext = {}):RecipePricing => {
  const servings = context.servings ?? recipe.servings;
  if (!Number.isFinite(servings) || servings <= 0 || !Number.isFinite(recipe.servings) || recipe.servings <= 0) throw new Error('Pricing requires positive servings');
  const factor = servings / recipe.servings;
  const fallback = recipe.pricingFallback ?? {estimatedMealCostRM:recipe.estimatedCostRM,servings:recipe.servings,source:'legacy-recipe-estimate'};
  let ingredientTotal = 0, knownShopping = 0, pricedItems = 0, fallbackShoppingItems = 0, unknownShoppingItems = 0;
  const unpricedIngredientIds:string[] = [], sourceReferences = new Set<string>();
  // Aggregate missing quantities by quote before rounding purchase packs.
  const purchases = new Map<IngredientPrice,number>();
  for (const item of recipe.ingredients) {
    const quantities = ingredientPricingMetadata(item);
    const lines = quantities?.map(used => {
      const price = selectPrice(used,context);
      const required = price ? convertQuantity(used.value * factor,used.unit,price.unit)! : null;
      return {price,required};
    });
    const complete = !!lines?.length && lines.every(line => line.price && line.required !== null);
    if (complete) {
      pricedItems++;
      for (const {price,required} of lines!) {
        ingredientTotal += required! / price!.priceBasis.quantity * price!.priceRM;
        sourceReferences.add(price!.source.reference);
        if (context.pantryKnown !== false && !item.have) purchases.set(price!, (purchases.get(price!) ?? 0) + required!);
      }
    } else {
      unpricedIngredientIds.push(item.ingredientId ?? item.id);
      if (context.pantryKnown !== false && !item.have) {
        if (item.estCostIfMissing !== undefined && Number.isFinite(item.estCostIfMissing) && item.estCostIfMissing >= 0) {
          knownShopping += item.estCostIfMissing * factor; fallbackShoppingItems++;
        } else unknownShoppingItems++;
      }
    }
  }
  for (const [price,required] of purchases) {
    const amount = required / price.priceBasis.quantity;
    const packs = Math.ceil(amount - Number.EPSILON * Math.max(1,Math.abs(amount)) * 8);
    knownShopping += (price.priceBasis.purchaseKind === 'pack' ? packs : amount) * price.priceRM;
  }
  const completeMeal = recipe.ingredients.length > 0 && pricedItems === recipe.ingredients.length;
  const estimatedMealCostRM = roundMoney(completeMeal ? ingredientTotal : fallback.estimatedMealCostRM * servings / fallback.servings);
  const pantryKnown = context.pantryKnown !== false;
  const missingCount = recipe.ingredients.filter(item => !item.have).length;
  return {
    estimatedMealCostRM,
    additionalShoppingCostRM:pantryKnown && !unknownShoppingItems ? roundMoney(knownShopping) : null,
    knownAdditionalShoppingCostRM:pantryKnown ? roundMoney(knownShopping) : 0,
    remainingBudgetRM:context.budgetRM === undefined ? null : roundMoney(Math.max(0,context.budgetRM-estimatedMealCostRM)),
    budgetShortfallRM:context.budgetRM === undefined ? 0 : roundMoney(Math.max(0,estimatedMealCostRM-context.budgetRM)),
    mealMethod:completeMeal ? 'ingredient-prices' : 'legacy-recipe-fallback',
    shoppingMethod:!pantryKnown ? 'pantry-unknown' : !missingCount ? 'not-needed' : unknownShoppingItems ? 'incomplete' : fallbackShoppingItems ? purchases.size ? 'mixed' : 'legacy-item-fallback' : 'ingredient-prices',
    unpricedIngredientIds, sourceReferences:[...sourceReferences]
  };
};
export const getEstimatedMealCostRM = (recipe:Recipe) => recipe.pricing?.estimatedMealCostRM ?? estimateRecipePricing(recipe).estimatedMealCostRM;
