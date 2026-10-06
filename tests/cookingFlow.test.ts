import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES } from '../src/data/recipes';
import { INITIAL_USER_PROFILE } from '../src/data/initialProfile';
import { CookingQueryFilters, createCookingDraft, eligibleQueryRecipe, ingredientAvailable, isValidBudget, ownsEquipment, prepareQueryRecipe, recommendationRank } from '../src/lib/cookingFlow';

const allTools = ['Stove', 'Frying pan', 'Pot', 'Rice cooker', 'Microwave', 'Oven', 'Air fryer', 'Blender', 'Knife'];
const filters: CookingQueryFilters = { cuisine:'No preference', budgetRM:120, servings:2, equipment:allTools, ingredients:[], maxTimeMinutes:15, healthyMode:false, healthPriority:'No preference', stage:'early' };
const results = (query:CookingQueryFilters) => RECIPES.map(recipe => prepareQueryRecipe(recipe,query)).filter(recipe => eligibleQueryRecipe(recipe,query)).sort((a,b)=>recommendationRank(b,query)-recommendationRank(a,query));

test('manual budgets accept large values and reject zero, negative and non-finite values',()=>{
  for (const value of [1,8,15,38,60,120,1000,12.35]) assert.equal(isValidBudget(value),true);
  for (const value of [0,-2,0.99,NaN,Infinity]) assert.equal(isValidBudget(value),false);
});
test('draft begins at Cuisine and copies profile equipment without aliasing it',()=>{
  const draft = createCookingDraft(INITIAL_USER_PROFILE);
  assert.equal(draft.phase,'setup'); assert.equal(draft.step,1);
  draft.filters.equipment.push('Test tool');
  assert.equal(INITIAL_USER_PROFILE.equipment.includes('Test tool'),false);
  assert.equal(draft.filters.healthPriority,'No preference');
});
test('early results include all eligible recipes and ignore unanswered pantry, time and health',()=>{
  assert.equal(results(filters).length,RECIPES.length);
  const changed = { ...filters,ingredients:['kimchi'],maxTimeMinutes:1,healthPriority:'Higher protein' };
  assert.deepEqual(results(changed).map(r=>r.id),results(filters).map(r=>r.id));
  for (const recipe of results(changed)) { assert.equal(recipe.matchScore,0); assert.equal(recipe.ingredients.some(i=>i.have),false); }
});
test('cuisine, budget and required equipment really filter early results',()=>{
  assert.ok(results({...filters,cuisine:'Japanese'}).every(recipe=>recipe.cuisine==='Japanese'));
  const affordable=results({...filters,budgetRM:8}); assert.ok(affordable.length>0 && affordable.length<RECIPES.length);
  assert.ok(affordable.every(recipe=>recipe.estimatedCostRM<=8));
  const airFryer=results({...filters,equipment:['Air fryer','Rice cooker','Knife']});
  assert.equal(airFryer.length,1); assert.equal(airFryer[0].id,'air-fryer-turmeric-chicken');
  assert.equal(results({...filters,equipment:[]}).length,0);
  assert.equal(ownsEquipment(['Stove','Pot'],['stove']),false);
});
test('servings adjust ingredient amounts and total costs, while per-serving nutrition and source data stay unchanged',()=>{
  const original=RECIPES[0]; const snapshot=JSON.stringify(original);
  const scaled=prepareQueryRecipe(original,{...filters,servings:4});
  assert.equal(scaled.servings,4); assert.equal(scaled.estimatedCostRM,23);
  assert.equal(scaled.ingredients[0].amount,'500g');
  assert.equal(scaled.ingredients[1].amount,'4 cups');
  assert.equal(scaled.calories,original.calories); assert.equal(scaled.healthierVariant,original.healthierVariant);
  assert.deepEqual(scaled.steps.map(s=>s.timerMinutes),original.steps.map(s=>s.timerMinutes));
  assert.equal(JSON.stringify(original),snapshot);
  assert.equal(results({...filters,servings:4,budgetRM:15}).some(recipe=>recipe.id===original.id),false);
});
test('fractional ingredient quantities and compound ingredient amounts scale consistently',()=>{
  const curry=RECIPES.find(r=>r.id==='quick-japanese-curry') || RECIPES.find(r=>r.name.startsWith('Quick Japanese'))!;
  const scaled=prepareQueryRecipe(curry,{...filters,servings:4});
  assert.equal(scaled.ingredients.find(i=>i.name==='Onion & garlic')?.amount,'2 onion, 4 garlic');
  const donor=RECIPES.find(r=>r.name.startsWith('Egg & Chicken'))!;
  assert.equal(prepareQueryRecipe(donor,{...filters,servings:4}).ingredients.find(i=>i.name==='Yellow onion (sliced)')?.amount,'1 medium');
});
test('pantry aliases are exact and compound ingredients require both constituents',()=>{
  assert.equal(ingredientAvailable('Chicken breast (diced)',['Chicken breast']),true);
  assert.equal(ingredientAvailable('Fresh ginger (julienned)',['Ginger']),true);
  assert.equal(ingredientAvailable('Cooked jasmine rice',['Rice']),true);
  assert.equal(ingredientAvailable('Eggs (lightly beaten)',['Egg']),true);
  assert.equal(ingredientAvailable('Garlic & ginger paste',['Garlic']),false);
  assert.equal(ingredientAvailable('Garlic & ginger paste',['Garlic','Ginger']),true);
  assert.equal(ingredientAvailable('Soy sauce & dark soy',['Soy sauce']),false);
  assert.equal(ingredientAvailable('Soy sauce & dark soy',['Soy sauce','Dark soy sauce']),true);
  assert.equal(ingredientAvailable('Garlic',['Garlic powder']),false);
  assert.equal(ingredientAvailable('Potato or carrot',['Carrots']),true);
});
test('refinement calculates real pantry percentage and respects cooking time',()=>{
  const query={...filters,stage:'refined' as const,ingredients:['Rice','Chicken breast','Eggs','Garlic','Soy sauce','Cooking oil'],maxTimeMinutes:30};
  const friedRice=results(query).find(r=>r.id==='garlic-chicken-fried-rice')!;
  assert.equal(friedRice.matchScore,100); assert.equal(friedRice.ingredients.filter(i=>i.have).length,6);
  for (const recipe of results({...query,maxTimeMinutes:15})) assert.ok(recipe.timeMinutes<=15);
  assert.equal(results({...query,maxTimeMinutes:90}).length,RECIPES.length);
  assert.ok(results({...query,ingredients:[]}).every(recipe=>recipe.matchScore===0));
});
test('health priority influences ranking separately from the displayed pantry score',()=>{
  const recipe=prepareQueryRecipe(RECIPES[0],{...filters,stage:'refined',ingredients:['Rice']});
  const basic={...filters,stage:'refined' as const};
  assert.equal(recommendationRank(recipe,basic),recipe.matchScore);
  assert.equal(recommendationRank(recipe,{...basic,healthPriority:'Higher protein'}),recipe.matchScore+recipe.protein/2);
  assert.equal(recommendationRank(recipe,{...basic,healthyMode:true,healthPriority:'Higher protein'}),recipe.matchScore+recipe.healthierVariant.protein/2);
  assert.equal(recommendationRank(recipe,{...basic,healthPriority:'Higher fibre'}),recipe.matchScore+recipe.fibre*3);
});
test('legacy saved-collection queries retain original recipes and ranking',()=>{
  const legacy={...filters,stage:undefined};
  assert.equal(prepareQueryRecipe(RECIPES[0],legacy),RECIPES[0]);
  assert.equal(recommendationRank(RECIPES[0],legacy),RECIPES[0].matchScore);
});
