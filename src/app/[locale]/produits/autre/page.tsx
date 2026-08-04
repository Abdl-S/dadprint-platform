import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { AutreChoseClient } from './AutreChoseClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const titles = { fr: 'Dites-nous ce dont vous avez besoin', en: 'Tell us what you need', ar: 'أخبرنا بما تحتاجه' };
  return { title: titles[locale] };
}

export default function AutreChosePage() {
  return <AutreChoseClient />;
}
