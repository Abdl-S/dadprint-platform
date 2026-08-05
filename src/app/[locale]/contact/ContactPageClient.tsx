'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CALL_NUMBER, buildWhatsAppUrl, buildTelUrl } from '@/lib/whatsapp';

export function ContactPageClient() {
  const t = useTranslations('contactPage');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message: subject ? `[${subject}] ${message}` : message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Une erreur est survenue.');
      }
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-4xl font-black sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-lg text-ink-70">{t('subtitle')}</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Phone size={19} className="mt-0.5 shrink-0 text-brand-magenta" />
                <div>
                  <p className="font-bold">{t('phoneLabel')}</p>
                  <a href={buildTelUrl()} className="text-sm text-ink-70">{CALL_NUMBER}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <WhatsAppIcon size={19} className="mt-0.5 shrink-0 text-brand-magenta" />
                <div>
                  <p className="font-bold">WhatsApp</p>
                  <a href={buildWhatsAppUrl({ intent: 'general' })} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-70">
                    {t('whatsappCta')}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={19} className="mt-0.5 shrink-0 text-brand-magenta" />
                <div>
                  <p className="font-bold">Email</p>
                  <a href="mailto:contact@dadprint.mr" className="text-sm text-ink-70">contact@dadprint.mr</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-brand-magenta" />
                <div>
                  <p className="font-bold">{t('addressLabel')}</p>
                  <p className="text-sm text-ink-70">Nouakchott, Mauritanie</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={19} className="mt-0.5 shrink-0 text-brand-magenta" />
                <div>
                  <p className="font-bold">{t('hoursLabel')}</p>
                  <p className="text-sm text-ink-70">{t('hoursValue')}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-15">
                <Instagram size={17} />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-15">
                <Facebook size={17} />
              </a>
            </div>

            <div className="mt-10 aspect-video overflow-hidden rounded-lg border border-ink-8">
              <iframe
                title="DadPrint — Nouakchott"
                src="https://www.google.com/maps?q=Nouakchott,Mauritanie&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>

          {sent ? (
            <div className="flex h-fit flex-col items-center justify-center rounded-lg border border-ink-8 p-10 text-center">
              <CheckCircle2 size={32} className="text-success" />
              <p className="mt-4 font-bold">Message envoyé !</p>
              <p className="mt-2 text-sm text-ink-70">Notre équipe vous répond rapidement.</p>
            </div>
          ) : (
            <form className="h-fit space-y-4 rounded-lg border border-ink-8 p-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder={t('name')} aria-label={t('name')} value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
                <input required type="tel" placeholder={t('phone')} aria-label={t('phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
              </div>
              <input type="email" placeholder={t('email')} aria-label={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              <input placeholder={t('subject')} aria-label={t('subject')} value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              <textarea required rows={5} placeholder={t('message')} aria-label={t('message')} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
              {submitError && (
                <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{submitError}</p>
              )}
              <Button type="submit" variant="magenta" className="w-full" loading={submitting} disabled={submitting}>{t('send')}</Button>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}
