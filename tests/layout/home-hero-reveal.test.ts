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
