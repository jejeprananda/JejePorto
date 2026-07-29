# Home Hero Text Contrast — Design Spec

**Date:** 2026-07-29  
**Status:** Approved for planning  
**Scope:** Readable white hero copy over full-bleed looping video, without any video overlay

## Goal

Keep the home hero video as the dominant, unmasked visual, while making “Hi, I’m Jessy Prananda” and supporting copy reliably readable across bright and busy video frames.

## Decisions

| Topic | Choice |
|---|---|
| Priority | Video first — minimize anything that dims or covers footage |
| Treatment | Text-only: layered dark `text-shadow` via named CSS utilities |
| Overlay / scrim | None — no gradient mask, no left-column scrim, no filter on the video |
| Stroke / outline | No `-webkit-text-stroke` (avoids cheap/cartoon look) |
| Filter drop-shadow | Not used — prefer per-element `text-shadow` for hierarchy control |
| CSS surface | `.hero-shadow-strong` / `.hero-shadow-medium` / `.hero-shadow-soft` in `globals.css` |
| Layout / copy / motion | Unchanged |
| Out of scope | Navbar contrast, Works hero, video re-edit/color grade, new libraries |

## Current state

- `src/components/sections/HeroSection.tsx` — full-viewport hero with `/videos/hero.mp4`, white (and `white/80`) copy, no gradient overlays
- White flat text loses contrast when frames are bright or filled with UI chrome behind the left text column
- Earlier white gradient masks were removed by design preference; this spec must not reintroduce them

## Design

### Architecture

1. Keep the video layer as-is (`object-cover`, no overlays).
2. Apply dark multi-layer `text-shadow` to hero typography by hierarchy weight.
3. Add three named utilities in `globals.css`: `.hero-shadow-strong`, `.hero-shadow-medium`, `.hero-shadow-soft`. Apply via className on the relevant elements in `HeroSection.tsx`.
4. Do not change Reveal choreography, spacing, CTA structure, or orange accent on “Prananda”.

### Shadow hierarchy

| Element | Fill | Utility |
|---|---|---|
| “Hi, I'm” | `white` | `.hero-shadow-soft` |
| Name (`h1#hero-title`) | `white`; “Prananda” stays `orange-500` | `.hero-shadow-strong` |
| “Fullstack Developer” | `white` | `.hero-shadow-medium` |
| Japanese + English body | `white/80` | `.hero-shadow-soft` |
| Secondary CTA label + social icons | `white` | `.hero-shadow-soft` |

**Reference recipes:**

```css
.hero-shadow-strong {
  text-shadow:
    0 1px 2px rgb(0 0 0 / 0.55),
    0 4px 18px rgb(0 0 0 / 0.35);
}
.hero-shadow-medium {
  text-shadow:
    0 1px 2px rgb(0 0 0 / 0.45),
    0 3px 12px rgb(0 0 0 / 0.28);
}
.hero-shadow-soft {
  text-shadow:
    0 1px 2px rgb(0 0 0 / 0.4),
    0 2px 10px rgb(0 0 0 / 0.22);
}
```

Shadows are dark only — never a white glow. Values may be tuned during verification without changing the utility names.

### Vertical accent line

Leave unchanged in the first pass. Revisit only if it washes out after text shadows land.

### Verification

- Desktop + mobile while the video loops
- Especially check bright frames and frames with dense UI behind the text column
- If still failing: tune shadow opacity/blur only
- Reintroducing any video overlay requires a new design decision — out of scope for this change

## Non-goals

- Restoring the previous white gradient masks
- Darkening the entire video
- Changing typography size, weight, or color scheme back to slate
- Accessibility redesign beyond contrast of existing white text

## Success criteria

- Name and primary headline remain clearly readable through a full video loop
- Video remains visually full-bleed with no perceptible scrim
- No layout or motion regressions in `HeroSection`
