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
    return <div className="py-8">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="py-8">
        <p className="text-sm text-red-600">{error ?? 'Recipe not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft">
          <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover" />
        </div>
        <section className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-muted">Recipe detail</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{recipe.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...recipe.predefined_tags, ...recipe.custom_tags].map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-white px-3 py-1 text-sm text-ink">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <RecipeActions recipeId={recipe.id} isSaved={false} />
            {isAdmin ? (
              <Link href={`/admin/recipe/${recipe.id}/edit`} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-accentSoft">
                Edit recipe
              </Link>
            ) : null}
            <DeleteRecipeButton recipeId={recipe.id} />
          </div>
          {recipe.instagram_url ? (
            <Link href={recipe.instagram_url} target="_blank" rel="noreferrer" className="text-sm text-accent underline-offset-4 hover:underline">
              View Instagram post
            </Link>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Ingredients</h2>
          <ul className="mt-4 space-y-3 text-muted">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient} className="rounded-2xl border border-border bg-white px-4 py-3">{ingredient}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Steps</h2>
          <ol className="mt-4 space-y-3 text-muted">
            {recipe.steps.map((step, index) => (
              <li key={`${step}-${index}`} className="rounded-2xl border border-border bg-white px-4 py-3">
                <span className="mr-3 font-semibold text-ink">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
