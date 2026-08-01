import { getProducts } from '@/lib/data/catalog';
import type { Locale } from '@/types';
import { DevisPageClient } from './DevisPageClient';

export default async function DevisPage({ params: { locale } }: { params: { locale: Locale } }) {
  const products = await getProducts();
  return <DevisPageClient products={products} locale={locale} />;
}
