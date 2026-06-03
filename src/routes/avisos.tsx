import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { notices, getAnimator } from "@/lib/camp-data";
import { useCampStore } from "@/lib/camp-store";

export const Route = createFileRoute("/avisos")({
  head: () => ({ meta: [{ title: "Avisos · CampaWeb" }] }),
  component: NoticesPage,
});

function NoticesPage() {
  useCampStore();
  return (
    <AppShell>
      <PageHeader eyebrow={`${notices.length} publicados`} title="Tablón de avisos" />
      <div className="space-y-3">
        {notices.map((n) => {
          const author = getAnimator(n.authorId);
          return (
            <div key={n.id} className={`rounded-2xl p-4 border ${n.urgent ? "bg-red-50 border-red-200" : "bg-white border-border"}`}>
              <div className="flex items-center gap-2 mb-1">
                {n.urgent && <span className="text-[9px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded">Urgente</span>}
                <span className="text-[10px] font-mono uppercase text-muted-foreground">{n.createdAt.replace("T", " · ")}</span>
              </div>
              <h3 className="text-sm font-extrabold leading-tight">{n.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5">{n.body}</p>
              {author && <p className="text-[10px] font-mono text-muted-foreground mt-2">— {author.name}</p>}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}