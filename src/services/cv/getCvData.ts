import { contactConfig, getWhatsAppUrl } from "../../config/contact";
import type {
  CvContactLink,
  CvData,
  CvExperience,
  CvService,
  CvSkillGroup,
} from "../../types/cv";
import { getServices } from "../catalog/getServices";
import { getProjectBySlug } from "../projects/getProjectBySlug";
import { getProjects } from "../projects/getProjects";
import { getStackGroups } from "../stack/getStackGroups";

const NAME = "Jessy Prananda Ismail";
const HEADLINE = "Fullstack Developer & Designer";

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function buildContacts(): CvContactLink[] {
  const contacts: CvContactLink[] = [
    {
      label: "Email",
      value: contactConfig.email,
      href: `mailto:${contactConfig.email}`,
    },
    {
      label: "WhatsApp",
      value: contactConfig.whatsapp.display,
      href: getWhatsAppUrl(),
    },
    {
      label: "Location",
      value: contactConfig.locationLabel,
      href: "",
    },
  ];

  for (const social of contactConfig.socials) {
    if (social.label === "Mail") {
      continue;
    }

    contacts.push({
      label: social.label,
      value: stripProtocol(social.href),
      href: social.href,
    });
  }

  return contacts;
}

function buildExperience(): CvExperience[] {
  return getProjects().flatMap((project) => {
    const detail = getProjectBySlug(project.slug);

    if (!detail) {
      return [];
    }

    const highlights = detail.results.map(
      (result) => `${result.value} — ${result.label}`,
    );

    return [
      {
        slug: detail.slug,
        title: detail.title,
        role: detail.role,
        company: detail.company,
        period: detail.year,
        category: detail.category,
        status: detail.status,
        description: detail.shortDescription,
        highlights,
        tech: detail.tech,
      },
    ];
  });
}

function buildSkills(): CvSkillGroup[] {
  return getStackGroups().map((group) => ({
    title: group.title,
    skills: group.technologies,
  }));
}

function buildServices(): CvService[] {
  return getServices().map((service) => ({
    title: service.title,
    description: service.shortDescription,
  }));
}

function buildSummary(
  experience: CvExperience[],
  skills: CvSkillGroup[],
): string {
  const flagship = experience.find(
    (item) => item.company && item.status.toLowerCase().includes("production"),
  );
  const anchor = flagship ?? experience[0];

  const frontend = skills.find((group) => group.title === "Frontend");
  const backend = skills.find((group) => group.title === "Backend");

  const frontendSample = frontend?.skills.slice(0, 3).join(", ");
  const backendSample = backend?.skills.slice(0, 3).join(", ");

  const parts = [
    `Fullstack developer and designer with hands-on experience delivering ${experience.length} shipped products — from enterprise and government platforms to organization websites.`,
  ];

  if (anchor) {
    parts.push(
      `Currently building the ${anchor.title} platform for ${anchor.company}.`,
    );
  }

  if (frontendSample && backendSample) {
    parts.push(
      `Comfortable across the stack with ${frontendSample} on the frontend and ${backendSample} on the backend, focused on clean, maintainable interfaces and reliable delivery.`,
    );
  }

  return parts.join(" ");
}

export function getCvData(): CvData {
  const experience = buildExperience();
  const skills = buildSkills();

  return {
    name: NAME,
    headline: HEADLINE,
    location: contactConfig.locationLabel,
    availability: contactConfig.isAvailableForWork
      ? contactConfig.availableLabel
      : null,
    summary: buildSummary(experience, skills),
    contacts: buildContacts(),
    experience,
    skills,
    services: buildServices(),
  };
}
