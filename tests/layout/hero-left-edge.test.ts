import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const source = readFileSync(
  join(root, "src/components/ui/scroll-expansion-hero.tsx"),
  "utf8",
);

describe("ScrollExpandMedia layout", () => {
  it("centers the expanding media stage in the viewport", () => {
    assert.match(source, /top-1\/2/);
    assert.match(source, /left-1\/2/);
    assert.match(source, /translate\(-50%, -50%\)/);
    assert.match(source, /maxWidth:\s*"95vw"/);
  });

  it("exports ScrollExpandMedia as the default UI component", () => {
    assert.match(source, /export default ScrollExpandMedia/);
    assert.match(source, /"use client"/);
  });
});
