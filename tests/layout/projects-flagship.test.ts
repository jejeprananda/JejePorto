import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const projectsSectionSource = readFileSync(
  join(root, "src/components/sections/ProjectsSection.tsx"),
  "utf8",
);

describe("ProjectsSection flagship badge", () => {
  it("uses isFlagship for badge markup without slug hardcoding", () => {
    assert.match(projectsSectionSource, /\bisFlagship\b/);
    assert.match(projectsSectionSource, /Flagship/);
    assert.doesNotMatch(projectsSectionSource, /slug === "sakti"/);
    assert.doesNotMatch(projectsSectionSource, /slug === 'sakti'/);
  });
});
