import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const heroSource = readFileSync(
  join(root, "src/components/sections/HeroSection.tsx"),
  "utf8",
);

describe("HeroSection left-edge layout", () => {
  it("uses asymmetric left/right padding without centered max-width container", () => {
    assert.match(heroSource, /\bpl-5\b/);
    assert.match(heroSource, /\bsm:pl-4\b/);
    assert.match(heroSource, /\bpr-5\b/);
    assert.match(heroSource, /\bsm:pr-8\b/);

    assert.doesNotMatch(
      heroSource,
      /mx-auto flex min-h-dvh w-full max-w-\[1440px\]/,
    );
    assert.doesNotMatch(
      heroSource,
      /px-5 pb-14 pt-28[\s\S]*sm:px-8[\s\S]*lg:px-12[\s\S]*xl:px-16/,
    );
  });

  it("keeps the inner text column max width", () => {
    assert.match(heroSource, /max-w-\[760px\]/);
  });
});
