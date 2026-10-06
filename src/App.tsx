import React, { useState, useEffect, useMemo } from 'react';
import { UserKitchenProfile, Recipe } from './types';
import { INITIAL_USER_PROFILE } from './data/initialProfile';
import { LOCAL_RECIPE_CATALOG } from './lib/recipeRepository';
import { RecipeDataContext, type RecipeData } from './components/RecipeDataContext';
import { INGREDIENT_PRICES } from './lib/pricing';
import { normalizeEquipment } from './data/equipmentCatalog';
import { normalizeCuisine } from './data/cuisineCatalog';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { WhatCanICookScreen, CookingQueryFilters } from './components/WhatCanICookScreen';
import { RecommendationsScreen } from './components/RecommendationsScreen';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookingModeModal } from './components/CookingModeModal';
import { ScanFoodScreen } from './components/ScanFoodScreen';
import { HealthyModeScreen } from './components/HealthyModeScreen';
import { SavedScreen } from './components/SavedScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { createCookingDraft } from './lib/cookingFlow';

const DEFAULT_RECIPE_DATA:RecipeData = {recipes:LOCAL_RECIPE_CATALOG,prices:INGREDIENT_PRICES};
export default function App({recipeData=DEFAULT_RECIPE_DATA}:{recipeData?:RecipeData} = {}) {
  const RECIPES = useMemo(()=>[...recipeData.recipes],[recipeData.recipes]);
  // Screen state
  const [activeScreen, setActiveScreen] = useState<
    'home' | 'cook' | 'recommendations' | 'scan' | 'healthy' | 'saved' | 'profile'
  >('home');

  // Persistent User Kitchen Profile in localStorage
  const [userProfile, setUserProfile] = useState<UserKitchenProfile>(() => {
    try {
      const saved = localStorage.getItem('savorai_user_profile');
      const profile = saved ? {...INITIAL_USER_PROFILE,...JSON.parse(saved)} : INITIAL_USER_PROFILE;
      return {...profile,equipment:normalizeEquipment(profile.equipment),favoriteCuisines:[...new Set(profile.favoriteCuisines.map(normalizeCuisine))]};
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('savorai_user_profile', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  // Saved Recipe IDs in localStorage
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('savorai_saved_recipes');
      return saved ? JSON.parse(saved) : ['teriyaki-chicken-bowl', 'ginger-chicken-rice-bowl', 'air-fryer-turmeric-chicken'];
    } catch {
      return ['teriyaki-chicken-bowl', 'ginger-chicken-rice-bowl', 'air-fryer-turmeric-chicken'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('savorai_saved_recipes', JSON.stringify(savedRecipeIds));
    } catch {
      // ignore
    }
  }, [savedRecipeIds]);

  // Modal states
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);
  const [cookingModeState, setCookingModeState] = useState<{
    active: boolean;
    recipe: Recipe;
    isHealthierMode: boolean;
  } | null>(null);

  // Onboarding Modal state
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState(1);

  // Active query filters passed from "What Can I Cook" to "Recommendations"
  const [activeCookingFilters, setActiveCookingFilters] = useState<CookingQueryFilters | null>(null);
  // The draft survives screen changes, including the optional refinement checkpoint.
  const [cookingDraft, setCookingDraft] = useState(() => createCookingDraft(userProfile));
  const [recipeQueryContext, setRecipeQueryContext] = useState<CookingQueryFilters | null>(null);
  useEffect(() => {
    if (activeScreen === 'cook' || activeScreen === 'recommendations') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeScreen, cookingDraft.phase, cookingDraft.step]);
  const handleSelectRecipe = (recipe: Recipe, context: CookingQueryFilters | null = null) => {
    setRecipeQueryContext(context);
    setSelectedRecipeDetail(recipe);
  };

  // Toggle recipe bookmark
  const handleToggleSave = (recipeId: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  // Launch cooking mode
  const handleStartCooking = (recipe: Recipe, isHealthierMode: boolean) => {
    setSelectedRecipeDetail(null);
    setCookingModeState({
      active: true,
      recipe,
      isHealthierMode
    });
  };

  // Handle Find Meals from What Can I Cook
  const handleFindMeals = (filters: CookingQueryFilters) => {
    setActiveCookingFilters(filters);
    setActiveScreen('recommendations');
  };

  const rememberResultInputs = (filters: CookingQueryFilters | null, refine = false) => {
    if (filters?.stage) setCookingDraft(prev => ({
      ...prev, ...(refine ? { phase: 'refine' as const, step: 1 } : {}),
      filters: { ...prev.filters, cuisine: filters.cuisine, budgetRM: filters.budgetRM,
        servings: filters.servings, equipment: [...filters.equipment],
        ...(filters.stage === 'refined' ? { ingredients: [...filters.ingredients], maxTimeMinutes: filters.maxTimeMinutes, healthyMode: filters.healthyMode, healthPriority: filters.healthPriority }
          : filters.maxTimeMinutes < 90 ? { maxTimeMinutes: filters.maxTimeMinutes } : {}) }
    }));
    setActiveScreen('cook');
  };

  // Update profile handler
  const handleUpdateProfile = (updated: Partial<UserKitchenProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Daily log calorie update from Food Scan
  const handleSaveToDailyLog = (calories: number, protein: number) => {
    setUserProfile((prev) => ({
      ...prev,
      currentCaloriesConsumed: prev.currentCaloriesConsumed + calories,
      currentProteinConsumed: prev.currentProteinConsumed + protein
    }));
  };

  // Dynamic ranking based on user identity
  // If identity is Fitness User, sort by protein density; if Student, sort by lowest cost; etc.
  const featuredRecipe = RECIPES.find((r) => r.id === 'ginger-chicken-rice-bowl') || RECIPES[0];
  const madeForYouRecipes = userProfile.identity === 'Student'
    ? RECIPES.filter((r) => r.estimatedCostRM <= 12).slice(0, 3)
    : userProfile.identity === 'Fitness User'
    ? RECIPES.filter((r) => r.protein >= 35).slice(0, 3)
    : RECIPES.slice(0, 3);

  return (
    <RecipeDataContext.Provider value={recipeData}>
    <div className="savor-design premium-app premium-theme min-h-screen premium-ink flex flex-col font-sans selection:bg-[#EAF2EC] selection:text-[#183B2B]">
      {/* Top Navigation Bar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        userProfile={userProfile}
        onOpenOnboarding={() => {
          setOnboardingInitialStep(1);
          setOnboardingOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeScreen === 'home' && (
          <HomeScreen
            userProfile={userProfile}
            featuredRecipe={featuredRecipe}
            madeForYouRecipes={madeForYouRecipes}
            onFindMealsClick={() => setActiveScreen('cook')}
            onSelectRecipe={(recipe) => handleSelectRecipe(recipe)}
            onNavigate={(screen) => setActiveScreen(screen)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'cook' && (
          <WhatCanICookScreen
            userProfile={userProfile}
            draft={cookingDraft}
            onDraftChange={setCookingDraft}
            onReturnToResults={() => setActiveScreen('recommendations')}
            onBackHome={() => setActiveScreen('home')}
            onFindMeals={handleFindMeals}
            onUpdateProfile={handleUpdateProfile}
            onOpenIdentitySwitch={() => {
              setOnboardingInitialStep(2);
              setOnboardingOpen(true);
            }}
          />
        )}

        {activeScreen === 'recommendations' && (
          <RecommendationsScreen
            recipes={RECIPES}
            userProfile={userProfile}
            activeFilters={activeCookingFilters}
            onSelectRecipe={(recipe, context) => handleSelectRecipe(recipe, context)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
            onBackToCook={filters => rememberResultInputs(filters)}
            onRefine={filters => rememberResultInputs(filters, true)}
          />
        )}

        {activeScreen === 'scan' && (
          <ScanFoodScreen
            userProfile={userProfile}
            onSaveToDailyLog={handleSaveToDailyLog}
          />
        )}

        {activeScreen === 'healthy' && (
          <HealthyModeScreen
            userProfile={userProfile}
            recipes={RECIPES}
            onSelectRecipe={(recipe) => handleSelectRecipe(recipe)}
            onCookRecipeHealthier={(recipe) => handleStartCooking(recipe, true)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'saved' && (
          <SavedScreen
            allRecipes={RECIPES}
            savedRecipeIds={savedRecipeIds}
            onSelectRecipe={(recipe) => handleSelectRecipe(recipe)}
            onToggleSave={handleToggleSave}
            onCookCollection={() => {
              setActiveCookingFilters({
                cuisine: 'No preference',
                budgetRM: 15,
                servings: 2,
                ingredients: userProfile.pantryStaples,
                equipment: userProfile.equipment,
                maxTimeMinutes: 25,
                healthyMode: false,
                healthPriority: 'Balanced meals'
              });
              setActiveScreen('recommendations');
            }}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenIdentityModal={() => {
              setOnboardingInitialStep(2);
              setOnboardingOpen(true);
            }}
          />
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipeDetail && (
        <RecipeDetailModal
          recipe={selectedRecipeDetail}
          onClose={() => setSelectedRecipeDetail(null)}
          onStartCooking={handleStartCooking}
          isSaved={savedRecipeIds.includes(selectedRecipeDetail.id)}
          onToggleSave={handleToggleSave}
          userProfile={userProfile}
          queryContext={recipeQueryContext}
        />
      )}

      {/* Cooking Mode Distraction-Free Full-Screen Interface */}
      {cookingModeState && (
        <CookingModeModal
          recipe={cookingModeState.recipe}
          isHealthierMode={cookingModeState.isHealthierMode}
          onExit={() => setCookingModeState(null)}
        />
      )}

      {/* Onboarding & Identity Flow Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        userProfile={userProfile}
        onComplete={(updated) => setUserProfile(updated)}
        initialStep={onboardingInitialStep}
      />

      {/* Quiet, Human-Designed Footer */}
      <footer className="premium-footer border-t premium-border premium-inset py-8 text-xs premium-muted">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold premium-ink">SavorAI</span>
            <span>·</span>
            <span>Tell us what you have. We’ll tell you what you can cook.</span>
          </div>

          <div className="flex items-center gap-4 premium-muted">
            <button
              onClick={() => {
                setOnboardingInitialStep(1);
                setOnboardingOpen(true);
              }}
              className="premium-hover-ink cursor-pointer"
            >
              Replay Onboarding
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setOnboardingInitialStep(2);
                setOnboardingOpen(true);
              }}
              className="premium-hover-ink cursor-pointer"
            >
              Switch Identity
            </button>
            <span>·</span>
            <span>Default Currency: MYR (RM)</span>
          </div>
        </div>
      </footer>
    </div>
    </RecipeDataContext.Provider>
  );
}
