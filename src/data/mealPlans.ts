export interface MealPlan {
  id: string;
  name: string;
  description: string;
}

export const mealPlans: MealPlan[] = [
  { id: 'uai', name: 'UAI', description: 'Ultra kõik hinnas' },
  { id: 'ai', name: 'AI', description: 'Kõik hinnas' },
  { id: 'fb', name: 'FB', description: '3 toidukorda päevas' },
  { id: 'hb', name: 'HB', description: 'Hommiku- ja õhtusöök' },
  { id: 'bb', name: 'BB', description: 'Hommikusöök' }
];

// Hiljem asendada API päringuga
export async function fetchMealPlans() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mealPlans;
}
