import { getPacks } from '@/lib/data/content';
import { getProducts } from '@/lib/data/catalog';
import { AdminPacksClient } from './AdminPacksClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminPacksPage() {
  noStore();
  const [rawPacks, products] = await Promise.all([getPacks(), getProducts(undefined, true)]);
  const initialPacks = rawPacks.map((p) => ({ ...p, active: true }));
  return <AdminPacksClient initialPacks={initialPacks} products={products} />;
}
