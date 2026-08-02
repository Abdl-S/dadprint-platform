import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import type { Locale, Product } from '@/types';

/**
 * Remplace l'ancienne grille de catégories sur l'accueil — le client voit
 * directement de vrais produits (photo, nom, prix) et clique dessus pour
 * arriver droit sur la fiche produit avec ses spécifications, plutôt que de
 * devoir d'abord choisir une catégorie. Affiche les 10 premiers produits
 * disponibles ; "Voir tout le catalogue" reste pour la vue complète filtrable.
 */
export function ProductsPreview({ products }: { products: Product[] }) {
  const t = useTranslations('categories');
  const locale = useLocale() as Locale;
  const featured = products.slice(0, 10);

  if (featured.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('productsTitle')}</h2>
          </div>
          <Link href="/produits" className="hidden text-sm font-bold underline sm:block">{t('seeAll')}</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/produits/${p.slug}`}
              className="group overflow-hidden rounded-lg border border-ink-8 bg-white shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card hover:border-ink-15"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={p.images[0]} alt={p.name[locale]} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover transition-transform duration-500 ease-premium group-hover:scale-110" />
                <FavoriteButton productSlug={p.slug} className="absolute top-2 end-2" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold">{p.name[locale]}</h3>
                <div className="mt-1.5">
                  <PriceDisplay mode={p.pricingMode} priceLabel={p.priceLabel} priceNote={p.priceNote?.[locale]} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/produits" className="mt-6 block text-center text-sm font-bold underline sm:hidden">{t('seeAll')}</Link>
      </Container>
    </Section>
  );
}
