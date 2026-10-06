import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, Leaf, Minus, Plus, Users, Wallet } from 'lucide-react';
import { UserKitchenProfile } from '../types';
import { CookingFlowDraft, CookingQueryFilters, isValidBudget } from '../lib/cookingFlow';
import { KitchenEquipmentScene } from './KitchenEquipmentScene';
import { CuisineDiscovery } from './CuisineDiscovery';
import { DesignAction, DesignHeading } from './DesignUI';

export type { CookingQueryFilters } from '../lib/cookingFlow';

interface WhatCanICookScreenProps {
  userProfile: UserKitchenProfile;
  draft: CookingFlowDraft;
  onDraftChange: (draft: CookingFlowDraft) => void;
  onFindMeals: (filters: CookingQueryFilters) => void;
  onUpdateProfile: (updated: Partial<UserKitchenProfile>) => void;
  onOpenIdentitySwitch: () => void;
  onReturnToResults: () => void;
  onBackHome: () => void;
}

const staples = ['Soy sauce', 'Cooking oil', 'Onion', 'Ginger', 'Chilli', 'Noodles', 'Potatoes', 'Carrots', 'Broccoli', 'Cucumber'];
const healthPriorities = ['No preference', 'Balanced meals', 'Lower calorie', 'Higher protein', 'Higher fibre', 'Lower sugar'];

