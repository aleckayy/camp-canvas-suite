import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, Card, DangerButton, PrimaryButton } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/admin/configuracion")({
  head: () => ({ meta: [{ title: "Configuración · Admin" }] }),
  component: ConfigAdmin,
});

function ConfigAdmin() {
  const s = useCampStore();

  function exportData() {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `campaweb-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <AdminShell eyebrow="Datos y conexión" title="Configuración">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <Card className="space-y-3">
          <p className="font-bold">Datos</p>
          <p className="text-xs text-muted-foreground">Los datos se guardan en este navegador. Cuando conectes Lovable Cloud (Supabase), se migrarán automáticamente.</p>
          <div className="flex gap-2">
            <PrimaryButton onClick={exportData}>Exportar JSON</PrimaryButton>
            <DangerButton onClick={() => { if (confirm("¿Restaurar datos iniciales? Se perderán los cambios.")) campActions.resetAll(); }}>Restaurar inicial</DangerButton>
          </div>
        </Card>
        <Card className="space-y-3">
          <p className="font-bold">Conectar Supabase</p>
          <p className="text-xs text-muted-foreground">Activa Lovable Cloud para tener autenticación real, base de datos persistente y almacenamiento de archivos.</p>
          <Link to="/admin" className="text-xs font-bold text-brand">Próximamente</Link>
        </Card>
      </div>
    </AdminShell>
  );
}
