import React, { useState } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { DishIllustration } from './DishIllustration';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onStartCooking: (recipe: Recipe, isHealthierMode: boolean) => void;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  userProfile: UserKitchenProfile;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onStartCooking,
  isSaved,
  onToggleSave,
  userProfile
}) => {
  const [healthierMode, setHealthierMode] = useState(false);
  const [activeSubstituteId, setActiveSubstituteId] = useState<string | null>(null);

  const displayCalories = healthierMode ? recipe.healthierVariant.calories : recipe.calories;
  const displayProtein = healthierMode ? recipe.healthierVariant.protein : recipe.protein;
  const displayCarbs = healthierMode ? recipe.healthierVariant.carbs : recipe.carbs;
  const displayFat = healthierMode ? recipe.healthierVariant.fat : recipe.fat;
  const displayFibre = healthierMode ? recipe.healthierVariant.fibre : recipe.fibre;

  const alreadyHaveIngredients = recipe.ingredients.filter(i => i.have);
  const needToBuyIngredients = recipe.ingredients.filter(i => !i.have);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FBF9F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#183B2B]/10 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#183B2B]/8 bg-white/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#EAF2EC] text-[#183B2B]">
              {recipe.matchScore}% Match
            </span>
            <span className="text-xs text-[#1C2520]/60">·</span>
            <span className="text-xs font-medium text-[#1C2520]/80">{recipe.cuisine}</span>
            <span className="text-xs text-[#1C2520]/60">·</span>
            <span className="text-xs font-medium text-[#1C2520]/80">{recipe.difficulty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(recipe.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-[#E86C38]/15 text-[#E86C38]' 
                  : 'bg-[#F2EFE8] text-[#1C2520] hover:bg-[#EAF2EC] hover:text-[#183B2B]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? '#E86C38' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{isSaved ? 'Saved to Cook' : 'Save Recipe'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F2EFE8] flex items-center justify-center text-[#1C2520]/70 hover:bg-[#183B2B] hover:text-white transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {/* Header Showcase Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <DishIllustration dishId={recipe.id} className="w-full h-full" />
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#183B2B] tracking-tight leading-tight mb-2">
                  {recipe.name}
                </h1>
                <p className="text-sm text-[#1C2520]/75 leading-relaxed mb-4">
                  {recipe.tagline}
                </p>

                {/* Why it matches */}
                <div className="bg-[#EAF2EC] rounded-2xl p-3.5 mb-5 border border-[#183B2B]/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#183B2B] mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#183B2B]" />
                    <span>Why SavorAI matched this for you:</span>
                  </div>
                  <p className="text-xs text-[#1C2520]/80">
                    {recipe.matchReason}
                  </p>
                </div>
              </div>

              {/* Quick specs grid */}
              <div className="grid grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-[#183B2B]/6">
                <div>
                  <span className="text-[11px] text-[#1C2520]/60 block">Prep & Cook</span>
                  <span className="text-sm font-bold text-[#183B2B]">{recipe.timeMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#1C2520]/60 block">Est. Cost</span>
                  <span className="text-sm font-bold text-[#183B2B]">RM{recipe.estimatedCostRM.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#1C2520]/60 block">Servings</span>
                  <span className="text-sm font-bold text-[#183B2B]">{recipe.servings} people</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Section with Prominent Calories and "Make It Healthier" Toggle */}
          <div className="bg-white rounded-3xl p-6 border border-[#183B2B]/8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#183B2B]/6 mb-5">
              <div>
                <h3 className="font-bold text-base text-[#183B2B]">Nutritional Profile</h3>
                <p className="text-xs text-[#1C2520]/65">Per serving breakdown based on standard ingredients</p>
              </div>

              {/* "Make It Healthier" Interactive Switch */}
              <button
                onClick={() => setHealthierMode(!healthierMode)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  healthierMode
                    ? 'bg-[#183B2B] text-white border-[#183B2B] shadow-sm'
                    : 'bg-[#EAF2EC] text-[#183B2B] border-[#183B2B]/20 hover:bg-[#DCEADE]'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
                <span>{healthierMode ? 'Healthier Mode Active' : 'Make it healthier'}</span>
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-white/20">
                  {healthierMode ? `-${recipe.calories - recipe.healthierVariant.calories} kcal` : 'Save kcal'}
                </span>
              </button>
            </div>

            {/* Macros showcase */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              {/* Most Prominent Metric: Calories */}
              <div className="col-span-2 md:col-span-1 bg-[#183B2B] text-white p-4 rounded-2xl flex flex-col justify-between shadow-xs">
                <span className="text-xs text-white/70 font-medium">Energy</span>
                <div className="my-1">
                  <span className="text-3xl font-extrabold tabular-nums tracking-tight">
                    {displayCalories}
                  </span>
                  <span className="text-xs ml-1 text-white/80">kcal</span>
                </div>
                {healthierMode && (
                  <span className="text-[10px] text-[#A7F3D0] font-medium">
                    Reduced from {recipe.calories} kcal
                  </span>
                )}
              </div>

              {/* Protein */}
              <div className="bg-[#F8F6F0] p-4 rounded-2xl flex flex-col justify-between border border-[#183B2B]/6">
                <span className="text-xs text-[#1C2520]/60">Protein</span>
                <span className="text-xl font-bold text-[#1C2520] tabular-nums mt-1">{displayProtein}g</span>
                <span className="text-[10px] text-[#1C2520]/50">30% daily goal</span>
              </div>

              {/* Carbs */}
              <div className="bg-[#F8F6F0] p-4 rounded-2xl flex flex-col justify-between border border-[#183B2B]/6">
                <span className="text-xs text-[#1C2520]/60">Carbohydrates</span>
                <span className="text-xl font-bold text-[#1C2520] tabular-nums mt-1">{displayCarbs}g</span>
                <span className="text-[10px] text-[#1C2520]/50">Clean energy</span>
              </div>

              {/* Fat */}
              <div className="bg-[#F8F6F0] p-4 rounded-2xl flex flex-col justify-between border border-[#183B2B]/6">
                <span className="text-xs text-[#1C2520]/60">Healthy Fats</span>
                <span className="text-xl font-bold text-[#1C2520] tabular-nums mt-1">{displayFat}g</span>
                <span className="text-[10px] text-[#1C2520]/50">{healthierMode ? 'Low fat glaze' : 'Balanced'}</span>
              </div>

              {/* Fibre */}
              <div className="bg-[#F8F6F0] p-4 rounded-2xl flex flex-col justify-between border border-[#183B2B]/6">
                <span className="text-xs text-[#1C2520]/60">Dietary Fibre</span>
                <span className="text-xl font-bold text-[#1C2520] tabular-nums mt-1">{displayFibre}g</span>
                <span className="text-[10px] text-[#15803D]">Gut & satiety</span>
              </div>
            </div>

            {/* Healthier modifications preview when active */}
            {healthierMode && (
              <div className="bg-[#EAF2EC] rounded-2xl p-4 border border-[#183B2B]/15">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#183B2B]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Suggested Healthier Modifications Applied:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#1C2520]/80 pl-6 list-disc">
                  {recipe.healthierVariant.modifications.map((mod, idx) => (
                    <li key={idx}>{mod}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ingredients Section: Split into "You already have" and "Need to buy" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* You already have */}
            <div className="bg-white rounded-3xl p-6 border border-[#183B2B]/8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#183B2B] text-white flex items-center justify-center text-xs">✓</div>
                  <h3 className="font-bold text-sm text-[#183B2B]">You Already Have ({alreadyHaveIngredients.length})</h3>
                </div>
                <span className="text-[11px] text-[#15803D] font-medium bg-[#EAF2EC] px-2 py-0.5 rounded-md">In pantry</span>
              </div>

              <div className="space-y-2.5">
                {alreadyHaveIngredients.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#FBF9F5] border border-[#183B2B]/5">
                    <span className="font-medium text-[#1C2520]">{item.name}</span>
                    <span className="text-[#1C2520]/60 tabular-nums">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need to buy + Substitutes */}
            <div className="bg-white rounded-3xl p-6 border border-[#E86C38]/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E86C38] text-white flex items-center justify-center text-xs">+</div>
                  <h3 className="font-bold text-sm text-[#1C2520]">
                    Need to Buy ({needToBuyIngredients.length})
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#E86C38]">
                  Est. RM{needToBuyIngredients.reduce((acc, curr) => acc + (curr.estCostIfMissing || 0), 0).toFixed(2)}
                </span>
              </div>

              {needToBuyIngredients.length === 0 ? (
                <div className="text-xs text-[#15803D] bg-[#EAF2EC] p-3 rounded-xl">
                  You have everything required for this dish!
                </div>
              ) : (
                <div className="space-y-3">
                  {needToBuyIngredients.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E86C38]/15 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1C2520]">{item.name} ({item.amount})</span>
                        <span className="font-bold text-[#E86C38]">
                          ≈ RM{item.estCostIfMissing?.toFixed(2)}
                        </span>
                      </div>

                      {/* Find substitute button */}
                      {item.substitute && (
                        <div className="pt-2 border-t border-[#E86C38]/10">
                          <button
                            onClick={() => setActiveSubstituteId(activeSubstituteId === item.id ? null : item.id)}
                            className="text-[11px] font-semibold text-[#183B2B] hover:text-[#E86C38] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                              <polyline points="16 6 12 2 8 6"/>
                              <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                            <span>{activeSubstituteId === item.id ? 'Hide substitute' : 'Find substitute'}</span>
                          </button>

                          {activeSubstituteId === item.id && (
                            <div className="mt-2 p-2.5 rounded-lg bg-white border border-[#183B2B]/10 text-xs text-[#1C2520]/80">
                              <span className="font-semibold text-[#183B2B] block mb-0.5">
                                Swap with: {item.substitute}
                              </span>
                              <span className="text-[11px] text-[#1C2520]/70">
                                {item.substituteNote}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Kitchen Equipment Required */}
          <div className="bg-white rounded-3xl p-6 border border-[#183B2B]/8">
            <h3 className="font-bold text-sm text-[#183B2B] mb-3">Kitchen Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.requiredEquipment.map((tool) => {
                const userHasIt = userProfile.equipment.some(e => e.toLowerCase() === tool.toLowerCase());
                return (
                  <div
                    key={tool}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                      userHasIt
                        ? 'bg-[#EAF2EC] text-[#183B2B]'
                        : 'bg-[#F2EFE8] text-[#1C2520]/70'
                    }`}
                  >
                    <span>{userHasIt ? '✓' : '•'}</span>
                    <span>{tool}</span>
                    {userHasIt && <span className="text-[10px] text-[#183B2B]/60">(in your kitchen)</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-6 bg-white border-t border-[#183B2B]/8 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#1C2520]/60 block">Ready to cook?</span>
            <span className="text-sm font-bold text-[#183B2B]">
              Step-by-step guidance with live timers
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#1C2520]/70 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => onStartCooking(recipe, healthierMode)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#183B2B] hover:bg-[#132E22] active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Start Cooking Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
