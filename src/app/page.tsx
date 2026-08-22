import type { Metadata } from "next";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { HomeScrollExpand } from "@/components/sections/HomeScrollExpand";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StackSection } from "@/components/sections/StackSection";
import { Reveal } from "@/components/shared/Reveal";
import { getServices } from "@/services/catalog/getServices";
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

        <section className="bg-white px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex flex-col gap-8 border-y border-slate-200 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
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

                  <p className="mt-5 text-sm font-medium text-slate-950">
                    Need CV of mine? Get here.
                  </p>
                </div>
              </Reveal>

              <Reveal
                trigger="scroll"
                direction="up"
                delay={100}
                duration={700}
              >
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-slate-950 px-7 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 lg:w-auto"
                  >
                    Contact Me
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/cv"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-slate-200 bg-white px-7 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 lg:w-auto"
                  >
                    Download CV
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </HomeScrollExpand>
    </main>
  );
}
