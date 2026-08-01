import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/types';
import { Hero } from '@/components/home/Hero';
import { AboutIntro } from '@/components/home/AboutIntro';
import { Advantages } from '@/components/home/Advantages';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { WhyUs } from '@/components/home/WhyUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { BestRealisations } from '@/components/home/BestRealisations';
import { TrustedCompanies } from '@/components/home/TrustedCompanies';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ContactSection } from '@/components/home/ContactSection';

/**
 * Page d'accueil — composition de toutes les sections demandées.
 * Chaque section est un composant indépendant dans components/home/ :
 * en retirer, réordonner ou en ajouter une nouvelle ne touche jamais aux autres.
 */
export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DadPrint',
    image: '/brand/dadprint-logo.jpg',
    description: "Atelier d'impression et de communication visuelle à Nouakchott, Mauritanie.",
    address: { '@type': 'PostalAddress', addressLocality: 'Nouakchott', addressCountry: 'MR' },
    telephone: '+22234763421',
    priceRange: 'MRU',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Hero />
      <AboutIntro />
      <Advantages />
      <ServicesOverview />
      <CategoriesGrid />
      <BestRealisations />
      <HowItWorks />
      <WhyUs />
      <TrustedCompanies />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
