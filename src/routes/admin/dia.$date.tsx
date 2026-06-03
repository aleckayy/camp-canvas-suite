import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Activity, type ActivityCategory, campDays, categoryMeta } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/dia/$date")({
  head: () => ({ meta: [{ title: "Día · Admin" }] }),
  component: DiaAdmin,
});

function emptyFor(date: string): Omit<Activity, "id"> {
  return { date, startTime: "10:00", endTime: "11:00", category: "actividad", title: "", location: "", responsibleIds: [], status: "pendiente" };
}

function DiaAdmin() {
  const { date } = useParams({ from: "/admin/dia/$date" });
  const { activities, animators } = useCampStore();
  const day = campDays.find((d) => d.date === date);
  const list = activities.filter((a) => a.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Activity, "id">>(emptyFor(date));

  function startNew() { setEditing("new"); setForm(emptyFor(date)); }
  function startEdit(a: Activity) { setEditing(a.id); const { id: _, ...rest } = a; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addActivity(form);
    else if (editing) campActions.updateActivity(editing, form);
    setEditing(null);
  }
  function remove(id: string) { if (confirm("¿Eliminar actividad?")) campActions.removeActivity(id); }

  function toggleResp(id: string) {
    setForm((f) => ({
      ...f,
      responsibleIds: f.responsibleIds.includes(id) ? f.responsibleIds.filter((x) => x !== id) : [...f.responsibleIds, id],
    }));
  }

  return (
    <AdminShell
      eyebrow={<Link to="/admin/planning" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3" /> Planning</Link>}
      title={`Día — ${day?.label ?? date}`}
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nueva</PrimaryButton>}
    >
      {editing && (
        <Card className="mb-4 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase text-muted-foreground">{editing === "new" ? "Nueva actividad" : "Editar actividad"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Título"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Categoría">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ActivityCategory })}>
                {Object.entries(categoryMeta).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Hora inicio"><input type="time" className={inputCls} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></Field>
            <Field label="Hora fin"><input type="time" className={inputCls} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></Field>
            <Field label="Lugar"><input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <Field label="Estado">
              <select className={inputCls} value={form.status ?? "pendiente"} onChange={(e) => setForm({ ...form, status: e.target.value as Activity["status"] })}>
                <option value="pendiente">Pendiente</option>
                <option value="preparada">Preparada</option>
                <option value="en-curso">En curso</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </Field>
          </div>
          <Field label="Responsables">
            <div className="flex flex-wrap gap-1">
              {animators.map((a) => {
                const on = form.responsibleIds.includes(a.id);
                return (
                  <button key={a.id} type="button" onClick={() => toggleResp(a.id)} className={`text-[11px] px-2 py-1 rounded-full font-semibold transition-colors ${on ? "bg-foreground text-white" : "bg-secondary text-foreground"}`}>
                    {a.name}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Objetivos"><textarea className={inputCls + " min-h-16"} value={form.objective ?? ""} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field>
          <Field label="Descripción / Desarrollo"><textarea className={inputCls + " min-h-20"} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Pasos (uno por línea)">
            <textarea className={inputCls + " min-h-20"} value={(form.steps ?? []).join("\n")} onChange={(e) => setForm({ ...form, steps: e.target.value.split("\n").filter(Boolean) })} />
          </Field>
          <Field label="Materiales (uno por línea)">
            <textarea className={inputCls + " min-h-16"} value={(form.materials ?? []).join("\n")} onChange={(e) => setForm({ ...form, materials: e.target.value.split("\n").filter(Boolean) })} />
          </Field>
          <Field label="Notas internas"><textarea className={inputCls + " min-h-16"} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="space-y-2">
        {list.map((a) => {
          const meta = categoryMeta[a.category];
          return (
            <Card key={a.id} className="flex items-center gap-3">
              <span className={`block h-12 w-1.5 rounded-full ${meta.color}`} />
              <span className="font-mono text-xs tabular-nums w-20 text-muted-foreground">{a.startTime}–{a.endTime}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">{meta.label} · {a.location}</p>
              </div>
              <button onClick={() => startEdit(a)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
              <DangerButton onClick={() => remove(a.id)}><Trash2 className="size-3.5" /></DangerButton>
            </Card>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted-foreground italic">Sin actividades en este día.</p>}
      </div>
    </AdminShell>
  );
}
