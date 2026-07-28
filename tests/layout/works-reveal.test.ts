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

describe("WorksHero", () => {
  it("choreographs background, vertical line, and text on mount", () => {
    const source = read("src/components/sections/WorksHero.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function WorksHero/);
    assert.match(source, /from "@\/components\/shared\/Reveal"/);
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
    assert.match(page, /from "@\/components\/sections\/WorksHero"/);
    assert.doesNotMatch(page, /bg-hero\.png/);
  });
});

describe("ProjectsSection reveals", () => {
  it("wraps header and rows with scroll Reveal", () => {
    const source = read("src/components/sections/ProjectsSection.tsx");

    assert.match(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
  });
});

describe("ServicesSection reveals", () => {
  it("wraps header and cards with scroll Reveal", () => {
    const source = read("src/components/sections/ServicesSection.tsx");

    assert.match(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
    assert.match(source, /ServiceDetailModal/);
    assert.match(source, /className="h-full"/);
    assert.match(source, /group flex h-full min-h-\[360px\]/);
  });
});

describe("StackSection and Works CTA reveals", () => {
  it("wraps stack header and groups with scroll Reveal", () => {
    const source = read("src/components/sections/StackSection.tsx");

    assert.match(source, /from "@\/components\/shared\/Reveal"/);
    assert.match(source, /trigger="scroll"/);
    assert.match(source, /direction="up"/);
    assert.match(source, /120 \+ index \* 80|120 \+ index\*80/);
  });

  it("reveals CTA copy then contact button", () => {
    const page = read("src/app/works/page.tsx");

    assert.match(page, /from "@\/components\/shared\/Reveal"/);
    assert.match(page, /Start a project/);
    assert.match(page, /delay=\{100\}/);
    assert.match(page, /Contact Me/);
  });
});
