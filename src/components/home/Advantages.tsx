import { useTranslations } from 'next-intl';
import { Truck, ShieldCheck, Clock, Palette } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const icons = [Truck, Clock, Palette, ShieldCheck] as const;

export function Advantages() {
  const t = useTranslations('advantages');
  const items = ['delivery', 'delay', 'design', 'quality'] as const;

  return (
    <div className="border-y border-ink/8 bg-ink py-10">
      <Container>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-0">
          {items.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} className="flex items-start gap-3 lg:border-s lg:border-white/10 lg:px-6 lg:first:border-s-0 lg:first:ps-0">
                <Icon size={22} className="mt-0.5 shrink-0 text-brand-yellow" />
                <p className="text-sm font-semibold text-paper/85">{t(key)}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
