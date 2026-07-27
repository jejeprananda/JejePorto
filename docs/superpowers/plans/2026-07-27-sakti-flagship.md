# SAKTI Flagship Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make SAKTI the portfolio flagship: full enterprise case study + images, `sort_order = 1`, `is_flagship = true`, and a Flagship badge/highlight on the Works list.

**Architecture:** Add `is_flagship` to the SQLite `projects` table and domain `Project` type. Seed SAKTI as the only flagship with professional case study content and PNG paths. Map the flag in getters. Surface it in `ProjectsSection` via badge + subtle row emphasis—no slug hardcoding, no new detail-page sections.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, better-sqlite3, Lucide React

## Global Constraints

- Year string exactly: `2023 – Present`
- Category exactly: `Enterprise Financial Management System`
- Role exactly: `Frontend Developer`
- Company/Client: `Ministry of Finance of the Republic of Indonesia`
- Only SAKTI has `is_flagship = 1`; Angkasa/JFAA/SKK = `0`
- Sort orders: SAKTI `1`, Angkasa `2`, JFAA `3`, SKK `4`
- Hero: `/images/projects/sakti/hero.png`
- Gallery: `sakti_1.png` … `sakti_5.png` under `/images/projects/sakti/`
- Do not hardcode `slug === "sakti"` in UI—use `isFlagship`
- Do not add custom modules/ecosystem sections on the detail page
- Spec: `docs/superpowers/specs/2026-07-27-sakti-flagship-design.md`

---

## File structure

| Path | Responsibility |
|---|---|
| `scripts/seed-db.ts` | Schema `is_flagship`; SAKTI case study seed; reorder |
| `src/types/project.ts` | `isFlagship: boolean` on `Project` |
| `src/services/projects/getProjects.ts` | Map `is_flagship` → `isFlagship` |
| `src/services/projects/getProjectBySlug.ts` | Map `is_flagship` → `isFlagship` |
| `src/components/sections/ProjectsSection.tsx` | Flagship badge + row highlight |
| `tests/db/getters.test.ts` | Assert flagship + sort order |

---

### Task 1: `is_flagship` schema, types, getters, and SAKTI seed

**Files:**
- Modify: `src/types/project.ts`
- Modify: `src/services/projects/getProjects.ts`
- Modify: `src/services/projects/getProjectBySlug.ts`
- Modify: `scripts/seed-db.ts`
- Modify: `tests/db/getters.test.ts`
- Delete if present: `public/images/projects/sakti/*.jpg` placeholders

**Interfaces:**
- Consumes: existing `Project` / `ProjectDetail` and seed project shape
- Produces: `Project.isFlagship: boolean`; seeded SAKTI as flagship #1 with full case study

- [ ] **Step 1: Write the failing flagship contract tests**

In `tests/db/getters.test.ts`, update/add:

```ts
  it("returns four projects in sort order with angkasa dark bg", () => {
    const projects = getProjects();
    assert.equal(projects.length, 4);
    assert.deepEqual(
      projects.map((project) => project.slug),
      ["sakti", "angkasa", "jfaa", "skk"],
    );
    assert.equal(projects[0]?.isFlagship, true);
    assert.equal(projects[1]?.isFlagship, false);
    assert.equal(projects[1]?.iconHasDarkBg, true);
    assert.equal(projects[2]?.iconHasDarkBg, false);
  });

  it("returns SAKTI flagship detail with enterprise case study fields", () => {
    const project = getProjectBySlug("sakti");
    assert.ok(project);
    assert.equal(project.isFlagship, true);
    assert.equal(project.year, "2023 – Present");
    assert.equal(project.category, "Enterprise Financial Management System");
    assert.equal(project.role, "Frontend Developer");
    assert.equal(
      project.company,
      "Ministry of Finance of the Republic of Indonesia",
    );
    assert.equal(project.heroImage, "/images/projects/sakti/hero.png");
    assert.ok(project.gallery.length === 5);
    assert.ok(project.features.length >= 4);
    assert.ok(project.tech.includes("Angular"));
    assert.ok(project.tech.includes("Oracle Database"));
  });
```

