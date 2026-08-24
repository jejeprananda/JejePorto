# Hallmark Spec Sheet Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's visual layer as a Hallmark Spec Sheet — technical, minimal, full-screen hero video with a calm pin/fade — across home, case studies, contact, and CV.

**Architecture:** Lock CSS tokens first, then restyle chrome (nav, footer), replace the wheel-hijack scroll-expand hero with a sticky video chapter, restyle homepage sections as a static document, then apply the same language to inner pages. Data getters, routes, Netlify forms, and video assets stay untouched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner (`tsx --test`) source-contract tests.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-24-hallmark-spec-sheet-redesign-design.md`
- Accent lock: muted teal `#2A6B6B` as `--accent`. Do not reuse orange as the primary accent.
- Paper `#F7F7F5`, ink `#111111`. All new colors/fonts must use named tokens (`bg-paper`, `text-ink`, `text-accent`, `font-sans`, `font-mono`).
- Drop Instrument Serif from headings. Display + body = Geist Sans. Metadata = Geist Mono.
- No italic headings. No fake browser/IDE/terminal chrome. No invented metrics.
- No wheel `preventDefault` after the hero chapter. Prefer `position: sticky` + passive scroll.
- Homepage sections below the hero are static (no `Reveal` scroll stagger).
- Do not change SQLite seed, getters, `getCvData`, Netlify form `action`, or video files.
- Do not delete routes. Delete unused hero files only after zero production imports (Task 7).
- Respect `prefers-reduced-motion`: skip pin motion, show the post-hero state.
- Verify mobile: no horizontal scroll; `overflow-x: clip` on `html` and `body`.

---

## File structure

| Path | Responsibility |
|---|---|
| `src/app/globals.css` | Hallmark tokens, paper/ink/accent, print rules |
| `src/app/layout.tsx` | Geist Sans + Mono only; paper body; site footer |
| `src/components/layout/Navbar.tsx` | Edge-min nav; no glass pill; Works → `/#projects` |
| `src/components/layout/SiteFooter.tsx` | Inline single-line footer |
| `src/components/sections/HeroVideoChapter.tsx` | Sticky full-screen video chapter + children |
| `src/components/sections/IdentityStrip.tsx` | Name, role, one-line statement |
| `src/components/shared/CloseCta.tsx` | Shared close block: Contact + Download CV |
| `src/app/page.tsx` | Server homepage composition |
| `src/components/sections/ProjectsSection.tsx` | Work index rows |
| `src/components/sections/ServicesSection.tsx` | Definition-list services + modal |
| `src/components/sections/StackSection.tsx` | Dependency-style stack groups |
| `src/components/projects/*` | Case-study document restyle |
| `src/components/sections/ContactSection.tsx` | Two-column contact |
| `src/components/cv/CvDocument.tsx` + `CvToolbar.tsx` | Print-spec CV |
| `src/app/not-found.tsx` | Spec-sheet 404 |
| `tests/layout/spec-sheet-tokens.test.ts` | Token + font contracts |
| `tests/layout/home-hero-reveal.test.ts` | Rewritten for HeroVideoChapter |
| `tests/layout/hero-text-contrast.test.ts` | Rewritten for video chapter overlay |
| `tests/layout/hero-left-edge.test.ts` | Rewritten / retired into hero tests |
| `tests/layout/works-reveal.test.ts` | Homepage no longer requires Reveal wiring |

**Delete only in Task 7, after confirming zero imports:**

- `src/components/ui/scroll-expansion-hero.tsx`
- `src/components/sections/HomeScrollExpand.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/WorksHero.tsx`

---

### Task 1: Design tokens and drop serif

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `tests/layout/spec-sheet-tokens.test.ts`

**Interfaces:**
- Consumes: none
- Produces: CSS tokens `--paper`, `--ink`, `--ink-muted`, `--accent`, `--rule` mapped to Tailwind `paper`, `ink`, `ink-muted`, `accent`, `rule`. `--font-serif` removed. Layout loads Geist Sans + Geist Mono only.

- [ ] **Step 1: Write the failing token contract test**

Create `tests/layout/spec-sheet-tokens.test.ts`:

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

