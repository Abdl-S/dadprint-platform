import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** PATCH /api/admin/orders/[reference] — change le statut d'une commande (staff uniquement, via RLS). */
export async function PATCH(request: Request, { params }: { params: { reference: string } }) {
  const { status } = await request.json();
  if (!status) return NextResponse.json({ error: 'Statut requis' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_orders').update({ status, updated_at: new Date().toISOString() }).eq('reference', params.reference);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
