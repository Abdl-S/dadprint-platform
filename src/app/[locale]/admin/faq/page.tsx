import { getFaq } from '@/lib/data/content';
import { AdminFaqClient } from './AdminFaqClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminFaqPage() {
  noStore();
  const initial = await getFaq();
  return <AdminFaqClient initial={initial} />;
}
