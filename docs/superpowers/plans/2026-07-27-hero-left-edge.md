# Hero Left-Edge Text Column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire Hero left text column (vertical line through social icons) sit near the left viewport edge with a small fixed inset, while Navbar and all other pages keep their existing containers.

**Architecture:** Single-file class change on the Hero content wrapper in `HeroSection.tsx`. Remove centered `max-w-[1440px]` + symmetric `px-*`. Use full-width left-aligned layout with asymmetric padding (`pl-5 sm:pl-4` / `pr-5 sm:pr-8`). Keep inner `max-w-[760px]` text column, vertical padding, and all decorative/content children unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4

## Global Constraints

- Touch only `src/components/sections/HeroSection.tsx` for the layout change
- Do not modify Navbar, Works, Contact, or other section containers
- Left inset: `pl-5` below `sm`, `pl-4` (16px) from `sm+`
- Right inset: `pr-5 sm:pr-8`
- Keep existing vertical padding and `min-h-dvh` / `items-center`
- Keep inner text column `max-w-[760px]`
- Do not change typography, CTAs, social links, background image, or overlays
- Spec source: `docs/superpowers/specs/2026-07-27-hero-left-edge-design.md`

---

## File structure

| Path | Responsibility |
|---|---|
| `src/components/sections/HeroSection.tsx` | Hero layout; only the content wrapper classes change |
| `tests/layout/hero-left-edge.test.ts` | Asserts wrapper classes match the approved inset rules |

---

### Task 1: Assert current wrapper classes, then apply left-edge layout

**Files:**
- Create: `tests/layout/hero-left-edge.test.ts`
- Modify: `src/components/sections/HeroSection.tsx` (content wrapper `className` only — the `div` currently around lines 137–145)
- Test: `tests/layout/hero-left-edge.test.ts`

**Interfaces:**
- Consumes: none
- Produces: Hero content wrapper uses full-width left-edge asymmetric padding; test locks the class contract

- [ ] **Step 1: Write the failing layout contract test**

Create `tests/layout/hero-left-edge.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const heroSource = readFileSync(
  join(root, "src/components/sections/HeroSection.tsx"),
  "utf8",
);

describe("HeroSection left-edge layout", () => {
  it("uses asymmetric left/right padding without centered max-width container", () => {
    assert.match(heroSource, /\bpl-5\b/);
    assert.match(heroSource, /\bsm:pl-4\b/);
    assert.match(heroSource, /\bpr-5\b/);
    assert.match(heroSource, /\bsm:pr-8\b/);

    assert.doesNotMatch(
      heroSource,
      /mx-auto flex min-h-dvh w-full max-w-\[1440px\]/,
    );
    assert.doesNotMatch(
      heroSource,
      /px-5 pb-14 pt-28[\s\S]*sm:px-8[\s\S]*lg:px-12[\s\S]*xl:px-16/,
    );
  });

  it("keeps the inner text column max width", () => {
    assert.match(heroSource, /max-w-\[760px\]/);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm test -- tests/layout/hero-left-edge.test.ts
```

Expected: FAIL — current source still has `mx-auto` / `max-w-[1440px]` / symmetric `px-*`, and is missing `sm:pl-4` / `sm:pr-8`.

- [ ] **Step 3: Update the Hero content wrapper classes**

In `src/components/sections/HeroSection.tsx`, replace the content wrapper `className` (the `div` that currently has `mx-auto flex min-h-dvh w-full max-w-[1440px] …`) with:

```tsx
      <div
        className="
          flex min-h-dvh w-full
          items-center
          pl-5 pr-5 pb-14 pt-28
          sm:pl-4 sm:pr-8 sm:pb-16 sm:pt-32
          lg:pb-20 lg:pt-36
        "
      >
```

Do not change:
- the outer `<section>`
- background `Image` or overlays
- the inner `max-w-[760px]` column
- vertical line, typography, CTAs, or social nav

- [ ] **Step 4: Re-run the layout test and confirm it passes**

```bash
npm test -- tests/layout/hero-left-edge.test.ts
```

Expected: PASS (both tests green).

- [ ] **Step 5: Visual smoke-check in the browser**

```bash
npm run dev
```

Open `/` and verify:

1. Viewport `< 640px`: text column has comfortable left inset (`pl-5` / 20px).
2. Viewport `≥ 640px`: vertical line sits ~16px from the left edge of the screen — clearly left of the Navbar logo/content inset.
3. Navbar still uses its centered `max-w-[1440px]` container.
4. `/works` and `/contact` still use their existing containers.
5. Background photo + overlays remain full-bleed; CTAs and social icons still render correctly.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/HeroSection.tsx tests/layout/hero-left-edge.test.ts
git commit -m "$(cat <<'EOF'
feat: flush hero text column to left viewport edge

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Entire left column breaks out of container | Task 1 |
| `pl-5` mobile / `pl-4` from `sm+` | Task 1 |
| Right padding `pr-5 sm:pr-8` | Task 1 |
| Remove `mx-auto max-w-[1440px]` from Hero wrapper | Task 1 |
| Keep inner `max-w-[760px]` | Task 1 |
| Navbar / other pages unchanged | Task 1 (explicit non-touch + visual check) |
| Background / overlays / typography unchanged | Task 1 (explicit non-touch + visual check) |
