import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
