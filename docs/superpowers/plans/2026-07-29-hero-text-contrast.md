# Hero Text Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make white home-hero copy readable over the full-bleed looping video using layered dark `text-shadow` only — no video overlays or scrims.

**Architecture:** Add three named shadow utilities in `globals.css`, then apply them by hierarchy on typography and secondary chrome in `HeroSection.tsx`. Video layer stays untouched. Layout, Reveal choreography, copy, and orange accent on “Prananda” stay unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner via `tsx --test`

## Global Constraints

- Spec source: `docs/superpowers/specs/2026-07-29-hero-text-contrast-design.md`
- Video first: zero overlay / scrim / filter / gradient mask on the video
- No `-webkit-text-stroke`; no `filter: drop-shadow` on the text block
- Shadows are dark only — never a white glow
- Do not change Reveal delays/directions, spacing, CTA structure, or fill colors
- Vertical accent line: leave unchanged in the first pass
- Primary “View My Work” CTA: leave without hero shadow utilities (solid dark button already contrasts)
- Touch only `src/app/globals.css`, `src/components/sections/HeroSection.tsx`, and the new test file(s)

---

## File structure

| Path | Responsibility |
|---|---|
| `src/app/globals.css` | Defines `.hero-shadow-strong`, `.hero-shadow-medium`, `.hero-shadow-soft` |
| `src/components/sections/HeroSection.tsx` | Applies utilities to hero copy / secondary CTA / social icons |
| `tests/layout/hero-text-contrast.test.ts` | Locks CSS utility presence and HeroSection class mapping |

---

### Task 1: Add hero shadow CSS utilities

**Files:**
- Modify: `src/app/globals.css`
- Create: `tests/layout/hero-text-contrast.test.ts`
- Test: `tests/layout/hero-text-contrast.test.ts`

**Interfaces:**
- Consumes: none
- Produces: global classes `.hero-shadow-strong`, `.hero-shadow-medium`, `.hero-shadow-soft` with the approved `text-shadow` recipes

- [ ] **Step 1: Write the failing CSS contract test**

Create `tests/layout/hero-text-contrast.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const globalsSource = readFileSync(
  join(root, "src/app/globals.css"),
  "utf8",
);
const heroSource = readFileSync(
  join(root, "src/components/sections/HeroSection.tsx"),
  "utf8",
);

describe("Hero text contrast utilities", () => {
  it("defines strong, medium, and soft hero text-shadow classes", () => {
    assert.match(globalsSource, /\.hero-shadow-strong\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-medium\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-soft\s*\{/);

    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.55\)/);
    assert.match(globalsSource, /0 4px 18px rgb\(0 0 0 \/ 0\.35\)/);
    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.45\)/);
    assert.match(globalsSource, /0 3px 12px rgb\(0 0 0 \/ 0\.28\)/);
    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.4\)/);
    assert.match(globalsSource, /0 2px 10px rgb\(0 0 0 \/ 0\.22\)/);
  });

  it("does not reintroduce video overlay gradients in HeroSection", () => {
    assert.doesNotMatch(heroSource, /bg-gradient-to-r/);
    assert.doesNotMatch(heroSource, /bg-gradient-to-b/);
    assert.doesNotMatch(heroSource, /from-white/);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm test -- tests/layout/hero-text-contrast.test.ts
```

Expected: FAIL — `globals.css` does not yet define `.hero-shadow-*` classes.

- [ ] **Step 3: Add the utilities to `globals.css`**

Append after the existing `body` rule in `src/app/globals.css`:

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

- [ ] **Step 4: Re-run the test and confirm it passes**

```bash
npm test -- tests/layout/hero-text-contrast.test.ts
```

Expected: PASS — both Task 1 assertions green.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tests/layout/hero-text-contrast.test.ts
git commit -m "$(cat <<'EOF'
feat: add hero text-shadow contrast utilities

