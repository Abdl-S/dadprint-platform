/**
 * ⚠️ Données d'exemple pour l'administration — à remplacer par de vraies
 * requêtes Supabase. Chaque module de l'admin lit/écrit sur ces tableaux en
 * mémoire pour rester pleinement interactif sans backend pour l'instant.
 */
import type { AdminRole } from '@/lib/admin/auth-context';

export interface CommandeStatusConfig {
  key: string;
  label: string;
  color: string; // classe Tailwind pour le badge
}

/** Statuts de commande — personnalisables (ajout/suppression/réordonnancement) */
export const orderStatuses: CommandeStatusConfig[] = [
  { key: 'nouveau', label: 'Nouveau', color: 'bg-ink-8 text-ink' },
  { key: 'en_attente', label: 'En attente', color: 'bg-brand-yellow/20 text-ink-70' },
  { key: 'paiement_recu', label: 'Paiement reçu', color: 'bg-brand-cyan/15 text-brand-cyan' },
  { key: 'design', label: 'Design', color: 'bg-brand-magenta/10 text-brand-magenta' },
  { key: 'bat', label: 'BAT', color: 'bg-brand-magenta/10 text-brand-magenta' },
  { key: 'impression', label: 'Impression', color: 'bg-ink text-paper' },
  { key: 'controle_qualite', label: 'Contrôle qualité', color: 'bg-ink text-paper' },
  { key: 'livraison', label: 'Livraison', color: 'bg-success/10 text-success' },
  { key: 'terminee', label: 'Terminée', color: 'bg-success/15 text-success' },
  { key: 'annulee', label: 'Annulée', color: 'bg-danger/10 text-danger' },
];

export interface AdminOrder {
  reference: string;
  clientName: string;
  clientPhone: string;
  productName: string;
  quantity: string;
  amount: number;
  status: string; // clé de orderStatuses
  date: string;
}

export const adminOrders: AdminOrder[] = [
  { reference: 'DP-CMD-20260728-1042', clientName: 'Restaurant La Table', clientPhone: '+222 34 76 34 21', productName: 'Roll-up standard', quantity: '2', amount: 42000, status: 'impression', date: '2026-07-28' },
  { reference: 'DP-CMD-20260615-3390', clientName: 'Atlas Immobilier', clientPhone: '+222 22 11 33 44', productName: 'Carte de visite standard', quantity: '500', amount: 5000, status: 'terminee', date: '2026-06-15' },
  { reference: 'DP-CMD-20260730-5521', clientName: 'Sahara Events', clientPhone: '+222 45 12 98 76', productName: 'Flyer A5', quantity: '1000', amount: 8000, status: 'nouveau', date: '2026-07-30' },
  { reference: 'DP-CMD-20260729-9087', clientName: 'Boutique Lumière', clientPhone: '+222 33 22 11 00', productName: 'Casquette personnalisée', quantity: '30', amount: 27000, status: 'design', date: '2026-07-29' },
  { reference: 'DP-CMD-20260727-2214', clientName: 'École El Hoda', clientPhone: '+222 20 30 40 50', productName: 'Flyer A5', quantity: '2000', amount: 15000, status: 'en_attente', date: '2026-07-27' },
];

export interface AdminQuote {
  reference: string;
  clientName: string;
  clientPhone: string;
  productName: string;
  status: 'nouveau' | 'en_cours' | 'envoye' | 'accepte' | 'refuse';
  date: string;
}

export const adminQuotes: AdminQuote[] = [
  { reference: 'DP-DEV-20260730-8821', clientName: 'Salon Éclat', clientPhone: '+222 41 55 66 77', productName: 'Casquette personnalisée', status: 'nouveau', date: '2026-07-30' },
  { reference: 'DP-DEV-20260728-1120', clientName: 'Clinique An-Nour', clientPhone: '+222 36 88 99 00', productName: 'Cartes de rendez-vous', status: 'en_cours', date: '2026-07-28' },
  { reference: 'DP-DEV-20260725-4432', clientName: 'Pharmacie Ibn Sina', clientPhone: '+222 27 14 25 36', productName: 'Signalétique', status: 'envoye', date: '2026-07-25' },
];

export interface CrmClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  isCompany: boolean;
}

export const crmClients: CrmClient[] = [
  { id: 'c1', name: 'Restaurant La Table', phone: '+222 34 76 34 21', email: 'contact@latable.mr', city: 'Nouakchott', ordersCount: 4, totalSpent: 128000, isCompany: true },
  { id: 'c2', name: 'Atlas Immobilier', phone: '+222 22 11 33 44', email: 'contact@atlas-immo.mr', city: 'Nouakchott', ordersCount: 2, totalSpent: 15000, isCompany: true },
  { id: 'c3', name: 'Sahara Events', phone: '+222 45 12 98 76', email: 'hello@saharaevents.mr', city: 'Nouakchott', ordersCount: 6, totalSpent: 210000, isCompany: true },
  { id: 'c4', name: 'Mariem Vall', phone: '+222 20 30 40 50', email: 'mariem.v@example.mr', city: 'Nouakchott', ordersCount: 1, totalSpent: 5000, isCompany: false },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
}

