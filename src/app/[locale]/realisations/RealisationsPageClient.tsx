'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';
import type { Locale, Category, PortfolioItem } from '@/types';

export function RealisationsPageClient({ categories, portfolioItems }: { categories: Category[]; portfolioItems: PortfolioItem[] }) {
  const t = useTranslations('portfolioPage');
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? portfolioItems.filter((p) => p.categorySlug === active) : portfolioItems),
    [active, portfolioItems]
  );

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 max-w-lg text-ink-70">{t('subtitle')}</p>

        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button onClick={() => setActive(null)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap', !active ? 'border-ink bg-ink text-paper' : 'border-ink-15')}>
            {t('all')}
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActive(c.slug)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap', active === c.slug ? 'border-ink bg-ink text-paper' : 'border-ink-15')}>
              {c.name[locale]}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 60} className="mb-4 break-inside-avoid">
              <Link href={`/realisations/${item.id}`} className="group relative block overflow-hidden rounded-xl shadow-soft">
                <img src={item.imageUrl} alt={item.title[locale]} className="w-full transition-transform duration-500 ease-premium group-hover:scale-105" />
                {item.videoUrl && (
                  <span className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-paper">
                    <PlayCircle size={16} />
                  </span>
                )}
                {item.beforeImageUrl && (
                  <span className="absolute start-2 top-2 rounded-sm bg-paper/90 px-2 py-1 text-[10px] font-bold">
                    {t('beforeAfterBadge')}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-4 text-xs font-semibold text-paper opacity-0 transition-all duration-300 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title[locale]}
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-paper/60">{t('viewProject')}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && <p className="mt-10 text-center text-ink-40">{t('empty')}</p>}
      </Container>
    </Section>
  );
}
