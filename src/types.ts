export type UserIdentity = 
  | 'Student'
  | 'Family / Household'
  | 'Fitness User'
  | 'Beginner Cook'
  | 'General User'
  | 'I’m not sure yet';

export type CookingSkill = 'Beginner' | 'Intermediate' | 'Confident';

export type HealthPriority = 
  | 'Balanced meals'
  | 'Lower calorie'
  | 'Higher protein'
  | 'Lower sugar'
  | 'Higher fibre';

export interface IngredientItem {
  id: string;
  name: string;
  amount: string;
  have: boolean;
  substitute?: string;
  substituteNote?: string;
  estCostIfMissing?: number; // in RM
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
  whatToLookFor: string;
  tip?: string;
  visualType: 'prep' | 'sear' | 'simmer' | 'sauce' | 'plate';
}

export interface HealthierVariant {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  modifications: string[];
  swaps: {
    original: string;
    replacement: string;
    note: string;
  }[];
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  timeMinutes: number;
  estimatedCostRM: number;
  servings: number;
  difficulty: 'Beginner' | 'Easy' | 'Intermediate';
  calories: number;
  protein: number; // in grams
  carbs: number;
  fat: number;
  fibre: number;
  requiredEquipment: string[];
  ingredients: IngredientItem[];
  matchScore: number; // 0 - 100
  matchReason: string;
  healthierVariant: HealthierVariant;
  steps: CookingStep[];
  badgeText?: string;
  dishCategory: 'rice' | 'noodles' | 'soup' | 'skillet';
}

export interface UserKitchenProfile {
  name: string;
  identity: UserIdentity;
  typicalBudgetRM: number;
  householdSize: number;
  cookingSkill: CookingSkill;
  healthGoal: string;
  dailyCalorieTarget: number;
  currentCaloriesConsumed: number;
  dailyProteinTarget: number;
  currentProteinConsumed: number;
  dailyFibreTarget: number;
  currentFibreConsumed: number;
  healthPriority: HealthPriority;
  aiVoiceEnabled: boolean;
  aiVoicePersona: 'Warm Chef' | 'Crisp Guide' | 'Gentle Coach';
  equipment: string[];
  pantryStaples: string[];
  favoriteCuisines: string[];
  foodsToAvoid: string[];
}

export interface FoodScanItem {
  name: string;
  portion: string;
  calories: number;
  unit: string;
  amount: number;
  factor: number;
}

export interface FoodScanResult {
  mealName: string;
  imageAlt: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodScanItem[];
  disclaimer: string;
}
