# Portfolio Works + SQLite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the portfolio so Home is hero-only, Works loads Projects/Services/Stack from a seeded SQLite DB (read-only), Contact is a UI-only form, and the navbar has About / Works / Contact.

**Architecture:** Seed `data/portfolio.db` via `scripts/seed-db.ts`. Server Components read through `src/lib/db.ts` and domain getters under `src/services/`. Interactive UI (navbar mobile menu, service modal, contact form) stays in small Client Components. Legacy hard-coded `src/app/home` and `src/app/work` are removed after the new routes work.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, better-sqlite3, lucide-react, Node.js test runner + tsx

## Global Constraints

- Content language: English
- About = `/` (Hero only with `public/images/bg-hero.png`)
- Works section order: Projects → Services → Stack
- Projects: Angkasa, JFAA, Sakti, SKK (categories: Website, Website, Webapp, Webapp)
- Angkasa icon only: dark background + padding (`icon_has_dark_bg = 1`)
- Service detail = in-page modal (no new route)
- Project detail = `/works/[slug]` with `long_description`
- Contact = form UI only (no backend / Server Action)
- No CRUD admin
- Keep existing `src/` layout and `@/*` → `./src/*` alias
- Do not commit `data/*.db`; keep `data/.gitkeep`
- Prefer Server Components; `"use client"` only where required

---

## File structure

| Path | Responsibility |
|---|---|
| `data/.gitkeep` | Keep `data/` in git |
| `scripts/seed-db.ts` | Create schema + insert seed rows |
| `src/types/project.ts` | Project domain type |
| `src/types/service.ts` | Service domain type |
| `src/types/stack.ts` | Stack group/row types |
| `src/lib/db.ts` | better-sqlite3 singleton + path |
| `src/services/projects/getProjects.ts` | List projects |
| `src/services/projects/getProjectBySlug.ts` | Single project or null |
| `src/services/catalog/getServices.ts` | List services |
| `src/services/stack/getStackGroups.ts` | Grouped stack |
| `src/components/layout/Navbar.tsx` | 3-item nav |
| `src/components/sections/HeroSection.tsx` | Home hero |
| `src/components/sections/ProjectsSection.tsx` | Works projects list |
| `src/components/sections/ServicesSection.tsx` | Works services + modal wiring |
| `src/components/sections/StackSection.tsx` | Works stack |
| `src/components/shared/ServiceDetailModal.tsx` | Service detail modal (client) |
| `src/components/shared/ContactForm.tsx` | Contact form (client) |
| `src/app/layout.tsx` | Root layout + Navbar + metadata |
| `src/app/page.tsx` | Home |
| `src/app/works/page.tsx` | Works |
| `src/app/works/[slug]/page.tsx` | Project detail |
| `src/app/contact/page.tsx` | Contact |
| `src/app/not-found.tsx` | Global not-found |
| `tests/db/getters.test.ts` | DB getter tests |
| `next.config.ts` | `serverExternalPackages: ['better-sqlite3']` |

**Delete after migration:** `src/app/home/`, `src/app/work/`, `src/app/components/` (old locations)

---

### Task 1: Tooling, deps, and DB scaffolding

**Files:**
- Create: `data/.gitkeep`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `scripts/seed-db.ts`
- Test: run seed, then `sqlite3` / node assert row counts

**Interfaces:**
- Consumes: none
- Produces: `npm run seed` creates `data/portfolio.db` with tables `projects`, `services`, `stack`

- [ ] **Step 1: Install dependencies**

```bash
npm install better-sqlite3 lucide-react
npm install -D @types/better-sqlite3 tsx
```

Expected: packages appear in `package.json`.

- [ ] **Step 2: Update `.gitignore` and create `data/.gitkeep`**

Append to `.gitignore`:

```gitignore
# sqlite
/data/*.db
```

Create empty `data/.gitkeep`.

