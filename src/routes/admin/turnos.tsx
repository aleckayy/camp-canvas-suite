import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Shift, campDays, shiftMeta } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/turnos")({
  head: () => ({ meta: [{ title: "Turnos · Admin" }] }),
  component: TurnosAdmin,
});

const empty: Omit<Shift, "id"> = { date: campDays[0].date, type: "dormitorios", animatorIds: [] };

function TurnosAdmin() {
  const { shifts, animators } = useCampStore();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Shift, "id">>(empty);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAnim, setFilterAnim] = useState("");

  function add() {
    campActions.addShift(form);
    setCreating(false);
    setForm(empty);
  }
  function toggleAnim(id: string) {
    setForm((f) => ({ ...f, animatorIds: f.animatorIds.includes(id) ? f.animatorIds.filter((x) => x !== id) : [...f.animatorIds, id] }));
  }
  function toggleAnimOn(shiftId: string, animId: string) {
    const sh = shifts.find((s) => s.id === shiftId);
    if (!sh) return;
    const next = sh.animatorIds.includes(animId) ? sh.animatorIds.filter((x) => x !== animId) : [...sh.animatorIds, animId];
    campActions.updateShift(shiftId, { animatorIds: next });
  }

  const list = shifts.filter((s) =>
    (!filterDate || s.date === filterDate) &&
    (!filterType || s.type === filterType) &&
    (!filterAnim || s.animatorIds.includes(filterAnim)),
  );

  return (
    <AdminShell
      eyebrow={`${shifts.length} turnos`}
      title="Turnos"
      action={<PrimaryButton onClick={() => setCreating((v) => !v)}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <select className={inputCls + " max-w-xs"} value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
          <option value="">Todos los días</option>
          {campDays.map((d) => <option key={d.date} value={d.date}>{d.label}</option>)}
        </select>
        <select className={inputCls + " max-w-xs"} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Todos los tipos</option>
          {Object.entries(shiftMeta).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className={inputCls + " max-w-xs"} value={filterAnim} onChange={(e) => setFilterAnim(e.target.value)}>
          <option value="">Todos los animadores</option>
          {animators.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {creating && (
        <Card className="mb-4 max-w-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Día">
              <select className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}>
                {campDays.map((d) => <option key={d.date} value={d.date}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Shift["type"] })}>
                {Object.entries(shiftMeta).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Animadores">
            <div className="flex flex-wrap gap-1">
              {animators.map((a) => {
                const on = form.animatorIds.includes(a.id);
                return <button key={a.id} type="button" onClick={() => toggleAnim(a.id)} className={`text-[11px] px-2 py-1 rounded-full font-semibold ${on ? "bg-foreground text-white" : "bg-secondary"}`}>{a.name}</button>;
              })}
            </div>
          </Field>
          <div className="flex gap-2"><PrimaryButton onClick={add}>Crear</PrimaryButton><GhostButton onClick={() => setCreating(false)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((s) => {
          const m = shiftMeta[s.type];
          const day = campDays.find((d) => d.date === s.date);
          return (
            <Card key={s.id}>
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{day?.label ?? s.date}</p>
                </div>
                <DangerButton onClick={() => { if (confirm("¿Eliminar turno?")) campActions.removeShift(s.id); }}><Trash2 className="size-3.5" /></DangerButton>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {animators.map((a) => {
                  const on = s.animatorIds.includes(a.id);
                  return <button key={a.id} onClick={() => toggleAnimOn(s.id, a.id)} className={`text-[10px] px-2 py-1 rounded-full font-semibold ${on ? "bg-foreground text-white" : "bg-secondary text-muted-foreground"}`}>{a.initials}</button>;
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
