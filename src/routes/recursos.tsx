import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { resources, type Resource } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/recursos")({
  head: () => ({ meta: [{ title: "Recursos · CampaWeb" }] }),
  component: ResourcesPage,
});

const CATS: { id: Resource["category"] | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "oraciones", label: "Oraciones" },
  { id: "celebraciones", label: "Celebraciones" },
  { id: "buenas-noches", label: "Buenas noches" },
  { id: "temas", label: "Temas" },
  { id: "dinamicas", label: "Dinámicas" },
  { id: "juegos", label: "Juegos" },
  { id: "gymkanas", label: "Gymkanas" },
  { id: "talleres", label: "Talleres" },
  { id: "cancioneros", label: "Cancioneros" },
];

function ResourcesPage() {
  useCampStore();
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return resources.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (term && !`${r.title} ${r.summary}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [cat, q]);

  return (
    <AppShell>
      <PageHeader eyebrow="Biblioteca" title="Recursos" />
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar recurso…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-foreground"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-3">
        {CATS.map((c) => {
          const active = c.id === cat;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                active ? "bg-foreground text-background border-foreground" : "bg-white border-border text-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="grid gap-2 mt-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{r.category}</p>
                <h3 className="text-sm font-extrabold leading-tight mt-0.5">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.summary}</p>
              </div>
              {r.favorite && <Star className="size-4 fill-amber-400 text-amber-400 shrink-0" />}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-8">Sin recursos en esta categoría.</p>
        )}
      </div>
    </AppShell>
  );
}