"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import { fetchRecipes } from '@/lib/firestore';
import { getRecipeMetrics } from '@/lib/recipe-ui';
import type { Recipe } from '@/types';

export default function LoginPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    let active = true;

    fetchRecipes()
      .then((items) => {
        if (active) {
          setRecipes(items);
        }
      })
      .catch(() => {
        if (active) {
          setRecipes([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const featured = recipes[0];
  const secondary = recipes[1] ?? recipes[0];

  return (
    <div className="grid min-h-[calc(100vh-6rem)] items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <section className="space-y-6 pb-2 lg:pb-0">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Login</p>
        <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text)] sm:text-6xl">Welcome back to your recipe trail.</h1>
        <p className="max-w-lg text-base leading-7 text-[var(--muted)]">Save dishes, revisit favorites, and follow the recipes people are opening right now.</p>

        <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_16px_35px_rgba(31,31,31,0.06)]">
            {featured ? (
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
                  <Image src={featured.image_url} alt={featured.title} fill className="object-cover" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Featured recipe</p>
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">{featured.title}</h2>
                  <p className="text-sm leading-6 text-[var(--muted)]">{getRecipeMetrics(featured).description}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Featured recipe</p>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">No uploads yet</h2>
                <p className="text-sm leading-6 text-[var(--muted)]">Upload your first recipe to see it highlighted here.</p>
              </div>
            )}
            <div className="rounded-[1.4rem] bg-white p-4 shadow-[0_10px_20px_rgba(31,31,31,0.04)]">
              <p className="text-sm italic leading-7 text-[var(--text)]">“Browse like a food magazine, save like a personal cookbook.”</p>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.75rem] bg-[var(--surface)] p-5 shadow-[0_16px_35px_rgba(31,31,31,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Trending today</p>
            {secondary ? (
              <Link href={`/recipe/${secondary.id}`} className="block overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
                <div className="relative aspect-[4/3]">
                  <Image src={secondary.image_url} alt={secondary.title} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="text-base font-semibold text-[var(--text)]">{secondary.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{getRecipeMetrics(secondary).description}</p>
                </div>
              </Link>
            ) : (
              <div className="rounded-[1.5rem] bg-white p-4 text-sm text-[var(--muted)] shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
                Trending recipes will appear here once users upload dishes.
              </div>
            )}
          </div>
        </div>
      </section>
      <LoginForm />
    </div>
  );
}