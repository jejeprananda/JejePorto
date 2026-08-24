import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

const files = [
  "src/components/projects/Hero.tsx",
  "src/components/projects/Overview.tsx",
  "src/components/projects/Challenges.tsx",
  "src/components/projects/Features.tsx",
  "src/components/projects/Stack.tsx",
  "src/components/projects/Results.tsx",
  "src/components/projects/Gallery.tsx",
  "src/components/projects/Timeline.tsx",
  "src/components/projects/InfoGrid.tsx",
  "src/components/projects/FooterCTA.tsx",
  "src/components/projects/RelatedProjects.tsx",
  "src/components/projects/SectionShell.tsx",
];

describe("Case study spec sheet", () => {
  it("drops serif, orange, and card chrome", () => {
    for (const file of files) {
      const source = read(file);
      assert.doesNotMatch(source, /font-serif/, file);
      assert.doesNotMatch(source, /orange-/, file);
      assert.doesNotMatch(source, /rounded-xl/, file);
    }
  });

  it("reuses CloseCta at the end of a case study", () => {
    const footer = read("src/components/projects/FooterCTA.tsx");
    assert.match(footer, /CloseCta/);
    assert.match(footer, /\/#projects/);
  });
});
