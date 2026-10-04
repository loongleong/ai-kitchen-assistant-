import React, { useState } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface SavedScreenProps {
  allRecipes: Recipe[];
  savedRecipeIds: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (recipeId: string) => void;
  onCookCollection: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  allRecipes,
  savedRecipeIds,
  onSelectRecipe,
  onToggleSave,
  onCookCollection
}) => {
  const [activeTab, setActiveTab] = useState<'favourites' | 'recentlyCooked' | 'wantToTry'>('favourites');

  // Filter recipes based on saved ids or curated sets
  const savedRecipes = allRecipes.filter(r => savedRecipeIds.includes(r.id));
  const recentlyCookedRecipes = allRecipes.slice(0, 3);
  const wantToTryRecipes = allRecipes.filter(r => !savedRecipeIds.includes(r.id)).slice(0, 4);

  const currentDisplayList = 
    activeTab === 'favourites' ? (savedRecipes.length > 0 ? savedRecipes : allRecipes.slice(0, 4)) :
    activeTab === 'recentlyCooked' ? recentlyCookedRecipes :
    wantToTryRecipes;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Title & Subtitle Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#183B2B] tracking-tight mb-2">
          Saved Kitchen Recipes
        </h1>
        <p className="text-base text-[#1C2520]/75">
          Your bookmarked kitchen staples, recently cooked dishes, and curated collections.
        </p>
      </div>

      {/* Featured Collection: "Fast meals under RM15" */}
      <div className="bg-gradient-to-r from-[#183B2B] to-[#24523D] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#A7F3D0] bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
              Featured Curated Collection
            </span>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Fast meals under RM15
            </h2>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed">
              Curated for everyday weeknights. Every recipe uses fewer than 7 ingredients and is ready in under 25 minutes.
            </p>

            {/* Collection Stats per brief: 7 recipes, RM9.40 average cost, 530 average kcal */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                <span className="font-bold text-[#A7F3D0]">7</span>
                <span>recipes</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                <span className="font-bold text-[#A7F3D0]">RM9.40</span>
                <span>avg cost</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                <span className="font-bold text-[#A7F3D0]">530</span>
                <span>avg kcal</span>
              </div>
            </div>
          </div>

          <button
            onClick={onCookCollection}
            className="px-6 py-3 rounded-2xl bg-[#E86C38] hover:bg-[#D45924] text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer whitespace-nowrap self-start md:self-center"
          >
            Explore Collection →
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#183B2B]/10 pb-3">
        {[
          { id: 'favourites', label: `Favourites (${savedRecipes.length || 4})` },
          { id: 'recentlyCooked', label: 'Recently cooked (3)' },
          { id: 'wantToTry', label: 'Want to try (4)' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#183B2B] text-white shadow-xs'
                  : 'text-[#1C2520]/70 hover:bg-[#F2EFE8] hover:text-[#183B2B]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDisplayList.map((recipe) => (
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
    </div>
  );
};
