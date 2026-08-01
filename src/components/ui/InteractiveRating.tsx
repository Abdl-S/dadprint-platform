'use client';

import { Star } from 'lucide-react';

export function InteractiveRating({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i}/5`}>
            <Star size={22} className={i <= value ? 'fill-brand-yellow text-brand-yellow' : 'fill-ink-8 text-ink-8'} />
          </button>
        ))}
      </div>
    </div>
  );
}
