import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase public, sans gestion de cookies/session.
 *
 * À utiliser uniquement pour des données publiques en lecture (catalogue,
 * packs, portfolio, avis approuvés...) — jamais pour des données liées à un
 * utilisateur connecté (voir `lib/supabase/server.ts` pour ce cas).
 *
 * Pourquoi un client séparé : `lib/supabase/server.ts` lit les cookies via
 * `next/headers`, ce qui plante si la fonction est appelée en dehors d'une
 * requête HTTP — typiquement dans `generateStaticParams`, exécuté au moment
 * du build. Les données du catalogue n'ont jamais besoin de session, donc ce
 * client stateless fonctionne indifféremment au build et à la requête.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
