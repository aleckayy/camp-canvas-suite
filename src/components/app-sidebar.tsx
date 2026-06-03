import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  UsersRound,
  Megaphone,
  AlertTriangle,
  Boxes,
  Sparkles,
  CalendarClock,
  FileBarChart,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const principal = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Planificación", url: "/planificacion", icon: CalendarRange },
  { title: "Turnos", url: "/turnos", icon: CalendarClock },
  { title: "Actividades", url: "/actividades", icon: Sparkles },
];

const personas = [
  { title: "Participantes", url: "/participantes", icon: Users },
  { title: "Grupos", url: "/grupos", icon: UsersRound },
];

const gestion = [
  { title: "Avisos", url: "/avisos", icon: Megaphone },
  { title: "Incidencias", url: "/incidencias", icon: AlertTriangle },
  { title: "Recursos", url: "/recursos", icon: Boxes },
  { title: "Informes", url: "/informes", icon: FileBarChart },
];

function NavSection({
  label,
  items,
}: {
  label: string;
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active =
              item.url === "/"
                ? currentPath === "/"
                : currentPath === item.url || currentPath.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-[1.05rem] w-[1.05rem]" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center gap-2.5 px-2 py-2"
          aria-label="CampaWeb"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <span className="font-display text-sm font-bold">C</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight">CampaWeb</span>
            <span className="text-[0.65rem] text-muted-foreground">Gestión de campamentos</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavSection label="Principal" items={principal} />
        <NavSection label="Personas" items={personas} />
        <NavSection label="Gestión" items={gestion} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ajustes">
              <Link to="/ajustes" className="flex items-center gap-3">
                <Settings className="h-[1.05rem] w-[1.05rem]" />
                <span>Ajustes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}