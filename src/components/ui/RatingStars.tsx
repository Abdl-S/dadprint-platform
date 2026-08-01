import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(i <= rating ? 'fill-brand-yellow text-brand-yellow' : 'fill-ink-8 text-ink-8')}
        />
      ))}
    </div>
  );
}
