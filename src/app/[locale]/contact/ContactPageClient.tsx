'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { CALL_NUMBER, buildWhatsAppUrl, buildTelUrl } from '@/lib/whatsapp';

export function ContactPageClient() {
  const t = useTranslations('contactPage');

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

          <form
            className="h-fit space-y-4 rounded-lg border border-ink-8 p-6"
            onSubmit={(e) => e.preventDefault() /* branchement Supabase/edge function à venir */}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder={t('name')} aria-label={t('name')} className="rounded-md border border-ink-15 p-3 text-sm" />
              <input required type="tel" placeholder={t('phone')} aria-label={t('phone')} className="rounded-md border border-ink-15 p-3 text-sm" />
            </div>
            <input type="email" placeholder={t('email')} aria-label={t('email')} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <input placeholder={t('subject')} aria-label={t('subject')} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <textarea required rows={5} placeholder={t('message')} aria-label={t('message')} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
            <Button type="submit" variant="magenta" className="w-full">{t('send')}</Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
