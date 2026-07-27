import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Challenges } from "@/components/projects/Challenges";
import { Features } from "@/components/projects/Features";
import { FooterCTA } from "@/components/projects/FooterCTA";
import { Gallery } from "@/components/projects/Gallery";
import { Hero } from "@/components/projects/Hero";
import { HeroImage } from "@/components/projects/HeroImage";
import { InfoGrid } from "@/components/projects/InfoGrid";
import { Overview } from "@/components/projects/Overview";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { Results } from "@/components/projects/Results";
import { Stack } from "@/components/projects/Stack";
import { Timeline } from "@/components/projects/Timeline";
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

  const relatedProjects = getProjects()
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  return (
    <main className="bg-white">
      <Hero project={project} />
      <HeroImage
        src={project.heroImage}
        caption={project.heroCaption}
        title={project.title}
      />
      <Overview
        heading={project.overviewHeading}
        description={project.longDescription}
      />
      <InfoGrid project={project} />
      <Features features={project.features} />
      <Gallery items={project.gallery} title={project.title} />
      <Timeline items={project.timeline} />
      <Stack tech={project.tech} />
      <Challenges items={project.challenges} />
      <Results results={project.results} />
      <RelatedProjects projects={relatedProjects} />
      <FooterCTA />
    </main>
  );
}
