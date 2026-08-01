'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/** Bascule simple avant/après — clic pour comparer, pas de slider complexe à maintenir. */
export function BeforeAfterToggle({ before, after, alt }: { before: string; after: string; alt: string }) {
  const t = useTranslations('portfolioPage');
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="relative">
      <img src={showAfter ? after : before} alt={alt} className="aspect-square w-full rounded-lg object-cover" />
      <button
        onClick={() => setShowAfter((v) => !v)}
        className="absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper shadow-lg"
      >
        {showAfter ? t('showBefore') : t('showAfter')}
      </button>
    </div>
  );
}
