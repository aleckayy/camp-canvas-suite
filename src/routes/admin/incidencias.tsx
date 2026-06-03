import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Incident } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/incidencias")({
  head: () => ({ meta: [{ title: "Incidencias · Admin" }] }),
  component: IncidenciasAdmin,
});

function empty(): Omit<Incident, "id"> {
  return { date: new Date().toISOString().slice(0, 10), participantId: "", type: "otro", description: "", severity: "baja", status: "abierta", reporterId: "co-jorge" };
}

const STATUS_TONE: Record<Incident["status"], string> = {
  abierta: "bg-red-100 text-red-700",
  seguimiento: "bg-amber-100 text-amber-700",
  resuelta: "bg-emerald-100 text-emerald-700",
};

function IncidenciasAdmin() {
  const { incidents, participants, animators } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Incident, "id">>(empty());

  function startNew() { setEditing("new"); setForm(empty()); }
  function startEdit(i: Incident) { setEditing(i.id); const { id: _, ...rest } = i; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addIncident(form);
    else if (editing) campActions.updateIncident(editing, form);
    setEditing(null);
  }
  function changeStatus(id: string, status: Incident["status"]) {
    campActions.updateIncident(id, { status });
  }

  return (
    <AdminShell
      eyebrow={`${incidents.filter((i) => i.status !== "resuelta").length} abiertas`}
      title="Incidencias"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nueva</PrimaryButton>}
    >
      {editing && (
        <Card className="mb-4 max-w-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Fecha"><input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Participante">
              <select className={inputCls} value={form.participantId} onChange={(e) => setForm({ ...form, participantId: e.target.value })}>
                <option value="">— Seleccionar —</option>
                {participants.map((p) => <option key={p.id} value={p.id}>{p.name} {p.lastName}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Incident["type"] })}>
                <option value="salud">Salud</option>
                <option value="convivencia">Convivencia</option>
                <option value="comportamiento">Comportamiento</option>
                <option value="material">Material</option>
                <option value="otro">Otro</option>
              </select>
            </Field>
            <Field label="Gravedad">
              <select className={inputCls} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Incident["severity"] })}>
                <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
              </select>
            </Field>
            <Field label="Estado">
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Incident["status"] })}>
                <option value="abierta">Abierta</option><option value="seguimiento">En seguimiento</option><option value="resuelta">Resuelta</option>
              </select>
            </Field>
            <Field label="Reportada por">
              <select className={inputCls} value={form.reporterId} onChange={(e) => setForm({ ...form, reporterId: e.target.value })}>
                {animators.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Descripción"><textarea className={inputCls + " min-h-20"} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Comentario interno"><textarea className={inputCls + " min-h-16"} value={form.internalNote ?? ""} onChange={(e) => setForm({ ...form, internalNote: e.target.value })} /></Field>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="space-y-3">
        {incidents.map((i) => {
          const p = participants.find((x) => x.id === i.participantId);
          const r = animators.find((x) => x.id === i.reporterId);
          return (
            <Card key={i.id}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_TONE[i.status]}`}>{i.status}</span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">{i.type} · {i.severity}</span>
                  </div>
                  <p className="font-bold text-sm mt-1">{p ? `${p.name} ${p.lastName}` : "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{i.description}</p>
                  {i.internalNote && <p className="text-[11px] italic text-stone-600 mt-1 bg-stone-50 rounded p-2">📝 {i.internalNote}</p>}
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">{i.date} · {r?.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <select className="text-[10px] border border-border rounded px-1 py-0.5" value={i.status} onChange={(e) => changeStatus(i.id, e.target.value as Incident["status"])}>
                    <option value="abierta">Abierta</option><option value="seguimiento">Seguim.</option><option value="resuelta">Resuelta</option>
                  </select>
                  <button onClick={() => startEdit(i)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
                  <DangerButton onClick={() => { if (confirm("¿Eliminar?")) campActions.removeIncident(i.id); }}><Trash2 className="size-3.5" /></DangerButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
