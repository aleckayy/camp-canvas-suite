import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { shifts, shiftMeta, getAnimator, TODAY, currentUser } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/turnos")({
  head: () => ({ meta: [{ title: "Turnos · CampaWeb" }] }),
  component: ShiftsPage,
});

function ShiftsPage() {
  useCampStore();
  const todayShifts = shifts.filter((s) => s.date === TODAY);
  return (
    <AppShell>
      <PageHeader eyebrow={`Hoy · ${TODAY}`} title="Turnos del día" />
      <div className="space-y-2">
        {todayShifts.map((s) => {
          const m = shiftMeta[s.type];
          const mine = s.animatorIds.includes(currentUser.id);
          return (
            <div key={s.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 ${mine ? "border-brand ring-2 ring-brand/20" : "border-border"}`}>
              <span className={`size-12 rounded-xl ${m.tone} text-xl flex items-center justify-center shrink-0`}>{m.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold">{m.label}</p>
                  {mine && <span className="text-[9px] font-bold uppercase bg-brand text-white px-1.5 py-0.5 rounded">Tú</span>}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {s.animatorIds.map((id) => getAnimator(id)?.name).filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}