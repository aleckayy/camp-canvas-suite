import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UsersRound,
  CalendarClock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · CampaWeb" },
      { name: "description", content: "Resumen general del campamento: ocupación, turnos activos, incidencias y actividades." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Participantes", value: "248", delta: "+12", trend: "up", icon: Users, hint: "vs. turno anterior" },
  { label: "Grupos activos", value: "16", delta: "+2", trend: "up", icon: UsersRound, hint: "en este turno" },
  { label: "Asistencia hoy", value: "96%", delta: "+1.4%", trend: "up", icon: CalendarClock, hint: "236 / 248" },
  { label: "Incidencias abiertas", value: "3", delta: "-2", trend: "down", icon: AlertTriangle, hint: "última semana" },
];

const attendance = [
  { day: "Lun", pct: 92 },
  { day: "Mar", pct: 94 },
  { day: "Mié", pct: 91 },
  { day: "Jue", pct: 96 },
  { day: "Vie", pct: 95 },
  { day: "Sáb", pct: 97 },
  { day: "Dom", pct: 96 },
];

const activities = [
  { name: "Senderismo", count: 42 },
  { name: "Piscina", count: 68 },
  { name: "Talleres", count: 54 },
  { name: "Veladas", count: 80 },
  { name: "Deportes", count: 60 },
];

const schedule = [
  { time: "09:00", title: "Buenos días + asamblea", group: "Todos los grupos", tag: "Comunidad" },
  { time: "10:30", title: "Senderismo ruta corta", group: "Grupo Roble · 12 participantes", tag: "Aire libre" },
  { time: "13:30", title: "Comida", group: "Comedor principal", tag: "Logística" },
  { time: "16:00", title: "Taller de pulseras", group: "Grupo Cedro · 18 participantes", tag: "Talleres" },
  { time: "22:00", title: "Velada: noche de talentos", group: "Anfiteatro", tag: "Velada" },
];

const incidents = [
  { who: "Lucía M.", what: "Dolor de cabeza leve · enfermería", level: "info", time: "hace 12 min" },
  { who: "Grupo Pino", what: "Retraso en la actividad de tarde", level: "warn", time: "hace 1 h" },
  { who: "Marcos R.", what: "Pequeña rozadura tras senderismo", level: "info", time: "hace 3 h" },
];

function Dashboard() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Badge variant="secondary" className="rounded-full bg-accent text-accent-foreground font-medium">
              <Sparkles className="mr-1 h-3 w-3 text-primary" />
              Turno de verano · Semana 2
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Buenos días, Alec
            </h1>
            <p className="text-sm text-muted-foreground">
              Aquí tienes el resumen del campamento de hoy, lunes 3 de junio.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Exportar informe</Button>
            <Button size="sm" className="shadow-[var(--shadow-elegant)]">
              Nueva actividad
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const up = kpi.trend === "up";
            const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
            return (
              <Card key={kpi.label} className="relative overflow-hidden border-border/60 shadow-[var(--shadow-soft)]">
                <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)] opacity-60" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="font-display text-3xl font-semibold tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
                        up
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {kpi.delta}
                    </span>
                    <span className="text-muted-foreground">{kpi.hint}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60 shadow-[var(--shadow-soft)]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold">Asistencia semanal</CardTitle>
                <CardDescription>Porcentaje de participantes presentes por día</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">Últimos 7 días</Badge>
            </CardHeader>
            <CardContent className="h-[280px] pl-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendance} margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.22 277)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.65 0.22 277)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={12} domain={[80, 100]} unit="%" width={40} />
                  <ReTooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="pct" stroke="oklch(0.65 0.22 277)" strokeWidth={2.5} fill="url(#attFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Participación por actividad</CardTitle>
              <CardDescription>Inscripciones de esta semana</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] pl-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activities} margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={12} width={32} />
                  <ReTooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="oklch(0.65 0.22 277)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom row: schedule + incidents + occupancy */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60 shadow-[var(--shadow-soft)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold">Agenda de hoy</CardTitle>
                <CardDescription>5 momentos programados</CardDescription>
              </div>
              <Button variant="ghost" size="sm">Ver planificación</Button>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {schedule.map((s) => (
                <div key={s.time} className="flex items-center gap-4 px-6 py-3">
                  <div className="flex w-14 shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {s.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.group}</div>
                  </div>
                  <Badge variant="outline" className="font-normal">{s.tag}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/60 shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Ocupación por grupo</CardTitle>
                <CardDescription>Plazas usadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Grupo Roble", used: 18, total: 20 },
                  { name: "Grupo Cedro", used: 16, total: 18 },
                  { name: "Grupo Pino", used: 12, total: 15 },
                ].map((g) => {
                  const pct = Math.round((g.used / g.total) * 100);
                  return (
                    <div key={g.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{g.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {g.used}/{g.total}
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Incidencias recientes</CardTitle>
                <CardDescription>Última actividad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {incidents.map((i) => (
                  <div key={i.who} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-xs font-medium text-accent-foreground">
                        {i.who.split(" ").map((p) => p[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{i.who}</span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            i.level === "warn" ? "bg-warning" : "bg-primary"
                          }`}
                        />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{i.what}</p>
                      <p className="text-[0.7rem] text-muted-foreground/70">{i.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
