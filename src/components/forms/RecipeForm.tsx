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
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedCustomTags = useMemo(() => customTags.split(',').map((tag) => tag.trim()).filter(Boolean), [customTags]);

  if (!isAdmin) {
    return <div className="rounded-[1.75rem] bg-[var(--surface)] p-6 text-sm text-[var(--muted)] shadow-[0_10px_20px_rgba(31,31,31,0.05)]">Admin access only.</div>;
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
        description: description.trim(),
        cooking_time_minutes: cookingTime ? parseInt(cookingTime, 10) : undefined,
        difficulty,
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
      setDescription('');
      setCookingTime('');
      setDifficulty('Easy');
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
    <form onSubmit={submit} className="space-y-5 rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.06)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Instagram URL</span>
          <input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--text)]">Image URL</span>
        <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Cooking Time (minutes)</span>
          <input type="number" value={cookingTime} onChange={(event) => setCookingTime(event.target.value)} placeholder="e.g. 30" className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as 'Easy' | 'Medium' | 'Hard')} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3">
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--text)]">Servings</span>
          <input type="number" placeholder="e.g. 2" className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--text)]">Description</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description of the recipe" rows={3} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text)]">Ingredients</span>
            <button type="button" onClick={() => setIngredients((current) => [...current, ''])} className="text-sm text-[var(--accent)]">Add</button>
          </div>
          {ingredients.map((ingredient, index) => (
            <input key={`ingredient-${index}`} value={ingredient} onChange={(event) => updateList(ingredients, setIngredients, index, event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text)]">Steps</span>
            <button type="button" onClick={() => setSteps((current) => [...current, ''])} className="text-sm text-[var(--accent)]">Add</button>
          </div>
          {steps.map((step, index) => (
            <input key={`step-${index}`} value={step} onChange={(event) => updateList(steps, setSteps, index, event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium text-[var(--text)]">Predefined tags</span>
        <div className="flex flex-wrap gap-2">
          {predefinedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]))}
                className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ease-out ${active ? 'bg-[var(--text)] text-white shadow-[0_10px_20px_rgba(31,31,31,0.06)]' : 'bg-white text-[var(--text)] shadow-[0_8px_18px_rgba(31,31,31,0.04)] hover:-translate-y-0.5'}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--text)]">Custom tags</span>
        <input value={customTags} onChange={(event) => setCustomTags(event.target.value)} placeholder="comma separated" className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
      </label>

      {status && <p className="text-sm text-[var(--muted)]">{status}</p>}

      <button type="submit" disabled={saving} className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)] disabled:opacity-60">
        {saving ? 'Saving...' : 'Upload recipe'}
      </button>
    </form>
  );
}