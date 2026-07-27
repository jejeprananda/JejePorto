# SAKTI Flagship Project — Design Spec

**Date:** 2026-07-27  
**Status:** Approved for planning  
**Scope:** Elevate SAKTI as the portfolio flagship via data + Works list highlight; fill case study content and images

## Goal

Position SAKTI as the flagship enterprise project so recruiters see government-scale financial systems work first—not a generic website entry. Update case study content and assets, reorder it to #1 on Works, and show a clear Flagship badge/highlight. Keep the existing project detail page layout (same as Angkasa/JFAA).

## Decisions

| Topic | Choice |
|---|---|
| Flagship scope | Content + images + sort #1 + Works badge/highlight (option B) |
| Year | `2023 – Present` |
| Flag mechanism | `is_flagship` column on `projects` (Approach A) |
| Detail page | No special modules/ecosystem UI sections; fold that narrative into overview + features |

## Current state

- SAKTI is a normal Works entry (`sort_order` 3) with generic copy.
- Project detail uses shared sections under `src/components/projects/*`.
- Images already exist at `public/images/projects/sakti/` (`hero.png`, `sakti_1.png` … `sakti_5.png`).

## Design

### Data model

Add to `projects`:

- `is_flagship INTEGER NOT NULL DEFAULT 0`

Domain types:

- `Project.isFlagship: boolean` (also present on `ProjectDetail` via extension)

Seed rules:

- SAKTI: `is_flagship = 1`, `sort_order = 1`
- Angkasa / JFAA / SKK: `is_flagship = 0`, sort orders `2`, `3`, `4` respectively

### SAKTI seed content (locked)

| Field | Value |
|---|---|
| Title | SAKTI |
| Category | Enterprise Financial Management System |
| Year | `2023 – Present` |
| Role | Frontend Developer |
| Company / Client | Ministry of Finance of the Republic of Indonesia |
| Platform | Web Application |
| Frontend | Angular, TypeScript, HTML5, SCSS |
| Backend | Spring Boot, Java, REST API |
| Database | Oracle Database |
| Deployment | Red Hat Enterprise Linux |
| Overview heading | Project Overview |

**Copy source:** user-provided case study (overview, challenge/solution, role, Sync + Budgeting modules narrative, features, tech stack, enterprise development process, challenges, results). Ten-module ecosystem and module focus are expressed in overview text and feature cards—not new page sections.

**Images:**

- Hero: `/images/projects/sakti/hero.png`
- Gallery: `/images/projects/sakti/sakti_1.png` … `sakti_5.png` (large / two-small alternating)

Remove obsolete placeholder JPGs for SAKTI if still present.

### Works list highlight

In `ProjectsSection.tsx`, when `project.isFlagship`:

- Show a small **Flagship** badge next to the category label (orange accent, restrained)
- Apply a subtle row emphasis (soft `slate-50` background and/or thin accent)—still one list, not a separate card block
- Keep index numbering from the sorted list (`01` for SAKTI)

Non-flagship rows unchanged. No homepage changes. No slug hardcoding.

### Services / page

- Map `is_flagship` in `getProjects` and `getProjectBySlug`
- `/works/sakti` continues to compose existing detail sections from `ProjectDetail`

## Files to touch

- `scripts/seed-db.ts`
- `src/types/project.ts`
- `src/services/projects/getProjects.ts`
- `src/services/projects/getProjectBySlug.ts`
- `src/components/sections/ProjectsSection.tsx`
- `tests/db/getters.test.ts`

## Success criteria

- Works lists SAKTI first with a Flagship badge and subtle highlight
- `/works/sakti` shows the professional case study copy and real PNGs
- Other projects do not show the Flagship badge
- `npm run seed && npm test` passes

## Out of scope

- Custom detail sections for modules / 10-module ecosystem UI
- Homepage / Hero flagship callout
- Hardcoding `slug === "sakti"` in components
- Redesigning the shared project detail layout
