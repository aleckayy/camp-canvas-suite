import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Resource } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/recursos")({
  head: () => ({ meta: [{ title: "Recursos · Admin" }] }),
  component: RecursosAdmin,
});

const CATS: { key: Resource["category"]; label: string }[] = [
  { key: "oraciones", label: "Oraciones" },
  { key: "celebraciones", label: "Celebraciones" },
  { key: "buenas-noches", label: "Buenas noches" },
  { key: "temas", label: "Temas" },
  { key: "dinamicas", label: "Dinámicas" },
  { key: "juegos", label: "Juegos" },
  { key: "gymkanas", label: "Gymkanas" },
  { key: "talleres", label: "Talleres" },
  { key: "cancioneros", label: "Cancioneros" },
  { key: "imprimible", label: "Material imprimible" },
  { key: "documentos", label: "Documentos internos" },
];
const empty: Omit<Resource, "id"> = { category: "oraciones", title: "", summary: "", favorite: false };

function RecursosAdmin() {
  const { resources } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Resource, "id">>(empty);
  const [cat, setCat] = useState<string>("");

  function startNew() { setEditing("new"); setForm(empty); }
  function startEdit(r: Resource) { setEditing(r.id); const { id: _, ...rest } = r; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addResource(form);
    else if (editing) campActions.updateResource(editing, form);
    setEditing(null);
  }
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, fileUrl: reader.result as string });
    reader.readAsDataURL(f);
  }

  const filtered = resources.filter((r) => !cat || r.category === cat);

  return (
    <AdminShell
      eyebrow={`${resources.length} recursos`}
      title="Recursos"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      <select className={inputCls + " max-w-xs mb-4"} value={cat} onChange={(e) => setCat(e.target.value)}>
        <option value="">Todas las categorías</option>
        {CATS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>

      {editing && (
        <Card className="mb-4 max-w-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Título"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Categoría">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Resource["category"] })}>
                {CATS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Resumen"><textarea className={inputCls + " min-h-20"} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="Archivo (opcional)"><input type="file" className={inputCls} onChange={handleFile} /></Field>
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input type="checkbox" checked={!!form.favorite} onChange={(e) => setForm({ ...form, favorite: e.target.checked })} /> Marcar como favorito
          </label>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((r) => (
          <Card key={r.id} className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">{CATS.find((c) => c.key === r.category)?.label}</p>
              <p className="font-bold text-sm">{r.title} {r.favorite && <Star className="size-3 inline fill-amber-400 text-amber-400" />}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.summary}</p>
              {r.fileUrl && <a href={r.fileUrl} download className="text-xs text-brand font-semibold mt-1 inline-block">Descargar archivo</a>}
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => startEdit(r)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
              <DangerButton onClick={() => { if (confirm("¿Eliminar recurso?")) campActions.removeResource(r.id); }}><Trash2 className="size-3.5" /></DangerButton>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
