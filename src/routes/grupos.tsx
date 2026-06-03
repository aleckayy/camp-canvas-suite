import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { groups, getAnimator, getGroupParticipants } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/grupos")({
  head: () => ({ meta: [{ title: "Grupos · CampaWeb" }] }),
  component: GroupsPage,
});

function GroupsPage() {
  useCampStore();
  return (
    <AppShell>
      <PageHeader eyebrow={`${groups.length} grupos`} title="Grupos del campamento" action={
        <Link to="/participantes" className="text-xs font-bold text-brand">Todos los chavales →</Link>
      } />
      <div className="space-y-3">
        {groups.map((g) => {
          const animator = getAnimator(g.animatorId);
          const ps = getGroupParticipants(g.id);
          return (
            <div key={g.id} className="bg-white border border-border rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className={`size-12 rounded-xl ${g.color} text-white font-black flex items-center justify-center shrink-0`}>
                  {g.name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-extrabold tracking-tight">{g.name}</h3>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">{ps.length} chavales</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{g.description}</p>
                  {animator && (
                    <p className="text-[11px] font-bold mt-2">
                      <span className="text-muted-foreground font-medium">Animador/a · </span>{animator.name}
                    </p>
                  )}
                </div>
              </div>
              {ps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {ps.map((p) => (
                    <span key={p.id} className="text-[11px] bg-background border border-border rounded-full px-2.5 py-0.5 font-medium">
                      {p.name} {p.lastName.split(" ")[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}