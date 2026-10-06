import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES } from '../src/data/recipes';
import { CUISINE_CATALOG, CUISINE_REGIONS, cuisineMatches, cuisineRecipeCount, toggleCuisinePreference } from '../src/data/cuisineCatalog';
import { EQUIPMENT_CATALOG, equipmentCompatibility, normalizeEquipment } from '../src/data/equipmentCatalog';
import { INGREDIENT_PRICES, convertQuantity, estimateRecipePricing, validIngredientPrice, type IngredientPrice } from '../src/lib/pricing';
import { importPriceCatcherPrices } from '../src/lib/priceCatcher';
import { LOCAL_RECIPE_CATALOG, loadRecipeCatalog } from '../src/lib/recipeRepository';
import { eligibleQueryRecipe, prepareQueryRecipe, type CookingQueryFilters } from '../src/lib/cookingFlow';
import type { Recipe } from '../src/types';

const tomato = RECIPES.find(recipe=>recipe.id === 'stir-fried-tomato-egg-rice')!;
const query:CookingQueryFilters = {cuisine:'Chinese',budgetRM:100,servings:2,ingredients:[],equipment:['Induction cooker','Wok','Knife'],maxTimeMinutes:90,healthyMode:false,healthPriority:'No preference',stage:'early'};
// Synthetic fixtures exist only in tests; the application's price table is empty.
const price:IngredientPrice = {ingredientId:'chicken-breast',name:'TEST chicken',unit:'kg',priceRM:20,priceBasis:{quantity:1,purchaseKind:'pack'},source:{kind:'verified-manual',reference:'test-fixture-only'},updatedAt:'2026-01-01',locationScope:{country:'MY'}};
const pricedRecipe:Recipe = {...tomato,id:'test-priced',ingredients:[{id:'a',ingredientId:'chicken-breast',name:'Chicken breast',amount:'250g',have:false,pricingQuantities:[{ingredientId:'chicken-breast',value:250,unit:'g'}]}]};

