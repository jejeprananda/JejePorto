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
    assert.match(source, /from "@\/components\/shared\/Reveal"/);
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