- [ ] **Step 3: Configure Next.js for better-sqlite3**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
```

- [ ] **Step 4: Add npm scripts**

In `package.json` `scripts`:

```json
"seed": "tsx scripts/seed-db.ts",
"test": "tsx --test tests/**/*.test.ts"
```

- [ ] **Step 5: Write `scripts/seed-db.ts`**

```ts
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
```

- [ ] **Step 6: Run seed and verify counts**

```bash
npm run seed
node -e "const Database=require('better-sqlite3'); const db=new Database('data/portfolio.db'); console.log({projects:db.prepare('select count(*) c from projects').get().c, services:db.prepare('select count(*) c from services').get().c, stack:db.prepare('select count(*) c from stack').get().c});"
```

Expected: `{ projects: 4, services: 4, stack: 24 }` and log `Seeded database at .../data/portfolio.db`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts .gitignore data/.gitkeep scripts/seed-db.ts
git commit -m "chore: add sqlite seed tooling and dependencies"
```

---

### Task 2: Domain types, DB client, and getters (TDD)

**Files:**
- Create: `src/types/project.ts`
- Create: `src/types/service.ts`
- Create: `src/types/stack.ts`
- Create: `src/lib/db.ts`
- Create: `src/services/projects/getProjects.ts`
- Create: `src/services/projects/getProjectBySlug.ts`
- Create: `src/services/catalog/getServices.ts`
- Create: `src/services/stack/getStackGroups.ts`
- Create: `tests/db/getters.test.ts`

**Interfaces:**
- Consumes: seeded `data/portfolio.db`
- Produces:
  - `getDb(): Database.Database`
  - `getProjects(): Project[]`
  - `getProjectBySlug(slug: string): Project | null`
  - `getServices(): Service[]`
  - `getStackGroups(): StackGroup[]`

- [ ] **Step 1: Write failing tests**

Create `tests/db/getters.test.ts`:

```ts
import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { getProjectBySlug } from "../../src/services/projects/getProjectBySlug";
import { getProjects } from "../../src/services/projects/getProjects";
import { getServices } from "../../src/services/catalog/getServices";
import { getStackGroups } from "../../src/services/stack/getStackGroups";

describe("portfolio sqlite getters", () => {
  before(async () => {
    const { execSync } = await import("node:child_process");
    execSync("npm run seed", { stdio: "inherit" });
  });

  it("returns four projects in sort order with angkasa dark bg", () => {
    const projects = getProjects();
    assert.equal(projects.length, 4);
    assert.deepEqual(
      projects.map((project) => project.slug),
      ["angkasa", "jfaa", "sakti", "skk"],
    );
    assert.equal(projects[0]?.iconHasDarkBg, true);
    assert.equal(projects[1]?.iconHasDarkBg, false);
  });

  it("returns a project by slug and null for unknown slug", () => {
    const project = getProjectBySlug("jfaa");
    assert.ok(project);
    assert.equal(project.title, "JFAA");
    assert.ok(project.longDescription.length > 40);
    assert.equal(getProjectBySlug("missing"), null);
  });

  it("returns four services with detail copy", () => {
    const services = getServices();
    assert.equal(services.length, 4);
    assert.equal(services[0]?.slug, "webapp");
    assert.ok(services[0]?.detailDescription.length > 40);
  });

  it("groups stack technologies", () => {
    const groups = getStackGroups();
    assert.equal(groups.length, 4);
    assert.equal(groups[0]?.title, "Frontend");
    assert.ok(groups[0]?.technologies.includes("Next.js"));
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL (modules not found / cannot find module).

- [ ] **Step 3: Add types**

`src/types/project.ts`:

```ts
export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  year: string;
  iconPath: string;
  iconHasDarkBg: boolean;
  sortOrder: number;
};
```

`src/types/service.ts`:

```ts
export type Service = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  iconName: string;
  sortOrder: number;
};
```

`src/types/stack.ts`:

```ts
export type StackGroup = {
  number: string;
  title: string;
  technologies: string[];
};
```

- [ ] **Step 4: Implement `src/lib/db.ts`**

```ts
import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");

let database: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `SQLite database not found at ${dbPath}. Run \`npm run seed\` first.`,
    );
  }

  if (!database) {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
  }

  return database;
}
```

- [ ] **Step 5: Implement getters**

`src/services/projects/getProjects.ts`:

```ts
import { getDb } from "@/lib/db";
import type { Project } from "@/types/project";

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  year: string;
  icon_path: string;
  icon_has_dark_bg: number;
  sort_order: number;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    year: row.year,
    iconPath: row.icon_path,
    iconHasDarkBg: Boolean(row.icon_has_dark_bg),
    sortOrder: row.sort_order,
  };
}

