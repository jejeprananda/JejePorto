# Works Page Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add entrance animations on `/works`: hero choreographs on load; Projects / Services / Stack / CTA reveal once on scroll (header first, then staggered items).

**Architecture:** Shared client `Reveal` component (IntersectionObserver + CSS transitions, generalizing the existing `FadeIn` pattern). Extract `WorksHero` as a client island so `works/page.tsx` stays a server page. Section components wrap headers and list items with `Reveal` (`trigger="scroll"`).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner (`tsx --test`) with source-contract tests (no Framer Motion / GSAP)

## Global Constraints

- No new runtime animation libraries
- Do not modify or delete `src/components/projects/FadeIn.tsx`
- Animations play once (disconnect observer after first intersect)
- Hero uses `trigger="mount"`; lower sections use `trigger="scroll"`
- Respect `prefers-reduced-motion` (show final state, no motion)
- Spec source: `docs/superpowers/specs/2026-07-28-works-scroll-animations-design.md`

---

## File structure

| Path | Responsibility |
|---|---|
| `src/components/shared/Reveal.tsx` | Reusable scroll/mount reveal wrapper |
| `src/components/sections/WorksHero.tsx` | Client hero with mount choreography |
| `src/app/works/page.tsx` | Server page: `WorksHero` + sections + CTA reveals |
| `src/components/sections/ProjectsSection.tsx` | Header + project row reveals |
| `src/components/sections/ServicesSection.tsx` | Header + service card reveals |
| `src/components/sections/StackSection.tsx` | Header + stack group reveals |
| `tests/layout/works-reveal.test.ts` | Source-contract tests for Reveal API + wiring |

---

### Task 1: `Reveal` component

**Files:**
- Create: `src/components/shared/Reveal.tsx`
- Create: `tests/layout/works-reveal.test.ts`
- Test: `tests/layout/works-reveal.test.ts`

**Interfaces:**
- Consumes: none
- Produces:

```ts
type RevealDirection = "left" | "right" | "up" | "scaleY";
type RevealTrigger = "mount" | "scroll";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection; // default "up"
  delay?: number; // ms, default 0
  duration?: number; // ms, default 700
  trigger?: RevealTrigger; // default "scroll"
  distance?: "default" | "wide"; // default 24px; wide 48px (hero background)
};

export function Reveal(props: RevealProps): JSX.Element;
```

- [ ] **Step 1: Write the failing Reveal contract test**

Create `tests/layout/works-reveal.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Reveal component", () => {
  it("exists as a client component with mount/scroll triggers and directions", () => {
    const source = read("src/components/shared/Reveal.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function Reveal/);
    assert.match(source, /trigger/);
    assert.match(source, /"mount"/);
    assert.match(source, /"scroll"/);
    assert.match(source, /"left"/);
    assert.match(source, /"right"/);
    assert.match(source, /"up"/);
    assert.match(source, /"scaleY"/);
    assert.match(source, /IntersectionObserver/);
    assert.match(source, /prefers-reduced-motion|motion-reduce/);
    assert.match(source, /threshold:\s*0\.12/);
    assert.match(source, /0px 0px -40px 0px/);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

Expected: FAIL — `src/components/shared/Reveal.tsx` does not exist yet.

- [ ] **Step 3: Implement `Reveal`**

Create `src/components/shared/Reveal.tsx`:

```tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type RevealDirection = "left" | "right" | "up" | "scaleY";
export type RevealTrigger = "mount" | "scroll";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  trigger?: RevealTrigger;
  distance?: "default" | "wide";
};

const HIDDEN: Record<
  RevealDirection,
  Record<"default" | "wide", string>
> = {
  left: {
    default: "-translate-x-6 opacity-0",
    wide: "-translate-x-12 opacity-0",
  },
  right: {
    default: "translate-x-6 opacity-0",
    wide: "translate-x-12 opacity-0",
  },
  up: {
    default: "translate-y-6 opacity-0",
    wide: "translate-y-12 opacity-0",
  },
  scaleY: {
    default: "origin-top scale-y-0",
    wide: "origin-top scale-y-0",
  },
};