describe("Spec sheet tokens", () => {
  it("locks paper, ink, and teal accent in globals.css", () => {
    const css = read("src/app/globals.css");

    assert.match(css, /--paper:\s*#f7f7f5/i);
    assert.match(css, /--ink:\s*#111111/i);
    assert.match(css, /--accent:\s*#2a6b6b/i);
    assert.match(css, /--color-paper:\s*var\(--paper\)/);
    assert.match(css, /--color-accent:\s*var\(--accent\)/);
    assert.match(css, /overflow-x:\s*clip/);
    assert.doesNotMatch(css, /--font-serif/);
    assert.doesNotMatch(css, /instrument-serif/);
    assert.doesNotMatch(css, /#ff8a00|#f97316|orange-600/i);
  });

  it("loads Geist Sans and Mono only in root layout", () => {
    const layout = read("src/app/layout.tsx");

    assert.match(layout, /Geist,/);
    assert.match(layout, /Geist_Mono/);
    assert.match(layout, /bg-paper/);
    assert.match(layout, /text-ink/);
    assert.doesNotMatch(layout, /Instrument_Serif/);
    assert.doesNotMatch(layout, /instrumentSerif/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/layout/spec-sheet-tokens.test.ts`

Expected: FAIL — tokens and `bg-paper` not present; `Instrument_Serif` still in layout.

- [ ] **Step 3: Write tokens and update layout**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

/* Hallmark · pre-emit critique: P4 H4 E4 S4 R5 V4
 * macrostructure: Long Document / Index-First hybrid
 * theme: custom spec-sheet
 */

:root {
  --paper: #f7f7f5;
  --ink: #111111;
  --ink-muted: #5c5c57;
  --accent: #2a6b6b;
  --rule: #e2e1dc;
}

@theme inline {
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-accent: var(--accent);
  --color-rule: var(--rule);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html,
body {
  overflow-x: clip;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  body > header,
  body > footer {
    display: none !important;
  }

  html,
  body {
    background: #ffffff !important;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jessy Prananda",
    template: "%s | Jessy Prananda",
  },
  description:
    "Portfolio of Jessy Prananda, a Fullstack Designer who designs and builds modern digital products.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/layout/spec-sheet-tokens.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx tests/layout/spec-sheet-tokens.test.ts
git commit -m "Add spec-sheet design tokens and drop serif font"
```

---

### Task 2: Edge-min navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `tests/layout/spec-sheet-tokens.test.ts` (append nav contract)

**Interfaces:**
- Consumes: tokens from Task 1 (`text-accent`, `text-ink`, `bg-paper`)
- Produces: `export function Navbar(): JSX.Element` — wordmark `JP.` + text links About `/`, Works `/#projects`, Contact `/contact`. No `rounded-full`, no `backdrop-blur-md` pill, no orange.

- [ ] **Step 1: Write the failing nav contract**

Append to `tests/layout/spec-sheet-tokens.test.ts`:

```ts
describe("Navbar edge-min", () => {
  it("uses text links without a glass pill", () => {
    const nav = read("src/components/layout/Navbar.tsx");

    assert.match(nav, /href: "\/#projects"/);
    assert.match(nav, /text-accent/);
    assert.doesNotMatch(nav, /lg:rounded-full/);
    assert.doesNotMatch(nav, /backdrop-blur-md/);
    assert.doesNotMatch(nav, /lg:shadow-\[0_8px_32px/);
    assert.doesNotMatch(nav, /orange-/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/layout/spec-sheet-tokens.test.ts`

Expected: FAIL — pill classes and orange still present; Works href is still `/`.

- [ ] **Step 3: Implement edge-min Navbar**

Replace `src/components/layout/Navbar.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";

const navigationItems = [
  { label: "About", href: "/" },
  { label: "Works", href: "/#projects" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setIsOverVideo(false);
      return;
    }

    function handleScroll() {
      setIsOverVideo(window.scrollY < window.innerHeight * 0.85);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const lightOnDark = isOverVideo && !isMenuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Go to homepage"
          onClick={closeMenu}
          className={[
            "relative z-50 text-xl font-semibold tracking-[-0.06em]",
            lightOnDark ? "text-white" : "text-ink",
          ].join(" ")}
        >
          JP<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={[
                    "text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    lightOnDark
                      ? "text-white/90 hover:text-white focus-visible:ring-offset-transparent"
                      : "text-ink hover:text-accent focus-visible:ring-offset-paper",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((value) => !value)}
          className={[
            "relative z-50 inline-flex size-11 items-center justify-center border lg:hidden",
            lightOnDark
              ? "border-white/30 text-white"
              : "border-rule bg-paper text-ink",
          ].join(" ")}
        >
          {isMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-40 bg-paper px-5 pb-8 pt-24 transition-all duration-300 lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        ].join(" ")}
      >
        <ul>
          {navigationItems.map((item) => (
            <li key={item.label} className="border-b border-rule">
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-16 items-center text-2xl font-medium tracking-tight text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx tsx --test tests/layout/spec-sheet-tokens.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx tests/layout/spec-sheet-tokens.test.ts
git commit -m "Restyle navbar to edge-min spec-sheet chrome"
```

---

### Task 3: Hero video chapter

**Files:**
- Create: `src/components/sections/HeroVideoChapter.tsx`
- Modify: `src/app/page.tsx` (swap `HomeScrollExpand` for `HeroVideoChapter`; keep children for now)
- Rewrite: `tests/layout/home-hero-reveal.test.ts`
- Rewrite: `tests/layout/hero-text-contrast.test.ts`
- Rewrite: `tests/layout/hero-left-edge.test.ts`

**Interfaces:**
- Consumes: `/videos/hero.mp4`, `/images/hero-poster.jpg`
- Produces:

```ts
type HeroVideoChapterProps = { children: React.ReactNode };
export function HeroVideoChapter(props: HeroVideoChapterProps): JSX.Element;
```

Behavior: sticky `100svh` video inside a taller chapter (`180vh`). Passive scroll progress dims the video and fades the overlay. No `preventDefault` on wheel. Overlay: name `Jessy Prananda`, role `Fullstack Developer`, hint `Scroll`. `prefers-reduced-motion`: `progress = 1` immediately (content visible, overlay gone). Do not use `hero-bg.mp4` (one video only).

- [ ] **Step 1: Rewrite failing hero tests**

Replace `tests/layout/home-hero-reveal.test.ts`:

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

describe("HeroVideoChapter", () => {
  it("pins a full-screen local video without scroll-expand chrome", () => {
    const source = read("src/components/sections/HeroVideoChapter.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function HeroVideoChapter/);
    assert.match(source, /\/videos\/hero\.mp4/);
    assert.match(source, /\/images\/hero-poster\.jpg/);
    assert.match(source, /sticky/);
    assert.match(source, /prefers-reduced-motion/);
    assert.match(source, /Jessy Prananda/);
    assert.match(source, /Fullstack Developer/);
    assert.match(source, /Scroll/);
    assert.doesNotMatch(source, /preventDefault/);
    assert.doesNotMatch(source, /premium-hero-card/);
    assert.doesNotMatch(source, /hero-bg\.mp4/);
    assert.doesNotMatch(source, /orange-/);
  });
});

describe("Home page boundary", () => {
  it("keeps server metadata and composes the video chapter with works sections", () => {
    const page = read("src/app/page.tsx");

    assert.match(page, /export const metadata/);
    assert.doesNotMatch(page, /"use client"/);
    assert.match(page, /absolute:\s*"Jessy Prananda Ismail"/);
    assert.match(page, /HeroVideoChapter/);
    assert.match(page, /ProjectsSection/);
    assert.match(page, /ServicesSection/);
    assert.match(page, /StackSection/);
    assert.doesNotMatch(page, /HomeScrollExpand/);
  });
});
```

Replace `tests/layout/hero-text-contrast.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const source = readFileSync(
  join(root, "src/components/sections/HeroVideoChapter.tsx"),
  "utf8",
);

describe("HeroVideoChapter overlay", () => {
  it("uses a dimming ink overlay instead of a glass card", () => {
    assert.match(source, /bg-ink/);
    assert.match(source, /text-white/);
    assert.doesNotMatch(source, /premium-hero-card/);
    assert.doesNotMatch(source, /blur\(24px\)/);
    assert.doesNotMatch(source, /from-\[#ff8a00\]/);
    assert.doesNotMatch(source, /profile-big\.png/);
  });
});
```

Replace `tests/layout/hero-left-edge.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const source = readFileSync(
  join(root, "src/components/sections/HeroVideoChapter.tsx"),
  "utf8",
);

describe("HeroVideoChapter layout", () => {
  it("fills the viewport and left-aligns overlay copy", () => {
    assert.match(source, /h-svh|h-dvh|h-screen/);
    assert.match(source, /object-cover/);
    assert.match(source, /px-5/);
    assert.doesNotMatch(source, /top-1\/2/);
    assert.doesNotMatch(source, /translate\(-50%, -50%\)/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test tests/layout/home-hero-reveal.test.ts tests/layout/hero-text-contrast.test.ts tests/layout/hero-left-edge.test.ts`

Expected: FAIL — `HeroVideoChapter.tsx` missing.

- [ ] **Step 3: Implement HeroVideoChapter and wire the homepage**

Create `src/components/sections/HeroVideoChapter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HeroVideoChapterProps = {
  children: ReactNode;
};

export function HeroVideoChapter({ children }: HeroVideoChapterProps) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    function onChange() {
      setReduceMotion(media.matches);
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    function onScroll() {
      const el = chapterRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      setProgress(total > 0 ? scrolled / total : 1);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const dim = 0.18 + progress * 0.5;
  const translate = progress * 28;
  const overlayOpacity = Math.max(1 - progress * 1.35, 0);

  return (
    <div>
      <div ref={chapterRef} className="relative h-[180vh]">
        <div className="sticky top-0 h-svh overflow-hidden bg-ink">
          <video
            src="/videos/hero.mp4"
            poster="/images/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center"
            style={{ transform: `translate3d(0, ${-translate}px, 0)` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink"
            style={{ opacity: dim }}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 sm:px-8 lg:px-12"
            style={{ opacity: overlayOpacity }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
              Fullstack Developer
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white [overflow-wrap:anywhere] sm:text-6xl">
              Jessy Prananda
            </h1>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-white/70">
              Scroll
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
```

In `src/app/page.tsx`:
- Replace `HomeScrollExpand` import with `HeroVideoChapter`.
- Replace `<HomeScrollExpand>` / `</HomeScrollExpand>` with `<HeroVideoChapter>` / `</HeroVideoChapter>`.
- Remove the `Reveal` import and the `<noscript>` `[data-reveal]` block (homepage will not use Reveal after Task 4; remove noscript now so the home-page boundary test can pass, and finish CTA restyle in Task 4).
- Temporarily keep the existing CTA markup inside the chapter so the page still compiles. Task 4 replaces it.

If removing noscript in this task causes the old `works-reveal` CTA test to still pass (it only checks `Reveal` + `Start a project`), leave CTA Reveals until Task 4.

Minimum `page.tsx` change this task:

```tsx
import { HeroVideoChapter } from "@/components/sections/HeroVideoChapter";
```

and wrap children with `<HeroVideoChapter>` instead of `<HomeScrollExpand>`. Keep `Reveal` on the CTA until Task 4 so `works-reveal.test.ts` still passes.

- [ ] **Step 4: Run hero tests**

Run: `npx tsx --test tests/layout/home-hero-reveal.test.ts tests/layout/hero-text-contrast.test.ts tests/layout/hero-left-edge.test.ts`

Expected: PASS. The home page may still import `Reveal` until Task 4; do not assert its absence yet.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroVideoChapter.tsx src/app/page.tsx tests/layout/home-hero-reveal.test.ts tests/layout/hero-text-contrast.test.ts tests/layout/hero-left-edge.test.ts
git commit -m "Replace scroll-expand hero with sticky video chapter"
```

---

### Task 4: Homepage document body

**Files:**
- Create: `src/components/sections/IdentityStrip.tsx`
- Create: `src/components/shared/CloseCta.tsx`
- Modify: `src/components/sections/ProjectsSection.tsx`
- Modify: `src/components/sections/ServicesSection.tsx`
- Modify: `src/components/sections/StackSection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `tests/layout/home-hero-reveal.test.ts` (add Reveal `doesNotMatch`)
- Modify: `tests/layout/works-reveal.test.ts` (homepage sections no longer wrap Reveal)
- Keep passing: `tests/layout/projects-flagship.test.ts`

**Interfaces:**
- Consumes: `Project[]`, `Service[]`, `StackGroup[]` (unchanged types)
- Produces:

```ts
export function IdentityStrip(): JSX.Element;
export function CloseCta(): JSX.Element;
export function ProjectsSection(props: { projects: Project[] }): JSX.Element;
export function ServicesSection(props: { services: Service[] }): JSX.Element;
export function StackSection(props: { groups: StackGroup[] }): JSX.Element;
```

- [ ] **Step 1: Write failing homepage contracts**

Update `tests/layout/works-reveal.test.ts` — replace the Projects/Services/Stack/CTA reveal tests with:

```ts
describe("Homepage sections are static", () => {
  it("does not wrap project rows in Reveal", () => {
    const source = read("src/components/sections/ProjectsSection.tsx");
    assert.doesNotMatch(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /id="projects"/);
    assert.match(source, /\bisFlagship\b/);
  });

  it("renders services as a definition list and keeps the modal", () => {
    const source = read("src/components/sections/ServicesSection.tsx");
    assert.doesNotMatch(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /ServiceDetailModal/);
    assert.match(source, /<dl/);
    assert.doesNotMatch(source, /min-h-\[360px\]/);
  });

  it("renders stack groups without Reveal", () => {
    const source = read("src/components/sections/StackSection.tsx");
    assert.doesNotMatch(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /id="stack"/);
  });

  it("uses CloseCta on home without Reveal", () => {
    const page = read("src/app/page.tsx");
    assert.match(page, /CloseCta/);
    assert.match(page, /IdentityStrip/);
    assert.doesNotMatch(page, /from "@\/components\/shared\/Reveal"/);
    assert.doesNotMatch(page, /Start a project/);
  });
});
```

Keep the existing `Reveal component` and `Works page redirect` describes unchanged.

Append to `tests/layout/home-hero-reveal.test.ts` Home page boundary:

```ts
assert.match(page, /IdentityStrip/);
assert.match(page, /CloseCta/);
assert.doesNotMatch(page, /from "@\/components\/shared\/Reveal"/);
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx tsx --test tests/layout/works-reveal.test.ts tests/layout/home-hero-reveal.test.ts tests/layout/projects-flagship.test.ts`

Expected: FAIL on new static-section assertions.

- [ ] **Step 3: Implement homepage sections**

Create `src/components/sections/IdentityStrip.tsx`:

```tsx
export function IdentityStrip() {
  return (
    <section className="border-b border-rule bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Fullstack Developer
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-ink [overflow-wrap:anywhere] sm:text-5xl">
          Jessy Prananda Ismail
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted">
          I design and build digital systems for real products.
        </p>
      </div>
    </section>
  );
}
```

Create `src/components/shared/CloseCta.tsx`:

```tsx
import Link from "next/link";

export function CloseCta() {
  return (
    <section className="bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 border-y border-rule py-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Next
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
            Have something in mind?
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Let&apos;s collaborate and build something useful.
          </p>
          <p className="mt-5 font-mono text-sm text-ink">
            Need CV of mine? Get here.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Link
            href="/contact"
            className="inline-flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-7 text-sm font-medium text-paper transition hover:bg-accent hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper lg:w-auto"
          >
            Contact Me
          </Link>
          <Link
            href="/cv"
            className="inline-flex min-h-12 w-full items-center justify-center border border-rule bg-paper px-7 font-mono text-sm font-medium text-ink transition hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper lg:w-auto"
          >
            Download CV
          </Link>
        </div>
      </div>
    </section>
  );
}
```

Replace `src/components/sections/ProjectsSection.tsx`:

```tsx
import Link from "next/link";

import type { Project } from "@/types/project";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Selected projects
          </p>
          <h2
            id="projects-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
          >
            Work
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
            Websites and applications designed to solve real problems.
          </p>
        </header>

        <div className="mt-12 border-t border-rule">
          {projects.length === 0 ? (
            <p className="py-8 text-sm text-ink-muted">
              No projects available yet.
            </p>
          ) : (
            projects.map((project) => (
              <article
                key={project.slug}
                className="grid gap-3 border-b border-rule py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
              >
                <p className="font-mono text-xs text-ink-muted">
                  {project.year}
                </p>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                      <Link
                        href={`/works/${project.slug}`}
                        className="transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    {project.isFlagship ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                        Flagship
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {project.shortDescription}
                  </p>
                  <p className="mt-2 font-mono text-xs text-ink-muted">
                    {project.category}
                  </p>
                </div>
                <Link
                  href={`/works/${project.slug}`}
                  className="font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline"
                >
                  Open
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

Replace `src/components/sections/ServicesSection.tsx` body with a definition list. Keep `"use client"`, `useState`, and `ServiceDetailModal`. Remove icon map and Lucide icons.

```tsx
"use client";

import { useState } from "react";

import { ServiceDetailModal } from "@/components/shared/ServiceDetailModal";
import type { Service } from "@/types/service";

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <>
      <section
        id="services"
        aria-labelledby="services-title"
        className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <header className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              What I build
            </p>
            <h2
              id="services-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
            >
              Services
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
              Practical products across platforms, focused on real user needs.
            </p>
          </header>

          {services.length === 0 ? (
            <p className="mt-12 border-y border-rule py-10 text-sm text-ink-muted">
              No services available yet.
            </p>
          ) : (
            <dl className="mt-12 border-t border-rule">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="grid gap-3 border-b border-rule py-6 lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:items-baseline"
                >
                  <dt className="text-lg font-semibold tracking-[-0.03em] text-ink">
                    {service.title}
                  </dt>
                  <dd className="text-sm leading-6 text-ink-muted">
                    {service.shortDescription}
                  </dd>
                  <button
                    type="button"
                    onClick={() => setActiveService(service)}
                    className="justify-self-start font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Learn more
                  </button>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
```

Replace `src/components/sections/StackSection.tsx`:

```tsx
import type { StackGroup } from "@/types/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

export function StackSection({ groups }: StackSectionProps) {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Tech stack
          </p>
          <h2
            id="stack-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
          >
            Technologies I use
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
            Frontend, backend, database, design, testing, and deployment.
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="mt-12 border-y border-rule py-10 text-sm text-ink-muted">
            No stack data available yet.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 border-t border-rule pt-10 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group) => (
              <article key={group.number}>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {group.title}
                </h3>
                <ul className="mt-4">
                  {group.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="border-t border-rule py-2.5 text-sm text-ink"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

Replace the homepage inner composition in `src/app/page.tsx` with:

```tsx
      <HeroVideoChapter>
        <IdentityStrip />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <StackSection groups={stackGroups} />
        <CloseCta />
      </HeroVideoChapter>
```

Imports:

```tsx
import { HeroVideoChapter } from "@/components/sections/HeroVideoChapter";
import { IdentityStrip } from "@/components/sections/IdentityStrip";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StackSection } from "@/components/sections/StackSection";
import { CloseCta } from "@/components/shared/CloseCta";
```

Remove `Link`, `ArrowUpRight`, `Reveal`, and the inline CTA section.

Update `ServiceDetailModal` orange classes to `text-accent` / `ring-accent` / `border-rule` (same file, small class swap so the modal matches).

- [ ] **Step 4: Run tests**

Run: `npx tsx --test tests/layout/works-reveal.test.ts tests/layout/home-hero-reveal.test.ts tests/layout/projects-flagship.test.ts tests/layout/spec-sheet-tokens.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/sections/IdentityStrip.tsx src/components/sections/ProjectsSection.tsx src/components/sections/ServicesSection.tsx src/components/sections/StackSection.tsx src/components/shared/CloseCta.tsx src/components/shared/ServiceDetailModal.tsx tests/layout/works-reveal.test.ts tests/layout/home-hero-reveal.test.ts
git commit -m "Restyle homepage as a static spec-sheet document"
```

---

### Task 5: Case study document restyle

**Files:**
- Modify: `src/components/projects/SectionShell.tsx`
- Modify: `src/components/projects/Hero.tsx`
- Modify: `src/components/projects/Overview.tsx`
- Modify: `src/components/projects/Challenges.tsx`
- Modify: `src/components/projects/Features.tsx`
- Modify: `src/components/projects/Stack.tsx`
- Modify: `src/components/projects/Results.tsx`
- Modify: `src/components/projects/Gallery.tsx`
- Modify: `src/components/projects/Timeline.tsx`
- Modify: `src/components/projects/InfoGrid.tsx`
- Modify: `src/components/projects/FooterCTA.tsx`
- Modify: `src/components/projects/RelatedProjects.tsx`
- Create: `tests/layout/case-study-spec-sheet.test.ts`

**Interfaces:**
- Consumes: existing `ProjectDetail` props (unchanged)
- Produces: same component exports; visual classes use tokens; `FooterCTA` renders `<CloseCta />` plus a typographic "View more projects" link to `/#projects`.

- [ ] **Step 1: Write failing case-study contract**

Create `tests/layout/case-study-spec-sheet.test.ts`:

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

const files = [
  "src/components/projects/Hero.tsx",
  "src/components/projects/Overview.tsx",
  "src/components/projects/Challenges.tsx",
  "src/components/projects/Features.tsx",
  "src/components/projects/Stack.tsx",
  "src/components/projects/Results.tsx",
  "src/components/projects/Gallery.tsx",
  "src/components/projects/Timeline.tsx",
  "src/components/projects/InfoGrid.tsx",
  "src/components/projects/FooterCTA.tsx",
  "src/components/projects/RelatedProjects.tsx",
  "src/components/projects/SectionShell.tsx",
];

describe("Case study spec sheet", () => {
  it("drops serif, orange, and card chrome", () => {
    for (const file of files) {
      const source = read(file);
      assert.doesNotMatch(source, /font-serif/, file);
      assert.doesNotMatch(source, /orange-/, file);
      assert.doesNotMatch(source, /rounded-xl/, file);
    }
  });

  it("reuses CloseCta at the end of a case study", () => {
    const footer = read("src/components/projects/FooterCTA.tsx");
    assert.match(footer, /CloseCta/);
    assert.match(footer, /\/#projects/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/layout/case-study-spec-sheet.test.ts`

Expected: FAIL — `font-serif` / `orange-` / `rounded-xl` still present.

- [ ] **Step 3: Restyle case-study components**

`SectionShell.tsx`: change `bg-white` / `bg-slate-50` to `bg-paper`. Keep `FadeIn`.

`Hero.tsx` class rules:
- Section: `bg-paper`, no gradient.
- Title: `mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-[-0.04em] text-ink` (no `font-serif`).
- Meta dt: `font-mono text-xs uppercase tracking-[0.14em] text-ink-muted`.
- Links: `hover:text-accent`, `focus-visible:ring-accent`.
- Primary button: `border border-ink bg-ink text-paper` (no `rounded-xl`, no orange hover).
- Secondary buttons: `border border-rule bg-paper text-ink`.
- Icon tile: square, `border border-rule`, no `rounded-[2rem]`.
- "Back to Works" href: `/#projects` (not `/works`, which redirects home without hash).

Every `h2` currently `font-serif text-4xl ... text-slate-950` becomes:

```tsx
className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl"
```

Eyebrows currently `text-orange-600` become `font-mono text-xs uppercase tracking-[0.2em] text-accent`.

`Features.tsx` cards: drop `rounded-xl border ... shadow-sm hover:-translate-y-0.5`. Use `border-t border-rule py-6`.

`Stack.tsx` chips: drop `rounded-full` / orange hover. Use `font-mono text-sm text-ink`.

`Timeline.tsx`: dot `bg-accent` instead of `bg-orange-500`.

`RelatedProjects.tsx`: drop card hover lift; hairline rows like the work index.

`FooterCTA.tsx` full replacement:

```tsx
import Link from "next/link";

import { CloseCta } from "@/components/shared/CloseCta";

export function FooterCTA() {
  return (
    <div>
      <CloseCta />
      <div className="bg-paper px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Link
            href="/#projects"
            className="font-mono text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            View more projects
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx tsx --test tests/layout/case-study-spec-sheet.test.ts tests/db/getters.test.ts`

Expected: PASS (getters unchanged)

- [ ] **Step 5: Commit**

```bash
git add src/components/projects tests/layout/case-study-spec-sheet.test.ts
git commit -m "Restyle case studies to match spec-sheet document"
```

---

### Task 6: Contact, CV, 404, footer

**Files:**
- Create: `src/components/layout/SiteFooter.tsx`
- Modify: `src/app/layout.tsx` (mount footer)
- Modify: `src/components/sections/ContactSection.tsx`
- Modify: `src/components/shared/ContactForm.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/components/cv/CvToolbar.tsx`
- Modify: `src/components/cv/CvDocument.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `tests/layout/contact-netlify.test.ts` (keep Netlify assertions; add no-orange if needed)
- Create: `tests/layout/chrome-spec-sheet.test.ts`

**Interfaces:**
- Consumes: existing `contactConfig`, `CvData`
- Produces: `export function SiteFooter(): JSX.Element` — inline: `Jessy Prananda` · Contact · CV · year. Netlify `form-name` / `__forms.html` unchanged.

- [ ] **Step 1: Write failing chrome tests**

Create `tests/layout/chrome-spec-sheet.test.ts`:

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

describe("Site chrome", () => {
  it("mounts an inline footer from the root layout", () => {
    const layout = read("src/app/layout.tsx");
    const footer = read("src/components/layout/SiteFooter.tsx");

    assert.match(layout, /SiteFooter/);
    assert.match(footer, /Jessy Prananda/);
    assert.match(footer, /href="\/contact"/);
    assert.match(footer, /href="\/cv"/);
    assert.doesNotMatch(footer, /orange-/);
  });

  it("styles contact as a two-column spec sheet without orange", () => {
    const section = read("src/components/sections/ContactSection.tsx");
    const form = read("src/components/shared/ContactForm.tsx");
    assert.doesNotMatch(section, /orange-/);
    assert.doesNotMatch(form, /orange-/);
    assert.match(form, /ring-accent/);
  });

  it("keeps CV toolbar print download without orange", () => {
    const toolbar = read("src/components/cv/CvToolbar.tsx");
    const doc = read("src/components/cv/CvDocument.tsx");
    assert.match(toolbar, /window\.print/);
    assert.doesNotMatch(toolbar, /orange-/);
    assert.doesNotMatch(doc, /font-serif/);
    assert.doesNotMatch(doc, /orange-/);
  });

  it("styles 404 with tokens", () => {
    const page = read("src/app/not-found.tsx");
    assert.match(page, /text-accent/);
    assert.doesNotMatch(page, /orange-/);
    assert.doesNotMatch(page, /rounded-full/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/layout/chrome-spec-sheet.test.ts tests/layout/contact-netlify.test.ts`

Expected: FAIL — footer missing; orange still in contact/CV/404.

- [ ] **Step 3: Implement chrome**

Create `src/components/layout/SiteFooter.tsx`:

```tsx
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-muted">
        <span className="text-ink">Jessy Prananda</span>
        <Link href="/contact" className="hover:text-accent">
          Contact
        </Link>
        <Link href="/cv" className="hover:text-accent">
          CV
        </Link>
        <span>{year}</span>
      </div>
    </footer>
  );
}
```

Mount after `{children}` in `src/app/layout.tsx`:

```tsx
        <Navbar />
        {children}
        <SiteFooter />
```

Contact page wrapper: `main` class `bg-paper pt-24`.

`ContactSection.tsx` / `ContactForm.tsx`: replace `text-orange-600` / `focus:border-orange-500` / `ring-orange-500` with `text-accent` / `border-ink` / `ring-accent`. Two-column grid `lg:grid-cols-[minmax(0,1fr)_20rem]`. Submit button: outlined `border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper` (not a large orange block).

`CvToolbar.tsx`: outlined back link; download button `bg-ink text-paper hover:bg-accent`; `ring-accent`.

`CvDocument.tsx`:
- Remove `rounded-2xl shadow-xl`; use `border border-rule bg-white`.
- Header `bg-ink`; initials square `bg-accent` (not circle orange).
- Name heading: `text-3xl font-semibold tracking-[-0.04em]` (no serif).
- Headline: `font-mono text-xs uppercase tracking-[0.18em] text-white/70`.
- Sidebar headings: `font-mono text-[11px] uppercase tracking-[0.18em] text-accent`.
- Links: `hover:text-accent`.
- Dots: `bg-accent`.

`not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center px-5 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        Page not found
      </h1>
      <p className="mt-4 text-base text-ink-muted">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 w-fit items-center justify-center border border-ink px-6 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
      >
        Back home
      </Link>
    </main>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx tsx --test tests/layout/chrome-spec-sheet.test.ts tests/layout/contact-netlify.test.ts tests/db/getters.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/contact/page.tsx src/app/not-found.tsx src/components/layout/SiteFooter.tsx src/components/sections/ContactSection.tsx src/components/shared/ContactForm.tsx src/components/cv tests/layout/chrome-spec-sheet.test.ts tests/layout/contact-netlify.test.ts
git commit -m "Restyle contact, CV, 404, and add inline footer"
```

---

### Task 7: Remove unused hero files and leftover orange/serif

**Files:**
- Delete (only after grep shows zero `src/` imports): `src/components/ui/scroll-expansion-hero.tsx`, `src/components/sections/HomeScrollExpand.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/WorksHero.tsx`
- Sweep remaining `orange-` / `font-serif` under `src/`
- Test: `tests/layout/spec-sheet-tokens.test.ts` (append leftover scan)

**Interfaces:**
- Consumes: Task 3+ homepage no longer imports `HomeScrollExpand`
- Produces: unused scroll-expand / old heroes gone; `src/` free of `orange-` and `font-serif`

- [ ] **Step 1: Write leftover scan test**

Append to `tests/layout/spec-sheet-tokens.test.ts`:

```ts
import { readdirSync } from "node:fs";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    if (/\.(tsx|ts|css)$/.test(entry.name)) return [path];
    return [];
  });
}

describe("Leftover visual language", () => {
  it("has no orange or serif classes under src/", () => {
    const files = walk(join(root, "src"));
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      assert.doesNotMatch(source, /orange-/, file);
      assert.doesNotMatch(source, /font-serif/, file);
    }
  });

  it("does not keep unused expand-hero files", () => {
    const files = walk(join(root, "src"));
    const rel = files.map((file) => file.slice(join(root, "src").length));
    assert.equal(
      rel.some((file) => file.includes("scroll-expansion-hero")),
      false,
    );
    assert.equal(rel.some((file) => file.includes("HomeScrollExpand")), false);
    assert.equal(rel.some((file) => file.includes("HeroSection")), false);
    assert.equal(rel.some((file) => file.includes("WorksHero")), false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/layout/spec-sheet-tokens.test.ts`

Expected: FAIL — old files and leftover orange still exist.

- [ ] **Step 3: Grep, delete, and sweep**

```bash
rg -n "HomeScrollExpand|scroll-expansion-hero|from \"@/components/sections/HeroSection\"|WorksHero" src
```

If only the unused files themselves match, delete the four files listed above.

```bash
rg -n "orange-|font-serif" src
```

Replace remaining hits with `accent` / sans headings. Do not edit `docs/` or `.cursor/`.

- [ ] **Step 4: Run full suite**

Run: `npm test`

Expected: all tests PASS (including `tests/db/getters.test.ts` unchanged behavior).

- [ ] **Step 5: Commit**

```bash
git add -A src tests
git commit -m "Remove unused heroes and leftover orange serif language"
```

---

## Manual verification (after Task 7)

Do not skip. Use the running Next.js app (`npm run dev`):

1. Home desktop: video full-screen, overlay name/role/Scroll, no glass card. Scroll pins then releases into identity → work index → services → stack → close CTA.
2. Home mobile 320 / 375 / 414 / 768: no horizontal scroll; nav hamburger; work rows stack.
3. Click Download CV → `/cv` toolbar Back + Download PDF, no tip text; print dialog via Download PDF.
4. Open a case study (`/works/sakti` or first project): hanging headings, mono metadata, CloseCta at bottom.
5. `/contact`: two columns, outlined submit, Netlify form fields intact.
6. `prefers-reduced-motion`: hero does not pin; page content reachable immediately.

---

## Self-review

**Spec coverage**

| Spec requirement | Task |
|---|---|
| Paper / ink / teal tokens, drop serif | 1 |
| Edge-min nav, Works → `#projects` | 2 |
| Full-screen video, pin/fade, no wheel-hijack, reduced motion | 3 |
| Identity strip, work index, services dl, stack groups, close CTA | 4 |
| Homepage static (no Reveal stagger) | 4 |
| Case study document + CloseCta | 5 |
| Contact two-column, outlined submit, Netlify unchanged | 6 |
| CV toolbar + print-spec document | 6 |
| Footer inline, 404 | 6 |
| Delete unused expand/hero files after zero imports | 7 |
| No orange-everywhere, no fake chrome, no invented metrics | 1–7 |
| Getters / routes / video assets preserved | all (no data edits) |

**Placeholder scan:** none remaining. Task 3 originally mentioned omitting a Reveal assertion then adding it in Task 4; that handoff is explicit.

**Type consistency:** `HeroVideoChapter({ children })`, `IdentityStrip()`, `CloseCta()`, section props match existing `Project` / `Service` / `StackGroup` types.
