# Home Hero Mount Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mount entrance animations on the home (About) hero: background, vertical line, text, CTAs, and individually staggered social icons.

**Architecture:** Convert `HeroSection` into a client island wrapping pieces with shared `Reveal` (`trigger="mount"`), matching `WorksHero`. Keep `src/app/page.tsx` as a server page; add the same `[data-reveal]` noscript fallback used on Works.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, existing `Reveal`, Node test runner (`tsx --test`) source-contract tests

## Global Constraints

- No new runtime animation libraries
- Do not modify or delete `src/components/projects/FadeIn.tsx`
- Do not change Works page behavior except by reusing existing `Reveal` APIs
- Hero uses `trigger="mount"` only (no scroll reveals on home)
- Preserve all existing copy, classes, `id="hero-title"`, social `aria-label`s, and link targets
- Respect reduced motion via existing `Reveal` `motion-reduce:` classes
- Spec source: `docs/superpowers/specs/2026-07-28-home-hero-animations-design.md`

---

## File structure

| Path | Responsibility |
|---|---|
| `src/components/sections/HeroSection.tsx` | Client hero with mount choreography |
| `src/app/page.tsx` | Server page: metadata + noscript fallback + `HeroSection` |
| `tests/layout/home-hero-reveal.test.ts` | Source-contract tests for hero wiring + page boundary |

---

### Task 1: Contract tests + animate `HeroSection`

**Files:**
- Create: `tests/layout/home-hero-reveal.test.ts`
- Modify: `src/components/sections/HeroSection.tsx`
- Test: `tests/layout/home-hero-reveal.test.ts`

**Interfaces:**
- Consumes: `Reveal` from `@/components/shared/Reveal` (`trigger`, `direction`, `delay`, `duration`, `distance`)
- Produces: `export function HeroSection(): JSX.Element` — same visuals as today, with mount animations

- [ ] **Step 1: Write the failing contract test**

Create `tests/layout/home-hero-reveal.test.ts`:

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