export const WhatCanICookScreen: React.FC<WhatCanICookScreenProps> = ({
  userProfile, draft, onDraftChange, onFindMeals, onOpenIdentitySwitch, onReturnToResults, onBackHome
}) => {
  const { filters, phase, step } = draft;
  const refining = phase === 'refine';
  const labels = refining ? ['Ingredients', 'Time', 'Health'] : ['Cuisine', 'Budget', 'Kitchen'];
  const [budgetInput, setBudgetInput] = useState(String(filters.budgetRM));
  const [ingredientInput, setIngredientInput] = useState('');
  const validBudget = budgetInput.trim() !== '' && isValidBudget(Number(budgetInput));
  const update = (patch: Partial<CookingQueryFilters>) => onDraftChange({ ...draft, filters: { ...filters, ...patch } });
  const goTo = (next: number) => onDraftChange({ ...draft, step: next });
  const toggleIngredient = (item: string) => update({ ingredients: filters.ingredients.includes(item)
    ? filters.ingredients.filter(ingredient => ingredient !== item) : [...filters.ingredients, item] });
  const submit = (skipHealth = false) => {
    if (!validBudget) return;
    onFindMeals(refining
      ? { ...filters, stage: 'refined', ...(skipHealth ? { healthPriority: 'No preference', healthyMode: false } : {}) }
      : { ...filters, stage: 'early', ingredients: [], maxTimeMinutes: 90, healthyMode: false, healthPriority: 'No preference' });
    if (skipHealth) update({ healthPriority: 'No preference', healthyMode: false });
  };
  const addIngredient = (event: React.FormEvent) => {
    event.preventDefault();
    const value = ingredientInput.trim();
    if (value && !filters.ingredients.some(item => item.toLowerCase() === value.toLowerCase())) update({ ingredients: [...filters.ingredients, value] });
    setIngredientInput('');
  };

  return <div className="design-page cook-flow">
    <div className="journey-bar"><span className="journey-title">YOUR NEXT MEAL STARTS HERE</span><nav className="journey-steps" aria-label={refining?'Refinement progress':'Kitchen setup progress'}>{labels.map((label,index)=><button type="button" key={label} aria-current={step===index+1?'step':undefined} className={step===index+1?'current':step>index+1?'complete':''} disabled={!validBudget&&index>1} onClick={()=>goTo(index+1)}><span>{step>index+1?<Check size={12}/>:String(index+1).padStart(2,'0')}</span>{label}{index<2&&<i/>}</button>)}{!refining&&<><i/><button disabled><span>04</span>Your matches</button></>}</nav><span className="journey-note"><Leaf size={13}/>A little less waste. A lot more possibility.</span></div>
    <div className="flow-profile-strip"><button type="button" className="back-link" onClick={()=>refining&&step===1?onReturnToResults():step>1?goTo(step-1):onBackHome()}><ArrowLeft size={15}/>{refining&&step===1?'Back to meals':step===1?'Back to Home':'Back'}</button><button className="text-button" onClick={onOpenIdentitySwitch}>{userProfile.name} · {userProfile.identity} <span>Switch role</span></button></div>
    <div className="flow-scene" key={phase+'-'+step}>
    {!refining&&step===1&&<CuisineDiscovery selected={filters.cuisine} onSelect={cuisine=>update({cuisine})} onNext={()=>goTo(2)}/>}
    {!refining&&step===2&&<section className="center-step budget-step">
      <DesignHeading eyebrow="A LITTLE PLANNING, A LOT OF POSSIBILITY" title="Good food. Your budget." description="Set a comfortable total. We’ll make the most of it."/>
      <div className="budget-surface"><label className="eyebrow" htmlFor="meal-budget">TOTAL MEAL BUDGET</label><div className="budget-input"><span>RM</span><input id="meal-budget" type="number" inputMode="decimal" min="1" step="0.01" value={budgetInput} aria-invalid={!validBudget} aria-describedby="meal-budget-help" onChange={event=>{setBudgetInput(event.target.value);const value=Number(event.target.value);if(event.target.value.trim()&&isValidBudget(value))update({budgetRM:value})}}/></div>
      <div className="preset-row">{[10,20,30,50].map(value=><button type="button" className={Number(budgetInput)===value?'select-chip selected':'select-chip'} key={value} aria-pressed={Number(budgetInput)===value} onClick={()=>{setBudgetInput(String(value));update({budgetRM:value})}}>RM{value}</button>)}</div>
      <p id="meal-budget-help" className={validBudget?'subtle':'cook-error'}>{validBudget?'Your total meal budget, not a per-person limit. RM1 or more, with no upper limit.':'Enter a valid amount of RM1 or more.'}</p>
      <div className="servings-row"><div><Users size={20}/><span>Cooking for</span></div><div className="stepper"><button type="button" aria-label="Fewer servings" disabled={filters.servings<=1} onClick={()=>update({servings:Math.max(1,filters.servings-1)})}><Minus size={16}/></button><output aria-label="Servings" aria-live="polite">{filters.servings}</output><button type="button" aria-label="More servings" disabled={filters.servings>=6} onClick={()=>update({servings:Math.min(6,filters.servings+1)})}><Plus size={16}/></button></div></div>
      <div className="per-person"><Wallet size={17}/><span>Approx. <strong>RM{(validBudget?Number(budgetInput)/filters.servings:0).toFixed(2)}</strong> per person in your budget</span></div></div>
      <div className="step-footer"><span>Beautiful meals don’t need a big budget.</span><DesignAction onClick={()=>goTo(3)} disabled={!validBudget}>Meet your kitchen</DesignAction></div>
    </section>}
    {!refining&&step===3&&<section className="kitchen-step panoramic-step"><DesignHeading eyebrow="YOUR KITCHEN, DISCOVERED" title="A kitchen full of possibilities." description="Explore your space. Select the tools you own. We’ll take care of the inspiration."/><KitchenEquipmentScene selectedEquipment={filters.equipment} onToggle={tool=>update({equipment:filters.equipment.includes(tool)?filters.equipment.filter(item=>item!==tool):[...filters.equipment,tool]})} onNext={()=>submit()} disabled={!validBudget}/></section>}
    {refining&&<section className="center-step refine-step">
      <div className="refine-context"><span>{filters.cuisine}</span><span>RM{filters.budgetRM.toFixed(2)} budget</span><span>{filters.servings} servings</span><span>{filters.equipment.length} tools</span><button type="button" onClick={()=>onDraftChange({...draft,phase:'setup',step:1})}>Edit first choices <ArrowRight size={13}/></button></div>
      <DesignHeading eyebrow="REFINE YOUR MATCH · COMPLETELY OPTIONAL" title={step===1?'What do you already have?':step===2?'How much time do you have?':'Want us to optimise for anything?'} description={step===1?'A few ingredients can bring your next meal into focus. Check the starting list and make it yours.':step===2?'A quick bite or time to savour the process.':'Just a preference, not a rule. All good food belongs here.'}/>
      {step===1&&<><form onSubmit={addIngredient} className="cook-ingredient-form"><input type="text" aria-label="Add an ingredient" placeholder="Add an ingredient…" value={ingredientInput} onChange={event=>setIngredientInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&event.nativeEvent.isComposing)event.preventDefault()}}/><button type="submit" aria-label="Add ingredient"><Plus size={18}/></button></form>
      <h3 className="cook-tray-heading">In your kitchen right now ({filters.ingredients.length})</h3><div className="cook-ingredient-chips">{filters.ingredients.map(item=><span key={item}><Check size={13}/>{item}<button type="button" aria-label={'Remove '+item} onClick={()=>toggleIngredient(item)}>×</button></span>)}</div>
      {filters.ingredients.length===0&&<p className="cook-empty-note">An empty pantry is fine. Browse meals with a complete shopping list.</p>}
      <div className="cook-staples"><h3>Tap to add common items</h3><div>{staples.map(item=><button type="button" className={filters.ingredients.includes(item)?'select-chip selected':'select-chip'} key={item} aria-pressed={filters.ingredients.includes(item)} onClick={()=>toggleIngredient(item)}>{filters.ingredients.includes(item)?<Check size={13}/>:<Plus size={13}/>} {item}</button>)}</div></div></>}
      {step===2&&<div className="time-options">{[15,30,45,60,90].map(minutes=><button type="button" key={minutes} className={filters.maxTimeMinutes===minutes?'time-option selected':'time-option'} aria-pressed={filters.maxTimeMinutes===minutes} onClick={()=>update({maxTimeMinutes:minutes})}><Clock3 size={22}/><strong>{minutes===90?'No rush':minutes}</strong><span>{minutes===90?'Any cooking time':'minutes'}</span></button>)}</div>}
      {step===3&&<><div className="health-options">{healthPriorities.map(priority=><button type="button" className={filters.healthPriority===priority?'health-option selected':'health-option'} key={priority} aria-pressed={filters.healthPriority===priority} onClick={()=>update({healthPriority:priority})}><Leaf size={20}/><span><strong>{priority}</strong><small>{priority==='No preference'?'Let flavour lead the way':'A little guidance for your next meal.'}</small></span><span className="selection-circle">{filters.healthPriority===priority&&<Check size={13}/>}</span></button>)}</div>
      <button type="button" className="cook-health-toggle" aria-pressed={filters.healthyMode} onClick={()=>update({healthyMode:!filters.healthyMode})}><Leaf size={18}/><span><strong>Consider the healthier versions</strong><small>Use each recipe’s lighter nutrition profile when ranking.</small></span><span className={filters.healthyMode?'cook-toggle is-on':'cook-toggle'} aria-hidden="true"><i/></span></button></>}
      <div className="step-footer"><button className="text-button" onClick={()=>step>1?goTo(step-1):onReturnToResults()}><ArrowLeft size={15}/>{step===1?'Back to meals':'Previous'}</button><div className="refine-actions">{step===3&&<button type="button" className="text-button" onClick={()=>submit(true)}>Skip health</button>}<DesignAction onClick={()=>step<3?goTo(step+1):submit()} disabled={!validBudget}>{step===3?'Reveal my matches':'Continue'}</DesignAction></div></div>
    </section>}
    </div>
  </div>;
};
