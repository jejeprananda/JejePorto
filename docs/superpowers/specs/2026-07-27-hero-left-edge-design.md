# Hero Left-Edge Text Column — Design Spec

**Date:** 2026-07-27  
**Status:** Approved for planning  
**Scope:** Visual layout change in `HeroSection` only

## Goal

Make the entire left text column in the Hero section (vertical line through social icons) sit near the left edge of the viewport, outside the shared page container. Navbar and all other pages/sections keep their existing container alignment.

## Decisions

| Topic | Choice |
|---|---|
| What breaks out of the container | Entire Hero left column (line + greeting + name + role + copy + CTAs + social) |
| Left inset | Small fixed gap (~16px), not true 0px against the viewport edge |
| Breakpoints | Mobile (`< sm`): keep safe `pl-5`. From `sm+`: use `pl-4` (16px) |
| Approach | Asymmetric padding on the Hero content wrapper (Approach A) |

## Current state

`HeroSection` wraps content in:

```
mx-auto max-w-[1440px] px-5 … xl:px-16
```

That matches the Navbar container, so the vertical line and text sit inset from the left edge of the screen on all breakpoints.

## Design

### Layout

Change only the inner content wrapper in `src/components/sections/HeroSection.tsx`:

1. Remove `mx-auto` and `max-w-[1440px]` so the wrapper is full-width and left-aligned.
2. Replace symmetric horizontal padding (`px-*`) with asymmetric padding:
   - Left: `pl-5 sm:pl-4`
   - Right: `pr-5 sm:pr-8` (keeps mobile text off the right edge; desktop stays loose because the photo sits on the right)
3. Keep existing vertical padding (`pt-*` / `pb-*`) and `flex min-h-dvh items-center`.
4. Keep the inner text column `max-w-[760px]` so line length does not stretch on ultrawide screens.
5. Do not change the vertical line, typography, CTAs, social links, background image, or overlays.

### Non-goals / out of scope

- Navbar container or padding
- Other sections/pages (Works, Contact, Services, etc.)
- Hero typography, vertical spacing, or content copy
- Shared layout primitives / global container utilities

## Success criteria

- On `sm+`, the vertical line and Hero text column sit ~16px from the left viewport edge (clearly left of the Navbar content inset).
- Below `sm`, left padding remains `pl-5` for safe mobile spacing.
- Navbar and other pages/sections retain their current `max-w` + symmetric padding behavior.
- Hero background image and overlays remain full-bleed.
- No visual regressions to Hero typography, CTAs, or social icons beyond horizontal positioning.

## Implementation note

Single-file change: `src/components/sections/HeroSection.tsx` content wrapper classes only.