Keep other existing tests; adjust any that assumed old slug order `["angkasa", "jfaa", "sakti", "skk"]`.

- [ ] **Step 2: Run tests and confirm failure**

```bash
npm test -- tests/db/getters.test.ts
```

Expected: FAIL (missing `isFlagship` and/or wrong sort order / SAKTI content).

- [ ] **Step 3: Add `isFlagship` to the Project type**

In `src/types/project.ts`, add to `Project`:

```ts
  isFlagship: boolean;
```

`ProjectDetail` inherits it via `Project & { ... }`.

- [ ] **Step 4: Map `is_flagship` in getters**

In `getProjects.ts` and `getProjectBySlug.ts`:

- Add `is_flagship: number` to the row type
- Map `isFlagship: Boolean(row.is_flagship)`

- [ ] **Step 5: Extend seed schema and INSERT**

In `scripts/seed-db.ts` `CREATE TABLE projects`, add:

```sql
    is_flagship INTEGER NOT NULL DEFAULT 0,
```

Include `is_flagship` in the INSERT column list and `@is_flagship` binding. Pass `is_flagship` from each project seed object (`1` for SAKTI, `0` otherwise).

- [ ] **Step 6: Replace the SAKTI project seed object**

Set SAKTI to `sort_order: 1`, `is_flagship: 1`. Set Angkasa `sort_order: 2`, JFAA `3`, SKK `4`, all `is_flagship: 0`.

Use this SAKTI content (adapt field names to the seed’s snake_case shape already used in the file):

```ts
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
}
```

**Important:** the existing seed `challenges` shape uses `title` + `body` (not `description`). Use `body` for challenge/solution text when inserting into `project_challenges`.

- [ ] **Step 7: Reseed, run tests, clean placeholders**

```bash
rm -f public/images/projects/sakti/*.jpg
npm run seed
npm test
```

Expected: all tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/types/project.ts src/services/projects/getProjects.ts src/services/projects/getProjectBySlug.ts scripts/seed-db.ts tests/db/getters.test.ts
git commit -m "$(cat <<'EOF'
feat: seed SAKTI as flagship enterprise case study

EOF
)"
```

---

### Task 2: Works list Flagship badge and row highlight

**Files:**
- Modify: `src/components/sections/ProjectsSection.tsx`
- Test: visual check on `/works` (no new unit test file required if getters already lock the flag)

**Interfaces:**
- Consumes: `Project.isFlagship` from Task 1
- Produces: Flagship badge + subtle highlighted row for flagship projects only

- [ ] **Step 1: Update the project row markup**

In the category row area of `ProjectsSection.tsx` (where category is shown), render:

```tsx
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {project.category}
                    </p>
                    {project.isFlagship ? (
                      <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-600">
                        Flagship
                      </span>
                    ) : null}
                  </div>
```

On the `<article>` row, add conditional classes:

```tsx
                className={[
                  "group grid gap-5 border-t border-slate-200 py-6 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 lg:py-7",
                  project.isFlagship
                    ? "bg-slate-50/80 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl border-orange-500/20"
                    : "",
                ].join(" ")}
```

Do not hardcode `project.slug === "sakti"`.

- [ ] **Step 2: Visual verify**

```bash
npm run dev
```

Open `/works`:
1. SAKTI is `01` with Flagship badge and subtle highlight
2. Other projects have no badge
Open `/works/sakti`: case study content + hero/gallery PNGs render

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProjectsSection.tsx
git commit -m "$(cat <<'EOF'
feat: highlight flagship projects on Works list

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| `is_flagship` column + `isFlagship` type | Task 1 |
| SAKTI only flagship; sort 1–4 | Task 1 |
| Full SAKTI case study + PNG paths | Task 1 |
| Map flag in getters + tests | Task 1 |
| Works Flagship badge + row highlight | Task 2 |
| No detail-page module sections / no slug hardcode | Task 1–2 (explicit non-goals) |
