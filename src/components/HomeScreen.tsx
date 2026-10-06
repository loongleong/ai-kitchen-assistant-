import React from 'react';
import { Recipe, UserKitchenProfile } from '../types';
import { HomeHero } from './HomeHero';
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
    <div className="design-page pb-20">
      <HomeHero
        userProfile={userProfile}
        featuredRecipe={featuredRecipe}
        onFindMealsClick={onFindMealsClick}
        onSelectRecipe={onSelectRecipe}
        onScanClick={() => onNavigate('scan')}
        onHealthyClick={() => onNavigate('healthy')}
      />

      <section className="mx-auto mt-7 max-w-7xl px-6">
        <div className="premium-home-shortcuts grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { title: 'Plan from your pantry', text: 'Add ingredients to explore meal ideas', action: () => onNavigate('cook'), tone: 'premium-tint' },
            { title: 'Scan food', text: 'Explore sample plates and portion estimates', action: () => onNavigate('scan'), tone: 'premium-warm' },
            { title: 'Healthy mode', text: 'Adapt meals to your nutrition goal', action: () => onNavigate('healthy'), tone: 'premium-tint' },
            { title: 'Explore meals', text: 'Find meals for your budget and tools', action: () => onNavigate('cook'), tone: 'premium-tint' }
          ].map((item, index) => (
            <button
              key={item.title}
              onClick={item.action}
              className="group relative overflow-hidden rounded-3xl border premium-border premium-surface p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`mb-8 h-12 w-12 rounded-2xl ${item.tone} flex items-center justify-center text-sm font-black premium-ink transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                0{index + 1}
              </div>
              <div className="text-sm font-bold premium-ink">{item.title}</div>
              <div className="mt-1 text-xs leading-relaxed premium-muted">{item.text}</div>
              <div className="absolute bottom-4 right-4 premium-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">→</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] premium-accent">Personalised kitchen intelligence</p>
            <h2 className="text-3xl font-extrabold tracking-tight premium-ink md:text-4xl">Made for you</h2>
            <p className="mt-2 max-w-xl text-sm premium-muted">
              Suggestions tuned for {userProfile.name}'s {userProfile.identity} profile, usual budget and pantry habits.
            </p>
          </div>
          <button
            onClick={onFindMealsClick}
            className="hidden rounded-2xl border premium-border premium-surface px-4 py-2 text-xs font-bold premium-ink transition-all hover:-translate-y-0.5 premium-hover-border hover:shadow-md sm:block"
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
