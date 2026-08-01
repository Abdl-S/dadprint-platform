import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMyOrders } from '@/lib/data/content';
import type { Locale } from '@/types';
import { ComptePageClient } from './ComptePageClient';

/**
 * Espace client — protégé : redirige vers /connexion si personne n'est
 * authentifié. Les commandes affichées dans l'onglet "Devis" sont réelles
 * (RLS restreint déjà l'accès aux lignes du client connecté, ceci est une
 * seconde barrière côté page). Les autres onglets (paiements, fichiers,
 * marques, favoris, avis, adresses, notifications) restent sur des données
 * d'exemple — même principe de branchement à appliquer, pas fait dans cette
 * étape par souci de temps.
 */
export default async function ComptePage({ params: { locale } }: { params: { locale: Locale } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/connexion?next=/compte`);
  }

  const [orders, { data: profile }] = await Promise.all([
    getMyOrders(),
    supabase.from('dp_profiles').select('full_name, phone, email').eq('id', user!.id).single(),
  ]);

  return (
    <ComptePageClient
      orders={orders}
      profile={{ name: profile?.full_name ?? '', phone: profile?.phone ?? '', email: profile?.email ?? user!.email ?? '' }}
    />
  );
}
