import { MealPlan } from '@/types/destinations';

/**
 * Mock data for meal plans
 * Used in hotels and packages
 */
export const mealPlans: MealPlan[] = [
  {
    id: 'uai',
    code: 'UAI',
    name: 'Ultra kõik hinnas',
    description: 'Kõik toidukorrad, suupisted ja joogid (sh premium alkohol) on hinna sees'
  },
  {
    id: 'ai',
    code: 'AI',
    name: 'Kõik hinnas',
    description: 'Kõik toidukorrad, suupisted ja joogid (kohalik alkohol) on hinna sees'
  },
  {
    id: 'fb',
    code: 'FB',
    name: 'Täispansion',
    description: 'Kolm toidukorda päevas (hommiku-, lõuna- ja õhtusöök)'
  },
  {
    id: 'hb',
    code: 'HB',
    name: 'Poolpansion',
    description: 'Hommiku- ja õhtusöök on hinna sees'
  },
  {
    id: 'bb',
    code: 'BB',
    name: 'Hommikusöök',
    description: 'Ainult hommikusöök on hinna sees'
  },
  {
    id: 'ro',
    code: 'RO',
    name: 'Ilma toitlustuseta',
    description: 'Toitlustus ei ole hinna sees'
  }
];

/**
 * Helper function to get a meal plan by ID
 * @param id Meal plan ID
 * @returns Meal plan object or undefined if not found
 */
export function getMealPlanById(id: string): MealPlan | undefined {
  return mealPlans.find(mealPlan => mealPlan.id === id);
}

/**
 * Helper function to get a meal plan by code
 * @param code Meal plan code
 * @returns Meal plan object or undefined if not found
 */
export function getMealPlanByCode(code: string): MealPlan | undefined {
  return mealPlans.find(mealPlan => mealPlan.code === code);
}

/**
 * Mock API function to fetch meal plans
 * @returns Promise resolving to meal plans array
 */
export async function fetchMealPlans(): Promise<MealPlan[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mealPlans;
}
