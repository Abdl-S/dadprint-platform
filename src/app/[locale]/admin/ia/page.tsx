import { Sparkles, FileText, Search, Lightbulb, Calendar, MessageCircle } from 'lucide-react';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;


const features = [
  { icon: FileText, title: 'Génération de descriptions', desc: 'Rédige automatiquement la description courte et détaillée d\'un nouveau produit.' },
  { icon: Search, title: 'SEO assisté', desc: 'Suggère titres, meta descriptions et mots-clés pour chaque page ou article.' },
  { icon: Lightbulb, title: 'Suggestions', desc: 'Recommande des packs, des produits liés ou des ajustements de prix.' },
  { icon: Calendar, title: 'Résumé quotidien', desc: 'Un résumé automatique chaque matin : commandes, devis, alertes du jour.' },
  { icon: MessageCircle, title: 'Assistant interne', desc: 'Répond aux questions de l\'équipe sur les commandes, stocks et statuts.' },
];

/**
 * Module IA — emplacement prêt, fonctionnement non développé (demande
 * explicite). Chaque carte correspond à un cas d'usage déjà identifié ;
 * le jour où ce module sera activé, il consommera les mêmes données
 * (`lib/mock/*` puis Supabase) que le reste de l'administration.
 */
export default function AdminIaPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-ink p-6 text-paper">
        <Sparkles size={22} className="text-brand-yellow" />
        <h2 className="mt-3 text-lg font-bold">Assistant IA DadPrint</h2>
        <p className="mt-1.5 max-w-lg text-sm text-paper/70">
          Emplacement prêt pour un futur assistant IA — non activé pour l'instant. Chaque module ci-dessous
          représente un cas d'usage déjà identifié, à développer dans une prochaine étape.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-dashed border-ink-15 bg-white p-5">
            <f.icon size={20} className="text-brand-magenta" />
            <h3 className="mt-3 font-bold">{f.title}</h3>
            <p className="mt-1.5 text-xs text-ink-70">{f.desc}</p>
            <span className="mt-3 inline-block rounded-full bg-ink-8 px-2.5 py-1 text-[10px] font-bold uppercase text-ink-40">Bientôt disponible</span>
          </div>
        ))}
      </div>
    </div>
  );
}
