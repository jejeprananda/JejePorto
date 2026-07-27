import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import type { ProjectDetail } from "@/types/project";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

type HeroProps = {
  project: ProjectDetail;
};

export function Hero({ project }: HeroProps) {
  const techCount = project.tech.length;

  const metaItems = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Company", value: project.company },
    { label: "Status", value: project.status },
    { label: "Duration", value: project.duration },
    { label: "Technologies", value: String(techCount) },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center lg:gap-16 lg:px-12 lg:pb-24 lg:pt-36 xl:px-16">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition duration-300 hover:text-orange-600">
                  Portfolio
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">
                /
              </li>
              <li>
                <Link href="/works" className="transition duration-300 hover:text-orange-600">
                  Works
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="mt-8 font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-slate-950">
            {project.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {project.shortDescription}
          </p>

          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5">
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-slate-950 sm:text-base">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            {project.websiteUrl ? (
              <Link
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Visit Website
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            ) : null}

            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-950 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <GithubIcon className="size-4" />
                Github
              </Link>
            ) : null}

            <Link
              href="/works"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-medium text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Works
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div
            className={[
              "relative flex aspect-square w-full max-w-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm",
              project.iconHasDarkBg ? "bg-slate-950 p-10" : "bg-white p-10",
            ].join(" ")}
          >
            <Image
              src={project.iconPath}
              alt={`${project.title} logo`}
              width={220}
              height={220}
              className="h-auto w-full max-w-[220px] object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
