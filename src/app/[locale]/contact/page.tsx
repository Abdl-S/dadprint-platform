import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { ContactPageClient } from './ContactPageClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const titles = { fr: 'Contact', en: 'Contact', ar: 'اتصل بنا' };
  const descriptions = {
    fr: 'Téléphone, WhatsApp, adresse et horaires de DadPrint à Nouakchott — contactez-nous pour toute question.',
    en: 'Phone, WhatsApp, address and hours for DadPrint in Nouakchott — get in touch with any question.',
    ar: 'الهاتف وواتساب والعنوان وساعات العمل لدى DadPrint في نواكشوط — تواصل معنا لأي سؤال.',
  };
  return { title: titles[locale], description: descriptions[locale] };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
