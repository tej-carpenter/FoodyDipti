import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}