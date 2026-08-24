import Link from "next/link";

import { SectionShell } from "@/components/projects/SectionShell";
import type { Project } from "@/types/project";

type RelatedProjectsProps = {
  projects: Project[];
};

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <SectionShell tone="muted">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Continue exploring
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Other projects
        </h2>
      </div>

      <div className="mt-12 border-t border-rule">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="grid gap-3 border-b border-rule py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
          >
            <p className="font-mono text-xs text-ink-muted">
              {project.year}
            </p>
            <div className="min-w-0">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                <Link
                  href={`/works/${project.slug}`}
                  className="transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {project.shortDescription}
              </p>
              <p className="mt-2 font-mono text-xs text-ink-muted">
                {project.category}
              </p>
            </div>
            <Link
              href={`/works/${project.slug}`}
              className="font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Open
            </Link>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
