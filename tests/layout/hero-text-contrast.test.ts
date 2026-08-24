import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const source = readFileSync(
  join(root, "src/components/sections/HeroVideoChapter.tsx"),
  "utf8",
);

describe("HeroVideoChapter overlay", () => {
  it("uses a dimming ink overlay instead of a glass card", () => {
    assert.match(source, /bg-ink/);
    assert.match(source, /text-white/);
    assert.doesNotMatch(source, /premium-hero-card/);
    assert.doesNotMatch(source, /blur\(24px\)/);
    assert.doesNotMatch(source, /from-\[#ff8a00\]/);
    assert.doesNotMatch(source, /profile-big\.png/);
  });
});
