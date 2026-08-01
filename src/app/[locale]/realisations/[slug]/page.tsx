import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';
import { BeforeAfterToggle } from '@/components/portfolio/BeforeAfterToggle';
import { getPortfolioItems } from '@/lib/data/content';
import { getCategories } from '@/lib/data/catalog';
import type { Locale } from '@/types';

/**
 * Slug basé sur l'id pour l'instant (le mock n'a pas de slug dédié par item) —
 * le futur module Supabase ajoutera un vrai `slug` par réalisation sans
 * changer cette page.
 */
export async function generateStaticParams() {
  const portfolioItems = await getPortfolioItems();
  return portfolioItems.map((p) => ({ slug: p.id }));
}

export default async function RealisationDetailPage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  const [portfolioItems, categories] = await Promise.all([getPortfolioItems(), getCategories()]);
  const item = portfolioItems.find((p) => p.id === slug);
  if (!item) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('portfolioPage');
  const category = categories.find((c) => c.slug === item.categorySlug);
  const related = portfolioItems.filter((p) => p.categorySlug === item.categorySlug && p.id !== item.id).slice(0, 3);

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <nav className="mb-6 text-xs text-ink-40">
          <Link href="/realisations" className="hover:underline">{t('title')}</Link> / {item.title[locale]}
        </nav>

        {item.videoUrl ? (
          <video src={item.videoUrl} controls className="aspect-square w-full rounded-lg object-cover" />
        ) : item.beforeImageUrl ? (
          <BeforeAfterToggle before={item.beforeImageUrl} after={item.imageUrl} alt={item.title[locale]} />
        ) : (
          <img src={item.imageUrl} alt={item.title[locale]} className="aspect-square w-full rounded-lg object-cover" />
        )}

        <div className="mt-6">
          {category && (
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">
              {category.name[locale]}
            </span>
          )}
          <h1 className="mt-2 text-2xl font-black">{item.title[locale]}</h1>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-4 text-lg font-bold">{t('relatedTitle')}</h2>
            <div className="grid grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/realisations/${r.id}`} className="overflow-hidden rounded-md">
                  <img src={r.imageUrl} alt={r.title[locale]} className="aspect-square w-full object-cover" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
