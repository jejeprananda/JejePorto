import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("ContactForm Netlify Forms wiring", () => {
  it("posts form-name contact to __forms.html", () => {
    const source = readFileSync(
      join(root, "src/components/shared/ContactForm.tsx"),
      "utf8",
    );

    assert.match(source, /"form-name":\s*"contact"/);
    assert.match(source, /fetch\(\s*"\/__forms\.html"/);
    assert.match(source, /Thanks — your message was sent\./);
    assert.doesNotMatch(
      source,
      /Sending messages will be wired up later/,
    );
  });

  it("registers the contact form for Netlify detection", () => {
    const html = readFileSync(join(root, "public/__forms.html"), "utf8");

    assert.match(html, /name="contact"/);
    assert.match(html, /\bnetlify\b/);
    assert.match(html, /netlify-honeypot="bot-field"/);
    assert.match(html, /name="name"/);
    assert.match(html, /name="email"/);
    assert.match(html, /name="message"/);
  });
});
