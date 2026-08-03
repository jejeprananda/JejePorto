import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("HomeScrollExpand", () => {
  it("mounts ScrollExpandMedia with local hero video assets", () => {
    const source = read("src/components/sections/HomeScrollExpand.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function HomeScrollExpand/);
    assert.match(
      source,
      /from "@\/components\/ui\/scroll-expansion-hero"/,
    );
    assert.match(source, /mediaType="video"/);
    assert.match(source, /\/videos\/hero\.mp4/);
    assert.match(source, /\/images\/hero-poster\.jpg/);
    assert.match(source, /\/videos\/hero-bg\.mp4/);
    assert.match(source, /Jessy Prananda/);
    assert.match(source, /Fullstack Developer/);
    assert.match(source, /Scroll to explore/);
    assert.doesNotMatch(source, /motto/);
  });
});

describe("Home page boundary", () => {
  it("keeps server metadata and composes expand hero with works sections", () => {
    const page = read("src/app/page.tsx");

    assert.match(page, /export const metadata/);
    assert.doesNotMatch(page, /"use client"/);
    assert.match(page, /absolute:\s*"Jessy Prananda Ismail"/);
    assert.match(page, /HomeScrollExpand/);
    assert.match(page, /ProjectsSection/);
    assert.match(page, /ServicesSection/);
    assert.match(page, /StackSection/);
    assert.match(page, /Start a project/);
    assert.match(page, /<noscript>/);
    assert.match(page, /\[data-reveal\]/);
  });
});
