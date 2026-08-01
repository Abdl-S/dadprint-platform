import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/products/[slug] — fiche produit complète (specs, conseils, champs de formulaire). */
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from('dp_products').select('*').eq('slug', params.slug).single();
  if (error || !product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  const [{ data: specs }, { data: tips }, { data: formFields }] = await Promise.all([
    supabase.from('dp_product_specs').select('*').eq('product_id', product.id).order('sort_order'),
    supabase.from('dp_product_tips').select('*').eq('product_id', product.id).order('sort_order'),
    supabase.from('dp_form_fields').select('*').eq('product_id', product.id).order('sort_order'),
  ]);

  return NextResponse.json({ ...product, specs, tips, formFields });
}
