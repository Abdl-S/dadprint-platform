'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { studioProjects as initial } from '@/lib/mock/admin';

/** DadPrint Studio — espace graphiste : versions, commentaires, validation BAT. */
export default function AdminStudioPage() {
  const [projects, setProjects] = useState(initial);

  function sendNewVersion(projectId: string) {
    setProjects((prev) => prev.map((p) => {
      if (p.id !== projectId) return p;
      const nextVersion = p.versions.length + 1;
      return {
        ...p,
        versions: [...p.versions, {
          version: nextVersion, fileUrl: p.versions[0].fileUrl, date: new Date().toISOString().slice(0, 10),
          comment: 'Nouvelle version envoyée au client', status: 'en_attente' as const,
        }],
      };
    }));
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-70">Espace graphistes — versions, historique, validation BAT par le client.</p>

      {projects.map((project) => (
        <div key={project.id} className="rounded-lg border border-ink-8 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-xs text-ink-40">{project.reference}</p>
              <p className="font-bold">{project.productName} — {project.clientName}</p>
            </div>
            <span className="rounded-full bg-ink-8 px-3 py-1 text-xs font-bold">Graphiste : {project.graphiste}</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.versions.map((v) => (
              <div key={v.version} className="rounded-md border border-ink-8 p-3">
                <img src={v.fileUrl} alt="" className="aspect-square w-full rounded object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold">Version {v.version}</span>
                  {v.status === 'approuve' && <CheckCircle2 size={14} className="text-success" />}
                  {v.status === 'modification_demandee' && <MessageSquareWarning size={14} className="text-brand-magenta" />}
                  {v.status === 'en_attente' && <span className="text-[10px] font-bold text-ink-40">En attente</span>}
                </div>
                <p className="mt-1 text-xs text-ink-40">{v.comment}</p>
              </div>
            ))}
          </div>

          <button onClick={() => sendNewVersion(project.id)} className="mt-4 flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-xs font-bold text-paper">
            <Upload size={14} /> Envoyer une nouvelle version au client
          </button>
        </div>
      ))}
    </div>
  );
}
