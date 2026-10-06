import React, { useState } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { DishIllustration } from './DishIllustration';
import { RecipeCard } from './RecipeCard';
import { DesignHeading } from './DesignUI';

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
    <div className="premium-page design-support healthy-screen max-w-7xl mx-auto px-6 py-8 space-y-10">
      <DesignHeading eyebrow="FEEL GOOD ABOUT WHAT YOU COOK" title="Same comfort. A little lighter." description="Thoughtful ingredient swaps, familiar flavours. Find the balance that feels right for you."/>
      {/* "Make this healthier" Comparison Showcase */}
      <section className="premium-transformation premium-cinematic rounded-3xl p-6 md:p-8 border premium-border shadow-xs">
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-wider premium-accent block mb-1">
            THE COMFORT FOOD EDIT
          </span>
          <h2 className="text-2xl font-bold premium-ink tracking-tight">
            A favourite, reimagined.
          </h2>
          <p className="text-xs md:text-sm premium-muted mt-1">
            Same comfort and culinary satisfaction — with calibrated ingredient and method adjustments.
          </p>
        </div>

        {/* Comparison Split Cards */}
        <div className="premium-transformation-grid grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
          {/* Original Version */}
          <div className="premium-transformation-original p-6 rounded-3xl premium-inset border premium-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold premium-muted uppercase tracking-wider">
                  Original Recipe
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md premium-soft premium-ink font-semibold">
                  Standard Comfort
                </span>
              </div>

              <h3 className="text-xl font-bold premium-ink mb-2">{pastaRecipe.name}</h3>
              <p className="text-xs premium-muted mb-4">{pastaRecipe.tagline}</p>

              <div className="premium-comparison-image"><DishIllustration dishId={pastaRecipe.id} showSteam={false} /></div>
              {/* Energy Metric */}
              <div className="premium-hud p-4 rounded-2xl border premium-border mb-4">
                <span className="text-[11px] premium-muted block">Energy per serving</span>
                <span className="text-3xl font-extrabold premium-ink tabular-nums tracking-tight">
                  {pastaRecipe.calories} <span className="text-xs font-normal premium-muted">kcal</span>
                </span>
              </div>

              {/* Standard Method Ingredients */}
              <details className="premium-ingredient-details"><summary>Standard ingredients</summary><div className="space-y-1.5 text-xs premium-muted">
                <div className="flex items-center gap-2">
                  <span className="premium-faint">•</span>
                  <span>120ml Heavy cooking cream (high saturated fat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="premium-faint">•</span>
                  <span>Refined white semolina pasta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="premium-faint">•</span>
                  <span>2 tbsp cooking butter</span>
                </div>
              </div></details>
            </div>

            <div className="pt-6 mt-6 border-t premium-border text-xs premium-muted">
              Per serving: {pastaRecipe.protein}g protein · {pastaRecipe.carbs}g carbs · {pastaRecipe.fat}g fat
            </div>
          </div>

          {/* Healthier Version */}
          <div className="premium-transformation-healthier p-6 rounded-3xl premium-tint border-2 premium-border flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 premium-solid text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
              SavorAI Smart Swap
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold premium-ink uppercase tracking-wider">
                  Healthier Version
                </span>
              </div>

              <h3 className="text-xl font-bold premium-ink mb-2">
                High-Protein Garlic Chicken Penne
              </h3>
              <p className="text-xs premium-muted mb-4">
                Emulsified Greek yogurt reduction with steamed tender broccoli florets
              </p>

              <div className="premium-comparison-image"><DishIllustration dishId="healthier-chicken-pasta" showSteam={false} /></div>
              {/* Energy Metric Prominent */}
              <div className="premium-hud p-4 rounded-2xl border premium-border mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] premium-muted block">Estimated Energy</span>
                  <span className="text-3xl font-black premium-ink tabular-nums tracking-tight">
                    ≈ {pastaRecipe.healthierVariant.calories} <span className="text-xs font-normal premium-ink">kcal</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold premium-positive premium-tint px-2.5 py-1 rounded-lg">
                    -{pastaRecipe.calories-pastaRecipe.healthierVariant.calories} kcal (-{Math.round(100*(pastaRecipe.calories-pastaRecipe.healthierVariant.calories)/pastaRecipe.calories)}%)
                  </span>
                </div>
              </div>

              {/* Swaps & Method Upgrades */}
              <details className="premium-ingredient-details"><summary>See ingredient swaps</summary><div className="space-y-2 text-xs">
                {pastaRecipe.healthierVariant.swaps.map((swap, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl premium-soft border premium-border">
                    <div className="flex items-center justify-between font-semibold premium-ink mb-0.5">
                      <span>{swap.replacement}</span>
                      <span className="text-[10px] premium-positive">Swap</span>
                    </div>
                    <span className="text-[11px] premium-muted">{swap.note}</span>
                  </div>
                ))}
              </div></details>
            </div>

            <div className="pt-6 mt-6 border-t premium-border flex items-center justify-between">
              <span className="text-xs font-semibold premium-ink">
                +{pastaRecipe.healthierVariant.protein-pastaRecipe.protein}g Protein · +{pastaRecipe.healthierVariant.fibre-pastaRecipe.fibre}g Fibre
              </span>

              <button
                onClick={() => onCookRecipeHealthier(pastaRecipe)}
                className="px-5 py-2.5 rounded-xl premium-solid premium-hover-solid active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Use healthier version</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Nutrition Snapshot Card */}
      <div className="premium-panel rounded-3xl p-6 md:p-8 border premium-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b premium-border mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full premium-solid" />
              <span className="text-xs uppercase font-bold tracking-wider premium-ink">
                Current Health Goal
              </span>
            </div>
            <h2 className="text-xl font-bold premium-ink">{selectedGoal}</h2>
          </div>

          {/* Goal Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 premium-inset rounded-2xl border premium-border">
            {['Balanced calories', 'High protein focus', 'High fibre boost'].map((goal) => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedGoal === goal
                    ? 'premium-solid text-white shadow-xs'
                    : 'premium-muted premium-hover-ink'
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
          <div className="md:col-span-6 premium-tint rounded-2xl p-6 border premium-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold premium-ink uppercase tracking-wider">
                Daily Calorie Snapshot
              </span>
              <span className="text-xs font-semibold premium-ink">
                {calorieProgress}% of target
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-medium premium-ink tracking-tight tabular-nums">
                {userProfile.currentCaloriesConsumed.toLocaleString()}
              </span>
              <span className="text-lg font-bold premium-muted">
                / {userProfile.dailyCalorieTarget.toLocaleString()} kcal
              </span>
            </div>

            <div className="w-full premium-soft h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="premium-solid h-full rounded-full transition-all duration-500"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>

            <span className="text-[11px] premium-muted font-medium">
              {userProfile.dailyCalorieTarget - userProfile.currentCaloriesConsumed} kcal remaining for dinner & evening snacks
            </span>
          </div>

          {/* Protein & Fibre Targets (6 cols) */}
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl premium-inset border premium-border">
              <span className="text-xs font-semibold premium-muted block mb-1">Protein Progress</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-bold premium-ink tabular-nums">
                  {userProfile.currentProteinConsumed}
                </span>
                <span className="text-xs premium-muted">/ {userProfile.dailyProteinTarget}g</span>
              </div>
              <div className="w-full premium-tint h-1.5 rounded-full overflow-hidden mt-2 mb-1">
                <div
                  className="premium-solid h-full rounded-full"
                  style={{ width: `${Math.round((userProfile.currentProteinConsumed / userProfile.dailyProteinTarget) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] premium-positive font-medium">Lean muscle support</span>
            </div>

            <div className="p-5 rounded-2xl premium-inset border premium-border">
              <span className="text-xs font-semibold premium-muted block mb-1">Dietary Fibre</span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-bold premium-ink tabular-nums">
                  {userProfile.currentFibreConsumed}
                </span>
                <span className="text-xs premium-muted">/ {userProfile.dailyFibreTarget}g</span>
              </div>
              <div className="w-full premium-tint h-1.5 rounded-full overflow-hidden mt-2 mb-1">
                <div
                  className="premium-solid h-full rounded-full"
                  style={{ width: `${Math.round((userProfile.currentFibreConsumed / userProfile.dailyFibreTarget) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] premium-muted font-medium">Satiety & gut health</span>
            </div>
          </div>
        </div>
      </div>

      {/* Healthier Recommendations Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold premium-ink tracking-tight">
              Calorie-Conscious Meals Under 500 kcal
            </h2>
            <p className="text-xs premium-muted mt-1">
              Explore the lighter variants in your recipe library.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthierRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              nutritionVariant="healthier"
              pantryKnown={false}
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
