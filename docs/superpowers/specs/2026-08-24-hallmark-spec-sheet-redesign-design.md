# Hallmark Spec Sheet Redesign — Design Spec

**Date:** 2026-08-24  
**Status:** Approved for planning  
**Scope:** Full-site visual redesign (home, case studies, contact, CV) using Hallmark `redesign` principles  
**Approach:** Spec Sheet (macrostructure: Long Document / Index-First hybrid)

## Goal

Redesign Jessy Prananda's portfolio to feel **technical, minimal, and credible** — prioritizing product clients, then recruiters, then peer engineers — while keeping the existing hero video as a full-screen opening chapter with a calmer interaction than the current scroll-expand card.

The site should read like a **spec sheet / technical document**, not an editorial designer portfolio or a generic AI landing page.

## Audience priority

| Priority | Audience | What they must feel |
| --- | --- | --- |
| 1 | Product clients | "This person designs and builds real systems." |
| 2 | Recruiters / hiring managers | Fast scan: role, projects, stack, contact. |
| 3 | Peer engineers | Sharp, restrained, no decorative chrome. |

## Hallmark fingerprint

| Axis | Choice |
| --- | --- |
| Theme | Custom — paper white, near-black ink, single sparse accent |
| Heading placement | Hanging (negative space above section titles) |
| Body composition | Single column + asymmetric index rows |
| Divider language | Negative space first; hairline rules when needed |
| Button voice | Outlined / typographic link (no oversized solid blocks) |
| Image treatment | Full-bleed in case studies; none in hero overlay |
| Reveal pattern | Pin/fade on hero only; rest mostly static |
| Nav | N9 Edge-min (wordmark + text links, no glass pill) |
| Footer | Ft2 Inline single line |

**Anti-patterns to reject:** SaaS hero (centered pill CTA), 3-feature card row, fake terminal chrome, italic display headings, orange-everywhere accent, scroll-expand glass card, numbered section labels beside headings.

## Visual system

### Surface

- **Paper:** off-white background (`#F7F7F5` or equivalent token), not clinical `#FFFFFF` everywhere.
- **Ink:** near-black body text (`#111111` range).
- **Accent:** one color, used sparingly — focus rings, one active link, metadata highlights. Not the current orange-everywhere pattern. Exact hue chosen at implementation from brief ("technical + simple"); candidate: cool blue-gray or muted teal, not orange.

### Typography

- **Display + body:** Geist Sans (already loaded) — drop Instrument Serif from headings.
- **Metadata:** Geist Mono — years, stack tags, status labels, "Download CV", section indices.
- **No italic headings.** Emphasis via weight or accent color only.

### Spacing & dividers

- Generous vertical rhythm; sections breathe via whitespace, not cards.
- Hairline rules (`0.5px`, `border-slate-200` equivalent) only where a list needs separation.
- No dark cards, no glassmorphism, no decorative icons.

## Hero video (preserved, calmer)

### Assets (unchanged)

- `mediaSrc`: `/videos/hero.mp4`
- `posterSrc`: `/images/hero-poster.jpg`
- `bgImageSrc`: `/videos/hero-bg.mp4` (if still used as ambient layer)

### Interaction (replaces scroll-expand card)

1. Video fills first viewport (100vh), pinned briefly on scroll.
2. On scroll: video dims slightly and translates up subtly (not a growing card).
3. Page content fades/slides in beneath; no wheel-hijack after the hero chapter completes.
4. Overlay: name, role ("Fullstack Developer"), one-line scroll hint. Minimal chrome.

### Component boundary

- Replace `ScrollExpandMedia` / `HomeScrollExpand` scroll-expand behavior with a new client component (e.g. `HeroVideoChapter`) that owns video pin + transition.
- `HomeScrollExpand` may be refactored or replaced; `scroll-expansion-hero.tsx` becomes unused on home (remove only after confirming no other consumers).

### Navbar on hero

- Transparent, text links in high-contrast (white or near-white on video).
- No rounded glass pill. Same edge-min nav on all pages; on light pages links are ink-colored.

## Homepage structure

Order after hero chapter:

| # | Section | Content | Notes |
| --- | --- | --- | --- |
| 1 | Video chapter | Full-screen hero video | See above |
| 2 | Identity strip | Name, role, one-line builder statement | Not a long bio |
| 3 | Work index | `#projects` — project list as spec rows | Title, role, year, one-line outcome; flagship row deeper, not a noisy card |
| 4 | Services | Definition-list layout | Term left, description right; keep `ServiceDetailModal` |
| 5 | Stack | Dependency-style groups | Frontend / Backend / Design / Delivery; text names only, no logo badges |
| 6 | Close CTA | Combined block | "Have something in mind?" + Contact Me + Download CV |

