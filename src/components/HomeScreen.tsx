import React from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { DishIllustration } from './DishIllustration';
import { RecipeCard } from './RecipeCard';

interface HomeScreenProps {
  userProfile: UserKitchenProfile;
  featuredRecipe: Recipe;
  madeForYouRecipes: Recipe[];
  onFindMealsClick: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (screen: 'cook' | 'scan' | 'healthy' | 'saved' | 'profile') => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  featuredRecipe,
  madeForYouRecipes,
  onFindMealsClick,
  onSelectRecipe,
  onNavigate,
  savedRecipeIds,
  onToggleSave
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-8 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Identity context indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2EC] border border-[#183B2B]/12 text-xs font-semibold text-[#183B2B]">
              <span className="w-2 h-2 rounded-full bg-[#183B2B] animate-pulse" />
              <span>Tailored for {userProfile.identity}</span>
              <span className="text-[#183B2B]/40">·</span>
              <span>Under RM{userProfile.typicalBudgetRM}/meal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#183B2B] tracking-tight leading-[1.08] text-balance">
              What can I cook <br className="hidden sm:inline" />
              <span className="text-[#E86C38]">right now?</span>
            </h1>

            <p className="text-base sm:text-lg text-[#1C2520]/80 max-w-xl leading-relaxed">
              Tell us what you have. We’ll match your budget, kitchen tools and food preferences — no grocery waste, no missing pantry ingredients.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onFindMealsClick}
                className="px-7 py-3.5 rounded-2xl bg-[#183B2B] hover:bg-[#132E22] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5"
              >
                <span>Find my meals</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <button
                onClick={() => onNavigate('scan')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#EAF2EC] text-[#183B2B] font-semibold text-sm border border-[#183B2B]/15 transition-all cursor-pointer flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Scan food photo</span>
              </button>
            </div>

            {/* Quick Proof Metrics adjacent to claim */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#1C2520]/70">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#183B2B]">RM15</span>
                <span>Max Target</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#183B2B]">&lt;25m</span>
                <span>Avg Cook Time</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#183B2B]">94%+</span>
                <span>Pantry Match</span>
              </div>
            </div>
          </div>

          {/* Right Column: Smart Recommendation Preview Card */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => onSelectRecipe(featuredRecipe)}
              className="group relative bg-white rounded-3xl p-5 border border-[#183B2B]/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#183B2B] bg-[#EAF2EC] px-3 py-1 rounded-full border border-[#183B2B]/10">
                  Top Smart Recommendation
                </span>
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                  {featuredRecipe.matchScore}% Match
                </span>
              </div>

              {/* Visual Showcase */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm">
                <DishIllustration dishId={featuredRecipe.id} className="w-full h-full" size="hero" />
                <div className="absolute bottom-2.5 left-3 bg-black/50 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg">
                  {featuredRecipe.cuisine} · {featuredRecipe.difficulty}
                </div>
              </div>

              {/* Recipe Name & Value */}
              <div>
                <h3 className="text-xl font-bold text-[#183B2B] group-hover:text-[#E86C38] transition-colors mb-1">
                  {featuredRecipe.name}
                </h3>
                <p className="text-xs text-[#1C2520]/75 line-clamp-1 mb-3">
                  {featuredRecipe.tagline}
                </p>

                {/* Match explanation callout */}
                <div className="bg-[#F8F6F0] rounded-xl p-2.5 mb-4 border border-[#183B2B]/6 text-xs text-[#1C2520]/85 flex items-center justify-between">
                  <span className="font-semibold text-[#183B2B]">
                    “You already have 6/7 ingredients”
                  </span>
                  <span className="text-[11px] text-[#1C2520]/60">1-pan cleanup</span>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-[#183B2B]/8 text-center">
                  <div>
                    <span className="text-[10px] text-[#1C2520]/60 block">Cook Time</span>
                    <span className="text-sm font-bold text-[#1C2520]">{featuredRecipe.timeMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#1C2520]/60 block">Est. Cost</span>
                    <span className="text-sm font-bold text-[#183B2B]">RM{featuredRecipe.estimatedCostRM.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#1C2520]/60 block">Energy</span>
                    <span className="text-sm font-bold text-[#183B2B]">{featuredRecipe.calories} kcal</span>
                  </div>
                </div>

                <button className="w-full mt-3 py-2.5 rounded-xl bg-[#183B2B] group-hover:bg-[#132E22] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                  <span>View Recipe & Cook</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Row */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('cook')}
            className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 hover:border-[#183B2B]/25 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-[#183B2B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <h4 className="font-bold text-sm text-[#183B2B] mb-0.5">Scan my fridge</h4>
            <p className="text-xs text-[#1C2520]/65">Check ingredients & pantry</p>
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 hover:border-[#183B2B]/25 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF3ED] text-[#E86C38] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <h4 className="font-bold text-sm text-[#183B2B] mb-0.5">Scan food</h4>
            <p className="text-xs text-[#1C2520]/65">Estimate photo calories</p>
          </button>

          <button
            onClick={() => onNavigate('healthy')}
            className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 hover:border-[#183B2B]/25 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-[#183B2B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <h4 className="font-bold text-sm text-[#183B2B] mb-0.5">Healthy mode</h4>
            <p className="text-xs text-[#1C2520]/65">Goal-based nutrition swaps</p>
          </button>

          <button
            onClick={() => onNavigate('cook')}
            className="p-4 rounded-2xl bg-white border border-[#183B2B]/8 hover:border-[#183B2B]/25 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-[#183B2B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h4 className="font-bold text-sm text-[#183B2B] mb-0.5">Quick cook</h4>
            <p className="text-xs text-[#1C2520]/65">Under 15 minutes meals</p>
          </button>
        </div>
      </section>

      {/* "Made for you" Recipe Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#183B2B] tracking-tight">
              Made for you
            </h2>
            <p className="text-xs md:text-sm text-[#1C2520]/70 mt-1">
              Personalised for {userProfile.name} based on your {userProfile.identity} profile & pantry staples.
            </p>
          </div>

          <button
            onClick={onFindMealsClick}
            className="text-xs font-bold text-[#183B2B] hover:text-[#E86C38] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>See all 12 recommendations</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {madeForYouRecipes.map((recipe) => (
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
