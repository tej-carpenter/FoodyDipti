"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { predefinedTags } from '@/lib/mock-data';
import { uploadRecipe } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';

export function RecipeForm() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedCustomTags = useMemo(() => customTags.split(',').map((tag) => tag.trim()).filter(Boolean), [customTags]);

  if (!isAdmin) {
    return <div className="rounded-[1.75rem] border border-border bg-surface p-6 text-sm text-muted">Admin access only.</div>;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email) return;

    setSaving(true);
    setStatus('');

    try {
      await uploadRecipe({
        title,
        image_url: imageUrl,
        instagram_url: instagramUrl,
        ingredients: ingredients.filter(Boolean),
        steps: steps.filter(Boolean),
        predefined_tags: selectedTags,
        custom_tags: parsedCustomTags,
        created_by: user.email,
      });
      setStatus('Recipe saved.');
      router.refresh();
      setTitle('');
      setInstagramUrl('');
      setImageUrl('');
      setIngredients(['']);
      setSteps(['']);
      setSelectedTags([]);
      setCustomTags('');
    } catch (submitError) {
      setStatus(submitError instanceof Error ? submitError.message : 'Failed to save recipe');
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

      <button type="submit" disabled={saving} className="rounded-full bg-[#20160f] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
        {saving ? 'Saving...' : 'Upload recipe'}
      </button>
    </form>
  );
}