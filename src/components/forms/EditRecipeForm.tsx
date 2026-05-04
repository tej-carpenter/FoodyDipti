"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { predefinedTags } from '@/lib/mock-data';
import { updateRecipe } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Recipe } from '@/types';

type EditRecipeFormProps = {
  recipe: Recipe;
};

export function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState(recipe.title);
  const [instagramUrl, setInstagramUrl] = useState(recipe.instagram_url ?? '');
  const [imageUrl, setImageUrl] = useState(recipe.image_url);
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients.length ? recipe.ingredients : ['']);
  const [steps, setSteps] = useState<string[]>(recipe.steps.length ? recipe.steps : ['']);
  const [selectedTags, setSelectedTags] = useState<string[]>(recipe.predefined_tags);
  const [customTags, setCustomTags] = useState(recipe.custom_tags.join(', '));
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedCustomTags = useMemo(
    () => customTags.split(',').map((tag) => tag.trim()).filter(Boolean),
    [customTags],
  );

  if (!isAdmin) {
    return <div className="rounded-[1.75rem] border border-border bg-surface p-6 text-sm text-muted">Admin access only.</div>;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setStatus('');

    try {
      await updateRecipe(recipe.id, {
        title,
        image_url: imageUrl,
        instagram_url: instagramUrl,
        ingredients: ingredients.map((item) => item.trim()).filter(Boolean),
        steps: steps.map((item) => item.trim()).filter(Boolean),
        predefined_tags: selectedTags,
        custom_tags: parsedCustomTags,
      });
      setStatus('Recipe updated. Redirecting...');
      router.push(`/recipe/${recipe.id}`);
      router.refresh();
    } catch (submitError) {
      setStatus(submitError instanceof Error ? submitError.message : 'Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  const updateList = (list: string[], setter: (value: string[]) => void, index: number, value: string) => {
    const next = [...list];
    next[index] = value;
    setter(next);
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink">Instagram URL</span>
          <input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">Image URL</span>
        <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Ingredients</span>
            <button type="button" onClick={() => setIngredients((current) => [...current, ''])} className="text-sm text-accent">Add</button>
          </div>
          {ingredients.map((ingredient, index) => (
            <input key={`ingredient-${index}`} value={ingredient} onChange={(event) => updateList(ingredients, setIngredients, index, event.target.value)} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Steps</span>
            <button type="button" onClick={() => setSteps((current) => [...current, ''])} className="text-sm text-accent">Add</button>
          </div>
          {steps.map((step, index) => (
            <input key={`step-${index}`} value={step} onChange={(event) => updateList(steps, setSteps, index, event.target.value)} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium text-ink">Predefined tags</span>
        <div className="flex flex-wrap gap-2">
          {predefinedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]))}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? 'border-[#20160f] bg-[#20160f] text-white' : 'border-border bg-white text-ink hover:border-[#20160f]/30'}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink">Custom tags</span>
        <input value={customTags} onChange={(event) => setCustomTags(event.target.value)} placeholder="comma separated" className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      </label>

      {status && <p className="text-sm text-muted">{status}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-[#20160f] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
          {saving ? 'Saving...' : 'Update recipe'}
        </button>
        <button type="button" onClick={() => router.push(`/recipe/${recipe.id}`)} className="rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}
