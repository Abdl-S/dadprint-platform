import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import type { Category, Locale } from '@/types';

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  const t = useTranslations('categories');
  const locale = useLocale() as Locale;
  const rootCategories = categories.filter((c) => !c.parentSlug);

  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
          </div>
          <Link href="/produits" className="hidden text-sm font-bold underline sm:block">{t('seeAll')}</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rootCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits?categorie=${cat.slug}`}
              className="group overflow-hidden rounded-lg border border-ink-8 bg-white shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={cat.coverImageUrl}
                  alt={cat.name[locale]}
                  className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold">{cat.name[locale]}</h3>
                <span className="text-xs text-ink-40">{cat.productCount} {t('products')}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
