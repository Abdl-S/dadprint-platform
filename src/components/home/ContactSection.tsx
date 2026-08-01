'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { MapPin, Mail, Phone } from 'lucide-react';
import { CALL_NUMBER } from '@/lib/whatsapp';

export function ContactSection() {
  const t = useTranslations('contact');

  return (
    <Section className="bg-ink-8/40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
            <p className="mt-4 max-w-sm text-ink-70">{t('description')}</p>

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-center gap-3"><Phone size={17} className="text-brand-magenta" /> {CALL_NUMBER}</li>
              <li className="flex items-center gap-3"><Mail size={17} className="text-brand-magenta" /> contact@dadprint.mr</li>
              <li className="flex items-center gap-3"><MapPin size={17} className="text-brand-magenta" /> Nouakchott, Mauritanie</li>
            </ul>
          </div>

          <form
            className="space-y-4 rounded-lg bg-paper p-6 shadow-sm"
            onSubmit={(e) => e.preventDefault() /* branchement Supabase/edge function à venir */}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder={t('name')} className="rounded-md border border-ink-15 p-3 text-sm" />
              <input required type="tel" placeholder={t('phone')} className="rounded-md border border-ink-15 p-3 text-sm" />
            </div>
            <input type="email" placeholder={t('email')} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <textarea required rows={4} placeholder={t('message')} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <Button type="submit" variant="magenta" className="w-full">{t('send')}</Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
