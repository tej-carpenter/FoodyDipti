"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { RecipeGrid } from '@/components/RecipeGrid';
import { fetchRecipes } from '@/lib/firestore';
import { getRecipeMetrics } from '@/lib/recipe-ui';
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

  const featuredRecipes = recipes.slice(0, 2);
  const trendingRecipes = recipes.slice(0, 4);
  const quickRecipes = recipes.filter((recipe) => (recipe.cooking_time_minutes ?? 999) <= 20).slice(0, 4);
  const comfortRecipes = recipes.filter((recipe) => recipe.predefined_tags.includes('Dessert') || recipe.predefined_tags.includes('Indian')).slice(0, 4);

  return (
    <div className="space-y-10 py-8">
      <section className="grid gap-8 rounded-[2rem] bg-[var(--surface)] p-5 shadow-[0_18px_45px_rgba(31,31,31,0.06)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Recipe feed</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text)] sm:text-6xl">YOUR NEXT FAVOURITE MEAL STARTS HERE</h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">discover simple recipes with full ingredients and step by step instructions.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!user && <Link href="/login" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)]">Explore dishes</Link>}
            {user && <Link href="/profile" className="rounded-full bg-[var(--text)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90" style={{ color: '#fff' }}>Explore dishes</Link>}
            <Link href="#trending" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5">
              Trending today
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Trending this week', value: `${trendingRecipes.length || recipes.length} picks` },
              { label: 'Quick under 20 minutes', value: `${quickRecipes.length || Math.min(recipes.length, 2)} fast recipes` },
              { label: 'Recently added', value: `${recipes.slice(0, 3).length} fresh drops` },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.4rem] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-[var(--text)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_32px_rgba(31,31,31,0.06)] sm:row-span-2">
            <Image src={featuredRecipes[0]?.image_url ?? '/recipes/gulab-jamun.svg'} alt={featuredRecipes[0]?.title ?? 'Featured recipe'} width={900} height={1100} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/80">Featured recipe</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{featuredRecipes[0]?.title ?? 'Comfort food, made easy'}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">{featuredRecipes[0] ? getRecipeMetrics(featuredRecipes[0]).description : 'A calm starting point for the day’s most clicked dishes.'}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[var(--text)] p-5 text-white shadow-[0_16px_32px_rgba(31,31,31,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/65">Quote</p>
            <p className="mt-3 text-2xl leading-tight tracking-[-0.04em]">
              &ldquo;The best recipes earn a second look, a second save, and a place in your weekly rotation.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_24px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Trending today</p>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]">{recipe.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="trending" className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Discovery loop</p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Keep browsing without leaving the page</h2>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">Trending this week</h3>
              <span className="text-sm text-[var(--muted)]">Most saved and most opened</span>
            </div>
            <RecipeGrid recipes={trendingRecipes.length ? trendingRecipes : filteredRecipes} />
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Quick under 20 minutes</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">Fast wins for busy days</h3>
              </div>
              <RecipeGrid recipes={quickRecipes.length ? quickRecipes : filteredRecipes.slice(0, 2)} compact />
            </section>

            <section className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Comfort food</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">Warm dishes people return to</h3>
              </div>
              <RecipeGrid recipes={comfortRecipes.length ? comfortRecipes : filteredRecipes.slice(0, 2)} compact />
            </section>

            <section className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Recently added</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">Fresh arrivals worth a save</h3>
              </div>
              <RecipeGrid recipes={recipes.slice(0, 2)} compact />
            </section>
          </div>

          <div className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">Filter by category</h2>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-[var(--accent)] transition hover:underline"
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
                    className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ease-out ${
                      active
                        ? 'bg-[var(--text)] text-white shadow-[0_10px_20px_rgba(31,31,31,0.06)]'
                        : 'bg-white text-[var(--text)] shadow-[0_8px_18px_rgba(31,31,31,0.04)] hover:-translate-y-0.5'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <RecipeGrid recipes={filteredRecipes} />
    </div>
  );
}