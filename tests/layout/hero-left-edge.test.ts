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

describe("HeroVideoChapter layout", () => {
  it("fills the viewport and left-aligns overlay copy", () => {
    assert.match(source, /h-svh|h-dvh|h-screen/);
    assert.match(source, /object-cover/);
    assert.match(source, /px-5/);
    assert.doesNotMatch(source, /top-1\/2/);
    assert.doesNotMatch(source, /translate\(-50%, -50%\)/);
  });
});
