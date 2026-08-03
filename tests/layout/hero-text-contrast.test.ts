import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const globalsSource = readFileSync(
  join(root, "src/app/globals.css"),
  "utf8",
);
const heroSource = readFileSync(
  join(root, "src/components/sections/HeroSection.tsx"),
  "utf8",
);

describe("Hero text contrast utilities", () => {
  it("does not define hero text-shadow utility classes", () => {
    assert.doesNotMatch(globalsSource, /\.hero-shadow-strong\s*\{/);
    assert.doesNotMatch(globalsSource, /\.hero-shadow-medium\s*\{/);
    assert.doesNotMatch(globalsSource, /\.hero-shadow-soft\s*\{/);
  });

  it("does not reintroduce video overlay gradients in HeroSection", () => {
    assert.doesNotMatch(heroSource, /bg-gradient-/);
  });

  it("uses full-bleed cover for the hero video including mobile", () => {
    assert.match(heroSource, /object-cover/);
    assert.match(heroSource, /object-center/);
    assert.doesNotMatch(heroSource, /object-contain/);
  });

  it("does not apply a mobile blur scrim over the hero video", () => {
    assert.doesNotMatch(heroSource, /bg-black\/20/);
    assert.doesNotMatch(heroSource, /backdrop-blur-\[2px\]/);
  });

  it("does not apply text-shadow utilities on hero copy", () => {
    assert.doesNotMatch(heroSource, /hero-shadow-/);
    assert.match(heroSource, /text-purple-950/);
  });

  it("does not frame Japanese and supporting copy", () => {
    assert.doesNotMatch(heroSource, /bg-black\/30/);
    assert.doesNotMatch(heroSource, /backdrop-blur-\[3px\]/);
    assert.doesNotMatch(heroSource, /border-white\/20/);
  });
});
