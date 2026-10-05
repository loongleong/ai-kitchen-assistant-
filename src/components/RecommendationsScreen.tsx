import React, { useMemo, useState } from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { DishIllustration } from './DishIllustration';
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
  const [selectedCuisine, setSelectedCuisine] = useState<string>(activeFilters?.cuisine || 'All');
  const [maxCost, setMaxCost] = useState<number>(activeFilters?.budgetRM || userProfile.typicalBudgetRM || 15);
  const [maxTime, setMaxTime] = useState<number>(activeFilters?.maxTimeMinutes || 30);
  const [maxCalories, setMaxCalories] = useState<number>(900);
  const [missingFilter, setMissingFilter] = useState<'all' | '0' | '1'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'cost' | 'calories'>('match');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        if (
          selectedCuisine !== 'All' &&
          selectedCuisine !== 'No preference' &&
          r.cuisine.toLowerCase() !== selectedCuisine.toLowerCase()
        ) {
          return false;
        }
        if (r.estimatedCostRM > maxCost) return false;
        if (maxTime < 90 && r.timeMinutes > maxTime) return false;
        if (r.calories > maxCalories) return false;

        const missingCount = r.ingredients.filter((i) => !i.have).length;
        if (missingFilter === '0' && missingCount > 0) return false;
        if (missingFilter === '1' && missingCount > 1) return false;

        if (searchQuery.trim() && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cost') return a.estimatedCostRM - b.estimatedCostRM;
        if (sortBy === 'calories') return a.calories - b.calories;
        return b.matchScore - a.matchScore;
      });
  }, [recipes, selectedCuisine, maxCost, maxTime, maxCalories, missingFilter, sortBy, searchQuery]);

  const bestMatch = filteredRecipes[0];
  const otherMatches = filteredRecipes.slice(1);

  const resetFilters = () => {
    setSelectedCuisine('All');
    setMaxCost(25);
    setMaxTime(90);
    setMaxCalories(900);
    setMissingFilter('all');
    setSearchQuery('');
  };

  const metricCard = (label: string, value: React.ReactNode, icon: React.ReactNode) => (
    <div className="glass-panel rounded-[22px] border border-white/16 bg-[#173D2D]/72 px-4 py-3.5 text-white shadow-[0_18px_45px_rgba(5,24,16,0.22)] backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/58">
        <span className="text-[#D9C078]">{icon}</span>
        {label}
      </div>
      <div className="text-[26px] font-semibold leading-none tracking-tight">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:pt-10">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              onClick={onBackToCook}
              className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#183B2B]/72 transition-colors hover:text-[#E86C38]"
            >
              <span>←</span>
              Modify kitchen inputs
            </button>

            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E86C38]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E86C38]" />
              SavorAI match results
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-[-0.04em] text-[#183B2B] md:text-5xl">
              {filteredRecipes.length} meals matched to your kitchen.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1C2520]/68 md:text-base">
              Ranked by what you already own, your RM{maxCost} budget, cooking time and the equipment saved in your {userProfile.identity} profile.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-2xl border border-[#183B2B]/10 bg-white/72 p-2 shadow-sm backdrop-blur md:self-auto">
            <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C2520]/45">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'match' | 'cost' | 'calories')}
              className="rounded-xl bg-[#183B2B] px-3 py-2 text-xs font-semibold text-white outline-none"
            >
              <option value="match">Best match</option>
              <option value="cost">Lowest cost</option>
              <option value="calories">Lowest calories</option>
            </select>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#183B2B]/10 bg-[#EAF2EC] px-3 py-1.5 text-xs font-semibold text-[#183B2B]">
            RM{maxCost} max
          </span>
          <span className="rounded-full border border-[#183B2B]/10 bg-white/72 px-3 py-1.5 text-xs font-medium text-[#183B2B]">
            {maxTime >= 90 ? 'Any cook time' : `Under ${maxTime} min`}
          </span>
          <span className="rounded-full border border-[#183B2B]/10 bg-white/72 px-3 py-1.5 text-xs font-medium text-[#183B2B]">
            {activeFilters?.servings || userProfile.householdSize || 2} servings
          </span>
          <span className="rounded-full border border-[#183B2B]/10 bg-white/72 px-3 py-1.5 text-xs font-medium text-[#183B2B]">
            {userProfile.identity} profile
          </span>
          {activeFilters?.healthyMode && (
            <span className="rounded-full bg-[#183B2B] px-3 py-1.5 text-xs font-semibold text-white">
              Healthy mode
            </span>
          )}
        </div>

        {bestMatch ? (
          <div className="hero-sheen kitchen-grid relative overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_68%_42%,#315B43_0%,#1D4935_33%,#123123_68%,#0B2118_100%)] p-5 text-white shadow-[0_30px_90px_rgba(10,38,25,0.24)] md:p-8">
            <div className="pointer-events-none absolute -left-24 top-[-90px] h-72 w-72 rounded-full bg-[#E86C38]/8 blur-3xl" />
            <div className="pointer-events-none absolute right-[-80px] top-8 h-72 w-72 rounded-full bg-[#D9C078]/8 blur-3xl" />

            <div className="grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="relative z-10 order-2 lg:order-1">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D9C078]/28 bg-[#D9C078]/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F1D999]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F1D999] animate-pulse" />
                  Best match for you
                </div>

                <div className="mb-5 flex items-end gap-3">
                  <span className="text-7xl font-semibold leading-none tracking-[-0.06em] md:text-8xl">
                    {bestMatch.matchScore}
                  </span>
                  <span className="mb-2 text-2xl font-medium text-white/55">%</span>
                </div>

                <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-[-0.035em] md:text-4xl">
                  {bestMatch.name}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/62 md:text-base">
                  {bestMatch.tagline}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/44">Why it matches</div>
                  <div className="space-y-2.5 text-sm text-white/78">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9C078]/16 text-[11px] text-[#F1D999]">✓</span>
                      <span>{bestMatch.matchReason.split('·')[0] || 'Strong pantry compatibility'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9C078]/16 text-[11px] text-[#F1D999]">✓</span>
                      <span>RM{Math.max(0, maxCost - bestMatch.estimatedCostRM).toFixed(2)} under your current budget</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9C078]/16 text-[11px] text-[#F1D999]">✓</span>
                      <span>Fits your saved kitchen equipment and cooking profile</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectRecipe(bestMatch)}
                    className="group inline-flex items-center gap-3 rounded-2xl bg-[#E86C38] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(232,108,56,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#F07B49] hover:shadow-[0_18px_36px_rgba(232,108,56,0.3)] active:translate-y-0"
                  >
                    View recipe
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>

                  <button
                    onClick={() => onToggleSave(bestMatch.id)}
                    className="rounded-2xl border border-white/14 bg-white/7 px-5 py-3.5 text-sm font-semibold text-white/78 backdrop-blur transition-all hover:bg-white/12 hover:text-white"
                  >
                    {savedRecipeIds.includes(bestMatch.id) ? 'Saved' : 'Save for later'}
                  </button>
                </div>
              </div>

              <div className="relative order-1 min-h-[430px] lg:order-2 lg:min-h-[520px]">
                <div className="animate-glow-pulse absolute inset-[14%] rounded-full bg-[#D9C078]/14 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="food-shadow animate-float-soft relative h-[330px] w-full max-w-[560px] overflow-hidden rounded-[34px] border border-white/8 bg-black/12 shadow-[0_30px_60px_rgba(0,0,0,0.22)] md:h-[390px]">
                    <DishIllustration dishId={bestMatch.id} className="h-full w-full scale-[1.06]" size="hero" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(8,27,19,0.48)_100%)]" />
                  </div>
                </div>

                <div className="absolute left-0 top-5 hidden w-44 md:block">
                  {metricCard('Calories', <>{bestMatch.calories}<span className="ml-1 text-xs font-medium text-white/52">kcal</span></>, '◒')}
                </div>
                <div className="absolute right-1 top-2 hidden w-48 md:block">
                  {metricCard('Pantry match', <>{bestMatch.matchScore}<span className="ml-1 text-base text-white/55">%</span></>, '✦')}
                </div>
                <div className="absolute bottom-8 left-3 hidden w-44 md:block">
                  {metricCard('Estimated cost', <><span className="mr-1 text-sm font-medium text-white/55">RM</span>{bestMatch.estimatedCostRM.toFixed(2)}</>, '▣')}
                </div>
                <div className="absolute bottom-2 right-0 hidden w-44 md:block">
                  {metricCard('Cook time', <>{bestMatch.timeMinutes}<span className="ml-1 text-xs font-medium text-white/55">min</span></>, '◷')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] border border-[#183B2B]/10 bg-white/82 p-12 text-center shadow-sm backdrop-blur">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF2EC] text-lg text-[#183B2B]">×</div>
            <h3 className="text-xl font-bold text-[#183B2B]">No meals match all of those filters</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#1C2520]/62">
              Widen the budget, cooking time or missing-ingredient allowance to let SavorAI explore more options.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 rounded-2xl bg-[#183B2B] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#102E21]"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="sticky top-24 space-y-5 rounded-[26px] border border-[#183B2B]/8 bg-white/72 p-5 shadow-[0_12px_36px_rgba(24,59,43,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#183B2B]/8 pb-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1C2520]/42">Refine</div>
                <h3 className="mt-1 text-base font-bold text-[#183B2B]">Your matches</h3>
              </div>
              <span className="rounded-full bg-[#EAF2EC] px-2.5 py-1 text-[11px] font-semibold text-[#183B2B]">{filteredRecipes.length}</span>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#1C2520]/58">Search</label>
              <input
                type="text"
                placeholder="Meal name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#183B2B]/10 bg-[#FBF9F5] px-3 py-2.5 text-xs outline-none transition-colors focus:border-[#183B2B]/35"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-[#1C2520]/58">Cuisine</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Japanese', 'Malaysian', 'Chinese', 'Korean', 'Western', 'Italian'].map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                      selectedCuisine === cuisine
                        ? 'bg-[#183B2B] text-white'
                        : 'border border-[#183B2B]/8 bg-[#FBF9F5] text-[#1C2520]/65 hover:border-[#183B2B]/25'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#1C2520]/58">Max cost</span>
                <span className="font-bold text-[#183B2B]">RM{maxCost}</span>
              </div>
              <input
                type="range"
                min="6"
                max="25"
                step="1"
                value={maxCost}
                onChange={(e) => setMaxCost(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#EAF2EC] accent-[#183B2B]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#1C2520]/58">Cook time</span>
                <span className="font-bold text-[#183B2B]">{maxTime >= 90 ? 'Any' : `${maxTime} min`}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[15, 30, 90].map((time) => (
                  <button
                    key={time}
                    onClick={() => setMaxTime(time)}
                    className={`rounded-xl py-2 text-[11px] font-semibold ${
                      maxTime === time ? 'bg-[#183B2B] text-white' : 'border border-[#183B2B]/8 bg-[#FBF9F5] text-[#1C2520]/62'
                    }`}
                  >
                    {time === 90 ? 'Any' : `${time}m`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#1C2520]/58">Calories</span>
                <span className="font-bold text-[#183B2B]">{maxCalories >= 900 ? 'Any' : `${maxCalories}`}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[500, 600, 900].map((calories) => (
                  <button
                    key={calories}
                    onClick={() => setMaxCalories(calories)}
                    className={`rounded-xl py-2 text-[11px] font-semibold ${
                      maxCalories === calories ? 'bg-[#183B2B] text-white' : 'border border-[#183B2B]/8 bg-[#FBF9F5] text-[#1C2520]/62'
                    }`}
                  >
                    {calories === 900 ? 'Any' : calories}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold text-[#1C2520]/58">Missing ingredients</label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Any amount' },
                  { id: '0', label: 'Nothing missing' },
                  { id: '1', label: 'At most 1 item' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setMissingFilter(option.id as 'all' | '0' | '1')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] font-medium transition-all ${
                      missingFilter === option.id
                        ? 'bg-[#EAF2EC] font-semibold text-[#183B2B]'
                        : 'text-[#1C2520]/62 hover:bg-[#FBF9F5]'
                    }`}
                  >
                    {option.label}
                    {missingFilter === option.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full rounded-xl border border-[#183B2B]/10 py-2.5 text-[11px] font-semibold text-[#183B2B] transition-colors hover:bg-[#EAF2EC]"
            >
              Reset filters
            </button>
          </aside>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E86C38]">More great matches</div>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#183B2B]">Options worth cooking next</h3>
              </div>
              <span className="text-xs text-[#1C2520]/48">{otherMatches.length} alternatives</span>
            </div>

            {otherMatches.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {otherMatches.map((recipe) => {
                  const missingCount = recipe.ingredients.filter((ingredient) => !ingredient.have).length;
                  const isSaved = savedRecipeIds.includes(recipe.id);

                  return (
                    <article
                      key={recipe.id}
                      onClick={() => onSelectRecipe(recipe)}
                      className="group cursor-pointer overflow-hidden rounded-[26px] border border-[#183B2B]/8 bg-white/82 shadow-[0_12px_35px_rgba(24,59,43,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#183B2B]/16 hover:shadow-[0_24px_55px_rgba(24,59,43,0.12)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#183B2B]">
                        <DishIllustration dishId={recipe.id} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.035]" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(10,31,21,0.68)_100%)]" />

                        <div className="absolute left-3 top-3 rounded-full border border-white/16 bg-[#173D2D]/76 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                          {recipe.matchScore}% match
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(recipe.id);
                          }}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-[#173D2D]/70 text-sm text-white backdrop-blur-md transition-all hover:bg-[#E86C38]"
                          aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
                        >
                          {isSaved ? '♥' : '♡'}
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                          <span className="rounded-full bg-black/28 px-2.5 py-1 text-[10px] font-semibold text-white/88 backdrop-blur-sm">
                            {recipe.cuisine} · {recipe.difficulty}
                          </span>
                          <span className="text-[10px] font-medium text-white/74">
                            {missingCount === 0 ? 'Pantry ready' : `${missingCount} missing`}
                          </span>
                        </div>
                      </div>

                      <div className="p-4.5 p-5">
                        <h4 className="text-lg font-bold leading-snug tracking-[-0.02em] text-[#183B2B] transition-colors group-hover:text-[#E86C38]">
                          {recipe.name}
                        </h4>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#1C2520]/56">
                          {recipe.tagline}
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#183B2B]/7 pt-4">
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1C2520]/38">Cost</div>
                            <div className="mt-1 text-sm font-bold text-[#183B2B]">RM{recipe.estimatedCostRM.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1C2520]/38">Time</div>
                            <div className="mt-1 text-sm font-bold text-[#183B2B]">{recipe.timeMinutes} min</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1C2520]/38">Calories</div>
                            <div className="mt-1 text-sm font-bold text-[#183B2B]">{recipe.calories}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#1C2520]/46">{recipe.servings} servings</span>
                          <span className="text-xs font-bold text-[#183B2B] transition-transform group-hover:translate-x-1">View recipe →</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : bestMatch ? (
              <div className="rounded-[26px] border border-dashed border-[#183B2B]/14 bg-white/42 p-10 text-center text-sm text-[#1C2520]/52">
                Your best match is the only recipe that currently fits every active filter.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
