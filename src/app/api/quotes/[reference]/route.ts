import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/quotes/[reference] — suivi public d'un devis par sa référence. */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_quotes').select('reference, status, created_at').eq('reference', params.reference).single();
  if (error || !data) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
  return NextResponse.json(data);
}
