"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types';
import { getRecipeMetrics } from '@/lib/recipe-ui';

interface IngredientDiscoveryProps {
  recipes: Recipe[];
}

export function IngredientDiscovery({ recipes }: IngredientDiscoveryProps) {
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !userIngredients.includes(trimmed)) {
      setUserIngredients(prev => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
      // If we already searched once, we can consider this a continuation of search
      if (hasSearched && inputValue.trim()) {
        setHasSearched(true);
      }
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setUserIngredients(prev => prev.filter(i => i !== ingredientToRemove));
  };

  const clearIngredients = () => {
    setUserIngredients([]);
    setHasSearched(false);
    setInputValue('');
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      addIngredient();
    }
    setHasSearched(true);
  };

  const results = useMemo(() => {
    if (!hasSearched || userIngredients.length === 0) return { perfect: [], close: [] };

    const normalizedUserIngs = userIngredients.map(i => i.toLowerCase().trim());

    const matched = recipes.map(recipe => {
      const recipeIngs = (recipe.normalizedIngredients && recipe.normalizedIngredients.length > 0)
        ? recipe.normalizedIngredients
        : recipe.ingredients;

      const normalizedRecipeIngs = recipeIngs.map(i => i.toLowerCase().trim());

      const availableIngredients = normalizedRecipeIngs.filter(recipeIng => 
        normalizedUserIngs.some(userIng => recipeIng.includes(userIng))
      );
      
      const missingIngredients = normalizedRecipeIngs.filter(recipeIng => 
        !normalizedUserIngs.some(userIng => recipeIng.includes(userIng))
      );

      const matchPercentage = normalizedRecipeIngs.length > 0 
        ? Math.round((availableIngredients.length / normalizedRecipeIngs.length) * 100) 
        : 0;

      return {
        recipe,
        matchPercentage,
        missingIngredients,
        displayMissing: recipe.ingredients.filter((_, idx) => 
          !normalizedUserIngs.some(userIng => normalizedRecipeIngs[idx].includes(userIng))
        )
      };
    });

    const perfect = matched
      .filter(m => m.missingIngredients.length === 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    const close = matched
      .filter(m => m.missingIngredients.length > 0 && m.missingIngredients.length <= 3 && m.matchPercentage >= 50)
      .sort((a, b) => {
        if (a.missingIngredients.length !== b.missingIngredients.length) {
          return a.missingIngredients.length - b.missingIngredients.length;
        }
        return b.matchPercentage - a.matchPercentage;
      })
      .slice(0, 3);

    return { perfect, close };
  }, [recipes, userIngredients, hasSearched]);

  return (
    <section id="ingredient-discovery" className="rounded-[2rem] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(31,31,31,0.06)] lg:p-8 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Smart Discovery</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">Find Recipes From Your Ingredients</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. tomato, onion, salt"
            className="flex-1 rounded-2xl border border-[rgba(31,31,31,0.08)] bg-white px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            onClick={addIngredient}
            className="rounded-2xl bg-[var(--text)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Add
          </button>
        </div>

        {userIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userIngredients.map(ing => (
              <span key={ing} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm shadow-[0_8px_18px_rgba(31,31,31,0.04)] border border-[rgba(31,31,31,0.05)] text-[var(--text)]">
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="text-[var(--muted)] hover:text-red-500 flex items-center justify-center w-4 h-4 rounded-full transition-colors"
                  aria-label="Remove ingredient"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSearch}
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white shadow-[0_14px_26px_rgba(217,119,6,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(217,119,6,0.24)]"
          >
            Find Recipes
          </button>
          {userIngredients.length > 0 && (
            <button
              onClick={clearIngredients}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--text)] shadow-[0_10px_20px_rgba(31,31,31,0.05)] transition hover:-translate-y-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {hasSearched && userIngredients.length > 0 && (
        <div className="mt-8 space-y-10 border-t border-[rgba(31,31,31,0.05)] pt-8">
          
          {results.perfect.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">Recipes You Can Make Right Now</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.perfect.map(match => (
                  <MatchRecipeCard key={match.recipe.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {results.close.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">With A Few More Ingredients</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.close.map(match => (
                  <MatchRecipeCard key={match.recipe.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {results.perfect.length === 0 && results.close.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-[0_10px_20px_rgba(31,31,31,0.05)]">
              <p className="text-[var(--text)] font-medium">No recipes found matching these ingredients.</p>
              <p className="text-sm text-[var(--muted)] mt-1">Try adding a few more ingredients to broaden your search.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MatchRecipeCard({ match }: { match: any }) {
  const { recipe, matchPercentage, displayMissing } = match;
  const metrics = getRecipeMetrics(recipe);

  return (
    <Link href={`/recipe/${recipe.id}`} className="group overflow-hidden rounded-[1.75rem] bg-[var(--surface)] shadow-[0_14px_38px_rgba(31,31,31,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(31,31,31,0.09)] flex flex-col h-full bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-opacity duration-300 group-hover:from-black/50" />
        
        {/* Match Percentage Badge */}
        <div className="absolute top-4 right-4 rounded-full bg-black/40 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
          {matchPercentage}% Match
        </div>

        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 text-white">
          <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-white">{recipe.title}</h3>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
            <span>{metrics.cookingTime}</span>
            <span>•</span>
            <span>{metrics.difficulty}</span>
          </div>
        </div>
      </div>
      
      {/* Missing Ingredients Section */}
      {displayMissing && displayMissing.length > 0 && (
        <div className="p-4 bg-white flex-1 flex flex-col justify-start">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-[0.1em] mb-2">Missing Ingredients:</p>
          <ul className="text-sm text-[var(--text)] space-y-1">
            {displayMissing.map((ing: string, idx: number) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[var(--accent)] mt-0.5">•</span>
                <span className="leading-tight">{ing}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
}
