'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

export type AdminRole = 'administrateur' | 'commercial' | 'graphiste' | 'production' | 'livreur' | 'support';

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

interface AdminAuthValue {
  session: AdminSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

/**
 * Authentification admin réelle — Supabase Auth, même compte que les
 * clients (une seule base d'utilisateurs), mais l'accès admin exige que le
 * profil ait un rôle différent de "client". Un client qui se connecte ici
 * par erreur est immédiatement déconnecté avec un message clair : ce n'est
 * pas la bonne porte d'entrée.
 *
 * Promouvoir un compte en staff se fait uniquement en base (jamais depuis
 * l'interface) : `update dp_profiles set role_id = (select id from dp_roles
 * where key = 'administrateur') where email = '...'`.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function loadStaffSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSession(null);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('dp_profiles')
      .select('id, full_name, email, dp_roles(key)')
      .eq('id', user.id)
      .single();

    const roleKey = (profile as any)?.dp_roles?.key;
    if (!profile || !roleKey || roleKey === 'client') {
      setSession(null);
      setLoading(false);
      return;
    }

    setSession({ id: profile.id, name: profile.full_name ?? profile.email, email: profile.email, role: roleKey });
    setLoading(false);
  }

  useEffect(() => {
    loadStaffSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => loadStaffSession());
    return () => subscription.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return { success: false, error: 'Email ou mot de passe incorrect.' };

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('dp_profiles')
      .select('id, full_name, email, dp_roles(key)')
      .eq('id', user!.id)
      .single();

    const roleKey = (profile as any)?.dp_roles?.key;
    if (!profile || !roleKey || roleKey === 'client') {
      await supabase.auth.signOut();
      setSession(null);
      return { success: false, error: "Ce compte n'a pas accès à l'administration." };
    }

    setSession({ id: profile.id, name: profile.full_name ?? profile.email, email: profile.email, role: roleKey });
    return { success: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <AdminAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
