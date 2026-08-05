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

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


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
  noStore();
  setRequestLocale(locale);

  const [products, portfolioItems, testimonials, clientCompanies, faq] = await Promise.all([
    getProducts(),
    getPortfolioItems(),
    getTestimonials(),
    getClientCompanies(),
    getFaq(),
  ]);

  // Sélection aléatoire de 4 vraies photos produits pour le collage du Hero —
  // différente à chaque chargement de page. Complète avec des photos de secours
  // vérifiées si moins de 4 produits ont une image (jamais de case vide dans le collage).
  const fallbackImages = [
    { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', alt: 'Impression premium DadPrint' },
    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', alt: 'Impression textile DadPrint' },
    { url: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?w=600&q=80', alt: 'Objets personnalisés DadPrint' },
    { url: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=700&q=80', alt: 'Signalétique DadPrint' },
  ];
  const productImages = products
    .filter((p) => p.images.length > 0)
    .map((p) => ({ url: p.images[0], alt: p.name[locale] }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  const collageImages = [...productImages, ...fallbackImages].slice(0, 4);

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
      <Hero collageImages={collageImages} />
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
