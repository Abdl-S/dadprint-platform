/**
 * Types partagés — modèle de données de la plateforme publique.
 * Le contenu réel viendra de Supabase ; ces types définissent la forme
 * que les composants consomment déjà, pour brancher les vraies données
 * sans réécrire l'UI.
 */

export type Locale = 'fr' | 'en' | 'ar';
export type LocalizedText = Record<Locale, string>;

export type PricingMode = 'fixed' | 'from' | 'quote' | 'hidden';

export type DesignChoice = 'has_design' | 'needs_design' | 'needs_edit';

export type DeliveryMode = 'delivery' | 'pickup';

export type PaymentProvider = 'bankily' | 'masrivi' | 'sedad' | 'click' | 'bim_bank' | 'amanty';

export const ACCEPTED_FILE_TYPES = [
  '.pdf', '.ai', '.psd', '.svg', '.png', '.jpg', '.jpeg', '.zip', '.eps',
] as const;

/** Un champ de formulaire dynamique — un produit = une liste de ces champs. */
export type OrderFormField =
  | { type: 'select'; key: string; label: LocalizedText; options: string[]; required?: boolean; defaultValue?: string }
  | { type: 'radio'; key: string; label: LocalizedText; options: string[]; required?: boolean; defaultValue?: string }
  | { type: 'checkbox'; key: string; label: LocalizedText; options: string[]; required?: boolean }
  | { type: 'text'; key: string; label: LocalizedText; placeholder?: LocalizedText; required?: boolean; defaultValue?: string }
  | { type: 'textarea'; key: string; label: LocalizedText; placeholder?: LocalizedText; required?: boolean }
  | { type: 'number'; key: string; label: LocalizedText; required?: boolean; defaultValue?: string }
  | { type: 'date'; key: string; label: LocalizedText; required?: boolean }
  | { type: 'color'; key: string; label: LocalizedText; options: string[]; required?: boolean }
  | { type: 'upload'; key: string; label: LocalizedText; required?: boolean }
  | { type: 'address'; key: string; label: LocalizedText; required?: boolean }
  | { type: 'quantity'; key: string; label: LocalizedText; min?: number; required?: boolean };

export const FIELD_TYPE_LABELS: Record<OrderFormField['type'], string> = {
  select: 'Liste déroulante', radio: 'Choix unique (radio)', checkbox: 'Cases à cocher',
  text: 'Texte court', textarea: 'Commentaires (texte long)', number: 'Nombre', date: 'Date',
  color: 'Couleur', upload: 'Téléversement', address: 'Adresse', quantity: 'Quantité',
};

export interface Category {
  id: string;
  slug: string;
  parentSlug?: string; // présent = sous-catégorie ; absent = catégorie racine. Profondeur illimitée en théorie.
  name: LocalizedText;
  description: LocalizedText;
  coverImageUrl: string;
  productCount: number;
}

export interface ProductSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  categorySlug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  images: string[];
  videoUrl?: string;
  specs: ProductSpec[];
  tips?: LocalizedText[]; // "Conseils" — recommandations pratiques affichées sur la fiche produit
  faq: { question: LocalizedText; answer: LocalizedText }[];
  pricingMode: PricingMode;
  priceLabel?: string;
  promoPriceLabel?: string; // prix promotionnel — affiché barré à côté du prix normal si présent
  priceNote?: LocalizedText;
  minQuantity?: number;
  delay?: LocalizedText;
  available?: boolean; // disponibilité — masque le produit du catalogue si false
  seoTitle?: string;
  seoDescription?: string;
  relatedProductSlugs?: string[]; // "produits liés" choisis manuellement (sinon calculé par catégorie)
  /** Le formulaire de commande est propre à chaque produit — jamais générique. */
  orderForm: OrderFormField[];
}

/** Étapes du suivi — l'ordre encode la vraie progression d'une commande. */
export type TrackingStep =
  | 'demande_recue'
  | 'devis_envoye'
  | 'paiement_valide'
  | 'conception'
  | 'validation_bat'
  | 'impression'
  | 'controle_qualite'
  | 'livraison'
  | 'terminee';

export interface TrackingRecord {
  reference: string;
  type: 'devis' | 'commande';
  productName: LocalizedText;
  currentStep: TrackingStep;
  completedSteps: TrackingStep[];
  createdAt: string;
}

export interface BatMockup {
  reference: string;
  productName: LocalizedText;
  imageUrl: string;
  status: 'en_attente' | 'approuve' | 'modification_demandee';
  version: number;
}

export interface PastOrder {
  reference: string;
  type: 'devis' | 'commande';
  productSlug: string;
  productName: LocalizedText;
  date: string;
  status: TrackingStep;
}

export interface Invoice {
  reference: string;
  orderReference: string;
  amount: string;
  date: string;
  status: 'payee' | 'en_attente';
}

export interface ClientFile {
  id: string;
  name: string;
  type: 'logo' | 'fichier' | 'creation';
  url: string;
  uploadedAt: string;
  linkedOrderReference?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  logoUrl: string;
  colors: string[];
  fonts: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface ClientNotification {
  id: string;
  type: 'devis_pret' | 'paiement_recu' | 'maquette_disponible' | 'validation_demandee' | 'impression_commencee' | 'livraison_prevue';
  message: LocalizedText;
  reference?: string;
  date: string;
  read: boolean;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  isDefault: boolean;
}

/** Un pack regroupe plusieurs produits existants (par slug) autour d'un besoin type. */
export interface Pack {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  coverImageUrl: string;
  productSlugs: string[];
  pricingMode: PricingMode;
  priceLabel?: string;
}

export interface WizardProject {
  key: string;
  label: LocalizedText;
  recommendedProductSlugs: string[];
  recommendedPackSlug?: string;
}

export interface BlogArticle {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  coverImageUrl: string;
  category: 'conseils-impression' | 'conseils-design' | 'guides' | 'tutoriels';
  publishedAt: string;
}

export interface PortfolioItem {
  id: string;
  categorySlug: string;
  title: LocalizedText;
  imageUrl: string;
  beforeImageUrl?: string;
  videoUrl?: string;
}

export interface ClientCompany {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorContext: LocalizedText; // ex: "Restaurant, Nouakchott" — jamais un nom de personne inventé
  avatarUrl?: string;
  photoUrl?: string; // photo du produit livré jointe à l'avis, si le client en a fourni une
  companyName?: string; // affiché uniquement si le client a autorisé la mention
  date: string; // ISO — permet le tri chronologique sur la page Avis
  rating: number; // 1-5
  comment: LocalizedText;
  verified: boolean;
  productSlug?: string;
}

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface SatisfactionRatingCategories {
  qualite: number;
  delais: number;
  communication: number;
  livraison: number;
  design: number;
}
