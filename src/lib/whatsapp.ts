/**
 * Construction centralisée des messages WhatsApp pré-remplis.
 * Un seul endroit à modifier si le format du message doit changer un jour.
 */
export const WHATSAPP_NUMBER = '22234763421'; // Numéro officiel confirmé : +222 34 76 34 21
export const CALL_NUMBER = '+22234763421';

export interface WaOrderDetails {
  reference?: string;
  name?: string;
  phone?: string;
  productName?: string;
  categoryName?: string;
  quantity?: string | number;
  options?: { label: string; value: string }[];
  comments?: string;
  fileLinks?: string[];
  delivery?: { mode: 'delivery' | 'pickup'; address?: string; city?: string };
  intent: 'commande' | 'devis' | 'assistance' | 'general';
}

/** Message complet et professionnel — jamais un simple "je veux commander X". */
export function buildWhatsAppMessage(ctx: WaOrderDetails): string {
  const lines: string[] = ['Bonjour DadPrint 👋'];

  if (ctx.intent === 'commande' || ctx.intent === 'devis') {
    lines.push('');
    lines.push(ctx.intent === 'commande' ? '📦 Nouvelle commande' : '📝 Demande de devis');
    if (ctx.reference) lines.push(`Référence : ${ctx.reference}`);
    if (ctx.productName) lines.push(`Produit : ${ctx.productName}`);
    if (ctx.name) lines.push(`Nom : ${ctx.name}`);
    if (ctx.phone) lines.push(`Téléphone : ${ctx.phone}`);
    if (ctx.quantity) lines.push(`Quantité : ${ctx.quantity}`);
    if (ctx.options && ctx.options.length > 0) {
      lines.push('Options :');
      ctx.options.forEach((o) => lines.push(`  • ${o.label} : ${o.value}`));
    }
    if (ctx.delivery) {
      lines.push(
        ctx.delivery.mode === 'delivery'
          ? `Livraison : ${[ctx.delivery.address, ctx.delivery.city].filter(Boolean).join(', ') || 'adresse à préciser'}`
          : 'Livraison : retrait à l\'atelier'
      );
    }
    if (ctx.comments) lines.push(`Commentaires : ${ctx.comments}`);
    if (ctx.fileLinks && ctx.fileLinks.length > 0) {
      lines.push('Fichiers :');
      ctx.fileLinks.forEach((f) => lines.push(`  ${f}`));
    }
  } else if (ctx.intent === 'assistance') {
    lines.push('', "J'ai besoin d'aide pour choisir un produit.");
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(ctx: WaOrderDetails): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(ctx))}`;
}

/**
 * Envoie un message VERS le numéro d'un client (utilisé par l'admin pour
 * répondre/confirmer), à ne jamais confondre avec `buildWhatsAppUrl` qui
 * envoie toujours vers le numéro de DadPrint lui-même.
 */
export function buildWhatsAppUrlToClient(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^\d]/g, '');
  const withCountryCode = digitsOnly.startsWith('222') ? digitsOnly : `222${digitsOnly}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(): string {
  return `tel:${CALL_NUMBER}`;
}
