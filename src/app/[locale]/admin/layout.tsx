'use client';

import { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin/auth-context';
import { AdminShell } from '@/components/admin/AdminShell';
import { Logo } from '@/components/brand/Logo';
import { Lock } from 'lucide-react';

function AdminGate({ children }: { children: React.ReactNode }) {
  const { session, loading, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;

  if (!session) {
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setError(null);
      const result = await login(email, password);
      if (!result.success) setError(result.error ?? 'Connexion impossible.');
      setSubmitting(false);
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F2] p-5">
        <div className="w-full max-w-sm rounded-lg border border-ink-8 bg-white p-8 shadow-card">
          <Logo size="md" href={null} />
          <div className="mt-6 flex items-center gap-2 text-ink-40">
            <Lock size={15} />
            <p className="text-sm font-semibold">Espace administration</p>
          </div>
          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <input
              required type="email" placeholder="Email" aria-label="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink-15 p-3 text-sm"
            />
            <input
              required type="password" placeholder="Mot de passe" aria-label="Mot de passe" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-ink-15 p-3 text-sm"
            />
            {error && (
              <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>
            )}
            <button
              type="submit" disabled={submitting}
              className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper transition-all hover:-translate-y-0.5 hover:shadow-raised disabled:opacity-60"
            >
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