export function getProjects(): Project[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM projects ORDER BY sort_order ASC, id ASC`,
    )
    .all() as ProjectRow[];

  return rows.map(mapProject);
}
```

`src/services/projects/getProjectBySlug.ts`:

```ts
import { getDb } from "@/lib/db";
import type { Project } from "@/types/project";

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  year: string;
  icon_path: string;
  icon_has_dark_bg: number;
  sort_order: number;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    year: row.year,
    iconPath: row.icon_path,
    iconHasDarkBg: Boolean(row.icon_has_dark_bg),
    sortOrder: row.sort_order,
  };
}

export function getProjectBySlug(slug: string): Project | null {
  const row = getDb()
    .prepare(`SELECT * FROM projects WHERE slug = ?`)
    .get(slug) as ProjectRow | undefined;

  return row ? mapProject(row) : null;
}
```

`src/services/catalog/getServices.ts`:

```ts
import { getDb } from "@/lib/db";
import type { Service } from "@/types/service";

type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  detail_description: string;
  icon_name: string;
  sort_order: number;
};

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    detailDescription: row.detail_description,
    iconName: row.icon_name,
    sortOrder: row.sort_order,
  };
}

export function getServices(): Service[] {
  const rows = getDb()
    .prepare(`SELECT * FROM services ORDER BY sort_order ASC, id ASC`)
    .all() as ServiceRow[];

  return rows.map(mapService);
}
```

`src/services/stack/getStackGroups.ts`:

```ts
import { getDb } from "@/lib/db";
import type { StackGroup } from "@/types/stack";

type StackRow = {
  group_title: string;
  group_number: string;
  technology: string;
  sort_order: number;
};

export function getStackGroups(): StackGroup[] {
  const rows = getDb()
    .prepare(
      `SELECT group_title, group_number, technology, sort_order
       FROM stack
       ORDER BY group_number ASC, sort_order ASC, id ASC`,
    )
    .all() as StackRow[];

  const groups = new Map<string, StackGroup>();

  for (const row of rows) {
    const existing = groups.get(row.group_number);

    if (existing) {
      existing.technologies.push(row.technology);
      continue;
    }

    groups.set(row.group_number, {
      number: row.group_number,
      title: row.group_title,
      technologies: [row.technology],
    });
  }

  return [...groups.values()];
}
```

**Path alias for tests:** Next.js resolves `@/` via `tsconfig` paths; `tsx` may not. In getter files, use relative imports for reliability under `npm test`, for example:

```ts
import { getDb } from "../../lib/db";
import type { Project } from "../../types/project";
```

Keep `@/` imports in React components and App Router pages.

- [ ] **Step 6: Run tests — expect PASS**

```bash
npm test
```

Expected: all 4 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/types src/lib/db.ts src/services tests/db/getters.test.ts package.json
git commit -m "feat: add sqlite portfolio data getters"
```

---

### Task 3: Root layout + Navbar (3 menus)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Modify: `src/app/layout.tsx`
- Delete later (Task 7): `src/app/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: none
- Produces: Navbar links About `/`, Works `/works`, Contact `/contact`

- [ ] **Step 1: Create `src/components/layout/Navbar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Menu, X } from "lucide-react";

const navigationItems = [
  { label: "About", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled || isMenuOpen
          ? "border-b border-slate-900/5 bg-white/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12 xl:px-16"
      >
        <Link
          href="/"
          aria-label="Go to homepage"
          onClick={closeMenu}
          className="relative z-50 text-2xl font-bold tracking-[-0.06em] text-slate-900 transition-opacity hover:opacity-70 sm:text-3xl"
        >
          JP<span className="text-orange-500">.</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-12">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative py-2 text-sm font-medium text-slate-700 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-300 hover:text-slate-950 hover:after:origin-left hover:after:scale-x-100 xl:text-base"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-slate-900/10 bg-white/60 text-slate-900 backdrop-blur-md transition-colors hover:bg-white lg:hidden"
        >
          {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-40 bg-white/95 px-5 pb-8 pt-28 backdrop-blur-xl transition-all duration-300 lg:hidden",
          isMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-4 opacity-0",
        ].join(" ")}
      >
        <ul>
          {navigationItems.map((item, index) => (
            <li key={item.href} className="border-b border-slate-900/10">
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-20 items-center justify-between py-5 text-3xl font-medium tracking-tight text-slate-900"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-orange-500">0{index + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="absolute bottom-8 left-5 text-xs uppercase tracking-[0.24em] text-slate-500">
          Fullstack Designer
        </p>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jessy Prananda",
    template: "%s | Jessy Prananda",
  },
  description:
    "Portfolio of Jessy Prananda, a Fullstack Designer who designs and builds modern digital products.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-950">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Smoke-check types**

```bash
npx tsc --noEmit
```

Expected: no errors related to Navbar/layout (other broken imports in old folders may still fail — ignore until Task 7 cleanup, or temporarily leave old files compiling).

If old `src/app/home/HomeContent.tsx` breaks `tsc`, delete or stub it in Task 7; for now if needed comment/remove broken imports early:

```bash
rm -rf src/app/home src/app/work src/app/components
```

Do that removal in this step if `tsc` fails on missing hero/contact imports.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/app/layout.tsx
git commit -m "feat: add three-item portfolio navbar"
```

If deleted legacy folders in Step 3, include them in the commit:

```bash
git add -A src/app/home src/app/work src/app/components src/components/layout/Navbar.tsx src/app/layout.tsx
git commit -m "feat: add navbar and remove legacy route folders"
```

---

### Task 4: Home Hero page

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (optional: ensure light body, no forced dark)

**Interfaces:**
- Consumes: `/images/bg-hero.png`
- Produces: Home renders only `HeroSection`

- [ ] **Step 1: Simplify `globals.css` body (keep Tailwind import)**

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0f172a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 2: Create `HeroSection`**

```tsx
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh items-end overflow-hidden"
    >
      <Image
        src="/images/bg-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/10"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 xl:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
          Jessy Prananda
        </p>

        <h1
          id="hero-title"
          className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
        >
          Fullstack Designer
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
          I design and build modern digital products — websites, webapps, and
          AI-ready tools — with clarity and craft.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/works"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            View works
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `src/app/page.tsx`**

```tsx
import type { Metadata } from "next";

import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jessy Prananda — Fullstack Designer. Portfolio home and introduction.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
```

- [ ] **Step 4: Verify hero asset exists**

```bash
test -f public/images/bg-hero.png && echo OK
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: make home page hero-only"
```

---

### Task 5: Works page — Projects, Services (+ modal), Stack

**Files:**
- Create: `src/components/sections/ProjectsSection.tsx`
- Create: `src/components/sections/ServicesSection.tsx`
- Create: `src/components/sections/StackSection.tsx`
- Create: `src/components/shared/ServiceDetailModal.tsx`
- Create: `src/app/works/page.tsx`

**Interfaces:**
- Consumes: `getProjects()`, `getServices()`, `getStackGroups()`
- Produces: `/works` renders sections in order Projects → Services → Stack; service Learn more opens modal

- [ ] **Step 1: Create `ServiceDetailModal.tsx`**

```tsx
"use client";

import { useEffect } from "react";

import { X } from "lucide-react";

import type { Service } from "@/types/service";

type ServiceDetailModalProps = {
  service: Service | null;
  onClose: () => void;
};

export function ServiceDetailModal({
  service,
  onClose,
}: ServiceDetailModalProps) {
  useEffect(() => {
    if (!service) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
              Service
            </p>
            <h2
              id="service-modal-title"
              className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
            >
              {service.title}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close service details"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {service.detailDescription}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `ProjectsSection.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/types/project";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Selected projects
          </p>
          <h2
            id="projects-title"
            className="mt-4 text-4xl font-semibold leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Digital products
            <br />
            I&apos;ve built
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
            A selection of websites and web applications designed to solve real
            problems.
          </p>
        </header>

        <div className="border-b border-slate-200">
          {projects.length === 0 ? (
            <p className="border-t border-slate-200 py-8 text-sm text-slate-600">
              No projects available yet.
            </p>
          ) : (
            projects.map((project, index) => (
              <article
                key={project.slug}
                className="group grid gap-5 border-t border-slate-200 py-6 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 lg:py-7"
              >
                <div
                  className={[
                    "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:size-[72px]",
                    project.iconHasDarkBg
                      ? "bg-slate-950 p-2.5"
                      : "bg-transparent",
                  ].join(" ")}
                >
                  <Image
                    src={project.iconPath}
                    alt={`${project.title} logo`}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {project.category}
                    </p>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:justify-center">
                  <span className="font-mono text-xs text-slate-500">
                    {project.year}
                  </span>
                  <Link
                    href={`/works/${project.slug}`}
                    aria-label={`Learn more about ${project.title}`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `ServicesSection.tsx` (client wrapper for modal)**

```tsx
"use client";

import { useState } from "react";

import {
  AppWindow,
  ArrowRight,
  Globe,
  Smartphone,
  Terminal,
} from "lucide-react";

import { ServiceDetailModal } from "@/components/shared/ServiceDetailModal";
import type { Service } from "@/types/service";

const iconMap = {
  "app-window": AppWindow,
  globe: Globe,
  smartphone: Smartphone,
  terminal: Terminal,
} as const;

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <>
      <section
        id="services"
        aria-labelledby="services-title"
        className="scroll-mt-24 border-y border-slate-200 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
            <header className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                What I build
              </p>
              <h2
                id="services-title"
                className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-slate-950 sm:text-6xl"
              >
                Products
                <br />
                I Create
              </h2>
              <p className="mt-7 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                I build digital products across platforms that are useful,
                scalable, and made to solve real problems.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.length === 0 ? (
                <p className="text-sm text-slate-600">No services available yet.</p>
              ) : (
                services.map((service) => {
                  const Icon =
                    iconMap[service.iconName as keyof typeof iconMap] ?? AppWindow;

                  return (
                    <article
                      key={service.slug}
                      className="group flex min-h-[320px] flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7"
                    >
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                        <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {service.shortDescription}
                      </p>
                      <div className="mt-auto pt-8">
                        <div className="mb-5 h-px bg-slate-200 transition-colors duration-300 group-hover:bg-orange-200" />
                        <button
                          type="button"
                          onClick={() => setActiveService(service)}
                          className="inline-flex min-h-11 w-full items-center justify-between gap-4 rounded-lg text-sm font-medium text-slate-950 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
                        >
                          <span>Learn more</span>
                          <ArrowRight
                            className="size-5 text-orange-600 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
```

- [ ] **Step 4: Create `StackSection.tsx`**

```tsx
import type { StackGroup } from "@/types/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

export function StackSection({ groups }: StackSectionProps) {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Tech stack
          </p>
          <h2
            id="stack-title"
            className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Technologies
            <br />
            I use
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
            Technologies and tools I use to design, develop, test, and deliver
            modern digital products.
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="text-sm text-slate-600">No stack data available yet.</p>
        ) : (
          <div className="grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group, index) => (
              <article
                key={group.number}
                className={[
                  "border-b border-slate-200 py-7 sm:px-6",
                  index % 2 === 0 ? "sm:border-r" : "",
                  index > 0 ? "xl:border-l" : "",
                  "xl:border-r-0 xl:px-8",
                ].join(" ")}
              >
                <p className="font-mono text-xs text-orange-600">{group.number}</p>
                <h3 className="mt-4 text-base font-semibold text-slate-950">
                  {group.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {group.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-slate-400"
                      />
                      <span>{technology}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/app/works/page.tsx`**

```tsx
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
```

- [ ] **Step 6: Ensure DB exists, then build-check the route**

```bash
npm run seed
npm run build
```

Expected: build succeeds; `/works` is listed in route table.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ProjectsSection.tsx src/components/sections/ServicesSection.tsx src/components/sections/StackSection.tsx src/components/shared/ServiceDetailModal.tsx src/app/works/page.tsx
git commit -m "feat: add works page with sqlite-backed sections"
```

---

### Task 6: Project detail + Contact + not-found

**Files:**
- Create: `src/app/works/[slug]/page.tsx`
- Create: `src/components/shared/ContactForm.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug(slug)`
- Produces: `/works/[slug]` detail page; `/contact` form UI without backend

- [ ] **Step 1: Create project detail page**

`src/app/works/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Create `ContactForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setInfoMessage(null);
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setErrorMessage(null);
    setInfoMessage(
      "Thanks — the contact form UI is ready. Sending messages will be wired up later.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-800">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-800"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      {infoMessage ? (
        <p role="status" className="text-sm text-slate-600">
          {infoMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
      >
        Send message
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create contact page + not-found**

`src/app/contact/page.tsx`:

```tsx
import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jessy Prananda.",
};

export default function ContactPage() {
  return (
    <main className="px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32 xl:px-16">
      <div className="mx-auto w-full max-w-[640px]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Let&apos;s talk
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600">
          Tell me about your project. This form is a UI scaffold for now —
          message delivery will be connected later.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
```

`src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center px-5 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-base text-slate-600">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
      >
        Back home
      </Link>
    </main>
  );
}
```

- [ ] **Step 4: Verify getters still pass + build**

```bash
npm test
npm run seed
npm run build
```

Expected: tests PASS; build PASS; routes include `/`, `/works`, `/works/[slug]`, `/contact`.

- [ ] **Step 5: Commit**

```bash
git add src/app/works/\[slug\]/page.tsx src/components/shared/ContactForm.tsx src/app/contact/page.tsx src/app/not-found.tsx
git commit -m "feat: add project detail and contact form scaffold"
```

---

### Task 7: Cleanup, final verification

**Files:**
- Delete if still present: `src/app/home/`, `src/app/work/`, `src/app/components/`
- Optionally update `README.md` with `npm run seed` before `dev`/`build`

- [ ] **Step 1: Remove legacy folders**

```bash
rm -rf src/app/home src/app/work src/app/components
```

- [ ] **Step 2: Update README Getting Started**

After the existing install notes, ensure these lines exist:

```md
## Database

Seed the local SQLite database before running the app:

```bash
npm run seed
```

This creates `data/portfolio.db` (gitignored) from `scripts/seed-db.ts`.
```

- [ ] **Step 3: Final verification checklist**

```bash
npm run seed
npm test
npm run build
npm run dev
```

Manual checks in browser:

1. `/` — hero only, `bg-hero.png` visible, CTAs to Works/Contact
2. Navbar — only About, Works, Contact; logo → `/`
3. `/works` — Projects → Services → Stack from DB
4. Angkasa logo has dark background; JFAA/Sakti/SKK do not
5. `/works/jfaa` shows long description; `/works/nope` → not-found
6. Service Learn more opens modal; Escape/backdrop closes; URL stays `/works`
7. `/contact` validates empty submit; successful UI submit shows scaffold message (no network write)

- [ ] **Step 4: Commit**

```bash
git add -A README.md src/app
git status
git commit -m "chore: remove legacy portfolio folders and document seed"
```

---

## Self-review vs spec

| Spec requirement | Task |
|---|---|
| Home hero-only + `bg-hero.png` | Task 4 |
| Navbar About/Works/Contact | Task 3 |
| Works Projects → Services → Stack | Task 5 |
| Separate section components on one Works page | Task 5 |
| SQLite tables projects/services/stack + seed | Task 1 |
| Read-only getters, no CRUD | Task 2 |
| Project icons + Angkasa dark bg | Task 1 seed + Task 5 UI |
| Project detail page + long description | Task 6 |
| Service modal detail (no redirect) | Task 5 |
| Contact form scaffold, no backend | Task 6 |
| English content | Task 1 seed copy |
| `data/*.db` gitignored | Task 1 |
| better-sqlite3 + Server Components | Tasks 1–2, 5–6 |
| Remove hard-coded legacy sources | Tasks 3/7 |

No TBD placeholders remain. Types (`Project`, `Service`, `StackGroup`) and getter names are consistent across tasks.
