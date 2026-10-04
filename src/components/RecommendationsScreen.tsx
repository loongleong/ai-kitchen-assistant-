import React, { useState, useMemo } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { RecipeCard } from './RecipeCard';
import { CookingQueryFilters } from './WhatCanICookScreen';

interface RecommendationsScreenProps {
  recipes: Recipe[];
  userProfile: UserKitchenProfile;
  activeFilters: CookingQueryFilters | null;
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
  onBackToCook: () => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  recipes,
  userProfile,
  activeFilters,
  onSelectRecipe,
  savedRecipeIds,
  onToggleSave,
  onBackToCook
}) => {
  // Sidebar filter states
  const [selectedCuisine, setSelectedCuisine] = useState<string>(activeFilters?.cuisine || 'All');
  const [maxCost, setMaxCost] = useState<number>(activeFilters?.budgetRM || userProfile.typicalBudgetRM || 15);
  const [maxTime, setMaxTime] = useState<number>(activeFilters?.maxTimeMinutes || 30);
  const [maxCalories, setMaxCalories] = useState<number>(900);
  const [missingFilter, setMissingFilter] = useState<'all' | '0' | '1'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'cost' | 'calories'>('match');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort the 12 recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        // Cuisine filter
        if (selectedCuisine !== 'All' && selectedCuisine !== 'No preference' && r.cuisine.toLowerCase() !== selectedCuisine.toLowerCase()) {
          return false;
        }
        // Max cost
        if (r.estimatedCostRM > maxCost) {
          return false;
        }
        // Max time
        if (maxTime < 90 && r.timeMinutes > maxTime) {
          return false;
        }
        // Max calories
        if (r.calories > maxCalories) {
          return false;
        }
        // Missing ingredients
        const missingCount = r.ingredients.filter(i => !i.have).length;
        if (missingFilter === '0' && missingCount > 0) return false;
        if (missingFilter === '1' && missingCount > 1) return false;

        // Search query
        if (searchQuery.trim() && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cost') return a.estimatedCostRM - b.estimatedCostRM;
        if (sortBy === 'calories') return a.calories - b.calories;
        // Default: matchScore descending
        return b.matchScore - a.matchScore;
      });
  }, [recipes, selectedCuisine, maxCost, maxTime, maxCalories, missingFilter, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToCook}
            className="text-xs font-semibold text-[#183B2B] hover:text-[#E86C38] flex items-center gap-1.5 mb-2 cursor-pointer transition-colors"
          >
            ← Modify Kitchen Inputs
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight">
            {filteredRecipes.length} meals you can cook
          </h1>
          <p className="text-sm text-[#1C2520]/75 mt-1">
            Ranked by what you own, your RM{maxCost} budget and your {userProfile.equipment.length}-piece kitchen setup.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#1C2520]/65 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-[#183B2B]/15 bg-white text-xs font-semibold text-[#183B2B] cursor-pointer focus:outline-none"
          >
            <option value="match">Best match percentage</option>
            <option value="cost">Lowest cost (RM)</option>
            <option value="calories">Lowest calories</option>
          </select>
        </div>
      </div>

      {/* Active Filter Bar (Clean metadata tags with easy reset) */}
      <div className="bg-[#EAF2EC] rounded-2xl p-3.5 mb-8 flex flex-wrap items-center gap-2 border border-[#183B2B]/10">
        <span className="text-xs font-bold text-[#183B2B] mr-1">Active Match Criteria:</span>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-[#183B2B] font-semibold border border-[#183B2B]/10">
          Max RM{maxCost}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-[#183B2B] font-semibold border border-[#183B2B]/10">
          Under {maxTime} min
        </span>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-[#183B2B] font-semibold border border-[#183B2B]/10">
          Chicken + Rice Staples
        </span>
        {activeFilters?.healthyMode && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#183B2B] text-white font-semibold">
            Healthy Mode Active
          </span>
        )}
        <span className="text-xs px-2.5 py-1 rounded-lg bg-white text-[#183B2B] font-semibold border border-[#183B2B]/10">
          {userProfile.identity} tailored
        </span>

        {(selectedCuisine !== 'All' || maxCost < 30 || missingFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedCuisine('All');
              setMaxCost(25);
              setMaxTime(45);
              setMaxCalories(900);
              setMissingFilter('all');
            }}
            className="text-xs text-[#E86C38] font-bold hover:underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters (3.5 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#183B2B]/8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#183B2B]/8">
            <h3 className="font-bold text-sm text-[#183B2B]">Filters</h3>
            <span className="text-xs text-[#1C2520]/60">{filteredRecipes.length} results</span>
          </div>

          {/* Quick Search */}
          <div>
            <label className="text-xs font-semibold text-[#1C2520]/80 block mb-1.5">Search meal name</label>
            <input
              type="text"
              placeholder="e.g. Teriyaki, Ginger, Fried rice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#183B2B]/15 text-xs text-[#1C2520] focus:outline-none focus:border-[#183B2B]"
            />
          </div>

          {/* Cuisine Selector */}
          <div>
            <label className="text-xs font-semibold text-[#1C2520]/80 block mb-2">Cuisine</label>
            <div className="space-y-1">
              {['All', 'Japanese', 'Malaysian', 'Chinese', 'Korean', 'Western', 'Italian'].map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCuisine === cuisine
                      ? 'bg-[#EAF2EC] font-bold text-[#183B2B]'
                      : 'text-[#1C2520]/75 hover:bg-[#F2EFE8]'
                  }`}
                >
                  <span>{cuisine}</span>
                  {selectedCuisine === cuisine && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Max Cost Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C2520]/80">Max Estimated Cost</span>
              <span className="font-bold text-[#183B2B]">RM{maxCost}</span>
            </div>
            <input
              type="range"
              min="6"
              max="25"
              step="1"
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className="w-full h-1.5 bg-[#EAF2EC] rounded-lg appearance-none cursor-pointer accent-[#183B2B]"
            />
            <div className="flex justify-between text-[10px] text-[#1C2520]/50 mt-1">
              <span>RM6</span>
              <span>RM25</span>
            </div>
          </div>

          {/* Max Time Filter */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C2520]/80">Max Prep & Cook Time</span>
              <span className="font-bold text-[#183B2B]">{maxTime >= 90 ? 'Any' : `${maxTime} min`}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 90].map((t) => (
                <button
                  key={t}
                  onClick={() => setMaxTime(t)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                    maxTime === t
                      ? 'bg-[#183B2B] text-white border-[#183B2B]'
                      : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                  }`}
                >
                  {t === 90 ? 'Any' : `<${t}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Calories Cap */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C2520]/80">Max Calories</span>
              <span className="font-bold text-[#183B2B]">{maxCalories >= 900 ? 'Any' : `${maxCalories} kcal`}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[500, 600, 900].map((cal) => (
                <button
                  key={cal}
                  onClick={() => setMaxCalories(cal)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                    maxCalories === cal
                      ? 'bg-[#183B2B] text-white border-[#183B2B]'
                      : 'bg-[#FBF9F5] text-[#1C2520] border-[#183B2B]/10 hover:border-[#183B2B]/30'
                  }`}
                >
                  {cal === 900 ? 'Any' : `<${cal}`}
                </button>
              ))}
            </div>
          </div>

          {/* Missing Ingredients Filter */}
          <div>
            <label className="text-xs font-semibold text-[#1C2520]/80 block mb-2">Missing Ingredients</label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Any (Show all matches)' },
                { id: '0', label: '0 missing (100% in kitchen)' },
                { id: '1', label: 'At most 1 missing item' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMissingFilter(opt.id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    missingFilter === opt.id
                      ? 'bg-[#EAF2EC] font-bold text-[#183B2B]'
                      : 'text-[#1C2520]/75 hover:bg-[#F2EFE8]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {missingFilter === opt.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Result Cards Grid (8.5 cols) */}
        <div className="lg:col-span-9">
          {filteredRecipes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#183B2B]/8">
              <div className="w-12 h-12 rounded-full bg-[#EAF2EC] flex items-center justify-center text-[#183B2B] mx-auto mb-3 text-lg font-bold">
                🍳
              </div>
              <h3 className="text-lg font-bold text-[#183B2B] mb-1">No meals match all strict criteria</h3>
              <p className="text-xs text-[#1C2520]/70 max-w-md mx-auto mb-4">
                Try widening your budget by RM2, or adjusting cooking time to see more recommendations.
              </p>
              <button
                onClick={() => {
                  setSelectedCuisine('All');
                  setMaxCost(25);
                  setMaxTime(90);
                  setMaxCalories(900);
                  setMissingFilter('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#183B2B] text-white text-xs font-semibold hover:bg-[#132E22] transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
