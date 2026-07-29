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

function heroShadowBlock(className: string) {
  const match = globalsSource.match(
    new RegExp(`\\.${className}\\s*\\{([\\s\\S]*?)\\}`),
  );
  return match?.[1] ?? "";
}

describe("Hero text contrast utilities", () => {
  it("defines strong, medium, and soft hero text-shadow classes", () => {
    assert.match(globalsSource, /\.hero-shadow-strong\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-medium\s*\{/);
    assert.match(globalsSource, /\.hero-shadow-soft\s*\{/);

    const strong = heroShadowBlock("hero-shadow-strong");
    assert.match(strong, /0 1px 2px rgb\(0 0 0 \/ 0\.55\)/);
    assert.match(strong, /0 4px 18px rgb\(0 0 0 \/ 0\.35\)/);

    const medium = heroShadowBlock("hero-shadow-medium");
    assert.match(medium, /0 1px 2px rgb\(0 0 0 \/ 0\.45\)/);
    assert.match(medium, /0 3px 12px rgb\(0 0 0 \/ 0\.28\)/);

    const soft = heroShadowBlock("hero-shadow-soft");
    assert.match(soft, /0 1px 2px rgb\(0 0 0 \/ 0\.4\)/);
    assert.match(soft, /0 2px 10px rgb\(0 0 0 \/ 0\.22\)/);
  });

  it("does not reintroduce video overlay gradients in HeroSection", () => {
    assert.doesNotMatch(heroSource, /bg-gradient-/);
  });

  it("uses full-bleed cover for the hero video including mobile", () => {
    assert.match(heroSource, /object-cover/);
    assert.match(heroSource, /object-center/);
    assert.doesNotMatch(heroSource, /object-contain/);
  });

  it("applies a thin mobile-only blur scrim for text contrast", () => {
    assert.match(heroSource, /bg-black\/20/);
    assert.match(heroSource, /backdrop-blur-\[2px\]/);
    assert.match(heroSource, /md:hidden/);
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
    assert.match(heroSource, /text-white\/90[\s\S]*?hero-shadow-soft/);
    assert.match(heroSource, /text-orange-500/);
  });

  it("frames Japanese and supporting copy for readability", () => {
    assert.match(heroSource, /bg-black\/30/);
    assert.match(heroSource, /backdrop-blur-\[3px\]/);
    assert.match(heroSource, /border-white\/20/);
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
