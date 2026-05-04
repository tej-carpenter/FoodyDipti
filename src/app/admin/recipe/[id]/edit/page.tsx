"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { EditRecipeForm } from '@/components/forms/EditRecipeForm';
import { fetchRecipe } from '@/lib/firestore';
import type { Recipe } from '@/types';

export default function EditRecipePage() {
  const params = useParams();
  const { isAdmin, loading: authLoading } = useAuth();
  const id = params?.id as string | undefined;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Recipe not found');
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const data = await fetchRecipe(id);
        if (!mounted) return;

        if (!data) {
          setError('Recipe not found');
          setRecipe(null);
          return;
        }

        setRecipe(data);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load recipe for editing', err);
        setError('Failed to load recipe');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (authLoading || loading) {
    return <div className="py-8 text-sm text-muted">Loading editor...</div>;
  }

  if (!isAdmin) {
    return <div className="py-8 text-sm text-muted">Admin access only.</div>;
  }

  if (error || !recipe) {
    return <div className="py-8 text-sm text-red-600">{error ?? 'Recipe not found'}</div>;
  }

  return (
    <div className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Admin</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Edit recipe details.</h1>
        <p className="max-w-xl text-base leading-7 text-muted">Changes are written to Firestore and become visible on public pages after redeploy or cache refresh.</p>
      </section>
      <EditRecipeForm recipe={recipe} />
    </div>
  );
}
