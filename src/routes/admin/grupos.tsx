import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Group } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/grupos")({
  head: () => ({ meta: [{ title: "Grupos · Admin" }] }),
  component: GruposAdmin,
});

const COLORS = ["bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-lime-500", "bg-cyan-500"];
const empty: Omit<Group, "id"> = { name: "", color: "bg-rose-500", description: "", animatorId: "" };

function GruposAdmin() {
  const { groups, animators, participants } = useCampStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Group, "id">>(empty);

  function startNew() { setEditing("new"); setForm(empty); }
  function startEdit(g: Group) { setEditing(g.id); const { id: _, ...rest } = g; void _; setForm(rest); }
  function save() {
    if (editing === "new") campActions.addGroup(form);
    else if (editing) campActions.updateGroup(editing, form);
    setEditing(null);
  }
  function remove(id: string) { if (confirm("¿Eliminar grupo?")) campActions.removeGroup(id); }
  function reassign(participantId: string, groupId: string) {
    campActions.updateParticipant(participantId, { groupId });
  }

  return (
    <AdminShell
      eyebrow={`${groups.length} grupos`}
      title="Grupos"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      {editing && (
        <Card className="mb-4 max-w-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nombre"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Color">
              <select className={inputCls} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                {COLORS.map((c) => <option key={c} value={c}>{c.replace("bg-", "").replace("-500", "")}</option>)}
              </select>
            </Field>
            <Field label="Animador responsable">
              <select className={inputCls} value={form.animatorId} onChange={(e) => setForm({ ...form, animatorId: e.target.value })}>
                <option value="">— Ninguno —</option>
                {animators.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Descripción"><input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="flex gap-2"><PrimaryButton onClick={save}>Guardar</PrimaryButton><GhostButton onClick={() => setEditing(null)}>Cancelar</GhostButton></div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map((g) => {
          const animator = animators.find((a) => a.id === g.animatorId);
          const members = participants.filter((p) => p.groupId === g.id);
          return (
            <Card key={g.id}>
              <div className="flex items-start gap-3">
                <div className={`size-8 rounded-lg ${g.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Responsable: {animator?.name ?? "—"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => startEdit(g)} className="text-foreground/60 hover:text-foreground"><Pencil className="size-3.5" /></button>
                  <DangerButton onClick={() => remove(g.id)}><Trash2 className="size-3.5" /></DangerButton>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Participantes ({members.length})</p>
                <div className="space-y-1">
                  {members.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span>{p.name} {p.lastName}</span>
                      <select className="text-[10px] border border-border rounded px-1 py-0.5" value={p.groupId} onChange={(e) => reassign(p.id, e.target.value)}>
                        {groups.map((og) => <option key={og.id} value={og.id}>{og.name}</option>)}
                      </select>
                    </div>
                  ))}
                  {members.length === 0 && <p className="text-xs text-muted-foreground italic">Sin participantes</p>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
