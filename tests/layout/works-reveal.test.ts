import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Reveal component", () => {
  it("exists as a client component with mount/scroll triggers and directions", () => {
    const source = read("src/components/shared/Reveal.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /export function Reveal/);
    assert.match(source, /trigger/);
    assert.match(source, /"mount"/);
    assert.match(source, /"scroll"/);
    assert.match(source, /"left"/);
    assert.match(source, /"right"/);
    assert.match(source, /"up"/);
    assert.match(source, /"scaleY"/);
    assert.match(source, /IntersectionObserver/);
    assert.match(source, /prefers-reduced-motion|motion-reduce/);
    assert.match(source, /threshold:\s*0\.12/);
    assert.match(source, /0px 0px -40px 0px/);
  });
});
