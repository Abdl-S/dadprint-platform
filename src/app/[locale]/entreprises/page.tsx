import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default function EntreprisesPage() {
  return (
    <PagePlaceholder
      title="Espace entreprises"
      description="Offre B2B dédiée : comptes entreprises, conditions spécifiques, commandes récurrentes."
    />
  );
}
