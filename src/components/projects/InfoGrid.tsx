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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Details
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Project info
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="border-t border-rule py-6"
          >
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {card.label}
            </p>
            <p className="mt-3 min-w-0 text-base font-medium leading-7 text-ink [overflow-wrap:anywhere]">
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
