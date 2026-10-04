import { UserKitchenProfile, UserIdentity } from '../types';

export const INITIAL_USER_PROFILE: UserKitchenProfile = {
  name: 'Alex',
  identity: 'Student',
  typicalBudgetRM: 15,
  householdSize: 2,
  cookingSkill: 'Beginner',
  healthGoal: 'Balanced calories',
  dailyCalorieTarget: 1800,
  currentCaloriesConsumed: 1240,
  dailyProteinTarget: 95,
  currentProteinConsumed: 68,
  dailyFibreTarget: 28,
  currentFibreConsumed: 18,
  healthPriority: 'Balanced meals',
  aiVoiceEnabled: true,
  aiVoicePersona: 'Warm Chef',
  equipment: ['Stove', 'Frying pan', 'Rice cooker', 'Knife', 'Pot'],
  pantryStaples: [
    'Chicken breast',
    'Eggs',
    'Rice',
    'Tomato',
    'Garlic',
    'Soy sauce',
    'Cooking oil'
  ],
  favoriteCuisines: ['Malaysian', 'Japanese', 'Chinese'],
  foodsToAvoid: ['Pork-free']
};

export interface IdentityInfo {
  id: UserIdentity;
  title: string;
  tagline: string;
  recommendationFocus: string;
  defaultBudget: number;
  highlightKey: string;
  description: string;
}

export const IDENTITIES_DATA: IdentityInfo[] = [
  {
    id: 'Student',
    title: 'Student',
    tagline: 'Cheaper, quicker, fewer ingredients',
    recommendationFocus: 'Minimises total grocery spend, uses basic dorm tools (rice cooker, 1 pan), under 25 min.',
    defaultBudget: 12,
    highlightKey: 'Budget & Convenience',
    description: 'Prioritises recipes with common pantry overlaps, RM8–RM15 cost per meal, and minimal washing up.'
  },
  {
    id: 'Family / Household',
    title: 'Family / Household',
    tagline: 'Multiple servings, cost per serving',
    recommendationFocus: 'Scalable batch meals, kid-friendly flavours, bulk protein efficiency.',
    defaultBudget: 28,
    highlightKey: 'Portion & Value',
    description: 'Calculates true cost-per-serving, provides easy scaling up to 4–6 portions, and one-pot balance.'
  },
  {
    id: 'Fitness User',
    title: 'Fitness User',
    tagline: 'Calories, protein, health goals',
    recommendationFocus: 'High protein density (30g+), macronutrient transparency, lean cooking methods.',
    defaultBudget: 20,
    highlightKey: 'Protein & Macros',
    description: 'Prominently features exact calorie/protein ratios and suggests lean cooking swaps automatically.'
  },
  {
    id: 'Beginner Cook',
    title: 'Beginner Cook',
    tagline: 'Simpler recipes, more detailed guidance',
    recommendationFocus: 'Forgiving cooking times, visual doneness cues, 5 ingredients or fewer.',
    defaultBudget: 15,
    highlightKey: 'Clear Guidance',
    description: 'Includes step-by-step "what to look for" indicators, safety checks, and failsafe ingredient swaps.'
  },
  {
    id: 'General User',
    title: 'General User',
    tagline: 'Balanced, delicious everyday dining',
    recommendationFocus: 'Wholesome variety across diverse cuisines and comfortable cooking times.',
    defaultBudget: 18,
    highlightKey: 'Variety & Flavour',
    description: 'Personalised recommendations balancing comfort, nutrition, and pantry versatility.'
  },
  {
    id: 'I’m not sure yet',
    title: 'I’m not sure yet',
    tagline: 'Adaptive discovery mode',
    recommendationFocus: 'Learns as you interact, suggesting popular high-confidence kitchen wins.',
    defaultBudget: 15,
    highlightKey: 'Smart Discovery',
    description: 'SavorAI will gently adjust recommendations as you save meals and log pantry ingredients.'
  }
];
