import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StackSection } from "@/components/sections/StackSection";
import { getServices } from "@/services/catalog/getServices";
import { getProjects } from "@/services/projects/getProjects";
import { getStackGroups } from "@/services/stack/getStackGroups";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected projects, services, and technology stack by Jessy Prananda.",
};

export default function WorksPage() {
  const projects = getProjects();
  const services = getServices();
  const stackGroups = getStackGroups();

  return (
    <main>
      <section
        aria-labelledby="works-page-title"
        className="relative isolate min-h-[520px] overflow-hidden border-b border-slate-200 bg-slate-50"
      >
        <Image
          src="/images/bg-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-[72%_bottom] sm:object-[68%_bottom] lg:object-bottom"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-r from-white via-white/90 to-white/10 sm:via-white/80 lg:via-white/55 lg:to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-b from-white/70 via-white/10 to-white/20"
        />

        <div className="mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36 xl:px-16">
          <div className="flex max-w-3xl gap-5 sm:gap-8">
            <div
              aria-hidden="true"
              className="relative hidden w-px shrink-0 overflow-hidden bg-slate-900 sm:block"
            >
              <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-600">
                Portfolio / Works
              </p>

              <h1
                id="works-page-title"
                className="mt-5 font-serif text-[clamp(4rem,10vw,8rem)] leading-[0.84] tracking-[-0.055em] text-slate-950"
              >
                Selected
                <br />
                Works
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                A collection of digital products, websites, applications, and
                AI integrations I have designed and developed.
              </p>

              <Link
                href="#projects"
                className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-slate-950 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
              >
                Explore projects
                <ArrowDownRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProjectsSection projects={projects} />
      <ServicesSection services={services} />
      <StackSection groups={stackGroups} />

      <section className="bg-white px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="flex flex-col gap-7 border-y border-slate-200 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
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

            <Link
              href="/contact"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-slate-950 px-7 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:w-auto"
            >
              Contact Me
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
