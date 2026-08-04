import { getProducts } from '@/lib/data/catalog';
import type { Locale } from '@/types';
import { DevisPageClient } from './DevisPageClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function DevisPage({ params: { locale } }: { params: { locale: Locale } }) {
  noStore();
  const products = await getProducts();
  return <DevisPageClient products={products} locale={locale} />;
}
