import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Card } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/galeria")({
  head: () => ({ meta: [{ title: "Galería · Admin" }] }),
  component: GaleriaAdmin,
});

function GaleriaAdmin() {
  return (
    <AdminShell eyebrow="Fotos del campamento" title="Galería">
      <Card className="max-w-2xl">
        <p className="font-bold mb-1">Próximamente</p>
        <p className="text-sm text-muted-foreground">La galería estará disponible cuando conectes Lovable Cloud para guardar las fotos del campamento.</p>
      </Card>
    </AdminShell>
  );
}
