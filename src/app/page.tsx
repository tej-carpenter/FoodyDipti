"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { RecipeGrid } from '@/components/RecipeGrid';
import { fetchRecipes } from '@/lib/firestore';
import { predefinedTags } from '@/lib/mock-data';
import type { Recipe } from '@/types';

export default function HomePage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const filteredRecipes = selectedTags.length === 0
    ? recipes
    : recipes.filter((recipe) =>
        selectedTags.some((tag) => recipe.predefined_tags.includes(tag))
      );

  return (
    <div className="space-y-8 py-8">
      <section className="rounded-[2rem] border border-border bg-hero-radial bg-surface p-6 shadow-soft lg:p-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-muted">Recipe feed</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Image-first recipes from one creator, built for fast browsing and easy saving.</h1>
          <p className="max-w-xl text-base leading-7 text-muted">Browse the latest dishes, open full recipes, and keep favorites in your profile.</p>
          <div className="flex gap-3">
            {!user && <Link href="/login" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">Get started</Link>}
            {user && <Link href="/profile" className="rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-ink">Saved recipes</Link>}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Filter by category</h2>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-sm text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {predefinedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => setSelectedTags((current) =>
                  current.includes(tag)
                    ? current.filter((t) => t !== tag)
                    : [...current, tag]
                )}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? 'border-[#20160f] bg-[#20160f] text-white'
                    : 'border-border bg-white text-ink hover:border-[#20160f]/30'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <RecipeGrid recipes={filteredRecipes} />
    </div>
  );
}