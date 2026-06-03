import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  PLANNER_ROWS,
  campDays,
  categoryMeta,
  getActivityByDayAndCategory,
  getAnimator,
  TODAY,
} from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/planning")({
  head: () => ({ meta: [{ title: "Planning semanal · CampaWeb" }] }),
  component: PlanningPage,
});

function PlanningPage() {
  useCampStore();
  return (
    <AppShell>
      <PageHeader
        eyebrow="Vista semanal"
        title="Planning del campamento"
        action={
          <Link to="/dia/$date" params={{ date: TODAY }} className="text-xs font-bold text-brand">
            Vista diaria →
          </Link>
        }
      />
      <div className="overflow-x-auto -mx-4 px-4 pb-4">
        <div className="inline-flex gap-2 min-w-full">
          <div className="flex flex-col gap-2 pt-12 sticky left-0 bg-background/95 z-10 pr-2">
            {PLANNER_ROWS.map((r) => (
              <div key={r.category} className="h-20 w-16 flex items-center">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground leading-tight text-balance">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
          {campDays.map((day) => {
            const isToday = day.date === TODAY;
            return (
              <div key={day.date} className="w-36 space-y-2 shrink-0">
                <Link to="/dia/$date" params={{ date: day.date }} className={`block text-center pb-2 ${isToday ? "text-brand" : ""}`}>
                  <p className="text-[10px] font-mono font-bold uppercase text-muted-foreground">{day.weekday.slice(0, 3)}</p>
                  <p className={`text-sm font-extrabold ${isToday ? "text-brand" : ""}`}>{day.label.split(" ")[1]}</p>
                  {isToday && <span className="inline-block size-1.5 rounded-full bg-brand mt-0.5" />}
                </Link>
                {PLANNER_ROWS.map((r) => {
                  const a = getActivityByDayAndCategory(day.date, r.category);
                  const meta = categoryMeta[r.category];
                  if (!a) return <div key={r.category} className="h-20 rounded-xl border border-dashed border-border bg-white/40" />;
                  const responsible = a.responsibleIds.map((id) => getAnimator(id)?.initials).filter(Boolean).join(" · ");
                  return (
                    <Link key={a.id} to="/actividad/$id" params={{ id: a.id }} className={`block h-20 rounded-xl ${meta.soft} border-l-4 ${meta.ring} p-2 hover:scale-[1.02] transition-transform`}>
                      <p className="text-[11px] font-extrabold leading-tight line-clamp-2">{a.title}</p>
                      <p className="text-[9px] font-mono text-muted-foreground mt-1 truncate">{a.startTime} · {responsible || "—"}</p>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {PLANNER_ROWS.map((r) => {
          const meta = categoryMeta[r.category];
          return (
            <span key={r.category} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border text-[10px] font-bold">
              <span className={`size-2 rounded-full ${meta.color}`} />
              {r.label}
            </span>
          );
        })}
      </div>
    </AppShell>
  );
}