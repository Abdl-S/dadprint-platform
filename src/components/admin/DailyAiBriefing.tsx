import { Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardStats, topProducts, adminOrders } from '@/lib/mock/admin';

/**
 * Résumé quotidien — calculé à partir des données déjà en mémoire (pas
 * d'appel LLM ici, seulement des règles simples sur les vraies données de
 * l'admin). Le jour où un vrai modèle sera branché, il pourra remplacer les
 * `recommendations` ci-dessous par un texte généré, sans changer l'affichage.
 */
export function DailyAiBriefing() {
  const urgentOrders = adminOrders.filter((o) => o.status === 'nouveau' || o.status === 'en_attente');
  const topProduct = [...topProducts].sort((a, b) => b.revenue - a.revenue)[0];

  const recommendations = [
    urgentOrders.length > 0
      ? `${urgentOrders.length} commande(s) en attente de traitement — à prioriser aujourd'hui.`
      : 'Aucune commande urgente en attente — bonne journée pour avancer le catalogue.',
    `"${topProduct?.name}" est le produit le plus rentable ce mois-ci — envisager une mise en avant sur l'accueil.`,
    dashboardStats.pendingPayments > 0
      ? `${dashboardStats.pendingPayments} paiement(s) en attente de confirmation.`
      : 'Tous les paiements récents sont confirmés.',
  ];

  return (
    <div className="rounded-lg bg-ink p-6 text-paper">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-brand-yellow" />
        <h3 className="font-bold">Résumé du jour — Assistant IA</h3>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div><p className="text-2xl font-black">{dashboardStats.quotesCount}</p><p className="text-[11px] text-paper/60">Devis</p></div>
        <div><p className="text-2xl font-black">{dashboardStats.ordersCount}</p><p className="text-[11px] text-paper/60">Commandes</p></div>
        <div><p className="text-2xl font-black">{dashboardStats.newClients}</p><p className="text-[11px] text-paper/60">Nouveaux clients</p></div>
        <div><p className="text-2xl font-black">{dashboardStats.newReviews}</p><p className="text-[11px] text-paper/60">Nouveaux avis</p></div>
      </div>
      <div className="mt-5 space-y-2 border-t border-paper/10 pt-4">
        {recommendations.map((r, i) => (
          <p key={i} className="flex items-start gap-2 text-xs text-paper/80">
            {i === 0 && urgentOrders.length > 0 ? <AlertTriangle size={13} className="mt-0.5 shrink-0 text-brand-yellow" /> : <TrendingUp size={13} className="mt-0.5 shrink-0 text-brand-cyan" />}
            {r}
          </p>
        ))}
      </div>
    </div>
  );
}
