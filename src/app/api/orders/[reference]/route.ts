import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/orders/[reference] — suivi public d'une commande par sa référence (utilisé par /suivi). */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_orders').select('reference, status, created_at, delivery_mode').eq('reference', params.reference).single();
  if (error || !data) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
  return NextResponse.json(data);
}
