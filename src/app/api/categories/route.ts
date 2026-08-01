import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/categories — toutes les catégories, racines et sous-catégories. */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('dp_categories').select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
