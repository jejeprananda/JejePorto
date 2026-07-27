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
    sort_order INTEGER NOT NULL,
    is_flagship INTEGER NOT NULL DEFAULT 0,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    status TEXT NOT NULL,
    duration TEXT NOT NULL,
    client TEXT NOT NULL,
    platform TEXT NOT NULL,
    frontend TEXT NOT NULL,
    backend TEXT NOT NULL,
    database TEXT NOT NULL,
    deployment TEXT NOT NULL,
    website_url TEXT,
    github_url TEXT,
    hero_image TEXT NOT NULL,
    hero_caption TEXT NOT NULL,
    overview_heading TEXT NOT NULL DEFAULT 'Overview'
  );

  CREATE TABLE project_features (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    icon_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE project_gallery (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    caption TEXT NOT NULL,
    layout TEXT NOT NULL CHECK(layout IN ('large', 'small')),
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE project_timeline (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE project_tech (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE project_challenges (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK(kind IN ('challenge', 'solution')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE project_results (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
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

type ProjectSeed = {
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  year: string;
  icon_path: string;
  icon_has_dark_bg: number;
  sort_order: number;
  is_flagship: number;
  role: string;
  company: string;
  status: string;
  duration: string;
  client: string;
  platform: string;
  frontend: string;
  backend: string;
  database: string;
  deployment: string;
  website_url: string | null;
  github_url: string | null;
  hero_image: string;
  hero_caption: string;
  overview_heading: string;
  features: { icon_name: string; title: string; description: string }[];
  gallery: { image_path: string; caption: string; layout: "large" | "small" }[];
  timeline: { phase: string; description: string }[];
  tech: string[];
  challenges: {
    kind: "challenge" | "solution";
    title: string;
    body: string;
  }[];
  results: { value: string; label: string }[];
};

const defaultTimeline = (product: string): ProjectSeed["timeline"] => [
  {
    phase: "Discovery",
    description: `Mapped goals, audience, and constraints for ${product} with stakeholders.`,
  },
  {
    phase: "Planning",
    description:
      "Defined information architecture, milestones, and a realistic delivery sequence.",
  },
  {
    phase: "Design",
    description:
      "Explored layout, typography, and interaction patterns into a cohesive visual system.",
  },
  {
    phase: "Development",
    description:
      "Built responsive interfaces and integrated services with maintainable structure.",
  },
  {
    phase: "Testing",
    description:
      "Validated flows across devices, accessibility basics, and critical edge cases.",
  },
  {
    phase: "Deployment",
    description:
      "Shipped a stable release with monitoring-ready hosting and clear handoff notes.",
  },
];

const projects: ProjectSeed[] = [
  {
    slug: "sakti",
    title: "SAKTI",
    category: "Enterprise Financial Management System",
    short_description:
      "Sistem Aplikasi Keuangan Tingkat Instansi — Indonesia's integrated government financial management platform (Budgeting & Synchronization modules).",
    long_description:
      "SAKTI (Sistem Aplikasi Keuangan Tingkat Instansi) is the integrated financial management system developed by the Ministry of Finance of the Republic of Indonesia to support end-to-end financial administration across government institutions. The platform unifies budgeting, treasury, accounting, assets, procurement, and reporting into a single enterprise application used by ministries and government agencies throughout Indonesia. Although SAKTI consists of ten integrated modules (Administration, Budgeting, Commitment, Treasury, Payment, Inventory, Fixed Assets, Receivables, Accounting & Financial Reporting, and Synchronization), my primary responsibility focused on developing and maintaining the Budgeting Module (Penganggaran) and the Synchronization Module (Sinkronisasi). As a Frontend Developer, I collaborated closely with backend developers, business analysts, and QA teams to deliver new features, improve user experience, and implement complex budgeting workflows aligned with government financial regulations.",
    year: "2023 – Present",
    icon_path: "/images/logo/logo_sakti.png",
    icon_has_dark_bg: 0,
    sort_order: 1,
    is_flagship: 1,
    role: "Frontend Developer",
    company: "Ministry of Finance of the Republic of Indonesia",
    status: "In production",
    duration: "2023 – Present",
    client: "Ministry of Finance of the Republic of Indonesia",
    platform: "Web Application",
    frontend: "Angular, TypeScript, HTML5, SCSS",
    backend: "Spring Boot, Java, REST API",
    database: "Oracle Database",
    deployment: "Red Hat Enterprise Linux",
    website_url: null,
    github_url: null,
    hero_image: "/images/projects/sakti/hero.png",
    hero_caption:
      "SAKTI — Sistem Aplikasi Keuangan Tingkat Instansi (Budgeting & Synchronization).",
    overview_heading: "Project Overview",
    features: [
      {
        icon_name: "folders",
        title: "RENJA synchronization",
        description:
          "Bridge national performance planning (RENJA) into SAKTI so approved planning data becomes the foundation for budget preparation.",
      },
      {
        icon_name: "list-checks",
        title: "Planning data validation",
        description:
          "Validate and map planning data before it enters the budgeting workflow, protecting downstream consistency.",
      },
      {
        icon_name: "layout-dashboard",
        title: "RKA-K/L preparation",
        description:
          "Support preparation of Rencana Kerja dan Anggaran Kementerian/Lembaga from synchronized planning data.",
      },
      {
        icon_name: "file-check",
        title: "Budget revision (Revisi DIPA)",
        description:
          "Enable digital management of budget revisions throughout the fiscal year with validation and approval flows.",
      },
      {
        icon_name: "shield",
        title: "Regulation-driven workflows",
        description:
          "Implement business rules from functional analysts so budgeting enforces government financial regulations.",
      },
      {
        icon_name: "gauge",
        title: "Enterprise form performance",
        description:
          "Optimize complex data-entry forms and Angular ↔ Spring Boot integrations for large financial datasets.",
      },
      {
        icon_name: "users",
        title: "UAT collaboration",
        description:
          "Support User Acceptance Testing with backend, QA, and business analyst partners before production release.",
      },
      {
        icon_name: "globe",
        title: "Nationwide module integration",
        description:
          "Keep Budgeting and Synchronization aligned with the broader ten-module SAKTI financial ecosystem.",
      },
    ],
    gallery: [
      {
        image_path: "/images/projects/sakti/sakti_1.png",
        caption: "SAKTI budgeting interface",
        layout: "large",
      },
      {
        image_path: "/images/projects/sakti/sakti_2.png",
        caption: "Synchronization / planning flow",
        layout: "small",
      },
      {
        image_path: "/images/projects/sakti/sakti_3.png",
        caption: "Complex data-entry views",
        layout: "small",
      },
      {
        image_path: "/images/projects/sakti/sakti_4.png",
        caption: "Budget revision workflow screens",
        layout: "large",
      },
      {
        image_path: "/images/projects/sakti/sakti_5.png",
        caption: "Additional SAKTI module UI",
        layout: "large",
      },
    ],
    timeline: [
      {
        phase: "Discovery",
        description:
          "Requirement analysis with functional and technical stakeholders for budgeting and synchronization changes.",
      },
      {
        phase: "Planning",
        description:
          "Review functional specifications and align frontend work with Spring Boot API contracts.",
      },
      {
        phase: "Design",
        description:
          "Implement Angular UI for complex forms and workflows within the existing enterprise design system.",
      },
      {
        phase: "Development",
        description:
          "Integrate frontend features with REST APIs, apply business rules, and harden performance for large datasets.",
      },
      {
        phase: "Testing",
        description:
          "Internal testing followed by User Acceptance Testing (UAT) with ministry users.",
      },
      {
        phase: "Deployment",
        description:
          "Production deployment on Red Hat Enterprise Linux with post-release maintenance.",
      },
    ],
    tech: [
      "Angular",
      "TypeScript",
      "HTML5",
      "SCSS",
      "Spring Boot",
      "Java",
      "REST API",
      "Oracle Database",
      "Red Hat Enterprise Linux",
    ],
    challenges: [
      {
        kind: "challenge",
        title: "Changing budgeting policies",
        body: "Enhancements had to track evolving government policies and annual budgeting regulations.",
      },
      {
        kind: "challenge",
        title: "Complex regulated forms",
        body: "Large forms with numerous validation rules had to stay usable for thousands of government users.",
      },
      {
        kind: "challenge",
        title: "Cross-module data integrity",
        body: "Planning and budgeting stages required strict consistency across interconnected financial modules.",
      },
      {
        kind: "solution",
        title: "Analyst-driven business rules",
        body: "Implemented functional rules in the Angular UI integrated with Spring Boot APIs to enforce regulation-safe workflows.",
      },
      {
        kind: "solution",
        title: "Sync-then-budget pipeline",
        body: "Synchronization of RENJA into SAKTI established a validated foundation before RKA-K/L preparation and Revisi DIPA.",
      },
      {
        kind: "solution",
        title: "Enterprise-safe delivery",
        body: "UAT-backed releases on RHEL kept features shipping without disrupting nationwide financial operations.",
      },
    ],
    results: [
      { value: "RENJA", label: "Planning ↔ budgeting sync" },
      { value: "RKA-K/L", label: "Streamlined budget prep" },
      { value: "DIPA", label: "Digital budget revisions" },
      { value: "Nation", label: "Enterprise-scale stability" },
    ],
  },
  {
    slug: "angkasa",
    title: "Angkasa",
    category: "Webapp",
    short_description:
      "Internal information portal for Functional Budget Analysts (JFAA) across Indonesian government institutions.",
    long_description:
      "Angkasa is an internal web platform developed to centralize information, announcements, knowledge resources, and professional development materials for Jabatan Fungsional Analis Anggaran (JFAA) across Indonesian government institutions. The platform serves as a single source of truth where budget analysts can access official news, regulations, learning materials, and administrative information from one place. As a Fullstack Developer, I was responsible for building both the frontend and backend of the application, implementing new features, integrating APIs, managing the database structure, and deploying the system using containerized environments.",
    year: "2023",
    icon_path: "/images/logo/logo_angkasa.png",
    icon_has_dark_bg: 1,
    sort_order: 2,
    is_flagship: 0,
    role: "Fullstack Developer",
    company: "Kementerian Keuangan",
    status: "Shipped",
    duration: "Iterative delivery",
    client: "JFAA",
    platform: "Web Application",
    frontend: "ReactJS, JavaScript, HTML5, CSS3",
    backend: "Express.js, Node.js, REST API",
    database: "MongoDB",
    deployment: "Docker",
    website_url: null,
    github_url: null,
    hero_image: "/images/projects/angkasa/hero.png",
    hero_caption:
      "Angkasa — internal information portal for Functional Budget Analysts.",
    overview_heading: "Project Overview",
    features: [
      {
        icon_name: "globe",
        title: "News & announcements",
        description:
          "Centralized publication of official news and announcements for the JFAA community.",
      },
      {
        icon_name: "folders",
        title: "Digital library",
        description:
          "Document repository for regulations, learning materials, and knowledge resources.",
      },
      {
        icon_name: "list-checks",
        title: "FAQ & categories",
        description:
          "Frequently asked questions and category-based article organization for faster discovery.",
      },
      {
        icon_name: "smartphone",
        title: "Responsive experience",
        description:
          "Clean interfaces that stay usable across desktop and mobile devices.",
      },
      {
        icon_name: "shield",
        title: "Secure admin dashboard",
        description:
          "Authentication and authorization protecting content management for administrators.",
      },
      {
        icon_name: "layout-dashboard",
        title: "Content management",
        description:
          "CMS workflows that make publishing and updating information simpler for admins.",
      },
      {
        icon_name: "lock",
        title: "Auth & access control",
        description:
          "Secure authentication and authorization across frontend and backend services.",
      },
      {
        icon_name: "zap",
        title: "Dockerized deployment",
        description:
          "Containerized environments for consistent development and production delivery.",
      },
    ],
    gallery: [
      {
        image_path: "/images/projects/angkasa/angkasa_2.png",
        caption: "Angkasa application interface — content and information views.",
        layout: "large",
      },
      {
        image_path: "/images/projects/angkasa/angkasa_3.png",
        caption: "Additional Angkasa screens supporting daily analyst workflows.",
        layout: "large",
      },
    ],
    timeline: [
      {
        phase: "Discovery",
        description:
          "Requirement discussion with stakeholders to define information needs and publishing workflows.",
      },
      {
        phase: "Planning",
        description:
          "Scoped frontend, API, and database work into an iterative delivery sequence.",
      },
      {
        phase: "Design",
        description:
          "UI implementation focused on clear navigation and easy discovery of resources.",
      },
      {
        phase: "Development",
        description:
          "Built React interfaces, Express REST APIs, MongoDB models, and service integrations.",
      },
      {
        phase: "Testing",
        description:
          "Feature testing across key flows, then hardening bugs and performance issues.",
      },
      {
        phase: "Deployment",
        description:
          "Deployed with Docker and continued maintenance and enhancement based on feedback.",
      },
    ],
    tech: [
      "ReactJS",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Express.js",
      "Node.js",
      "REST API",
      "MongoDB",
      "Docker",
    ],
    challenges: [
      {
        kind: "challenge",
        title: "Fragmented information channels",
        body: "Important JFAA information was spread across multiple channels, making it hard for analysts to stay updated.",
      },
      {
        kind: "challenge",
        title: "Manual publishing effort",
        body: "Administrative processes and content publication required more manual work from administrators.",
      },
      {
        kind: "challenge",
        title: "Platform requirements",
        body: "The system needed centralized management, easy publishing, responsive UX, secure auth, scalable backend, and simple deployment.",
      },
      {
        kind: "solution",
        title: "Modern JavaScript stack",
        body: "React frontend, Express REST APIs, and MongoDB enabled rapid development with a maintainable fullstack architecture.",
      },
      {
        kind: "solution",
        title: "Clean information experience",
        body: "Responsive interfaces make news, documents, and administrative content easier to discover in one place.",
      },
      {
        kind: "solution",
        title: "Docker standardization",
        body: "Containerized development and deployment kept environments consistent across machines and releases.",
      },
    ],
    results: [
      { value: "1 hub", label: "Centralized information access" },
      { value: "Faster", label: "Access to official resources" },
      { value: "Easier", label: "Admin content management" },
      { value: "Docker", label: "Reliable container deployment" },
    ],
  },
  {
    slug: "jfaa",
    title: "JFAA",
    category: "Organization Website",
    short_description:
      "Official digital platform for Analis Anggaran Indonesia — news, publications, events, and member services in one hub.",
    long_description:
      "JFAA (Analis Anggaran Indonesia) is the official digital platform developed to support the professional community of Analis Anggaran Indonesia (AAI). The platform serves as a centralized hub where members can access organizational news, publications, professional references, training events, discussion forums, and membership services in one integrated ecosystem. As the Frontend Developer, I was responsible for implementing responsive user interfaces, translating UI/UX designs into production-ready pages, integrating frontend components with Laravel backends, and ensuring a consistent user experience across the platform.",
    year: "2021",
    icon_path: "/images/logo/logo_jfaa.png",
    icon_has_dark_bg: 0,
    sort_order: 3,
    is_flagship: 0,
    role: "Frontend Developer",
    company: "Analis Anggaran Indonesia",
    status: "Shipped",
    duration: "Iterative delivery",
    client: "Analis Anggaran Indonesia",
    platform: "Web Application",
    frontend: "Tailwind CSS, Alpine.js, Laravel Blade",
    backend: "Laravel",
    database: "MySQL",
    deployment: "TALL Stack / Web hosting",
    website_url: null,
    github_url: null,
    hero_image: "/images/projects/jfaa/hero.png",
    hero_caption:
      "JFAA — official digital platform for Analis Anggaran Indonesia.",
    overview_heading: "Project Overview",
    features: [
      {
        icon_name: "globe",
        title: "Organization portal",
        description:
          "Organization profile and information pages for public visitors and members.",
      },
      {
        icon_name: "layout",
        title: "News & announcements",
        description:
          "Centralized publishing of organizational news and community updates.",
      },
      {
        icon_name: "folders",
        title: "Publications & library",
        description:
          "Digital resources, publications, and a reference documentation library.",
      },
      {
        icon_name: "users",
        title: "Events & membership",
        description:
          "Seminar information, membership registration, and member benefits content.",
      },
      {
        icon_name: "list-checks",
        title: "Discussion forum",
        description:
          "Professional discussion spaces supporting collaboration among members.",
      },
      {
        icon_name: "smartphone",
        title: "Responsive landing pages",
        description:
          "Engaging public-facing pages optimized across desktop, tablet, and mobile.",
      },
      {
        icon_name: "gauge",
        title: "Search & navigation",
        description:
          "Interactive navigation and search to help users find content quickly.",
      },
      {
        icon_name: "layout-dashboard",
        title: "CMS integration",
        description:
          "Frontend surfaces integrated with Laravel content management workflows.",
      },
    ],
    gallery: [
      {
        image_path: "/images/projects/jfaa/jfaa_1.png",
        caption: "JFAA interface — primary content and information views.",
        layout: "large",
      },
      {
        image_path: "/images/projects/jfaa/jfaa_2.png",
        caption: "Responsive layout detail",
        layout: "small",
      },
      {
        image_path: "/images/projects/jfaa/jfaa_3.png",
        caption: "Content and publication screens",
        layout: "small",
      },
      {
        image_path: "/images/projects/jfaa/jfaa_4.png",
        caption: "Key landing and section compositions",
        layout: "large",
      },
      {
        image_path: "/images/projects/jfaa/jfaa_5.png",
        caption: "Member-facing interface detail",
        layout: "small",
      },
      {
        image_path: "/images/projects/jfaa/jfaa_6.png",
        caption: "Additional platform screens",
        layout: "small",
      },
    ],
    timeline: [
      {
        phase: "Discovery",
        description:
          "Reviewed design mockups and clarified frontend scope with designers and stakeholders.",
      },
      {
        phase: "Planning",
        description:
          "Planned reusable Blade components and a component-driven delivery approach.",
      },
      {
        phase: "Design",
        description:
          "Implemented UI from mockups with Tailwind CSS and consistent branding.",
      },
      {
        phase: "Development",
        description:
          "Built responsive layouts, Alpine.js interactions, and Laravel Blade integrations.",
      },
      {
        phase: "Testing",
        description:
          "Verified UI consistency across browsers and screen sizes, then optimized performance.",
      },
      {
        phase: "Deployment",
        description:
          "Supported deployment and ongoing maintenance of the frontend experience.",
      },
    ],
    tech: [
      "Tailwind CSS",
      "Alpine.js",
      "Laravel Blade",
      "Laravel",
      "TALL Stack",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
    challenges: [
      {
        kind: "challenge",
        title: "Scattered organizational services",
        body: "Services previously lived across multiple channels and needed one modern digital platform for both public visitors and members.",
      },
      {
        kind: "challenge",
        title: "Information density",
        body: "Large amounts of content had to stay readable without overwhelming the interface.",
      },
      {
        kind: "challenge",
        title: "Reusable, responsive UI",
        body: "The frontend needed reusable components, consistent branding, and layouts that worked across desktop, tablet, and mobile.",
      },
      {
        kind: "solution",
        title: "TALL Stack architecture",
        body: "Laravel, Blade, Tailwind CSS, and Alpine.js enabled rapid development with maintainable, lightweight interactivity.",
      },
      {
        kind: "solution",
        title: "Component-driven frontend",
        body: "Reusable Blade components accelerated feature delivery while keeping branding and UI patterns consistent.",
      },
      {
        kind: "solution",
        title: "Responsive public + member UX",
        body: "Clean landing pages and integrated member features delivered one cohesive website experience.",
      },
    ],
    results: [
      { value: "1 hub", label: "Centralized org information" },
      { value: "TALL", label: "Maintainable frontend stack" },
      { value: "100%", label: "Responsive coverage" },
      { value: "Faster", label: "Reusable UI development" },
    ],
  },
  {
    slug: "skk",
    title: "SKK",
    category: "Webapp",
    short_description:
      "A business webapp for structured processes, dashboards, and day-to-day operational visibility.",
    long_description:
      "SKK is a business-facing web application designed to support structured processes and day-to-day visibility. The product work combined practical UI patterns with clear data presentation so teams can move through common tasks without friction. The emphasis was reliability, readable interfaces, and a foundation that can expand with additional modules as the organization grows.",
    year: "2024",
    icon_path: "/images/logo/logo_skk.png",
    icon_has_dark_bg: 0,
    sort_order: 4,
    is_flagship: 0,
    role: "Fullstack Designer",
    company: "Independent",
    status: "Shipped",
    duration: "10 weeks",
    client: "SKK",
    platform: "Web Application",
    frontend: "Next.js, React",
    backend: "Laravel",
    database: "PostgreSQL",
    deployment: "Docker + VPS",
    website_url: "https://example.com/skk",
    github_url: null,
    hero_image: "/images/projects/skk/hero.jpg",
    hero_caption: "SKK module overview — structured processes and visibility.",
    overview_heading: "Overview",
    features: [
      {
        icon_name: "chart-column",
        title: "Readable dashboards",
        description:
          "Metrics and process health presented without chart noise or clutter.",
      },
      {
        icon_name: "folders",
        title: "Modular structure",
        description:
          "Feature areas organized so new modules can land without redesigning navigation.",
      },
      {
        icon_name: "file-check",
        title: "Process flows",
        description:
          "Common business tasks guided with clear steps and validation feedback.",
      },
      {
        icon_name: "lock",
        title: "Secure by default",
        description:
          "Auth-aware screens and careful empty states for restricted content.",
      },
    ],
    gallery: [
      {
        image_path: "/images/projects/skk/gallery-1.jpg",
        caption: "Process dashboard",
        layout: "large",
      },
      {
        image_path: "/images/projects/skk/gallery-2.jpg",
        caption: "Module list",
        layout: "small",
      },
      {
        image_path: "/images/projects/skk/gallery-3.jpg",
        caption: "Detail form",
        layout: "small",
      },
      {
        image_path: "/images/projects/skk/gallery-4.jpg",
        caption: "Reporting view",
        layout: "large",
      },
    ],
    timeline: defaultTimeline("SKK"),
    tech: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Laravel",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    challenges: [
      {
        kind: "challenge",
        title: "Expanding scope",
        body: "New modules arrived mid-build and threatened consistency.",
      },
      {
        kind: "challenge",
        title: "Data-heavy screens",
        body: "Tables and forms needed to stay usable for non-technical staff.",
      },
      {
        kind: "solution",
        title: "Shared patterns",
        body: "Reusable page shells, filters, and form layouts kept modules coherent.",
      },
      {
        kind: "solution",
        title: "Human-scale tables",
        body: "Pagination, sticky headers, and clear labels reduced cognitive load.",
      },
    ],
    results: [
      { value: "10w", label: "Delivery window" },
      { value: "50K", label: "Records handled" },
      { value: "4", label: "Core modules" },
      { value: "100%", label: "Responsive UI" },
    ],
  },
];

const insertProject = db.prepare(`
  INSERT INTO projects (
    slug, title, category, short_description, long_description,
    year, icon_path, icon_has_dark_bg, sort_order, is_flagship,
    role, company, status, duration, client, platform,
    frontend, backend, database, deployment,
    website_url, github_url, hero_image, hero_caption, overview_heading
  ) VALUES (
    @slug, @title, @category, @short_description, @long_description,
    @year, @icon_path, @icon_has_dark_bg, @sort_order, @is_flagship,
    @role, @company, @status, @duration, @client, @platform,
    @frontend, @backend, @database, @deployment,
    @website_url, @github_url, @hero_image, @hero_caption, @overview_heading
  )
`);

const insertFeature = db.prepare(`
  INSERT INTO project_features (project_id, icon_name, title, description, sort_order)
  VALUES (@project_id, @icon_name, @title, @description, @sort_order)
`);

const insertGallery = db.prepare(`
  INSERT INTO project_gallery (project_id, image_path, caption, layout, sort_order)
  VALUES (@project_id, @image_path, @caption, @layout, @sort_order)
`);

const insertTimeline = db.prepare(`
  INSERT INTO project_timeline (project_id, phase, description, sort_order)
  VALUES (@project_id, @phase, @description, @sort_order)
`);

const insertTech = db.prepare(`
  INSERT INTO project_tech (project_id, name, sort_order)
  VALUES (@project_id, @name, @sort_order)
`);

const insertChallenge = db.prepare(`
  INSERT INTO project_challenges (project_id, kind, title, body, sort_order)
  VALUES (@project_id, @kind, @title, @body, @sort_order)
`);

const insertResult = db.prepare(`
  INSERT INTO project_results (project_id, value, label, sort_order)
  VALUES (@project_id, @value, @label, @sort_order)
`);

const seedProject = db.transaction((project: ProjectSeed) => {
  const result = insertProject.run({
    slug: project.slug,
    title: project.title,
    category: project.category,
    short_description: project.short_description,
    long_description: project.long_description,
    year: project.year,
    icon_path: project.icon_path,
    icon_has_dark_bg: project.icon_has_dark_bg,
    sort_order: project.sort_order,
    is_flagship: project.is_flagship,
    role: project.role,
    company: project.company,
    status: project.status,
    duration: project.duration,
    client: project.client,
    platform: project.platform,
    frontend: project.frontend,
    backend: project.backend,
    database: project.database,
    deployment: project.deployment,
    website_url: project.website_url,
    github_url: project.github_url,
    hero_image: project.hero_image,
    hero_caption: project.hero_caption,
    overview_heading: project.overview_heading,
  });

  const projectId = Number(result.lastInsertRowid);

  project.features.forEach((feature, index) => {
    insertFeature.run({
      project_id: projectId,
      icon_name: feature.icon_name,
      title: feature.title,
      description: feature.description,
      sort_order: index + 1,
    });
  });

  project.gallery.forEach((item, index) => {
    insertGallery.run({
      project_id: projectId,
      image_path: item.image_path,
      caption: item.caption,
      layout: item.layout,
      sort_order: index + 1,
    });
  });

  project.timeline.forEach((item, index) => {
    insertTimeline.run({
      project_id: projectId,
      phase: item.phase,
      description: item.description,
      sort_order: index + 1,
    });
  });

  project.tech.forEach((name, index) => {
    insertTech.run({
      project_id: projectId,
      name,
      sort_order: index + 1,
    });
  });

  project.challenges.forEach((item, index) => {
    insertChallenge.run({
      project_id: projectId,
      kind: item.kind,
      title: item.title,
      body: item.body,
      sort_order: index + 1,
    });
  });

  project.results.forEach((item, index) => {
    insertResult.run({
      project_id: projectId,
      value: item.value,
      label: item.label,
      sort_order: index + 1,
    });
  });
});

for (const project of projects) {
  seedProject(project);
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
