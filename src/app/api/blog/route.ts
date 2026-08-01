import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/blog — articles publiés uniquement. */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_articles').select('*').eq('status', 'publie').order('published_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
