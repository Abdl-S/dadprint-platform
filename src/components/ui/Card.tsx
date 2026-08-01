import { cn } from '@/lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

/**
 * Carte unique pour tout le site — ombre teintée à l'encre (jamais du gris
 * neutre générique), légère élévation au survol, espacement généreux.
 * `interactive` active le hover pensé pour les cartes cliquables
 * (produits, packs, articles, avis).
 */
export function Card({
  children, className, interactive = false, padding = 'md', ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; interactive?: boolean; padding?: 'none' | 'sm' | 'md' | 'lg' }) {
  const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-7 sm:p-8' };

  return (
    <div
      className={cn(
        'rounded-lg border border-ink-8 bg-white shadow-soft',
        interactive && 'transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
