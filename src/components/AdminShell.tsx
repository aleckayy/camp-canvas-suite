import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

const SECTIONS: { to: string; label: string }[] = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/campamento", label: "Campamento" },
  { to: "/admin/animadores", label: "Animadores" },
  { to: "/admin/participantes", label: "Participantes" },
  { to: "/admin/grupos", label: "Grupos" },
  { to: "/admin/planning", label: "Planning" },
  { to: "/admin/actividades", label: "Actividades" },
  { to: "/admin/turnos", label: "Turnos" },
  { to: "/admin/recursos", label: "Recursos" },
  { to: "/admin/avisos", label: "Avisos" },
  { to: "/admin/incidencias", label: "Incidencias" },
];

export function AdminShell({ title, eyebrow, action, children }: {
  title: string;
  eyebrow?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/admin" className="block">
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand">Panel admin</p>
            <h1 className="text-base font-extrabold tracking-tight leading-tight">CampaWeb</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-3" /> App
            </Link>
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="text-xs font-bold inline-flex items-center gap-1 text-foreground hover:text-brand"
              title="Cerrar sesión"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
        <nav className="border-t border-border overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-1 text-[11px] font-semibold whitespace-nowrap">
            {SECTIONS.map((s) => {
              const active = pathname === s.to || (s.to !== "/admin" && pathname.startsWith(s.to));
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    active ? "bg-foreground text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                {eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}

// ===== Reusable form primitives =====
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full px-3 py-2 rounded-xl border border-border bg-white text-sm font-medium focus:outline-none focus:border-brand";

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`bg-foreground text-white rounded-full px-4 py-2 text-xs font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50 ${className}`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`border border-border bg-white rounded-full px-3 py-1.5 text-xs font-semibold hover:border-foreground/30 transition-colors ${className}`}
    />
  );
}

export function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`text-xs font-semibold text-red-600 hover:text-red-800 ${className}`}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-border rounded-2xl p-4 ${className}`}>{children}</div>
  );
}
