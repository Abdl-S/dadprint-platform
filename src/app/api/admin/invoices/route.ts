import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/**
 * POST /api/admin/invoices — crée une facture avec ses lignes détaillées
 * (description, quantité, prix), liée ou non à une commande (staff
 * uniquement, via RLS). Le montant total est calculé à partir des lignes.
 */
export async function POST(request: Request) {
  const { orderReference, lines } = await request.json();
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Au moins une ligne est requise' }, { status: 400 });
  }

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

  const totalAmount = lines.reduce((sum: number, l: { qty: number; unitPrice: number }) => sum + l.qty * l.unitPrice, 0);

  const { data: invoice, error } = await supabase.from('dp_invoices').insert({
    order_id: orderId, reference, amount: totalAmount, status: 'en_attente',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('dp_invoice_lines').insert(
    lines.map((l: { description: string; qty: number; unitPrice: number }, i: number) => ({
      invoice_id: invoice.id,
      description: { fr: l.description, en: l.description, ar: l.description },
      quantity: l.qty, unit_price: l.unitPrice, sort_order: i,
    }))
  );

  return NextResponse.json({ reference, amount: totalAmount }, { status: 201 });
}
