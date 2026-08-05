import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/admin/companies — ajoute une entreprise cliente (staff uniquement, via RLS). */
export async function POST(request: Request) {
  const { name, logoUrl, websiteUrl, publishConsent } = await request.json();
  if (!name) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });

  const supabase = createClient();
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data, error } = await supabase.from('dp_companies').insert({
    name, slug, logo_url: logoUrl || null, website_url: websiteUrl || null, publish_consent: publishConsent !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
