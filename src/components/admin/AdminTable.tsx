import type { ReactNode } from 'react';

export function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-8 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-8 bg-ink-8/40">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 text-start text-xs font-bold uppercase tracking-wide text-ink-40">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-8">{children}</tbody>
      </table>
    </div>
  );
}
