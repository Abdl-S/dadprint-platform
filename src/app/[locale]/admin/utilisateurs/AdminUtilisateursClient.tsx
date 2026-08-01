'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Toggle } from '@/components/admin/Toggle';
import { rolePermissions } from '@/lib/mock/admin';
import type { AdminRole } from '@/lib/admin/auth-context';
import type { AdminUserRow } from '@/lib/data/admin';

const roleLabels: Record<AdminRole, string> = {
  administrateur: 'Administrateur', commercial: 'Commercial', graphiste: 'Graphiste',
  production: 'Production', livreur: 'Livreur', support: 'Support',
};

export function AdminUtilisateursClient({ initial }: { initial: AdminUserRow[] }) {
  const [users, setUsers] = useState<AdminUserRow[]>(initial);

  async function updateUser(id: string, patch: { role?: AdminRole; active?: boolean }) {
    const previous = users;
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    });
    if (!res.ok) { setUsers(previous); alert('La mise à jour a échoué.'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-70">{users.length} utilisateurs — chaque rôle a ses permissions.</p>
        <button
          onClick={() => alert("Pour ajouter un membre de l'équipe : la personne crée un compte normal via /inscription, puis un administrateur promeut ce compte en base (aucune interface ne le permet, par sécurité).")}
          className="flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 text-sm font-bold text-white shadow-glow"
        >
          <Plus size={16} /> Inviter un utilisateur
        </button>
      </div>

      <AdminTable headers={['Nom', 'Email', 'Rôle', 'Actif', '']}>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3 font-semibold">{u.name}</td>
            <td className="px-4 py-3 text-ink-70">{u.email}</td>
            <td className="px-4 py-3">
              <select
                aria-label="Rôle de l'utilisateur"
                value={u.role}
                onChange={(e) => updateUser(u.id, { role: e.target.value as AdminRole })}
                className="rounded-md border border-ink-15 p-1.5 text-xs font-bold"
              >
                {Object.entries(roleLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </td>
            <td className="px-4 py-3"><Toggle checked={u.active} onChange={(v) => updateUser(u.id, { active: v })} /></td>
            <td className="px-4 py-3"></td>
          </tr>
        ))}
      </AdminTable>

      <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-bold">Permissions par rôle</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(rolePermissions).map(([role, perms]) => (
            <div key={role} className="rounded-md bg-ink-8/40 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide">{roleLabels[role as AdminRole]}</p>
              <ul className="space-y-1 text-xs text-ink-70">
                {perms.map((p) => <li key={p}>• {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
