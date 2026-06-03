import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Users, UserSquare2, Layers, ListChecks, Bell, AlertTriangle, Library, Settings, MapPin, Sparkles, Gamepad2, Image as ImageIcon } from "lucide-react";
import { AdminShell, Card } from "@/components/AdminShell";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · CampaWeb" }] }),
  component: AdminDashboard,
});

const CARDS = [
  { to: "/admin/campamento", label: "Campamento", desc: "Editar nombre, lema, fechas, lugar.", icon: MapPin, tone: "bg-rose-100 text-rose-700" },
  { to: "/admin/animadores", label: "Animadores", desc: "Cuentas, roles y responsabilidades.", icon: Users, tone: "bg-sky-100 text-sky-700" },
  { to: "/admin/participantes", label: "Participantes", desc: "Fichas, alergias, grupos.", icon: UserSquare2, tone: "bg-emerald-100 text-emerald-700" },
  { to: "/admin/grupos", label: "Grupos", desc: "Crear y asignar grupos.", icon: Layers, tone: "bg-amber-100 text-amber-700" },
  { to: "/admin/planning", label: "Planning", desc: "Vista semanal editable.", icon: Calendar, tone: "bg-violet-100 text-violet-700" },
  { to: "/admin/actividades", label: "Actividades", desc: "Crear y duplicar actividades.", icon: Sparkles, tone: "bg-orange-100 text-orange-700" },
  { to: "/admin/turnos", label: "Turnos", desc: "Dormitorios, comedor, oficios…", icon: ListChecks, tone: "bg-cyan-100 text-cyan-700" },
  { to: "/admin/recursos", label: "Recursos", desc: "Oraciones, dinámicas, talleres.", icon: Library, tone: "bg-teal-100 text-teal-700" },
  { to: "/admin/avisos", label: "Avisos", desc: "Publicar y marcar urgente.", icon: Bell, tone: "bg-yellow-100 text-yellow-700" },
  { to: "/admin/incidencias", label: "Incidencias", desc: "Estado y seguimiento.", icon: AlertTriangle, tone: "bg-red-100 text-red-700" },
  { to: "/admin/gymkanas", label: "Gymkanas", desc: "Pruebas y dinámicas grandes.", icon: Gamepad2, tone: "bg-pink-100 text-pink-700" },
  { to: "/admin/galeria", label: "Galería", desc: "Fotos del campamento.", icon: ImageIcon, tone: "bg-lime-100 text-lime-700" },
  { to: "/admin/configuracion", label: "Configuración", desc: "Datos, idioma, backup.", icon: Settings, tone: "bg-stone-100 text-stone-700" },
] as const;

function AdminDashboard() {
  const s = useCampStore();

  return (
    <AdminShell eyebrow={s.camp.name} title="Dashboard">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Animadores" value={s.animators.length} />
        <Stat label="Participantes" value={s.participants.length} />
        <Stat label="Grupos" value={s.groups.length} />
        <Stat label="Actividades" value={s.activities.length} />
        <Stat label="Turnos" value={s.shifts.length} />
        <Stat label="Recursos" value={s.resources.length} />
        <Stat label="Avisos" value={s.notices.length} />
        <Stat label="Incidencias abiertas" value={s.incidents.filter((i) => i.status !== "resuelta").length} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to} className="block">
              <Card className="hover:border-foreground/30 transition-colors h-full flex items-start gap-3">
                <div className={`size-10 rounded-xl ${c.tone} flex items-center justify-center shrink-0`}>
                  <Icon className="size-5" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm leading-tight">{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-black tabular-nums mt-0.5">{value}</p>
    </Card>
  );
}
