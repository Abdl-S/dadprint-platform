import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/quotes/[reference] — suivi public d'un devis. Accepte soit la
 * référence complète, soit juste ses derniers chiffres — même logique que
 * pour les commandes.
 */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const query = params.reference.trim().toUpperCase();

  const { data, error } = await supabase
    .from('dp_quotes').select('reference, status, created_at')
    .ilike('reference', `%${query}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
  return NextResponse.json(data);
}
