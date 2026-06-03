import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminShell, Card, DangerButton, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";
import { type Animator, type Role } from "@/lib/camp-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/animadores")({
  head: () => ({ meta: [{ title: "Animadores · Admin" }] }),
  component: AnimadoresAdmin,
});

const emptyForm: Omit<Animator, "id"> = {
  name: "",
  lastName: "",
  initials: "",
  role: "animador",
  email: "",
  phone: "",
  hometown: "",
  responsibilities: "",
  active: true,
  groupId: undefined,
};

function AnimadoresAdmin() {
  const { animators, groups } = useCampStore();
  const auth = useAuth();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Animator, "id">>(emptyForm);
  const [pwd, setPwd] = useState("");

  function startNew() { setEditing("new"); setForm(emptyForm); setPwd(""); }
  function startEdit(a: Animator) {
    setEditing(a.id);
    const { id: _id, ...rest } = a;
    void _id;
    setForm({ ...emptyForm, ...rest });
    setPwd("");
  }
  function cancel() { setEditing(null); }

  function save() {
    const initials = form.initials || (form.name.slice(0, 1) + (form.lastName?.slice(0, 1) ?? "")).toUpperCase();
    if (editing === "new") {
      campActions.addAnimator({ ...form, initials });
      if (form.email && pwd) {
        auth.createAccount({ email: form.email, password: pwd, name: `${form.name} ${form.lastName ?? ""}`.trim(), role: form.role === "admin" ? "admin" : "animador" });
      }
    } else if (editing) {
      campActions.updateAnimator(editing, { ...form, initials });
      if (form.email && pwd) {
        const existing = auth.listAccounts().find((u) => u.email.toLowerCase() === form.email!.toLowerCase());
        if (existing) auth.updateAccount(existing.id, { password: pwd });
        else auth.createAccount({ email: form.email, password: pwd, name: form.name, role: form.role === "admin" ? "admin" : "animador" });
      }
    }
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar este animador?")) return;
    campActions.removeAnimator(id);
  }

  return (
    <AdminShell
      eyebrow={`${animators.length} animadores`}
      title="Animadores"
      action={<PrimaryButton onClick={startNew}><Plus className="size-3 inline mr-1" />Nuevo</PrimaryButton>}
    >
      {editing && (
        <Card className="mb-4 max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {editing === "new" ? "Nuevo animador" : "Editar animador"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nombre"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Apellidos"><input className={inputCls} value={form.lastName ?? ""} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            <Field label="Email"><input type="email" className={inputCls} value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Teléfono"><input className={inputCls} value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Casa de procedencia"><input className={inputCls} value={form.hometown ?? ""} onChange={(e) => setForm({ ...form, hometown: e.target.value })} /></Field>
            <Field label="Rol">
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option value="animador">Animador</option>
                <option value="coordinacion">Coordinación</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label="Grupo asignado">
              <select className={inputCls} value={form.groupId ?? ""} onChange={(e) => setForm({ ...form, groupId: e.target.value || undefined })}>
                <option value="">— Sin grupo —</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
            <Field label="Estado">
              <select className={inputCls} value={form.active ? "1" : "0"} onChange={(e) => setForm({ ...form, active: e.target.value === "1" })}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </Field>
            <Field label="Foto (URL)"><input className={inputCls} value={form.photoUrl ?? ""} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} /></Field>
            <Field label="Contraseña (opcional)"><input type="password" className={inputCls} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Dejar vacío para no cambiar" /></Field>
          </div>
          <Field label="Responsabilidades">
            <textarea className={inputCls + " min-h-20"} value={form.responsibilities ?? ""} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
          </Field>
          <div className="flex items-center gap-2 pt-2">
            <PrimaryButton onClick={save}>Guardar</PrimaryButton>
            <GhostButton onClick={cancel}>Cancelar</GhostButton>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {animators.map((a) => {
          const g = groups.find((x) => x.id === a.groupId);
          return (
            <Card key={a.id} className="flex items-start gap-3">
              <div className={`size-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 ${a.active === false ? "opacity-40" : ""}`}>
                <span className="text-brand font-bold text-sm">{a.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm truncate">{a.name} {a.lastName ?? ""}</p>
                  {a.active === false && <span className="text-[9px] font-bold uppercase bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">Inactivo</span>}
                </div>
                <p className="text-xs text-muted-foreground">{a.role}{g ? ` · ${g.name}` : ""}</p>
                {a.email && <p className="text-[11px] text-muted-foreground mt-0.5">{a.email}</p>}
              </div>
              <div className="flex flex-col items-end gap-1">
                <button onClick={() => startEdit(a)} className="text-foreground/60 hover:text-foreground" title="Editar"><Pencil className="size-3.5" /></button>
                <DangerButton onClick={() => remove(a.id)} title="Eliminar"><Trash2 className="size-3.5" /></DangerButton>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
