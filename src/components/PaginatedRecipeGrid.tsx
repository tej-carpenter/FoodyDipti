'use client';

import { useEffect, useRef, useState } from 'react';
import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';

type PaginatedRecipeGridProps = {
  recipes: Recipe[];
  compact?: boolean;
  pageSize?: number;
};

export function PaginatedRecipeGrid({ recipes, compact = false, pageSize = 12 }: PaginatedRecipeGridProps) {
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasMore = (page + 1) * pageSize < recipes.length;

  // Update displayed recipes when recipes list or page changes
  useEffect(() => {
    const end = (page + 1) * pageSize;
    setDisplayedRecipes(recipes.slice(0, end));
  }, [recipes, page, pageSize]);

  // Reset page when recipes list changes (e.g., search filter)
  useEffect(() => {
    setPage(0);
  }, [recipes]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const gridClass = compact
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
    : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className="space-y-6">
      <div className={gridClass}>
        {displayedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Loading indicator and trigger for infinite scroll */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {hasMore ? (
          <p className="text-sm text-[var(--muted)]">Loading more recipes...</p>
        ) : displayedRecipes.length > 0 ? (
          <p className="text-sm text-[var(--muted)]">No more recipes to load.</p>
        ) : (
          <p className="text-sm text-[var(--muted)]">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
