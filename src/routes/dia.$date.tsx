import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  campDays,
  categoryMeta,
  getActivitiesByDate,
  getAnimator,
  TODAY,
} from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/dia/$date")({
  head: ({ params }) => ({ meta: [{ title: `Día ${params.date} · CampaWeb` }] }),
  component: DayPage,
});

function DayPage() {
  useCampStore();
  const { date } = Route.useParams();
  const day = campDays.find((d) => d.date === date);
  if (!day) throw notFound();
  const list = getActivitiesByDate(date);
  const idx = campDays.findIndex((d) => d.date === date);
  const prev = campDays[idx - 1];
  const next = campDays[idx + 1];

  return (
    <AppShell>
      <Link to="/planning" className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="size-3" /> Planning semanal
      </Link>
      <PageHeader
        eyebrow={date === TODAY ? "Hoy" : "Vista diaria"}
        title={`${day.weekday} ${day.label.split(" ")[1]}`}
      />

      <div className="flex items-center justify-between mb-6 text-xs font-bold">
        {prev ? (
          <Link to="/dia/$date" params={{ date: prev.date }} className="text-muted-foreground">← {prev.label}</Link>
        ) : <span />}
        {next ? (
          <Link to="/dia/$date" params={{ date: next.date }} className="text-brand">{next.label} →</Link>
        ) : <span />}
      </div>

      <div className="relative pl-5 space-y-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-border">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Sin actividades programadas.</p>
        )}
        {list.map((a) => {
          const meta = categoryMeta[a.category];
          const responsible = a.responsibleIds.map((id) => getAnimator(id)?.initials).filter(Boolean).join(" · ");
          return (
            <Link key={a.id} to="/actividad/$id" params={{ id: a.id }} className="block relative">
              <span className={`absolute -left-[18px] top-3 size-2.5 rounded-full ${meta.color} ring-4 ring-background`} />
              <div className="bg-white border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {a.startTime} — {a.endTime} · {meta.label}
                    </p>
                    <h3 className="text-sm font-extrabold leading-tight mt-1">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      <MapPin className="inline size-3 -mt-0.5 mr-0.5" /> {a.location}
                    </p>
                  </div>
                  {responsible && (
                    <span className="text-[10px] font-mono font-bold text-muted-foreground shrink-0">{responsible}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}