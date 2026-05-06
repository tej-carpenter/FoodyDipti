import type { Recipe } from '@/types';

export type RecipeMetrics = {
  cookingTime: string;
  difficulty: string;
  saves: string;
  servings: string;
  description: string;
};

export function getRecipeMetrics(recipe: Recipe): RecipeMetrics {
  const cookingTimeMinutes = recipe.cooking_time_minutes ?? Math.max(15, Math.min(40, recipe.ingredients.length * 4 + recipe.steps.length * 3));
  const difficulty = recipe.difficulty ?? (recipe.ingredients.length <= 5 ? 'Easy' : recipe.ingredients.length <= 8 ? 'Medium' : 'Hard');
  const savesCount = recipe.saves_count ?? 120 + recipe.ingredients.length * 25 + recipe.steps.length * 12;
  const servingsCount = recipe.serving_count ?? (recipe.ingredients.length >= 6 ? 4 : 2);
  const description = recipe.description ?? 'Quick to cook, easy to love, and built for repeat saves.';

  return {
    cookingTime: `${cookingTimeMinutes} min`,
    difficulty,
    saves: `${savesCount.toLocaleString()} saves`,
    servings: `${servingsCount} servings`,
    description,
  };
}

export function splitIngredients(ingredients: string[]) {
  const chunkSize = Math.max(1, Math.ceil(ingredients.length / 3));
  const grouped = [
    ingredients.slice(0, chunkSize),
    ingredients.slice(chunkSize, chunkSize * 2),
    ingredients.slice(chunkSize * 2),
  ].filter((group) => group.length > 0);

  return grouped.map((items, index) => ({
    title: ['Essentials', 'Build', 'Finish'][index] ?? `Group ${index + 1}`,
    items,
  }));
}
