import type { Metadata } from "next";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { CvSection } from "@/components/sections/CvSection";
import { HomeScrollExpand } from "@/components/sections/HomeScrollExpand";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StackSection } from "@/components/sections/StackSection";
import { Reveal } from "@/components/shared/Reveal";
import { getServices } from "@/services/catalog/getServices";
import { getCvData } from "@/services/cv/getCvData";
import { getProjects } from "@/services/projects/getProjects";
import { getStackGroups } from "@/services/stack/getStackGroups";

export const metadata: Metadata = {
  title: {
    absolute: "Jessy Prananda Ismail",
  },
  description:
    "Jessy Prananda — Fullstack Designer. Portfolio, selected works, and introduction.",
};

export default function HomePage() {
  const projects = getProjects();
  const services = getServices();
  const stackGroups = getStackGroups();
  const cvData = getCvData();

  return (
    <main>
      <noscript>
        <style>{`
          [data-reveal] {
            opacity: 1 !important;
            translate: 0 0 !important;
            scale: 1 1 !important;
            transition: none !important;
          }
        `}</style>
      </noscript>

      <HomeScrollExpand>
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <StackSection groups={stackGroups} />

        <section className="bg-white px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-28">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex flex-col gap-7 border-y border-slate-200 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
              <Reveal trigger="scroll" direction="up" duration={700}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                    Start a project
                  </p>

                  <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-slate-950 sm:text-4xl">
                    Have something in mind?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Let&apos;s collaborate and build something useful.
                  </p>
                </div>
              </Reveal>

              <Reveal
                trigger="scroll"
                direction="up"
                delay={100}
                duration={700}
              >
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-slate-950 px-7 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:w-auto"
                >
                  Contact Me
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <CvSection data={cvData} />
      </HomeScrollExpand>
    </main>
  );
}
