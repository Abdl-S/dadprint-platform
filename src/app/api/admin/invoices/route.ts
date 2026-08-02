import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/** POST /api/admin/invoices — crée une facture, liée ou non à une commande (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { orderReference, amount } = await request.json();
  if (!amount) return NextResponse.json({ error: 'Montant requis' }, { status: 400 });

  const supabase = createClient();
  let orderId: string | null = null;
  if (orderReference) {
    const { data: order } = await supabase.from('dp_orders').select('id').eq('reference', orderReference).single();
    orderId = order?.id ?? null;
  }

  let reference: string;
  try {
    reference = await generateSequentialReference(supabase, 'facture');
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur de référence' }, { status: 500 });
  }

  const { error } = await supabase.from('dp_invoices').insert({
    order_id: orderId, reference, amount, status: 'en_attente',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reference }, { status: 201 });
}