const VISIBLE: Record<RevealDirection, string> = {
  left: "translate-x-0 opacity-100",
  right: "translate-x-0 opacity-100",
  up: "translate-y-0 opacity-100",
  scaleY: "origin-top scale-y-100",
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 700,
  trigger = "scroll",
  distance = "default",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    if (trigger === "mount") {
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (delay > 0) {
            window.setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, trigger]);

  const style: CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: trigger === "scroll" && visible ? "0ms" : undefined,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={[
        "transition-[opacity,transform] ease-out",
        "motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-y-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? VISIBLE[direction] : HIDDEN[direction][distance],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
```

Notes for implementer:
- For `trigger="scroll"`, apply `delay` only after intersect (as above), so staggered items wait relative to entering view.
- For `trigger="mount"`, `delay` gates when visibility flips (hero stagger).
- Keep `pointer-events` unaffected (do not set `pointer-events-none` while hidden).

- [ ] **Step 4: Run test and confirm it passes**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/Reveal.tsx tests/layout/works-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: add shared Reveal scroll/mount animation helper

EOF
)"
```

---

### Task 2: `WorksHero` client island + page wiring

**Files:**
- Create: `src/components/sections/WorksHero.tsx`
- Modify: `src/app/works/page.tsx`
- Modify: `tests/layout/works-reveal.test.ts`
- Test: `tests/layout/works-reveal.test.ts`

**Interfaces:**
- Consumes: `Reveal` from `@/components/shared/Reveal`
- Produces: `export function WorksHero(): JSX.Element` — same visual content as the current hero section in `works/page.tsx`, with mount animations

- [ ] **Step 1: Extend the failing wiring test for WorksHero**

Append to `tests/layout/works-reveal.test.ts`:

```ts
describe("WorksHero", () => {
  it("choreographs background, vertical line, and text on mount", () => {
    const source = read("src/components/sections/WorksHero.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function WorksHero/);
    assert.match(source, /from "@/components\/shared\/Reveal"/);
    assert.match(source, /trigger="mount"/);
    assert.match(source, /direction="right"/);
    assert.match(source, /direction="scaleY"/);
    assert.match(source, /direction="left"/);
    assert.match(source, /works-page-title/);
    assert.match(source, /bg-hero\.png/);
  });

  it("works page uses WorksHero and keeps server metadata", () => {
    const page = read("src/app/works/page.tsx");

    assert.match(page, /export const metadata/);
    assert.match(page, /WorksHero/);
    assert.match(page, /from "@/components\/sections\/WorksHero"/);
    assert.doesNotMatch(page, /bg-hero\.png/);
  });
});
```

- [ ] **Step 2: Run test and confirm new cases fail**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

Expected: FAIL — `WorksHero.tsx` missing / page still inlines hero image.

- [ ] **Step 3: Create `WorksHero`**

Create `src/components/sections/WorksHero.tsx` by moving the hero `<section>…</section>` from `works/page.tsx` and wrapping parts with `Reveal`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowDownRight } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";

export function WorksHero() {
  return (
    <section
      aria-labelledby="works-page-title"
      className="relative isolate min-h-[520px] overflow-hidden border-b border-slate-200 bg-slate-50"
    >
      <Reveal
        trigger="mount"
        direction="right"
        distance="wide"
        duration={800}
        className="absolute inset-0 -z-30"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_bottom] sm:object-[68%_bottom] lg:object-bottom"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10 sm:via-white/80 lg:via-white/55 lg:to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/10 to-white/20"
          />
        </div>
      </Reveal>

      <div className="mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36 xl:px-16">
        <div className="flex max-w-3xl gap-5 sm:gap-8">
          <Reveal
            trigger="mount"
            direction="scaleY"
            delay={150}
            duration={700}
            className="relative hidden w-px shrink-0 self-stretch overflow-hidden bg-slate-900 sm:block"
          >
            <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
          </Reveal>

          <div>
            <Reveal trigger="mount" direction="left" delay={200} duration={700}>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-600">
                Portfolio / Works
              </p>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={280} duration={700}>
              <h1
                id="works-page-title"
                className="mt-5 font-serif text-[clamp(4rem,10vw,8rem)] leading-[0.84] tracking-[-0.055em] text-slate-950"
              >
                Selected
                <br />
                Works
              </h1>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={360} duration={700}>
              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                A collection of digital products, websites, applications, and
                AI integrations I have designed and developed.
              </p>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={440} duration={700}>
              <Link
                href="#projects"
                className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-slate-950 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
              >
                Explore projects
                <ArrowDownRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Important layout notes:
- Section keeps `overflow-hidden` so the background slide does not spill.
- Vertical line `Reveal` must keep `self-stretch` / height so `scaleY` has something to grow; do not collapse to zero height.
- Preserve all existing copy, classes, and `id="works-page-title"`.

- [ ] **Step 4: Update `works/page.tsx`**

Replace the inline hero `<section>…</section>` with:

```tsx
import { WorksHero } from "@/components/sections/WorksHero";
```

And in JSX:

```tsx
<main>
  <WorksHero />
  <ProjectsSection projects={projects} />
  {/* …rest unchanged for now… */}
</main>
```

Remove unused `Image`, `ArrowDownRight` imports from the page if no longer referenced (keep `ArrowUpRight` / `Link` for CTA).

Keep `export const metadata` and data fetching unchanged.

- [ ] **Step 5: Run tests**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

Expected: PASS

- [ ] **Step 6: Manual smoke (hero)**

```bash
npm run dev
```

Open `/works`: background slides in from the right; line grows top→bottom; text slides from the left in sequence. No layout jump of the content column.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/WorksHero.tsx src/app/works/page.tsx tests/layout/works-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: animate Works hero on mount with Reveal

EOF
)"
```

---

### Task 3: Animate `ProjectsSection`

**Files:**
- Modify: `src/components/sections/ProjectsSection.tsx`
- Modify: `tests/layout/works-reveal.test.ts`
- Test: `tests/layout/works-reveal.test.ts`

**Interfaces:**
- Consumes: `Reveal` (`trigger="scroll"`, `direction="up"`)
- Produces: header reveal at delay `0`; each project row at `delay={120 + index * 80}`; empty state wrapped once

- [ ] **Step 1: Add failing contract assertions**

Append:

```ts
describe("ProjectsSection reveals", () => {
  it("wraps header and rows with scroll Reveal", () => {
    const source = read("src/components/sections/ProjectsSection.tsx");

    assert.match(source, /from "@/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

- [ ] **Step 3: Wire `Reveal` into `ProjectsSection`**

1. Add import:

```tsx
import { Reveal } from "@/components/shared/Reveal";
```

2. Wrap the existing `<header>…</header>`:

```tsx
<Reveal trigger="scroll" direction="up" duration={700}>
  <header>
    {/* existing header children unchanged */}
  </header>
</Reveal>
```

3. Empty state:

```tsx
<Reveal trigger="scroll" direction="up" delay={120}>
  <p className="border-t border-slate-200 py-8 text-sm text-slate-600">
    No projects available yet.
  </p>
</Reveal>
```

4. Each project `<article>`:

```tsx
<Reveal
  key={project.slug}
  trigger="scroll"
  direction="up"
  delay={120 + index * 80}
  duration={700}
>
  <article className={/* existing classes unchanged */}>
    {/* existing article children unchanged */}
  </article>
</Reveal>
```

Do not change flagship styling, links, or data mapping.

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/layout/works-reveal.test.ts
npm test -- tests/layout/projects-flagship.test.ts
```

Expected: both PASS (flagship contract must remain intact).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProjectsSection.tsx tests/layout/works-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: scroll-reveal project rows on Works page

EOF
)"
```

---

### Task 4: Animate `ServicesSection`

**Files:**
- Modify: `src/components/sections/ServicesSection.tsx`
- Modify: `tests/layout/works-reveal.test.ts`
- Test: `tests/layout/works-reveal.test.ts`

**Interfaces:**
- Consumes: `Reveal`
- Produces: header at delay `0`; each service card at `delay={120 + index * 80}`; empty state wrapped; modal behavior unchanged

- [ ] **Step 1: Add failing contract assertions**

```ts
describe("ServicesSection reveals", () => {
  it("wraps header and cards with scroll Reveal", () => {
    const source = read("src/components/sections/ServicesSection.tsx");

    assert.match(source, /from "@/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
    assert.match(source, /ServiceDetailModal/);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

- [ ] **Step 3: Wire `Reveal` into `ServicesSection`**

Keep `"use client"` and modal state.

1. Import `Reveal`.
2. Wrap the existing `<header className="grid …">` with:

```tsx
<Reveal trigger="scroll" direction="up" duration={700}>
  <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
    {/* unchanged */}
  </header>
</Reveal>
```

3. Empty state inside `Reveal` with `delay={120}`.
4. Wrap each service `<article>`:

```tsx
<Reveal
  key={service.slug}
  trigger="scroll"
  direction="up"
  delay={120 + index * 80}
  duration={700}
>
  <article className={/* existing */}>
    {/* unchanged, including Learn more button */}
  </article>
</Reveal>
```

Leave `ServiceDetailModal` outside the grid, as today.

- [ ] **Step 4: Run test**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ServicesSection.tsx tests/layout/works-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: scroll-reveal service cards on Works page

EOF
)"
```

---

### Task 5: Animate `StackSection` + Works CTA

**Files:**
- Modify: `src/components/sections/StackSection.tsx`
- Modify: `src/app/works/page.tsx`
- Modify: `tests/layout/works-reveal.test.ts`
- Test: `tests/layout/works-reveal.test.ts`

**Interfaces:**
- Consumes: `Reveal`
- Produces:
  - Stack: header delay `0`; groups `delay={120 + index * 80}`; empty state wrapped
  - CTA: copy block `trigger="scroll" direction="up"`; Contact link `delay={100}`

- [ ] **Step 1: Add failing contract assertions**

```ts
describe("StackSection and Works CTA reveals", () => {
  it("wraps stack header and groups with scroll Reveal", () => {
    const source = read("src/components/sections/StackSection.tsx");

    assert.match(source, /from "@/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
  });

  it("reveals CTA copy then contact button", () => {
    const page = read("src/app/works/page.tsx");

    assert.match(page, /from "@/components\/shared\/Reveal"/);
    assert.match(page, /Start a project/);
    assert.match(page, /delay=\{100\}/);
    assert.match(page, /Contact Me/);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- tests/layout/works-reveal.test.ts
```

- [ ] **Step 3: Wire `Reveal` into `StackSection`**

Same pattern as Projects:

```tsx
import { Reveal } from "@/components/shared/Reveal";

// header
<Reveal trigger="scroll" direction="up" duration={700}>
  <header className="grid gap-8 border-b border-slate-200 pb-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
    {/* unchanged */}
  </header>
</Reveal>

// empty
<Reveal trigger="scroll" direction="up" delay={120}>
  <p className="border-b border-slate-200 py-10 text-sm text-slate-600">
    No stack data available yet.
  </p>
</Reveal>

// groups
<Reveal
  key={group.number}
  trigger="scroll"
  direction="up"
  delay={120 + index * 80}
  duration={700}
>
  <article className={/* existing */}>{/* unchanged */}</article>
</Reveal>
```

- [ ] **Step 4: Wire CTA reveals on `works/page.tsx`**

Because `Reveal` is a client component, importing it into the server page is allowed (client boundary at `Reveal`). Update the CTA block:

```tsx
import { Reveal } from "@/components/shared/Reveal";

{/* … */}
<section className="bg-white px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-28">
  <div className="mx-auto w-full max-w-[1280px]">
    <div className="flex flex-col gap-7 border-y border-slate-200 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
      <Reveal trigger="scroll" direction="up" duration={700}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Start a project
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Have something in mind?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Let&apos;s collaborate and build something useful.
          </p>
        </div>
      </Reveal>

      <Reveal trigger="scroll" direction="up" delay={100} duration={700}>
        <Link
          href="/contact"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-slate-950 px-7 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:w-auto"
        >
          Contact Me
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  </div>
</section>
```

Page must remain free of `"use client"` and keep `metadata`.

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: all PASS

- [ ] **Step 6: Manual verification checklist**

1. `/works` load — hero sequence (bg → line → text)
2. Scroll to projects — header, then rows stagger; scroll away and back — no replay
3. Scroll to services — same hybrid pattern; modal still opens
4. Scroll to stack — same
5. Scroll to CTA — copy then button
6. OS reduced-motion enabled — content visible immediately, no slides

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/StackSection.tsx src/app/works/page.tsx tests/layout/works-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: scroll-reveal stack groups and Works CTA

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| `Reveal` with directions + mount/scroll | Task 1 |
| IntersectionObserver once + threshold/rootMargin | Task 1 |
| Reduced motion | Task 1 |
| Hero bg slide right→left on load | Task 2 |
| Vertical line scaleY top→bottom | Task 2 |
| Text slide left→right stagger | Task 2 |
| Server page + WorksHero island | Task 2 |
| Projects hybrid scroll reveal | Task 3 |
| Services hybrid scroll reveal | Task 4 |
| Stack hybrid scroll reveal | Task 5 |
| CTA two-step reveal | Task 5 |
| Leave `FadeIn` alone / no new libs | Global constraints |

## Out of scope (do not implement)

- Migrating `FadeIn` to `Reveal`
- Home / contact / project detail animations
- Scroll-scrubbed / parallax motion
- Replay-on-reenter
