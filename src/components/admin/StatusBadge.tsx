export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${className ?? 'bg-ink-8 text-ink'}`}>
      {label}
    </span>
  );
}
