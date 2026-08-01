import { getPacks } from '@/lib/data/content';
import { getProducts } from '@/lib/data/catalog';
import { AdminPacksClient } from './AdminPacksClient';

export default async function AdminPacksPage() {
  const [rawPacks, products] = await Promise.all([getPacks(), getProducts(undefined, true)]);
  const initialPacks = rawPacks.map((p) => ({ ...p, active: true }));
  return <AdminPacksClient initialPacks={initialPacks} products={products} />;
}
