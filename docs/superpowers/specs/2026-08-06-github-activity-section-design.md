# GitHub Activity Section — Design Spec

**Date:** 2026-08-06  
**Status:** Approved for planning  
**Scope:** Move GitHub contribution graph out of the scroll-expand hero into a dedicated section between hero and projects

## Goal

Keep the hero focused on identity and tagline. Show recent GitHub commit activity in its own full-width dark band above Projects, with the same month ranges as today.

## Decisions

| Topic | Choice |
|---|---|
| Placement | New section below hero content, above `ProjectsSection` |
| Section background | Full dark band (`#0d1117` / near-black), not a white section with a dark card |
| Month range | Mobile: 3 months; desktop (`md+`): 4 months |
| Graph component | Reuse existing `ContributionGraph` |
| Hero GitHub UI | Remove entirely (no graph, no github props on hero) |
| Approach | Dedicated `GitHubActivitySection` component (matches Projects/Services/Stack) |

## Current state

- `getGitHubStats()` runs on the home page and passes stats into `HomeScrollExpand` → `ScrollExpandMedia` → `HeroCardContent`
- Hero card shows name, role, divider, tagline, plus the contribution graph in a transparent panel
- `ContributionGraph` already supports `monthsToShow` and dark-friendly white/green styling

## Design

### Architecture

1. Stop passing `github` into `HomeScrollExpand` / `ScrollExpandMedia`.
2. Simplify `HeroCardContent` to identity + tagline only (no graph branch, no month state for GitHub).
3. Add `src/components/sections/GitHubActivitySection.tsx`.
4. On `src/app/page.tsx`, render:

```tsx
<HomeScrollExpand>
  <GitHubActivitySection github={githubStats} />
  <ProjectsSection projects={projects} />
  …
</HomeScrollExpand>
```

`HomeScrollExpand` children already render after the scroll-expand hero viewport, so this places the band correctly without changing scroll-expand internals.

### Section layout

- `id="github-activity"`, `aria-labelledby="github-activity-title"`
- Full-width dark background (`bg-[#0d1117]`), white/muted copy for contrast
- One job: show recent GitHub activity
- Eyebrow “GitHub” + heading “Recent activity” + one short support line
- Content in `max-w-[1280px]` like other home sections; graph centered within that
- Months: `3` below `md`, `4` at `md+`, via the same `matchMedia("(max-width: 768px)")` pattern already used in the hero
- If `github` is null or has no contributions: hide the section entirely (no empty shell)
- Use existing `Reveal` scroll animation like other home sections

### Data flow

- Unchanged fetch: `getGitHubStats()` in `page.tsx`
- Graph still uses cached contributions (1h) and profile URL from stats
- No new APIs

### Hero cleanup

- Remove `ContributionGraph` import and github-related props/state from `scroll-expansion-hero.tsx`
- Remove `github` prop from `HomeScrollExpand`
- Keep name, Fullstack Developer, horizontal rule, and tagline as they are after recent edits
- Hero card can return to a simpler centered identity layout (no side-by-side graph)

### Testing

- Update `tests/layout/hero-text-contrast.test.ts` (or split/add a section test) so hero assertions no longer require `ContributionGraph` / month wiring in the hero
- Assert the new section file (or `page.tsx`) wires `GitHubActivitySection` with github stats and dark background
- Keep existing identity/tagline/contrast assertions for the hero

## Out of scope

- Changing contribution API, cache TTLs, or username config
- Showing full-year history
- Avatar / profile photo in this section
- Navbar link to the section (can add later)
- Restyling Projects/Services/Stack

## Success criteria

- Hero has no GitHub commit graph
- Dark GitHub activity band appears between hero and Projects
- Graph shows 3 months on mobile and 4 on desktop
- Home still loads when GitHub fetch fails (section omitted)
- Layout/contrast tests updated and passing
