# Portfolio Works + SQLite Design

**Date:** 2026-07-22  
**Status:** Approved for planning  
**Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, better-sqlite3

## Goal

Restructure the portfolio so Home is hero-only, Works aggregates projects/services/stack from a seeded SQLite database (read-only, no CRUD), Contact is a UI-only form scaffold, and navigation is limited to About, Works, and Contact.

## Decisions

| Topic | Decision |
|---|---|
| About | `/` — Home/Hero only |
| Works sections order | Projects → Services → Stack |
| Projects | Angkasa, JFAA, Sakti, SKK |
| Project icons | `/images/logo/logo_*.png`; Angkasa uses dark background + padding; others transparent |
| Services | Webapp, Website, Mobile App, MCP Server |
| Service detail | Modal on Works page (no route change) |
| Project detail | Dedicated page `/works/[slug]` with long description |
| Contact | Form UI (name, email, message); no backend |
| Content language | English |
| Data access | better-sqlite3 + Server Components |
| CRUD | Out of scope |

## Routes & navigation

| Route | Purpose |
|---|---|
| `/` | Hero only (`public/images/bg-hero.png`) |
| `/works` | Projects, Services, Stack sections |
| `/works/[slug]` | Project detail from SQLite |
| `/contact` | Contact form scaffold |

Navbar items:

1. About → `/`
2. Works → `/works`
3. Contact → `/contact`

Brand/logo `JP.` links to `/`.

### Interaction rules

- Project “Learn more” navigates to `/works/[slug]`.
- Service “Learn more” opens an in-page modal with `detail_description`.
- Contact submit does not call a backend (UI-only; optional “coming soon” / no-op feedback).

## SQLite schema

**Database file:** `data/portfolio.db` (generated; gitignore the `.db` binary, keep `data/.gitkeep`)  
**Seed script:** `scripts/seed-db.ts`, runnable via `npm run seed` to create/recreate the DB with seed data.

### `projects`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `slug` | TEXT UNIQUE | `angkasa`, `jfaa`, `sakti`, `skk` |
| `title` | TEXT | Display name |
| `category` | TEXT | Seed: Angkasa=Website, JFAA=Website, Sakti=Webapp, SKK=Webapp |
| `short_description` | TEXT | Works list teaser |
| `long_description` | TEXT | Detail page body (English draft in seed) |
| `year` | TEXT | Display year |
| `icon_path` | TEXT | e.g. `/images/logo/logo_angkasa.png` |
| `icon_has_dark_bg` | INTEGER | `1` for Angkasa only; else `0` |
| `sort_order` | INTEGER | List order |

### `services`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `slug` | TEXT UNIQUE | `webapp`, `website`, `mobile-app`, `mcp-server` |
| `title` | TEXT | Webapp, Website, Mobile App, MCP Server |
| `short_description` | TEXT | Card teaser |
| `detail_description` | TEXT | Modal body (English draft in seed) |
| `icon_name` | TEXT | Key mapped to Lucide icon in UI |
| `sort_order` | INTEGER | |

### `stack`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `group_title` | TEXT | Frontend / Backend / Database / Tools & DevOps |
| `group_number` | TEXT | `01`…`04` |
| `technology` | TEXT | One row per technology |
| `sort_order` | INTEGER | Order within group |

Normalized stack rows (not JSON arrays) keep querying and seed edits simple.

## Data access

- `src/lib/db.ts` — open better-sqlite3 connection to `data/portfolio.db` (absolute path from project root).
- Domain getters under `src/services/`:
  - `projects/getProjects.ts`, `projects/getProjectBySlug.ts`
  - `catalog/getServices.ts` (folder name `catalog` avoids `services/services`)
  - `stack/getStackGroups.ts` (query rows, group in TypeScript)
- Configure Next.js to treat `better-sqlite3` as a server external package where required.
- Reads happen in Server Components / page loaders only.
- No public write API. No admin CRUD.

## UI composition

### Layout

- Root layout renders `Navbar` and page `children`.
- Prefer Server Components; mark only interactive pieces as client (`Navbar` mobile menu, `ServiceDetailModal`, contact form interactivity).

### Home `/`

- `HeroSection` only.
- Full-bleed wallpaper: `public/images/bg-hero.png`.
- Brand-forward hero: name/brand, one headline, one supporting sentence, CTA group (Works / Contact).
- No projects, services, stack, or contact sections on Home.

### Works `/works`

1. `ProjectsSection` — list from DB; icons respect `icon_has_dark_bg`; link to detail.
2. `ServicesSection` — list from DB; Learn more opens modal.
3. `StackSection` — grouped technologies from DB.

### Project detail `/works/[slug]`

- Icon, title, category, year, `long_description`.
- Back link to `/works`.
- Unknown slug → `not-found`.

### Contact `/contact`

- Fields: name, email, message; submit button.
- Light client validation for required fields.
- No server action / email / API in this scope.

### Suggested file layout (existing `src/` kept)

```text
src/app/
  page.tsx                 # Home
  works/page.tsx
  works/[slug]/page.tsx
  contact/page.tsx
  layout.tsx
src/components/layout/Navbar.tsx
src/components/sections/HeroSection.tsx
src/components/sections/ProjectsSection.tsx
src/components/sections/ServicesSection.tsx
src/components/sections/StackSection.tsx
src/components/shared/ServiceDetailModal.tsx
src/lib/db.ts
src/services/projects/
src/services/catalog/
src/services/stack/
data/.gitkeep
scripts/seed-db.ts
public/images/bg-hero.png
public/images/logo/logo_*.png
```


Reusable components live under `src/components/` (not buried only under route folders). Legacy/incomplete `src/app/home` and `src/app/work` hard-coded data should be replaced or removed as part of implementation so there is a single source of truth (SQLite).

## Seed content expectations

- English copy throughout.
- Four projects with plausible short + long descriptions (editable later via re-seed).
- Four services with short + modal detail copy.
- Stack groups/technologies based on the current codebase stack list (Frontend, Backend, Database, Tools & DevOps).

## Error handling

| Case | Behavior |
|---|---|
| Missing/unreadable DB | Fail clearly on the server with a readable error |
| Unknown project slug | `not-found` page |
| Empty query results | Short empty-state copy in the affected section |
| Contact submit | No network write; UI-only feedback |

## Out of scope

- Admin CRUD / CMS
- Auth
- Email or contact API
- Project search/filter
- Service detail routes
- Changing visual brand system beyond what’s needed for these pages

## Verification

1. Seed script creates `data/portfolio.db` with projects, services, and stack rows.
2. `npm run build` succeeds.
3. Manual checks:
   - `/` shows hero only with `bg-hero.png`
   - Navbar has About, Works, Contact only
   - `/works` shows Projects → Services → Stack from DB
   - Angkasa icon has dark background; other logos do not
   - `/works/jfaa` (and other slugs) show long description
   - Service Learn more opens modal (no navigation)
   - `/contact` form renders and does not require a backend

## Approach note

**Chosen:** better-sqlite3 + Server Components (simple read-only portfolio data).  
**Rejected for now:** libsql (heavier for local-only needs); REST route handlers + client fetch (unnecessary round-trips for static portfolio reads).
