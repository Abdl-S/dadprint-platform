import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RatingStars } from '@/components/ui/RatingStars';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { DynamicOrderForm } from '@/components/order/DynamicOrderForm';
import { ScrollToOrderButton } from '@/components/product/ScrollToOrderButton';
import { Link } from '@/i18n/navigation';
import { getProducts, getProductBySlug } from '@/lib/data/catalog';
import { getTestimonials, getPortfolioItems } from '@/lib/data/content';
import { getComplementaryProducts } from '@/lib/recommendations/engine';
import type { Metadata } from 'next';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name[locale],
    description: product.shortDescription[locale],
    openGraph: { images: product.images[0] ? [product.images[0]] : [] },
  };
}

export default async function ProductDetailPage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  noStore();
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('product');
  const [allProducts, testimonials, portfolioItems] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getPortfolioItems(),
  ]);
  const related = allProducts.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
  const complementary = getComplementaryProducts(allProducts, product.categorySlug, product.slug);
  const productReviews = testimonials.filter((r) => r.productSlug === product.slug);
  const relatedRealisations = portfolioItems.filter((r) => r.categorySlug === product.categorySlug).slice(0, 4);

  // Données structurées Schema.org — aide Google à afficher un résultat riche (prix, avis, disponibilité)
  const avgRating = productReviews.length > 0 ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length : null;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.shortDescription[locale],
    image: product.images,
    ...(avgRating && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating.toFixed(1), reviewCount: productReviews.length },
    }),
    ...(product.priceLabel && {
      offers: { '@type': 'Offer', priceCurrency: 'MRU', price: product.priceLabel.replace(/\D/g, ''), availability: product.available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    <Section className="pt-10">
      <Container>
        {/* Fil d'ariane simple — bon pour le SEO et l'orientation utilisateur */}
        <nav className="mb-6 text-xs text-ink-40">
          <Link href="/produits" className="hover:underline">{t('breadcrumbCatalog')}</Link> / {product.name[locale]}
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery images={product.images} videoUrl={product.videoUrl} alt={product.name[locale]} />

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-black">{product.name[locale]}</h1>
              <FavoriteButton productSlug={product.slug} className="border border-ink-8" />
            </div>
            <p className="mt-3 text-ink-70">{product.shortDescription[locale]}</p>

            {productReviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <RatingStars rating={Math.round(productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length)} />
                <span className="text-xs text-ink-40">({productReviews.length} {t('reviews')})</span>
              </div>
            )}

            <div className="mt-5 rounded-lg border border-ink-8 shadow-soft bg-white p-4">
              <PriceDisplay mode={product.pricingMode} priceLabel={product.priceLabel} priceNote={product.priceNote?.[locale]} />
              {product.delay && <p className="mt-2 text-xs text-ink-40">{t('delay')} : {product.delay[locale]}</p>}
              {product.minQuantity && <p className="text-xs text-ink-40">{t('minQty')} : {product.minQuantity}</p>}
            </div>

            {product.specs.length > 0 && (
              <dl className="mt-6 divide-y divide-ink-8 text-sm">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex justify-between py-2.5">
                    <dt className="text-ink-40">{s.label[locale]}</dt>
                    <dd className="font-semibold">{s.value[locale]}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="mt-6 text-sm leading-relaxed text-ink-70">{product.description[locale]}</p>

            {product.tips && product.tips.length > 0 && (
              <div className="mt-6 rounded-md bg-brand-yellow/15 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-70">💡 {t('tipsTitle')}</p>
                <ul className="space-y-1.5 text-sm text-ink-70">
                  {product.tips.map((tip, i) => <li key={i}>• {tip[locale]}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de commande dynamique — propre à ce produit */}
        <div id="order-form" className="mx-auto mt-16 max-w-2xl rounded-lg border border-ink-8 p-6 sm:p-8">
          <DynamicOrderForm product={product} />
        </div>

        <ScrollToOrderButton targetId="order-form" />
        {product.faq.length > 0 && (
          <div className="mx-auto mt-16 max-w-2xl">
            <h2 className="mb-5 text-xl font-bold">{t('faqTitle')}</h2>
            <div className="divide-y divide-ink-8">
              {product.faq.map((f, i) => (
                <div key={i} className="py-4">
                  <p className="font-bold">{f.question[locale]}</p>
                  <p className="mt-1.5 text-sm text-ink-70">{f.answer[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedRealisations.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 text-xl font-bold">{t('relatedWork')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedRealisations.map((r) => (
                <div key={r.id} className="relative aspect-square overflow-hidden rounded-md">
                  <Image src={r.imageUrl} alt={r.title[locale]} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 text-xl font-bold">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => (
                <Link key={p.id} href={`/produits/${p.slug}`} className="overflow-hidden rounded-lg border border-ink-8 shadow-soft bg-white">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.images[0]} alt={p.name[locale]} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold">{p.name[locale]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {complementary.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-1.5 text-xl font-bold">{t('complementaryTitle')}</h2>
            <p className="mb-5 text-sm text-ink-70">{t('complementarySubtitle')}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {complementary.map((p) => (
                <Link key={p.id} href={`/produits/${p.slug}`} className="overflow-hidden rounded-lg border border-ink-8 shadow-soft bg-white">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.images[0]} alt={p.name[locale]} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold">{p.name[locale]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
    </>
  );
}
