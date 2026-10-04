import React, { useState, useEffect } from 'react';
import { UserKitchenProfile, Recipe } from './types';
import { INITIAL_USER_PROFILE } from './data/initialProfile';
import { RECIPES } from './data/recipes';
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

export default function App() {
  // Screen state
  const [activeScreen, setActiveScreen] = useState<
    'home' | 'cook' | 'recommendations' | 'scan' | 'healthy' | 'saved' | 'profile'
  >('home');

  // Persistent User Kitchen Profile in localStorage
  const [userProfile, setUserProfile] = useState<UserKitchenProfile>(() => {
    try {
      const saved = localStorage.getItem('savorai_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
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
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C2520] flex flex-col font-sans selection:bg-[#EAF2EC] selection:text-[#183B2B]">
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
            onSelectRecipe={(recipe) => setSelectedRecipeDetail(recipe)}
            onNavigate={(screen) => setActiveScreen(screen)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'cook' && (
          <WhatCanICookScreen
            userProfile={userProfile}
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
            onSelectRecipe={(recipe) => setSelectedRecipeDetail(recipe)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
            onBackToCook={() => setActiveScreen('cook')}
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
            onSelectRecipe={(recipe) => setSelectedRecipeDetail(recipe)}
            onCookRecipeHealthier={(recipe) => handleStartCooking(recipe, true)}
            savedRecipeIds={savedRecipeIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {activeScreen === 'saved' && (
          <SavedScreen
            allRecipes={RECIPES}
            savedRecipeIds={savedRecipeIds}
            onSelectRecipe={(recipe) => setSelectedRecipeDetail(recipe)}
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
      <footer className="border-t border-[#183B2B]/8 bg-[#FBF9F5] py-8 text-xs text-[#1C2520]/65">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#183B2B]">SavorAI</span>
            <span>·</span>
            <span>Tell us what you have. We’ll tell you what you can cook.</span>
          </div>

          <div className="flex items-center gap-4 text-[#1C2520]/75">
            <button
              onClick={() => {
                setOnboardingInitialStep(1);
                setOnboardingOpen(true);
              }}
              className="hover:text-[#183B2B] cursor-pointer"
            >
              Replay Onboarding
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setOnboardingInitialStep(2);
                setOnboardingOpen(true);
              }}
              className="hover:text-[#183B2B] cursor-pointer"
            >
              Switch Identity
            </button>
            <span>·</span>
            <span>Default Currency: MYR (RM)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
