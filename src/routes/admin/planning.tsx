import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { AdminShell, Card } from "@/components/AdminShell";
import { useCampStore } from "@/lib/camp-store";
import { campDays, PLANNER_ROWS, categoryMeta } from "@/lib/camp-data";

export const Route = createFileRoute("/admin/planning")({
  head: () => ({ meta: [{ title: "Planning · Admin" }] }),
  component: PlanningAdmin,
});

function PlanningAdmin() {
  const { activities } = useCampStore();

  return (
    <AdminShell eyebrow="Vista semanal editable" title="Planning">
      <p className="text-sm text-muted-foreground mb-4">
        Haz clic en cualquier celda para editar la actividad. Usa la columna de la izquierda para añadir actividades nuevas.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 min-w-[900px]">
          <thead>
            <tr>
              <th className="text-[10px] font-mono uppercase text-muted-foreground text-left p-2 w-28">Bloque</th>
              {campDays.map((d) => (
                <th key={d.date} className="text-[10px] font-mono uppercase text-muted-foreground text-left p-2">
                  <Link to="/admin/dia/$date" params={{ date: d.date }} className="hover:text-brand">
                    {d.label}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANNER_ROWS.map((row) => {
              const meta = categoryMeta[row.category];
              return (
                <tr key={row.category}>
                  <td className={`p-2 text-xs font-bold rounded-l-xl ${meta.soft} ${meta.text}`}>{row.label}</td>
                  {campDays.map((d) => {
                    const a = activities.find((x) => x.date === d.date && x.category === row.category);
                    return (
                      <td key={d.date} className="p-1 align-top">
                        {a ? (
                          <Link to="/admin/actividades" search={{ id: a.id }} className="block bg-white border border-border rounded-xl p-2 hover:border-foreground/30">
                            <p className="text-[10px] font-mono text-muted-foreground">{a.startTime}–{a.endTime}</p>
                            <p className="text-xs font-bold leading-tight mt-0.5 line-clamp-2">{a.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{a.location}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] text-brand font-bold mt-1"><Pencil className="size-3" /> editar</span>
                          </Link>
                        ) : (
                          <Link to="/admin/actividades" search={{ date: d.date, category: row.category }} className="block bg-stone-50 border border-dashed border-border rounded-xl p-2 hover:border-foreground/30 text-center text-[10px] text-muted-foreground">
                            <Plus className="size-3 inline" /> añadir
                          </Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Por días</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {campDays.map((d) => (
            <Link key={d.date} to="/admin/dia/$date" params={{ date: d.date }}>
              <Card className="text-center hover:border-foreground/30">
                <p className="text-[10px] font-mono text-muted-foreground">{d.weekday.slice(0, 3)}</p>
                <p className="font-black text-lg">{d.label.split(" ")[1]}</p>
                <p className="text-[10px] text-muted-foreground">{activities.filter((a) => a.date === d.date).length} acts</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
