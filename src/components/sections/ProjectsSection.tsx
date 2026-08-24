import Link from "next/link";

import type { Project } from "@/types/project";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Selected projects
          </p>
          <h2
            id="projects-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
          >
            Work
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
            Websites and applications designed to solve real problems.
          </p>
        </header>

        <div className="mt-12 border-t border-rule">
          {projects.length === 0 ? (
            <p className="py-8 text-sm text-ink-muted">
              No projects available yet.
            </p>
          ) : (
            projects.map((project) => (
              <article
                key={project.slug}
                className="grid gap-3 border-b border-rule py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
              >
                <p className="font-mono text-xs text-ink-muted">
                  {project.year}
                </p>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                      <Link
                        href={`/works/${project.slug}`}
                        className="transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    {project.isFlagship ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                        Flagship
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {project.shortDescription}
                  </p>
                  <p className="mt-2 font-mono text-xs text-ink-muted">
                    {project.category}
                  </p>
                </div>
                <Link
                  href={`/works/${project.slug}`}
                  aria-label={`Open ${project.title}`}
                  className="font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline"
                >
                  Open
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
