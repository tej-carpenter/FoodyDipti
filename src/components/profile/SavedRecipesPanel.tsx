"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchFavorites, fetchRecipes } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Recipe } from '@/types';

export function SavedRecipesPanel() {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setMessage('Log in to see your saved recipes.');
      return;
    }

    const load = async () => {
      const [allRecipes, favorites] = await Promise.all([fetchRecipes(), fetchFavorites(user.uid)]);
      const savedIds = new Set(favorites.map((favorite) => favorite.recipe_id));
      const nextRecipes = allRecipes.filter((recipe) => savedIds.has(recipe.id));
      setRecipes(nextRecipes);
      setMessage(nextRecipes.length ? '' : 'No saved recipes yet.');
    };

    void load();
  }, [loading, user]);

  if (loading) {
    return <div className="rounded-[1.75rem] border border-border bg-surface p-6 text-sm text-muted">Loading your account...</div>;
  }

  if (!user) {
    return <div className="rounded-[1.75rem] border border-border bg-surface p-6 text-sm text-muted">{message}</div>;
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm text-muted">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft">
            <p className="text-lg font-semibold text-ink">{recipe.title}</p>
            <p className="mt-2 text-sm text-muted">Open the recipe for ingredients, steps, and tags.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}