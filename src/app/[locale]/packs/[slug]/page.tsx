import { notFound } from 'next/navigation';
import { getPackBySlug, getPacks } from '@/lib/data/content';
import { getProducts } from '@/lib/data/catalog';
import type { Locale } from '@/types';
import { PackDetailClient } from './PackDetailClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export async function generateStaticParams() {
  const packs = await getPacks();
  return packs.map((p) => ({ slug: p.slug }));
}

export default async function PackDetailPage({ params: { slug, locale } }: { params: { slug: string; locale: Locale } }) {
  noStore();
  const pack = await getPackBySlug(slug);
  if (!pack) notFound();

  const allProducts = await getProducts();
  const packProducts = allProducts.filter((p) => pack.productSlugs.includes(p.slug));

  return <PackDetailClient pack={pack} packProducts={packProducts} locale={locale} />;
}
