import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { ALL_STEPS } from '@/lib/mock/tracking';
import type { TrackingStep } from '@/types';

export function StatusTimeline({
  currentStep, completedSteps,
}: { currentStep: TrackingStep; completedSteps: TrackingStep[] }) {
  const t = useTranslations('tracking');
  const currentIndex = ALL_STEPS.indexOf(currentStep);

  return (
    <ol className="space-y-0">
      {ALL_STEPS.map((step, i) => {
        const done = completedSteps.includes(step) || i < currentIndex;
        const active = step === currentStep;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {i < ALL_STEPS.length - 1 && (
              <span
                className={`absolute start-[15px] top-8 h-full w-0.5 ${done ? 'bg-ink' : 'bg-ink-15'}`}
              />
            )}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                done ? 'border-ink bg-ink text-paper' : active ? 'border-brand-magenta text-brand-magenta' : 'border-ink-15 text-ink-15'
              }`}
            >
              {done ? <Check size={15} /> : i + 1}
            </span>
            <div className="pt-1">
              <p className={`font-bold ${active ? 'text-brand-magenta' : ''}`}>{t(`steps.${step}`)}</p>
              {active && <p className="mt-0.5 text-xs text-ink-40">{t('inProgress')}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
