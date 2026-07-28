import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import type { Project } from "@/types/project";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
        <Reveal trigger="scroll" direction="up" duration={700}>
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
              Selected projects
            </p>
            <h2
              id="projects-title"
              className="mt-4 text-4xl font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl"
            >
              Digital products
              <br />
              I&apos;ve built
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
              A selection of websites and web applications designed to solve real
              problems.
            </p>
          </header>
        </Reveal>

        <div className="border-b border-slate-200">
          {projects.length === 0 ? (
            <Reveal trigger="scroll" direction="up" delay={120}>
              <p className="border-t border-slate-200 py-8 text-sm text-slate-600">
                No projects available yet.
              </p>
            </Reveal>
          ) : (
            projects.map((project, index) => (
              <Reveal
                key={project.slug}
                trigger="scroll"
                direction="up"
                delay={120 + index * 80}
                duration={700}
              >
                <article
                  className={[
                    "group grid gap-5 border-t py-6 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 lg:py-7",
                    project.isFlagship
                      ? "bg-slate-50/80 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl border-orange-500/20"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:size-[72px]",
                      project.iconHasDarkBg
                        ? "bg-slate-950 p-2.5"
                        : "bg-transparent",
                    ].join(" ")}
                  >
                    <Image
                      src={project.iconPath}
                      alt={`${project.title} logo`}
                      width={72}
                      height={72}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-orange-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        {project.category}
                      </p>
                      {project.isFlagship ? (
                        <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-600">
                          Flagship
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:justify-center">
                    <span className="font-mono text-xs text-slate-500">
                      {project.year}
                    </span>
                    <Link
                      href={`/works/${project.slug}`}
                      aria-label={`Learn more about ${project.title}`}
                      className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    >
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
