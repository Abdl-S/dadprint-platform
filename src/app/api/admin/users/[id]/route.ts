import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/admin/users/[id] — change le rôle et/ou le statut actif d'un
 * membre de l'équipe (staff uniquement, via RLS — voir "profiles self access").
 * Ne permet jamais d'attribuer le rôle "client" depuis cet écran : ce rôle
 * n'existe que via l'inscription publique normale.
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { role, active } = await request.json();
  if (role === 'client') return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });

  const supabase = createClient();
  const update: Record<string, unknown> = {};

  if (role) {
    const { data: roleRow } = await supabase.from('dp_roles').select('id').eq('key', role).single();
    if (!roleRow) return NextResponse.json({ error: 'Rôle introuvable' }, { status: 400 });
    update.role_id = roleRow.id;
  }
  if (typeof active === 'boolean') update.active = active;

  const { error } = await supabase.from('dp_profiles').update(update).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
