# Home Hero Mount Animations — Design Spec

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Scope:** Entrance animations on the home (About) page hero (`HeroSection`)

## Goal

On `/` load, the About hero choreographs with intentional mount motion: background and vertical accent enter first, then copy, CTAs, and social icons stagger in — matching the Works hero feel with a longer stagger for home’s extra content.

## Decisions

| Topic | Choice |
|---|---|
| Approach | Reuse shared `Reveal` (`trigger="mount"`); no new animation libraries |
| Component shape | Convert `HeroSection` to a client island (same pattern as `WorksHero`) |
| Page boundary | `src/app/page.tsx` stays a server page with `metadata` |
| Choreography | Background → line → text stack → CTAs → individually staggered social icons |
| Reduced motion | Final visible state via existing `Reveal` `motion-reduce:` classes |
| Out of scope | Works page changes, `FadeIn`, other home sections, new libs |

## Current state

- `src/app/page.tsx` — server page; imports static `HeroSection`
- `src/components/sections/HeroSection.tsx` — full-viewport hero (bg, overlays, line, name, role, bilingual copy, two CTAs, five social links); not yet a client component
- `src/components/shared/Reveal.tsx` — shared mount/scroll reveal (used by Works)
- Works hero already establishes the mount choreography reference

## Design

### Architecture

1. Add `"use client"` to `HeroSection`.
2. Wrap animated pieces with `Reveal` (`trigger="mount"`).
3. Keep all existing copy, Tailwind classes, `id="hero-title"`, social `aria-label`s, and link targets.
4. Section retains `overflow-hidden` so background slide does not spill.
5. Vertical line Reveal keeps `self-stretch` / height and `aria-hidden="true"` so `scaleY` has room to grow.

### Choreography (on mount)

| Step | Element | Direction | Delay (ms) | Duration (ms) |
|---|---|---|---|---|
| 1 | Background image + gradient overlays | `right`, `distance="wide"` | 0 | 800 |
| 2 | Vertical accent line | `scaleY` | 150 | 700 |
| 3 | “Hi, I’m” | `left` | 200 | 700 |
| 4 | Name (`h1#hero-title`) | `left` | 280 | 700 |
| 5 | “Fullstack Developer” | `left` | 360 | 700 |
| 6 | Japanese line | `left` | 440 | 700 |
| 7 | English blurb | `left` | 520 | 700 |
| 8 | “View My Work” CTA | `left` | 600 | 700 |
| 9 | “Contact Me” CTA | `left` | 680 | 700 |
| 10–14 | Social icons (each, in list order) | `left` | `760 + index * 70` | 700 |

Background motion animates a wrapping layer (not the `Image` fill contract itself), same approach as `WorksHero`.

### Reduced motion & resilience

- Rely on `Reveal`’s `motion-reduce:` utilities for immediate final state (no JS reduced-motion branch required).
- `Reveal` already sets `data-reveal`. Add the same `[data-reveal]` noscript CSS block to `src/app/page.tsx` that Works uses, so home content is not permanently hidden without JS.

### Testing

Source-contract tests (Node test runner, same style as `tests/layout/works-reveal.test.ts`):

- `HeroSection` is a client component exporting `HeroSection`
- Imports `Reveal` from `@/components/shared/Reveal`
- Uses `trigger="mount"` with `direction="right"`, `scaleY`, and `left`
- Preserves `hero-title` and `bg-hero.png`
- Asserts social stagger expression `760 + index * 70` (or equivalent)
- Home `page.tsx` keeps `export const metadata` and has no `"use client"`

## Success criteria

1. On `/` load: background slides from the right; line grows top → bottom; text, CTAs, then social icons stagger from the left.
2. Visual layout, copy, and a11y attributes match the current static hero.
3. Reduced-motion users see final content without slides.
4. Without JS, noscript fallback keeps reveal content visible.
5. Contract tests pass; no new runtime animation libraries.

## Out of scope

- Animating Works further or migrating `FadeIn`
- Scroll-triggered sections on home (home is hero-only today)
- Replay-on-reenter or scroll-scrubbed motion
