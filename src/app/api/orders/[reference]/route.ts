import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/orders/[reference] — suivi public d'une commande par sa référence (utilisé par /suivi et /avis/evaluation). */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_orders')
    .select('id, reference, status, created_at, delivery_mode, dp_order_lines(product_id, dp_products(name))')
    .eq('reference', params.reference).single();
  if (error || !data) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  const line = (data as any).dp_order_lines?.[0];
  return NextResponse.json({
    id: data.id, reference: data.reference, status: data.status, created_at: data.created_at, delivery_mode: data.delivery_mode,
    productId: line?.product_id ?? null, productName: line?.dp_products?.name?.fr ?? null,
  });
}
