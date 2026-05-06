import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';

type RecipeGridProps = {
  recipes: Recipe[];
  compact?: boolean;
};

export function RecipeGrid({ recipes, compact }: RecipeGridProps) {
  const gridClass = compact
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
    : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={gridClass}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}