import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { clientCompanies } from '@/lib/mock/data';

/**
 * Défilement continu en CSS pur (aucune librairie) — boucle infinie fluide
 * obtenue en dupliquant la liste une fois et en animant sur 100% de son
 * propre déplacement. Se met en pause au survol pour rester lisible.
 * ⚠️ Logos d'exemple — à remplacer par les vraies entreprises clientes ayant donné leur accord.
 */
export function TrustedCompanies() {
  const t = useTranslations('trustedCompanies');
  const track = [...clientCompanies, ...clientCompanies];

  return (
    <div className="overflow-hidden border-y border-ink-8 py-14">
      <Container>
        <p className="mb-8 text-center font-mono text-xs font-bold uppercase tracking-widest text-ink-40">
          {t('title')}
        </p>
      </Container>

      <div className="group relative w-full overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]">
          {track.map((c, i) => (
            <Link
              key={`${c.id}-${i}`}
              href={`/clients/${c.slug}`}
              className="flex shrink-0 items-center gap-2.5 opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
            >
              <Image src={c.logoUrl} alt={c.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <span className="whitespace-nowrap text-sm font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
