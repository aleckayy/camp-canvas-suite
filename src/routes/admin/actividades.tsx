import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Copy } from "lucide-react";
import { z } from "zod";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Activity, type ActivityCategory, campDays, categoryMeta } from "@/lib/camp-data";

const search = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/admin/actividades")({
  head: () => ({ meta: [{ title: "Actividades · Admin" }] }),
  validateSearch: search,
  component: ActividadesAdmin,
});

function empty(date = campDays[0].date, category: ActivityCategory = "actividad"): Omit<Activity, "id"> {
  return { date, startTime: "10:00", endTime: "11:00", category, title: "", location: "", responsibleIds: [], status: "pendiente" };
}

function ActividadesAdmin() {
  const { id, date, category } = Route.useSearch();
  const { activities, animators } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Activity, "id">>(empty());
  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    if (id) {
      const a = activities.find((x) => x.id === id);
      if (a) { setEditing(a.id); const { id: _, ...rest } = a; void _; setForm(rest); }
    } else if (date) {
      setEditing("new");
      setForm(empty(date, (category as ActivityCategory) || "actividad"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, date, category]);

  function startNew() { setEditing("new"); setForm(empty()); }
  function startEdit(a: Activity) { setEditing(a.id); const { id: _, ...rest } = a; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addActivity(form);
    else if (editing) campActions.updateActivity(editing, form);
    setEditing(null);
  }
  function remove(idd: string) { if (confirm("¿Eliminar actividad?")) campActions.removeActivity(idd); }
  function toggleResp(aid: string) {
    setForm((f) => ({ ...f, responsibleIds: f.responsibleIds.includes(aid) ? f.responsibleIds.filter((x) => x !== aid) : [...f.responsibleIds, aid] }));
  }

  const list = activities
    .filter((a) => !filterDate || a.date === filterDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return (
    <AdminShell
      eyebrow={`${activities.length} actividades`}
      title="Actividades"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nueva</PrimaryButton>}
    >
      <div className="flex gap-2 mb-4">
        <select className={inputCls + " max-w-xs"} value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
          <option value="">Todos los días</option>
          {campDays.map((d) => <option key={d.date} value={d.date}>{d.label}</option>)}
        </select>
      </div>

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
            <Field label="Día">
              <select className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}>
                {campDays.map((d) => <option key={d.date} value={d.date}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Lugar"><input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
            <Field label="Hora inicio"><input type="time" className={inputCls} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></Field>
            <Field label="Hora fin"><input type="time" className={inputCls} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></Field>
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
                return <button key={a.id} type="button" onClick={() => toggleResp(a.id)} className={`text-[11px] px-2 py-1 rounded-full font-semibold ${on ? "bg-foreground text-white" : "bg-secondary text-foreground"}`}>{a.name}</button>;
              })}
            </div>
          </Field>
          <Field label="Objetivos"><textarea className={inputCls + " min-h-16"} value={form.objective ?? ""} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field>
          <Field label="Desarrollo"><textarea className={inputCls + " min-h-20"} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Pasos (uno por línea)"><textarea className={inputCls + " min-h-16"} value={(form.steps ?? []).join("\n")} onChange={(e) => setForm({ ...form, steps: e.target.value.split("\n").filter(Boolean) })} /></Field>
          <Field label="Materiales (uno por línea)"><textarea className={inputCls + " min-h-16"} value={(form.materials ?? []).join("\n")} onChange={(e) => setForm({ ...form, materials: e.target.value.split("\n").filter(Boolean) })} /></Field>
          <Field label="Notas internas"><textarea className={inputCls + " min-h-16"} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="space-y-2">
        {list.map((a) => {
          const meta = categoryMeta[a.category];
          const day = campDays.find((d) => d.date === a.date);
          return (
            <Card key={a.id} className="flex items-center gap-3">
              <span className={`block h-12 w-1.5 rounded-full ${meta.color}`} />
              <span className="font-mono text-[10px] text-muted-foreground w-16">{day?.label}</span>
              <span className="font-mono text-xs w-20 tabular-nums text-muted-foreground">{a.startTime}–{a.endTime}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">{meta.label} · {a.location}</p>
              </div>
              <button onClick={() => campActions.duplicateActivity(a.id)} title="Duplicar" className="text-foreground/60 hover:text-foreground"><Copy className="size-3.5" /></button>
              <button onClick={() => startEdit(a)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
              <DangerButton onClick={() => remove(a.id)}><Trash2 className="size-3.5" /></DangerButton>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
