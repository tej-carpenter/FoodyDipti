"use client";

import { useEffect, useState } from 'react';
import { createFavorite, fetchFavorites, removeFavorite } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Favorite } from '@/types';

export function RecipeActions({ recipeId, isSaved }: { recipeId: string; isSaved: boolean }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }

    const load = async () => {
      const favorites = await fetchFavorites(user.uid) as Favorite[];
      setSaved(favorites.some((favorite) => favorite.recipe_id === recipeId));
    };

    void load();
  }, [recipeId, user]);

  const toggle = async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (saved) {
        await removeFavorite(user.uid, recipeId);
      } else {
        await createFavorite(user.uid, recipeId);
      }
      setSaved(!saved);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!user || busy}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${saved ? 'bg-ink text-white' : 'border border-border bg-surface text-ink hover:bg-accentSoft'} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {saved ? 'Saved' : 'Save recipe'}
    </button>
  );
}