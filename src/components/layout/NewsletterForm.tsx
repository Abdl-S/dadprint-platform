'use client';

import { useState } from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Extrait du Footer (composant serveur) car un gestionnaire d'événement
 * (onSubmit) ne peut jamais être passé depuis un Server Component —
 * Next.js refuse de sérialiser une fonction vers le client.
 * Écrit réellement dans dp_newsletter_subscribers via /api/newsletter.
 */
export function NewsletterForm() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-1.5 text-sm font-semibold text-paper">
        <Check size={15} /> {t('newsletterSuccess')}
      </p>
    );
  }

  return (
    <form className="flex w-full max-w-xs gap-2" onSubmit={handleSubmit}>
      <input
        type="email" required placeholder={t('newsletterPlaceholder')}
        value={email} onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-paper/15 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper/40"
      />
      <button
        type="submit" disabled={status === 'loading'} aria-label={t('newsletterSubmit')}
        className="flex shrink-0 items-center justify-center rounded-md bg-brand-magenta px-3 disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
      </button>
    </form>
  );
}
