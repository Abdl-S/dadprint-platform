import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Envoie une notification ciblée à un rôle précis de l'équipe (commercial,
 * support...) plutôt qu'à tout le monde sans distinction. L'administrateur
 * voit toujours toutes les notifications quel que soit le rôle ciblé ici —
 * ce filtrage se fait à la lecture (`/api/admin/notifications`), pas ici.
 */
export async function notifyRole(
  supabase: SupabaseClient,
  roleKey: 'commercial' | 'support' | 'graphiste' | 'production' | 'livreur',
  title: string,
  body: string,
  reference?: string
) {
  const { data: role } = await supabase.from('dp_roles').select('id').eq('key', roleKey).single();
  await supabase.from('dp_notifications').insert({
    title, body, reference: reference ?? null, channels: ['app'], target_role_id: role?.id ?? null,
  });
}
