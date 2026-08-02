import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Génère une référence séquentielle réelle (DP-DEV-2026-0001, DP-FAC-2026-0001...),
 * remplace l'ancien tirage aléatoire pour les devis et les factures. Le
 * compteur vit en base (`dp_next_reference`), incrémenté de façon atomique —
 * jamais de doublon possible même en cas de créations simultanées.
 *
 * Les commandes gardent volontairement l'ancien format (référence + date +
 * nombre aléatoire) — non demandé pour ce type de document.
 */
export async function generateSequentialReference(
  supabase: SupabaseClient,
  type: 'devis' | 'facture'
): Promise<string> {
  const prefix = type === 'devis' ? 'DEV' : 'FAC';
  const year = new Date().getFullYear();

  const { data, error } = await supabase.rpc('dp_next_reference', { p_type: type, p_year: year });
  if (error || data == null) {
    throw new Error(`Impossible de générer la référence : ${error?.message ?? 'réponse vide'}`);
  }

  const counter = String(data).padStart(4, '0');
  return `DP-${prefix}-${year}-${counter}`;
}
