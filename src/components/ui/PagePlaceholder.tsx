import { Container } from './Container';
import { Section } from './Section';

/**
 * Placeholder temporaire pour les pages pas encore développées.
 * À supprimer route par route au fur et à mesure du développement des fonctionnalités.
 */
export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <Section className="min-h-[50vh]">
      <Container>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">
          En construction
        </span>
        <h1 className="mt-3 text-4xl font-black">{title}</h1>
        {description && <p className="mt-4 max-w-lg text-ink-70">{description}</p>}
      </Container>
    </Section>
  );
}
