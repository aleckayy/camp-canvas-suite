import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, ChevronRight, MapPin, Sparkles, Users, AlertTriangle, Library, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  TODAY,
  NOW_HHMM,
  campDays,
  categoryMeta,
  currentUser,
  getActivity,
  getActivitiesByDate,
  getAnimator,
  getCurrentAndNext,
  getMyActivitiesToday,
  getMyShifts,
  notices,
  shiftMeta,
} from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoy · CampaWeb" },
      { name: "description", content: "Qué toca ahora, qué viene después y tus responsabilidades del día." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  useCampStore();
  const { current, next } = getCurrentAndNext(TODAY, NOW_HHMM);
  const myActivities = getMyActivitiesToday(TODAY, currentUser.id);
  const myShifts = getMyShifts(TODAY, currentUser.id);
  const urgent = notices.filter((n) => n.urgent);
  const today = campDays.find((d) => d.date === TODAY)!;
  const dayActivities = getActivitiesByDate(TODAY);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Date strip */}
        <div className="flex items-center justify-between animate-in-up">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {today.weekday} · {NOW_HHMM}
            </p>
            <h2 className="text-xl font-extrabold tracking-tight">Buenos días, Ana 👋</h2>
          </div>
          <Link to="/dia/$date" params={{ date: TODAY }} className="text-xs font-bold text-brand flex items-center gap-1">
            Día completo <ChevronRight className="size-3" />
          </Link>
        </div>

        {/* Urgent notice */}
        {urgent.length > 0 && (
          <Link to="/avisos" className="block animate-in-up" style={{ animationDelay: "60ms" }}>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="size-2 mt-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-mono text-red-600 uppercase tracking-wider">Aviso urgente</p>
                <p className="text-sm font-semibold text-red-900">{urgent[0].title}</p>
                <p className="text-xs text-red-800/80 mt-0.5">{urgent[0].body}</p>
              </div>
              <ArrowRight className="size-4 text-red-400 shrink-0 mt-1" />
            </div>
          </Link>
        )}

        {/* QUÉ TOCA AHORA — hero */}
        {current && <NowCard activityId={current.id} />}

        {/* Next */}
        {next && (
          <Link to="/actividad/$id" params={{ id: next.id }} className="block animate-in-up" style={{ animationDelay: "180ms" }}>
            <div className="border border-border bg-white rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Próxima actividad</p>
                <h3 className="text-lg font-bold leading-tight">{next.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <MapPin className="size-3 inline mr-0.5 -mt-0.5" />
                  {next.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-brand italic text-lg">{next.startTime}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {categoryMeta[next.category].label}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* My responsibilities */}
        <section className="animate-in-up space-y-3" style={{ animationDelay: "220ms" }}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Mis responsabilidades hoy
            </h4>
            <Link to="/turnos" className="text-[10px] font-bold text-brand">Ver turnos</Link>
          </div>
          {myActivities.length === 0 && myShifts.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Hoy no tienes responsabilidades asignadas. ¡A disfrutar!</p>
          ) : (
            <div className="space-y-2">
              {myActivities.map((a) => {
                const meta = categoryMeta[a.category];
                return (
                  <Link key={a.id} to="/actividad/$id" params={{ id: a.id }} className="block">
                    <div className={`rounded-xl border border-border bg-white p-3 flex items-center gap-3`}>
                      <div className={`size-10 rounded-lg ${meta.soft} flex items-center justify-center shrink-0`}>
                        <Sparkles className={`size-4 ${meta.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.startTime} · {a.location}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${meta.soft} ${meta.text}`}>
                        {meta.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
              {myShifts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {myShifts.map((s) => {
                    const m = shiftMeta[s.type];
                    return (
                      <span
                        key={s.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${m.tone} inline-flex items-center gap-1.5`}
                      >
                        <span>{m.icon}</span> {m.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Day timeline preview */}
        <section className="animate-in-up space-y-3" style={{ animationDelay: "260ms" }}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">El día de hoy</h4>
            <Link to="/dia/$date" params={{ date: TODAY }} className="text-[10px] font-bold text-brand">Ver todo</Link>
          </div>
          <div className="space-y-1.5">
            {dayActivities.slice(0, 5).map((a) => {
              const meta = categoryMeta[a.category];
              const isNow = current?.id === a.id;
              return (
                <Link key={a.id} to="/actividad/$id" params={{ id: a.id }} className="flex items-center gap-3 group">
                  <span className="font-mono text-xs text-muted-foreground w-12 tabular-nums">{a.startTime}</span>
                  <span className={`block h-8 w-1 rounded-full ${meta.color}`} />
                  <span className={`flex-1 text-sm py-1.5 ${isNow ? "font-bold" : "font-medium"}`}>
                    {a.title}
                    {isNow && <span className="ml-2 text-[9px] font-mono uppercase text-emerald-600">· ahora</span>}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick tiles */}
        <section className="animate-in-up grid grid-cols-2 gap-3" style={{ animationDelay: "300ms" }}>
          <QuickTile to="/grupos" label="Mi grupo" sub="Mercedes · 3 chavales" icon={Users} tone="bg-rose-100 text-rose-600" />
          <QuickTile to="/recursos" label="Recursos" sub="Oraciones, juegos…" icon={Library} tone="bg-sky-100 text-sky-600" />
          <QuickTile to="/incidencias" label="Incidencias" sub="1 abierta" icon={AlertTriangle} tone="bg-amber-100 text-amber-700" />
          <QuickTile to="/avisos" label="Avisos" sub={`${notices.length} publicados`} icon={Bell} tone="bg-violet-100 text-violet-600" />
        </section>
      </div>
    </AppShell>
  );
}

function NowCard({ activityId }: { activityId: string }) {
  const a = getActivity(activityId)!;
  const meta = categoryMeta[a.category];
  const responsible = a.responsibleIds.map((id) => getAnimator(id)?.name ?? "—").join(" · ");
  return (
    <Link to="/actividad/$id" params={{ id: a.id }} className="block animate-in-up" style={{ animationDelay: "120ms" }}>
      <div className="relative overflow-hidden bg-foreground rounded-3xl p-6 text-white shadow-xl shadow-foreground/10">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <p className="font-mono font-black text-6xl rotate-12 select-none">NOW</p>
        </div>
        <div className="relative z-10">
          <span className={`inline-block px-2 py-1 rounded ${meta.color} text-foreground text-[10px] font-extrabold uppercase mb-4 tracking-wide`}>
            {meta.label} en curso
          </span>
          <h2 className="text-3xl font-black leading-tight mb-1 text-balance">{a.title}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5">
            <div>
              <p className="text-[10px] uppercase text-white/50 font-mono">Hora</p>
              <p className="text-sm font-semibold">{a.startTime} — {a.endTime}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/50 font-mono">Lugar</p>
              <p className="text-sm font-semibold">{a.location}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/50 font-mono">Responsable</p>
              <p className="text-sm font-semibold underline decoration-brand underline-offset-4">
                {responsible || "—"}
              </p>
            </div>
          </div>
          <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-white/80">
            Ver ficha completa <ArrowRight className="size-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickTile({
  to,
  label,
  sub,
  icon: Icon,
  tone,
}: {
  to: string;
  label: string;
  sub: string;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <Link to={to} className="bg-white border border-border rounded-2xl p-4 aspect-square flex flex-col justify-between hover:border-foreground/20 transition-colors">
      <div className={`size-9 rounded-xl ${tone} flex items-center justify-center`}>
        <Icon className="size-4.5" strokeWidth={2.4} />
      </div>
      <div>
        <p className="text-sm font-extrabold leading-tight">{label}</p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{sub}</p>
      </div>
    </Link>
  );
}

// Hint: keep ClipboardList referenced so tree-shaking doesn't whine.
void ClipboardList;
