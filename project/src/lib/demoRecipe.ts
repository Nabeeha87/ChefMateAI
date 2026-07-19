import type { Recipe, RecipeRequest } from '../types';

/**
 * Returns a realistic demo recipe for when the AI service is not configured.
 * The recipe adapts loosely to the user's selected cuisine and dietary preference.
 */
export function getDemoRecipe(request: RecipeRequest): Recipe {
  const { cuisine, dietaryPreference, cookingTime, difficulty } = request;

  const isVeg = dietaryPreference === 'Vegetarian' || dietaryPreference === 'Vegan';
  const isVegan = dietaryPreference === 'Vegan';

  const protein = isVegan
    ? 'chickpeas'
    : isVeg
      ? 'paneer'
      : 'chicken';

  const baseName =
    cuisine === 'Italian' ? `${protein.charAt(0).toUpperCase() + protein.slice(1)} Marinara`
      : cuisine === 'Chinese' ? `Stir-fried ${protein} with Vegetables`
      : cuisine === 'Mexican' ? `${protein.charAt(0).toUpperCase() + protein.slice(1)} Tacos`
      : cuisine === 'Middle Eastern' ? `${protein.charAt(0).toUpperCase() + protein.slice(1)} Shawarma Bowl`
      : cuisine === 'Indian' ? `${protein.charAt(0).toUpperCase() + protein.slice(1)} Masala`
      : `Garlic ${protein} Skillet`;

  return {
    recipeName: `${baseName} (Demo)`,
    description:
      `A hearty ${cuisine.toLowerCase()} ${dietaryPreference.toLowerCase()} dish made with ` +
      `ingredients you have on hand. This is a demo recipe — add your OpenAI API key ` +
      `to generate real AI-powered recipes.`,
    preparationTime: '15 minutes',
    cookingTime: cookingTime,
    servingSize: '4 servings',
    estimatedCalories: '~420 kcal per serving',
    ingredients: [
      { name: request.ingredients.split(',')[0]?.trim() || 'main ingredient', amount: 'as available', available: true },
      { name: protein, amount: isVeg ? '200g' : '300g', available: false },
      { name: 'garlic', amount: '3 cloves', available: true },
      { name: 'onion', amount: '1 medium', available: true },
      { name: 'olive oil', amount: '2 tbsp', available: false },
      { name: 'mixed spices', amount: 'to taste', available: false },
      ...(isVegan ? [] : [{ name: 'fresh herbs', amount: 'for garnish', available: false }]),
    ],
    instructions: [
      `Prep your ingredients: chop the onion, mince the garlic, and cut the ${protein} into bite-sized pieces.`,
      `Heat 2 tablespoons of oil in a large pan over medium heat. Add the onion and cook until translucent (3-4 minutes).`,
      `Add the garlic and your available spices. Stir for 30 seconds until fragrant.`,
      `Add the ${protein} and cook until browned on all sides (${isVeg ? '5-6' : '6-8'} minutes).`,
      `Add ${request.ingredients.split(',')[1]?.trim() || 'your other ingredients'} and a splash of water. Cover and simmer for ${cookingTime}.`,
      `Season to taste, garnish with fresh herbs, and serve hot.`,
    ],
    chefTips: [
      `For ${difficulty.toLowerCase()} cooks: ${difficulty === 'Beginner' ? 'prep all ingredients before you start cooking (mise en place).' : 'let the protein rest 2 minutes after cooking for juicier results.'}`,
      'Taste and adjust seasoning at the end — salt and acid transform a dish.',
      'Save leftover cooking liquid to use as a flavorful base for soups or grains.',
    ],
    substitutions: [
      isVeg ? 'Replace paneer with tofu for a vegan version.' : 'Replace chicken with chickpeas for a vegetarian version.',
      'No olive oil? Use any neutral cooking oil like canola or sunflower.',
      'Out of fresh garlic? Use 1 tsp garlic powder per clove.',
    ],
    nutritionalHighlights: [
      isVeg ? 'Good source of plant protein' : 'High in protein',
      'Rich in fiber from vegetables',
      'Balanced macronutrient profile',
    ],
  };
}
