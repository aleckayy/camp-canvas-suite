import { Link, useLocation } from "@tanstack/react-router";
import { Home, Calendar, Users, Library, MoreHorizontal, LogOut, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";
import { camp } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Hoy", icon: Home, match: (p: string) => p === "/" },
  { to: "/planning", label: "Planning", icon: Calendar, match: (p: string) => p.startsWith("/planning") || p.startsWith("/dia") || p.startsWith("/actividad") },
  { to: "/grupos", label: "Grupos", icon: Users, match: (p: string) => p.startsWith("/grupos") || p.startsWith("/participantes") },
  { to: "/recursos", label: "Recursos", icon: Library, match: (p: string) => p.startsWith("/recursos") },
  { to: "/mas", label: "Más", icon: MoreHorizontal, match: (p: string) => p.startsWith("/mas") || p.startsWith("/turnos") || p.startsWith("/avisos") || p.startsWith("/incidencias") },
];

export function AppShell({ children }: { children: ReactNode }) {
  useCampStore();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-28">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}

function AppHeader() {
  const { user, logout } = useAuth();
  const initials = user
    ? user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="block min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle" />
            Activo · {camp.theme}
          </p>
          <h1 className="text-base font-extrabold tracking-tight leading-tight truncate">
            {camp.name} <span className="text-muted-foreground font-medium">· {camp.motto}</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          {user?.role === "admin" && (
            <Link to="/admin" className="size-9 rounded-full bg-foreground text-white flex items-center justify-center hover:bg-foreground/90" title="Panel admin">
              <ShieldCheck className="size-4" />
            </Link>
          )}
          <button onClick={logout} className="size-9 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground" title="Cerrar sesión">
            <LogOut className="size-4" />
          </button>
          <div className="size-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <span className="text-brand font-bold text-sm">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-4 left-3 right-3 z-50">
      <div className="max-w-md mx-auto bg-foreground/95 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2.5 flex items-center justify-between shadow-2xl shadow-black/20">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-colors ${
                active ? "text-brand" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="size-4" strokeWidth={2.4} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-black tracking-tight text-balance">{title}</h2>
      </div>
      {action}
    </div>
  );
}
