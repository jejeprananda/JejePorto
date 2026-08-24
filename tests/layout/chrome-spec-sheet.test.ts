import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Site chrome", () => {
  it("mounts an inline footer from the root layout", () => {
    const layout = read("src/app/layout.tsx");
    const footer = read("src/components/layout/SiteFooter.tsx");

    assert.match(layout, /SiteFooter/);
    assert.match(footer, /Jessy Prananda/);
    assert.match(footer, /href="\/contact"/);
    assert.match(footer, /href="\/cv"/);
    assert.doesNotMatch(footer, /orange-/);
  });

  it("styles contact as a two-column spec sheet without orange", () => {
    const section = read("src/components/sections/ContactSection.tsx");
    const form = read("src/components/shared/ContactForm.tsx");
    assert.doesNotMatch(section, /orange-/);
    assert.doesNotMatch(form, /orange-/);
    assert.match(form, /ring-accent/);
  });

  it("keeps CV toolbar print download without orange", () => {
    const toolbar = read("src/components/cv/CvToolbar.tsx");
    const doc = read("src/components/cv/CvDocument.tsx");
    assert.match(toolbar, /window\.print/);
    assert.doesNotMatch(toolbar, /orange-/);
    assert.doesNotMatch(doc, /font-serif/);
    assert.doesNotMatch(doc, /orange-/);
  });

  it("styles 404 with tokens", () => {
    const page = read("src/app/not-found.tsx");
    assert.match(page, /text-accent/);
    assert.doesNotMatch(page, /orange-/);
    assert.doesNotMatch(page, /rounded-full/);
  });
});
