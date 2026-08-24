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
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-rule py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-8"
              >
                <p className="font-mono text-xs text-ink-muted sm:row-start-1">
                  {project.year}
                </p>
                <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <h3 className="min-w-0 text-xl font-semibold tracking-[-0.03em] text-ink">
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
                  className="inline-flex min-h-11 items-center font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline sm:col-start-3 sm:row-start-1"
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