EOF
)"
```

---

### Task 2: Wire shadow utilities into HeroSection

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `tests/layout/hero-text-contrast.test.ts`
- Test: `tests/layout/hero-text-contrast.test.ts`

**Interfaces:**
- Consumes: `.hero-shadow-strong`, `.hero-shadow-medium`, `.hero-shadow-soft` from Task 1
- Produces: Hero typography hierarchy uses the correct utility classes; video remains overlay-free

- [ ] **Step 1: Extend the test with HeroSection class mapping**

Append these cases inside `describe("Hero text contrast utilities", …)` in `tests/layout/hero-text-contrast.test.ts`:

```ts
  it("applies shadow utilities by hierarchy on hero copy", () => {
    assert.match(heroSource, /id="hero-title"[\s\S]*?hero-shadow-strong/);
    assert.match(
      heroSource,
      /mt-5 text-2xl font-semibold[\s\S]*?hero-shadow-medium/,
    );
    assert.match(
      heroSource,
      /text-3xl font-light leading-none tracking-\[-0\.035em\][\s\S]*?hero-shadow-soft/,
    );
    assert.match(heroSource, /text-white\/80[\s\S]*?hero-shadow-soft/);
    assert.match(heroSource, /text-orange-500/);
  });

  it("applies soft shadow to secondary CTA and social icons", () => {
    assert.match(
      heroSource,
      /href="\/contact"[\s\S]*?className="[\s\S]*?hero-shadow-soft/,
    );
    assert.match(
      heroSource,
      /aria-label=\{socialLink\.label\}[\s\S]*?className="[\s\S]*?hero-shadow-soft/,
    );
  });
```

- [ ] **Step 2: Run the test and confirm mapping assertions fail**

```bash
npm test -- tests/layout/hero-text-contrast.test.ts
```

Expected: FAIL on the new HeroSection mapping assertions — utilities exist in CSS but are not yet applied in the component.

- [ ] **Step 3: Apply the utilities in `HeroSection.tsx`**

Add the classes to the existing `className` strings (keep all other classes):

1. “Hi, I'm” `<p>` → add `hero-shadow-soft`
2. `h1#hero-title` → add `hero-shadow-strong`
3. “Fullstack Developer” `<p>` → add `hero-shadow-medium`
4. Japanese body `<p>` → add `hero-shadow-soft`
5. English body `<p>` → add `hero-shadow-soft`
6. Contact Me `<Link>` → add `hero-shadow-soft`
7. Social icon `<Link>` → add `hero-shadow-soft`

Do **not** add a hero shadow class to the “View My Work” primary CTA.

Do **not** add any `bg-gradient-*` / overlay `div` under the video.

Example for the title:

```tsx
                <h1
                  id="hero-title"
                  className="
                    mt-4 max-w-[760px]
                    text-[clamp(3.3rem,7.2vw,6rem)]
                    font-semibold leading-[0.88]
                    tracking-[-0.065em]
                    text-white
                    hero-shadow-strong
                  "
                >
```

Example for “Hi, I'm”:

```tsx
                <p
                  className="
                    text-3xl font-light leading-none tracking-[-0.035em]
                    text-white
                    hero-shadow-soft
                    sm:text-4xl
                    lg:text-[2.65rem]
                  "
                >
```

Apply the same pattern for the remaining elements listed above.

- [ ] **Step 4: Run tests and confirm they pass**

```bash
npm test -- tests/layout/hero-text-contrast.test.ts
```

Expected: PASS — all CSS + mapping + no-overlay assertions green.

- [ ] **Step 5: Visual verification**

```bash
npm run dev
```

Open `/`. Watch a full video loop on desktop and a narrow mobile width. Confirm:

- Name + “Hi, I'm” stay readable on bright frames and busy UI frames
- No perceptible scrim / white wash over the video
- Orange “Prananda” accent still visible
- Reveal mount animation unchanged

If contrast is still weak, tune only the opacity/blur values inside the three `.hero-shadow-*` rules in `globals.css` — do not add overlays.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/HeroSection.tsx tests/layout/hero-text-contrast.test.ts
git commit -m "$(cat <<'EOF'
feat: apply hero text shadows for video contrast

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Video full-bleed, no overlay/scrim/mask | Task 2 (explicit non-change + test) |
| Named utilities in `globals.css` | Task 1 |
| Strong / medium / soft hierarchy | Task 2 |
| Orange “Prananda” unchanged | Task 2 |
| Vertical line leave unchanged | Global constraint / Task 2 non-change |
| Tune shadows only if still failing | Task 2 Step 5 |
| No layout / motion regressions | Global constraint + visual check |
