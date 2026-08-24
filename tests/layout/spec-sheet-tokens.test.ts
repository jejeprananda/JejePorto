import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
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
