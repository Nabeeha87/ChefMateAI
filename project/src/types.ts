export type Cuisine =
  | 'Indian'
  | 'Italian'
  | 'Chinese'
  | 'Mexican'
  | 'Middle Eastern'
  | 'Any';

export type DietaryPreference =
  | 'Vegetarian'
  | 'Vegan'
  | 'Non-Vegetarian'
  | 'High Protein'
  | 'Low Carb';

export type CookingTime = '15 minutes' | '30 minutes' | '45 minutes' | '60+ minutes';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RecipeRequest {
  ingredients: string;
  cuisine: Cuisine;
  dietaryPreference: DietaryPreference;
  cookingTime: CookingTime;
  difficulty: Difficulty;
}

export interface IngredientItem {
  name: string;
  amount: string;
  available: boolean;
}

export interface Recipe {
  recipeName: string;
  description: string;
  preparationTime: string;
  cookingTime: string;
  servingSize: string;
  estimatedCalories: string;
  ingredients: IngredientItem[];
  instructions: string[];
  chefTips: string[];
  substitutions: string[];
  nutritionalHighlights: string[];
}

export type GenerationStatus = 'idle' | 'loading' | 'streaming' | 'success' | 'error';

export interface ApiResponse {
  recipe?: Recipe;
  raw?: string;
  error?: string;
}
