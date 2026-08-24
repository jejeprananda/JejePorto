import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Mobile spec-sheet layout", () => {
  it("exports a cover viewport so iOS safe-area insets apply", () => {
    const layout = read("src/app/layout.tsx");
    assert.match(layout, /export const viewport/);
    assert.match(layout, /viewportFit:\s*"cover"/);
  });

  it("uses a paper navbar on light pages so scrolled content is not covered", () => {
    const nav = read("src/components/layout/Navbar.tsx");
    const hero = read("src/components/sections/HeroVideoChapter.tsx");
    assert.match(nav, /lightOnDark/);
    assert.match(nav, /bg-paper/);
    assert.match(nav, /bg-transparent/);
    assert.match(nav, /hero-video-pin/);
    assert.match(nav, /getBoundingClientRect/);
    assert.match(hero, /id="hero-video-pin"/);
  });

  it("uses safe-area padding on chrome and hero overlay", () => {
    const nav = read("src/components/layout/Navbar.tsx");
    const footer = read("src/components/layout/SiteFooter.tsx");
    const hero = read("src/components/sections/HeroVideoChapter.tsx");

    assert.match(nav, /safe-area-inset-top/);
    assert.match(footer, /safe-area-inset-bottom/);
    assert.match(hero, /safe-area-inset-bottom/);
  });

  it("stacks CV toolbar actions on small screens", () => {
    const toolbar = read("src/components/cv/CvToolbar.tsx");
    assert.match(toolbar, /flex-col/);
    assert.match(toolbar, /sm:flex-row/);
    assert.match(toolbar, /w-full/);
  });

  it("keeps work rows on a minmax grid without overflow", () => {
    const projects = read("src/components/sections/ProjectsSection.tsx");
    assert.match(projects, /minmax\(0,1fr\)/);
    assert.match(projects, /min-w-0/);
  });
});
