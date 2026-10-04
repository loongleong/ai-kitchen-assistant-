import React, { useState } from 'react';
import { UserKitchenProfile, UserIdentity } from '../types';

export interface CookingQueryFilters {
  cuisine: string;
  budgetRM: number;
  servings: number;
  ingredients: string[];
  equipment: string[];
  maxTimeMinutes: number;
  healthyMode: boolean;
  healthPriority: string;
}

interface WhatCanICookScreenProps {
  userProfile: UserKitchenProfile;
  onFindMeals: (filters: CookingQueryFilters) => void;
  onUpdateProfile: (updated: Partial<UserKitchenProfile>) => void;
  onOpenIdentitySwitch: () => void;
}

export const WhatCanICookScreen: React.FC<WhatCanICookScreenProps> = ({
  userProfile,
  onFindMeals,
  onUpdateProfile,
  onOpenIdentitySwitch
}) => {
  // Step state (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections pre-populated from user profile to remember user!
  const [selectedCuisine, setSelectedCuisine] = useState<string>('No preference');
  const [budgetRM, setBudgetRM] = useState<number>(userProfile.typicalBudgetRM || 15);
  const [servings, setServings] = useState<number>(userProfile.householdSize || 2);
  
  // Ingredients list (manual entry + chips)
  const [ingredients, setIngredients] = useState<string[]>([
    'Chicken breast',
    'Eggs',
    'Rice',
    'Tomato',
    'Garlic'
  ]);
  const [newIngredientInput, setNewIngredientInput] = useState('');

  // Equipment selection
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    userProfile.equipment.length > 0 ? userProfile.equipment : ['Stove', 'Frying pan', 'Rice cooker']
  );

  // Cooking time
  const [maxTime, setMaxTime] = useState<number>(30);

  // Health
  const [healthyMode, setHealthyMode] = useState<boolean>(false);
  const [healthPriority, setHealthPriority] = useState<string>(userProfile.healthPriority || 'Balanced meals');

  // Popular ingredient suggestions
  const suggestedPantryItems = [
    'Soy sauce', 'Cooking oil', 'Onion', 'Ginger', 'Chilli', 
    'Noodles', 'Potatoes', 'Carrots', 'Broccoli', 'Cucumber'
  ];

  const handleAddCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredientInput.trim() && !ingredients.includes(newIngredientInput.trim())) {
      setIngredients([...ingredients, newIngredientInput.trim()]);
      setNewIngredientInput('');
    }
  };

  const handleToggleSuggestedIngredient = (item: string) => {
    if (ingredients.includes(item)) {
      setIngredients(ingredients.filter(i => i !== item));
    } else {
      setIngredients([...ingredients, item]);
    }
  };

  const handleToggleEquipment = (tool: string) => {
    if (selectedEquipment.includes(tool)) {
      if (selectedEquipment.length > 1) {
        setSelectedEquipment(selectedEquipment.filter(t => t !== tool));
      }
    } else {
      setSelectedEquipment([...selectedEquipment, tool]);
    }
  };

  const handleTriggerSearch = () => {
    onFindMeals({
      cuisine: selectedCuisine,
      budgetRM,
      servings,
      ingredients,
      equipment: selectedEquipment,
      maxTimeMinutes: maxTime,
      healthyMode,
      healthPriority
    });
  };

  const stepsList = [
    { number: 1, label: 'Cuisine' },
    { number: 2, label: 'Budget' },
    { number: 3, label: 'Ingredients' },
    { number: 4, label: 'Equipment' },
    { number: 5, label: 'Time' },
    { number: 6, label: 'Health' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title & Subtitle Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight mb-2">
          What can I cook?
        </h1>
        <p className="text-base text-[#1C2520]/75">
          Build a meal around your real kitchen — not the other way around.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Multi-Step Interactive Form Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs">
          {/* Step Progress Pills Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#183B2B]/8 mb-8 overflow-x-auto">
            {stepsList.map((step) => {
              const isCurrent = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#183B2B] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#EAF2EC] text-[#183B2B]'
                      : 'text-[#1C2520]/50 hover:bg-[#F2EFE8]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-[#183B2B] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? '✓' : step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* STEP 1: Cuisine */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">Select Cuisine Style</h2>
                <p className="text-xs text-[#1C2520]/65">Choose what you feel like having or let SavorAI decide.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['No preference', 'Chinese', 'Japanese', 'Korean', 'Malaysian', 'Italian'].map((cuisine) => {
                  const isSelected = selectedCuisine === cuisine;
                  return (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#183B2B] bg-[#EAF2EC] text-[#183B2B] font-bold shadow-xs'
                          : 'border-[#183B2B]/10 hover:border-[#183B2B]/30 bg-[#FBF9F5] text-[#1C2520]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{cuisine}</span>
                        {isSelected && <span className="text-xs text-[#183B2B]">✓</span>}
                      </div>
                      <span className="text-[11px] text-[#1C2520]/60 block">
                        {cuisine === 'No preference' ? 'Any cuisine matches' : `${cuisine} home cooking`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Budget & People */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">Set Cooking Budget & Servings</h2>
                <p className="text-xs text-[#1C2520]/65">We adjust portion costs and grocery affordability in RM.</p>
              </div>

              {/* Budget Slider */}
              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-[#1C2520]">Total Meal Budget</span>
                  <span className="text-2xl font-black text-[#183B2B] tabular-nums">
                    RM{budgetRM}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="40"
                  step="1"
                  value={budgetRM}
                  onChange={(e) => setBudgetRM(Number(e.target.value))}
                  className="w-full h-2 bg-[#EAF2EC] rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
                />
                <div className="flex justify-between text-[11px] text-[#1C2520]/50 mt-2">
                  <span>RM6 (Ultra-frugal student)</span>
                  <span>RM15 (Default sweet spot)</span>
                  <span>RM40+ (Multi-course dinner)</span>
                </div>
              </div>

              {/* Number of People Stepper */}
              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#1C2520] block">Cooking for how many?</span>
                  <span className="text-xs text-[#1C2520]/60">Calculates cost per plate (≈ RM{(budgetRM / servings).toFixed(2)}/pax)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-[#183B2B]/15 text-[#183B2B] font-bold flex items-center justify-center hover:bg-[#EAF2EC] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-[#183B2B] w-8 text-center tabular-nums">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings(Math.min(6, servings + 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-[#183B2B]/15 text-[#183B2B] font-bold flex items-center justify-center hover:bg-[#EAF2EC] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Ingredients */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">Ingredients You Already Have</h2>
                <p className="text-xs text-[#1C2520]/65">
                  Type what’s in your fridge or click suggested staples to add.
                </p>
              </div>

              {/* Manual Input Bar */}
              <form onSubmit={handleAddCustomIngredient} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Tofu, Cabbage, Shrimp, Butter..."
                  value={newIngredientInput}
                  onChange={(e) => setNewIngredientInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#183B2B]/15 bg-[#FBF9F5] text-sm text-[#1C2520] focus:outline-none focus:border-[#183B2B] focus:ring-1 focus:ring-[#183B2B]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#183B2B] text-white hover:bg-[#132E22] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </form>

              {/* Currently Selected Active Ingredients */}
              <div>
                <span className="text-xs font-semibold text-[#183B2B] block mb-2">
                  In Your Kitchen Right Now ({ingredients.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-xl bg-[#EAF2EC] border border-[#183B2B]/15 text-xs font-medium text-[#183B2B] flex items-center gap-1.5"
                    >
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => setIngredients(ingredients.filter(i => i !== item))}
                        className="text-[#183B2B]/60 hover:text-[#E86C38] cursor-pointer ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick-Tap Suggested Staples */}
              <div className="pt-4 border-t border-[#183B2B]/8">
                <span className="text-xs font-semibold text-[#1C2520]/70 block mb-2">
                  Tap to add common items:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedPantryItems.map((item) => {
                    const isAdded = ingredients.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleToggleSuggestedIngredient(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-[#FBF9F5] text-[#1C2520]/80 border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {isAdded ? `✓ ${item}` : `+ ${item}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Equipment */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">Kitchen Equipment Owned</h2>
                <p className="text-xs text-[#1C2520]/65">We only recommend dishes you can cook with your actual gear.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Stove',
                  'Frying pan',
                  'Rice cooker',
                  'Air fryer',
                  'Pot',
                  'Knife',
                  'Blender',
                  'Microwave',
                  'Oven'
                ].map((tool) => {
                  const isOwned = selectedEquipment.includes(tool);
                  return (
                    <button
                      key={tool}
                      onClick={() => handleToggleEquipment(tool)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isOwned
                          ? 'border-[#183B2B] bg-[#EAF2EC] text-[#183B2B] font-bold shadow-xs'
                          : 'border-[#183B2B]/10 bg-[#FBF9F5] text-[#1C2520]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{tool}</span>
                        <span>{isOwned ? '✓' : '+'}</span>
                      </div>
                      <span className="text-[11px] text-[#1C2520]/60">
                        {isOwned ? 'Available to use' : 'Not owned'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Cooking Time */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">How Much Time Do You Have?</h2>
                <p className="text-xs text-[#1C2520]/65">Filter meals by total active prep and cooking duration.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Under 15 min', minutes: 15, tag: 'Flash quick' },
                  { label: 'Under 30 min', minutes: 30, tag: 'Standard dinner' },
                  { label: 'Under 45 min', minutes: 45, tag: 'Hearty meal' },
                  { label: 'Any time', minutes: 90, tag: 'Weekend cooking' }
                ].map((item) => {
                  const isSelected = maxTime === item.minutes;
                  return (
                    <button
                      key={item.minutes}
                      onClick={() => setMaxTime(item.minutes)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#183B2B] bg-[#EAF2EC] text-[#183B2B] font-bold shadow-xs'
                          : 'border-[#183B2B]/10 bg-[#FBF9F5] text-[#1C2520]'
                      }`}
                    >
                      <span className="text-sm font-bold block mb-1">{item.label}</span>
                      <span className="text-[11px] text-[#1C2520]/60">{item.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Health & Priorities */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#183B2B] mb-1">Health & Nutrition Priority</h2>
                <p className="text-xs text-[#1C2520]/65">
                  Calories remain the primary metric, without labeling food as "good" or "bad".
                </p>
              </div>

              {/* Healthy Mode Toggle */}
              <div className="p-5 rounded-2xl bg-[#EAF2EC] border border-[#183B2B]/15 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#183B2B] block">Healthy Mode</span>
                  <span className="text-xs text-[#1C2520]/75">
                    Prioritises lighter oils, extra fiber, and smarter cooking methods.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHealthyMode(!healthyMode)}
                  className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer ${
                    healthyMode ? 'bg-[#183B2B]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                    healthyMode ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Priority Selectors */}
              <div>
                <span className="text-xs font-semibold text-[#183B2B] block mb-2">
                  Nutritional Goal Priority:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Balanced meals',
                    'Lower calorie',
                    'Higher protein',
                    'Lower sugar',
                    'Higher fibre'
                  ].map((p) => {
                    const isSelected = healthPriority === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setHealthPriority(p)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-8 mt-8 border-t border-[#183B2B]/8 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-xl ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-[#1C2520] hover:bg-[#F2EFE8] cursor-pointer'
              }`}
            >
              ← Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#183B2B] hover:bg-[#132E22] transition-colors cursor-pointer"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleTriggerSearch}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#E86C38] hover:bg-[#D45924] shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <span>Find meals I can cook</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Side Panel: "Your Kitchen Profile" (4 cols) */}
        <div className="lg:col-span-4 bg-[#FBF9F5] rounded-3xl p-6 border border-[#183B2B]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#183B2B]/10">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#183B2B] font-bold block">
                Your Kitchen Profile
              </span>
              <span className="text-sm font-bold text-[#1C2520]">
                {userProfile.name} ({userProfile.identity})
              </span>
            </div>

            <button
              onClick={onOpenIdentitySwitch}
              className="text-[11px] font-semibold text-[#E86C38] hover:underline cursor-pointer"
            >
              Switch Role
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Identity badge explanation */}
            <div className="p-3.5 rounded-2xl bg-[#EAF2EC] border border-[#183B2B]/10">
              <span className="font-bold text-[#183B2B] block mb-1">
                Remembers your {userProfile.identity} mode:
              </span>
              <p className="text-[#1C2520]/75 leading-relaxed">
                {userProfile.identity === 'Student' && 'Prioritises under RM15, fewer ingredients, single-pan cooking, fast cleanups.'}
                {userProfile.identity === 'Family / Household' && 'Scales batch meals with lowest cost per serving and balanced nutrition.'}
                {userProfile.identity === 'Fitness User' && 'Prioritises 35g+ protein density and lean cooking swaps.'}
                {userProfile.identity === 'Beginner Cook' && 'Detailed visual doneness cues, failsafe swaps, and forgiving cook times.'}
                {userProfile.identity === 'General User' && 'Balanced culinary recommendations with high flavour and comfort.'}
                {userProfile.identity === 'I’m not sure yet' && 'Adapts as you save recipes and mark fridge ingredients.'}
              </p>
            </div>

            {/* Usual Budget */}
            <div className="flex items-center justify-between py-2 border-b border-[#183B2B]/8">
              <span className="text-[#1C2520]/65 font-medium">Usual Budget</span>
              <span className="font-bold text-[#183B2B]">RM{userProfile.typicalBudgetRM}/meal</span>
            </div>

            {/* Kitchen Equipment */}
            <div className="py-2 border-b border-[#183B2B]/8">
              <span className="text-[#1C2520]/65 font-medium block mb-1.5">Owned Equipment:</span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.equipment.map((tool) => (
                  <span key={tool} className="px-2 py-0.5 rounded-md bg-white border border-[#183B2B]/10 text-[11px] text-[#1C2520]/80">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Cuisine Preference */}
            <div className="flex items-center justify-between py-2 border-b border-[#183B2B]/8">
              <span className="text-[#1C2520]/65 font-medium">Cuisine Preference</span>
              <span className="font-semibold text-[#1C2520]">{userProfile.favoriteCuisines.join(', ')}</span>
            </div>

            {/* Health Goal */}
            <div className="flex items-center justify-between py-2 border-b border-[#183B2B]/8">
              <span className="text-[#1C2520]/65 font-medium">Health Goal</span>
              <span className="font-semibold text-[#183B2B]">{userProfile.healthGoal}</span>
            </div>

            {/* Avoided Foods */}
            <div className="flex items-center justify-between py-2">
              <span className="text-[#1C2520]/65 font-medium">Diet Focus</span>
              <span className="font-semibold text-[#1C2520]">{userProfile.foodsToAvoid.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTriggerSearch}
              className="w-full py-3 rounded-2xl bg-[#183B2B] hover:bg-[#132E22] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply & Find Meals Now</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
