import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Participant } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/participantes")({
  head: () => ({ meta: [{ title: "Participantes · Admin" }] }),
  component: ParticipantesAdmin,
});

const empty: Omit<Participant, "id"> = {
  name: "", lastName: "", birthdate: "", age: 0, hometown: "", groupId: "",
  allergies: "", intolerances: "", medication: "", notes: "",
};

function ParticipantesAdmin() {
  const { participants, groups, animators } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Participant, "id">>(empty);
  const [filter, setFilter] = useState("");

  function startNew() { setEditing("new"); setForm(empty); }
  function startEdit(p: Participant) { setEditing(p.id); const { id: _, ...rest } = p; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addParticipant(form);
    else if (editing) campActions.updateParticipant(editing, form);
    setEditing(null);
  }
  function remove(id: string) { if (confirm("¿Eliminar participante?")) campActions.removeParticipant(id); }

  const filtered = participants.filter((p) =>
    `${p.name} ${p.lastName} ${p.hometown}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <AdminShell
      eyebrow={`${participants.length} participantes`}
      title="Participantes"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      <input className={inputCls + " max-w-xs mb-4"} placeholder="Buscar…" value={filter} onChange={(e) => setFilter(e.target.value)} />

      {editing && (
        <Card className="mb-4 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase text-muted-foreground">{editing === "new" ? "Nuevo participante" : "Editar participante"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nombre"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Apellidos"><input className={inputCls} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            <Field label="Fecha nacimiento"><input type="date" className={inputCls} value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} /></Field>
            <Field label="Edad"><input type="number" className={inputCls} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></Field>
            <Field label="Casa de procedencia"><input className={inputCls} value={form.hometown} onChange={(e) => setForm({ ...form, hometown: e.target.value })} /></Field>
            <Field label="Grupo">
              <select className={inputCls} value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
                <option value="">— Sin grupo —</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
            <Field label="Animador responsable">
              <select className={inputCls} value={form.responsibleAnimatorId ?? ""} onChange={(e) => setForm({ ...form, responsibleAnimatorId: e.target.value || undefined })}>
                <option value="">— Ninguno —</option>
                {animators.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Alergias"><input className={inputCls} value={form.allergies ?? ""} onChange={(e) => setForm({ ...form, allergies: e.target.value })} /></Field>
            <Field label="Intolerancias"><input className={inputCls} value={form.intolerances ?? ""} onChange={(e) => setForm({ ...form, intolerances: e.target.value })} /></Field>
            <Field label="Medicación"><input className={inputCls} value={form.medication ?? ""} onChange={(e) => setForm({ ...form, medication: e.target.value })} /></Field>
          </div>
          <Field label="Observaciones"><textarea className={inputCls + " min-h-20"} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex gap-2 pt-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((p) => {
          const g = groups.find((x) => x.id === p.groupId);
          return (
            <Card key={p.id} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{p.name} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">{p.age} años · {p.hometown} · {g?.name ?? "Sin grupo"}</p>
                {(p.allergies || p.medication || p.intolerances) && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    {[p.allergies && `⚠️ ${p.allergies}`, p.intolerances && `🥛 ${p.intolerances}`, p.medication && `💊 ${p.medication}`].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => startEdit(p)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
                <DangerButton onClick={() => remove(p.id)}><Trash2 className="size-3.5" /></DangerButton>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