export const adminUsers: AdminUser[] = [
  { id: 'u1', name: 'Admin Démo', email: 'admin@dadprint.mr', role: 'administrateur', active: true },
  { id: 'u2', name: 'Fatima Salem', email: 'fatima@dadprint.mr', role: 'commercial', active: true },
  { id: 'u3', name: 'Ahmed Baba', email: 'ahmed@dadprint.mr', role: 'graphiste', active: true },
  { id: 'u4', name: 'Sidi Mohamed', email: 'sidi@dadprint.mr', role: 'production', active: true },
  { id: 'u5', name: 'Moussa Kane', email: 'moussa@dadprint.mr', role: 'livreur', active: false },
];

export const rolePermissions: Record<AdminRole, string[]> = {
  administrateur: ['Accès complet à tous les modules'],
  commercial: ['Devis', 'Commandes', 'Clients', 'Packs'],
  graphiste: ['DadPrint Studio', 'Produits (galerie)', 'BAT'],
  production: ['Commandes (statuts production)', 'Contrôle qualité'],
  livreur: ['Commandes (statut livraison)', 'Adresses clients'],
  support: ['Clients', 'Avis', 'Newsletter'],
};

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export const newsletterSubscribers: NewsletterSubscriber[] = [
  { id: 'n1', email: 'client1@example.mr', subscribedAt: '2026-07-20' },
  { id: 'n2', email: 'client2@example.mr', subscribedAt: '2026-07-15' },
  { id: 'n3', email: 'client3@example.mr', subscribedAt: '2026-06-30' },
  { id: 'n4', email: 'client4@example.mr', subscribedAt: '2026-06-10' },
];

export interface ServiceGraphique {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export const servicesGraphiques: ServiceGraphique[] = [
  { id: 'sg1', name: 'Création de logo', description: 'Identité visuelle complète', active: true },
  { id: 'sg2', name: 'Flyer', description: 'Conception de flyer publicitaire', active: true },
  { id: 'sg3', name: 'Carte de visite', description: 'Design de carte professionnelle', active: true },
  { id: 'sg4', name: 'Roll-up', description: 'Conception grand format', active: true },
  { id: 'sg5', name: 'Brochure', description: 'Mise en page multi-pages', active: true },
  { id: 'sg6', name: 'Packaging', description: 'Design d\'emballage produit', active: true },
  { id: 'sg7', name: 'Retouche photo', description: 'Correction et amélioration d\'image', active: true },
  { id: 'sg8', name: 'Vectorisation', description: 'Conversion image en vectoriel', active: false },
];

export interface StudioVersion {
  version: number;
  fileUrl: string;
  date: string;
  comment: string;
  status: 'en_attente' | 'approuve' | 'modification_demandee';
}

export interface StudioProject {
  id: string;
  reference: string;
  clientName: string;
  productName: string;
  graphiste: string;
  versions: StudioVersion[];
}

export const studioProjects: StudioProject[] = [
  {
    id: 'sp1', reference: 'DP-CMD-20260728-1042', clientName: 'Restaurant La Table', productName: 'Roll-up standard', graphiste: 'Ahmed Baba',
    versions: [
      { version: 1, fileUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=600&q=80', date: '2026-07-29', comment: 'Première proposition', status: 'modification_demandee' },
      { version: 2, fileUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80', date: '2026-07-30', comment: 'Couleurs ajustées suite retour client', status: 'en_attente' },
    ],
  },
];

/** Statistiques du tableau de bord — chiffres d'exemple, à brancher sur les vraies données. */
export const dashboardStats = {
  ordersCount: 87,
  quotesCount: 23,
  revenue: 1840000,
  newClients: 12,
  newReviews: 5,
  inProduction: 6,
  toDeliver: 4,
  pendingPayments: 3,
};

export const revenueByMonth = [
  { month: 'Fév', value: 210000 },
  { month: 'Mar', value: 260000 },
  { month: 'Avr', value: 190000 },
  { month: 'Mai', value: 310000 },
  { month: 'Juin', value: 280000 },
  { month: 'Juil', value: 340000 },
];

export const topProducts = [
  { name: 'Carte de visite standard', views: 412, orders: 38, revenue: 190000 },
  { name: 'Flyer A5', views: 356, orders: 29, revenue: 232000 },
  { name: 'Roll-up standard', views: 201, orders: 14, revenue: 588000 },
  { name: 'Casquette personnalisée', views: 178, orders: 11, revenue: 297000 },
];

export const recentActivity = [
  { id: 'a1', text: 'Nouvelle commande DP-CMD-20260730-5521 — Sahara Events', time: 'Il y a 2h' },
  { id: 'a2', text: 'Avis client publié — 5 étoiles', time: 'Il y a 4h' },
  { id: 'a3', text: 'Devis DP-DEV-20260730-8821 envoyé', time: 'Il y a 6h' },
  { id: 'a4', text: 'Paiement reçu — DP-CMD-20260729-9087', time: 'Hier' },
  { id: 'a5', text: 'Nouveau client inscrit — Mariem Vall', time: 'Hier' },
];
