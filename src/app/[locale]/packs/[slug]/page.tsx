import { notFound } from 'next/navigation';
import { getPackBySlug, getPacks } from '@/lib/data/content';
import { getProducts } from '@/lib/data/catalog';
import type { Locale } from '@/types';
import { PackDetailClient } from './PackDetailClient';

export async function generateStaticParams() {
  const packs = await getPacks();
  return packs.map((p) => ({ slug: p.slug }));
}

export default async function PackDetailPage({ params: { slug, locale } }: { params: { slug: string; locale: Locale } }) {
  const pack = await getPackBySlug(slug);
  if (!pack) notFound();

  const allProducts = await getProducts();
  const packProducts = allProducts.filter((p) => pack.productSlugs.includes(p.slug));

  return <PackDetailClient pack={pack} packProducts={packProducts} locale={locale} />;
}
