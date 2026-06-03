import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card } from "@/components/AdminShell";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/admin/gymkanas")({
  head: () => ({ meta: [{ title: "Gymkanas · Admin" }] }),
  component: GymkanasAdmin,
});

function GymkanasAdmin() {
  const { resources } = useCampStore();
  const gymkanas = resources.filter((r) => r.category === "gymkanas");
  return (
    <AdminShell eyebrow={`${gymkanas.length} gymkanas`} title="Gymkanas">
      <p className="text-sm text-muted-foreground mb-4">Gestiona las gymkanas desde la sección de Recursos (categoría Gymkanas).</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {gymkanas.map((r) => (
          <Card key={r.id}>
            <p className="font-bold">{r.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.summary}</p>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
