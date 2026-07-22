import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { getProjectBySlug } from "@/services/projects/getProjectBySlug";
import { getProjects } from "@/services/projects/getProjects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32 xl:px-16">
      <div className="mx-auto w-full max-w-[880px]">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to works
        </Link>

        <div className="mt-10 flex items-start gap-5">
          <div
            className={[
              "relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl",
              project.iconHasDarkBg ? "bg-slate-950 p-3" : "bg-transparent",
            ].join(" ")}
          >
            <Image
              src={project.iconPath}
              alt={`${project.title} logo`}
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {project.title}
            </h1>
          </div>
        </div>

        <p className="mt-10 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
          {project.longDescription}
        </p>
      </div>
    </main>
  );
}
