import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/types';
import { getProducts } from '@/lib/data/catalog';
import { getPortfolioItems, getTestimonials, getClientCompanies, getFaq } from '@/lib/data/content';
import { Hero } from '@/components/home/Hero';
import { AboutIntro } from '@/components/home/AboutIntro';
import { Advantages } from '@/components/home/Advantages';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { WhyUs } from '@/components/home/WhyUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProductsPreview } from '@/components/home/ProductsPreview';
import { BestRealisations } from '@/components/home/BestRealisations';
import { TrustedCompanies } from '@/components/home/TrustedCompanies';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ContactSection } from '@/components/home/ContactSection';

/**
 * Page d'accueil — composition de toutes les sections demandées.
 * Chaque section est un composant indépendant dans components/home/ :
 * en retirer, réordonner ou en ajouter une nouvelle ne touche jamais aux autres.
 * Les données réelles (produits, réalisations, avis, entreprises clientes,
 * FAQ) sont récupérées ici une seule fois et transmises en props. La grille
 * de catégories a été remplacée par une grille de produits directement
 * cliquables — le client voit immédiatement de vrais produits plutôt que de
 * devoir d'abord choisir une catégorie.
 */
export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  const [products, portfolioItems, testimonials, clientCompanies, faq] = await Promise.all([
    getProducts(),
    getPortfolioItems(),
    getTestimonials(),
    getClientCompanies(),
    getFaq(),
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
      <ProductsPreview products={products} />
      <BestRealisations portfolioItems={portfolioItems} />
      <HowItWorks />
      <WhyUs />
      <TrustedCompanies clientCompanies={clientCompanies} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faq={faq} />
      <ContactSection />
    </>
  );
}
