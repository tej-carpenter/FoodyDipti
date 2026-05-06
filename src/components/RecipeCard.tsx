import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types';
import { getRecipeMetrics } from '@/lib/recipe-ui';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const metrics = getRecipeMetrics(recipe);

  return (
    <Link href={`/recipe/${recipe.id}`} className="group overflow-hidden rounded-[1.75rem] bg-[var(--surface)] shadow-[0_14px_38px_rgba(31,31,31,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(31,31,31,0.09)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-opacity duration-300 group-hover:from-black/50" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-4 text-white">
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/90">
            <span className="rounded-full bg-white/14 px-2.5 py-1 backdrop-blur">{metrics.cookingTime}</span>
            <span className="rounded-full bg-white/14 px-2.5 py-1 backdrop-blur">{metrics.difficulty}</span>
          </div>
          <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-white sm:text-xl">{recipe.title}</h3>
          <p className="max-w-[18rem] text-sm leading-6 text-white/80">{metrics.description}</p>
          <div className="flex flex-wrap gap-2">
            {recipe.predefined_tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-white/14 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/75">
            <span>{metrics.saves}</span>
            <span>Tap to open</span>
          </div>
        </div>
      </div>
    </Link>
  );
}