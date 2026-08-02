'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { cn } from '@/lib/utils';
import type { Locale, Category, Product } from '@/types';

/**
 * Catalogue — filtrable par catégorie ET sous-catégorie, profondeur illimitée
 * en théorie (portée par `parentSlug`). Tout vient de `categories`/`products`
 * (Supabase). Lit `?categorie=slug` dans l'URL au chargement — c'est ce lien
 * qu'utilisent la page d'accueil et le header pour ouvrir directement une
 * catégorie précise, sans repasser par "Toutes".
 */
export function ProduitsPageClient({ categories, products }: { categories: Category[]; products: Product[] }) {
  const t = useTranslations('catalog');
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const [activeRoot, setActiveRoot] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get('categorie');
    if (!slug) return;
    const match = categories.find((c) => c.slug === slug);
    if (!match) return;
    if (match.parentSlug) {
      setActiveRoot(match.parentSlug);
      setActiveSub(match.slug);
    } else {
      setActiveRoot(match.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const rootCategories = useMemo(() => categories.filter((c) => !c.parentSlug), [categories]);
  const subCategories = useMemo(
    () => (activeRoot ? categories.filter((c) => c.parentSlug === activeRoot) : []),
    [activeRoot, categories]
  );

  function selectRoot(slug: string | null) {
    setActiveRoot(slug);
    setActiveSub(null);
  }

  const filtered = useMemo(() => {
    if (activeSub) return products.filter((p) => p.categorySlug === activeSub);
    if (activeRoot) {
      const scope = new Set([activeRoot, ...subCategories.map((c) => c.slug)]);
      return products.filter((p) => scope.has(p.categorySlug));
    }
    return products;
  }, [activeRoot, activeSub, subCategories, products]);

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 max-w-lg text-ink-70">{t('subtitle')}</p>

        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => selectRoot(null)}
            className={cn('rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap', !activeRoot ? 'border-ink bg-ink text-paper' : 'border-ink-15')}
          >
            {t('all')}
          </button>
          {rootCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectRoot(cat.slug)}
              className={cn('rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap', activeRoot === cat.slug ? 'border-ink bg-ink text-paper' : 'border-ink-15')}
            >
              {cat.name[locale]}
            </button>
          ))}
        </div>

        {subCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 border-s-2 ps-3" style={{ borderColor: 'var(--color-magenta)' }}>
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(activeSub === sub.slug ? null : sub.slug)}
                className={cn('rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap', activeSub === sub.slug ? 'border-brand-magenta bg-brand-magenta text-white' : 'border-ink-15 text-ink-70')}
              >
                {sub.name[locale]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/produits/${p.slug}`} className="group overflow-hidden rounded-lg border border-ink-8 bg-white shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.images[0]} alt={p.name[locale]} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 ease-premium group-hover:scale-110" />
                <FavoriteButton productSlug={p.slug} className="absolute top-2 end-2" />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-bold">{p.name[locale]}</h3>
                <p className="mt-1 text-xs text-ink-40">{p.shortDescription[locale]}</p>
                <div className="mt-3">
                  <PriceDisplay mode={p.pricingMode} priceLabel={p.priceLabel} priceNote={p.priceNote?.[locale]} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && <p className="mt-10 text-center text-ink-40">{t('empty')}</p>}
      </Container>
    </Section>
  );
}
