import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, AlertCircle, Pill } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { participants, getGroup } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/participantes")({
  head: () => ({ meta: [{ title: "Participantes · CampaWeb" }] }),
  component: ParticipantsPage,
});

function ParticipantsPage() {
  useCampStore();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return participants;
    return participants.filter((p) =>
      `${p.name} ${p.lastName} ${p.hometown}`.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <AppShell>
      <PageHeader eyebrow={`${participants.length} chavales`} title="Participantes" />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, apellido o ciudad…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-foreground"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((p) => {
          const g = getGroup(p.groupId);
          return (
            <div key={p.id} className="bg-white border border-border rounded-xl p-3 flex items-center gap-3">
              <span className={`size-10 rounded-full ${g?.color ?? "bg-muted"} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                {p.name[0]}{p.lastName[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name} {p.lastName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.age} años · {p.hometown} · <span className="font-bold">{g?.name}</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end shrink-0">
                {p.allergies && (
                  <span className="text-[9px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <AlertCircle className="size-2.5" /> Alergia
                  </span>
                )}
                {p.medication && (
                  <span className="text-[9px] font-bold uppercase bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Pill className="size-2.5" /> Medicación
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-8">Sin resultados.</p>
        )}
      </div>
    </AppShell>
  );
}