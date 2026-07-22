import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "portfolio.db");

fs.mkdirSync(dataDir, { recursive: true });

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    year TEXT NOT NULL,
    icon_path TEXT NOT NULL,
    icon_has_dark_bg INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE services (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    detail_description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE stack (
    id INTEGER PRIMARY KEY,
    group_title TEXT NOT NULL,
    group_number TEXT NOT NULL,
    technology TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );
`);

const insertProject = db.prepare(`
  INSERT INTO projects (
    slug, title, category, short_description, long_description,
    year, icon_path, icon_has_dark_bg, sort_order
  ) VALUES (
    @slug, @title, @category, @short_description, @long_description,
    @year, @icon_path, @icon_has_dark_bg, @sort_order
  )
`);

const projects = [
  {
    slug: "angkasa",
    title: "Angkasa",
    category: "Website",
    short_description:
      "A brand-focused website experience with clear storytelling and a calm visual system.",
    long_description:
      "Angkasa is a marketing website built to communicate brand identity with clarity and atmosphere. The work focused on information hierarchy, responsive layout, and a polished visual system that stays readable over a strong photographic backdrop. The result is a fast, accessible site that presents the brand without visual noise.",
    year: "2025",
    icon_path: "/images/logo/logo_angkasa.png",
    icon_has_dark_bg: 1,
    sort_order: 1,
  },
  {
    slug: "jfaa",
    title: "JFAA",
    category: "Website",
    short_description:
      "A modern company website focused on clear information architecture and accessible navigation.",
    long_description:
      "JFAA is a responsive company website designed for clarity and trust. Content structure, navigation, and typography were prioritized so visitors can find services and organizational information quickly. The build emphasizes performance, semantic HTML, and a clean visual language that scales from mobile to desktop.",
    year: "2025",
    icon_path: "/images/logo/logo_jfaa.png",
    icon_has_dark_bg: 0,
    sort_order: 2,
  },
  {
    slug: "sakti",
    title: "Sakti",
    category: "Webapp",
    short_description:
      "An internal web application supporting operational workflows with a practical, reliable UI.",
    long_description:
      "Sakti is a web application built around real operational workflows. The interface prioritizes task clarity, status visibility, and dependable interactions for frequent users. Implementation focused on maintainable frontend structure, consistent components, and a backend integration approach that keeps the experience stable as features grow.",
    year: "2025",
    icon_path: "/images/logo/logo_sakti.png",
    icon_has_dark_bg: 0,
    sort_order: 3,
  },
  {
    slug: "skk",
    title: "SKK",
    category: "Webapp",
    short_description:
      "A business webapp for structured processes, dashboards, and day-to-day operational visibility.",
    long_description:
      "SKK is a business-facing web application designed to support structured processes and day-to-day visibility. The product work combined practical UI patterns with clear data presentation so teams can move through common tasks without friction. The emphasis was reliability, readable interfaces, and a foundation that can expand with additional modules.",
    year: "2024",
    icon_path: "/images/logo/logo_skk.png",
    icon_has_dark_bg: 0,
    sort_order: 4,
  },
] as const;

for (const project of projects) {
  insertProject.run(project);
}

const insertService = db.prepare(`
  INSERT INTO services (
    slug, title, short_description, detail_description, icon_name, sort_order
  ) VALUES (
    @slug, @title, @short_description, @detail_description, @icon_name, @sort_order
  )
`);

const services = [
  {
    slug: "webapp",
    title: "Webapp",
    short_description:
      "Powerful web-based applications with robust features, dashboards, and business processes.",
    detail_description:
      "I design and build web applications for internal tools, dashboards, and business workflows. Engagements typically cover information architecture, interface design, frontend implementation, and integration with backend APIs. Delivery focuses on clarity for frequent users, maintainable component structure, and reliable interaction patterns.",
    icon_name: "app-window",
    sort_order: 1,
  },
  {
    slug: "website",
    title: "Website",
    short_description:
      "Fast, responsive marketing websites that communicate value and build trust.",
    detail_description:
      "I create marketing and company websites that communicate value clearly. Work includes content hierarchy, responsive layout, performance-minded implementation, and accessible markup. The goal is a site that looks intentional, loads quickly, and helps visitors understand the brand and next action.",
    icon_name: "globe",
    sort_order: 2,
  },
  {
    slug: "mobile-app",
    title: "Mobile App",
    short_description:
      "Native or cross-platform mobile applications designed for usability and performance.",
    detail_description:
      "I design and develop mobile experiences that feel natural on small screens. Scope can include UX flows, UI systems, and cross-platform implementation. Priorities are touch-friendly interaction, readable hierarchy, and performance that supports everyday use.",
    icon_name: "smartphone",
    sort_order: 3,
  },
  {
    slug: "mcp-server",
    title: "MCP Server",
    short_description:
      "AI-ready tools and server integrations built using the Model Context Protocol.",
    detail_description:
      "I build MCP servers that expose structured tools and data to AI clients. Work includes tool design, safe input handling, clear response contracts, and integration with existing systems. The outcome is a reliable bridge between AI assistants and your operational data or workflows.",
    icon_name: "terminal",
    sort_order: 4,
  },
] as const;

for (const service of services) {
  insertService.run(service);
}

const insertStack = db.prepare(`
  INSERT INTO stack (group_title, group_number, technology, sort_order)
  VALUES (@group_title, @group_number, @technology, @sort_order)
`);

const stackGroups = [
  {
    group_title: "Frontend",
    group_number: "01",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Angular",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    group_title: "Backend",
    group_number: "02",
    technologies: [
      "Node.js",
      "Express.js",
      "Laravel",
      "Spring Boot",
      "Python",
      "FastMCP",
    ],
  },
  {
    group_title: "Database",
    group_number: "03",
    technologies: [
      "PostgreSQL",
      "Oracle",
      "MariaDB",
      "MongoDB",
      "Redis",
      "Firebase",
    ],
  },
  {
    group_title: "Tools & DevOps",
    group_number: "04",
    technologies: [
      "Git",
      "Docker",
      "Figma",
      "Playwright",
      "Vercel",
      "GitHub Actions",
    ],
  },
] as const;

for (const group of stackGroups) {
  group.technologies.forEach((technology, index) => {
    insertStack.run({
      group_title: group.group_title,
      group_number: group.group_number,
      technology,
      sort_order: index + 1,
    });
  });
}

db.close();

console.log(`Seeded database at ${dbPath}`);
