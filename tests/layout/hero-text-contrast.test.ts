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
  it("defines strong, medium, and soft hero text-shadow classes", () => {
    assert.match(globalsSource, /\.hero-shadow-strong\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-medium\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-soft\s*\{/);

    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.55\)/);
    assert.match(globalsSource, /0 4px 18px rgb\(0 0 0 \/ 0\.35\)/);
    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.45\)/);
    assert.match(globalsSource, /0 3px 12px rgb\(0 0 0 \/ 0\.28\)/);
    assert.match(globalsSource, /0 1px 2px rgb\(0 0 0 \/ 0\.4\)/);
    assert.match(globalsSource, /0 2px 10px rgb\(0 0 0 \/ 0\.22\)/);
  });

  it("does not reintroduce video overlay gradients in HeroSection", () => {
    assert.doesNotMatch(heroSource, /bg-gradient-to-r/);
    assert.doesNotMatch(heroSource, /bg-gradient-to-b/);
    assert.doesNotMatch(heroSource, /from-white/);
  });

  it("applies shadow utilities by hierarchy on hero copy", () => {
    assert.match(heroSource, /id="hero-title"[\s\S]*?hero-shadow-strong/);
    assert.match(
      heroSource,
      /mt-5 text-2xl font-semibold[\s\S]*?hero-shadow-medium/,
    );
    assert.match(
      heroSource,
      /text-3xl font-light leading-none tracking-\[-0\.035em\][\s\S]*?hero-shadow-soft/,
    );
    assert.match(heroSource, /text-white\/80[\s\S]*?hero-shadow-soft/);
    assert.match(heroSource, /text-orange-500/);
  });

  it("applies soft shadow to secondary CTA and social icons", () => {
    assert.match(
      heroSource,
      /href="\/contact"[\s\S]*?className="[\s\S]*?hero-shadow-soft/,
    );
    assert.match(
      heroSource,
      /aria-label=\{socialLink\.label\}[\s\S]*?className="[\s\S]*?hero-shadow-soft/,
    );
  });
});
