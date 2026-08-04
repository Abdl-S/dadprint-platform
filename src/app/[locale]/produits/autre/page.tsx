import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { AutreChoseClient } from './AutreChoseClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const titles = { fr: 'Dites-nous ce dont vous avez besoin', en: 'Tell us what you need', ar: 'أخبرنا بما تحتاجه' };
  return { title: titles[locale] };
}

export default function AutreChosePage() {
  return <AutreChoseClient />;
}
