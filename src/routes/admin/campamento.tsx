import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, Card, Field, GhostButton, PrimaryButton, inputCls } from "@/components/AdminShell";
import { campActions, useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/admin/campamento")({
  head: () => ({ meta: [{ title: "Campamento · Admin" }] }),
  component: CampamentoAdmin,
});

function CampamentoAdmin() {
  const { camp } = useCampStore();
  const [form, setForm] = useState(camp);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm({ ...form, [k]: v });
    setSaved(false);
  }

  return (
    <AdminShell eyebrow="Información general" title="Campamento">
      <Card className="max-w-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre"><input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
          <Field label="Lema"><input className={inputCls} value={form.motto} onChange={(e) => update("motto", e.target.value)} /></Field>
          <Field label="Temática"><input className={inputCls} value={form.theme} onChange={(e) => update("theme", e.target.value)} /></Field>
          <Field label="Lugar"><input className={inputCls} value={form.location} onChange={(e) => update("location", e.target.value)} /></Field>
          <Field label="Fecha inicio"><input type="date" className={inputCls} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} /></Field>
          <Field label="Fecha fin"><input type="date" className={inputCls} value={form.endDate} onChange={(e) => update("endDate", e.target.value)} /></Field>
          <Field label="Estado">
            <select className={inputCls} value={form.status} onChange={(e) => update("status", e.target.value as typeof form.status)}>
              <option value="preparacion">Preparación</option>
              <option value="activo">Activo</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </Field>
          <Field label="Color principal"><input type="color" className={inputCls + " h-10"} value={form.primaryColor ?? "#FF5A1F"} onChange={(e) => update("primaryColor", e.target.value)} /></Field>
          <Field label="Color secundario"><input type="color" className={inputCls + " h-10"} value={form.secondaryColor ?? "#0F172A"} onChange={(e) => update("secondaryColor", e.target.value)} /></Field>
          <Field label="Imagen principal (URL)"><input className={inputCls} value={form.image ?? ""} onChange={(e) => update("image", e.target.value)} placeholder="https://…" /></Field>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <PrimaryButton onClick={() => { campActions.updateCamp(form); setSaved(true); }}>Guardar cambios</PrimaryButton>
          <GhostButton onClick={() => setForm(camp)}>Descartar</GhostButton>
          {saved && <span className="text-xs text-emerald-600 font-semibold">✓ Guardado</span>}
        </div>
      </Card>
    </AdminShell>
  );
}
