import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectDetail } from "@/types/project";

type InfoGridProps = {
  project: ProjectDetail;
};

export function InfoGrid({ project }: InfoGridProps) {
  const cards = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.duration },
    { label: "Client", value: project.client },
    { label: "Platform", value: project.platform },
    { label: "Frontend", value: project.frontend },
    { label: "Backend", value: project.backend },
    { label: "Database", value: project.database },
    { label: "Deployment", value: project.deployment },
  ];

  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Details
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Project info
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5"
          >
            <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
              {card.label}
            </p>
            <p className="mt-3 text-base font-medium leading-7 text-slate-950">
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
