import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipe/${recipe.id}`} className="group overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-semibold text-white sm:text-lg">{recipe.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.predefined_tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/95 backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}