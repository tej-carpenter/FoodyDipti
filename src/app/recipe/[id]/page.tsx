"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchRecipe } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';
import { RecipeActions } from '@/components/RecipeActions';
import { DeleteRecipeButton } from '@/components/DeleteRecipeButton';
import type { Recipe } from '@/types';
import { getRecipeMetrics, splitIngredients } from '@/lib/recipe-ui';

export default function RecipeDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const id = params?.id as string | undefined;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.replace('/');
      return;
    }

    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetchRecipe(id);
        if (!mounted) return;
        if (!r) {
          setError('Recipe not found');
          setRecipe(null);
        } else {
          setRecipe(r);
        }
      } catch (err) {
        console.error('Error loading recipe', err);
        setError('Failed to load recipe');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) {
    return <div className="py-8 text-[var(--muted)]">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="py-8">
        <p className="text-sm text-red-600">{error ?? 'Recipe not found.'}</p>
      </div>
    );
  }

  const metrics = getRecipeMetrics(recipe);
  const ingredientGroups = splitIngredients(recipe.ingredients);

  return (
    <div className="space-y-8 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[var(--surface)] shadow-[0_18px_45px_rgba(31,31,31,0.07)]">
          <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
        </div>
        <section className="space-y-5 rounded-[2rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.06)]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Recipe detail</p>
            <h1 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text)]">{recipe.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{metrics.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Cooking time', value: metrics.cookingTime },
              { label: 'Difficulty', value: metrics.difficulty },
              { label: 'Saves', value: metrics.saves },
              { label: 'Servings', value: metrics.servings },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.4rem] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-[var(--text)]">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[...recipe.predefined_tags, ...recipe.custom_tags].map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1 text-sm text-[var(--text)] shadow-[0_8px_18px_rgba(31,31,31,0.04)]">{tag}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RecipeActions recipeId={recipe.id} isSaved={false} />
            {isAdmin ? (
              <Link href={`/admin/recipe/${recipe.id}/edit`} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5">
                Edit recipe
              </Link>
            ) : null}
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
          {recipe.instagram_url ? (
            <Link href={recipe.instagram_url} target="_blank" rel="noreferrer" className="text-sm text-[var(--accent)] underline-offset-4 hover:underline">
              View Instagram post
            </Link>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Ingredients</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Grouped for faster cooking</h2>
          </div>
          <div className="space-y-4">
            {ingredientGroups.map((group) => (
              <div key={group.title} className="rounded-[1.4rem] bg-white p-4 shadow-[0_10px_20px_rgba(31,31,31,0.04)]">
                <h3 className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((ingredient) => (
                    <li key={ingredient} className="flex items-start gap-3 text-[var(--text)]">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(217,119,6,0.14)] text-[11px] font-semibold text-[var(--accent)]">✓</span>
                      <span className="leading-6 text-[var(--text)]/90">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-5 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_14px_35px_rgba(31,31,31,0.05)]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Steps</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Follow the timeline</h2>
          </div>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={`${step}-${index}`} className="relative rounded-[1.4rem] bg-white py-4 pl-16 pr-4 shadow-[0_10px_20px_rgba(31,31,31,0.04)]">
                <span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">{index + 1}</span>
                <div className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Step {index + 1}</div>
                <p className="mt-2 text-[var(--text)]">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
