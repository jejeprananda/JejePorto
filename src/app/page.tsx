import type { Metadata } from "next";

import { HeroVideoChapter } from "@/components/sections/HeroVideoChapter";
import { IdentityStrip } from "@/components/sections/IdentityStrip";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StackSection } from "@/components/sections/StackSection";
import { CloseCta } from "@/components/shared/CloseCta";
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
      <HeroVideoChapter>
        <IdentityStrip />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <StackSection groups={stackGroups} />
        <CloseCta />
      </HeroVideoChapter>
    </main>
  );
}
