import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
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
 * devoir d'abord choisir une catégorie. Affiche 9 produits + la carte
 * "Autre chose" (même logique que sur le catalogue complet) pour que ce
 * point d'entrée soit visible sans avoir à cliquer "Voir tout le catalogue".
 */
export function ProductsPreview({ products }: { products: Product[] }) {
  const t = useTranslations('categories');
  const catalogT = useTranslations('catalog');
  const locale = useLocale() as Locale;
  const featured = products.slice(0, 9);

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

          {/* Carte "Autre chose" — même logique et même style que sur le catalogue complet */}
          <Link
            href="/produits/autre"
            className="group flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-yellow bg-ink p-4 text-center text-paper shadow-soft transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-card"
          >
            <Sparkles size={22} className="text-brand-yellow transition-transform group-hover:scale-110" />
            <p className="text-sm font-bold">{catalogT('otherCardTitle')}</p>
          </Link>
        </div>

        <Link href="/produits" className="mt-6 block text-center text-sm font-bold underline sm:hidden">{t('seeAll')}</Link>
      </Container>
    </Section>
  );
}
