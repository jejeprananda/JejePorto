import type { Metadata } from "next";

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
    <main className="pt-20 lg:pt-24">
      <ProjectsSection projects={projects} />
      <ServicesSection services={services} />
      <StackSection groups={stackGroups} />
    </main>
  );
}
