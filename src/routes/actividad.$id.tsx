import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Users, Package, AlertTriangle, ListChecks, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { categoryMeta, getActivity, getAnimator } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/actividad/$id")({
  head: ({ params }) => ({ meta: [{ title: `Actividad · CampaWeb` }, { name: "description", content: `Ficha de la actividad ${params.id}` }] }),
  component: ActivityPage,
});

function ActivityPage() {
  useCampStore();
  const { id } = Route.useParams();
  const a = getActivity(id);
  if (!a) throw notFound();
  const meta = categoryMeta[a.category];
  const responsible = a.responsibleIds.map((rid) => getAnimator(rid)).filter(Boolean);

  return (
    <AppShell>
      <Link to="/dia/$date" params={{ date: a.date }} className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="size-3" /> Día completo
      </Link>

      <div className={`rounded-3xl ${meta.soft} border-l-4 ${meta.ring} p-5 mb-6`}>
        <span className={`inline-block text-[10px] font-mono font-extrabold uppercase tracking-wider ${meta.text} mb-2`}>
          {meta.label}
        </span>
        <h1 className="text-2xl font-black tracking-tight text-balance leading-tight">{a.title}</h1>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <Info icon={Clock} label="Horario" value={`${a.startTime} — ${a.endTime}`} />
          <Info icon={MapPin} label="Lugar" value={a.location} />
        </div>
      </div>

      <div className="space-y-5">
        {responsible.length > 0 && (
          <Section icon={Users} title="Responsables">
            <div className="flex flex-wrap gap-2">
              {responsible.map((r) => (
                <span key={r!.id} className="px-3 py-1.5 rounded-full bg-white border border-border text-xs font-bold inline-flex items-center gap-2">
                  <span className="size-5 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center">{r!.initials}</span>
                  {r!.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {a.objective && (
          <Section icon={Target} title="Objetivo">
            <p className="text-sm">{a.objective}</p>
          </Section>
        )}

        {a.description && (
          <Section title="Descripción">
            <p className="text-sm text-muted-foreground">{a.description}</p>
          </Section>
        )}

        {a.steps && a.steps.length > 0 && (
          <Section icon={ListChecks} title="Pasos">
            <ol className="space-y-2">
              {a.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="font-mono font-bold text-brand shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {a.materials && a.materials.length > 0 && (
          <Section icon={Package} title="Materiales">
            <ul className="grid grid-cols-2 gap-2">
              {a.materials.map((m, i) => (
                <li key={i} className="text-xs bg-white border border-border rounded-lg px-3 py-2 font-medium">{m}</li>
              ))}
            </ul>
          </Section>
        )}

        {a.notes && (
          <Section icon={AlertTriangle} title="Notas importantes" tone="warn">
            <p className="text-sm">{a.notes}</p>
          </Section>
        )}
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-1">
        <Icon className="size-3" /> {label}
      </p>
      <p className="font-bold mt-0.5">{value}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children, tone }: { icon?: typeof Clock; title: string; children: React.ReactNode; tone?: "warn" }) {
  return (
    <section className={tone === "warn" ? "bg-amber-50 border border-amber-200 rounded-2xl p-4" : ""}>
      <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="size-3" />} {title}
      </h3>
      {children}
    </section>
  );
}