test('cuisine taxonomy covers every requested region and does not fabricate availability',()=>{
  assert.equal(CUISINE_CATALOG.length,27);
  assert.equal(new Set(CUISINE_CATALOG.map(cuisine=>cuisine.id)).size,27);
  for (const region of CUISINE_REGIONS) assert.ok(CUISINE_CATALOG.some(cuisine=>cuisine.region === region));
  for (const recipe of RECIPES) assert.ok(CUISINE_CATALOG.some(cuisine=>cuisine.name === recipe.cuisine));
  assert.equal(cuisineRecipeCount(RECIPES,'Thai'),0);
  assert.equal(cuisineRecipeCount(RECIPES,'No preference'),RECIPES.length);
  assert.equal(cuisineRecipeCount(RECIPES,'All'),RECIPES.length);
  assert.equal(cuisineMatches(tomato,'Chinese'),true);
  assert.equal(cuisineMatches(tomato,'Taiwanese'),false);
  assert.equal(cuisineMatches({...tomato,cuisineIds:['taiwanese']},'Taiwanese'),true);
  assert.equal(eligibleQueryRecipe(prepareQueryRecipe(tomato,query),{...query,cuisine:'Thai'}),false);
});
test('No preference is exclusive and compatible with legacy profile names',()=>{
  assert.deepEqual(toggleCuisinePreference(['Japanese','Chinese'],'No preference'),['No preference']);
  assert.deepEqual(toggleCuisinePreference(['No preference'],'Thai'),['Thai']);
  assert.deepEqual(toggleCuisinePreference(['Thai'],'Thai'),['No preference']);
});
test('all 26 tools have category and capability metadata; names and aliases normalize',()=>{
  assert.equal(EQUIPMENT_CATALOG.length,26);
  assert.equal(EQUIPMENT_CATALOG.filter(tool=>tool.scene).length,9);
  assert.ok(EQUIPMENT_CATALOG.every(tool=>tool.category && tool.capabilities.length));
  assert.deepEqual(normalizeEquipment(['stove','Stove','frying-pan','Skillet','induction hob']),['Stove','Frying pan','Induction cooker']);
});
test('wok, induction and saucepan substitutions work without exact names',()=>{
  assert.equal(equipmentCompatibility(['Frying pan','Stove','Pot','Knife'],['Wok','Induction cooker','Saucepan','Knife']).compatible,true);
  const meal = prepareQueryRecipe(tomato,query);
  assert.equal(eligibleQueryRecipe(meal,query),true);
  assert.deepEqual(equipmentCompatibility(['Frying pan'],['Wok']).checks[0].ownedTools,['Wok']);
  assert.equal(equipmentCompatibility(['Wok'],['Frying pan']).compatible,false);
});
test('unrelated appliances and prep tools cannot satisfy cooking methods',()=>{
  assert.equal(equipmentCompatibility(['Pot','Stove'],['Electric kettle']).compatible,false);
  assert.equal(equipmentCompatibility(['Air fryer'],['Oven']).compatible,false);
  assert.equal(equipmentCompatibility(['Knife'],['Food processor']).compatible,false);
  assert.equal(equipmentCompatibility(['Custom tool'],['custom tool']).compatible,true);
  assert.equal(equipmentCompatibility(['Custom tool'],['Knife']).compatible,false);
  assert.equal(equipmentCompatibility([],[]).compatible,true);
});
test('explicit recipe capability alternatives can be satisfied by a combination of owned tools',()=>{
  const requirements = [{label:'Rice cooker',alternatives:[['cook-rice'],['boil','simmer','stovetop-heat']]}] as const;
  assert.equal(equipmentCompatibility(['Rice cooker'],['Pot','Induction cooker'],requirements).compatible,true);
  assert.equal(equipmentCompatibility(['Rice cooker'],['Pot'],requirements).compatible,false);
});
test('RM93.20 is remaining budget; Tomato & Egg Rice stays RM6.80 for two servings',()=>{
  const quote = estimateRecipePricing(tomato,{servings:2,budgetRM:100});
  assert.equal(quote.estimatedMealCostRM,6.8);
  assert.equal(quote.remainingBudgetRM,93.2);
  assert.equal(quote.additionalShoppingCostRM,0);
  assert.equal(quote.mealMethod,'legacy-recipe-fallback');
  const projected = prepareQueryRecipe(tomato,query);
  assert.equal(projected.estimatedCostRM,6.8);
  assert.equal(projected.pricing!.estimatedMealCostRM,6.8);
  assert.equal(projected.pricing!.remainingBudgetRM,93.2);
  assert.equal(projected.pricing!.additionalShoppingCostRM,null);
});
test('fallback serving scaling is anchored once to the base recipe, never to budget',()=>{
  const four = prepareQueryRecipe(LOCAL_RECIPE_CATALOG.find(recipe=>recipe.id===tomato.id)!,{...query,servings:4});
  assert.equal(four.pricing!.estimatedMealCostRM,13.6);
  assert.equal(estimateRecipePricing(four,{servings:6}).estimatedMealCostRM,20.4);
  assert.equal(estimateRecipePricing(four,{budgetRM:120}).estimatedMealCostRM,13.6);
  assert.equal(tomato.estimatedCostRM,6.8);
});
test('ingredient pricing separates quantities consumed from whole packs to buy',()=>{
  const quote = estimateRecipePricing(pricedRecipe,{prices:[price],budgetRM:100});
  assert.equal(quote.mealMethod,'ingredient-prices');
  assert.equal(quote.estimatedMealCostRM,5);
  assert.equal(quote.additionalShoppingCostRM,20);
  assert.equal(quote.remainingBudgetRM,95);
  const owned = estimateRecipePricing({...pricedRecipe,ingredients:pricedRecipe.ingredients.map(item=>({...item,have:true}))},{prices:[price]});
  assert.equal(owned.estimatedMealCostRM,5); assert.equal(owned.additionalShoppingCostRM,0);
  const scaled = prepareQueryRecipe(pricedRecipe,{...query,servings:4},{prices:[price]});
  assert.equal(scaled.pricing!.estimatedMealCostRM,10);
  assert.equal(scaled.ingredients[0].pricingQuantities![0].value,500);
});
test('missing repeated ingredients share one purchase pack calculation',()=>{
  const duplicate = {...pricedRecipe,ingredients:[...pricedRecipe.ingredients,{...pricedRecipe.ingredients[0],id:'b'}]};
  const quote = estimateRecipePricing(duplicate,{prices:[price]});
  assert.equal(quote.estimatedMealCostRM,10); assert.equal(quote.additionalShoppingCostRM,20);
  assert.equal(estimateRecipePricing(duplicate,{prices:[price],servings:6}).additionalShoppingCostRM,40);
  const fractional = {...pricedRecipe,ingredients:[0.1,0.2].map((value,index)=>({...pricedRecipe.ingredients[0],id:String(index),pricingQuantities:[{ingredientId:'chicken-breast',value,unit:'kg' as const}]}))};
  const smallPack = {...price,priceBasis:{quantity:0.3,purchaseKind:'pack' as const}};
  assert.equal(estimateRecipePricing(fractional,{prices:[smallPack]}).additionalShoppingCostRM,20);
});
test('partial prices do not overwrite a whole-recipe fallback or claim a full shopping total',()=>{
  const incomplete = {...pricedRecipe,ingredients:[...pricedRecipe.ingredients,{id:'unknown',name:'Unmapped spice mix',amount:'1 pinch',have:false}]};
  const quote = estimateRecipePricing(incomplete,{prices:[price]});
  assert.equal(quote.estimatedMealCostRM,6.8);
  assert.equal(quote.additionalShoppingCostRM,null);
  assert.equal(quote.knownAdditionalShoppingCostRM,20);
  assert.equal(quote.shoppingMethod,'incomplete');
  assert.equal(estimateRecipePricing(incomplete,{prices:[price],pantryKnown:false}).additionalShoppingCostRM,null);
});
test('missing item fallbacks remain labelled estimates, with unknown items kept unknown',()=>{
  const ginger = RECIPES.find(recipe=>recipe.id === 'ginger-chicken-rice-bowl')!;
  const quote = estimateRecipePricing(ginger,{servings:4});
  assert.equal(quote.additionalShoppingCostRM,2.4);
  assert.equal(quote.shoppingMethod,'legacy-item-fallback');
  const unknown = estimateRecipePricing({...ginger,ingredients:ginger.ingredients.map(item=>({...item,have:false}))});
  assert.equal(unknown.additionalShoppingCostRM,null);
  assert.equal(unknown.knownAdditionalShoppingCostRM,1.2);
});
test('invalid quotes, incompatible units and unrelated locations cannot price a recipe',()=>{
  assert.equal(validIngredientPrice({...price,priceRM:-1}),false);
  assert.equal(validIngredientPrice({...price,priceBasis:{quantity:0,purchaseKind:'pack'}}),false);
  assert.equal(validIngredientPrice({...price,updatedAt:'unknown'}),false);
  assert.equal(convertQuantity(1,'kg','g'),1000);
  assert.equal(convertQuantity(1,'tbsp','ml'),15);
  assert.equal(convertQuantity(1,'cup','g'),null);
  assert.equal(convertQuantity(1,'piece','kg'),null);
  const local = {...price,locationScope:{country:'MY' as const,state:'Selangor',district:'Petaling'}};
  assert.equal(estimateRecipePricing(pricedRecipe,{prices:[local]}).mealMethod,'legacy-recipe-fallback');
  assert.equal(estimateRecipePricing(pricedRecipe,{prices:[local],location:{country:'MY',state:'Selangor',district:'Petaling'}}).mealMethod,'ingredient-prices');
});
test('budget shortfall is separate; remaining budget cannot be a negative meal price',()=>{
  const quote = estimateRecipePricing(tomato,{budgetRM:5});
  assert.equal(quote.estimatedMealCostRM,6.8); assert.equal(quote.remainingBudgetRM,0); assert.equal(quote.budgetShortfallRM,1.8);
});
test('PriceCatcher importer requires an explicit item/unit mapping and joined geography',()=>{
  const row = {date:'2026-01-01',item_code:99,premise_code:50,price:20,item:'TEST CHICKEN',unit:'1kg',state:'Selangor',district:'Petaling'};
  const mapping = {itemCode:99,ingredientId:'chicken-breast',sourceUnitLabel:'1kg',unit:'kg' as const,basisQuantity:1,purchaseKind:'loose' as const};
  const imported = importPriceCatcherPrices([row],[mapping]);
  assert.equal(imported.length,1); assert.equal(imported[0].updatedAt,row.date); assert.equal(imported[0].locationScope.premiseCode,50);
  assert.equal(imported[0].source.kind,'pricecatcher');
  assert.equal(importPriceCatcherPrices([{...row,unit:'500g'}],[mapping]).length,0);
  assert.equal(importPriceCatcherPrices([{...row,price:-1}],[mapping]).length,0);
  assert.equal(importPriceCatcherPrices([row],[]).length,0);
  assert.equal(INGREDIENT_PRICES.length,0);
});
test('recipe repository keeps the existing dataset and rejects fabricated external price totals',async()=>{
  assert.equal((await loadRecipeCatalog()).length,RECIPES.length);
  assert.deepEqual(LOCAL_RECIPE_CATALOG.map(recipe=>recipe.steps),RECIPES.map(recipe=>recipe.steps));
  await assert.rejects(loadRecipeCatalog({id:'future-api',async listRecipes(){return [{...tomato,estimatedCostRM:93.2}];}}),/verified ingredient pricing/);
  const loaded = await loadRecipeCatalog({id:'future-api',async listRecipes(){return [pricedRecipe];}},{prices:[price]});
  assert.equal(loaded[0].estimatedCostRM,5);
  assert.equal(loaded[0].pricingFallback,undefined);
  assert.equal(loaded[0].source!.providerId,'future-api');
  await assert.rejects(loadRecipeCatalog({id:'future-api',async listRecipes(){return [pricedRecipe,pricedRecipe];}},{prices:[price]}),/duplicate IDs/);
});
