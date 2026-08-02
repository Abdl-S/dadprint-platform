import { getAdminQuotes } from '@/lib/data/admin';
import { getProducts } from '@/lib/data/catalog';
import { AdminDevisClient } from './AdminDevisClient';

export default async function AdminDevisPage() {
  const [initial, products] = await Promise.all([getAdminQuotes(), getProducts(undefined, true)]);
  return <AdminDevisClient initial={initial} products={products} />;
}
