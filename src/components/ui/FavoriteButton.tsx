'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites/context';
import { cn } from '@/lib/utils';

export function FavoriteButton({ productSlug, className }: { productSlug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productSlug);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productSlug); }}
      aria-pressed={active}
      aria-label="Favori"
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 shadow transition-transform hover:scale-105',
        className
      )}
    >
      <Heart size={16} className={active ? 'fill-brand-magenta text-brand-magenta' : 'text-ink-40'} />
    </button>
  );
}
