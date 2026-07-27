import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Continue exploring
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Other projects
        </h2>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/works/${project.slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-500/50"
          >
            <div
              className={[
                "relative flex size-14 items-center justify-center overflow-hidden rounded-2xl",
                project.iconHasDarkBg ? "bg-slate-950 p-2.5" : "bg-slate-50 p-2",
              ].join(" ")}
            >
              <Image
                src={project.iconPath}
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {project.shortDescription}
                </p>
              </div>
              <ArrowUpRight
                className="mt-1 size-5 shrink-0 text-slate-400 transition duration-300 group-hover:text-orange-600"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
