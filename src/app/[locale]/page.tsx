import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/types';
import { getCategories } from '@/lib/data/catalog';
import { getPortfolioItems, getTestimonials, getClientCompanies } from '@/lib/data/content';
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
 * Les données réelles (catégories, réalisations, avis, entreprises clientes)
 * sont récupérées ici une seule fois et transmises en props — la FAQ reste
 * sur contenu éditorial fixe, aucune table dédiée en base pour l'instant.
 */
export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  const [categories, portfolioItems, testimonials, clientCompanies] = await Promise.all([
    getCategories(),
    getPortfolioItems(),
    getTestimonials(),
    getClientCompanies(),
  ]);

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DadPrint',
    image: '/brand/dadprint-logo.png',
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
      <CategoriesGrid categories={categories} />
      <BestRealisations portfolioItems={portfolioItems} />
      <HowItWorks />
      <WhyUs />
      <TrustedCompanies clientCompanies={clientCompanies} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection />
      <ContactSection />
    </>
  );
}
