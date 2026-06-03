import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · CampaWeb" },
      { name: "description", content: "Accede a CampaWeb con tu cuenta." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login(email, password);
      navigate({ to: u.role === "admin" ? "/admin" : "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  function quickFill(kind: "admin" | "animador") {
    if (kind === "admin") {
      setEmail("admin@campaweb.com");
      setPassword("admin123");
    } else {
      setEmail("animador@campaweb.com");
      setPassword("animador123");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle" />
            CampaWeb
          </p>
          <h1 className="text-3xl font-black tracking-tight">La carpeta del animador</h1>
          <p className="text-sm text-muted-foreground mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-3xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-brand"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-brand"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-800 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-white rounded-full py-3 font-bold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>

          <div className="pt-2 border-t border-border">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Cuentas de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickFill("admin")}
                className="text-xs font-semibold bg-brand/10 text-brand rounded-xl py-2 hover:bg-brand/20 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill("animador")}
                className="text-xs font-semibold bg-secondary text-foreground rounded-xl py-2 hover:bg-secondary/70 transition-colors"
              >
                Animador
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
