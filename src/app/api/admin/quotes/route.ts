import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferenceNumber } from '@/lib/orders/reference';

/**
 * POST /api/admin/quotes — crée un devis directement depuis l'admin (staff
 * uniquement, via RLS). Utile pour un devis pris par téléphone ou en
 * personne, sans passer par le formulaire public.
 */
export async function POST(request: Request) {
  const { name, phone, email, city, productSlug, comments, status } = await request.json();
  if (!name || !phone) return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 });

  const supabase = createClient();
  const reference = generateReferenceNumber('devis');

  const { data: quote, error } = await supabase.from('dp_quotes').insert({
    reference, client_name: name, client_phone: phone, client_email: email || null,
    city: city || null, comments: comments || null, status: status || 'nouveau',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (productSlug) {
    const { data: product } = await supabase.from('dp_products').select('id').eq('slug', productSlug).single();
    if (product) await supabase.from('dp_quote_lines').insert({ quote_id: quote.id, product_id: product.id });
  }

  return NextResponse.json({ reference }, { status: 201 });
}
