import type { IngredientItem } from '../types';
import type { IngredientQuantity, QuantityUnit } from '../lib/pricing';

// Stable IDs for pricing joins. Prepared rice and raw rice deliberately have different IDs.
export const INGREDIENT_CATALOG = [
  {id:'chicken-breast', name:'Chicken breast', aliases:['Chicken breast cutlets','Chicken breast (diced)','Chicken breast (sliced)']},
  {id:'chicken-breast-or-thigh', name:'Chicken breast or thigh', aliases:['Chicken thigh or breast']},
  {id:'cooked-rice', name:'Cooked rice', aliases:['Cooked jasmine rice','Cold leftover rice','Cold cooked rice']},
  {id:'rice', name:'Rice', aliases:['Jasmine rice']},
  {id:'egg', name:'Eggs', aliases:['Egg','Egg (soft-boiled or fried)','Eggs (beaten)','Eggs (lightly beaten)','Eggs (fried sunny-side up)']},
  {id:'tomato', name:'Tomato', aliases:['Ripe tomatoes (diced)','Ripe red tomatoes']},
  {id:'garlic', name:'Garlic', aliases:['Garlic cloves','Garlic cloves (minced)','Garlic (lots, minced)']},
  {id:'ginger', name:'Ginger', aliases:['Fresh ginger (julienned)']},
  {id:'soy-sauce', name:'Soy sauce', aliases:[]},
  {id:'cooking-oil', name:'Cooking oil', aliases:[]},
  {id:'sesame-oil', name:'Sesame oil', aliases:[]},
  {id:'spring-onion', name:'Spring onion', aliases:['Spring onions (a bunch)']},
  {id:'onion', name:'Onion', aliases:['Yellow onion (sliced)']},
  {id:'turmeric', name:'Turmeric powder', aliases:[]},
  {id:'cucumber', name:'Cucumber slices', aliases:[]},
  {id:'kimchi', name:'Aged Kimchi (chopped)', aliases:[]},
  {id:'curry-roux', name:'Japanese curry roux cube', aliases:[]},
  {id:'pasta', name:'Pasta (penne or fettuccine)', aliases:[]},
  {id:'cooking-cream', name:'Heavy cooking cream', aliases:[]},
  {id:'parmesan', name:'Parmesan cheese', aliases:[]}
] as const;
export const findIngredient = (name:string) => INGREDIENT_CATALOG.find(item => [item.id,item.name,...item.aliases].some(value => value.toLowerCase() === name.toLowerCase()));
const units:Record<string,QuantityUnit> = {g:'g',kg:'kg',ml:'ml',l:'l',whole:'piece',piece:'piece',cups:'cup',cup:'cup',tbsp:'tbsp',tsp:'tsp',cloves:'clove',clove:'clove',stalks:'stalk',bowls:'bowl',blocks:'block',slices:'slice'};
const quantity = (amount:string):{value:number;unit:QuantityUnit}|undefined => {
  // No inferred weights for "large", "medium", mixes or alternative ingredients.
  const match = amount.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-z]+)$/i);
  if (!match || !units[match[2].toLowerCase()]) return;
  const [numerator, denominator] = match[1].split('/').map(Number);
  const value = denominator === undefined ? numerator : numerator / denominator;
  return Number.isFinite(value) && value > 0 ? {value,unit:units[match[2].toLowerCase()]} : undefined;
};
export const ingredientPricingMetadata = (item:IngredientItem):IngredientQuantity[]|undefined => {
  if (item.pricingQuantities) return item.pricingQuantities;
  const ingredient = findIngredient(item.name);
  const used = quantity(item.amount);
  return ingredient && used ? [{ingredientId:ingredient.id,...used}] : undefined;
};
