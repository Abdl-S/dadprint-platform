import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/reviews — avis approuvés uniquement (site public). */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_reviews').select('*').eq('moderation_status', 'approuve').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** POST /api/reviews — soumission d'un avis client. Reste "en_attente" jusqu'à modération admin. */
export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, productId, authorName, companyName, showCompany, rating, qualityRating, communicationRating, delayRating, deliveryRating, designRating, comment, photoUrls } = body;

  if (!rating || !comment) return NextResponse.json({ error: 'Note et commentaire requis' }, { status: 400 });

  const supabase = createClient();
  const { error } = await supabase.from('dp_reviews').insert({
    order_id: orderId ?? null, product_id: productId ?? null, author_name: authorName, company_name: companyName,
    show_company: showCompany ?? false, rating, quality_rating: qualityRating, communication_rating: communicationRating,
    delay_rating: delayRating, delivery_rating: deliveryRating, design_rating: designRating,
    comment: { fr: comment }, photo_urls: photoUrls ?? [], moderation_status: 'en_attente',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
