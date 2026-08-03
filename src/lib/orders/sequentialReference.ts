import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Génère une référence séquentielle réelle (DP-DEV-2026-0001, DP-FAC-2026-0001,
 * DP-CMD-2026-0001...). Le compteur vit en base (`dp_next_reference`),
 * incrémenté de façon atomique — jamais de doublon possible même en cas de
 * créations simultanées. Utilisé pour les devis, factures et commandes.
 */
export async function generateSequentialReference(
  supabase: SupabaseClient,
  type: 'devis' | 'facture' | 'commande'
): Promise<string> {
  const prefix = type === 'devis' ? 'DEV' : type === 'facture' ? 'FAC' : 'CMD';
  const year = new Date().getFullYear();

  const { data, error } = await supabase.rpc('dp_next_reference', { p_type: type, p_year: year });
  if (error || data == null) {
    throw new Error(`Impossible de générer la référence : ${error?.message ?? 'réponse vide'}`);
  }

  const counter = String(data).padStart(4, '0');
  return `DP-${prefix}-${year}-${counter}`;
}
