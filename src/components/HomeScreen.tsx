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

const OrbitChip = ({ label, className = '' }: { label: string; className?: string }) => (
  <div className={`absolute z-20 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md ${className}`}>
    {label}
  </div>
);

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
    <div className="pb-20">
      <section className="relative mx-auto max-w-7xl px-6 pt-8 md:pt-12">
        <div className="hero-sheen kitchen-grid relative overflow-hidden rounded-[2rem] border border-[#183B2B]/10 bg-[#102D21] px-6 py-8 shadow-[0_32px_90px_rgba(16,45,33,0.22)] sm:px-10 md:py-12 lg:px-14">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#E86C38]/20 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-24 right-12 h-96 w-96 rounded-full bg-[#4BA17B]/18 blur-3xl animate-glow-pulse" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-6 animate-rise-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-2 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#F7A46D] shadow-[0_0_14px_rgba(247,164,109,0.8)] animate-pulse" />
                <span>AI kitchen profile active</span>
                <span className="text-white/35">·</span>
                <span>{userProfile.identity}</span>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#F7A46D]">Your kitchen, understood</p>
                <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  What can I cook
                  <span className="block text-[#F28A54]">right now?</span>
                </h1>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                Tell us what you already have. SavorAI combines your pantry, budget, kitchen tools and food preferences into meals you can realistically make now.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onFindMealsClick}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#F28A54] px-6 py-3.5 text-sm font-bold text-[#102D21] shadow-[0_12px_30px_rgba(232,108,56,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#FF9B66] hover:shadow-[0_16px_36px_rgba(232,108,56,0.32)] active:translate-y-0"
                >
                  <span>Explore what I can cook</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                <button
                  onClick={() => onNavigate('scan')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/14"
                >
                  <span>Scan food photo</span>
                </button>
              </div>

              <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
                {[
                  [`RM${userProfile.typicalBudgetRM}`, 'usual budget'],
                  ['<25 min', 'quick picks'],
                  [`${featuredRecipe.matchScore}%`, 'best match']
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 backdrop-blur-sm">
                    <div className="text-lg font-extrabold text-white">{value}</div>
                    <div className="text-[11px] font-medium text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                onClick={() => onSelectRecipe(featuredRecipe)}
                className="group relative mx-auto aspect-square w-full max-w-[560px] cursor-pointer"
              >
                <div className="absolute inset-[9%] rounded-full border border-white/10" />
                <div className="absolute inset-[20%] rounded-full border border-white/12" />
                <div className="absolute inset-[30%] rounded-full border border-dashed border-white/10" />

                <div className="absolute inset-[18%] rounded-full bg-[#2C7A5B]/30 blur-3xl animate-glow-pulse" />

                <div className="absolute inset-[23%] z-10 overflow-hidden rounded-full border border-white/16 bg-[#163D2D] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-500 group-hover:scale-[1.025] group-hover:shadow-[0_28px_90px_rgba(0,0,0,0.36)] food-shadow">
                  <DishIllustration dishId={featuredRecipe.id} className="h-full w-full" size="hero" />
                </div>

                <div className="absolute left-1/2 top-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_18px_white]" />

                <div className="absolute left-1/2 top-1/2 z-20 animate-orbit-slow">
                  <span className="block rounded-full border border-white/15 bg-[#F28A54] px-3 py-2 text-[10px] font-extrabold text-[#102D21] shadow-lg">CHICKEN</span>
                </div>
                <div className="absolute left-1/2 top-1/2 z-20 animate-orbit-reverse">
                  <span className="block rounded-full border border-white/15 bg-white px-3 py-2 text-[10px] font-extrabold text-[#183B2B] shadow-lg">RICE</span>
                </div>

                <OrbitChip label="EGG" className="left-[6%] top-[26%] animate-float-soft" />
                <OrbitChip label="GARLIC" className="right-[5%] top-[22%] animate-float-soft-alt" />
                <OrbitChip label="SOY SAUCE" className="left-[9%] bottom-[24%] animate-float-soft-alt" />
                <OrbitChip label="GINGER" className="right-[4%] bottom-[22%] animate-float-soft" />

                <div className="absolute right-[2%] top-[43%] z-30 rounded-2xl border border-white/15 bg-white/10 p-3 text-white shadow-xl backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">Pantry match</div>
                  <div className="mt-1 text-2xl font-extrabold">{featuredRecipe.matchScore}%</div>
                </div>

                <div className="absolute bottom-[3%] left-1/2 z-30 w-[82%] -translate-x-1/2 rounded-3xl border border-white/15 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F7A46D]">Top smart recommendation</p>
                      <h3 className="mt-1 text-lg font-bold leading-tight">{featuredRecipe.name}</h3>
                    </div>
                    <span className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold">{featuredRecipe.cuisine}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                    <div><div className="text-sm font-bold">{featuredRecipe.timeMinutes}m</div><div className="text-[9px] text-white/45">TIME</div></div>
                    <div><div className="text-sm font-bold">RM{featuredRecipe.estimatedCostRM.toFixed(2)}</div><div className="text-[9px] text-white/45">COST</div></div>
                    <div><div className="text-sm font-bold">{featuredRecipe.calories}</div><div className="text-[9px] text-white/45">KCAL</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-7 max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { title: 'Scan my fridge', text: 'Turn a fridge photo into meal ideas', action: () => onNavigate('cook'), tone: 'bg-[#DDEDE5]' },
            { title: 'Scan food', text: 'Estimate calories from a photo', action: () => onNavigate('scan'), tone: 'bg-[#FFF0E7]' },
            { title: 'Healthy mode', text: 'Adapt meals to your nutrition goal', action: () => onNavigate('healthy'), tone: 'bg-[#E7F0E8]' },
            { title: 'Quick cook', text: 'Jump to fast meals under 15 minutes', action: () => onNavigate('cook'), tone: 'bg-[#F4EEE4]' }
          ].map((item, index) => (
            <button
              key={item.title}
              onClick={item.action}
              className="group relative overflow-hidden rounded-3xl border border-[#183B2B]/8 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-8 h-12 w-12 rounded-2xl ${item.tone} flex items-center justify-center text-sm font-black text-[#183B2B] transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                0{index + 1}
              </div>
              <div className="text-sm font-bold text-[#183B2B]">{item.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-[#1C2520]/60">{item.text}</div>
              <div className="absolute bottom-4 right-4 text-[#E86C38] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">→</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E86C38]">Personalised kitchen intelligence</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#183B2B] md:text-4xl">Made for you</h2>
            <p className="mt-2 max-w-xl text-sm text-[#1C2520]/65">
              Suggestions tuned for {userProfile.name}'s {userProfile.identity} profile, usual budget and pantry habits.
            </p>
          </div>
          <button
            onClick={onFindMealsClick}
            className="hidden rounded-2xl border border-[#183B2B]/10 bg-white px-4 py-2 text-xs font-bold text-[#183B2B] transition-all hover:-translate-y-0.5 hover:border-[#183B2B]/25 hover:shadow-md sm:block"
          >
            See all recommendations →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