describe("HeroSection mount reveals", () => {
  it("choreographs background, line, text, CTAs, and staggered socials on mount", () => {
    const source = read("src/components/sections/HeroSection.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function HeroSection/);
    assert.match(source, /from "@/components\/shared\/Reveal"/);
    assert.match(source, /trigger="mount"/);
    assert.match(source, /direction="right"/);
    assert.match(source, /direction="scaleY"/);
    assert.match(source, /direction="left"/);
    assert.match(source, /distance="wide"/);
    assert.match(source, /hero-title/);
    assert.match(source, /bg-hero\.png/);
    assert.match(source, /760 \+ index \* 70|760 \+ index\*70/);
    assert.match(source, /delay=\{600\}/);
    assert.match(source, /delay=\{680\}/);
  });
});

describe("Home page boundary", () => {
  it("keeps server metadata and adds data-reveal noscript fallback", () => {
    const page = read("src/app/page.tsx");

    assert.match(page, /export const metadata/);
    assert.doesNotMatch(page, /"use client"/);
    assert.match(page, /HeroSection/);
    assert.match(page, /<noscript>/);
    assert.match(page, /\[data-reveal\]/);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
npm test -- tests/layout/home-hero-reveal.test.ts
```

Expected: FAIL — `HeroSection` lacks `"use client"` / `Reveal`; page lacks noscript.

- [ ] **Step 3: Implement `HeroSection` mount choreography**

Update `src/components/sections/HeroSection.tsx`:

1. Add `"use client";` as the first line.
2. Add: `import { Reveal } from "@/components/shared/Reveal";`
3. Keep icon helpers, `SocialLink` type, and `socialLinks` array unchanged.
4. Replace the section body so animated pieces are wrapped as follows (preserve all existing class strings and content):

```tsx
export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate min-h-dvh w-full overflow-hidden bg-[#f5f6f7]"
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
            className="
              object-cover
              object-[68%_center]
              sm:object-[64%_center]
              md:object-[60%_center]
              lg:object-center
            "
          />
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-gradient-to-r
              from-white
              via-white/90
              to-white/10
              sm:via-white/75
              lg:from-white/95
              lg:via-white/45
              lg:to-transparent
            "
          />
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-gradient-to-b
              from-white/75
              via-white/20
              to-white/10
              lg:from-white/40
              lg:via-transparent
            "
          />
        </div>
      </Reveal>

      <div
        className="
          flex min-h-dvh w-full
          items-center
          pl-5 pr-5 pb-14 pt-28
          sm:pl-4 sm:pr-8 sm:pb-16 sm:pt-32
          lg:pb-20 lg:pt-36
        "
      >
        <div className="w-full max-w-[760px]">
          <div className="flex gap-5 sm:gap-8">
            <Reveal
              trigger="mount"
              direction="scaleY"
              delay={150}
              duration={700}
              className="
                relative hidden w-px shrink-0 self-stretch overflow-hidden
                bg-slate-900/80
                sm:block
              "
              aria-hidden="true"
            >
              {/* If Reveal does not forward aria-hidden, put aria-hidden on an inner wrapper:
                  <div aria-hidden="true" className="relative h-full w-px">...</div>
                  Prefer keeping aria-hidden on the decorative line tree. */}
              <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
            </Reveal>

            <div className="min-w-0">
              <Reveal trigger="mount" direction="left" delay={200} duration={700}>
                <p
                  className="
                    text-3xl font-light leading-none tracking-[-0.035em]
                    text-slate-800
                    sm:text-4xl
                    lg:text-[2.65rem]
                  "
                >
                  Hi, I&apos;m
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={280} duration={700}>
                <h1
                  id="hero-title"
                  className="
                    mt-4 max-w-[760px]
                    text-[clamp(3.3rem,7.2vw,6rem)]
                    font-semibold leading-[0.88]
                    tracking-[-0.065em]
                    text-slate-950
                  "
                >
                  Jessy{" "}
                  <span className="text-orange-500">Prananda</span>
                </h1>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={360} duration={700}>
                <p
                  className="
                    mt-5 text-2xl font-semibold
                    tracking-[-0.035em]
                    text-slate-950
                    sm:text-3xl
                    lg:text-[2.35rem]
                  "
                >
                  Fullstack Developer
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={440} duration={700}>
                <p
                  lang="ja"
                  className="
                    mt-9 max-w-xl
                    text-sm font-medium leading-7
                    tracking-[0.08em]
                    text-slate-600
                    sm:text-base sm:leading-8
                    lg:text-lg
                  "
                >
                  デザインとコードで、アイデアをカタチにする。
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={520} duration={700}>
                <p
                  className="
                    mt-3 max-w-xl
                    text-sm leading-7 text-slate-600
                    sm:text-base
                  "
                >
                  I design thoughtful interfaces and build them into fast,
                  functional, and scalable digital products.
                </p>
              </Reveal>

              <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
                <Reveal trigger="mount" direction="left" delay={600} duration={700}>
                  <Link
                    href="/works"
                    className="
                      inline-flex min-h-12 items-center justify-center
                      rounded-sm bg-slate-950 px-6
                      text-sm font-medium text-white
                      transition duration-300
                      hover:-translate-y-0.5 hover:bg-slate-800
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                      focus-visible:ring-offset-2
                    "
                  >
                    View My Work
                  </Link>
                </Reveal>

                <Reveal trigger="mount" direction="left" delay={680} duration={700}>
                  <Link
                    href="/contact"
                    className="
                      inline-flex min-h-12 items-center justify-center
                      rounded-sm border border-slate-900/20
                      bg-white/45 px-6
                      text-sm font-medium text-slate-900
                      backdrop-blur-sm
                      transition duration-300
                      hover:-translate-y-0.5
                      hover:border-orange-500
                      hover:bg-white/80
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                      focus-visible:ring-offset-2
                    "
                  >
                    Contact Me
                  </Link>
                </Reveal>
              </div>

              <nav aria-label="Social media" className="mt-8 sm:mt-10">
                <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {socialLinks.map((socialLink, index) => {
                    const Icon = socialLink.icon;
                    const isExternal = socialLink.href.startsWith("http");

                    return (
                      <li key={socialLink.label}>
                        <Reveal
                          trigger="mount"
                          direction="left"
                          delay={760 + index * 70}
                          duration={700}
                        >
                          <Link
                            href={socialLink.href}
                            aria-label={socialLink.label}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            className="
                              inline-flex size-11 items-center justify-center
                              rounded-full text-slate-700
                              transition duration-300
                              hover:-translate-y-1
                              hover:bg-white/60
                              hover:text-orange-500
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-orange-500
                            "
                          >
                            <Icon className="size-5" />
                          </Link>
                        </Reveal>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Important notes:
- Move overlays inside the background `Reveal` (remove their separate `-z-20` siblings that sat outside the animated wrapper).
- Vertical line: if `Reveal` does not accept `aria-hidden`, wrap children in `<div aria-hidden="true" className="relative h-full w-full">…</div>` and keep Reveal’s `self-stretch` classes.
- Do not change `socialLinks` data or icon components.

- [ ] **Step 4: Add noscript fallback on the home page**

Update `src/app/page.tsx` to:

```tsx
import type { Metadata } from "next";

import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jessy Prananda — Fullstack Designer. Portfolio home and introduction.",
};

export default function HomePage() {
  return (
    <main>
      <noscript>
        <style>{`
          [data-reveal] {
            opacity: 1 !important;
            translate: 0 0 !important;
            scale: 1 1 !important;
            transition: none !important;
          }
        `}</style>
      </noscript>
      <HeroSection />
    </main>
  );
}
```

Keep `export const metadata` and do not add `"use client"`.

- [ ] **Step 5: Run tests**

```bash
npm test -- tests/layout/home-hero-reveal.test.ts
npm test
npm run lint -- src/components/sections/HeroSection.tsx src/app/page.tsx
```

Expected: all PASS / lint exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/app/page.tsx tests/layout/home-hero-reveal.test.ts
git commit -m "$(cat <<'EOF'
feat: animate home hero on mount with Reveal

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Client `HeroSection` island | Task 1 |
| Background `right` / wide slide | Task 1 |
| Line `scaleY` @ 150ms | Task 1 |
| Text stagger 200→520 | Task 1 |
| CTA delays 600 / 680 | Task 1 |
| Social `760 + index * 70` | Task 1 |
| Server page + metadata | Task 1 |
| Noscript `[data-reveal]` | Task 1 |
| Contract tests | Task 1 |
| No new libs / leave FadeIn | Global constraints |

## Out of scope (do not implement)

- Works page changes
- Migrating `FadeIn`
- Scroll-triggered home sections
- Replay-on-reenter / parallax
