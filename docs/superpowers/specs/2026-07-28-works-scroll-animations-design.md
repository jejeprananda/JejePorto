# Works Page Scroll Animations — Design Spec

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Scope:** Entrance animations on `/works` (hero + Projects / Services / Stack / CTA)

## Goal

Every major piece of the Works page reveals with intentional motion: hero choreographs on load; lower sections reveal once when scrolled into view (header first, then staggered items).

## Decisions

| Topic | Choice |
|---|---|
| Approach | Extend existing IntersectionObserver + CSS transition pattern (no Framer Motion / GSAP) |
| Hero timing | Animate on page load (`trigger="mount"`) |
| Lower sections | Animate once when entering viewport (`trigger="scroll"`), then disconnect |
| Section pattern | Hybrid: section header first, then items stagger (~80–100ms each) |
| Vertical accent | Grow top → bottom (`scaleY`, transform-origin top) |
| Hero background | Slide right → left |
| Hero text | Slide left → right (eyebrow → title → copy → CTA, small stagger) |
| List / card items | Subtle up + opacity |
| Reduced motion | Skip animation; show final visible state |
| Existing `FadeIn` | Leave as-is on project detail pages (out of scope) |

## Current state

- `src/app/works/page.tsx` — server page: static hero, then `ProjectsSection`, `ServicesSection`, `StackSection`, CTA
- `src/components/projects/FadeIn.tsx` — scroll-once fade/up used on project detail only
- No motion library in `package.json`

## Design

### Component: `Reveal`

New shared client component: `src/components/shared/Reveal.tsx`

**Props:**

| Prop | Type | Notes |
|---|---|---|
| `children` | `ReactNode` | Required |
| `className` | `string?` | Optional wrapper classes |
| `direction` | `'left' \| 'right' \| 'up' \| 'scaleY'` | Maps to initial transform |
| `delay` | `number?` | ms; default `0` |
| `duration` | `number?` | ms; default ~700 |
| `trigger` | `'mount' \| 'scroll'` | Hero vs sections |
**Behavior:**

1. Start hidden: opacity 0 + direction transform
2. `trigger="mount"`: mark visible in `useEffect` (respect delay)
3. `trigger="scroll"`: `IntersectionObserver` with threshold `0.12` and `rootMargin: "0px 0px -40px 0px"`; on first intersect → visible, then `disconnect`
4. CSS `transition` for opacity/transform (ease-out)
5. `prefers-reduced-motion: reduce`: immediately visible (no transform animation)

**Direction mapping (concrete defaults):**

| `direction` | Initial state | Visible state |
|---|---|---|
| `left` | `translateX(-24px)` + opacity 0 | `translateX(0)` + opacity 1 |
| `right` | `translateX(24px)` + opacity 0 | `translateX(0)` + opacity 1 |
| `up` | `translateY(24px)` + opacity 0 | `translateY(0)` + opacity 1 |
| `scaleY` | `scaleY(0)` origin top (opacity may stay 1) | `scaleY(1)` |

Hero background may use a larger slide distance (e.g. 40–64px or ~8–12% width) inside an `overflow-hidden` section so the entrance reads clearly without layout shift.

### Hero choreography (on mount)

Extract a client island `WorksHero` so `works/page.tsx` stays a server component for metadata/data.

Sequence:

1. Background image + gradient overlays — `direction="right"` (enters from right → left), ~700–900ms
2. Vertical line — `direction="scaleY"`, delay ~150ms after background starts
3. Text stack — `direction="left"`, stagger ~80–120ms: eyebrow → title → description → “Explore projects” link

Background motion must not break `Image` `fill` layout: animate a wrapping layer with `overflow-hidden` on the section, not the intrinsic image sizing contract.

### Lower sections (on scroll, hybrid)

Apply the same pattern in:

- `ProjectsSection` — header, then each project row
- `ServicesSection` — header, then each service card
- `StackSection` — header, then each stack group
- Bottom CTA block on `works/page.tsx` — two-step reveal: copy block first, then Contact button (`delay` ~100ms)

Per section when it enters view:

1. Header group animates first with `direction="up"`
2. Items follow with `direction="up"` and index-based `delay` (`80ms × index`, after a small header lead-in of ~120ms)
3. Empty states: animate the empty message once if shown

`ServicesSection` remains `"use client"` for the modal; wrapping with `Reveal` does not change modal behavior.

### File touch list

| File | Change |
|---|---|
| `src/components/shared/Reveal.tsx` | New |
| `src/components/sections/WorksHero.tsx` | New client hero island for mount choreography |
| `src/app/works/page.tsx` | Use `WorksHero`; wrap CTA with `Reveal` |
| `src/components/sections/ProjectsSection.tsx` | Wrap header + rows |
| `src/components/sections/ServicesSection.tsx` | Wrap header + cards |
| `src/components/sections/StackSection.tsx` | Wrap header + groups |

Optional later (out of scope): migrate `FadeIn` to call `Reveal` with `direction="up"`.

### Non-goals / out of scope

- Home hero / contact / project detail animations
- Replacing or deleting `FadeIn`
- Adding Framer Motion, GSAP, or other animation libraries
- Scroll-linked scrubbing (progress-tied parallax); this is entrance-only
- Replay-on-reenter animations

## Error handling & resilience

- Observer cleanup on unmount
- If JS fails before hydrate, prefer content readable: avoid permanent `opacity-0` without a non-JS fallback path when practical (e.g. reduced-motion media query in CSS, or ensure mount trigger runs promptly after hydrate)
- Do not animate in a way that traps focus or blocks clicks during transition

## Testing

- Manual: load `/works` — hero sequence plays; scroll each section — header then stagger; scroll back — no replay
- Manual: OS reduced-motion on — no slides; content visible
- Automated (lightweight): optional unit/smoke that `Reveal` renders children; no visual regression suite required for this change

## Success criteria

- Hero background slides in from the right on load; text from the left; vertical line grows top → bottom
- Projects, Services, Stack, and CTA animate only when scrolled into view, once
- Section headers lead; items stagger afterward
- No new runtime dependencies
- `/works` remains usable with reduced motion and on mobile
