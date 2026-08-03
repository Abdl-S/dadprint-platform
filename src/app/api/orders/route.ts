import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSequentialReference } from '@/lib/orders/sequentialReference';

/** POST /api/orders — crée une commande + sa ligne. Déclenche aussi une notification interne (via trigger applicatif côté admin). */
export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, productId, quantity, unitPrice, options, deliveryMode, addressId, designChoice, designBrief, paymentPreference } = body;

  if (!name || !phone || !productId) {
    return NextResponse.json({ error: 'Nom, téléphone et produit requis' }, { status: 400 });
  }

  const supabase = createClient();
  let reference: string;
  try {
    reference = await generateSequentialReference(supabase, 'commande');
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur de référence' }, { status: 500 });
  }
  const { data: { user } } = await supabase.auth.getUser();

  const { data: order, error } = await supabase.from('dp_orders').insert({
    reference, client_name: name, client_phone: phone, status: 'nouveau',
    client_id: user?.id ?? null,
    delivery_mode: deliveryMode ?? 'delivery', address_id: addressId ?? null,
    design_choice: designChoice ?? null, design_brief: designBrief ?? null, total_amount: (unitPrice ?? 0) * (quantity ?? 1),
    payment_preference: paymentPreference ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('dp_order_lines').insert({ order_id: order.id, product_id: productId, quantity: quantity ?? 1, unit_price: unitPrice ?? null, options: options ?? {} });

  return NextResponse.json({ reference, id: order.id }, { status: 201 });
}
