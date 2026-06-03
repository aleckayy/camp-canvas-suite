import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { incidents, participants, getAnimator } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

const SEV_TONE: Record<string, string> = {
  baja: "bg-emerald-100 text-emerald-700",
  media: "bg-amber-100 text-amber-700",
  alta: "bg-red-100 text-red-700",
};
const STATUS_TONE: Record<string, string> = {
  abierta: "bg-red-50 border-red-200",
  seguimiento: "bg-amber-50 border-amber-200",
  resuelta: "bg-white border-border opacity-70",
};

export const Route = createFileRoute("/incidencias")({
  head: () => ({ meta: [{ title: "Incidencias · CampaWeb" }] }),
  component: IncidentsPage,
});

function IncidentsPage() {
  useCampStore();
  return (
    <AppShell>
      <PageHeader eyebrow={`${incidents.filter(i => i.status !== "resuelta").length} sin cerrar`} title="Incidencias" />
      <div className="space-y-3">
        {incidents.map((i) => {
          const p = participants.find((x) => x.id === i.participantId);
          const reporter = getAnimator(i.reporterId);
          return (
            <div key={i.id} className={`rounded-2xl p-4 border ${STATUS_TONE[i.status]}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${SEV_TONE[i.severity]}`}>{i.severity}</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-foreground text-background">{i.type}</span>
                <span className="text-[10px] font-mono uppercase text-muted-foreground ml-auto">{i.status}</span>
              </div>
              <p className="text-sm font-bold">{p?.name} {p?.lastName}</p>
              <p className="text-xs text-muted-foreground mt-1">{i.description}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-2">{i.date} · {reporter?.name}</p>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}