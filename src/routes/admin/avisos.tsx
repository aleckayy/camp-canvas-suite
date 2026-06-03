import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus, AlertCircle } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Notice } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/avisos")({
  head: () => ({ meta: [{ title: "Avisos · Admin" }] }),
  component: AvisosAdmin,
});

function empty(): Omit<Notice, "id"> {
  return { createdAt: new Date().toISOString().slice(0, 16), title: "", body: "", urgent: false, authorId: "co-jorge", targetAnimatorIds: [] };
}

function AvisosAdmin() {
  const { notices, animators } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Notice, "id">>(empty());

  function startNew() { setEditing("new"); setForm(empty()); }
  function startEdit(n: Notice) { setEditing(n.id); const { id: _, ...rest } = n; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addNotice(form);
    else if (editing) campActions.updateNotice(editing, form);
    setEditing(null);
  }
  function toggleTarget(id: string) {
    setForm((f) => {
      const t = f.targetAnimatorIds ?? [];
      return { ...f, targetAnimatorIds: t.includes(id) ? t.filter((x) => x !== id) : [...t, id] };
    });
  }

  return (
    <AdminShell
      eyebrow={`${notices.length} avisos`}
      title="Avisos"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      {editing && (
        <Card className="mb-4 max-w-2xl space-y-3">
          <Field label="Título"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Mensaje"><textarea className={inputCls + " min-h-24"} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Fecha"><input type="datetime-local" className={inputCls} value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} /></Field>
            <Field label="Autor">
              <select className={inputCls} value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })}>
                {animators.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input type="checkbox" checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })} /> Marcar como urgente
          </label>
          <Field label="Destinatarios (vacío = todos)">
            <div className="flex flex-wrap gap-1">
              {animators.map((a) => {
                const on = form.targetAnimatorIds?.includes(a.id);
                return <button key={a.id} type="button" onClick={() => toggleTarget(a.id)} className={`text-[11px] px-2 py-1 rounded-full font-semibold ${on ? "bg-foreground text-white" : "bg-secondary"}`}>{a.name}</button>;
              })}
            </div>
          </Field>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id} className={n.urgent ? "border-red-200 bg-red-50/40" : ""}>
            <div className="flex items-start gap-3">
              {n.urgent && <AlertCircle className="size-4 text-red-500 mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleString("es-ES")} · {(n.targetAnimatorIds?.length ?? 0) === 0 ? "Todos" : `${n.targetAnimatorIds!.length} destinatarios`}
                </p>
              </div>
              <button onClick={() => startEdit(n)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
              <DangerButton onClick={() => { if (confirm("¿Eliminar aviso?")) campActions.removeNotice(n.id); }}><Trash2 className="size-3.5" /></DangerButton>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
