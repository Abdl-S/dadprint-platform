import type { LucideIcon } from 'lucide-react';

export function StatCard({
  icon: Icon, label, value, accent = 'ink',
}: { icon: LucideIcon; label: string; value: string; accent?: 'ink' | 'magenta' | 'cyan' | 'success' }) {
  const accents = {
    ink: 'bg-ink/5 text-ink',
    magenta: 'bg-brand-magenta/10 text-brand-magenta',
    cyan: 'bg-brand-cyan/10 text-brand-cyan',
    success: 'bg-success/10 text-success',
  };
  return (
    <div className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>
        <Icon size={17} />
      </div>
      <div className="mt-3 text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-semibold text-ink-40">{label}</div>
    </div>
  );
}
