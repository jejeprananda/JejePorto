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
const graphSource = readFileSync(
  join(root, "src/components/ui/contribution-graph.tsx"),
  "utf8",
);

describe("ScrollExpandMedia hero", () => {
  it("uses premium glassmorphism card styles without a photo", () => {
    assert.match(source, /premium-hero-card/);
    assert.match(source, /rgba\(255,255,255,0\.04\)/);
    assert.match(source, /blur\(24px\)/);
    assert.match(source, /rgba\(255,255,255,0\.12\)/);
    assert.match(source, /0 30px 80px rgba\(0,0,0,0\.25\)/);
    assert.doesNotMatch(source, /profile-big\.png/);
    assert.doesNotMatch(source, /CARD_AURORA_GRADIENT/);
  });

  it("uses premium glass content without right-side watermark", () => {
    assert.match(source, /premium-hero-card/);
    assert.match(source, /ContributionGraph/);
    assert.doesNotMatch(source, /\bJP\b/);
    assert.doesNotMatch(source, /w-\[42%\]/);
  });

  it("renders identity plus GitHub contribution graph", () => {
    assert.match(source, /Jessy/);
    assert.match(source, /Fullstack Developer/);
    assert.match(source, /from-\[#ff8a00\] to-\[#ff5e00\]/);
    assert.match(source, /ContributionGraph/);
    assert.match(graphSource, /GitHub Commit Activity/);
    assert.match(source, /monthsToShow={contributionMonths}/);
    assert.match(source, /contributionMonths = isMobileState \? 3 : 4/);
    assert.match(source, /mx-auto/);
    assert.match(graphSource, /monthsToShow/);
    assert.match(graphSource, /formatMonthsLabel/);
    assert.doesNotMatch(source, /Explore My Work/);
  });

  it("styles scroll-to-explore with a bouncing down arrow", () => {
    assert.match(source, /ArrowDown/);
    assert.match(source, /tracking-\[0\.28em\]/);
    assert.match(source, /animate-bounce/);
  });

  it("uses a wider premium desktop card while keeping mobile base size", () => {
    assert.match(source, /isMobileState \? 320 : 860/);
    assert.match(source, /isMobileState \? 520 : 440/);
  });

  it("reveals card video as scroll progresses", () => {
    assert.match(source, /opacity:\s*scrollProgress/);
    assert.match(source, /mediaVideoRef/);
    assert.match(source, /video\.play\(\)/);
    assert.match(source, /video\.pause\(\)/);
  });
});
