import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/**
 * POST /api/admin/invoices — crée une facture avec ses propres informations
 * client (nom, téléphone, email, adresse) et ses lignes détaillées — plus
 * besoin de passer par une commande existante, même si on peut toujours en
 * lier une pour garder la trace (staff uniquement, via RLS).
 */
export async function POST(request: Request) {
  const { orderReference, name, phone, email, address, lines } = await request.json();
  if (!name || !phone) return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 });
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
    client_name: name, client_phone: phone, client_email: email || null, client_address: address || null,
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
