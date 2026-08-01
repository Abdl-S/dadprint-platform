/** ⚠️ Packs d'exemple — l'admin pourra créer/modifier des packs librement (module suivant). */
import type { Pack, WizardProject } from '@/types';

const t = (fr: string, en: string, ar: string) => ({ fr, en, ar });

export const packs: Pack[] = [
  {
    id: 'pk1', slug: 'pack-restaurant',
    name: t('Pack Restaurant', 'Restaurant Pack', 'باقة المطعم'),
    description: t('Tout pour lancer ou relooker votre restaurant : cartes, menus, signalétique.', 'Everything to launch or refresh your restaurant: cards, menus, signage.', 'كل ما يلزم لإطلاق أو تجديد مطعمك.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=700&q=80',
    productSlugs: ['carte-de-visite-standard', 'flyer-a5', 'roll-up-standard'],
    pricingMode: 'quote',
  },
  {
    id: 'pk2', slug: 'pack-boutique',
    name: t('Pack Boutique', 'Retail Pack', 'باقة المتجر'),
    description: t('Étiquettes, sacs, flyers promo — tout pour votre point de vente.', 'Labels, bags, promo flyers — everything for your store.', 'ملصقات وأكياس ومنشورات ترويجية لمتجرك.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80',
    productSlugs: ['flyer-a5', 'carte-de-visite-standard'],
    pricingMode: 'quote',
  },
  {
    id: 'pk3', slug: 'pack-entreprise',
    name: t('Pack Entreprise', 'Business Pack', 'باقة الشركات'),
    description: t('Identité complète : cartes, papeterie, roll-up pour vos événements.', 'Complete identity: cards, stationery, roll-up for your events.', 'هوية كاملة: بطاقات، قرطاسية، لوحة للفعاليات.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=700&q=80',
    productSlugs: ['carte-de-visite-standard', 'roll-up-standard'],
    pricingMode: 'quote',
  },
  {
    id: 'pk4', slug: 'pack-mariage',
    name: t('Pack Mariage', 'Wedding Pack', 'باقة الزفاف'),
    description: t('Faire-part, cartes de remerciement, décoration imprimée.', 'Invitations, thank-you cards, printed decor.', 'دعوات وبطاقات شكر وديكور مطبوع.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80',
    productSlugs: ['flyer-a5'],
    pricingMode: 'quote',
  },
  {
    id: 'pk5', slug: 'pack-evenement',
    name: t('Pack Événement', 'Event Pack', 'باقة الفعاليات'),
    description: t('Bâches, roll-up, flyers pour une visibilité maximale le jour J.', 'Banners, roll-up, flyers for maximum visibility on the day.', 'لافتات ولوحات ومنشورات لأقصى ظهور في اليوم المنشود.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80',
    productSlugs: ['roll-up-standard', 'flyer-a5'],
    pricingMode: 'quote',
  },
  {
    id: 'pk6', slug: 'pack-ecole',
    name: t('Pack École', 'School Pack', 'باقة المدرسة'),
    description: t('Supports de communication pour rentrée et événements scolaires.', 'Communication materials for back-to-school and school events.', 'وسائل تواصل للعودة المدرسية والفعاليات.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80',
    productSlugs: ['flyer-a5', 'carte-de-visite-standard'],
    pricingMode: 'quote',
  },
  {
    id: 'pk7', slug: 'pack-clinique',
    name: t('Pack Clinique', 'Clinic Pack', 'باقة العيادة'),
    description: t('Cartes de rendez-vous, signalétique, supports d\'information patients.', 'Appointment cards, signage, patient information materials.', 'بطاقات مواعيد ولافتات ومواد توعية للمرضى.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=700&q=80',
    productSlugs: ['carte-de-visite-standard'],
    pricingMode: 'quote',
  },
  {
    id: 'pk8', slug: 'pack-immobilier',
    name: t('Pack Immobilier', 'Real Estate Pack', 'باقة العقارات'),
    description: t('Panneaux, flyers, cartes pour vos biens et votre agence.', 'Signs, flyers, cards for your properties and agency.', 'لوحات ومنشورات وبطاقات لعقاراتك ووكالتك.'),
    coverImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80',
    productSlugs: ['flyer-a5', 'roll-up-standard'],
    pricingMode: 'quote',
  },
];

export const wizardProjects: WizardProject[] = [
  { key: 'restaurant', label: t('Restaurant', 'Restaurant', 'مطعم'), recommendedProductSlugs: ['flyer-a5', 'carte-de-visite-standard'], recommendedPackSlug: 'pack-restaurant' },
  { key: 'boutique', label: t('Boutique', 'Retail Store', 'متجر'), recommendedProductSlugs: ['flyer-a5'], recommendedPackSlug: 'pack-boutique' },
  { key: 'entreprise', label: t('Entreprise', 'Business', 'شركة'), recommendedProductSlugs: ['carte-de-visite-standard', 'roll-up-standard'], recommendedPackSlug: 'pack-entreprise' },
  { key: 'coiffure', label: t('Salon de coiffure', 'Hair Salon', 'صالون حلاقة'), recommendedProductSlugs: ['carte-de-visite-standard', 'flyer-a5'] },
  { key: 'clinique', label: t('Clinique', 'Clinic', 'عيادة'), recommendedProductSlugs: ['carte-de-visite-standard'], recommendedPackSlug: 'pack-clinique' },
  { key: 'ecole', label: t('École', 'School', 'مدرسة'), recommendedProductSlugs: ['flyer-a5'], recommendedPackSlug: 'pack-ecole' },
  { key: 'mariage', label: t('Mariage', 'Wedding', 'زفاف'), recommendedProductSlugs: ['flyer-a5'], recommendedPackSlug: 'pack-mariage' },
  { key: 'evenement', label: t('Événement', 'Event', 'فعالية'), recommendedProductSlugs: ['roll-up-standard', 'flyer-a5'], recommendedPackSlug: 'pack-evenement' },
  { key: 'autre', label: t('Autre', 'Other', 'أخرى'), recommendedProductSlugs: ['carte-de-visite-standard'] },
];