### Navigation

- Items: About (`/`), Works (`/#projects`), Contact (`/contact`).
- Footer: short inline line — name, links, year.

### Content & data (preserved)

- `getProjects()`, `getServices()`, `getStackGroups()` — no schema changes.
- Copy intent preserved; wording may be tightened for spec-sheet tone but not invented metrics.

## Inner pages

### Works (`/works`)

- Continues to redirect to `/#projects` on home. No duplicate project index.

### Case study (`/works/[slug]`)

Document layout, not marketing landing:

- Hanging headings, mono metadata (year, role, stack).
- Existing section order preserved: hero image, overview, challenges, features, stack, results, gallery, related projects.
- Images full-bleed where appropriate; no fake browser/IDE frames.
- Bottom CTA matches home close block (Contact + Download CV).

### Contact (`/contact`)

- Two-column: form + contact data (email, location, social links).
- Netlify Forms wiring unchanged.
- Outlined submit button; no large orange block CTA.

### CV (`/cv`)

- Toolbar: Back to portfolio + Download PDF (`window.print()`).
- No tip text below toolbar.
- `CvDocument` tightened for print-spec hierarchy.
- Home "Download CV" links to `/cv` (not a static PDF file).

## Implementation boundaries

### In scope (visual / interaction layer)

- Design tokens in `globals.css` (or new `tokens.css` imported there).
- `Navbar` — edge-min style, remove glass pill.
- New hero video chapter component; retire scroll-expand on home.
- Homepage sections: `ProjectsSection`, `ServicesSection`, `StackSection`, close CTA block in `page.tsx`.
- `ContactSection`, `CvToolbar`, case-study shells (`SectionShell`, `Hero`, `FooterCTA`, etc.).
- Layout tests that assert old visual patterns (scroll-expand, pill nav, serif headings).

### Out of scope / preserved without deletion

- Routes: `/`, `/works`, `/works/[slug]`, `/contact`, `/cv`.
- Data layer: SQLite seed, getters, `getCvData`.
- Case study content and section data model.
- Netlify form integration.
- Video asset files.

### Deletion policy

- Do not delete production routes, component directories, or case-study files.
- `scroll-expansion-hero.tsx` and unused `HeroSection.tsx` may be removed only after confirming zero imports.
- `CvSection.tsx` already removed in prior work; close CTA lives in `page.tsx`.

## Architecture

- **Framework:** Next.js App Router (unchanged).
- **Data:** Existing server-side getters; pages remain server components where possible.
- **Client islands:** Hero video chapter, `Navbar` (scroll state), `ServiceDetailModal`, `ContactForm`, `CvToolbar`, `Reveal` (minimize usage — hero only if needed).
- **No new backend.**

## Motion

- Hero: pin + dim/translate + content entrance (one chapter).
- Below hero: static layout. Remove `Reveal` scroll triggers from homepage sections unless one identity-strip mount fade is needed; prefer static.
- Respect `prefers-reduced-motion`: skip pin animation, show final state immediately.

## Error & empty states

- Preserve existing empty states (no projects, no stack).
- `not-found.tsx` styled to match new system.
- Contact form success/error states unchanged functionally.

## Testing plan

| Area | Method |
| --- | --- |
| Data getters | Existing `tests/db/getters.test.ts` — must still pass unchanged |
| Layout contracts | Update tests that match scroll-expand, pill nav, serif, orange CTA patterns |
| Manual | Home desktop + mobile (320/375/414/768), case study page, contact form render, CV print preview |
| Hallmark slop gates | No fake metrics, no italic headings, no re-drawn chrome, token-locked colors |

## Success criteria

1. Hero video still opens full-screen; interaction feels calmer than scroll-expand card.
2. Site reads as technical and minimal within 5 seconds of landing.
3. Product client can scan projects + services + stack without visual noise.
4. Recruiter can reach Contact and CV in one click from home close block.
5. All routes work; no data layer regressions; existing tests updated and passing.

## Accent color (implementation lock)

At implementation start, pick **one** accent from: cool blue-gray (`#3B5B8A` range) or muted teal (`#2A6B6B` range). Lock it in CSS tokens before any component work. Do not reuse the current orange as the primary accent.
