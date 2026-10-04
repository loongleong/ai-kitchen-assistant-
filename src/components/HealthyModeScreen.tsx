import React, { useState } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { DishIllustration } from './DishIllustration';
import { RecipeCard } from './RecipeCard';

interface HealthyModeScreenProps {
  userProfile: UserKitchenProfile;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onCookRecipeHealthier: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
}

export const HealthyModeScreen: React.FC<HealthyModeScreenProps> = ({
  userProfile,
  recipes,
  onSelectRecipe,
  onCookRecipeHealthier,
  savedRecipeIds,
  onToggleSave
}) => {
  const [selectedGoal, setSelectedGoal] = useState(userProfile.healthGoal || 'Balanced calories');
  const [showSwapEffect, setShowSwapEffect] = useState(false);

  // Focus recipe for the "Make this healthier" showcase: Creamy chicken pasta (850 kcal vs 620 kcal)
  const pastaRecipe = recipes.find(r => r.id === 'creamy-chicken-pasta') || recipes[0];

  // Curated healthier meals list
  const healthierRecipes = recipes.filter(r => r.healthierVariant.calories <= 500);

  const calorieProgress = Math.min(100, Math.round((userProfile.currentCaloriesConsumed / userProfile.dailyCalorieTarget) * 100));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Title & Subtitle Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight mb-2">
          Healthy Mode
        </h1>
        <p className="text-base text-[#1C2520]/75 max-w-2xl">
          Adjust meals to your goal without turning food into ‘good’ or ‘bad’.
        </p>
      </div>

      {/* Daily Nutrition Snapshot Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#183B2B]/8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#183B2B]">
                Current Health Goal
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1C2520]">{selectedGoal}</h2>
          </div>

          {/* Goal Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#FBF9F5] rounded-2xl border border-[#183B2B]/8">
            {['Balanced calories', 'High protein focus', 'High fibre boost'].map((goal) => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedGoal === goal
                    ? 'bg-[#183B2B] text-white shadow-xs'
                    : 'text-[#1C2520]/70 hover:text-[#183B2B]'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Metrics: Calories Most Prominent, plus Protein and Fibre */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Daily Calorie Snapshot (6 cols) */}
          <div className="md:col-span-6 bg-[#EAF2EC] rounded-2xl p-6 border border-[#183B2B]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#183B2B] uppercase tracking-wider">
                Daily Calorie Snapshot
              </span>
              <span className="text-xs font-semibold text-[#183B2B]">
                {calorieProgress}% of target
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[#183B2B] tracking-tight tabular-nums">
                {userProfile.currentCaloriesConsumed.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-[#183B2B]/60">
                / {userProfile.dailyCalorieTarget.toLocaleString()} kcal
              </span>
            </div>

            <div className="w-full bg-white/70 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#183B2B] h-full rounded-full transition-all duration-500"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>

            <span className="text-[11px] text-[#1C2520]/70 font-medium">
              {userProfile.dailyCalorieTarget - userProfile.currentCaloriesConsumed} kcal remaining for dinner & evening snacks
            </span>
          </div>

          {/* Protein & Fibre Targets (6 cols) */}
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
              <span className="text-xs font-semibold text-[#1C2520]/60 block mb-1">Protein Progress</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-bold text-[#1C2520] tabular-nums">
                  {userProfile.currentProteinConsumed}
                </span>
                <span className="text-xs text-[#1C2520]/60">/ {userProfile.dailyProteinTarget}g</span>
              </div>
              <div className="w-full bg-[#EAF2EC] h-1.5 rounded-full overflow-hidden mt-2 mb-1">
                <div
                  className="bg-[#10B981] h-full rounded-full"
                  style={{ width: `${Math.round((userProfile.currentProteinConsumed / userProfile.dailyProteinTarget) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#15803D] font-medium">Lean muscle support</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#183B2B]/8">
              <span className="text-xs font-semibold text-[#1C2520]/60 block mb-1">Dietary Fibre</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-bold text-[#1C2520] tabular-nums">
                  {userProfile.currentFibreConsumed}
                </span>
                <span className="text-xs text-[#1C2520]/60">/ {userProfile.dailyFibreTarget}g</span>
              </div>
              <div className="w-full bg-[#EAF2EC] h-1.5 rounded-full overflow-hidden mt-2 mb-1">
                <div
                  className="bg-[#183B2B] h-full rounded-full"
                  style={{ width: `${Math.round((userProfile.currentFibreConsumed / userProfile.dailyFibreTarget) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#183B2B]/70 font-medium">Satiety & gut health</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Make this healthier" Comparison Showcase */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#183B2B]/8 shadow-xs">
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-[#E86C38] block mb-1">
            Featured Intelligent Transformation
          </span>
          <h2 className="text-2xl font-bold text-[#183B2B] tracking-tight">
            “Make this healthier” Comparison
          </h2>
          <p className="text-xs md:text-sm text-[#1C2520]/70 mt-1">
            Same comfort and culinary satisfaction — with calibrated ingredient and method adjustments.
          </p>
        </div>

        {/* Comparison Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
          {/* Original Version */}
          <div className="p-6 rounded-3xl bg-[#FBF9F5] border border-[#183B2B]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1C2520]/60 uppercase tracking-wider">
                  Original Recipe
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-semibold">
                  Standard Comfort
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1C2520] mb-2">{pastaRecipe.name}</h3>
              <p className="text-xs text-[#1C2520]/70 mb-4">{pastaRecipe.tagline}</p>

              {/* Energy Metric */}
              <div className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 mb-4">
                <span className="text-[11px] text-[#1C2520]/60 block">Energy Density</span>
                <span className="text-3xl font-extrabold text-[#1C2520] tabular-nums tracking-tight">
                  850 <span className="text-xs font-normal text-[#1C2520]/70">kcal</span>
                </span>
              </div>

              {/* Standard Method Ingredients */}
              <div className="space-y-1.5 text-xs text-[#1C2520]/75">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>120ml Heavy cooking cream (high saturated fat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Refined white semolina pasta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>2 tbsp cooking butter</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#183B2B]/8 text-xs text-[#1C2520]/60">
              Macro ratio: 38g protein · 82g carbs · 38g fat
            </div>
          </div>

          {/* Healthier Version */}
          <div className="p-6 rounded-3xl bg-[#EAF2EC] border-2 border-[#183B2B] flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 bg-[#183B2B] text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
              SavorAI Smart Swap
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#183B2B] uppercase tracking-wider">
                  Healthier Version
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#183B2B] mb-2">
                High-Protein Garlic Chicken Penne
              </h3>
              <p className="text-xs text-[#183B2B]/80 mb-4">
                Emulsified Greek yogurt reduction with steamed tender broccoli florets
              </p>

              {/* Energy Metric Prominent */}
              <div className="p-4 rounded-2xl bg-white border border-[#183B2B]/15 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#183B2B]/70 block">Estimated Energy</span>
                  <span className="text-3xl font-black text-[#183B2B] tabular-nums tracking-tight">
                    ≈ 620 <span className="text-xs font-normal text-[#183B2B]">kcal</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#15803D] bg-[#EAF2EC] px-2.5 py-1 rounded-lg">
                    -230 kcal (-27%)
                  </span>
                </div>
              </div>

              {/* Swaps & Method Upgrades */}
              <div className="space-y-2 text-xs">
                {pastaRecipe.healthierVariant.swaps.map((swap, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/70 border border-[#183B2B]/10">
                    <div className="flex items-center justify-between font-semibold text-[#183B2B] mb-0.5">
                      <span>{swap.replacement}</span>
                      <span className="text-[10px] text-[#15803D]">Swap</span>
                    </div>
                    <span className="text-[11px] text-[#1C2520]/75">{swap.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#183B2B]/15 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#183B2B]">
                +7g Protein · +4g Fibre
              </span>

              <button
                onClick={() => onCookRecipeHealthier(pastaRecipe)}
                className="px-5 py-2.5 rounded-xl bg-[#183B2B] hover:bg-[#132E22] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Use healthier version</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Healthier Recommendations Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#183B2B] tracking-tight">
              Calorie-Conscious Meals Under 500 kcal
            </h2>
            <p className="text-xs text-[#1C2520]/70 mt-1">
              Nutrient-dense options matching your pantry staples and cooking gear.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthierRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={(id, e) => {
                e.stopPropagation();
                onToggleSave(id);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
