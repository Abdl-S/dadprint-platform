import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/orders/[reference] — suivi public d'une commande (utilisé par
 * /suivi et /avis/evaluation). Accepte soit la référence complète, soit
 * juste ses derniers chiffres (ex : "1834" retrouve "DP-CMD-2026-1834") —
 * cherche la commande la plus récente qui se termine par ce qui est tapé.
 */
export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createClient();
  const query = params.reference.trim().toUpperCase();

  const { data, error } = await supabase
    .from('dp_orders')
    .select('id, reference, status, created_at, delivery_mode, dp_order_lines(product_id, dp_products(name))')
    .ilike('reference', `%${query}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  const line = (data as any).dp_order_lines?.[0];
  return NextResponse.json({
    id: data.id, reference: data.reference, status: data.status, created_at: data.created_at, delivery_mode: data.delivery_mode,
    productId: line?.product_id ?? null, productName: line?.dp_products?.name?.fr ?? null,
  });
}
