import { createContext, useContext } from 'react';
import type { Recipe } from '../types';
import { LOCAL_RECIPE_CATALOG } from '../lib/recipeRepository';
import { INGREDIENT_PRICES, type IngredientPrice, type PriceLocation } from '../lib/pricing';

export interface RecipeData { recipes:readonly Recipe[]; prices:readonly IngredientPrice[]; location?:PriceLocation }
export const RecipeDataContext = createContext<RecipeData>({recipes:LOCAL_RECIPE_CATALOG,prices:INGREDIENT_PRICES});
export const useRecipeData = () => useContext(RecipeDataContext);
