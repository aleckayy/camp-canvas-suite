import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, AlertTriangle, ClipboardList, Users2, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { camp, animators, participants, incidents } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/mas")({
  head: () => ({ meta: [{ title: "Más · CampaWeb" }] }),
  component: MorePage,
});

function MorePage() {
  useCampStore();
  const tiles = [
    { to: "/turnos", label: "Turnos", sub: "Dormitorios, comedor…", icon: ClipboardList },
    { to: "/avisos", label: "Avisos", sub: "Tablón de coordinación", icon: Bell },
    { to: "/incidencias", label: "Incidencias", sub: `${incidents.filter(i => i.status !== "resuelta").length} sin cerrar`, icon: AlertTriangle },
    { to: "/participantes", label: "Participantes", sub: `${participants.length} chavales`, icon: Users2 },
  ];
  return (
    <AppShell>
      <PageHeader eyebrow="Más herramientas" title="Centro de control" />
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className="bg-white border border-border rounded-2xl p-4 aspect-square flex flex-col justify-between hover:border-foreground/30 transition-colors">
              <Icon className="size-5 text-brand" strokeWidth={2.4} />
              <div>
                <p className="text-sm font-extrabold leading-tight">{t.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-8 bg-foreground text-background rounded-2xl p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Sobre el campamento</p>
        <h3 className="text-lg font-extrabold mt-1">{camp.name}</h3>
        <p className="text-xs text-white/70 mt-1 italic">"{camp.motto}"</p>
        <div className="mt-4 space-y-1.5 text-xs">
          <p className="flex items-center gap-2"><MapPin className="size-3" /> {camp.location}</p>
          <p>📅 {camp.startDate} → {camp.endDate}</p>
          <p>👥 {animators.length} animadores · {participants.length} chavales</p>
        </div>
      </section>
    </AppShell>
  );
}