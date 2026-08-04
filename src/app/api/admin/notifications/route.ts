import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** GET /api/admin/notifications — notifications destinées au staff (staff uniquement, via RLS). */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dp_notifications')
    .select('*')
    .is('target_client_id', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
