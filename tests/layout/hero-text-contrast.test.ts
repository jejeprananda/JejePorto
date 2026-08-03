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
    assert.match(source, /h-px w-full bg-white/);
    assert.doesNotMatch(source, /\bJP\b/);
    assert.doesNotMatch(source, /w-\[42%\]/);
  });

  it("renders the premium typography hierarchy", () => {
    assert.match(source, /Hello, I&apos;m/);
    assert.match(source, /font-bold text-white/);
    assert.match(source, /from-\[#ff8a00\] to-\[#ff5e00\]/);
    assert.doesNotMatch(source, /Explore My Work/);
    assert.match(source, /Building digital experiences/);
  });

  it("styles scroll-to-explore with a bouncing down arrow", () => {
    assert.match(source, /ArrowDown/);
    assert.match(source, /tracking-\[0\.28em\]/);
    assert.match(source, /y:\s*\[0,\s*6,\s*0\]/);
  });

  it("uses a wider premium desktop card while keeping mobile base size", () => {
    assert.match(source, /isMobileState \? 320 : 700/);
    assert.match(source, /isMobileState \? 480 : 420/);
  });

  it("reveals card video as scroll progresses", () => {
    assert.match(source, /opacity:\s*scrollProgress/);
    assert.match(source, /mediaVideoRef/);
    assert.match(source, /video\.play\(\)/);
    assert.match(source, /video\.pause\(\)/);
  });
});
