import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/notifications — notifications destinées au staff (staff
 * uniquement, via RLS). Chacun ne voit que ce qui le concerne : les
 * notifications génériques (sans rôle précisé) et celles ciblant son propre
 * rôle. Un administrateur voit toujours tout, quel que soit le ciblage.
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const { data: profile } = await supabase
    .from('dp_profiles')
    .select('dp_roles(key)')
    .eq('id', user.id)
    .single();
  const roleKey = (profile as any)?.dp_roles?.key;

  let query = supabase
    .from('dp_notifications')
    .select('*, dp_roles(key)')
    .is('target_client_id', null)
    .order('created_at', { ascending: false })
    .limit(20);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // L'administrateur voit tout ; les autres rôles ne voient que le générique + le leur.
  const filtered = roleKey === 'administrateur'
    ? data
    : (data ?? []).filter((n: any) => !n.dp_roles || n.dp_roles.key === roleKey);

  return NextResponse.json({ data: filtered ?? [] });
}
