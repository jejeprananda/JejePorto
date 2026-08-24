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
    assert.match(source, /transition-\[opacity,translate,scale\]/);
    assert.doesNotMatch(source, /transition-\[opacity,transform\]/);
    assert.doesNotMatch(source, /function prefersReducedMotion/);
    assert.match(source, /data-reveal/);
  });
});

describe("Works page redirect", () => {
  it("redirects /works to the combined home page", () => {
    const page = read("src/app/works/page.tsx");

    assert.match(page, /from "next\/navigation"/);
    assert.match(page, /redirect\("\/"\)/);
    assert.doesNotMatch(page, /WorksHero/);
    assert.doesNotMatch(page, /ProjectsSection/);
  });
});

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
