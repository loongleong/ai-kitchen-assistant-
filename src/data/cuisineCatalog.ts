import type { Recipe } from '../types';

export const CUISINE_REGIONS = ['Southeast Asian', 'East Asian', 'South Asian', 'European', 'Middle Eastern', 'Americas', 'Cross-regional'] as const;
export type CuisineRegion = typeof CUISINE_REGIONS[number];
export interface Cuisine { id: string; name: string; region: CuisineRegion; popular?: boolean }
export const NO_CUISINE_PREFERENCE = 'No preference';

// Taxonomy describes preferences, not recipe availability. Availability always comes from recipes.
export const CUISINE_CATALOG: readonly Cuisine[] = [
  { id:'malaysian', name:'Malaysian', region:'Southeast Asian', popular:true },
  { id:'singaporean', name:'Singaporean', region:'Southeast Asian' },
  { id:'thai', name:'Thai', region:'Southeast Asian' },
  { id:'indonesian', name:'Indonesian', region:'Southeast Asian' },
  { id:'vietnamese', name:'Vietnamese', region:'Southeast Asian' },
  { id:'filipino', name:'Filipino', region:'Southeast Asian' },
  { id:'chinese', name:'Chinese', region:'East Asian', popular:true },
  { id:'japanese', name:'Japanese', region:'East Asian', popular:true },
  { id:'korean', name:'Korean', region:'East Asian', popular:true },
  { id:'taiwanese', name:'Taiwanese', region:'East Asian' },
  { id:'indian', name:'Indian', region:'South Asian' },
  { id:'pakistani', name:'Pakistani', region:'South Asian' },
  { id:'sri-lankan', name:'Sri Lankan', region:'South Asian' },
  { id:'italian', name:'Italian', region:'European', popular:true },
  { id:'french', name:'French', region:'European' },
  { id:'spanish', name:'Spanish', region:'European' },
  { id:'greek', name:'Greek', region:'European' },
  { id:'british', name:'British', region:'European' },
  { id:'middle-eastern', name:'Middle Eastern', region:'Middle Eastern' },
  { id:'lebanese', name:'Lebanese', region:'Middle Eastern' },
  { id:'turkish', name:'Turkish', region:'Middle Eastern' },
  { id:'mexican', name:'Mexican', region:'Americas' },
  { id:'american', name:'American', region:'Americas' },
  { id:'brazilian', name:'Brazilian', region:'Americas' },
  { id:'mediterranean', name:'Mediterranean', region:'Cross-regional' },
  { id:'western', name:'Western', region:'Cross-regional', popular:true },
  { id:'fusion', name:'Fusion', region:'Cross-regional' }
];
export const POPULAR_CUISINES = CUISINE_CATALOG.filter(cuisine => cuisine.popular);
export const DEFAULT_CUISINE_NAMES = ['malaysian', 'japanese', 'chinese'].map(id => CUISINE_CATALOG.find(cuisine => cuisine.id === id)!.name);
export const findCuisine = (value: string) => CUISINE_CATALOG.find(cuisine => cuisine.id === value.toLowerCase() || cuisine.name.toLowerCase() === value.toLowerCase());
export const normalizeCuisine = (value: string) => value === 'All' || value.toLowerCase() === NO_CUISINE_PREFERENCE.toLowerCase() ? NO_CUISINE_PREFERENCE : findCuisine(value)?.name ?? value;
export const cuisineMatches = (recipe: Pick<Recipe, 'cuisine' | 'cuisineIds'>, selection: string) => {
  const name = normalizeCuisine(selection);
  return name === NO_CUISINE_PREFERENCE || normalizeCuisine(recipe.cuisine) === name || !!recipe.cuisineIds?.includes(findCuisine(name)?.id ?? name);
};
export const cuisineRecipeCount = (recipes: readonly Recipe[], cuisine: string) => recipes.filter(recipe => cuisineMatches(recipe, cuisine)).length;
export const toggleCuisinePreference = (values: string[], value: string) => {
  const name = normalizeCuisine(value);
  if (name === NO_CUISINE_PREFERENCE) return [NO_CUISINE_PREFERENCE];
  const selected = values.filter(item => normalizeCuisine(item) !== NO_CUISINE_PREFERENCE);
  const next = selected.includes(name) ? selected.filter(item => item !== name) : [...selected, name];
  return next.length ? next : [NO_CUISINE_PREFERENCE];
};
