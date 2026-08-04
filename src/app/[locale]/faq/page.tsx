import { getFaq } from '@/lib/data/content';
import { FaqPageClient } from './FaqPageClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function FaqPage() {
  noStore();
  const faq = await getFaq();
  return <FaqPageClient faq={faq} />;
}
