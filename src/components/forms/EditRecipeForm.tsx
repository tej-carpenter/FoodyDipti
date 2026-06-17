"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { predefinedTags } from '@/lib/mock-data';
import { updateRecipe } from '@/lib/firestore';
import { useAuth } from '@/components/auth/AuthProvider';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients.length ? recipe.ingredients : ['']);
  const [normalizedIngredients, setNormalizedIngredients] = useState<string[]>(recipe.normalizedIngredients?.length ? recipe.normalizedIngredients : ['']);
  const [steps, setSteps] = useState<string[]>(recipe.steps.length ? recipe.steps : ['']);
  const [selectedTags, setSelectedTags] = useState<string[]>(recipe.predefined_tags);
  const [customTags, setCustomTags] = useState(recipe.custom_tags.join(', '));
  const [description, setDescription] = useState(recipe.description ?? '');
  const [cookingTime, setCookingTime] = useState(recipe.cooking_time_minutes?.toString() ?? '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(recipe.difficulty ?? 'Easy');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const parsedCustomTags = useMemo(
    () => customTags.split(',').map((tag) => tag.trim()).filter(Boolean),
    [customTags],
  );

  if (!isAdmin) {
    return <div className="rounded-[1.75rem] bg-[var(--surface)] p-6 text-sm text-[var(--muted)] shadow-[0_10px_20px_rgba(31,31,31,0.05)]">Admin access only.</div>;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setStatus('');

    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        setStatus('Uploading new image...');
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      setStatus('Saving recipe...');

      await updateRecipe(recipe.id, {
        title,
        image_url: finalImageUrl,
        instagram_url: instagramUrl,
        ingredients: ingredients.map((item) => item.trim()).filter(Boolean),
        normalizedIngredients: normalizedIngredients.map((item) => item.trim()).filter(Boolean),
        steps: steps.map((item) => item.trim()).filter(Boolean),
        predefined_tags: selectedTags,
        custom_tags: parsedCustomTags,
        description: description.trim(),
        cooking_time_minutes: cookingTime ? parseInt(cookingTime, 10) : undefined,
        difficulty,
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
        <span className="text-sm font-medium text-[var(--text)]">Image</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }} 
          className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3 file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90" 
        />
        {(imagePreview || imageUrl) && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(31,31,31,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview || imageUrl} alt="Preview" className="h-64 w-full object-cover" />
          </div>
        )}
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
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text)]">Normalized Ingredients</span>
          <button type="button" onClick={() => setNormalizedIngredients((current) => [...current, ''])} className="text-sm text-[var(--accent)]">Add</button>
        </div>
        <div className="space-y-2">
          {normalizedIngredients.map((ingredient, index) => (
            <div key={`normalized-${index}`} className="flex gap-2 items-center">
              <input value={ingredient} onChange={(event) => updateList(normalizedIngredients, setNormalizedIngredients, index, event.target.value)} className="w-full rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3" />
              <button type="button" onClick={() => setNormalizedIngredients((current) => current.length > 1 ? current.filter((_, i) => i !== index) : [''])} className="text-sm text-red-500 font-medium px-2">Remove</button>
            </div>
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

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)] disabled:opacity-60">
          {saving ? 'Saving...' : 'Update recipe'}
        </button>
        <button type="button" onClick={() => router.push(`/recipe/${recipe.id}`)} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5">
          Cancel
        </button>
      </div>
    </form>
  );
}
